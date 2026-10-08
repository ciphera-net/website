/**
 * The `ciphera_menu` transform, extracted pure (M2, WEB-28 §4.2.2).
 *
 * Design: Public/docs/plans/08-10-2026-web28-menus-footers-draft.md §4.2.2
 *
 * 🔑 ONE TRANSFORM, TWO CALLERS, SAME SHAPE AS `page-build.ts`: `scripts/cms-publisher.ts`
 * calls `buildMenus()` to produce the per-location CDN documents; the draft preview route
 * calls `buildMenuDocument()` on a single node so an editor sees their draft regardless of
 * whether it would pass publish-time gates.
 *
 * 🔴 WORDPRESS ALREADY CARRIES THE WHOLE DOCUMENT AS ONE STRING. `cipheraMenu` (GraphQL)
 * is a JSON-encoded object the block editor's save path assembles from the `ciphera/menu-group`
 * and `ciphera/menu-brand` blocks — this module treats it as untrusted wire data, the same
 * conviction as `page-build.ts`'s `cipheraSections`: never throw past one bad row, repair or
 * drop whatever does not match the contract shape.
 */
import type { ContentRepairEntry } from '../content-repair-types'

export const MENU_REPAIR_TYPE = 'menu'

export const MENU_LOCATIONS = ['header', 'footer'] as const
export type MenuLocation = (typeof MENU_LOCATIONS)[number]

export function isMenuLocation(v: unknown): v is MenuLocation {
  return v === 'header' || v === 'footer'
}

export const SOCIAL_ICONS = ['github', 'linkedin', 'x', 'discord'] as const
export type SocialIcon = (typeof SOCIAL_ICONS)[number]

/**
 * A menu item's href shape (contract): "a same-site path ... or an absolute https URL
 * (cross-site ... or external)". Unlike `page-build.ts`'s `SAFE_HREF_RE`, a bare `#anchor`
 * is NOT allowed here — "'#anchor' not allowed at top level" is the contract's own words;
 * the Features panel is the one place an anchor lives, and it stays code.
 */
export const MENU_HREF_RE = /^(https:\/\/[^\s"]+|\/(?!\/)[^\s"]*)$/

export function isValidMenuHref(href: string): boolean {
  return MENU_HREF_RE.test(href)
}

export interface MenuItem {
  label: string
  href: string
  description: string
  /** A key from a fixed per-site list (empty string for none). Validated against
   * `allowedMedia`, dropped (never the item) on an unknown key. */
  media: string
}

export type MenuGroupSource = 'manual' | `registry:${string}`

export interface MenuGroup {
  label: string
  source: MenuGroupSource
  note?: { text: string; href: string }
  items: MenuItem[]
}

export interface MenuBrandSocial {
  icon: SocialIcon
  href: string
}

export interface MenuBrand {
  name: string
  blurb: string
  social: MenuBrandSocial[]
}

/** header/footer only (contract) — undefined on a (hypothetical future) location that
 * carries no brand block. */
export interface MenuDocument {
  location: MenuLocation
  brand?: MenuBrand
  groups: MenuGroup[]
}

export interface WpMenuNode {
  databaseId: number | null
  cipheraMenuLocation: string | null
  /** JSON-encoded `{ brand?, groups }` — see this file's header for what produced it. */
  cipheraMenu: string | null
  modifiedGmt: string | null
  routeSites?: { nodes: { slug: string }[] }
}

export interface MenuBuildOptions {
  /** A relative path the site can actually serve — a coded route prefix OR a currently
   * published CMS page. Contract: "a same-site path must be a route the site serves
   * (coded routes, published pages) else the item is dropped with a repair". */
  isKnownPath: (path: string) => boolean
  /** The media keys this site's renderer knows how to resolve. Contract: "unknown media
   * key dropped (item kept), '' for none". */
  allowedMedia: ReadonlySet<string>
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

function hrefOk(href: string, opts: MenuBuildOptions): boolean {
  if (!isValidMenuHref(href)) return false
  if (href.startsWith('/')) return opts.isKnownPath(href)
  return true // https:// — cross-site or external, nothing further to check here
}

function buildItem(
  raw: unknown,
  opts: MenuBuildOptions,
  repair: (field: string, action: ContentRepairEntry['action'], detail: string) => void
): MenuItem | null {
  if (typeof raw !== 'object' || raw === null) {
    repair('items', 'skipped', 'dropped a menu item that was not an object')
    return null
  }
  const e = raw as Record<string, unknown>
  const label = str(e.label).trim()
  if (!label) {
    repair('items', 'skipped', 'dropped a menu item with no label')
    return null
  }
  const href = str(e.href).trim()
  if (!hrefOk(href, opts)) {
    repair('items', 'skipped', `dropped item "${label}" — href "${href}" is not a known route or an https URL`)
    return null
  }
  let media = str(e.media).trim()
  if (media && !opts.allowedMedia.has(media)) {
    repair('items', 'repaired', `item "${label}": unknown media key "${media}" — dropped the icon, kept the item`)
    media = ''
  }
  return { label, href, description: str(e.description), media }
}

function buildNote(raw: unknown, opts: MenuBuildOptions, repair: (field: string, action: ContentRepairEntry['action'], detail: string) => void): { text: string; href: string } | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined
  const e = raw as Record<string, unknown>
  const text = str(e.text).trim()
  const href = str(e.href).trim()
  if (!text || !href) return undefined
  if (!hrefOk(href, opts)) {
    repair('note', 'repaired', `group note's href "${href}" is not a known route or an https URL — note dropped`)
    return undefined
  }
  return { text, href }
}

function buildGroup(
  raw: unknown,
  opts: MenuBuildOptions,
  repair: (field: string, action: ContentRepairEntry['action'], detail: string) => void
): MenuGroup | null {
  if (typeof raw !== 'object' || raw === null) {
    repair('groups', 'skipped', 'dropped a menu group that was not an object')
    return null
  }
  const e = raw as Record<string, unknown>
  const label = str(e.label).trim()
  if (!label) {
    repair('groups', 'skipped', 'dropped a menu group with no label')
    return null
  }
  const rawSource = str(e.source).trim()
  const source: MenuGroupSource = rawSource === 'manual' || rawSource.startsWith('registry:') ? (rawSource as MenuGroupSource) : 'manual'
  if (rawSource && source === 'manual' && rawSource !== 'manual') {
    repair('source', 'repaired', `group "${label}": unknown source "${rawSource}" — treated as manual`)
  }
  const note = buildNote(e.note, opts, repair)

  // A registry-sourced group's items are filled by the SITE at render time from its own
  // registry (contract: "the CMS row carries none") — whatever the editor saved here is
  // not the live item list, so it is discarded rather than risked as stale duplicate rows.
  if (source !== 'manual') {
    return { label, source, note, items: [] }
  }

  const rawItems = Array.isArray(e.items) ? e.items : []
  const items: MenuItem[] = []
  for (const it of rawItems) {
    const item = buildItem(it, opts, repair)
    if (item) items.push(item)
  }
  return { label, source, note, items }
}

/**
 * One node's CONTENT — brand + groups — for the ONE caller that must render a draft
 * regardless of anything else wrong with it: the preview route. Mirrors
 * `page-build.ts`'s `buildPageDocument()` (same reasoning: path/location gating is the
 * publisher's and review queue's concern, not a reason to render nothing).
 */
export function buildMenuDocument(
  n: WpMenuNode,
  opts: MenuBuildOptions,
  repair: (field: string, action: ContentRepairEntry['action'], detail: string) => void
): MenuDocument {
  const location: MenuLocation = isMenuLocation(n.cipheraMenuLocation) ? n.cipheraMenuLocation : 'header'
  if (!isMenuLocation(n.cipheraMenuLocation)) {
    repair('location', 'repaired', `menu location "${String(n.cipheraMenuLocation)}" is not header/footer — treated as header`)
  }

  let raw: unknown
  try {
    raw = JSON.parse(n.cipheraMenu ?? '{}')
  } catch {
    repair('document', 'flagged', 'cipheraMenu was not valid JSON — rendered with no groups')
    raw = {}
  }
  const e = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {}

  let brand: MenuBrand | undefined
  if (typeof e.brand === 'object' && e.brand !== null) {
    const b = e.brand as Record<string, unknown>
    const social: MenuBrandSocial[] = []
    for (const s of Array.isArray(b.social) ? b.social : []) {
      if (typeof s !== 'object' || s === null) continue
      const se = s as Record<string, unknown>
      const icon = str(se.icon)
      const href = str(se.href).trim()
      if (!SOCIAL_ICONS.includes(icon as SocialIcon)) {
        repair('brand.social', 'repaired', `unknown social icon "${icon}" — dropped`)
        continue
      }
      if (!isValidMenuHref(href)) {
        repair('brand.social', 'repaired', `social link "${icon}" has an invalid href — dropped`)
        continue
      }
      social.push({ icon: icon as SocialIcon, href })
    }
    brand = { name: str(b.name), blurb: str(b.blurb), social }
  }

  const rawGroups = Array.isArray(e.groups) ? e.groups : []
  const groups: MenuGroup[] = []
  for (const g of rawGroups) {
    const group = buildGroup(g, opts, repair)
    if (group) groups.push(group)
  }
  if (groups.length === 0) {
    repair('groups', 'flagged', 'this menu has no groups — it would render empty')
  }

  return { location, brand, groups }
}

export interface MenuBuildResult {
  /** Keyed by LOCATION — one document per (site, location). */
  menus: Record<MenuLocation, MenuDocument>
  repairs: ContentRepairEntry[]
  watermark: string
}

/**
 * Published, site-filtered `cipheraMenus` GraphQL nodes → the menus this site renders,
 * keyed by location, every repair/skip recorded, and the watermark the caller folds into
 * its own. A duplicate published row for the same location is resolved the same way every
 * sibling kind resolves a duplicate key: lowest `databaseId` wins.
 */
export function buildMenus(nodes: WpMenuNode[], optsFor: (location: MenuLocation) => MenuBuildOptions): MenuBuildResult {
  const repairs: ContentRepairEntry[] = []
  const repair = (ref: string, field: string, action: ContentRepairEntry['action'], detail: string): void => {
    repairs.push({ type: MENU_REPAIR_TYPE, ref, field, action, detail })
  }

  const byLocation = new Map<MenuLocation, WpMenuNode[]>()
  for (const n of nodes) {
    const ref = n.databaseId != null ? `wp-db-${n.databaseId}` : '(unknown)'
    if (!isMenuLocation(n.cipheraMenuLocation)) {
      repair(ref, 'location', 'skipped', `menu location "${String(n.cipheraMenuLocation)}" is not header/footer`)
      continue
    }
    const list = byLocation.get(n.cipheraMenuLocation) ?? []
    list.push(n)
    byLocation.set(n.cipheraMenuLocation, list)
  }

  const chosen = new Map<MenuLocation, WpMenuNode>()
  for (const [location, group] of byLocation) {
    const sorted = [...group].sort((a, b) => (a.databaseId ?? Infinity) - (b.databaseId ?? Infinity))
    chosen.set(location, sorted[0])
    for (const loser of sorted.slice(1)) {
      repair(
        location,
        'location',
        'skipped',
        `duplicate published menu for location "${location}" (databaseId ${loser.databaseId ?? 'unknown'}) — kept the lowest databaseId (${sorted[0].databaseId ?? 'unknown'})`
      )
    }
  }

  const menus = {} as Record<MenuLocation, MenuDocument>
  for (const [location, n] of chosen) {
    const ref = n.databaseId != null ? `wp-db-${n.databaseId}` : location
    menus[location] = buildMenuDocument(n, optsFor(location), (field, action, detail) => repair(ref, field, action, detail))
  }

  const watermark = [...chosen.values()].map((n) => n.modifiedGmt ?? '').filter(Boolean).sort().at(-1) ?? ''

  return { menus, repairs, watermark }
}
