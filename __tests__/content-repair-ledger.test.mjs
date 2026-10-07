import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * P1-a ("repair, don't refuse" — Public/docs/plans/07-10-2026-cms-made-easy-design.md
 * §4.1): the shared content-repair ledger every generate-*.ts script writes to instead
 * of failing the build on a bad CMS content state.
 *
 * 🔑 SOURCE-LEVEL, like blog-seam.test.mjs and seo-tenant-isolation.test.mjs: CI runs
 * `npm test` with no `npm ci` and no network (test.yml), so nothing here imports a
 * `.ts` module (that needs tsx/ts-node, which need node_modules) or executes a
 * generator (which needs WordPress). Everything is asserted on the raw source text.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('lib/content-repairs.gen.ts is committed as an empty stub', () => {
  // 🔴 LIKE lib/redirects.gen.ts AND lib/blog-wp.gen.ts: a fresh clone (and
  // app/sys/seo-state/route.ts) must resolve this module before any generate-*.ts
  // script has ever run.
  const stub = code('lib/content-repairs.gen.ts')
  assert.match(stub, /export const CONTENT_REPAIRS: ContentRepairEntry\[\] = \[\]/, 'the committed stub must be an empty array')
  assert.doesNotMatch(stub, /localhost|127\.0\.0\.1/, 'a local port-forward URL must never be committed')
})

test('the repair entry type carries exactly the specified shape', () => {
  const types = code('lib/content-repair-types.ts')
  for (const field of ['type', 'ref', 'field', 'action', 'detail']) {
    assert.match(types, new RegExp(`\\b${field}\\b`), `ContentRepairEntry is missing "${field}"`)
  }
  assert.match(types, /'repaired' \| 'skipped' \| 'flagged'/, 'the three actions must be repaired | skipped | flagged')
})

test('recordContentRepairs owns its entries by type, not by a global reset', () => {
  // 🔑 The four generate-*.ts scripts run as SEPARATE processes in `npm run prebuild`
  // (seo && redirects && … && blog && glossary && …) — there is no shared memory to
  // accumulate repairs in. Each script must replace only the entries whose `type` it
  // itself owns, or re-running one standalone would wipe what the others found.
  const log = code('lib/content-repair-log.ts')
  assert.match(log, /export function recordContentRepairs\(ownedTypes: string\[\], entries: ContentRepairEntry\[\]\)/)
  assert.match(log, /filter\(\(e\) => !ownedTypes\.includes\(e\.type\)\)/, 'a call must only replace entries of the types it owns')
  assert.match(log, /CONTENT-REPAIR/, 'every entry must print a CONTENT-REPAIR-prefixed build-log line')
})

test('every generate-*.ts script records its repairs with its own owned type', () => {
  const scripts = {
    'scripts/generate-seo.ts': 'route-seo',
    'scripts/generate-redirects.ts': 'redirect',
    'scripts/generate-blog-posts.ts': 'blog-post',
    'scripts/generate-glossary.ts': 'glossary-term',
  }
  for (const [file, type] of Object.entries(scripts)) {
    const src = code(file)
    assert.match(src, /import \{ recordContentRepairs \} from '\.\.\/lib\/content-repair-log'/, `${file} must import recordContentRepairs`)
    assert.match(src, new RegExp(`REPAIR_TYPE = '${type}'`), `${file} must own the '${type}' repair type`)
    assert.match(src, /recordContentRepairs\(\[REPAIR_TYPE\], repairs\)/, `${file} must call recordContentRepairs before exiting`)
  }
})

test('/sys/seo-state exposes repairs and repairs_detail, and keeps every existing field', () => {
  const route = code('app/sys/seo-state/route.ts')
  assert.match(route, /import \{ CONTENT_REPAIRS \} from '@\/lib\/content-repairs\.gen'/)
  assert.match(route, /repairs: CONTENT_REPAIRS\.length/)
  assert.match(route, /repairs_detail: CONTENT_REPAIRS\.slice\(0, 50\)/, 'repairs_detail must be capped at 50')
  // Byte-compatible: nothing already served stops being served.
  for (const existing of ['watermark:', 'routes: SEO_ROUTE_COUNT', 'posts: SEO_POST_COUNT', 'redirects: REDIRECT_COUNT', 'glossary: GLOSSARY_COUNT', "build: process.env.CIPHERA_BUILD_SHA"]) {
    assert.ok(route.includes(existing), `/sys/seo-state lost the existing field: ${existing}`)
  }
})
