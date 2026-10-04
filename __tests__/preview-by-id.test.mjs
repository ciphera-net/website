import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The CMS's "Preview this draft" link carries `?id=<databaseId>` (plan §10.3,
 * `Pulse/docs/plans/03-10-2026-pulse-cms-phase-c-d-plan.md`), so a block-editor draft —
 * whose `post_name` is `""` until publish (WEB-17) — can still be found by ID even though
 * its name lookup never will be.
 *
 * 🔑 SOURCE-LEVEL, like blog-seam.test.mjs and seo-tenant-isolation.test.mjs: CI runs
 * `npm test` with no `npm ci` and no `node_modules`, so this route's actual TypeScript
 * cannot be executed here — only read.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')

/** Comments stripped before any regex match, same as the repo's other source-level tests:
 * every rule below is explained in prose nearby, so a naive `includes()` would match the
 * comment warning against the very thing it forbids. */
function code(p) {
  return read(p)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

const ROUTE = 'app/preview/[slug]/page.tsx'

test('an id is rejected (404, no fetch) before fetchDraft is ever called', () => {
  const src = code(ROUTE)
  const rejectAt = src.indexOf('if (!DATABASE_ID.test(rawId)) notFound()')
  const fetchAt = src.indexOf('await fetchDraft(slug, id)')
  assert.ok(rejectAt > 0, 'the id-shape guard is missing')
  assert.ok(fetchAt > 0, 'the fetchDraft call is missing')
  assert.ok(rejectAt < fetchAt, 'a malformed id must 404 BEFORE any WordPress fetch, not after')
})

test('the id pattern is a bare positive databaseId: no leading zero, 1-10 digits', () => {
  const src = code(ROUTE)
  assert.match(src, /const DATABASE_ID = \/\^\[1-9\]\[0-9\]\{0,9\}\$\/\s*$/m)

  // The same pattern, evaluated directly, since this file cannot import the route's TS.
  const DATABASE_ID = /^[1-9][0-9]{0,9}$/
  for (const ok of ['1', '9', '398', '1234567890']) {
    assert.ok(DATABASE_ID.test(ok), `"${ok}" should be a valid databaseId`)
  }
  for (const bad of ['0', '01', '007', '', '-1', '1.5', '1a', '12345678901', ' 1', '1 ']) {
    assert.ok(!DATABASE_ID.test(bad), `"${bad}" must NOT be accepted as a databaseId`)
  }
})

test('a string[] id (repeated query param) is narrowed to its first value, never thrown away silently', () => {
  const src = code(ROUTE)
  assert.match(src, /Array\.isArray\(idParam\)\s*\?\s*idParam\[0\]\s*:\s*idParam/)
})

test('an id query uses the blogPosts CONNECTION with a where:{id} filter, never blogPost(idType:ID)', () => {
  const src = code(ROUTE)
  assert.match(src, /blogPosts\(first:\s*1,\s*where:\s*\{\s*id:\s*\$id\s*\}\)/)
  assert.match(src, /\$id:\s*Int!/)
  assert.doesNotMatch(src, /blogPost\(idType:\s*ID\)/)
})

test('without an id, the slug (name) lookup is unchanged', () => {
  const src = code(ROUTE)
  assert.match(src, /blogPosts\(first:\s*1,\s*where:\s*\{\s*name:\s*\$slug\s*\}\)/)
  assert.match(src, /\$slug:\s*String!/)
})

test('fetchDraft branches id vs slug by `id !== null`, and the id branch wins when present', () => {
  const src = code(ROUTE)
  assert.match(src, /const query =\s*\n\s*id !== null/)
  assert.match(src, /const variables = id !== null \? \{ id \} : \{ slug \}/)
})

test('the fetch now carries a 10s ceiling (it had none before WEB-17)', () => {
  const src = code(ROUTE)
  assert.match(src, /signal:\s*AbortSignal\.timeout\(10_000\)/)
})

test('the error/unavailable copy is byte-identical to before WEB-17', () => {
  const src = read(ROUTE) // NOT comment-stripped: these are literal rendered strings
  assert.match(src, /<h1[^>]*>Preview unavailable<\/h1>/)
  assert.ok(
    src.includes('The post itself is fine — this is the preview service failing to read it. Tell Ciphera.'),
    'the unavailable-state copy must not drift'
  )
  assert.ok(src.includes('This is not the live page.'), 'the banner copy must not drift')
})

test('the banner status line is untouched: it does not map a WPGraphQL status to a word', () => {
  // Measured 04-10-2026: this route's banner never requests or maps WPGraphQL's `status`
  // field at all — it only ever shows "draft or published, last saved …" or "draft". Per
  // the WEB-17 ruling, a route with no status map keeps its visible copy unchanged; only a
  // route that DOES map gets lower-cased. Confirming both the fixed strings AND the
  // continued absence of a `status` field in the query keeps this test honest about which
  // case this route is in.
  const src = code(ROUTE)
  assert.ok(src.includes("`draft or published, last saved ${post.dateModified}`"))
  assert.ok(src.includes("const status = node.slug && post.date ?"))
  assert.doesNotMatch(src, /nodes \{ status/, 'this route must not request a `status` field it never maps')
})

test('the SLUG-resolver comment states the measured mechanism, not the old guess', () => {
  // 🔑 This test reads the RAW source, not comment-stripped: the claim under test is what
  // the comment's own prose says.
  const src = read(ROUTE)
  assert.doesNotMatch(
    src,
    /WPGraphQL restricts that lookup to published posts/,
    'the superseded "WPGraphQL restricts" explanation must be gone'
  )
  assert.match(src, /never sets[\s\S]{0,20}`post_status`/, 'the corrected mechanism (WP_Query never sets post_status) must be stated')
  assert.match(src, /upstream of[\s\S]{0,40}visibility layer/i)
  assert.match(src, /post_name ""/, 'the block-editor-draft fact (WEB-17) belongs in the corrected comment')
})

test('the site filter still runs before the transform, unchanged by the id work', () => {
  const src = code(ROUTE)
  const siteFilter = src.indexOf('nodeSites(node).includes(BLOG_SITE)')
  const transform = src.indexOf('transformWpPost(node, CDN)')
  assert.ok(siteFilter > 0 && transform > 0, 'both the site filter and the transform call must be present')
  assert.ok(siteFilter < transform, 'the site filter must still run before the transform (website#115 order)')
})

test('the page reads id from searchParams, not from the path (the one-segment guard stays untouched)', () => {
  const src = code(ROUTE)
  assert.match(src, /params:\s*Promise<\{\s*slug:\s*string\s*\}>/)
  assert.match(src, /searchParams:\s*Promise<\{\s*id\?:\s*string\s*\|\s*string\[\]\s*\}>/)
})
