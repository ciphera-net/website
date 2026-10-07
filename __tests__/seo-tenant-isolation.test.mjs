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

test('generate-seo filters by site before it looks at a stub\'s path', () => {
  const src = code('scripts/generate-seo.ts')
  const siteFilterAt = src.indexOf('.includes(SITE))')
  const loop = src.slice(src.indexOf('for (const n of nodes)'))
  const emptyPath = loop.indexOf('if (!p) {')
  const noSlash = loop.indexOf("if (!p.startsWith('/')) {")
  assert.ok(siteFilterAt > 0, 'the per-site filter is missing before the stub loop')
  assert.ok(emptyPath > 0 && noSlash > 0, 'the path checks are missing from the stub loop')
  assert.ok(
    siteFilterAt < src.indexOf('for (const n of nodes)'),
    "another site's malformed stub would be read as this site's own: the site filter must run before the per-stub loop"
  )
})

test('an unusable route-stub path is skipped and recorded, never a build failure', () => {
  const src = code('scripts/generate-seo.ts')
  assert.doesNotMatch(src, /if \(!p\) fail\(/, 'an empty path must no longer fail the build (P1-a)')
  assert.doesNotMatch(src, /if \(!p\.startsWith\('\/'\)\) fail\(/, 'a malformed path must no longer fail the build (P1-a)')
  assert.match(src, /'skipped'/, 'an unusable path must be recorded as skipped')
  assert.match(src, /recordContentRepairs/, 'generate-seo.ts must record its repairs/skips')
})

test('an empty title, description or off-CDN OG image is repaired, never a build failure', () => {
  const src = code('scripts/generate-seo.ts')
  assert.doesNotMatch(src, /if \(!title\) fail\(/, 'an empty title must no longer fail the build')
  assert.doesNotMatch(src, /if \(!description\) fail\(/, 'an empty description must no longer fail the build')
  assert.doesNotMatch(src, /fail\(`\$\{p\}: OG image is not on cdn\.ciphera\.net/, 'a non-CDN OG image must no longer fail the build')
  assert.match(src, /'title', 'repaired'/, "an empty title must repair — seoFor()'s per-field merge already falls back to the route's own metadata")
  assert.match(src, /'description', 'repaired'/)
  assert.match(src, /'ogImage', 'repaired'/)
})

test('a duplicate route-stub path keeps the lowest WordPress databaseId', () => {
  const src = code('scripts/generate-seo.ts')
  assert.match(src, /\(a\.databaseId \?\? Infinity\) - \(b\.databaseId \?\? Infinity\)/)
  assert.doesNotMatch(src, /fail\(`duplicate stub for/, 'a duplicate stub must no longer fail the build')
})

test('the EXPECTED_ROUTES exact-count gate no longer fails the build', () => {
  const src = code('scripts/generate-seo.ts')
  assert.doesNotMatch(src, /if \(seen\.size !== EXPECTED_ROUTES\) \{\s*\n\s*fail\(/, 'the exact-equality gate must be gone')
  assert.match(src, /seen\.size !== EXPECTED_ROUTES/, 'the count must still be compared, but only to LOG')
})

test('WordPress unreachable, a non-200 response, or GraphQL errors still fail the build', () => {
  const src = code('scripts/generate-seo.ts')
  assert.match(src, /fail\(`cannot reach WordPress/)
  assert.match(src, /fail\(`WordPress returned HTTP/)
  assert.match(src, /fail\(`GraphQL errors/)
})
