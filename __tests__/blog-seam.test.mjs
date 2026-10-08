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
    // (?!\.) — `content/blog/*.mdx` (quoted in several of these files) contains a
    // literal `/*` that is not a comment opener; without the lookahead this regex
    // treats it as one and non-greedily deletes everything up to an unrelated `*/`.
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
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

test('the sanitiser strips every class and merges (never replaces) the protocol map (WEB-16, mirrors PULSE-243)', () => {
  // 🔴 SPLIT 04-10-2026: the schema and cipheraBlocks moved from wp-body.tsx into
  // lib/blog-html.ts (WEB-16, mirrors pulse-website@edcb673) so scripts/generate-blog-posts.ts
  // can run the exact same chain at build time. wp-body.tsx now only imports and wires it.
  const html = code('lib/blog-html.ts')
  // The ONE exception, and it is a VALUE allowlist rather than a hole: MDX emits
  // `<code class="language-html">` for a fenced block's info string, and stripping it
  // silently changed the corpus's only code block. rehype-sanitize takes
  // [attribute, ...allowedValues], so an author cannot smuggle an arbitrary class
  // through `code`. Anything else claiming className is the thing this forbids.
  const classNameUses = [...html.matchAll(/'className'/g)]
  assert.equal(
    classNameUses.length,
    1,
    'className may appear exactly once in the sanitiser schema — on `code`, as a value allowlist. ' +
      'WordPress emits wp-block-* classes that mean nothing here, and allowing them lets the CMS make styling decisions'
  )
  assert.match(html, /code: \[\s*\[\s*'className', 'language-/, 'the one className exception must be value-allowlisted')
  // Semantics travel on data-* instead, so those must be allowed.
  assert.match(html, /'data-ciphera-block'/)

  // 🔴 THE PULSE-243 ROOT CAUSE. `protocols: { href: [...] }` — written straight after
  // `...defaultSchema` — REPLACES the whole protocols map rather than merging it, and
  // defaultSchema.protocols already carries `src: ['http', 'https']`. Replacing it meant
  // `src` had NO protocol check at all: javascript:, data: and any off-CDN https image
  // rendered. The fix spreads `...defaultSchema.protocols` into the new map.
  assert.match(
    html,
    /protocols:\s*\{\s*\.\.\.defaultSchema\.protocols,/,
    'protocols must spread defaultSchema.protocols — writing a bare { href: [...] } here silently drops the check on src entirely'
  )
  // And `src` must be restricted to https — never absent (no check) and never bare
  // 'http'/'https?' (which would also admit a plain http image).
  assert.match(html, /src:\s*\['https'\]/, 'img src must be restricted to exactly https')

  // The second, independent backstop: a scheme check alone cannot catch
  // https://cdn.ciphera.net.evil.example/x.png (an allowed scheme, the wrong host).
  assert.match(html, /export function cdnImagesOnly/, 'a scheme check alone cannot catch a confused host — cdnImagesOnly must exist')
  assert.match(html, /startsWith\(CDN_IMAGE_ORIGIN\)/, 'cdnImagesOnly must reject anything not starting with the exact CDN origin')
})

test('wp-body.tsx wires the shared schema, cdnImagesOnly and toolLogosValidated into one pipeline (WEB-16)', () => {
  const body = code('components/blog/wp-body.tsx')
  assert.match(body, /from '@\/lib\/blog-html'/, 'wp-body.tsx must import the shared pipeline, not keep its own copy')
  assert.match(body, /\.use\(rehypeSanitize, schema\)/)
  assert.match(body, /\.use\(cdnImagesOnly\)/, 'an img that fails the protocol/host check must still be removed from the rendered tree')
  assert.match(body, /\.use\(toolLogosValidated\)/, 'a tool-logo mark must be validated the same way an <img> is')
  // cdnImagesOnly and toolLogosValidated must run AFTER sanitize, never before — a
  // pre-sanitize check would be validating markup the sanitizer has not finished with.
  const sanitizeAt = body.indexOf('.use(rehypeSanitize, schema)')
  const cdnAt = body.indexOf('.use(cdnImagesOnly)')
  const toolLogoAt = body.indexOf('.use(toolLogosValidated)')
  assert.ok(sanitizeAt > -1 && cdnAt > sanitizeAt, 'cdnImagesOnly must run after rehype-sanitize')
  assert.ok(toolLogoAt > cdnAt, 'toolLogosValidated must run after cdnImagesOnly')
})

test('the converter canonicalises hast\'s camelCased data attributes (lib/blog-html.ts, WEB-16)', () => {
  const html = code('lib/blog-html.ts')
  // 🔴 THE BUG THIS PINS, MEASURED ON THE FIRST WORDPRESS-AUTHORED POST.
  // hast camel-cases every data-* attribute: `<span data-src="…">` parses to
  // `properties.dataSrc`, never `properties['data-src']`. A rehype-sanitize allowlist
  // written with hyphens therefore matches nothing and strips the attribute, leaving a
  // well-formed `<span></span>` — no error, no warning, and a ToolLogo that renders as
  // an empty inline element. The blockquote branch hid it, because that one assigns
  // literal hyphenated keys itself.
  assert.match(html, /dataCipheraBlock/, 'the transformer must read hast\'s camelCased spelling')
  assert.match(html, /dataSrc/, 'data-src arrives as dataSrc and must be canonicalised before sanitising')
})

test('a tool-logo mark is shape-checked and HEAD-checked like every other image (WEB-16, mirrors PULSE-243)', () => {
  const html = code('lib/blog-html.ts')
  // 🔴 data-src IS A '*' ATTRIBUTE, SO IT IS NEVER SHAPE-CHECKED BY SANITIZE ITSELF.
  assert.match(html, /export const TOOL_LOGO_SRC\s*=\s*\/\^\\\/blog\\\/tools\\\//, 'TOOL_LOGO_SRC must anchor to /blog/tools/')
  assert.match(html, /export function toolLogosValidated/)
  // Only span/div become a <ToolLogo> — any other tag must keep its text and lose only
  // the data-* attributes, never be deleted outright (that would delete editor prose).
  assert.match(
    html,
    /node\.tagName !== 'span' && node\.tagName !== 'div'/,
    'a tool-logo block on any tag but span/div must not be treated as an image'
  )
  assert.match(html, /TOOL_LOGO_SRC\.test\(src\)/)

  const gen = code('scripts/generate-blog-posts.ts')
  assert.match(gen, /renderableImageSources/, 'the generator must import the shared renderableImageSources, not its own regex')
  assert.match(
    gen,
    /renderableImageSources\(post\.html,\s*\{\s*toolLogoBase:\s*CDN\s*\}\)/,
    'the generator must HEAD-check a tool-logo mark too, resolved the same way ToolLogo itself resolves it (cdnUrl() against NEXT_PUBLIC_CDN_URL)'
  )
})

test('NEXT_PUBLIC_CDN_URL being unset is a build failure once a WordPress post ships (WEB-16, mirrors PULSE-243)', () => {
  const gen = code('scripts/generate-blog-posts.ts')
  assert.match(
    gen,
    /wp\.length > 0 && !process\.env\.NEXT_PUBLIC_CDN_URL/,
    'an unset NEXT_PUBLIC_CDN_URL must fail the build once it is publishing at least one WordPress post — ' +
      'left unset, cdnUrl() resolves every tool-logo mark and card image relative to this app\'s own origin instead of the CDN'
  )
})

test('every build-time gate the blog depends on is present', () => {
  // ⚠️ The content checks moved into the SHARED transform when the preview landed, so
  // the preview reports exactly what the build refuses. All three files are read here
  // on purpose: the gate is now a trio (generate-blog-posts.ts, blog-transform.ts, and
  // — since WEB-26 round 2 — lib/cms/blog-build.ts, which cms-publisher.ts shares),
  // and splitting any one of them out was how coverage could regress unnoticed.
  const gen = code('scripts/generate-blog-posts.ts') + code('lib/blog-transform.ts') + code('lib/cms/blog-build.ts')
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
  //
  // 🔁 WEB-26 round 2: generate-blog-posts.ts no longer calls transformWpPost directly
  // — it calls lib/cms/blog-build.ts's buildBlogPosts(), which is the one place that
  // does (shared with cms-publisher.ts too). The preview still calls it directly, since
  // it has no dedupe/recovery-copy pass to share.
  assert.match(code('lib/cms/blog-build.ts'), /transformWpPost/, 'lib/cms/blog-build.ts must use lib/blog-transform.ts, not its own copy')
  assert.match(code('scripts/generate-blog-posts.ts'), /buildBlogPosts/, 'generate-blog-posts.ts must call the shared transform, not re-implement it')
  assert.match(code('app/preview/[slug]/page.tsx'), /transformWpPost/, 'the preview must use lib/blog-transform.ts, not its own copy')
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

test('uploaded media is rewritten to the CDN and never left on WordPress', () => {
  const t = code('lib/blog-transform.ts')
  // ⚠️ `\/` NOT `/`. The needle lives inside a REGEX LITERAL, where the slashes are
  // escaped — so a source-text guard has to match the source's own escaping, not the
  // string it happens to describe. This assertion failed on its first run for exactly
  // that reason, which is the comment-stripping trap wearing yet another hat.
  assert.match(t, /wp-content\\?\/uploads/, 'the transform must rewrite uploads URLs to the CDN')
  assert.match(t, /blog\/media\//, 'the mapping is the identity path under a prefix — it is the contract with wordpress-media-mirror')

  // 🔴 THE REWRITE ALONE IS AN ASSUMPTION. Without the HEAD check a post can reference
  // an image the mirror has not copied yet, and the page ships with a hole.
  // ⚠️ SINCE WEB-16 (mirrors PULSE-243) THE CHECK IS renderableImageSources(), NOT A
  // HAND-WRITTEN `${CDN}/blog/media/` REGEX — it runs the exact sanitize → cdnImagesOnly
  // chain the page renders with, so it also catches a tool-logo mark, which the old regex
  // never did. See the "tool-logo mark is shape-checked and HEAD-checked" test above.
  const gen = code('scripts/generate-blog-posts.ts')
  assert.match(gen, /renderableImageSources/, 'the build must HEAD-check every rendered image AND tool-logo mark')

  // And the write credentials must NOT be here: three of them, in a pipeline that runs
  // on pull_request. That is the trade this design exists to avoid.
  for (const forbidden of [/STORAGE_PASSWORD/, /BUNNY_API_KEY/, /SOS_SECRET/]) {
    assert.doesNotMatch(gen, forbidden, 'CDN write credentials must never enter the website build')
  }
})

test('the preview refuses a post not tagged for this site, before it transforms anything', () => {
  // Pulse's blog posts (Phase 4, Pulse/docs/plans/
  // 30-09-2026-pulse-headless-cms-phase-4-design.md §7) live in the same WordPress as
  // ciphera.net's. Without a site filter this preview would happily render a Pulse
  // draft inside ciphera.net's own chrome — the exact cross-tenant leak PULSE-157 found
  // in the route-stub generator, one surface later.
  const src = code('app/preview/[slug]/page.tsx')
  const body = src.slice(src.indexOf('export default async function PreviewPage'))

  const nodeCheck = body.indexOf('if (!node) notFound()')
  const siteCheck = body.indexOf('if (!nodeSites(node).includes(BLOG_SITE)) notFound()')
  // 🔑 WEB-17 follow-up: the id path now runs the slug-null node through a fallback
  // (app/preview/[slug]/page.tsx) before the shared transform, so the call site reads
  // `transformWpPost(renderNode, CDN)` rather than `transformWpPost(node, CDN)` — same
  // single shared transform, same node, just possibly with its slug filled in first.
  const transformCall = body.indexOf('transformWpPost(renderNode, CDN)')

  assert.ok(nodeCheck > -1, 'the preview no longer guards against a missing node')
  assert.ok(siteCheck > -1, 'the preview no longer filters a draft by its ciphera_site term')
  assert.ok(transformCall > -1, 'the preview no longer runs the shared transform')
  assert.ok(
    nodeCheck < siteCheck && siteCheck < transformCall,
    'the site filter must run after the node is known to exist and before anything is transformed or rendered — ' +
      'PULSE-157 is what site-after-validation costs'
  )
})

test('the preview and the generator share ONE site-filter rule, not two copies', () => {
  // scripts/generate-blog-posts.ts used to declare its own `const SITE = 'ciphera-net'`
  // and its own inline `routeSites` walk. A preview written against a second copy of
  // that rule would eventually disagree with the build's — which is the same failure
  // the file header's "ONE TRANSFORM, TWO CALLERS" already exists to prevent, one
  // definition short.
  //
  // 🔁 WEB-26 round 2: the actual filtering CALL moved into lib/cms/blog-build.ts
  // (shared with cms-publisher.ts); generate-blog-posts.ts now only passes its raw,
  // UNFILTERED nodes through to it.
  const transform = code('lib/blog-transform.ts')
  assert.match(transform, /export const BLOG_SITE = 'ciphera-net'/, 'lib/blog-transform.ts must own the site slug')
  assert.match(transform, /export function nodeSites/, 'lib/blog-transform.ts must own the routeSites lookup')

  assert.doesNotMatch(code('scripts/generate-blog-posts.ts'), /const SITE = /, 'generate-blog-posts.ts must not declare its own site constant alongside the shared one')

  for (const f of ['lib/cms/blog-build.ts', 'app/preview/[slug]/page.tsx']) {
    const src = code(f)
    assert.match(src, /nodeSites/, `${f} must read a node's sites through the shared helper, not its own copy`)
    assert.match(src, /BLOG_SITE/, `${f} must compare against the shared site constant, not a local one`)
    assert.doesNotMatch(src, /const SITE = /, `${f} must not declare its own site constant alongside the shared one`)
    // 🔴 AN IMPORT IS NOT A CALL. The two checks above pass as long as both names appear
    // anywhere in the file — including just the import line — so deleting the actual
    // guard and leaving the import behind satisfies them. This asserts the real shape:
    // a nodeSites(...) call feeding an .includes(BLOG_SITE) check, which only exists
    // where the filter is genuinely applied.
    assert.match(
      src,
      /nodeSites\([^)]+\)[\s\S]{0,120}\.includes\(BLOG_SITE\)/,
      `${f} must actually call nodeSites(...).includes(BLOG_SITE) — not just import the names`
    )
  }
})

test('every blog ld+json script is escaped through jsonLdHtml, never a bare JSON.stringify (WEB-16, mirrors PULSE-243)', () => {
  // 🔴 CMS-AUTHORED VALUES (title, description, category, FAQ text) reach this script
  // tag. A plain JSON.stringify does not know it is sitting inside <script>, so a title
  // or FAQ answer containing `</script>` or `<!--` breaks out of the tag — whatever
  // follows in the source becomes ordinary page markup. jsonLdHtml() escapes exactly
  // those characters as JSON unicode escapes, which a JSON parser decodes back to the
  // same value: the crawler sees the same structured data, the HTML parser never sees
  // the raw `<`.
  for (const f of ['components/blog/post-view.tsx', 'app/blog/page.tsx']) {
    const src = code(f)
    assert.match(src, /from '@\/lib\/json-ld'/, `${f} must import jsonLdHtml`)
    assert.match(
      src,
      /dangerouslySetInnerHTML=\{\{\s*__html:\s*jsonLdHtml\(/,
      `${f}'s ld+json script must be built with jsonLdHtml(), not a bare JSON.stringify`
    )
    assert.doesNotMatch(
      src,
      /dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify\(/,
      `${f} must not feed a bare JSON.stringify(...) into a <script> tag`
    )
  }
})

test('jsonLdHtml escapes the script-breakout and comment-opener characters and round-trips through JSON.parse', () => {
  const src = code('lib/json-ld.ts')
  // The three characters that matter to an HTML parser reading script CONTENT.
  for (const needle of ["'<': '\\\\u003c'", "'>': '\\\\u003e'", "'&': '\\\\u0026'"]) {
    assert.ok(src.includes(needle), `lib/json-ld.ts must escape ${needle}`)
  }
  // The line/paragraph separator escapes — not an HTML concern, but valid JS string
  // characters some JSON-in-<script> tooling treats as a line terminator.
  assert.match(src, /\\u2028/)
  assert.match(src, /\\u2029/)
  assert.match(src, /export function jsonLdHtml/)
})

test('a slug WordPress could not have produced is refused, in the shape WPGraphQL actually returns (WEB-16, mirrors PULSE-243)', () => {
  const t = code('lib/blog-transform.ts')
  // WPGraphQL returns urldecode(post_name) — a percent-encoded byte never reaches this
  // build, so the shape check must accept DECODED non-ASCII (café), not re-encoded
  // percent octets (caf%c3%a9), or every non-ASCII title would fail every build.
  assert.match(t, /export const WP_SLUG\s*=\s*\/\^/, 'WP_SLUG must be exported for the generator and preview to share')
  assert.match(t, /WP_SLUG\.test\(slug\)/, 'transformWpPost must reject a slug WordPress could not have produced')
  assert.match(t, /not a shape WordPress could have produced/)
})

test('the feed escapes the full post URL, not just the slug (WEB-16, mirrors PULSE-243)', () => {
  const feed = code('app/feed.xml/route.ts')
  // 🔴 DEFENCE IN DEPTH: lib/blog-transform.ts's WP_SLUG check keeps a malformed slug
  // out of the build entirely, but this route reads whatever lib/blog-posts.gen.ts
  // hands it — the same reasoning that already applies escapeXml to title/description.
  assert.match(
    feed,
    /const url = escapeXml\(`https:\/\/ciphera\.net\/blog\/\$\{post\.slug\}`\)/,
    'the full URL must be escaped, not interpolated raw into <link>/<guid>'
  )
  assert.doesNotMatch(
    feed,
    /<link>https:\/\/ciphera\.net\/blog\/\$\{post\.slug\}<\/link>/,
    'the slug must never be interpolated unescaped directly into <link>'
  )
})
