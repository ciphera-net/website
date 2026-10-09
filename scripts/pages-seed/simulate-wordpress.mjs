/**
 * `blocks[]` (this repo's seed shape — `scripts/import-pages.php`'s own document
 * contract) -> the `cipheraSections` JSON array `ciphera_page_parse_sections()`
 * (`Infra/CMS/wordpress`'s `mu-plugins/ciphera-pages.php`) would publish — the raw
 * wire shape `lib/cms/page-build.ts`'s `buildSections()` reads. Verified field for
 * field against `origin/main` @ `393c33e` (08-10-2026, the entity-decode fix).
 *
 * 🔑 THIS IS A RESHAPE, NOT A REIMPLEMENTATION OF WORDPRESS'S OWN VALIDATION.
 * `ciphera_page_normalize_list()`'s required-field drop and `ciphera_page_plain()`'s
 * entity-decode are WordPress-side concerns already exercised by well-formed seed
 * data (nothing here is missing a required field, and nothing here carries an
 * HTML entity to decode) — the thing actually under test is `buildSections()`'s OWN
 * coercion (`coerceListItems`/`coerceItems`), which this function's job is to feed
 * exactly what WordPress would send, never to duplicate its filtering.
 *
 * Three real reshapes, all load-bearing:
 *   1. `comparison-cards`: `ours`/`theirs` are NESTED objects on the wire, not flat
 *      `oursIcon`/`oursName` keys.
 *   2. `feature-split.text`: WordPress's own `array_column(...)` + scalar-collapse
 *      on its `{text}` repeater, BEFORE the JSON is produced — `buildSections()`'s
 *      `featureSplitText()` assumes this already happened.
 *   3. `theirsItems[].has`: `ciphera_page_normalize_list()` coerces EVERY field of
 *      EVERY list item to `(string)`, including this one — WordPress's wire value is
 *      the string `'1'`/`''`, never a bare boolean (unlike a top-level field such as
 *      `oursHighlighted`, read straight by `boolAttr()` with no list-item coercion in
 *      between). `coerceItems()` (page-build.ts) runs every item field through
 *      `str()` before `boolAttr()` ever sees it, so a raw `true` here would already
 *      have been flattened to `''` — i.e. always "no" — before this bug was caught.
 */

const BLOCK_TO_TYPE = {
  'ciphera/product-banner': 'product-banner',
  'ciphera/feature-split': 'feature-split',
  'ciphera/feature-grid': 'feature-grid',
  'ciphera/comparison-cards': 'comparison-cards',
  'ciphera/package-grid': 'package-grid',
  'ciphera/content-block': 'content-block',
  'ciphera/faq-tabs': 'faq-tabs',
}

/** `[{text:'a'},{text:'b'}]` -> `['a','b']`; one item -> `'a'`; none -> `''`. */
function collapseTextParagraphs(paras) {
  const values = (paras ?? []).map((p) => p.text)
  if (values.length === 0) return ''
  if (values.length === 1) return values[0]
  return values
}

/** Fields the SITE treats as rich text (lib/cms/page-build.ts sanitizeRichText) — WordPress leaves these as stored HTML
 * and entity-decodes every other string (ciphera_page_parse_sections(); the 09-10-2026 rich/plain contract). Seeds are
 * written fully HTML-escaped (extract-seeds.mjs), so this is the WordPress step the parity proof has to model. */
const RICH_FIELDS = {
  'product-banner': ['heading', 'body', 'footnote'],
  'feature-split': ['text', 'trailingText', 'note'],
  'feature-grid': ['dek'],
  'comparison-cards': ['intro'],
  'content-block': ['text', 'note'],
}

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function decodePlain(value) {
  if (typeof value === 'string') return decodeEntities(value)
  if (Array.isArray(value)) return value.map(decodePlain)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, decodePlain(v)]))
  return value
}

function applyWordpressDecoding(section) {
  const rich = new Set(RICH_FIELDS[section.type] ?? [])
  return Object.fromEntries(Object.entries(section).map(([k, v]) => [k, k === 'type' || rich.has(k) ? v : decodePlain(v)]))
}

export function simulateWordpressSections(blocks) {
  return blocks.map((block) => applyWordpressDecoding(simulateOne(block)))
}

function simulateOne(block) {
  {
    const type = BLOCK_TO_TYPE[block.name]
    if (!type) throw new Error(`simulateWordpressSections: unknown block name "${block.name}"`)
    const a = block.attrs
    switch (type) {
      case 'product-banner':
        return {
          type,
          variant: a.variant,
          label: a.label,
          heading: a.heading,
          body: a.body,
          backgroundImage: a.backgroundImage,
          backgroundImageAlt: a.backgroundImageAlt,
          badgeStyle: a.badgeStyle,
          trustBadges: a.trustBadges,
          stats: a.stats,
          primaryButtonLabel: a.primaryButtonLabel,
          primaryButtonHref: a.primaryButtonHref,
          primaryButtonExternal: a.primaryButtonExternal,
          secondaryButtonLabel: a.secondaryButtonLabel,
          secondaryButtonHref: a.secondaryButtonHref,
          secondaryButtonExternal: a.secondaryButtonExternal,
          footnote: a.footnote,
        }
      case 'feature-split':
        return {
          type,
          label: a.label,
          heading: a.heading,
          text: collapseTextParagraphs(a.text),
          trailingText: a.trailingText,
          bullets: a.bullets,
          bulletStyle: a.bulletStyle,
          ctaLabel: a.ctaLabel,
          ctaHref: a.ctaHref,
          visualSide: a.visualSide,
          visualType: a.visualType,
          visualKey: a.visualKey,
          visualCellBordered: a.visualCellBordered,
          mockupCell: a.mockupCell,
          image: a.image,
          imageAlt: a.imageAlt,
          overlayBadges: a.overlayBadges,
          overlayBadgeStyle: a.overlayBadgeStyle,
          // 🔴 NOT a real WordPress wire field yet — see FeatureSplitSection['note']'s
          // own comment in lib/cms/page-build.ts. Carried here so this harness can
          // prove OUR OWN code (parse + render) is correct for the day WordPress adds
          // it; production `ciphera_page_parse_sections()` sends no such key today.
          note: a.note,
        }
      case 'feature-grid':
        return { type, label: a.label, heading: a.heading, dek: a.dek, items: a.items, bullets: a.bullets }
      case 'comparison-cards':
        return {
          type,
          label: a.label,
          heading: a.heading,
          intro: a.intro,
          statsStrip: a.statsStrip,
          ours: {
            icon: a.oursIcon,
            name: a.oursName,
            tagline: a.oursTagline,
            highlighted: a.oursHighlighted,
            taglineAccent: a.oursTaglineAccent,
            items: a.oursItems,
          },
          theirs: {
            icon: a.theirsIcon,
            name: a.theirsName,
            tagline: a.theirsTagline,
            checkAccent: a.theirsCheckAccent,
            items: (a.theirsItems ?? []).map((it) => ({ text: it.text, has: it.has ? '1' : '' })),
          },
        }
      case 'package-grid':
        return { type, label: a.label, heading: a.heading, items: a.items }
      case 'content-block':
        return {
          type,
          label: a.label,
          heading: a.heading,
          text: a.text,
          device: a.device,
          diagramKey: a.diagramKey,
          rows: a.rows,
          chips: a.chips,
          bullets: a.bullets,
          bulletStyle: a.bulletStyle,
          note: a.note,
          noteTight: a.noteTight,
          tableTitle: a.tableTitle,
          tableSubtitle: a.tableSubtitle,
        }
      case 'faq-tabs':
        return { type, title: a.title, subtitle: a.subtitle, categories: a.categories, items: a.items }
      default:
        throw new Error(`simulateWordpressSections: unhandled type "${type}"`)
    }
  }
}
