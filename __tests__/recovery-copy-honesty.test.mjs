import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Account recovery is switched off. The server ceremony that proves possession
 * of a recovery phrase shipped on 08-08-2026; the browser half never did, and
 * `recovery_opaque_record` is null on every account in production. So no phrase
 * can currently open an account, and losing the PASSWORD alone is terminal.
 *
 * id-frontend has carried a copy-honesty guard since 11-08-2026, and it held
 * — signup has said "recovery is paused" ever since. It could not hold here:
 * it scopes its surface list to id-frontend files and cannot see this repo at
 * all. Meanwhile /terms, /privacy, the FAQ, /products/id and the zero-knowledge
 * guide each went on promising that the phrase was a working way back in, one
 * of them inside JSON-LD. A guard narrower than its subject reads as coverage
 * and is not, so this is that guard's sibling, in the repo that owns the copy.
 *
 * Plan: Infra/Auth/docs/plans/03-09-2026-recovery-ceremony-completion.md §2.1.
 *
 * ⚠️ WHEN RECOVERY IS RE-ENABLED (plan R7, and only after every account has
 * enrolled) this guard inverts rather than being deleted: the QUALIFIED claims
 * become true, and the honest-statement assertion below becomes the thing that
 * must go. Delete it in the same commit that flips id-frontend's
 * RECOVERY_CEREMONY_PENDING, never before.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf8')

/** Every public surface that talks about account recovery. */
const SURFACES = [
  'app/terms/page.tsx',
  'app/privacy/page.tsx',
  'components/FAQ.tsx',
  'app/products/id/page.tsx',
  'content/blog/zero-knowledge-encryption-guide.mdx',
  'content/blog/ciphera-id-vs-auth0-vs-clerk.mdx',
]

/**
 * Claims that are false however they are qualified. "Lose BOTH" is the exact
 * word the audit singled out: it is the part a reader relies on, and it is
 * wrong in the direction that costs them the account.
 */
const FORBIDDEN = [
  /lose both your password and your recovery phrase/i,
  /losing both your password and your recovery phrase/i,
  /recover it with your recovery phrase/i,
]

/**
 * Claims that are true of the design and false of today's deployment. They may
 * appear only with an availability qualifier close enough to be read in the
 * same breath — a caveat three sections away does not qualify anything.
 */
const QUALIFIED = [
  /recovery uses your 24-word/i,
  /recovery requires the 24-word/i,
  /requires? the 24-word recovery phrase/i,
  /you recover access with your 24-word/i,
]

/** How far from a qualified claim the caveat may sit, in characters. */
const QUALIFIER_WINDOW = 400

const QUALIFIER =
  /recovery is (?:currently |at present |at the moment |today )?(?:unavailable|switched off|paused|turned off)|(?:currently|at the moment) (?:unavailable|switched off|paused)/i

/** The honest statement each surface has to make while recovery is off. */
const PASSWORD_IS_THE_ONLY_WAY =
  /\b(?:the|your) password is (?:currently |at present |today |now )?the only way (?:in\b|into your account)/i

test('the surface list is not stale', () => {
  for (const file of SURFACES) {
    assert.ok(
      existsSync(join(root, file)),
      `${file} is listed as a recovery surface but does not exist — the guard silently shrank`,
    )
  }
})

test('no surface makes a claim that is false however it is qualified', () => {
  for (const file of SURFACES) {
    const src = read(file)
    for (const claim of FORBIDDEN) {
      const match = claim.exec(src)
      assert.equal(
        match,
        null,
        match
          ? `${file}: "${match[0]}" — losing the password ALONE is terminal today, so "both" is the wrong word`
          : '',
      )
    }
  }
})

test('every design-tense recovery claim carries an availability qualifier', () => {
  for (const file of SURFACES) {
    const src = read(file)
    for (const claim of QUALIFIED) {
      for (const match of src.matchAll(new RegExp(claim.source, claim.flags + 'g'))) {
        const from = Math.max(0, match.index - QUALIFIER_WINDOW)
        const to = Math.min(src.length, match.index + match[0].length + QUALIFIER_WINDOW)
        assert.ok(
          QUALIFIER.test(src.slice(from, to)),
          `${file}: "${match[0]}" promises working recovery with no "unavailable"/"paused"/` +
            `"switched off" within ${QUALIFIER_WINDOW} characters — no phrase can open an account today`,
        )
      }
    }
  }
})

/**
 * Absence checks alone are vacuous: deleting the whole paragraph passes every
 * one of them. Each surface has to positively say what is true instead.
 */
test('every surface says what is true while recovery is off', () => {
  for (const file of SURFACES) {
    const src = read(file)
    assert.ok(
      QUALIFIER.test(src),
      `${file} must state that account recovery is currently unavailable`,
    )
    assert.ok(
      PASSWORD_IS_THE_ONLY_WAY.test(src),
      `${file} must state that the password is currently the only way in`,
    )
  }
})

/**
 * The failure mode this repo actually has is a NEW surface, not a changed one:
 * five pages drifted while a guard in another repo stayed green. Any file under
 * app/, components/ or content/ that talks about the recovery phrase has to be
 * on the list above, so adding a sixth surface fails here instead of shipping.
 */
test('no unguarded surface talks about the recovery phrase', () => {
  const MENTIONS = /24-word|recovery phrase/i
  const SKIP = new Set(['node_modules', '.next', '.git'])
  const found = []

  const walk = (dir) => {
    for (const entry of readdirSync(join(root, dir))) {
      if (SKIP.has(entry)) continue
      const rel = join(dir, entry)
      if (statSync(join(root, rel)).isDirectory()) {
        walk(rel)
      } else if (/\.(tsx?|mdx?|json)$/.test(entry) && MENTIONS.test(readFileSync(join(root, rel), 'utf8'))) {
        found.push(rel.split(sep).join('/'))
      }
    }
  }
  for (const dir of ['app', 'components', 'content']) walk(dir)

  const unguarded = found.filter((f) => !SURFACES.includes(f) && f !== relative(root, import.meta.filename))
  assert.deepEqual(
    unguarded,
    [],
    `these files mention the recovery phrase but are not in SURFACES, so nothing checks them: ${unguarded.join(', ')}`,
  )
})
