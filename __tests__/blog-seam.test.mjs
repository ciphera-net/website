import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The blog's dual-source seam.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.7
 *
 * 🔴 EACH OF THESE FAILS SILENTLY IF IT REGRESSES. None of them breaks a build, a
 * type check or a test that is not this one — they break the site, quietly, in a way
 * that looks like a content problem rather than a code problem.
 *
 * 🔑 SOURCE-LEVEL, LIKE og-image-dimensions.test.mjs, AND FOR THE SAME REASON PLUS ONE
 * MORE. It must not depend on the network — and it must not depend on BUILD OUTPUT
 * either: `lib/blog-posts.gen.ts` and `lib/blog-wp.gen.ts` are now git-ignored, and CI
 * runs `npm test` without a prebuild, so a test that read them would pass on the
 * author's disk and fail in the pipeline.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')

/**
 * ⚠️ COMMENTS MUST BE STRIPPED BEFORE ASSERTING ON SOURCE TEXT. Every file below
 * explains in prose exactly the thing being forbidden, so a naive `includes()` matches
 * the comment warning against it and the guard passes forever.
 */
function code(p) {
  return read(p)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
}

test('the four generator pipelines keep their BlogPostSummary contract', () => {
  // feed.xml, the blog index, the sitemap and llms.txt all depend on this shape. A
  // field dropped here is a field missing from the RSS feed, silently.
  const gen = code('scripts/generate-blog-posts.ts')
  for (const key of ['slug', 'title', 'description', 'category', 'date', 'dateModified', 'readTime', 'image']) {
    assert.ok(
      new RegExp(`\\b${key}\\b`).test(gen),
      `generate-blog-posts.ts no longer emits "${key}" — feed.xml / the blog index / the sitemap read it`
    )
  }
})

test('a slug in both sources is a build failure, not a precedence rule', () => {
  const blog = code('lib/blog.ts')
  assert.match(blog, /collision/i, 'lib/blog.ts must detect a slug present in both content/blog and WordPress')
  assert.match(blog, /throw new Error/, 'the collision must THROW — a precedence rule silently retires one source')
})

test('the post page branches on the body discriminant, not on a boolean', () => {
  const page = code('app/blog/[slug]/page.tsx')
  assert.match(page, /post\.body\.kind === 'mdx'/, 'the MDX branch must be selected by the discriminant')
  assert.match(page, /MDXRemote source=\{post\.body\.content\}/, 'MDX must render from the discriminated body')
  assert.match(page, /<WpBody html=\{post\.body\.content\}/, 'WordPress must render through the sanitising pipeline')
  assert.doesNotMatch(
    page,
    /dangerouslySetInnerHTML=\{\{\s*__html:\s*post\./,
    'a WordPress body must never be injected as raw HTML'
  )
})

test('the BlogPosting wordCount does not count HTML tags', () => {
  const page = code('app/blog/[slug]/page.tsx')
  assert.doesNotMatch(
    page,
    /wordCount:\s*post\.content\.split/,
    'wordCount must come from lib/blog.ts, which computes it per source — splitting an HTML body on whitespace counts tags'
  )
  assert.match(page, /wordCount:\s*post\.wordCount/)
})

test('the sanitiser strips every class and allows no image protocol', () => {
  const body = code('components/blog/wp-body.tsx')
  assert.doesNotMatch(
    body,
    /'className'|"className"/,
    'no class may survive sanitising — WordPress emits wp-block-* classes that mean nothing here, and allowing them lets the CMS make styling decisions'
  )
  // Semantics travel on data-* instead, so those must be allowed.
  assert.match(body, /'data-ciphera-block'/)
  // An `src` with any scheme is an image the build's CDN mirror did not handle.
  assert.doesNotMatch(body, /src:\s*\[\s*'https?'/, 'src must allow no protocol — every image is rewritten to a CDN path before this runs')
})
