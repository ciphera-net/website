import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * P1-a ("repair, don't refuse") applied to the glossary. A missing Definition,
 * missing/over-long SEO description, or missing SEO title is now REPAIRED; no category,
 * no title at all, or an empty body is SKIPPED (no safe repair exists — the same shape
 * of rule as the blog's); a dangling `related` slug is dropped from just that term; a
 * recovery-copy violation or a repo-hardcoded link to an unpublished term ships
 * UNCHANGED and is FLAGGED. What still fails the build is WordPress itself.
 *
 * 🔑 SPLIT ACROSS TWO FILES SINCE WEB-26: the transform (`lib/cms/glossary-build.ts`)
 * carries every per-term repair/skip/flag rule and is shared with
 * `scripts/cms-publisher.ts`; `scripts/generate-glossary.ts` keeps only what is
 * build-time-only (the WordPress fetch, the repo-hardcoded-link scan, the live-count
 * check) and the infra fail() paths. A test asserting the WRONG file now fails loudly
 * instead of silently stopping covering anything, which is exactly what happened to
 * this file across the refactor and is why every assertion below was re-pointed.
 *
 * 🔑 SOURCE-LEVEL, like blog-seam.test.mjs: CI runs `npm test` with no `npm ci` and no
 * network, so nothing here executes the transform — everything is asserted on the raw
 * source text. (The byte-identical-output proof — running the generator for real,
 * before and after this split, against the same WordPress response — is a one-off
 * verification step, not a thing this zero-dependency suite can do.)
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('no category, no title at all, or an empty body is SKIPPED, never a fail()', () => {
  const src = code('lib/cms/glossary-build.ts')
  assert.match(src, /repair\(ref, 'category', 'skipped', `\$\{ref\} has no category/)
  assert.match(src, /repair\(ref, 'title', 'skipped', `\$\{ref\} has no title at all/)
  assert.match(src, /repair\(ref, 'body', 'skipped', `\$\{ref\} has an empty body\.`\)/)

  assert.doesNotMatch(src, /fail\(/, 'the transform itself must never fail() — only the caller may, for infrastructure reasons')
})

test('a missing Definition, missing/over-long description, or missing SEO title is REPAIRED', () => {
  const src = code('lib/cms/glossary-build.ts')

  assert.match(src, /repair\(ref, 'definition', 'repaired', `\$\{ref\} has no Definition — repaired from the first ~155 chars of the body`\)/)
  assert.match(src, /repair\(ref, 'description', 'repaired', `\$\{ref\} has no SEO meta description/)
  assert.match(src, /meta description was \$\{description\.length\} chars, over \$\{DESC_LIMIT\}/)

  // 🔴 THE ONE THING THAT MUST STAY TRUE: description never falls back to Definition.
  // Both resolve from the term's own BODY TEXT independently — never from each other.
  // (Checked against the RAW source — code() strips the comment this lives in.)
  assert.match(read('lib/cms/glossary-build.ts'), /NO FALLBACK FROM THE DEFINITION TO THE META DESCRIPTION, EVER/)

  assert.match(src, /repair\(ref, 'title', 'repaired', `\$\{ref\} has no SEO title — repaired to the term name/)
})

test('a dangling related-term slug is dropped from just that term, not a build failure', () => {
  const src = code('lib/cms/glossary-build.ts')
  assert.match(src, /repair\(t\.slug, 'related', 'repaired', `related term "\$\{dangling\}" does not resolve — dropped/)
})

test('a repo-hardcoded link to an unpublished term ships unchanged and is flagged, not failed — build-time only', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.match(src, /field:\s*'repo-link',\s*\n\s*action:\s*'flagged'/)
  assert.doesNotMatch(src, /fail\(`these pages link to glossary terms/, 'a broken repo link must no longer fail the glossary build')
  // The scan walks the live source tree — lib/cms/glossary-build.ts must stay innocent of it
  // (a publish-time pass from cms-publisher.ts has no checked-out source tree to walk).
  assert.doesNotMatch(code('lib/cms/glossary-build.ts'), /readdirSync|readFileSync/, 'the shared transform must never touch the filesystem')
})

test('a recovery-copy honesty violation ships unchanged and is flagged, not failed', () => {
  const src = code('lib/cms/glossary-build.ts')
  assert.match(src, /checkRecoveryCopy/)
  assert.match(src, /repair\(\s*ref,\s*'recovery-copy',\s*'flagged'/)
})

test('duplicate published terms are tie-broken by the lowest WordPress databaseId', () => {
  const src = code('lib/cms/glossary-build.ts')
  assert.match(src, /\(a\.n\.databaseId \?\? Infinity\) - \(b\.n\.databaseId \?\? Infinity\)/)
})

test('the EXPECTED_TERMS collapse gate no longer fails the build — it was keyed to a constant, not the live site', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.doesNotMatch(
    src,
    /collapse && process\.env\.ALLOW_GLOSSARY_COUNT_DECREASE/,
    'the EXPECTED_TERMS-vs-hardcoded-constant collapse check must be gone entirely (P1-a names EXPECTED_TERMS explicitly)'
  )
  assert.match(src, /count < EXPECTED_TERMS/, 'the count must still be compared, but only to LOG')
})

test('WordPress unreachable, a non-200 response, or GraphQL errors still fail the build', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.match(src, /fail\(`cannot reach WordPress/)
  assert.match(src, /fail\(`WordPress returned HTTP/)
  assert.match(src, /fail\(`GraphQL errors/)
})

test('generate-glossary.ts calls the shared transform and records its repairs through the shared ledger', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.match(src, /import \{ buildGlossary, GLOSSARY_REPAIR_TYPE, type WpGlossaryTerm \} from '\.\.\/lib\/cms\/glossary-build'/)
  assert.match(src, /const REPAIR_TYPE = GLOSSARY_REPAIR_TYPE/)
  assert.match(src, /recordContentRepairs\(\[REPAIR_TYPE\], repairs\)/)

  const build = code('lib/cms/glossary-build.ts')
  assert.match(build, /export const GLOSSARY_REPAIR_TYPE = 'glossary-term'/)
  assert.match(
    build,
    /import \{ extractFaqs, textOf, truncateAtWordBoundary \} from '\.\.\/blog-transform'/,
    'the glossary must reuse the SAME truncation helper the blog uses — one definition, not two that drift'
  )
})

test('a category name is normalized/flagged through the shared, real-execution-tested module, never trusted as a closed set (verifier finding)', () => {
  const src = code('lib/cms/glossary-build.ts')
  assert.match(
    src,
    /import \{ normalizeGlossaryCategory, KNOWN_GLOSSARY_CATEGORIES \} from '\.\.\/glossary-category-rules\.mjs'/
  )
  assert.match(src, /const normalizedCategory = normalizeGlossaryCategory\(cat\.name\)/)
  assert.match(src, /if \(!normalizedCategory\.matched\) \{/)
  assert.match(src, /'category',\s*\n\s*'flagged'/)
  assert.match(src, /category: normalizedCategory\.name/, 'the written term must carry the NORMALIZED name, not the raw CMS string')
  assert.doesNotMatch(src, /category: cat\.name/, 'the raw taxonomy string must never reach lib/glossary.gen.ts unnormalized')

  // The type this defect was actually about must be widened, not left a closed union.
  const types = code('lib/glossary/types.ts')
  assert.match(types, /export type GlossaryCategory = string/)
  assert.doesNotMatch(
    types,
    /export type GlossaryCategory =\s*\n\s*\| 'Cryptography & authentication'/,
    'GlossaryCategory must no longer be a 4-member literal union — that IS the type error the verifier reproduced'
  )
})

test('the shared transform takes nodes already fetched and never reaches WordPress or the CDN itself', () => {
  const src = code('lib/cms/glossary-build.ts')
  assert.doesNotMatch(src, /\bfetch\(/, 'lib/cms/glossary-build.ts must stay a pure function — no network calls')
  assert.match(src, /export function buildGlossary\(nodes: WpGlossaryTerm\[\]\): GlossaryBuildResult/)
})
