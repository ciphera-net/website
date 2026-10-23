import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * P1-a ("repair, don't refuse") applied to the blog: lib/blog-transform.ts and
 * scripts/generate-blog-posts.ts. Every former `fail()`/`problems.push()` keyed on a
 * CMS content state either repairs the field inline or skips just that post — the ONLY
 * things that still stop the build are WordPress itself being unreachable/erroring, an
 * unset NEXT_PUBLIC_CDN_URL, and the post-count collapse guard.
 *
 * 🔑 SOURCE-LEVEL, like blog-seam.test.mjs: CI runs `npm test` with no `npm ci` and no
 * network, so nothing here executes transformWpPost() or a generator — everything is
 * asserted on the raw source text, feeding a "bad fixture" by proving the code path a
 * bad value would take, the same technique blog-seam.test.mjs already uses for the
 * gates it pins.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    // 🔴 THE NEGATIVE LOOKAHEAD MATTERS. `content/blog/*.mdx` (this file's own glob,
    // quoted several times) contains a literal `/*` that is NOT a comment opener — a
    // bare `/\/\*[\s\S]*?\*\//g` treats it as one and non-greedily eats everything up
    // to the NEXT unrelated `*/`, silently deleting whole functions from `code()`'s
    // output. `(?!\.)` excludes exactly that false start; every real block comment in
    // this codebase opens `/**` or `/* ` (a letter or `*`), never `/*.`.
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('transformWpPost repairs description, category/CTA and date instead of failing', () => {
  const t = code('lib/blog-transform.ts')
  assert.match(t, /export function truncateAtWordBoundary/, 'the shared word-boundary truncation helper must exist')
  assert.match(t, /export const ISO_DATE/, 'a date must be validated against one shape, shared with any other reader')

  // The REPAIRED fields push onto `repairs`, never `problems` (which the build
  // would once have failed on).
  assert.match(t, /description = truncateAtWordBoundary\(textOf\(html\), 155\)/, 'a missing description must repair from the body text')
  assert.match(t, /repairs\.push\(\{\s*field: 'description'/, 'description repair must be recorded in `repairs`, not `problems`')
  assert.match(t, /repairs\.push\(\{\s*field: 'category'/, 'a missing/CTA-less category must be recorded in `repairs`')
  // A post has no image of its own (23-10-2026): its share card is drawn from the title (lib/og), so the transform
  // neither asks WordPress for the social-image field nor repairs one.
  assert.doesNotMatch(t, /cipheraOgImage|field: 'ogImage'/, 'a post must not carry an image of its own')
  assert.match(t, /repairs\.push\(\{\s*field: 'date'/, 'a malformed date must be recorded in `repairs`')

  // The CTA repair itself: an empty cta must become `undefined`, not a present-but-
  // empty object, so a template's `post.cta ?? …` fallback can run.
  assert.match(t, /cta: ctaLabel && ctaHref \? \{ label: ctaLabel, href: ctaHref \} : undefined/)

  // Only a truly unrepairable field still lives in `problems` — and only those three.
  assert.match(t, /problems\.push\(\{ field: 'slug'/)
  assert.match(t, /problems\.push\(\{ field: 'title', message: 'the post has no title' \}\)/)
  assert.match(t, /problems\.push\(\{ field: 'body', message: 'the body is empty' \}\)/)
  assert.doesNotMatch(t, /problems\.push\(\{ field: 'description'/, 'description must no longer be a `problems` entry')
  assert.doesNotMatch(t, /problems\.push\(\{\s*field: 'category'/, 'category must no longer be a `problems` entry')
  assert.doesNotMatch(t, /problems\.push\(\{\s*field: 'ogImage'/, 'ogImage must no longer be a `problems` entry')
})

test('lib/cms/blog-build.ts skips a post with no safe repair and records it, never fails the build on it', () => {
  // 🔁 WEB-26 round 2: the per-node transform/skip/dedupe/recovery-copy logic moved
  // here, shared with cms-publisher.ts — see that module's own header.
  const built = code('lib/cms/blog-build.ts')

  // The shape: no slug/invalid slug → post is null → SKIP. Title/body → SKIP.
  assert.match(built, /if \(!post\) \{/)
  assert.match(built, /const blocking = problems\.filter\(\(p\) => p\.field === 'title' \|\| p\.field === 'body'\)/)
  assert.match(built, /repair\(ref, p\.field, 'skipped', p\.message\)/)
  assert.match(built, /repair\(post\.slug, p\.field, 'skipped', p\.message\)/)

  // Auto-repairs from the shared transform are recorded as 'repaired', not re-validated.
  assert.match(built, /for \(const r of fieldRepairs\) repair\(post\.slug, r\.field, 'repaired', r\.detail\)/)

  // A duplicate published slug is a SKIP — the lowest WordPress databaseId wins.
  assert.match(built, /\(a\.n\.databaseId \?\? Infinity\) - \(b\.n\.databaseId \?\? Infinity\)/, 'duplicates must be tie-broken by the LOWEST databaseId')
  assert.match(built, /duplicate published post for slug/)
  assert.doesNotMatch(built, /throw /, 'no per-post problem may reach a throw any more')

  // The recovery-copy honesty guard ships the post UNCHANGED and FLAGS it (P1-a point
  // 3) — it is explicitly NOT a skip and NOT a repair of the copy itself.
  assert.match(built, /checkRecoveryCopy/)
  assert.match(built, /repair\(\s*post\.slug,\s*'recovery-copy',\s*'flagged'/)

  const gen = code('scripts/generate-blog-posts.ts')
  assert.doesNotMatch(gen, /fail\(`duplicate published post/, 'a duplicate published post must no longer fail the build')

  // An unreachable image/tool-logo mark is DROPPED from the body (repaired), not fatal.
  assert.match(gen, /dropUnreachableMedia/)
  assert.match(gen, /repair\(\s*post\.slug,\s*'image',\s*'repaired'/)

  // A post's share card is drawn from its title (lib/og), so the build no longer looks one up on the CDN. Counted, not
  // spelled: the build makes exactly one kind of request to the CDN, the HEAD of each image the body will render.
  assert.doesNotMatch(gen, /post\.image|DEFAULT_OG_IMAGE/, 'the build must not check an uploaded card')
  assert.equal(gen.match(/method: 'HEAD'/g)?.length, 1, 'the generator must send HEAD requests from one helper only')
  assert.equal(gen.match(/\bawait head\(/g)?.length, 1, 'the only HEAD request is the body-media check')
  assert.match(gen, /for \(const src of survivingSources\) \{\s*const imgStatus = await head\(src\)/, 'the HEAD must be of a body image')

  // What MUST still fail: WordPress itself, and the deploy secret.
  assert.match(gen, /fail\(`cannot reach WordPress/)
  assert.match(gen, /fail\(`WordPress returned HTTP/)
  assert.match(gen, /fail\(`GraphQL errors/)
  assert.match(gen, /wp\.length > 0 && !process\.env\.NEXT_PUBLIC_CDN_URL/)

  // And the ONE content-shaped check P1-a keeps as a hard failure, UNCHANGED: the
  // shrink guard, because it compares against the LIVE site's own report, not a
  // hardcoded constant.
  assert.match(gen, /const collapse =\s*\n\s*liveCount !== null && shortfall > Math\.max\(2, Math\.floor\(liveCount \* 0\.25\)\)/)
  assert.match(gen, /fail\(\s*\n\s*`this build would publish \$\{summaries\.length\} posts/)
})

test('dropUnreachableMedia removes exactly the unreachable <img> or tool-logo mark, nothing else', () => {
  const html = code('lib/blog-html.ts')
  assert.match(html, /export function dropUnreachableMedia/)
  assert.match(html, /badImgSrcs: ReadonlySet<string>/)
  assert.match(html, /badToolLogoDataSrcs: ReadonlySet<string>/)
  // img removal keys off the exact `src` value renderableImageSources already computed.
  assert.match(html, /\\bsrc=\["'\]\(\[\^"'\]\*\)\["'\]/)
  // tool-logo removal keys off `data-ciphera-block="tool-logo"` + the exact `data-src`.
  assert.match(html, /data-ciphera-block=\["'\]tool-logo\["'\]/)
})

test('an off-CDN image or malformed tool-logo mark that cdnImagesOnly/toolLogosValidated silently strip is still recorded (verifier finding, ledger gap closed)', () => {
  const html = code('lib/blog-html.ts')
  // rawMediaRefs reads the body with neither sanitizer applied, so it sees exactly what
  // renderableImageSources's surviving set does not.
  assert.match(html, /export function rawMediaRefs/)
  assert.match(html, /rawParsePipeline = unified\(\)/)
  assert.doesNotMatch(
    html,
    /rawParsePipeline = unified\(\)\s*\.use\(rehypeParse, \{ fragment: true \}\)\.use\(cipheraBlocks\)\.use\(rehypeSanitize/,
    'rawParsePipeline must stop before sanitize — otherwise it sees the same set renderableImageSources does'
  )

  const gen = code('scripts/generate-blog-posts.ts')
  assert.match(gen, /rawMediaRefs/, 'generate-blog-posts.ts must diff the raw refs against the surviving set')
  assert.match(gen, /is not on the CDN \(or is otherwise invalid\) — dropped from the post body/)
  assert.match(gen, /tool-logo mark "\$\{ref\.value\}" does not match the required shape — dropped from the post body/)
})
