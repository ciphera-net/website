import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { STALE, REQUIRED, MENTIONS_RECOVERY } from '../lib/recovery-copy-rules.mjs'

/**
 * Account recovery is LIVE. It has been since 03-09-2026 19:47, when id-frontend flipped
 * `RECOVERY_CEREMONY_PENDING = false` — ten hours after this repo's copy was written to say
 * it was switched off. The recovery ceremony runs on the 24-word phrase, which enrols a
 * second OPAQUE identity; signup has enrolled it automatically since 07-09-2026; older
 * accounts set it up from Security settings, which needs their password; there is no
 * backfill. Plan: Public/docs/plans/13-09-2026-recovery-copy-correction.md.
 *
 * This guard was written on 03-09-2026 to keep the copy honest while recovery was OFF, and
 * its own header promised it would INVERT rather than be deleted when recovery came back.
 * It inverted on 13-09-2026, ten days late: for those ten days it enforced the wrong claim
 * on four public pages and, through the build gate, on two blog posts. The lesson stands
 * either way — a guard narrower than its subject reads as coverage and is not, and a guard
 * that lives in a different repo from the fact it depends on can be right and then silently
 * wrong. If the constant in id-frontend ever flips back, this file flips with it, in the
 * same change.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf8')

/** Every public surface that talks about account recovery. */
// 🔴 TWO SURFACES LEFT THIS LIST ON 10-09-2026 AND THE GUARD DID NOT SHRINK.
// `content/blog/zero-knowledge-encryption-guide.mdx` and
// `content/blog/ciphera-id-vs-auth0-vs-clerk.mdx` moved into WordPress with the rest of the
// blog (design D13), so a repository test cannot read them any more. The rules moved to
// `lib/recovery-copy-rules.mjs`, and `scripts/generate-blog-posts.ts` runs THE SAME ONES over
// every WordPress body at build time. The subject did not shrink; the guard grew a second half.
// ⚠️ If that build gate is ever removed, this list is silently four surfaces wide again.
// The last test in this file is what makes that loud.
const SURFACES = [
  'app/terms/page.tsx',
  'app/privacy/page.tsx',
  'components/FAQ.tsx',
  'app/products/id/page.tsx',
]

test('the surface list is not stale', () => {
  for (const file of SURFACES) {
    assert.ok(
      existsSync(join(root, file)),
      `${file} is listed as a recovery surface but does not exist — the guard silently shrank`,
    )
  }
})

test('no surface describes the 11-08 → 03-09 outage as the present', () => {
  for (const file of SURFACES) {
    const src = read(file)
    for (const claim of STALE) {
      const match = claim.exec(src)
      assert.equal(match, null, match ? `${file}: "${match[0]}" — recovery has been live since 03-09-2026` : '')
    }
  }
})

/**
 * Absence checks alone are vacuous: deleting the whole paragraph passes every one of them.
 * Each surface that raises recovery has to positively say what is true instead — what gets
 * a reader back in, what an older account must do first, and what happens if they do neither.
 */
test('every surface that mentions recovery says what is true now', () => {
  for (const file of SURFACES) {
    const src = read(file)
    if (!MENTIONS_RECOVERY.test(src)) continue
    for (const { name, re } of REQUIRED) {
      assert.ok(re.test(src), `${file} must ${name}`)
    }
  }
})

test('every listed surface still raises the subject at all', () => {
  // A surface that stops mentioning recovery passes the two tests above for free. These
  // four pages each owe the reader the recovery facts; going silent is not honesty.
  for (const file of SURFACES) {
    assert.ok(MENTIONS_RECOVERY.test(read(file)), `${file} no longer mentions the recovery phrase at all`)
  }
})

/**
 * The failure mode this repo actually has is a NEW surface, not a changed one:
 * five pages drifted while a guard in another repo stayed green. Any file under
 * app/, components/ or content/ that talks about the recovery phrase has to be
 * on the list above, so adding a sixth surface fails here instead of shipping.
 */
test('no unguarded surface talks about the recovery phrase', () => {
  const SKIP = new Set(['node_modules', '.next', '.git'])
  const found = []

  const walk = (dir) => {
    for (const entry of readdirSync(join(root, dir))) {
      if (SKIP.has(entry)) continue
      const rel = join(dir, entry)
      if (statSync(join(root, rel)).isDirectory()) {
        walk(rel)
      } else if (/\.(tsx?|mdx?|json)$/.test(entry) && MENTIONS_RECOVERY.test(readFileSync(join(root, rel), 'utf8'))) {
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
