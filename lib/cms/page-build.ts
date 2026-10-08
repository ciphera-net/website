/**
 * The `ciphera_page` transform, extracted pure (WEB-28).
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.2, §4.2.1
 *
 * 🔑 ONE TRANSFORM, ONE CALLER, UNLIKE ITS SIBLINGS. `glossary-build.ts` /
 * `route-build.ts` / `blog-build.ts` each feed a build-time generator AND
 * `scripts/cms-publisher.ts` — there is no `scripts/generate-pages.ts` this round
 * (§4.2.1: "the seed is empty"), so `cms-publisher.ts` is the only caller. The shape
 * is kept identical to its siblings anyway: WordPress-node in, document-or-repair out,
 * nothing async, nothing that can throw past a single bad node.
 *
 * 🔴 WORDPRESS ALREADY PARSED THE BLOCKS. `cipheraSections` (GraphQL) is
 * `wp_json_encode(ciphera_page_parse_sections($content)['sections'])` —
 * `mu-plugins/ciphera-pages.php` already turned the block content into the five
 * section shapes below, dropped any OTHER block, and numbered each text section by
 * its position among text sections. This module does not re-parse blocks; it treats
 * that JSON as untrusted wire data (a build running against a compromised or simply
 * buggy WordPress must not crash, and the string must not reach the page as
 * unsanitised HTML) and repairs whatever does not match the shape it expects.
 *
 * 🔴 TEXT-SECTION BODY HTML IS SANITISED HERE, TO A SIX-TAG ALLOWLIST
 * (p/a[href]/strong/em/code/br), AND THE SANITISED STRING IS WHAT SHIPS IN THE
 * DOCUMENT — unlike the blog body (sanitised at RENDER time only, in
 * `components/blog/wp-body.tsx`, because its allowlist is large and structural:
 * tables, custom blocks, images). A six-tag allowlist is small enough to resolve once,
 * at publish time, so the document on the CDN is itself already safe to read as HTML
 * — and the renderer still parses-to-React rather than
 * `dangerouslySetInnerHTML`-ing it (defence in depth, same conviction as wp-body.tsx's
 * own comment: the primary control is that only an authenticated editor can reach this
 * at all).
 */
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'
import type { ContentRepairEntry } from '../content-repair-types'

export const PAGE_REPAIR_TYPE = 'page'

/** §4.2.1's table, in code. Order is never load-bearing — `type` decides the renderer. */
export const RICH_TEXT_TAGS = ['p', 'a', 'strong', 'em', 'code', 'br'] as const

/**
 * A path the CMS's catch-all/override rendering is allowed to reach for THIS site
 * (design §4.1.3a Phase E, §4.2.1 "Rendering rule"). Empty for ciphera.net this round
 * — its product pages are migrated in a later step (§4.2.1 "Order", item 5) — so
 * every one of its own coded routes stays coded for now, and only a path NO coded
 * route owns can serve from the CMS (via the catch-all).
 */
export const MIGRATABLE_PAGE_PATHS: readonly string[] = []

/**
 * Top-level path prefixes a coded route owns today. Not exhaustive of every segment
 * in `app/` (it does not need to be) — it exists only to answer "is this address
 * already code's", so a `ciphera_page` published at an address the site cannot yet
 * render from the CMS is SKIPPED with a repair instead of silently indexing a
 * document nothing will ever read (§4.2.1: "a page whose path is … owned by a coded
 * route that is NOT in the site's migratable list is skipped with a repair").
 * Next's own router enforces the actual precedence at request time regardless (a
 * static or dynamic segment always wins over the catch-all) — this list is the
 * publish-time half of that same rule, kept in step by hand because it changes only
 * when a route is added, which is rare and already a PR.
 */
export const CODED_ROUTE_PREFIXES: readonly string[] = [
  // Every top-level directory actually under `app/` on this site today.
  '/about', '/what-is-ciphera', '/press', '/sustainability', '/contact',
  '/products', '/privacy', '/terms', '/trust', '/blog', '/glossary', '/learn',
  // Tier 1 (next.config.ts, mirrored by lib/cms/redirect-build.ts's TIER1_EXACT /
  // TIER1_PREFIX) — permanent redirects, not a directory under `app/`, but a path
  // next.config.ts intercepts before any page ever renders, so a page published
  // there would be unreachable regardless.
  '/security', '/companies', '/comparison', '/transparency',
  '/preview', '/sys', // internal, never a page address
]

export function ownedByCodedRoute(path: string): boolean {
  if (path === '/') return true
  return CODED_ROUTE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))
}

/** §4.2.1 "a path … not '^/[a-z0-9-]+(/[a-z0-9-]+)*\$'". */
export const PAGE_PATH_RE = /^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/

/** http(s) absolute, a site-relative path (never protocol-relative `//`), or an
 * in-page anchor — the one shape every link in a page is allowed to be, whether it
 * is a `related-links` href or an `<a href>` inside a text section's body. */
export const SAFE_HREF_RE = /^(https?:\/\/[^\s"]+|\/(?!\/)[^\s"]*|#[^\s"]*)$/

export function isSafeHref(href: string): boolean {
  return SAFE_HREF_RE.test(href)
}

// ── Rich text sanitiser ──────────────────────────────────────────────────────────────

/**
 * Drops an `<a>`'s `href` (keeping the link's text, never the element) when it is not
 * `isSafeHref` — rehype-sanitize's own `protocols` check only inspects a value that
 * HAS a scheme, so it would wave a protocol-relative `//evil.example` straight
 * through (no scheme to check). This closes that one gap; everything else about the
 * allowlist is rehype-sanitize's job.
 */
export function dropUnsafeHrefs() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'a') return
      const href = node.properties?.href
      if (typeof href !== 'string' || !isSafeHref(href)) {
        delete node.properties.href
      }
    })
  }
}

/** Exported so `components/cms/CmsRichText.tsx` parses-to-React against the SAME
 * allowlist this module sanitises to at publish time — one definition, not two that
 * could drift (the render side still parses fresh rather than trusting the stored
 * bytes; see that component's own header for why). */
export const richTextSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [...RICH_TEXT_TAGS],
  attributes: { a: ['href'] },
  protocols: { ...defaultSchema.protocols, href: ['http', 'https'] },
}

const sanitizeProcessor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, richTextSchema)
  .use(dropUnsafeHrefs)
  .use(rehypeStringify)

/**
 * A text section's `text` → the same string, cut down to the allowlist. Anything not
 * in `RICH_TEXT_TAGS` is unwrapped to its own text content (rehype-sanitize's default
 * for a disallowed element — never dropped outright, so a pasted `<div>` or `<span>`
 * loses only its wrapper, not its words). Never throws: a malformed fragment parses to
 * whatever rehype-parse can make of it, same as every other HTML this site accepts.
 */
export function sanitizeRichText(html: string): string {
  return String(sanitizeProcessor.processSync(html ?? '').value)
}

// ── Wire shapes ───────────────────────────────────────────────────────────────────────

export interface WpPageNode {
  databaseId: number | null
  cipheraPath: string | null
  /** JSON-encoded array — see this file's header for exactly what WordPress put in it. */
  cipheraSections: string | null
  modifiedGmt: string | null
  cipheraTitle: string | null
  cipheraDescription: string | null
  cipheraCanonical: string | null
  cipheraOgTitle: string | null
  cipheraOgDescription: string | null
  cipheraOgImage: string | null
  cipheraTwitterTitle: string | null
  cipheraTwitterDescription: string | null
  routeSites?: { nodes: { slug: string }[] }
}

// ── Section shapes (§4.2.1's table) ─────────────────────────────────────────────────

export interface HeroSection {
  type: 'hero'
  label: string
  title: string
  introduction: string
}
export interface TextSectionSection {
  type: 'text-section'
  number: number
  label: string
  heading: string
  /** Already `sanitizeRichText`-clean by the time it is on a `PageDocument`. */
  text: string
  linkName: string
}
export interface FaqSection {
  type: 'faq'
  items: { question: string; answer: string }[]
}
export interface RelatedLinksSection {
  type: 'related-links'
  items: { label: string; description: string; href: string }[]
}
export interface ClosingCtaSection {
  type: 'closing-cta'
  title: string
  text: string
}
export type PageSection = HeroSection | TextSectionSection | FaqSection | RelatedLinksSection | ClosingCtaSection

export interface PageSeo {
  title?: string
  description?: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterTitle?: string
  twitterDescription?: string
}

export interface PageDocument {
  path: string
  databaseId: number | null
  modifiedGmt: string
  seo: PageSeo
  sections: PageSection[]
}

export interface PageBuildResult {
  /** Keyed by the page's PATH, same convention as `RouteBuildResult['routes']`. */
  pages: Record<string, PageDocument>
  repairs: ContentRepairEntry[]
  watermark: string
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

/** §4.2.1's items shape, defensively coerced — a non-array or non-object entry is
 * dropped rather than letting a malformed `cipheraSections` string crash the page. */
function coerceItems<T extends Record<string, string>>(raw: unknown, fields: (keyof T)[]): T[] {
  if (!Array.isArray(raw)) return []
  const out: T[] = []
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) continue
    const item = {} as T
    for (const f of fields) item[f] = str((entry as Record<string, unknown>)[f as string]) as T[typeof f]
    out.push(item)
  }
  return out
}

/**
 * One page's `cipheraSections` JSON → the sections this site renders, every drop or
 * change recorded. `repair()` is the caller's own repair-logger, closed over `ref` so
 * every entry here already carries the page's own key.
 */
function buildSections(
  rawJson: string | null,
  repair: (field: string, action: ContentRepairEntry['action'], detail: string) => void
): PageSection[] {
  let raw: unknown
  try {
    raw = JSON.parse(rawJson ?? '[]')
  } catch {
    repair('sections', 'repaired', 'cipheraSections was not valid JSON — rendered with no sections')
    return []
  }
  if (!Array.isArray(raw)) {
    repair('sections', 'repaired', 'cipheraSections was not a JSON array — rendered with no sections')
    return []
  }

  const sections: PageSection[] = []
  let textSectionPosition = 0

  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) {
      repair('sections', 'repaired', 'dropped a section that was not an object')
      continue
    }
    const e = entry as Record<string, unknown>
    switch (e.type) {
      case 'hero':
        sections.push({ type: 'hero', label: str(e.label), title: str(e.title), introduction: str(e.introduction) })
        break

      case 'text-section': {
        textSectionPosition += 1
        const number = typeof e.number === 'number' && e.number > 0 ? e.number : textSectionPosition
        const rawText = str(e.text)
        const text = sanitizeRichText(rawText)
        if (text !== rawText) {
          repair('text', 'repaired', `text section ${number}'s body was sanitised to the allowed tags (p, a, strong, em, code, br)`)
        }
        sections.push({ type: 'text-section', number, label: str(e.label), heading: str(e.heading), text, linkName: str(e.linkName) })
        break
      }

      case 'faq': {
        const items = coerceItems<{ question: string; answer: string }>(e.items, ['question', 'answer'])
          .filter((it) => it.question !== '')
        const dropped = coerceItems(e.items, ['question']).length - items.length
        if (dropped > 0) repair('faq', 'repaired', `dropped ${dropped} FAQ item(s) with no question`)
        sections.push({ type: 'faq', items })
        break
      }

      case 'related-links': {
        const parsed = coerceItems<{ label: string; description: string; href: string }>(e.items, ['label', 'description', 'href'])
        const items = parsed.filter((it) => isSafeHref(it.href))
        if (items.length !== parsed.length) {
          repair('related-links', 'repaired', `dropped ${parsed.length - items.length} related link(s) with an unsafe href`)
        }
        sections.push({ type: 'related-links', items })
        break
      }

      case 'closing-cta':
        sections.push({ type: 'closing-cta', title: str(e.title), text: str(e.text) })
        break

      default:
        repair('sections', 'repaired', `dropped a section of unknown type "${String(e.type)}"`)
    }
  }

  return sections
}

function compactSeo(n: WpPageNode): PageSeo {
  const seo: PageSeo = {}
  const set = (k: keyof PageSeo, v: string | null) => {
    const t = (v ?? '').trim()
    if (t !== '') seo[k] = t
  }
  set('title', n.cipheraTitle)
  set('description', n.cipheraDescription)
  set('canonical', n.cipheraCanonical)
  set('ogTitle', n.cipheraOgTitle)
  set('ogDescription', n.cipheraOgDescription)
  set('ogImage', n.cipheraOgImage)
  set('twitterTitle', n.cipheraTwitterTitle)
  set('twitterDescription', n.cipheraTwitterDescription)
  return seo
}

/**
 * One node's CONTENT — sections and SEO, never mind whether its path is publishable
 * — for the ONE caller that must render a page regardless of address problems: the
 * draft preview (`app/preview/page/[id]/page.tsx`). An editor previewing a page that
 * has no path yet, or one that collides with a coded route, still needs to see the
 * sections they just wrote; path validity is the publisher's and the review queue's
 * concern (`ciphera_page_review_checks` in WordPress already flags it there), not a
 * reason to render nothing. `buildPages()` below is the publishable-address gate;
 * this is what it calls once a node has cleared that gate.
 */
export function buildPageDocument(
  n: WpPageNode,
  repair: (field: string, action: ContentRepairEntry['action'], detail: string) => void
): PageDocument {
  const sections = buildSections(n.cipheraSections, repair)
  if (sections.length === 0) {
    repair('sections', 'flagged', 'this page has no sections — it would render empty')
  }
  return {
    path: str(n.cipheraPath).trim(),
    databaseId: n.databaseId,
    modifiedGmt: n.modifiedGmt ?? '',
    seo: compactSeo(n),
    sections,
  }
}

/**
 * Published, site-filtered `cipheraPages` GraphQL nodes → the pages this site renders,
 * keyed by path, every repair/skip recorded, and the watermark the caller folds into
 * its own. `migratablePaths` defaults to this site's own list (§4.2.1: empty for
 * ciphera.net this round) — passed explicitly so a test can prove the skip rule
 * without waiting for a real migration.
 */
export function buildPages(nodes: WpPageNode[], migratablePaths: readonly string[] = MIGRATABLE_PAGE_PATHS): PageBuildResult {
  const repairs: ContentRepairEntry[] = []
  const repair = (ref: string, field: string, action: ContentRepairEntry['action'], detail: string): void => {
    repairs.push({ type: PAGE_REPAIR_TYPE, ref, field, action, detail })
  }

  const byPath = new Map<string, WpPageNode[]>()
  for (const n of nodes) {
    const ref = n.databaseId != null ? `wp-db-${n.databaseId}` : '(unknown)'
    const path = str(n.cipheraPath).trim()

    if (path === '') {
      repair(ref, 'path', 'skipped', 'a published page has no path')
      continue
    }
    if (!PAGE_PATH_RE.test(path)) {
      repair(path, 'path', 'skipped', `path "${path}" does not match ^/[a-z0-9-]+(/[a-z0-9-]+)*$`)
      continue
    }
    if (ownedByCodedRoute(path) && !migratablePaths.includes(path)) {
      repair(path, 'path', 'skipped', `path "${path}" is owned by a coded route this site has not migrated yet`)
      continue
    }

    const list = byPath.get(path) ?? []
    list.push(n)
    byPath.set(path, list)
  }

  const chosen = new Map<string, WpPageNode>()
  for (const [path, group] of byPath) {
    const sorted = [...group].sort((a, b) => (a.databaseId ?? Infinity) - (b.databaseId ?? Infinity))
    chosen.set(path, sorted[0])
    for (const loser of sorted.slice(1)) {
      repair(
        path,
        'path',
        'skipped',
        `duplicate published page for path "${path}" (databaseId ${loser.databaseId ?? 'unknown'}) — kept the lowest databaseId (${sorted[0].databaseId ?? 'unknown'})`
      )
    }
  }

  const pages: Record<string, PageDocument> = {}
  for (const [path, n] of chosen) {
    const ref = n.databaseId != null ? `wp-db-${n.databaseId}` : path
    pages[path] = buildPageDocument(n, (field, action, detail) => repair(ref, field, action, detail))
  }

  const watermark = [...chosen.values()].map((n) => n.modifiedGmt ?? '').filter(Boolean).sort().at(-1) ?? ''

  return { pages, repairs, watermark }
}
