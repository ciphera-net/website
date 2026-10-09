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
 * (design §4.1.3a Phase E, §4.2.1 "Rendering rule"). All five product pages, now that
 * `@ciphera-net/facet-sections` 0.3.0 gives `ProductBanner` the `badgeStyle: 'bars'`
 * option Ciphera ID's hero needs (a vertical-bar divider, not the four-of-five-pages
 * dot style) and `ContentBlock`'s `credential-table` device covers its "the vault"
 * section. Every other coded route (legal, trust, blog, glossary, learn) stays coded;
 * only a path NO coded route owns, or one of these five, can serve from the CMS.
 */
export const MIGRATABLE_PAGE_PATHS: readonly string[] = [
  '/products/captcha',
  '/products/id',
  '/products/pulse',
  '/products/relay',
  '/products/tessera',
]

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
 * bytes; see that component's own header for why).
 *
 * 🔑 `br` ALSO carries `className` (hast's property name for the `class` attribute) —
 * the one structural need the six-tag allowlist didn't originally cover: a
 * `product-banner`'s `heading` is plain text everywhere EXCEPT the four hero
 * headings that carry a hand-authored responsive hard break
 * (`<br class="hidden sm:inline">`, identical string on every page that has one —
 * see each page's own hero). Without this, that literal substring would sanitise
 * down to a bare `<br>` and the break would always show, never hiding on mobile as
 * the coded pages do. A `class` value on `br` cannot carry script or a clobber
 * vector, so this is a plain capability widening, not a narrowed guarantee.
 */
export const richTextSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [...RICH_TEXT_TAGS],
  attributes: { a: ['href'], br: ['className'] },
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

// ── Product-page section shapes (WEB-28 build task §2, contract 08-10-2026) ────────
// Mirrors `mu-plugins/ciphera-pages.php`'s `ciphera_page_parse_sections()` switch for
// these seven block types field-for-field — the published `cipheraSections` JSON is
// already in this shape; this module trusts nothing about it (wire data) but does not
// re-derive it.

/** The closed select catalogs every `icon`/`visualKey`/`langIcon`/`registryIcon`/
 * `diagramKey` field draws from (contract §3) — identical lists to WordPress's own
 * `CIPHERA_PAGE_*_KEYS` constants, re-declared here (not imported: this module has no
 * PHP dependency) so a key the site cannot resolve is repaired at THIS boundary too,
 * never only trusted because WordPress already checked it. */
export const ICON_KEYS = [
  'puzzle-piece', 'shield-check', 'lightning', 'eye-slash', 'timer', 'robot', 'eye',
  'key', 'vault', 'cookie', 'code', 'globe', 'funnel', 'envelope-simple', 'lock',
  'globe-outline', 'lock-outline', 'check', 'x', 'arrow-right', 'github',
  // Product-logo chips (Tessera's "#who-uses-it") — same closed catalog as every other
  // icon-keyed field (trustBadges/overlayBadges/feature-grid items/content-block chips),
  // resolved to the real product mark instead of a Phosphor glyph. Harmless if ever
  // selected somewhere else: product-registries.tsx's size-specific resolvers fall back
  // to null for a key their own lookup table does not carry, same as any other gap here.
  'logo-id', 'logo-pulse',
] as const
export const VISUAL_KEYS = [
  'mockup-captcha', 'mockup-auth', 'mockup-relay', 'mockup-pulse-tall',
  'diagram-captcha-stateless', 'diagram-id-zero-knowledge', 'diagram-tessera-opaque-handshake',
  'code-relay-smtp-env', 'code-pulse-script-tag',
] as const
export const DIAGRAM_KEYS = [
  'diagram-captcha-stateless', 'diagram-id-zero-knowledge', 'diagram-tessera-opaque-handshake',
] as const
export const LANG_ICON_KEYS = ['rust', 'go', 'ts'] as const
export const REGISTRY_ICON_KEYS = ['crates-io', 'go-pkg', 'npm'] as const

export type IconKey = (typeof ICON_KEYS)[number]
export type VisualKey = (typeof VISUAL_KEYS)[number]

function isIconKey(v: string): v is IconKey {
  return (ICON_KEYS as readonly string[]).includes(v)
}
function isVisualKey(v: string): v is VisualKey {
  return (VISUAL_KEYS as readonly string[]).includes(v)
}
function isDiagramKey(v: string): v is (typeof DIAGRAM_KEYS)[number] {
  return (DIAGRAM_KEYS as readonly string[]).includes(v)
}
function isLangIconKey(v: string): v is (typeof LANG_ICON_KEYS)[number] {
  return (LANG_ICON_KEYS as readonly string[]).includes(v)
}
function isRegistryIconKey(v: string): v is (typeof REGISTRY_ICON_KEYS)[number] {
  return (REGISTRY_ICON_KEYS as readonly string[]).includes(v)
}

export interface TrustBadge {
  icon: string
  label: string
}
export interface Stat {
  term: string
  detail: string
}
export interface ProductBannerSection {
  type: 'product-banner'
  variant: 'hero' | 'band'
  label: string
  /** Sanitised against `richTextSchema` (not merely `str()`-coerced) — the one case a
   * plain-text field still needs HTML: the hero `<br class="hidden sm:inline">` four of
   * the five pages carry. See `richTextSchema`'s own comment. */
  heading: string
  body: string
  backgroundImage: string
  backgroundImageAlt: string
  /** 0.3.0, hero only. `dots` (default, four of five pages) or `bars` (Ciphera ID's
   * vertical-bar-divider hero). */
  badgeStyle: 'dots' | 'bars'
  trustBadges: TrustBadge[]
  stats: Stat[]
  primaryButtonLabel: string
  primaryButtonHref: string
  primaryButtonExternal: boolean
  secondaryButtonLabel: string
  secondaryButtonHref: string
  secondaryButtonExternal: boolean
  /** 0.3.0, band only — a small trailing line after the buttons (e.g. Ciphera ID's
   * "Already have a Ciphera account? Sign in."). Richtext: that one case carries an
   * inline link. Empty string when unset. */
  footnote: string
}

export interface OverlayBadge {
  icon: string
  title: string
  description: string
}
export interface FeatureSplitSection {
  type: 'feature-split'
  label: string
  heading: string
  /** 0 paragraphs -> `''`, 1 -> a plain string (byte-identical to the pre-0.3.0 scalar
   * case), 2+ -> an array, one per paragraph — mirrors `ciphera-pages.php`'s own
   * `$text` derivation for this block exactly. */
  text: string | string[]
  /** 0.3.0 — a full-size paragraph after the bullets (Ciphera ID's "#what-it-is"
   * closer). Distinct from `note`, which is deliberately smaller type. Empty when unset. */
  trailingText: string
  bullets: string[]
  bulletStyle: 'check' | 'dash'
  ctaLabel: string
  ctaHref: string
  visualSide: 'left' | 'right'
  visualType: 'mockup' | 'diagram' | 'code' | 'photo' | ''
  visualKey: VisualKey | ''
  /** 0.3.0, `visualSide: 'left'` non-photo only. Default `false` (the dominant,
   * 3-of-4 style) — `true` reproduces Ciphera ID's `#zero-knowledge-auth` outlier. */
  visualCellBordered: boolean
  /** 0.3.0 — a CSS hook present only on the two tall-retina-screenshot mockups
   * (Ciphera ID's `#what-it-is`, Pulse's `#dashboard`). Default `false`. */
  mockupCell: boolean
  image: string
  imageAlt: string
  overlayBadges: OverlayBadge[]
  /** 0.3.0, `photo` only. `default` (Captcha/Relay), `tabular` (Pulse, whose
   * description holds a number) or `detailed` (Ciphera ID's one-page outlier). */
  overlayBadgeStyle: 'default' | 'tabular' | 'detailed'
}

export interface FeatureGridItem {
  icon: string
  title: string
  body: string
  anchor: string
}
export interface FeatureGridSection {
  type: 'feature-grid'
  label: string
  heading: string
  dek: string
  items: FeatureGridItem[]
  bullets: string[]
}

export interface ComparisonCardsSection {
  type: 'comparison-cards'
  label: string
  heading: string
  intro: string
  statsStrip: Stat[]
  /** `icon`: resolved as a known `ICON_KEYS` select first (matches the WordPress
   * editor, which lets this field hold EITHER — see product-registries.tsx's
   * `resolveComparisonIcon`), else rendered as a literal CDN image path: the
   * WordPress field is a free `TextControl` ("Icon (CDN path)"), not a select, so
   * nothing here escalates to a whole-section skip the way every true closed select
   * elsewhere in this file does. `taglineAccent` (0.3.0): tints the tagline
   * `text-primary` — independent of `highlighted`, which now draws only the top bar. */
  ours: { icon: string; name: string; tagline: string; highlighted: boolean; taglineAccent: boolean; items: string[] }
  /** `checkAccent` (0.3.0): a `has: true` item's check icon renders `text-foreground`
   * instead of the default muted tone — Relay's one-page outlier. */
  theirs: { icon: string; name: string; tagline: string; checkAccent: boolean; items: { text: string; has: boolean }[] }
}

export interface PackageGridItem {
  langIcon: string
  lang: string
  name: string
  role: string
  body: string
  repoHref: string
  registryHref: string
  registryIcon: string
  registryLabel: string
  /** 0.3.0, REQUIRED — the package's name as published on that registry (e.g.
   * `ciphera-tessera`, `github.com/ciphera-net/tessera-go`, `@ciphera-net/tessera`),
   * distinct from `name` (the repo's mono display name). Feeds only the registry
   * link's aria-label. */
  registryPkg: string
}
export interface PackageGridSection {
  type: 'package-grid'
  label: string
  heading: string
  items: PackageGridItem[]
}

export interface CredentialRow {
  key: string
  value: string
  note: string
}
export interface Chip {
  image: string
  label: string
  href: string
}
export interface ContentBlockSection {
  type: 'content-block'
  label: string
  heading: string
  text: string
  device: 'none' | 'diagram' | 'credential-table' | 'chips'
  diagramKey: string
  rows: CredentialRow[]
  /** `credential-table` device only — the table's own heading/subheading (e.g.
   * Ciphera ID's "What an operator with full database access sees" / "One account
   * row, in its entirety"). Plain strings, not richtext. Empty when unset. */
  tableTitle: string
  tableSubtitle: string
  chips: Chip[]
  bullets: string[]
  bulletStyle: 'check' | 'dash'
  note: string
  /** 0.3.0 — forces the note's margin to `mt-6` regardless of bullet presence
   * (Tessera's "#who-uses-it": a `chips` device, no bullets, but still `mt-6`).
   * Default `false`. */
  noteTight: boolean
}

export interface FaqTabsCategory {
  key: string
  label: string
}
export interface FaqTabsItem {
  categoryKey: string
  question: string
  answer: string
}
export interface FaqTabsSection {
  type: 'faq-tabs'
  title: string
  subtitle: string
  categories: FaqTabsCategory[]
  items: FaqTabsItem[]
}

export type PageSection =
  | HeroSection
  | TextSectionSection
  | FaqSection
  | RelatedLinksSection
  | ClosingCtaSection
  | ProductBannerSection
  | FeatureSplitSection
  | FeatureGridSection
  | ComparisonCardsSection
  | PackageGridSection
  | ContentBlockSection
  | FaqTabsSection

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
function coerceItems<T>(raw: unknown, fields: (keyof T & string)[]): T[] {
  if (!Array.isArray(raw)) return []
  const out: T[] = []
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) continue
    const item: Record<string, string> = {}
    for (const f of fields) item[f] = str((entry as Record<string, unknown>)[f])
    out.push(item as T)
  }
  return out
}

const boolAttr = (v: unknown): boolean => str(v) === '1' || v === true

/**
 * `feature-split.text` (0.3.0): zero paragraphs -> `''`, one -> a plain string
 * (byte-identical to the pre-0.3.0 scalar case), two or more -> an array, one
 * sanitised paragraph per item — mirrors `ciphera_page_parse_sections()`'s own
 * `$text` derivation. WordPress already reduces its own `{text}` repeater items to a
 * flat array of STRINGS (`array_column(..., 'text')`) before this JSON is produced,
 * so an array here is already `string[]`, never `{text}[]`; this also collapses a
 * single-paragraph array to a scalar, same as WordPress, so this function does not
 * depend on it having done so.
 */
function featureSplitText(raw: unknown): string | string[] {
  if (Array.isArray(raw)) {
    const paras = raw.map((p) => sanitizeRichText(str(p))).filter((p) => p !== '')
    if (paras.length === 0) return ''
    if (paras.length === 1) return paras[0]
    return paras
  }
  return sanitizeRichText(str(raw))
}

/**
 * `ciphera_page_normalize_list()`'s TypeScript twin (WordPress mirrors this on save):
 * coerce every listed string field, then drop an item missing ANY of `required`
 * (after trimming) — never a crash on a malformed list, never a half-filled row
 * reaching the page. Every drop is one `repair()` call, same contract as every other
 * list-coercion in this file.
 */
function coerceListItems<T>(
  raw: unknown,
  fields: (keyof T & string)[],
  required: (keyof T & string)[],
  onDrop: (count: number) => void
): T[] {
  const all = coerceItems<T>(raw, fields)
  const kept = all.filter((item) => required.every((f) => String((item as Record<string, string>)[f]).trim() !== ''))
  if (kept.length !== all.length) onDrop(all.length - kept.length)
  return kept
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

      // ── Product-page section types (WEB-28 build task §2) ──────────────────────
      // Each key field (icon / visualKey / langIcon / registryIcon / diagramKey) is
      // validated against this site's own closed registries (not merely trusted
      // because WordPress already checked it — §4.2.1: "repaired here too"). §2's
      // instruction is coarse-grained on purpose: an unresolvable key drops the
      // WHOLE section with one repair, rather than silently rendering a part of it
      // with a hole where the key should have been.

      case 'product-banner': {
        const variant = str(e.variant) === 'band' ? 'band' : 'hero'
        const badgeStyle = str(e.badgeStyle) === 'bars' ? 'bars' : 'dots'
        const badges = coerceListItems<{ icon: string; label: string }>(
          e.trustBadges, ['icon', 'label'], ['label'],
          (n) => repair('product-banner', 'repaired', `dropped ${n} trust badge(s) with no label`)
        )
        const badIcon = badges.find((b) => b.icon !== '' && !isIconKey(b.icon))
        if (badIcon) {
          repair('product-banner', 'skipped', `dropped the whole section — trust badge icon "${badIcon.icon}" is not a known icon key`)
          break
        }
        sections.push({
          type: 'product-banner',
          variant,
          label: str(e.label),
          heading: sanitizeRichText(str(e.heading)),
          body: sanitizeRichText(str(e.body)),
          backgroundImage: str(e.backgroundImage),
          backgroundImageAlt: str(e.backgroundImageAlt),
          badgeStyle,
          trustBadges: badges,
          stats: coerceListItems<Stat>(e.stats, ['term', 'detail'], ['term', 'detail'], (n) =>
            repair('product-banner', 'repaired', `dropped ${n} stat(s) missing a term or detail`)
          ),
          primaryButtonLabel: str(e.primaryButtonLabel),
          primaryButtonHref: str(e.primaryButtonHref),
          primaryButtonExternal: boolAttr(e.primaryButtonExternal),
          secondaryButtonLabel: str(e.secondaryButtonLabel),
          secondaryButtonHref: str(e.secondaryButtonHref),
          secondaryButtonExternal: boolAttr(e.secondaryButtonExternal),
          footnote: sanitizeRichText(str(e.footnote)),
        })
        break
      }

      case 'feature-split': {
        const visualType = str(e.visualType)
        const visualKey = str(e.visualKey)
        if (visualKey !== '' && !isVisualKey(visualKey)) {
          repair('feature-split', 'skipped', `dropped the whole section — visual key "${visualKey}" is not known`)
          break
        }
        if (['mockup', 'diagram', 'code'].includes(visualType) && visualKey === '') {
          repair('feature-split', 'skipped', `dropped the whole section — visual type "${visualType}" has no visual key`)
          break
        }
        const overlayBadges = coerceListItems<OverlayBadge>(
          e.overlayBadges, ['icon', 'title', 'description'], ['title'],
          (n) => repair('feature-split', 'repaired', `dropped ${n} overlay badge(s) with no title`)
        )
        const badIcon = overlayBadges.find((b) => b.icon !== '' && !isIconKey(b.icon))
        if (badIcon) {
          repair('feature-split', 'skipped', `dropped the whole section — overlay badge icon "${badIcon.icon}" is not a known icon key`)
          break
        }
        sections.push({
          type: 'feature-split',
          label: str(e.label),
          heading: str(e.heading),
          text: featureSplitText(e.text),
          trailingText: sanitizeRichText(str(e.trailingText)),
          bullets: coerceItems<{ text: string }>(e.bullets, ['text']).map((b) => b.text).filter((t) => t !== ''),
          bulletStyle: str(e.bulletStyle) === 'dash' ? 'dash' : 'check',
          ctaLabel: str(e.ctaLabel),
          ctaHref: str(e.ctaHref),
          visualSide: str(e.visualSide) === 'left' ? 'left' : 'right',
          visualType: (['mockup', 'diagram', 'code', 'photo'].includes(visualType) ? visualType : '') as FeatureSplitSection['visualType'],
          visualKey: (isVisualKey(visualKey) ? visualKey : '') as VisualKey | '',
          visualCellBordered: boolAttr(e.visualCellBordered),
          mockupCell: boolAttr(e.mockupCell),
          image: str(e.image),
          imageAlt: str(e.imageAlt),
          overlayBadges,
          overlayBadgeStyle: (['default', 'tabular', 'detailed'].includes(str(e.overlayBadgeStyle)) ? str(e.overlayBadgeStyle) : 'default') as FeatureSplitSection['overlayBadgeStyle'],
        })
        break
      }

      case 'feature-grid': {
        const items = coerceListItems<FeatureGridItem>(
          e.items, ['icon', 'title', 'body', 'anchor'], ['icon', 'title', 'body'],
          (n) => repair('feature-grid', 'repaired', `dropped ${n} item(s) missing an icon, title or body`)
        )
        const badIcon = items.find((it) => it.icon !== '' && !isIconKey(it.icon))
        if (badIcon) {
          repair('feature-grid', 'skipped', `dropped the whole section — item icon "${badIcon.icon}" is not a known icon key`)
          break
        }
        sections.push({
          type: 'feature-grid',
          label: str(e.label),
          heading: str(e.heading),
          dek: str(e.dek),
          items,
          bullets: coerceItems<{ text: string }>(e.bullets, ['text']).map((b) => b.text).filter((t) => t !== ''),
        })
        break
      }

      case 'comparison-cards': {
        // 🔑 `ours`/`theirs` are NESTED objects on the wire (ciphera-pages.php builds
        // `'ours' => ['icon' => …, 'name' => …, …]`, not flat `oursIcon`/`oursName`
        // top-level keys) — read accordingly, defensively (an untrusted/malformed
        // document might not nest them at all).
        const oursRaw = (typeof e.ours === 'object' && e.ours !== null ? e.ours : {}) as Record<string, unknown>
        const theirsRaw = (typeof e.theirs === 'object' && e.theirs !== null ? e.theirs : {}) as Record<string, unknown>
        // 🔑 `ours.icon`/`theirs.icon` do NOT escalate to a whole-section skip — unlike
        // every true closed select above, WordPress's own editor presents this field
        // as a free "Icon (CDN path)" TextControl (mu-plugins/ciphera-page-blocks.js),
        // not a dropdown, and `ciphera_page_parse_sections()` runs no
        // `ciphera_page_check_select()` on it either. The value is read as-is and
        // resolved downstream (product-registries.tsx's `resolveComparisonIcon`):
        // a known `ICON_KEYS` entry first, else a literal curated-image path.
        sections.push({
          type: 'comparison-cards',
          label: str(e.label),
          heading: str(e.heading),
          intro: sanitizeRichText(str(e.intro)),
          statsStrip: coerceListItems<Stat>(e.statsStrip, ['term', 'detail'], ['term', 'detail'], (n) =>
            repair('comparison-cards', 'repaired', `dropped ${n} stat(s) missing a term or detail`)
          ),
          ours: {
            icon: str(oursRaw.icon),
            name: str(oursRaw.name),
            tagline: str(oursRaw.tagline),
            highlighted: boolAttr(oursRaw.highlighted),
            taglineAccent: boolAttr(oursRaw.taglineAccent),
            items: coerceItems<{ text: string }>(oursRaw.items, ['text']).map((it) => it.text).filter((t) => t !== ''),
          },
          theirs: {
            icon: str(theirsRaw.icon),
            name: str(theirsRaw.name),
            tagline: str(theirsRaw.tagline),
            checkAccent: boolAttr(theirsRaw.checkAccent),
            items: coerceItems<{ text: string; has: string }>(theirsRaw.items, ['text', 'has'])
              .filter((it) => it.text !== '')
              .map((it) => ({ text: it.text, has: boolAttr(it.has) })),
          },
        })
        break
      }

      case 'package-grid': {
        // 0.3.0: `registryPkg` is a NEW REQUIRED field — same contract as the
        // WordPress side (mu-plugins/ciphera-pages.php's `package-grid` case).
        const items = coerceListItems<PackageGridItem>(
          e.items,
          ['langIcon', 'lang', 'name', 'role', 'body', 'repoHref', 'registryHref', 'registryIcon', 'registryLabel', 'registryPkg'],
          ['lang', 'name', 'body', 'repoHref', 'registryPkg'],
          (n) => repair('package-grid', 'repaired', `dropped ${n} package(s) missing a language, name, body, repo link or registry package name`)
        )
        const badKey = items.find(
          (it) => (it.langIcon !== '' && !isLangIconKey(it.langIcon)) || (it.registryIcon !== '' && !isRegistryIconKey(it.registryIcon))
        )
        if (badKey) {
          repair('package-grid', 'skipped', 'dropped the whole section — a package\'s language or registry icon is not a known key')
          break
        }
        sections.push({ type: 'package-grid', label: str(e.label), heading: str(e.heading), items })
        break
      }

      case 'content-block': {
        const device = str(e.device)
        const diagramKey = str(e.diagramKey)
        if (device === 'diagram' && diagramKey !== '' && !isDiagramKey(diagramKey)) {
          repair('content-block', 'skipped', `dropped the whole section — diagram key "${diagramKey}" is not known`)
          break
        }
        const chips = coerceListItems<Chip>(
          e.chips, ['image', 'label', 'href'], ['label'],
          (n) => repair('content-block', 'repaired', `dropped ${n} chip(s) with no label`)
        )
        const badChip = chips.find((c) => c.image !== '' && !isIconKey(c.image))
        if (badChip) {
          repair('content-block', 'skipped', `dropped the whole section — chip image "${badChip.image}" is not a known icon key`)
          break
        }
        sections.push({
          type: 'content-block',
          label: str(e.label),
          heading: str(e.heading),
          text: sanitizeRichText(str(e.text)),
          device: (['none', 'diagram', 'credential-table', 'chips'].includes(device) ? device : 'none') as ContentBlockSection['device'],
          diagramKey,
          rows: coerceListItems<CredentialRow>(e.rows, ['key', 'value', 'note'], ['key', 'value'], (n) =>
            repair('content-block', 'repaired', `dropped ${n} row(s) missing a key or value`)
          ),
          tableTitle: str(e.tableTitle),
          tableSubtitle: str(e.tableSubtitle),
          chips,
          bullets: coerceItems<{ text: string }>(e.bullets, ['text']).map((b) => b.text).filter((t) => t !== ''),
          bulletStyle: str(e.bulletStyle) === 'dash' ? 'dash' : 'check',
          note: sanitizeRichText(str(e.note)),
          noteTight: boolAttr(e.noteTight),
        })
        break
      }

      case 'faq-tabs': {
        const categories = coerceListItems<FaqTabsCategory>(
          e.categories, ['key', 'label'], ['key', 'label'],
          (n) => repair('faq-tabs', 'repaired', `dropped ${n} categor(y/ies) missing a key or label`)
        )
        const items = coerceListItems<FaqTabsItem>(
          e.items, ['categoryKey', 'question', 'answer'], ['categoryKey', 'question', 'answer'],
          (n) => repair('faq-tabs', 'repaired', `dropped ${n} FAQ item(s) missing a category, question or answer`)
        )
        if (categories.length === 0 || items.length === 0) {
          repair('faq-tabs', 'skipped', 'dropped the whole section — it has no categories or no questions')
          break
        }
        sections.push({ type: 'faq-tabs', title: str(e.title), subtitle: str(e.subtitle), categories, items })
        break
      }

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
