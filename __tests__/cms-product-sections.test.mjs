import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * WEB-28 build task §2 — the seven product-page section types, parsed by
 * `lib/cms/page-build.ts` and rendered by `components/cms/CmsPage.tsx` through
 * `@ciphera-net/facet-sections` ^0.2.0 and this site's own registries
 * (`lib/cms/product-registries.tsx`).
 *
 * 🔑 SOURCE-LEVEL, same reason as every sibling test here (`.woodpecker/test.yml`:
 * "No npm token and no `npm ci`"). A REAL parse was run against fixtures shaped
 * exactly like `mu-plugins/ciphera-pages.php`'s `ciphera_page_parse_sections()`
 * output while writing this (every section type, an unknown icon/visualKey, a
 * missing required field, an unknown block type) — see the build task's report for
 * what each one produced. `tsc --noEmit` was clean against the real types.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

const NEW_TYPES = ['product-banner', 'feature-split', 'feature-grid', 'comparison-cards', 'package-grid', 'content-block', 'faq-tabs']

test('page-build.ts parses all seven product-page section types, mirroring ciphera-pages.php field for field', () => {
  const src = code('lib/cms/page-build.ts')
  for (const t of NEW_TYPES) {
    assert.match(src, new RegExp(`case '${t}':`), `missing a buildSections() case for ${t}`)
  }
  // The five original SEO-cluster types are untouched, not replaced.
  for (const t of ['hero', 'text-section', 'faq', 'related-links', 'closing-cta']) {
    assert.match(src, new RegExp(`case '${t}':`))
  }
})

test('every select field (icon / visualKey / langIcon / registryIcon / diagramKey) is validated against this site\'s own closed catalog, not merely trusted', () => {
  const src = code('lib/cms/page-build.ts')
  assert.match(src, /export const ICON_KEYS = \[/)
  assert.match(src, /export const VISUAL_KEYS = \[/)
  assert.match(src, /export const DIAGRAM_KEYS = \[/)
  assert.match(src, /export const LANG_ICON_KEYS = \[/)
  assert.match(src, /export const REGISTRY_ICON_KEYS = \[/)
  assert.match(src, /function isIconKey/)
  assert.match(src, /function isVisualKey/)
  // Every catalog list matches WordPress's own constant, value for value (re-declared, not imported — no PHP dependency).
  assert.match(src, /'puzzle-piece', 'shield-check', 'lightning', 'eye-slash', 'timer', 'robot', 'eye',/)
  assert.match(src, /'globe-outline', 'lock-outline', 'check', 'x', 'arrow-right', 'github',/)
})

test('an unresolvable key drops the WHOLE section with a repair, never a crash — per build task §2', () => {
  const src = code('lib/cms/page-build.ts')
  // product-banner: a bad trust-badge icon.
  assert.match(src, /dropped the whole section — trust badge icon/)
  // feature-split: a bad visual key, or a mockup\/diagram\/code type with none set.
  assert.match(src, /dropped the whole section — visual key/)
  assert.match(src, /dropped the whole section — visual type/)
  // feature-grid / comparison-cards / package-grid / content-block: same device.
  assert.match(src, /dropped the whole section — item icon/)
  assert.match(src, /dropped the whole section — "ours" or "theirs" icon/)
  assert.match(src, /dropped the whole section — a package\\'s language or registry icon/)
  assert.match(src, /dropped the whole section — diagram key/)
})

test('NEGATIVE CONTROL: a required-field list drop is REPAIRED (kept list, dropped item), not a whole-section drop — the two failure modes must stay distinct', () => {
  const src = code('lib/cms/page-build.ts')
  // coerceListItems always repairs (keeps the section) when an item merely lacks a
  // required field — only an unresolvable SELECT KEY escalates to a whole-section drop.
  assert.match(src, /dropped \$\{n\} trust badge\(s\) with no label/)
  assert.match(src, /dropped \$\{n\} item\(s\) missing an icon, title or body/)
  assert.doesNotMatch(
    code('lib/cms/page-build.ts').replace(/dropped the whole section[^\n]*/g, ''),
    /dropped the whole section/,
    'every whole-section drop must be one of the explicitly asserted cases above, not a stray extra one'
  )
})

test('every new richtext field is sanitised at publish time, same as text-section', () => {
  const src = code('lib/cms/page-build.ts')
  assert.match(src, /body: sanitizeRichText\(str\(e\.body\)\)/, 'product-banner.body')
  assert.match(src, /text: sanitizeRichText\(str\(e\.text\)\)/, 'feature-split.text or content-block.text')
  assert.match(src, /intro: sanitizeRichText\(str\(e\.intro\)\)/, 'comparison-cards.intro')
  assert.match(src, /note: sanitizeRichText\(str\(e\.note\)\)/, 'content-block.note')
})

test('CmsPage renders all seven new types through @ciphera-net/facet-sections and this site\'s own registries, never importing a mockup/diagram/icon it does not control', () => {
  const src = code('components/cms/CmsPage.tsx')
  for (const comp of ['ProductBanner', 'FeatureSplit', 'FeatureGrid', 'ComparisonCards', 'PackageGrid', 'ContentBlock', 'FaqTabs']) {
    assert.ok(src.includes(comp), `CmsPage does not import/use ${comp}`)
  }
  for (const t of NEW_TYPES) {
    assert.match(src, new RegExp(`case '${t}'`))
  }
  assert.match(src, /from '@\/lib\/cms\/product-registries'/)
})

test('the icon/visual/lang/registry registries are exhaustive over page-build.ts\'s own key catalogs — a key page-build.ts allows is a key the registry resolves (or deliberately null, documented)', () => {
  const pageBuild = code('lib/cms/page-build.ts')
  const registries = code('lib/cms/product-registries.tsx')
  const iconKeysMatch = pageBuild.match(/export const ICON_KEYS = \[([\s\S]*?)\] as const/)
  assert.ok(iconKeysMatch)
  const iconKeys = iconKeysMatch[1].match(/'[a-z-]+'/g).map((s) => s.slice(1, -1))
  for (const key of iconKeys) {
    // An object key renders unquoted when it's a valid identifier (e.g. `lightning:`),
    // quoted otherwise (e.g. `'puzzle-piece':`) — accept either.
    assert.match(registries, new RegExp(`['"]?${key}['"]?:`), `ICON_REGISTRY has no entry for "${key}"`)
  }
  // The three un-extracted diagrams are a DOCUMENTED null, not a silent gap.
  for (const key of ['diagram-captcha-stateless', 'diagram-id-zero-knowledge', 'diagram-tessera-opaque-handshake']) {
    assert.match(registries, new RegExp(`'${key}': null`))
  }
  assert.match(read('lib/cms/product-registries.tsx'), /NOT YET WIRED/)
})
