/**
 * The recovery-copy honesty rules, in one place.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.14
 *
 * 🔴 EXTRACTED BECAUSE THE MIGRATION NARROWED THE GUARD THAT OWNED THEM.
 * `__tests__/recovery-copy-honesty.test.mjs` checked six public surfaces, two of which
 * were blog posts in `content/blog/`. D13 moved the blog into WordPress, so a
 * repository test can no longer read them — and that test's own header says exactly
 * what that means: *"A guard narrower than its subject reads as coverage and is not."*
 *
 * 🔑 SO THE RULES MOVED TO WHERE BOTH HALVES CAN REACH THEM. The test still checks the
 * four surfaces that are still files; `scripts/generate-blog-posts.ts` runs the same
 * rules over every WordPress body at build time and fails the build. Same rules, same
 * wording, two callers — and neither can be quietly narrowed without the other
 * noticing.
 *
 * ⚠️ THIS IS A REAL COST OF MIGRATING CONTENT OUT OF THE REPOSITORY, and it will not be
 * the last one. Any future guard that reads blog copy has to be a build gate, not a
 * test. Write it here.
 */

/**
 * Claims that are false however they are qualified. "Lose BOTH" is the exact word the
 * audit singled out: it is the part a reader relies on, and it is wrong in the
 * direction that costs them the account.
 */
export const FORBIDDEN = [
  /lose both your password and your recovery phrase/i,
  /losing both your password and your recovery phrase/i,
  /recover it with your recovery phrase/i,
]

/**
 * Claims that are true of the design and false of today's deployment. They may appear
 * only with an availability qualifier close enough to be read in the same breath — a
 * caveat three sections away does not qualify anything.
 */
export const QUALIFIED = [
  /recovery uses your 24-word/i,
  /recovery requires the 24-word/i,
  /requires? the 24-word recovery phrase/i,
  /you recover access with your 24-word/i,
]

/** How far from a qualified claim the caveat may sit, in characters. */
export const QUALIFIER_WINDOW = 400

export const QUALIFIER =
  /recovery is (?:currently |at present |at the moment |today )?(?:unavailable|switched off|paused|turned off)|(?:currently|at the moment) (?:unavailable|switched off|paused)/i

/** The honest statement each surface has to make while recovery is off. */
export const PASSWORD_IS_THE_ONLY_WAY =
  /\b(?:the|your) password is (?:currently |at present |today |now )?the only way (?:in\b|into your account)/i

/** Every phrase that makes a body a recovery surface at all. */
export const MENTIONS_RECOVERY = /recovery phrase|24-word/i

/**
 * Check one body. Returns a list of human-readable problems; empty means honest.
 * `label` names the surface in each message.
 */
export function checkRecoveryCopy(src, label) {
  const problems = []

  for (const claim of FORBIDDEN) {
    const m = claim.exec(src)
    if (m) {
      problems.push(
        `${label}: "${m[0]}" — losing the password ALONE is terminal today, so "both" is the wrong word`
      )
    }
  }

  for (const claim of QUALIFIED) {
    for (const m of src.matchAll(new RegExp(claim.source, claim.flags + 'g'))) {
      const from = Math.max(0, m.index - QUALIFIER_WINDOW)
      const to = Math.min(src.length, m.index + m[0].length + QUALIFIER_WINDOW)
      if (!QUALIFIER.test(src.slice(from, to))) {
        problems.push(
          `${label}: "${m[0]}" promises working recovery with no "unavailable"/"paused"/` +
            `"switched off" within ${QUALIFIER_WINDOW} characters — no phrase can open an account today`
        )
      }
    }
  }

  // 🔴 ABSENCE CHECKS ALONE ARE VACUOUS: deleting the whole paragraph passes every one
  // of them. A surface that raises the subject has to positively say what is true.
  if (MENTIONS_RECOVERY.test(src)) {
    if (!QUALIFIER.test(src)) {
      problems.push(`${label} must state that account recovery is currently unavailable`)
    }
    if (!PASSWORD_IS_THE_ONLY_WAY.test(src)) {
      problems.push(`${label} must state that the password is currently the only way in`)
    }
  }

  return problems
}
