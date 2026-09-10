import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FORBIDDEN, QUALIFIED, QUALIFIER, QUALIFIER_WINDOW, PASSWORD_IS_THE_ONLY_WAY,
} from '../lib/recovery-copy-rules.mjs'

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
// 🔴 TWO SURFACES LEFT THIS LIST ON 10-09-2026 AND THE GUARD DID NOT SHRINK.
// `content/blog/zero-knowledge-encryption-guide.mdx` and
// `content/blog/ciphera-id-vs-auth0-vs-clerk.mdx` moved into WordPress with the rest of
// the blog (design D13), so a repository test cannot read them any more. This file's own
// header says what that would mean: *a guard narrower than its subject reads as coverage
// and is not.* So the rules moved to `lib/recovery-copy-rules.mjs`, and
// `scripts/generate-blog-posts.ts` runs THE SAME ONES over every WordPress body at build
// time. The subject did not shrink; the guard grew a second half.
// ⚠️ If that build gate is ever removed, this list is silently four surfaces wide again.
// The last test in this file is what makes that loud.
const SURFACES = [
  'app/terms/page.tsx',
  'app/privacy/page.tsx',
  'components/FAQ.tsx',
  'app/products/id/page.tsx',
]

// The rules themselves live in lib/recovery-copy-rules.mjs — see the SURFACES note.
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

test('the blog half of this guard is enforced at build time', () => {
  // 🔴 THE BLOG IS NO LONGER IN THIS REPOSITORY, so these rules can only reach it in
  // the build. If that gate is deleted, this list quietly stops covering two of the six
  // surfaces it was written for — with every test still green. This assertion is the
  // only thing standing between that and nobody noticing.
  const gen = readFileSync(join(root, 'scripts/generate-blog-posts.ts'), 'utf8')
  assert.match(
    gen,
    /checkRecoveryCopy/,
    'generate-blog-posts.ts must run the recovery-copy rules over every WordPress body — ' +
      'the blog posts that used to be in SURFACES live there now',
  )
})
