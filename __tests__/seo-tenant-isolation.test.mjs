import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Two tenants share one WordPress (Pulse, Phase 4 — Pulse/docs/plans/
 * 30-09-2026-pulse-headless-cms-phase-4-design.md). A route stub that belongs to
 * the OTHER site must be filtered out before this site looks at its path at all, or a
 * Pulse editor publishing a stub without a path would be read as THIS site's problem.
 *
 * 🔁 UPDATED 07-10-2026 (P1-a, "repair, don't refuse"): an empty or malformed path no
 * longer fails the build — generate-seo.ts SKIPS just that stub and records it
 * (lib/content-repair-log.ts) instead. The site filter still has to run first, for the
 * same reason as before: validating a Pulse stub's path as if it were this site's own
 * would attribute the wrong tenant's mistake.
 *
 * 🔑 SOURCE-LEVEL, like blog-seam.test.mjs: CI runs `npm test` with no `npm ci` and
 * no network, so the generator cannot be executed here. Comments are stripped
 * first — the comment above the loop describes the old, wrong order in prose.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
function code(p) {
  return readFileSync(join(root, p), 'utf-8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

/**
 * 🔁 WEB-26 round 2: the per-stub shape checks, dedupe and field repairs moved into
 * lib/cms/route-build.ts (buildRouteSeo), shared with cms-publisher.ts — see that
 * module's own header. generate-seo.ts now only fetches, filters by site, and calls
 * it; the tests that used to read the per-stub loop out of generate-seo.ts now read
 * it out of route-build.ts instead. The site-isolation property this file is named
 * for is actually STRONGER now: buildRouteSeo never sees an un-filtered node at all.
 */

test('generate-seo filters by site BEFORE calling the shared transform', () => {
  const src = code('scripts/generate-seo.ts')
  const siteFilterAt = src.indexOf('.includes(SITE))')
  const buildCallAt = src.indexOf('buildRouteSeo(nodes)')
  assert.ok(siteFilterAt > 0, 'the per-site filter is missing')
  assert.ok(buildCallAt > 0, 'generate-seo.ts must call the shared buildRouteSeo')
  assert.ok(
    siteFilterAt < buildCallAt,
    "another site's malformed stub would be read as this site's own: the site filter must run before buildRouteSeo ever sees a node"
  )
})

test('an unusable route-stub path is skipped and recorded, never a build failure', () => {
  const src = code('lib/cms/route-build.ts')
  assert.doesNotMatch(src, /if \(!p\) fail\(/, 'an empty path must no longer fail the build (P1-a)')
  assert.doesNotMatch(src, /if \(!p\.startsWith\('\/'\)\) fail\(/, 'a malformed path must no longer fail the build (P1-a)')
  assert.match(src, /'skipped'/, 'an unusable path must be recorded as skipped')
  assert.match(code('scripts/generate-seo.ts'), /recordContentRepairs/, 'generate-seo.ts must still record the repairs/skips buildRouteSeo returns')
})

test('an empty title, description or off-CDN OG image is repaired, never a build failure', () => {
  const src = code('lib/cms/route-build.ts')
  assert.doesNotMatch(src, /if \(!title\) fail\(/, 'an empty title must no longer fail the build')
  assert.doesNotMatch(src, /if \(!description\) fail\(/, 'an empty description must no longer fail the build')
  assert.doesNotMatch(src, /fail\(`\$\{p\}: OG image is not on cdn\.ciphera\.net/, 'a non-CDN OG image must no longer fail the build')
  assert.match(src, /'title', 'repaired'/, "an empty title must repair — seoFor()'s per-field merge already falls back to the route's own metadata")
  assert.match(src, /'description', 'repaired'/)
  assert.match(src, /'ogImage', 'repaired'/)
})

test('a duplicate route-stub path keeps the lowest WordPress databaseId', () => {
  const src = code('lib/cms/route-build.ts')
  assert.match(src, /\(a\.databaseId \?\? Infinity\) - \(b\.databaseId \?\? Infinity\)/)
  assert.doesNotMatch(src, /fail\(`duplicate stub for/, 'a duplicate stub must no longer fail the build')
})

test('the EXPECTED_ROUTES exact-count gate no longer fails the build', () => {
  const src = code('scripts/generate-seo.ts')
  assert.doesNotMatch(src, /if \(seenCount !== EXPECTED_ROUTES\) \{\s*\n\s*fail\(/, 'the exact-equality gate must be gone')
  assert.match(src, /seenCount !== EXPECTED_ROUTES/, 'the count must still be compared, but only to LOG')
})

test('the publisher applies the SAME route-seo transform as the build', () => {
  const src = code('scripts/cms-publisher.ts')
  assert.match(src, /buildRouteSeo\(nodes\)/, 'cms-publisher.ts must call the shared lib/cms/route-build.ts transform, not its own copy')
})

test('WordPress unreachable, a non-200 response, or GraphQL errors still fail the build', () => {
  const src = code('scripts/generate-seo.ts')
  assert.match(src, /fail\(`cannot reach WordPress/)
  assert.match(src, /fail\(`WordPress returned HTTP/)
  assert.match(src, /fail\(`GraphQL errors/)
})
