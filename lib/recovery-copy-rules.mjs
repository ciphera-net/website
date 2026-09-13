/**
 * The recovery-copy honesty rules, in one place.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.14
 * Inversion: Public/docs/plans/13-09-2026-recovery-copy-correction.md §4
 *
 * 🟢 INVERTED 13-09-2026 — ACCOUNT RECOVERY HAS BEEN LIVE SINCE 03-09-2026.
 * id-frontend flipped `RECOVERY_CEREMONY_PENDING = false` at 19:47 that day, ten hours after
 * this repo's copy said recovery was "switched off". Recovery is per account: the 24-word
 * phrase enrols a second OPAQUE identity; signup has enrolled it automatically since
 * 07-09-2026; accounts from before that set it up from Security settings, which needs their
 * password; there is no backfill, ever. So the claims this file used to REQUIRE are now the
 * false ones, and the claim it forbade ("lose both") is true again. The SHAPE of the guard is
 * unchanged — forbidden phrases, plus a positive statement every surface that raises the
 * subject must make — because absence checks alone are vacuous: deleting a paragraph passes
 * every one of them.
 *
 * 🔴 EXTRACTED BECAUSE THE MIGRATION NARROWED THE GUARD THAT OWNED THEM.
 * `__tests__/recovery-copy-honesty.test.mjs` checked six public surfaces, two of which were
 * blog posts in `content/blog/`. D13 moved the blog into WordPress, so a repository test can no
 * longer read them — *"A guard narrower than its subject reads as coverage and is not."* The
 * test still checks the four surfaces that are files; `scripts/generate-blog-posts.ts` runs
 * the same rules over every WordPress body at build time and fails the build. Same rules, two
 * callers — neither can be quietly narrowed without the other noticing.
 */

/**
 * Claims that were true while recovery was off (11-08-2026 → 03-09-2026) and are false now.
 * Each one describes the outage as the present.
 */
export const STALE = [
  /recovery is (?:currently |at present |at the moment |today )?(?:unavailable|switched off|paused|turned off)/i,
  /(?:currently|at the moment) (?:unavailable|switched off|paused)/i,
  /\b(?:the|your) password is (?:currently |at present |today |now )?the only way (?:in\b|into your account)/i,
  /once recovery is (?:re-enabled|switched (?:back )?on)/i,
  /until (?:it|recovery) ships/i,
  /it will work once/i,
]

/** Every phrase that makes a body a recovery surface at all. */
export const MENTIONS_RECOVERY = /recovery phrase|24-word/i

/**
 * What a surface that raises recovery has to positively say. All three, because each is the
 * part a reader relies on: what gets them back in, what an older account must do first, and
 * what happens if they do neither.
 */
export const REQUIRED = [
  { name: 'name the 24-word phrase as the recovery credential', re: /24-word (?:recovery )?phrase/i },
  { name: 'say that accounts from before 7 September 2026 set recovery up from Security settings', re: /from Security settings/i },
  {
    name: 'state that a password lost with no recovery phrase enrolled cannot be recovered',
    re: /no (?:recovery )?phrase enrolled[^.]{0,160}?(?:cannot be recovered|is gone|nobody can restore|cannot restore)/is,
  },
]

/**
 * Check one body. Returns a list of human-readable problems; empty means honest.
 * `label` names the surface in each message.
 */
export function checkRecoveryCopy(src, label) {
  const problems = []

  for (const claim of STALE) {
    const m = claim.exec(src)
    if (m) {
      problems.push(
        `${label}: "${m[0]}" — recovery has been live since 03-09-2026; this describes the ` +
          `11-08 → 03-09 outage as the present`
      )
    }
  }

  // 🔴 ABSENCE CHECKS ALONE ARE VACUOUS: deleting the whole paragraph passes every one of
  // them. A surface that raises the subject has to positively say what is true.
  if (MENTIONS_RECOVERY.test(src)) {
    for (const { name, re } of REQUIRED) {
      if (!re.test(src)) problems.push(`${label} must ${name}`)
    }
  }

  return problems
}
