import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Two tenants share one WordPress (Pulse, Phase 4 — Pulse/docs/plans/
 * 30-09-2026-pulse-headless-cms-phase-4-design.md). A route stub that belongs to
 * the OTHER site must be skipped before this site validates anything, or a Pulse
 * editor publishing a stub without a path fails every ciphera.net build.
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

test('generate-seo filters by site before it validates a stub', () => {
  const src = code('scripts/generate-seo.ts')
  const loop = src.slice(src.indexOf('for (const n of nodes)'))
  const siteSkip = loop.indexOf('if (!sites.includes(SITE)) continue')
  const emptyPath = loop.indexOf("if (!p) fail(")
  const noSlash = loop.indexOf("if (!p.startsWith('/')) fail(")
  assert.ok(siteSkip > 0, 'the per-site skip is missing from the stub loop')
  assert.ok(emptyPath > 0 && noSlash > 0, 'the path checks are missing from the stub loop')
  assert.ok(
    siteSkip < emptyPath && siteSkip < noSlash,
    "another site's malformed stub would fail this build: the site skip must come before the path checks"
  )
})
