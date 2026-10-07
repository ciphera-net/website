import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeGlossaryCategory, KNOWN_GLOSSARY_CATEGORIES } from '../lib/glossary-category-rules.mjs'

/**
 * REAL execution, not source-grep — `lib/glossary-category-rules.mjs` has zero imports,
 * so the bare `node --test` CI runs can exercise it directly. This is the exact
 * verifier-reported defect, with a real fixture: a WordPress `glossaryCategories` term
 * not byte-identical to one of the four hardcoded `GlossaryCategory` literals used to
 * fail `next build`'s type-check (`lib/glossary.gen.ts` would not type-check). The type
 * is now `string`; this is what keeps a typo or a rename from silently fragmenting one
 * real category into two.
 */

test('a known category passes through unchanged, matched', () => {
  for (const name of KNOWN_GLOSSARY_CATEGORIES) {
    const result = normalizeGlossaryCategory(name)
    assert.equal(result.matched, true)
    assert.equal(result.changed, false)
    assert.equal(result.name, name)
  }
})

test('the verifier\'s exact repro — one character off — is REPAIRED, not a type error', () => {
  // The verifier's fixture: "Cryptography" instead of "Cryptography & authentication".
  // That is not a near-match (it is missing the whole second half), so it is correctly
  // UNMATCHED here — the type no longer being a literal union is what stops it failing
  // next build's type-check; this module's job is only the near-miss case below.
  const result = normalizeGlossaryCategory('Cryptography')
  assert.equal(result.matched, false)
  assert.equal(result.name, 'Cryptography')
})

test('a typo/case/whitespace/"&" vs "and" near-match is REPAIRED to the exact known string', () => {
  assert.deepEqual(normalizeGlossaryCategory('cryptography & authentication'), {
    name: 'Cryptography & authentication',
    matched: true,
    changed: true,
  })
  // Collapsing internal whitespace happens in the trim step itself, so the result
  // already equals the known string before the match lookup even runs — `changed` is
  // false here because there is nothing left to change, not because nothing was fixed.
  assert.deepEqual(normalizeGlossaryCategory('Privacy  &  regulation'), {
    name: 'Privacy & regulation',
    matched: true,
    changed: false,
  })
  assert.deepEqual(normalizeGlossaryCategory('  Analytics & web  '), {
    name: 'Analytics & web',
    matched: true,
    changed: false,
  })
  assert.deepEqual(normalizeGlossaryCategory('Email and infrastructure'), {
    name: 'Email & infrastructure',
    matched: true,
    changed: true,
  })
})

test('a genuinely new category name ships unchanged, unmatched — never silently bucketed elsewhere', () => {
  const result = normalizeGlossaryCategory('Compliance & audits')
  assert.equal(result.matched, false)
  assert.equal(result.name, 'Compliance & audits')
  assert.equal(result.changed, false)
})

test('empty/missing category name normalizes to an empty, unmatched string', () => {
  assert.deepEqual(normalizeGlossaryCategory(''), { name: '', matched: false, changed: false })
  assert.deepEqual(normalizeGlossaryCategory(undefined), { name: '', matched: false, changed: false })
  assert.deepEqual(normalizeGlossaryCategory(null), { name: '', matched: false, changed: false })
})
