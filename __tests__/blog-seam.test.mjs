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
  // ⚠️ THIS LIVES IN post-view.tsx, NOT THE ROUTE. The route only routes; the page is
  // one shared component so that /preview renders the REAL page rather than a
  // lookalike that can drift from it (§24.9).
  const page = code('components/blog/post-view.tsx')
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
  const page = code('components/blog/post-view.tsx')
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

test('the converter canonicalises hast\'s camelCased data attributes', () => {
  const body = code('components/blog/wp-body.tsx')
  // 🔴 THE BUG THIS PINS, MEASURED ON THE FIRST WORDPRESS-AUTHORED POST.
  // hast camel-cases every data-* attribute: `<span data-src="…">` parses to
  // `properties.dataSrc`, never `properties['data-src']`. A rehype-sanitize allowlist
  // written with hyphens therefore matches nothing and strips the attribute, leaving a
  // well-formed `<span></span>` — no error, no warning, and a ToolLogo that renders as
  // an empty inline element. The blockquote branch hid it, because that one assigns
  // literal hyphenated keys itself.
  assert.match(body, /dataCipheraBlock/, 'the transformer must read hast\'s camelCased spelling')
  assert.match(body, /dataSrc/, 'data-src arrives as dataSrc and must be canonicalised before sanitising')
})

test('every build-time gate the blog depends on is present', () => {
  // ⚠️ The content checks moved into the SHARED transform when the preview landed, so
  // the preview reports exactly what the build refuses. Both files are read here on
  // purpose: the gate is the pair, and splitting them was how it could regress.
  const gen = code('scripts/generate-blog-posts.ts') + code('lib/blog-transform.ts')
  for (const [needle, why] of [
    [/exists in BOTH/, 'slug collision between MDX and WordPress'],
    [/duplicate published post/, 'two published posts sharing a slug'],
    [/no category/, 'a post with no category has no call-to-action'],
    [/has no call-to-action/, 'a category with no CTA silently shows the generic button'],
    [/no meta description/, 'an empty meta description reaches the SERP'],
    [/OG card/, 'a missing OG card unfurls broken where nobody looks'],
    [/ALLOW_POST_COUNT_DECREASE/, 'the shrink guard, once WordPress holds the only copy'],
  ]) {
    assert.match(gen, needle, `generate-blog-posts.ts lost its gate for: ${why}`)
  }
})

test('the OG gate is NOT in the deliberately network-free test', () => {
  // og-image-dimensions.test.mjs says in its own header that it must not depend on the
  // network, or it becomes a test that fails when the CDN is slow rather than when the
  // code is wrong. The 404 check belongs in the build, where the network is already a
  // hard dependency.
  const og = read('__tests__/og-image-dimensions.test.mjs')
  assert.doesNotMatch(og, /fetch\(|https:\/\/cdn\.ciphera\.net/, 'this guard must stay source-level')
})

test('the committed WordPress-bodies stub is empty', () => {
  // 🔴 IT IS COMMITTED ONLY SO THE MODULE RESOLVES ON A FRESH CLONE. If a real post
  // lands in it, the repository has quietly become a second source of truth for what
  // the CMS says — and the stale copy is the one that wins an argument nobody knew
  // was happening. A build overwrites it; a commit must not.
  // ⚠️ COMMENT-STRIPPED, because the file's own warning NAMES the forbidden string in
  // prose — the same trap this suite's `code()` helper exists for, met from the other
  // direction: here it was the warning, not the rule, that matched.
  const stub = code('lib/blog-wp.gen.ts')
  assert.match(stub, /export const wpPosts: WpBlogPost\[\] = \[\]/, 'lib/blog-wp.gen.ts must be committed empty')
  assert.doesNotMatch(stub, /localhost|127\.0\.0\.1/, 'a local port-forward URL must never be committed as the blog\'s source')
})

test('the preview route is inert without its environment variable', () => {
  const preview = code('app/preview/[slug]/page.tsx')
  // 🔴 A 404, NOT AN ERROR PAGE. On ciphera.net this route must be indistinguishable
  // from a path that does not exist — an error page would advertise that a preview
  // surface exists and invite somebody to go looking for it.
  assert.match(preview, /if \(!WP\) notFound\(\)/, 'the route must 404 when WORDPRESS_GRAPHQL_URL is unset')
  assert.match(preview, /export const dynamic = 'force-dynamic'/)
  assert.match(preview, /robots: \{ index: false, follow: false \}/, 'a preview must never be indexable')
  assert.doesNotMatch(preview, /NODE_ENV/, 'the guard must be the env var, not a build-time flag — the same artefact runs in both places')
  assert.match(read('public/robots.txt'), /Disallow: \/preview\//)
})

test('the preview and the build share ONE transform', () => {
  // A preview built from a second copy of the transform would eventually disagree with
  // the published page — which is the failure a preview exists to prevent, and the one
  // nobody notices until a post ships looking wrong.
  for (const f of ['scripts/generate-blog-posts.ts', 'app/preview/[slug]/page.tsx']) {
    assert.match(code(f), /transformWpPost/, `${f} must use lib/blog-transform.ts, not its own copy`)
  }
  // The post page too: a preview that renders a lookalike layout is a page an editor
  // trusts that visitors never see.
  assert.match(code('app/preview/[slug]/page.tsx'), /BlogPostView/)
  assert.match(code('app/blog/[slug]/page.tsx'), /BlogPostView/)
})

test('the preview reads drafts through the CONNECTION, not the single-node lookup', () => {
  const preview = code('app/preview/[slug]/page.tsx')
  // 🔴 MEASURED, NOT REASONED. With a fully authorised reader, `blogPost(idType: SLUG)`
  // returns null for a draft — WPGraphQL restricts that lookup to published posts, and
  // the filter that widens the statuses only reaches connections. It fails by returning
  // NULL rather than erroring, so it reads exactly like "that post does not exist".
  assert.match(preview, /blogPosts\(first: 1, where: \{ name: \$slug \}\)/)
  assert.doesNotMatch(preview, /blogPost\(id: \$slug/, 'the single-node SLUG lookup cannot see a draft')
})
