import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * P1-a ("repair, don't refuse") applied to scripts/generate-redirects.ts. Every
 * content-shaped check — a missing half, a malformed path, a self-redirect, a
 * duplicate `from`, shadowing a live page or post, a redirect chain — is now SKIPPED
 * or (for a chain) REPAIRED instead of failing the build. The ONE EXCEPTION, kept
 * exactly as it was, is a Tier-1 collision: it is load-bearing (the /transparency
 * rules are cited inside GPG-signed canaries) and still refuses the build.
 *
 * 🔑 SOURCE-LEVEL, like blog-seam.test.mjs: CI runs `npm test` with no `npm ci` and no
 * network, so nothing here executes the generator — everything is asserted on the raw
 * source text.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
function code(p) {
  return readFileSync(join(root, p), 'utf-8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('a Tier-1 collision STILL fails the build — the one hard failure P1-a keeps', () => {
  const src = code('scripts/generate-redirects.ts')
  const collisionAt = src.indexOf('TIER1_EXACT.includes(from)')
  assert.ok(collisionAt > -1, 'the Tier-1 collision check must still exist')
  const after = src.slice(collisionAt, collisionAt + 400)
  assert.match(after, /fail\(/, 'a Tier-1 collision must still call fail() — it is load-bearing, not a repairable content state')
  assert.match(after, /collides with a Tier-1 rule/)
})

test('every other redirect content check is now a skip or a repair, never a fail()', () => {
  const src = code('scripts/generate-redirects.ts')

  for (const needle of [
    'missing one half',
    'is not a site-relative path',
    'points at itself',
    'is a LIVE page on this site',
    'is a LIVE blog post',
    'duplicate source, keeping the lowest databaseId',
  ]) {
    assert.ok(src.includes(needle), `generate-redirects.ts lost its check for: ${needle}`)
  }

  // None of these may reach fail() any more — only the Tier-1 branch may, and its own
  // message ("collides with a Tier-1 rule") is distinct from every one of these.
  for (const forbidden of [
    /fail\(`a published redirect is missing one half/,
    /fail\(`redirect source "\$\{from\}" is not a site-relative path/,
    /fail\(`redirect "\$\{from\}" points at itself/,
    /fail\(`redirect source "\$\{from\}" is a LIVE/,
    /fail\(`two published redirects both claim/,
  ]) {
    assert.doesNotMatch(src, forbidden, `${forbidden} must no longer fail the build (P1-a)`)
  }

  // Duplicates are tie-broken by the lowest WordPress databaseId.
  assert.match(src, /\(a\.databaseId \?\? Infinity\) - \(b\.databaseId \?\? Infinity\)/)
})

test('a redirect chain is flattened to its final destination; a true cycle is skipped', () => {
  const src = code('scripts/generate-redirects.ts')
  assert.match(src, /repointed "\$\{source\}" straight at "\$\{dest\}"/)
  assert.match(src, /'destination',\s*\n\s*'repaired'/)
  assert.match(src, /is part of a CYCLE/)
  assert.match(src, /'from', 'skipped', `redirect "\$\{source\}" is part of a CYCLE/)
})

test('the EXPECTED_REDIRECTS exact-count gate no longer fails the build', () => {
  const src = code('scripts/generate-redirects.ts')
  assert.doesNotMatch(
    src,
    /if \(bySource\.size !== EXPECTED_REDIRECTS\)/,
    'the exact-equality gate must be gone — WordpressRedirectsDropped already alerts on a drop'
  )
  assert.match(src, /flattened\.size !== EXPECTED_REDIRECTS/, 'the count must still be compared, but only to LOG, never to fail()')
})

test('WordPress unreachable, a non-200 response, or GraphQL errors still fail the build', () => {
  const src = code('scripts/generate-redirects.ts')
  assert.match(src, /fail\(`cannot reach WordPress/)
  assert.match(src, /fail\(`WordPress returned HTTP/)
  assert.match(src, /fail\(`GraphQL errors/)
})

test('generate-redirects.ts records its repairs/skips through the shared ledger', () => {
  const src = code('scripts/generate-redirects.ts')
  assert.match(src, /recordContentRepairs\(\[REPAIR_TYPE\], repairs\)/)
  assert.match(src, /REPAIR_TYPE = 'redirect'/)
})

test('validPath delegates to the shared, real-execution-tested allowlist (verifier finding)', () => {
  const src = code('scripts/generate-redirects.ts')
  assert.match(
    src,
    /import \{ validRedirectPath \} from '\.\.\/lib\/redirect-path-rules\.mjs'/,
    'generate-redirects.ts must import the zero-dependency allowlist, not re-denylist characters inline'
  )
  assert.match(src, /function validPath\(p: string\): boolean \{\s*return validRedirectPath\(p\)/)
  // The old denylist must actually be gone, not merely supplemented.
  assert.ok(
    !src.includes(String.raw`[\s<>"'\\]`),
    'the character denylist this verifier finding was about must be removed, not kept alongside the allowlist'
  )
})
