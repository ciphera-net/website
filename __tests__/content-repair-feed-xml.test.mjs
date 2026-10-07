import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * P1-a (verifier finding, minor): app/feed.xml/route.ts indexed `sortedPosts[0]` with no
 * empty-array guard. Before P1-a a single bad WordPress post failed the whole build, so
 * `blogPosts` being empty was unreachable; after P1-a every post can individually be
 * unshippable in the same build (plus the live-site shrink-guard fetch itself failing),
 * which can legitimately leave it empty while generate-blog-posts.ts still exits 0.
 *
 * 🔑 SOURCE-LEVEL, like the other P1-a content-repair tests: CI runs `npm test` with no
 * `npm ci`, so a route.ts that imports the generated lib/blog-posts.gen.ts cannot be
 * executed directly here.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
function code(p) {
  return readFileSync(join(root, p), 'utf-8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('feed.xml guards an empty blogPosts array instead of indexing sortedPosts[0] unconditionally', () => {
  const src = code('app/feed.xml/route.ts')
  assert.match(
    src,
    /sortedPosts\.length > 0 \? toRFC822\(sortedPosts\[0\]\.date\) : new Date\(\)\.toUTCString\(\)/,
    'an empty sortedPosts must fall back to the current date, not throw indexing [0]'
  )
  // The unconditional index must be gone from the template string itself.
  assert.doesNotMatch(src, /<lastBuildDate>\$\{toRFC822\(sortedPosts\[0\]\.date\)\}<\/lastBuildDate>/)
})
