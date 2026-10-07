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
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('transformWpPost repairs description, category/CTA, OG image and date instead of failing', () => {
  const t = code('lib/blog-transform.ts')
  assert.match(t, /export function truncateAtWordBoundary/, 'the shared word-boundary truncation helper must exist')
  assert.match(t, /export const ISO_DATE/, 'a date must be validated against one shape, shared with any other reader')

  // The four REPAIRED fields push onto `repairs`, never `problems` (which the build
  // would once have failed on).
  assert.match(t, /description = truncateAtWordBoundary\(textOf\(html\), 155\)/, 'a missing description must repair from the body text')
  assert.match(t, /repairs\.push\(\{\s*field: 'description'/, 'description repair must be recorded in `repairs`, not `problems`')
  assert.match(t, /repairs\.push\(\{\s*field: 'category'/, 'a missing/CTA-less category must be recorded in `repairs`')
  assert.match(t, /repairs\.push\(\{\s*field: 'ogImage'/, 'a non-CDN OG image must be recorded in `repairs`')
  assert.match(t, /repairs\.push\(\{\s*field: 'date'/, 'a malformed date must be recorded in `repairs`')

  // The CTA repair itself: an empty cta must become `undefined`, not a present-but-
  // empty object — that is what lets post-view.tsx's existing `?? CATEGORY_CTA[...]
  // ?? DEFAULT_CTA` fallback actually run.
  assert.match(t, /cta: ctaLabel && ctaHref \? \{ label: ctaLabel, href: ctaHref \} : undefined/)

  // Only a truly unrepairable field still lives in `problems` — and only those three.
  assert.match(t, /problems\.push\(\{ field: 'slug'/)
  assert.match(t, /problems\.push\(\{ field: 'title', message: 'the post has no title' \}\)/)
  assert.match(t, /problems\.push\(\{ field: 'body', message: 'the body is empty' \}\)/)
  assert.doesNotMatch(t, /problems\.push\(\{ field: 'description'/, 'description must no longer be a `problems` entry')
  assert.doesNotMatch(t, /problems\.push\(\{\s*field: 'category'/, 'category must no longer be a `problems` entry')
  assert.doesNotMatch(t, /problems\.push\(\{\s*field: 'ogImage'/, 'ogImage must no longer be a `problems` entry')
})

test('generate-blog-posts.ts skips a post with no safe repair and records it, never fails the build on it', () => {
  const gen = code('scripts/generate-blog-posts.ts')

  // The shape: no slug/invalid slug → post is null → SKIP. Title/body → SKIP.
  assert.match(gen, /if \(!post\) \{/)
  assert.match(gen, /const blocking = problems\.filter\(\(p\) => p\.field === 'title' \|\| p\.field === 'body'\)/)
  assert.match(gen, /repair\(ref, p\.field, 'skipped', p\.message\)/)
  assert.match(gen, /repair\(post\.slug, p\.field, 'skipped', p\.message\)/)

  // Auto-repairs from the shared transform are recorded as 'repaired', not re-validated.
  assert.match(gen, /for \(const r of fieldRepairs\) repair\(post\.slug, r\.field, 'repaired', r\.detail\)/)

  // A duplicate published slug, and a slug shared with a git-tracked MDX post, are both
  // SKIPS now — the lowest WordPress databaseId wins a WP/WP duplicate; the MDX file
  // wins an MDX/WP collision (it is the pre-existing, git-tracked source).
  assert.match(gen, /\(a\.n\.databaseId \?\? Infinity\) - \(b\.n\.databaseId \?\? Infinity\)/, 'duplicates must be tie-broken by the LOWEST databaseId')
  assert.match(gen, /duplicate published post for slug/)
  assert.match(gen, /exists in BOTH content\/blog\//)
  assert.doesNotMatch(gen, /fail\(`\$\{post\.slug\}/, 'a per-post problem must never reach fail() any more')
  assert.doesNotMatch(gen, /fail\(`slug "\$\{post\.slug\}" exists in BOTH/, 'an MDX/WP slug collision must no longer fail the build')
  assert.doesNotMatch(gen, /fail\(`duplicate published post/, 'a duplicate published post must no longer fail the build')

  // The recovery-copy honesty guard ships the post UNCHANGED and FLAGS it (P1-a point
  // 3) — it is explicitly NOT a skip and NOT a repair of the copy itself.
  assert.match(gen, /checkRecoveryCopy/)
  assert.match(gen, /repair\(\s*post\.slug,\s*'recovery-copy',\s*'flagged'/)
  assert.doesNotMatch(gen, /fail\(\s*`\$\{post\.slug\} makes a false/, 'a recovery-copy violation must no longer fail the build')

  // An unreachable image/tool-logo mark is DROPPED from the body (repaired), not fatal.
  assert.match(gen, /dropUnreachableMedia/)
  assert.match(gen, /repair\(\s*post\.slug,\s*'image',\s*'repaired'/)

  // The OG-card gate falls back to the site default image instead of failing.
  assert.match(gen, /post\.image = DEFAULT_OG_IMAGE/)
  assert.match(gen, /DEFAULT_OG_IMAGE = '\/og-homepage\.png'/)

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
