import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The footer's status line trusts the feed only while its age is known and recent. A feed stamped in the future has a
 * negative age, which passed `age < STALE_AFTER_MS` and showed "All systems operational" (found 19-10-2026). The
 * condition now has a lower bound, with a small allowance for clock skew.
 *
 * 🔑 SOURCE-LEVEL, like the rest of this suite (CI runs no build): the condition and both constants are read from
 * footer-data.tsx and EVALUATED against sample ages, so the test fails if the logic changes, not only the text.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = readFileSync(join(root, 'components/overhaul/footer/footer-data.tsx'), 'utf-8')

const constant = (name) => {
  const m = src.match(new RegExp(`const ${name} = ([0-9 *]+)\\n`))
  assert.ok(m, `${name} is not a plain numeric constant in footer-data.tsx`)
  return Function(`return (${m[1]})`)()
}

test('the footer trusts a feed only when its age is known and recent', () => {
  const STALE_AFTER_MS = constant('STALE_AFTER_MS')
  const FUTURE_SKEW_MS = constant('FUTURE_SKEW_MS')
  assert.ok(FUTURE_SKEW_MS > 0 && FUTURE_SKEW_MS <= 5 * 60 * 1000, `FUTURE_SKEW_MS ${FUTURE_SKEW_MS} ms is not a small skew`)

  const m = src.match(/if \((age[^)]*)\) overall = /)
  assert.ok(m, 'the freshness condition (if (… age …) overall = …) is not where it was')
  const fresh = Function('age', 'STALE_AFTER_MS', 'FUTURE_SKEW_MS', `return (${m[1]})`)
  const at = (age) => fresh(age, STALE_AFTER_MS, FUTURE_SKEW_MS)

  const min = 60 * 1000
  assert.equal(at(5 * min), true, 'a 5-minute-old feed is fresh')
  assert.equal(at(-1 * min), true, 'a feed one minute ahead (clock skew) is fresh')
  assert.equal(at(-60 * min), false, 'a feed dated an hour in the future is not trusted')
  assert.equal(at(20 * min), false, 'a 20-minute-old feed is stale')
  assert.equal(at(Number.NaN), false, 'an unparseable generatedAt is not fresh')
  assert.equal(at(Infinity), false, 'a feed with no generatedAt is not fresh')
})
