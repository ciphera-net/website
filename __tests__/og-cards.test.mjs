import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The OG card system (D52, 19-10-2026; plan §5l), source level: what must hold for every page's share card to be its
 * own, current and served. The drawing itself is exercised in og-render.render.mjs (it needs next/og, so it runs after
 * npm ci in build.yml).
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (...p) => readFileSync(join(root, ...p), 'utf8')

test('the metrics tables were made from the fonts the renderer draws with', () => {
  // lib/og/layout.ts places every glyph from these tables and the renderer draws it with the font file: a font swapped
  // without re-running scripts/og-font-metrics.py would set every title with the old font's widths.
  for (const [font, table] of [
    ['Geist-SemiBold.ttf', 'geist-semibold-metrics.json'],
    ['Geist-Regular.ttf', 'geist-regular-metrics.json'],
  ]) {
    const metrics = JSON.parse(read('lib', 'og', table))
    const sha = createHash('sha256').update(readFileSync(join(root, 'lib', 'og', 'fonts', font))).digest('hex')
    assert.equal(metrics.font, font)
    assert.equal(metrics.sha256, sha, `${table} is stale: run python3 scripts/og-font-metrics.py`)
    assert.equal(metrics.unitsPerEm, 1000)
    // Every printable ASCII character a title can contain has a width.
    for (let c = 0x20; c < 0x7f; c++) assert.ok(String.fromCharCode(c) in metrics.advance, `${table}: no width for ${JSON.stringify(String.fromCharCode(c))}`)
    // Positive control on the kerning: the pair the whole design was checked against (Chrome measured -11.2 px at 100 px).
    if (font === 'Geist-SemiBold.ttf') assert.equal(metrics.kern.A.V, -112)
  }
})

test('the card route answers 404 for what the site does not say, 308 for an old hash, and caches a card for a year', () => {
  const src = read('app', 'og', '[file]', 'route.ts')
  assert.match(src, /if \(!parsed\) return new Response\('Not found', NOT_FOUND\)/)
  assert.match(src, /if \(!card\) return new Response\('Not found', NOT_FOUND\)/)
  assert.match(src, /status: 404, headers: \{ 'Cache-Control': 'no-store'/)
  assert.match(src, /status: 308,\s*headers: \{ Location: cardPath\(parsed\.kind, parsed\.key, card\)/)
  assert.match(src, /'Cache-Control': 'public, max-age=31536000, immutable'/)
  // A failed drawing is never cached, so the next request draws it again.
  assert.match(src, /status: 500, headers: \{ 'Cache-Control': 'no-store'/)
  // The Location is relative: behind the CDN the server sees the Magic Containers host, so an absolute URL built from
  // the request would send a scraper off ciphera.net.
  assert.doesNotMatch(src, /NextResponse\.redirect|new URL\(/)
})

test('a WordPress stub or CMS page image never replaces a page’s own card', () => {
  const seo = read('lib', 'seo.ts')
  // Both merges: the sync seoFor() and the runtime mergeRouteSeo().
  assert.equal(seo.match(/const stubImage = wp\.ogImage && !hasSystemCard\(fbOg\.images\) \? wp\.ogImage : ''/g)?.length, 2)
  assert.doesNotMatch(seo, /\.\.\.\(wp\.ogImage \?/, 'a merge still applies the stub image unguarded')
  const page = read('lib', 'cms', 'page-runtime.ts')
  assert.match(page, /const cmsImage = seo\.ogImage && !hasSystemCard\(fbOg\.images\) \? seo\.ogImage : ''/)
  assert.doesNotMatch(page, /\.\.\.\(seo\.ogImage \?/, 'mergePageSeo still applies the CMS image unguarded')
})

test('the fonts the route reads from disk are traced into the standalone build', () => {
  // Without this the image ships the route and not its fonts, and every card answers 500.
  assert.match(read('next.config.ts'), /'\/og\/\[file\]': \['\.\/lib\/og\/fonts\/\*\*'\]/)
  assert.match(read('lib', 'og', 'render.tsx'), /readFile\(path\.join\(root, 'lib\/og\/fonts\/Geist-SemiBold\.ttf'\)\)/)
})
