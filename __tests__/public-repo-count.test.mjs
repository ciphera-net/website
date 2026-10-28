import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The site names how many public repositories we have on three surfaces: About's record, the trust page and the
 * homepage's How we build. They said 25 and 26 at once on 28-10-2026, when one was corrected and the others were not.
 * The number itself is GitHub's (github.com/ciphera-net, public repositories, the org profile repo included): update
 * all three together.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
const FILES = ['components/overhaul/about/content.ts', 'components/overhaul/trust/content.ts', 'components/overhaul/home/variants/RuleStepper.tsx']

test('every surface states the same public-repository count', () => {
  const counts = FILES.flatMap((f) => [...read(f).matchAll(/(\d+) public repositories/g)].map((m) => `${m[1]} (${f})`))
  assert.ok(counts.length >= 4, `expected the count on all three surfaces, found ${counts.length}`)
  assert.equal(new Set(counts.map((c) => c.split(' ')[0])).size, 1, `counts differ: ${counts.join(', ')}`)
})
