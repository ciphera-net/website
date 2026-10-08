import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The glossary's request-time runtime seam (WEB-26, design §4.1.3/§4.1.3a).
 *
 * 🔑 SOURCE-LEVEL, like blog-seam.test.mjs, and for an extra reason beyond "no network,
 * no npm ci": `lib/glossary/index.ts` imports `../glossary.gen`, which does not exist
 * until `npm run generate:glossary` has run against a reachable WordPress — a real
 * `import()` here would pass on a machine that has just run prebuild and fail
 * everywhere else, including CI. The real-execution proof for this seam is a one-off,
 * manual run (documented in the implementing commit): the generator run twice — before
 * and after the extraction in lib/cms/glossary-build.ts — against the same recorded
 * WordPress response, diffed byte-for-byte.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('CMS_RUNTIME_KINDS is a code constant (glossary on since 08-10-2026), not a required env var', () => {
  const src = code('lib/cms/runtime-config.ts')
  // A build-time constant: Next decides static vs dynamic when it builds, so the kinds served at
  // request time must be on in the build. Rolling one back is removing it from this list.
  assert.match(src, /const DEFAULT_RUNTIME_KINDS: readonly string\[\] = \['glossary', 'blog', 'route', 'redirect'\]/)
  assert.match(src, /process\.env\.CMS_RUNTIME_KINDS/, 'an env override must exist for Phase 5, without being required')
})

test('every glossary accessor is async, and the flag-off path never reaches the network', () => {
  const src = code('lib/glossary/index.ts')
  for (const fn of ['getGlossaryTerms', 'getGlossaryCategories', 'getTerm', 'termsByCategory', 'getGlossaryRuntimeState']) {
    assert.match(src, new RegExp(`export async function ${fn}\\(`), `${fn} must be async`)
  }
  assert.match(src, /if \(!isRuntimeKind\(KIND\)\) \{\s*\n\s*lastState = \{ enabled: false, source: 'seed' \}\s*\n\s*return SEED_TERMS/,
    'the flag-off branch must short-circuit to the seed before any CDN call')
})

test('a CDN failure or an unknown schema falls back to the seed WHOLESALE, never throws past this module', () => {
  const src = code('lib/glossary/index.ts')
  assert.match(src, /kind\.schema !== KNOWN_SCHEMA/)
  assert.match(src, /lastState = \{ enabled: true, source: 'seed' \}/)
  // Two distinct places this fallback fires from: index-shaped failure (no index / no
  // kind / wrong schema) and a thrown index fetch (CDN unreachable) — both present.
  assert.match(src, /if \(!index \|\| !kind \|\| kind\.schema !== KNOWN_SCHEMA\)/)
  assert.match(src, /\} catch \{\s*\n(\s*\/\/.*\n)*\s*lastState = \{ enabled: true, source: 'seed' \}\s*\n\s*return SEED_TERMS\s*\n\s*\}/)
})

test('a single document failure falls back ITEM BY ITEM, not the whole kind', () => {
  const src = code('lib/glossary/index.ts')
  assert.match(src, /for \(const \[slug, path\] of Object\.entries\(kind\.items\)\) \{/)
  assert.match(src, /const fallback = seedBySlug\.get\(slug\)/)
  assert.doesNotMatch(
    src,
    /catch \{\s*\n\s*lastState = \{ enabled: true, source: 'seed' \}\s*\n\s*return SEED_TERMS\s*\n\s*\}\s*\n\s*\}\s*\n\s*lastState = \{ enabled: true, source: 'cdn'/,
    'a per-item failure must not fall back to the whole kind'
  )
})

test('the content client treats an index 404 as empty, never as a failure, and documents cache forever', () => {
  const src = code('lib/cms/content-client.ts')
  assert.match(src, /if \(res\.status === 404\) \{\s*\n\s*indexCache = \{ index: null, fetchedAt: now \}\s*\n\s*return null\s*\n\s*\}/)
  assert.doesNotMatch(src, /status === 404[\s\S]{0,80}throw/, 'a 404 index must never throw')
  assert.match(src, /documentCache\.set\(path, doc\)/)
  assert.doesNotMatch(src, /documentCache\.delete|setTimeout.*documentCache/, 'a content-addressed document must never be evicted')
})

test('the index cache respects INDEX_CACHE_MS, not a longer or shorter window', () => {
  const src = code('lib/cms/content-client.ts')
  assert.match(src, /if \(indexCache && now - indexCache\.fetchedAt < INDEX_CACHE_MS\) return indexCache\.index/)
  assert.match(code('lib/cms/runtime-config.ts'), /export const INDEX_CACHE_MS = 15_000/)
})

test('every CDN read carries the 3s timeout, both for the index and for a document', () => {
  const src = code('lib/cms/content-client.ts')
  const timeoutCalls = src.match(/signal: AbortSignal\.timeout\(FETCH_TIMEOUT_MS\)/g) ?? []
  assert.equal(timeoutCalls.length, 2, 'both getContentIndex and getContentDocument must pass the same timeout')
  assert.match(code('lib/cms/runtime-config.ts'), /export const FETCH_TIMEOUT_MS = 3_000/)
})

test('the term page has no generateStaticParams — a CMS-runtime kind renders dynamically', () => {
  const src = code('app/glossary/[slug]/page.tsx')
  assert.doesNotMatch(src, /generateStaticParams/, 'a build-time param list would miss a term published after this image was built')
  assert.match(src, /const term = await getTerm\(slug\)/)
  assert.match(src, /await Promise\.all\(term\.related\.map\(\(s\) => getTerm\(s\)\)\)/, 'related-term lookups must resolve concurrently, not one await per item in a .map')
})

test('the sitemap reads each glossary term\'s own modified date, not a frozen one', () => {
  const src = code('app/sitemap.ts')
  assert.doesNotMatch(src, /lastModified: '2026-07-10'[\s\S]{0,40}glossaryTerms\.map/, 'every term row must no longer share one hardcoded date')
  assert.match(src, /term\.modified \? new Date\(term\.modified\) : glossaryLastModified/)
})

test('/sys/seo-state is dynamic and reports both a build-time watermark per kind and a runtime block', () => {
  const src = code('app/sys/seo-state/route.ts')
  assert.doesNotMatch(src, /export const dynamic = 'force-static'/, 'force-static would report the seed forever once a kind moves to runtime')
  assert.match(src, /export const dynamic = 'force-dynamic'/)
  assert.match(src, /watermarks: \{/)
  assert.match(src, /runtime: \{/)
  assert.match(src, /glossaryRuntime\.source/)
  // Every existing field must still be present — byte-compatible, additive only.
  for (const existing of ['watermark:', 'routes: SEO_ROUTE_COUNT', 'posts: SEO_POST_COUNT', 'redirects: REDIRECT_COUNT', 'glossary: GLOSSARY_COUNT', 'build: process.env.CIPHERA_BUILD_SHA', 'repairs: CONTENT_REPAIRS.length', 'repairs_detail: CONTENT_REPAIRS.slice(0, 50)']) {
    assert.ok(src.includes(existing), `/sys/seo-state lost the existing field: ${existing}`)
  }
})

test('generate-llms.ts reads the build-time seed directly, never the async runtime seam', () => {
  const src = code('scripts/generate-llms.ts')
  assert.match(src, /import \{ generatedGlossaryTerms as glossaryTerms \} from '\.\.\/lib\/glossary\.gen'/)
  assert.doesNotMatch(src, /from '\.\.\/lib\/glossary'(?!\.gen)/, 'a build CLI script has no request to await the seam for')
})
