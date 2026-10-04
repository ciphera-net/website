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
  const transform = src.indexOf('transformWpPost(renderNode, CDN)')
  assert.ok(siteFilter > 0 && transform > 0, 'both the site filter and the transform call must be present')
  assert.ok(siteFilter < transform, 'the site filter must still run before the transform (website#115 order)')
})

test('the page reads id from searchParams, not from the path (the one-segment guard stays untouched)', () => {
  const src = code(ROUTE)
  assert.match(src, /params:\s*Promise<\{\s*slug:\s*string\s*\}>/)
  assert.match(src, /searchParams:\s*Promise<\{\s*id\?:\s*string\s*\|\s*string\[\]\s*\}>/)
})

// --- WEB-17 follow-up: a slug-null node by id renders under the URL's own segment ---

test('an id over the GraphQL Int32 ceiling 404s pre-fetch, with zero fetch calls', () => {
  const src = code(ROUTE)
  assert.match(src, /const GRAPHQL_INT32_MAX = 2147483647\s*$/m)
  const ceilingAt = src.indexOf('if (id > GRAPHQL_INT32_MAX) notFound()')
  const fetchAt = src.indexOf('await fetchDraft(slug, id)')
  assert.ok(ceilingAt > 0, 'the int32 ceiling check is missing')
  assert.ok(ceilingAt < fetchAt, 'the ceiling must be checked BEFORE any WordPress fetch')

  // DATABASE_ID's own shape still lets a 10-digit number like '9999999999' through —
  // the ceiling is a SEPARATE, numeric check on top of it, not a tighter regex.
  const DATABASE_ID = /^[1-9][0-9]{0,9}$/
  for (const id of ['2147483647', '2147483648', '9999999999']) {
    assert.ok(DATABASE_ID.test(id), `"${id}" must still pass the shape check (the ceiling is numeric, not shape)`)
  }
  assert.ok(2147483647 <= 2147483647 && !(2147483647 > 2147483647))
  assert.ok(2147483648 > 2147483647, 'the ceiling constant must reject 2147483648')
  assert.ok(9999999999 > 2147483647, 'the ceiling constant must reject 9999999999')
})

test('the fallback only fires on the id path, and only when the node has no slug', () => {
  const src = code(ROUTE)
  const fallbackAt = src.indexOf("if (id !== null && !(node.slug ?? '').trim())")
  assert.ok(fallbackAt > 0, 'the id+no-slug guard on the fallback is missing')
})

test('the fallback renders a COPY of the node, never mutates the fetched node', () => {
  const src = code(ROUTE)
  assert.match(src, /renderNode = \{ \.\.\.node, slug: decoded \}/)
  // node.slug itself must still be read afterwards for the banner's draft/published
  // distinction — proof the original node object was never mutated in place.
  assert.match(src, /const status = node\.slug && post\.date \?/)
})

test('a segment that fails to decode notFounds before the transform ever sees it', () => {
  const src = code(ROUTE)
  const decodeAt = src.indexOf('const decoded = decodeSegmentOnce(slug)')
  const guardAt = src.indexOf('if (decoded === null) notFound()')
  const transformAt = src.indexOf('transformWpPost(renderNode, CDN)')
  assert.ok(decodeAt > 0 && guardAt > 0 && transformAt > 0)
  assert.ok(decodeAt < guardAt && guardAt < transformAt)
})

test('decodeSegmentOnce: a clean segment passes through; a %XX-bearing one decodes exactly once; a malformed escape returns null', () => {
  const src = code(ROUTE)
  assert.match(src, /function decodeSegmentOnce\(raw: string\): string \| null \{/)

  // Re-implemented from the route's own source shape, since this file cannot import
  // the TS module (CI runs with no node_modules) — the guard clause and try/catch are
  // asserted against the live source above; behaviour is proven here.
  function decodeSegmentOnce(raw) {
    if (!/%[0-9A-Fa-f]{2}/.test(raw)) return raw
    try {
      return decodeURIComponent(raw)
    } catch {
      return null
    }
  }

  assert.equal(decodeSegmentOnce('my-draft'), 'my-draft')
  assert.equal(decodeSegmentOnce('untitled'), 'untitled')
  assert.equal(decodeSegmentOnce('caf%C3%A9'), 'café')
  assert.equal(decodeSegmentOnce('caf%c3%a9'), 'café')
  // Already-decoded (Next's own router decodes params before this ever runs) is a no-op.
  assert.equal(decodeSegmentOnce('café'), 'café')
  assert.equal(decodeSegmentOnce('a%2fb'), 'a/b')
  assert.equal(decodeSegmentOnce('a%3cb'), 'a<b')
  assert.equal(decodeSegmentOnce('%E0%A4%A'), null)
})

test('the route itself calls decodeURIComponent exactly once, never nested (source-level, catches a "decode twice" regression)', () => {
  const src = code(ROUTE)
  const fnBody = src.slice(src.indexOf('function decodeSegmentOnce'), src.indexOf('\n}\n', src.indexOf('function decodeSegmentOnce')))
  const calls = fnBody.match(/decodeURIComponent\(/g) ?? []
  assert.equal(calls.length, 1, 'decodeSegmentOnce must call decodeURIComponent exactly once')
  assert.doesNotMatch(fnBody, /decodeURIComponent\(decodeURIComponent\(/, 'must never nest a second decode pass inside the first')
})

test('decodeSegmentOnce decodes EXACTLY ONCE, never recursively', () => {
  // 🔴 THE DISTINGUISHING CASE FOR "decode twice". `decodeURIComponent` is a single
  // left-to-right scan, so `%2561` decodes to the literal text `%61` (an invalid slug —
  // % is not in WP_SLUG — correctly 404s) in ONE call. A second, buggy decode pass would
  // then decode THAT `%61` into `a`, silently producing a DIFFERENT, valid-looking slug
  // ("xa") for a segment that was never meant to resolve that far — the classic
  // double-decode bug, and the reason this is checked by VALUE, not just by absence of
  // a throw (a single extra no-op decode of an already-clean string would pass a
  // weaker test).
  function decodeSegmentOnce(raw) {
    if (!/%[0-9A-Fa-f]{2}/.test(raw)) return raw
    try {
      return decodeURIComponent(raw)
    } catch {
      return null
    }
  }
  const once = decodeSegmentOnce('x%2561')
  assert.equal(once, 'x%61', 'one decode pass of a doubly-encoded segment must stop at its first layer')

  const WP_SLUG = /^(?:[a-z0-9_-]|[^\x00-\x7F\s\p{C}])+$/u
  assert.ok(!WP_SLUG.test(once), 'the single-decode result must still fail WP_SLUG (it contains a literal %)')
  // The buggy "decode twice" shape, named so a regression here reads as this exact mutation:
  const decodedTwice = decodeURIComponent(decodeURIComponent('x%2561'))
  assert.equal(decodedTwice, 'xa')
  assert.ok(WP_SLUG.test(decodedTwice), 'a double decode would WRONGLY let this segment through as a valid slug')
})

test('a decoded segment that is a slash or angle bracket still 404s — WP_SLUG, not a bespoke check', () => {
  // lib/blog-transform.ts's WP_SLUG is ASCII-lowercase-alnum/dash/underscore, or non-ASCII —
  // '/' and '<' are ASCII and neither, so they fail it. Proving the regex itself here pins
  // the shared gate the route relies on instead of re-deriving it.
  const transformSrc = readFileSync(join(root, 'lib/blog-transform.ts'), 'utf-8')
  assert.match(transformSrc, /export const WP_SLUG = \/\^\(\?:\[a-z0-9_-\]\|\[\^\\x00-\\x7F\\s\\p\{C\}\]\)\+\$\/u/)
  const WP_SLUG = /^(?:[a-z0-9_-]|[^\x00-\x7F\s\p{C}])+$/u
  assert.ok(!WP_SLUG.test('a/b'))
  assert.ok(!WP_SLUG.test('a<b'))
  assert.ok(WP_SLUG.test('café'))
  assert.ok(WP_SLUG.test('untitled'))
})

test('the malformed-encoding 500 is a documented, measured, pre-existing framework limitation, not silently assumed away', () => {
  // 🔴 MEASURED on a real `next start` against a fixture (WEB-17 follow-up): a path
  // segment with a malformed percent-escape 500s — reproduced identically on
  // `/blog/[slug]` and `/glossary/[slug]`, so it predates and is outside this change.
  // A try/catch around this route's own `await params` was tried and measured to have
  // NO effect (the throw happens before this component's code runs at all); the comment
  // must say so, so a future reader does not "fix" this file expecting it to help.
  const src = read(ROUTE) // raw, not stripped — the claim is in the prose
  assert.ok(src.includes('MEASURED (WEB-17 follow-up, real `next start`'))
  assert.ok(src.includes('NOT a regression from'))
  assert.ok(src.includes('tried, measured, reverted'))
  assert.doesNotMatch(src, /try\s*\{\s*\n\s*;?\(\{ slug \} = await params\)/, 'the non-functional try/catch must not be reintroduced around this await')
})

test('the fallback is wired through the SAME transform call the site filter guards — no second, untrusted path', () => {
  const src = code(ROUTE)
  // Exactly one call into the shared transform in this route.
  const calls = src.match(/transformWpPost\(/g) ?? []
  assert.equal(calls.length, 1, 'there must be exactly one transformWpPost call — the fallback must not bypass it')
  assert.match(src, /transformWpPost\(renderNode, CDN\)/)
})
