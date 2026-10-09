import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * WEB-28 — `ciphera_page` as a CMS content kind: the transform
 * (`lib/cms/page-build.ts`), the publisher entry, and the `/sys/seo-state` runtime
 * block. The renderer (CmsPage, the catch-all route, the preview route) is covered by
 * `__tests__/cms-page-render.test.mjs`.
 *
 * 🔑 SOURCE-LEVEL, same reason as web26-round2-runtime-seams.test.mjs: CI runs
 * `npm test` with no `npm ci` and no network, so this asserts on the raw source text
 * rather than executing the transform. The transform was run for real against fixture
 * WordPress nodes while writing it (hero/text-section/faq/related-links/closing-cta,
 * an unknown block, a `<script>`/`javascript:`/protocol-relative href, a duplicate
 * path, an empty path, a coded-route path, a malformed shape) and every case produced
 * exactly the repair this file asserts the SOURCE still contains the rule for.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

// ── runtime-config.ts: page ships off by default ────────────────────────────────────

test('DEFAULT_RUNTIME_KINDS does not include page — page ships OFF', () => {
  const src = code('lib/cms/runtime-config.ts')
  assert.match(src, /const DEFAULT_RUNTIME_KINDS: readonly string\[\] = \['glossary', 'blog', 'route', 'redirect', 'menu'\]/)
  assert.doesNotMatch(src.match(/const DEFAULT_RUNTIME_KINDS[^\n]*/)[0], /'page'/)
})

// ── lib/cms/page-build.ts ────────────────────────────────────────────────────────────

test('buildPages never throws on content and skips (never crashes on) every unusable path', () => {
  const src = code('lib/cms/page-build.ts')
  assert.doesNotMatch(src, /\bfail\(|process\.exit/, 'a pure, shared transform must never fail a process — only the caller decides')
  assert.match(src, /PAGE_PATH_RE = \/\^\\\/\[a-z0-9-\]\+\(\\\/\[a-z0-9-\]\+\)\*\$\//)
  assert.match(src, /path === ''\)/)
  assert.match(src, /!PAGE_PATH_RE\.test\(path\)/)
})

test('a page owned by a coded route the site has not migrated is skipped, not rendered; four product pages are migratable, /products/id is NOT', () => {
  const src = code('lib/cms/page-build.ts')
  assert.match(
    src,
    /export const MIGRATABLE_PAGE_PATHS: readonly string\[\] = \[\s*'\/products\/captcha',\s*'\/products\/pulse',\s*'\/products\/relay',\s*'\/products\/tessera',\s*\]/,
    'build task §3: captcha/pulse/relay/tessera migrate; id needs facet-sections 0.3.0'
  )
  assert.doesNotMatch(src, /'\/products\/id',/, '/products/id is NOT migratable yet')
  assert.match(src, /ownedByCodedRoute\(path\) && !migratablePaths\.includes\(path\)/)
})

test('duplicate published pages for one path keep the lowest databaseId, same rule as route/glossary', () => {
  const src = code('lib/cms/page-build.ts')
  assert.match(src, /\(a\.databaseId \?\? Infinity\) - \(b\.databaseId \?\? Infinity\)/)
})

test('sections: an unknown block type is dropped with a repair, every known type is coerced defensively', () => {
  const src = code('lib/cms/page-build.ts')
  for (const t of ['hero', 'text-section', 'faq', 'related-links', 'closing-cta']) {
    assert.match(src, new RegExp(`case '${t}'`), `missing a case for section type "${t}"`)
  }
  assert.match(src, /dropped a section of unknown type/)
})

test('text-section body is sanitised to the six-tag allowlist, never passed through raw', () => {
  const src = code('lib/cms/page-build.ts')
  assert.match(src, /RICH_TEXT_TAGS = \['p', 'a', 'strong', 'em', 'code', 'br'\]/)
  assert.match(src, /tagNames: \[\.\.\.RICH_TEXT_TAGS\]/)
  assert.match(src, /protocols: \{ \.\.\.defaultSchema\.protocols, href: \['http', 'https'\] \}/)
  assert.match(src, /sections\.push\(\{ type: 'text-section'.*text,.*\}\)/)
})

test('an unsafe href (protocol-relative or javascript:) is dropped, never passed through — on <a> AND on related-links', () => {
  const src = code('lib/cms/page-build.ts')
  assert.match(
    src,
    /SAFE_HREF_RE = \/\^\(https\?:\\\/\\\/\[\^\\s"\]\+\|\\\/\(\?!\\\/\)\[\^\\s"\]\*\|#\[\^\\s"\]\*\)\$\//,
    'the allowlist must be http(s), a single-leading-slash relative path (never //), or a # anchor'
  )
  assert.match(src, /delete node\.properties\.href/, '<a> hrefs: dropUnsafeHrefs strips the attribute, keeps the link text')
  assert.match(src, /parsed\.filter\(\(it\) => isSafeHref\(it\.href\)\)/, 'related-links: an unsafe href drops the whole item')
})

test('a page with no sections is flagged (ships, needs a look), never skipped outright', () => {
  const src = code('lib/cms/page-build.ts')
  assert.match(src, /'flagged', 'this page has no sections — it would render empty'\)/)
})

test('SEO fields are compacted — an empty string is omitted from the document, not stored as ""', () => {
  const src = code('lib/cms/page-build.ts')
  assert.match(src, /if \(t !== ''\) seo\[k\] = t/)
})

// ── scripts/cms-publisher.ts ─────────────────────────────────────────────────────────

test('cms-publisher.ts registers page, via the shared lib/cms/page-build.ts module', () => {
  const src = code('scripts/cms-publisher.ts')
  assert.match(src, /page: publishPage,/)
  assert.match(src, /buildPages\(nodes\)/)
  assert.match(src, /import \{ buildPages, type WpPageNode \} from '\.\.\/lib\/cms\/page-build'/)
})

test('publishPage refuses a key collision between two distinct paths, same guard as publishRoute', () => {
  const src = code('scripts/cms-publisher.ts')
  assert.match(
    src,
    /page: paths "\$\{existing\}" and "\$\{p\}" both slugify to key "\$\{key\}" — refusing to publish/
  )
})

test('publishPage has NO last-good merge — a page WordPress stops publishing is simply gone', () => {
  // The rationale lives in a comment, so this reads the RAW file (code() strips comments).
  const raw = read('scripts/cms-publisher.ts')
  assert.match(raw, /async function publishPage[\s\S]{0,2200}No last-good merge/)
  const src = code('scripts/cms-publisher.ts')
  assert.match(src, /async function publishPage[\s\S]{0,1200}const mergedItems = newItems/)
})

test('publishPage purges every changed path plus sitemap.xml on any change', () => {
  const src = code('scripts/cms-publisher.ts')
  assert.match(
    src,
    /const pagePatterns = \[\.\.\.changedPaths\.flatMap\(\(p\) => \[p, `\$\{p\}\*`\]\), \.\.\.\(changed \? \['\/sitemap\.xml'\] : \[\]\)\]/
  )
})

test('PAGE_QUERY reads cipheraPages with every SEO field the design names', () => {
  const src = code('scripts/cms-publisher.ts')
  assert.match(src, /const PAGE_QUERY = `\{\s*cipheraPages\(first: 100, where: \{ status: PUBLISH \}\)/)
  for (const f of [
    'cipheraPath', 'cipheraSections', 'cipheraTitle', 'cipheraDescription', 'cipheraCanonical',
    'cipheraOgTitle', 'cipheraOgDescription', 'cipheraOgImage', 'cipheraTwitterTitle', 'cipheraTwitterDescription',
  ]) {
    assert.ok(src.includes(f), `PAGE_QUERY is missing ${f}`)
  }
})

// ── /sys/seo-state ───────────────────────────────────────────────────────────────────

test('/sys/seo-state gains a runtime.page block, additive only', () => {
  const src = code('app/sys/seo-state/route.ts')
  assert.match(src, /runtime: \{/)
  assert.ok(src.includes('page:'), '/sys/seo-state\'s runtime block is missing the "page:" entry')
  for (const existing of ['glossary:', 'blog:', 'seo:', 'redirect:']) {
    assert.ok(src.includes(existing), `/sys/seo-state lost the existing runtime entry: ${existing}`)
  }
  assert.match(src, /getPageRuntimeState/)
})
