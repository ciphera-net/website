/**
 * Normalizing a glossary term's category against the four this site renders section
 * headings for.
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1 P1-a
 *
 * 🔴 FOUND BY VERIFICATION, 07-10-2026. `scripts/generate-glossary.ts` wrote
 * `category: cat.name` straight from WordPress's free-text `glossaryCategories`
 * taxonomy, but `lib/glossary/types.ts`'s `GlossaryTerm.category` was a strict 4-member
 * string-literal union. Any category name not byte-identical to one of the four — a
 * rename, a typo, different capitalization/punctuation, or a brand-new category an
 * editor creates — made the generated `lib/glossary.gen.ts` fail TypeScript's
 * type-check during `next build`: a CMS-content-driven build failure outside the literal
 * `fail()`/`throw`/`process.exit` grep P1-a otherwise covered. `GlossaryCategory` is now
 * `string` (lib/glossary/types.ts) and this module is what keeps taxonomy drift from
 * silently fragmenting the four real categories into near-duplicates.
 *
 * 🔴 EXTRACTED PURE, ZERO IMPORTS — same reason as lib/redirect-path-rules.mjs: the
 * no-`npm ci` CI test step can only execute a dependency-free `.mjs`, so
 * `__tests__/content-repair-glossary-category.test.mjs` and
 * `scripts/generate-glossary.ts` (via `tsx`) share this one implementation instead of a
 * source-grep standing in for either.
 */

/** Display order here is NOT the site's order — see generate-glossary.ts, which derives
 * that from each category's own term meta (`cipheraOrder`), not this list's position. */
export const KNOWN_GLOSSARY_CATEGORIES = [
  'Cryptography & authentication',
  'Privacy & regulation',
  'Analytics & web',
  'Email & infrastructure',
]

/** Case/whitespace/"&" vs "and" insensitive — enough to catch an editor's typo or a
 * capitalization slip without being so loose it folds two genuinely different names. */
function foldKey(s) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/&/g, 'and')
}

/**
 * Normalize one WordPress `glossaryCategories` term name.
 *
 * - A near-match of a known category (case, whitespace, "&"/"and") returns that known
 *   category's EXACT string, `matched: true`, `changed` true iff the input differed.
 * - Anything else returns the trimmed input unchanged, `matched: false` — a brand-new
 *   or unrecognized category name, which generate-glossary.ts ships as given (P1-a: the
 *   taxonomy is the agency's content, not this codebase's to overrule) and FLAGS for
 *   review rather than silently reassigning to some other bucket.
 */
export function normalizeGlossaryCategory(name) {
  const trimmed = (name ?? '').trim().replace(/\s+/g, ' ')
  const key = foldKey(trimmed)
  const match = KNOWN_GLOSSARY_CATEGORIES.find((known) => foldKey(known) === key)
  if (match) return { name: match, matched: true, changed: match !== trimmed }
  return { name: trimmed, matched: false, changed: false }
}
