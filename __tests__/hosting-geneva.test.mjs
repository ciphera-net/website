import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Where the data is, on every surface that says so (28-10-2026). Our servers, databases, file storage and backups moved
 * from Exoscale in Zurich to Infomaniak in Geneva on 27-28 October; Exoscale keeps our email server. The backup copies followed
 * on 29 October (both in Infomaniak's object storage, two regions), so no surface may still place backups at Exoscale.
 *
 * Design: Public/docs/plans/28-10-2026-hosting-copy-after-infomaniak.md (rulings H1 A, H2 A).
 *
 * 🔴 The provider lists are TWO lists: /privacy §11 renders lib/subprocessors.ts, /trust#providers renders PROVIDERS in
 * components/overhaul/trust/content.ts. A move edits both, or the two pages contradict each other.
 * 🔑 Source-level, like blog-seam.test.mjs: no network, no build output (CI runs `npm test` without a prebuild).
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')

test('the privacy table: Infomaniak hosts the servers and the backups, Exoscale the email server', () => {
  const src = read('lib/subprocessors.ts')
  const infomaniak = src.indexOf("service: 'Infomaniak'")
  const exoscale = src.indexOf("service: 'Exoscale'")
  assert.ok(infomaniak > -1 && exoscale > infomaniak, 'Infomaniak comes first')
  assert.match(src, /purpose: 'Servers, databases, object storage, off-site backups and domain registration'/)
  assert.match(src, /service: 'Exoscale',\n    purpose: 'Email server',\n    dataProcessed: 'Email',/)
  assert.doesNotMatch(src, /Compute and object storage/)
  // No encryption-at-rest claim until it holds for everything a row covers (28-10-2026), here or in the security section.
  assert.doesNotMatch(src, /encrypted at rest/)
  assert.doesNotMatch(read('app/privacy/page.tsx'), /Backups are encrypted at rest/)
})

test('the trust page: the same two roles, the servers in Geneva', () => {
  const src = read('components/overhaul/trust/content.ts')
  assert.match(src, /The servers that store your data are in Geneva/)
  assert.match(src, /name: 'Infomaniak', mark: 'infomaniak', role: 'Our servers, databases, file storage and backups/)
  assert.match(src, /name: 'Exoscale', mark: 'exoscale', role: 'Our email server', sees: 'Our email',/)
  assert.doesNotMatch(src, /Our servers, databases and file storage', sees: 'Everything we store'.*exoscale/)
  assert.match(src, /serverPlace: 'Geneva, Switzerland'/)
})

test('the homepage names Geneva where it names the data', () => {
  for (const f of ['components/overhaul/home/HomeFaq.tsx', 'components/overhaul/home/variants/WhereDataLivesB.tsx', 'components/overhaul/GlobeEurope.tsx']) {
    const src = read(f)
    assert.doesNotMatch(src, /servers in Zurich|Zurich, Switzerland|ZURICH/, f)
  }
  assert.match(read('components/overhaul/home/variants/WhereDataLivesB.tsx'), />Geneva, Switzerland<\/h3>/)
  assert.match(read('components/overhaul/home/variants/WhereDataLivesB.tsx'), /RUNS_ON\.map/)
  const globe = read('components/overhaul/GlobeEurope.tsx')
  assert.match(globe, /const GENEVA = \{ lat: 46\.2044, lng: 6\.1432 \}/)
  assert.match(globe, /\['Geneva, Switzerland', 'Where your data is stored'\]/)
  assert.match(read('components/overhaul/home/HomeFaq.tsx'), /On servers in Geneva, with backups elsewhere in Switzerland/)
})

test('About and the llms files say Infomaniak in Geneva', () => {
  assert.match(read('components/overhaul/about/content.ts'), /detail: 'Infomaniak in Geneva, email at Exoscale in Zurich'/)
  const llms = read('scripts/generate-llms.ts')
  assert.match(llms, /on servers at Infomaniak in Geneva/)
  assert.match(llms, /stored in Switzerland \(Infomaniak, Geneva; backups also in Switzerland\)/)
  assert.doesNotMatch(llms, /Exoscale in Zurich|Exoscale, Zurich/)
})

test('no provider list still places our backups at Exoscale (they moved to Infomaniak on 29-10-2026)', () => {
  const line = (f, needle) => {
    const hit = read(f).split('\n').find((l) => l.includes(needle))
    assert.ok(hit, `${f} has no line with ${needle}`)
    return hit
  }
  // The rows that name Exoscale, one per surface; DPA Annex IV renders the privacy table's rows.
  const subprocessors = read('lib/subprocessors.ts')
  const exoscaleRow = subprocessors.slice(subprocessors.indexOf("service: 'Exoscale'"), subprocessors.indexOf("service: 'Bunny'"))
  for (const [where, text] of [
    ['lib/subprocessors.ts', exoscaleRow],
    ['components/overhaul/trust/content.ts', line('components/overhaul/trust/content.ts', "name: 'Exoscale'")],
    ['components/overhaul/brand-marks.ts', line('components/overhaul/brand-marks.ts', "key: 'exoscale'")],
    // One line carries both branches here; only the Exoscale branch is checked (Infomaniak's names the backups).
    ['components/overhaul/home/variants/RuleStepper.tsx', read('components/overhaul/home/variants/RuleStepper.tsx').match(/m\.key === 'exoscale' \? '([^']*)'/)[1]],
  ]) {
    assert.doesNotMatch(text, /backup/i, where)
  }
  assert.match(line('components/overhaul/brand-marks.ts', "key: 'exoscale'"), /role: 'Email server'/)
  assert.match(read('components/overhaul/sustainability/content.ts'), /text: 'Object storage and backups \(Infomaniak\)'/)
})
