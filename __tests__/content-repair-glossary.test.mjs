import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * P1-a ("repair, don't refuse") applied to scripts/generate-glossary.ts. A missing
 * Definition, missing/over-long SEO description, or missing SEO title is now REPAIRED;
 * no category, no title at all, or an empty body is SKIPPED (no safe repair exists —
 * the same shape of rule as the blog's); a dangling `related` slug is dropped from just
 * that term; a recovery-copy violation or a repo-hardcoded link to an unpublished term
 * ships UNCHANGED and is FLAGGED. What still fails the build is WordPress itself.
 *
 * 🔑 SOURCE-LEVEL, like blog-seam.test.mjs: CI runs `npm test` with no `npm ci` and no
 * network, so nothing here executes the generator — everything is asserted on the raw
 * source text.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('no category, no title at all, or an empty body is SKIPPED, never a fail()', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.match(src, /repair\(ref, 'category', 'skipped', `\$\{ref\} has no category/)
  assert.match(src, /repair\(ref, 'title', 'skipped', `\$\{ref\} has no title at all/)
  assert.match(src, /repair\(ref, 'body', 'skipped', `\$\{ref\} has an empty body\.`\)/)

  assert.doesNotMatch(src, /fail\(`\$\{n\.slug\} has no category/, 'a missing category must no longer fail the build')
  assert.doesNotMatch(src, /fail\(`\$\{n\.slug\} has no SEO title/, 'a missing title must no longer fail the build')
  assert.doesNotMatch(src, /fail\(`\$\{n\.slug\} has an empty body/, 'an empty body must no longer fail the build')
})

test('a missing Definition, missing/over-long description, or missing SEO title is REPAIRED', () => {
  const src = code('scripts/generate-glossary.ts')

  assert.match(src, /repair\(ref, 'definition', 'repaired', `\$\{ref\} has no Definition — repaired from the first ~155 chars of the body`\)/)
  assert.doesNotMatch(src, /fail\(\s*\n\s*`\$\{n\.slug\} has no Definition/, 'a missing Definition must no longer fail the build')

  assert.match(src, /repair\(ref, 'description', 'repaired', `\$\{ref\} has no SEO meta description/)
  assert.match(src, /meta description was \$\{description\.length\} chars, over \$\{DESC_LIMIT\}/)
  assert.doesNotMatch(src, /fail\(`\$\{n\.slug\} has no SEO meta description/, 'a missing description must no longer fail the build')
  assert.doesNotMatch(src, /fail\(`\$\{n\.slug\}: meta description is/, 'an over-limit description must no longer fail the build')

  // 🔴 THE ONE THING THAT MUST STAY TRUE: description never falls back to Definition.
  // Both resolve from the term's own BODY TEXT independently — never from each other.
  // (Checked against the RAW source — code() strips the comment this lives in.)
  assert.match(read('scripts/generate-glossary.ts'), /NO FALLBACK FROM THE DEFINITION TO THE META DESCRIPTION, EVER/)

  assert.match(src, /repair\(ref, 'title', 'repaired', `\$\{ref\} has no SEO title — repaired to the term name/)
})

test('a dangling related-term slug is dropped from just that term, not a build failure', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.match(src, /repair\(t\.slug as string, 'related', 'repaired', `related term "\$\{dangling\}" does not resolve — dropped/)
  assert.doesNotMatch(src, /fail\(`related terms that do not resolve/, 'a dangling related term must no longer fail the build')
})

test('a repo-hardcoded link to an unpublished term ships unchanged and is flagged, not failed', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.match(src, /repair\(\s*slug,\s*'repo-link',\s*'flagged'/)
  assert.doesNotMatch(src, /fail\(`these pages link to glossary terms/, 'a broken repo link must no longer fail the glossary build')
})

test('a recovery-copy honesty violation ships unchanged and is flagged, not failed', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.match(src, /checkRecoveryCopy/)
  assert.match(src, /repair\(\s*ref,\s*'recovery-copy',\s*'flagged'/)
  assert.doesNotMatch(src, /fail\(\s*\n\s*`\$\{ref\} makes a false/, 'a recovery-copy violation must no longer fail the glossary build')
})

test('duplicate published terms are tie-broken by the lowest WordPress databaseId', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.match(src, /\(a\.n\.databaseId \?\? Infinity\) - \(b\.n\.databaseId \?\? Infinity\)/)
  assert.doesNotMatch(src, /fail\(`duplicate published term/, 'a duplicate term must no longer fail the build')
})

test('the EXPECTED_TERMS collapse gate no longer fails the build — it was keyed to a constant, not the live site', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.doesNotMatch(
    src,
    /collapse && process\.env\.ALLOW_GLOSSARY_COUNT_DECREASE/,
    'the EXPECTED_TERMS-vs-hardcoded-constant collapse check must be gone entirely (P1-a names EXPECTED_TERMS explicitly)'
  )
  assert.match(src, /terms\.length < EXPECTED_TERMS/, 'the count must still be compared, but only to LOG')
})

test('WordPress unreachable, a non-200 response, or GraphQL errors still fail the build', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.match(src, /fail\(`cannot reach WordPress/)
  assert.match(src, /fail\(`WordPress returned HTTP/)
  assert.match(src, /fail\(`GraphQL errors/)
})

test('generate-glossary.ts records its repairs/skips/flags through the shared ledger', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.match(src, /recordContentRepairs\(\[REPAIR_TYPE\], repairs\)/)
  assert.match(src, /REPAIR_TYPE = 'glossary-term'/)
  assert.match(src, /import \{ extractFaqs, textOf, truncateAtWordBoundary \} from '\.\.\/lib\/blog-transform'/, 'the glossary must reuse the SAME truncation helper the blog uses — one definition, not two that drift')
})

test('a category name is normalized/flagged through the shared, real-execution-tested module, never trusted as a closed set (verifier finding)', () => {
  const src = code('scripts/generate-glossary.ts')
  assert.match(
    src,
    /import \{ normalizeGlossaryCategory, KNOWN_GLOSSARY_CATEGORIES \} from '\.\.\/lib\/glossary-category-rules\.mjs'/
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
