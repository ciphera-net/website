// The processing agreement (/dpa, 29-10-2026, PUL-37). The Clauses are the Commission's, word for word: Clause 2(a)
// forbids changing them, so a hand edit is a defect, and only the choices the template leaves open may differ from the
// official text. These checks read the sources as text, like the rest of this suite.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')

function clauses() {
  const src = read('lib/dpa/standard-clauses.ts')
  const marker = 'export const STANDARD_CLAUSES: ScSection[] = '
  return JSON.parse(src.slice(src.indexOf(marker) + marker.length))
}

test('the Clauses are Sections I to III, Clauses 1 to 10, and Clause 5 (docking) is not used', () => {
  const sections = clauses()
  assert.deepEqual(sections.map((s) => s.number), ['I', 'II', 'III'])
  assert.deepEqual(sections.flatMap((s) => s.clauses.map((c) => c.number)), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
  const c5 = sections[0].clauses[4]
  assert.equal(c5.optional, true)
  assert.equal(c5.notUsed, true)
  assert.equal(c5.blocks.length, 0)
})

test('every choice the template leaves open is made, and nothing else of the template remains', () => {
  const text = JSON.stringify(clauses())
  for (const left of ['[OPTION', 'OPTION 1', 'OPTION 2', '[SPECIFY', 'choose relevant option', '[Identity']) {
    assert.ok(!text.includes(left), `the Clauses still carry "${left}"`)
  }
})

test('Clause 2(a) is the official sentence, so a hand edit of the Clauses fails here', () => {
  const c2 = clauses()[0].clauses[1]
  assert.equal(
    c2.blocks[0].text,
    'The Parties undertake not to modify the Clauses, except for adding information to the Annexes or updating information in them.',
  )
})

test('Clause 7.7(a) is general written authorisation with 30 days’ notice (Option 2)', () => {
  const c7 = clauses()[1].clauses.find((c) => c.number === '7')
  const s77 = c7.blocks.find((b) => b.kind === 'sub' && b.number === '7.7')
  const a = s77.blocks.find((b) => b.label === 'a').text
  assert.match(a, /general authorisation/)
  assert.match(a, /at least 30 days in advance/)
})

test('the agreement is in force exactly 30 days after it is published', () => {
  const src = read('lib/dpa/agreement.ts')
  const date = (name) => new Date(`${src.match(new RegExp(`export const ${name} = '([^']+)'`))[1]} UTC`)
  const days = (date('DPA_IN_FORCE') - date('DPA_PUBLISHED')) / 86_400_000
  assert.equal(days, 30, 'Terms §15: 30 days’ notice of a material change')
})

test('Annex IV names only services the published sub-processor list carries', () => {
  const annex = read('lib/dpa/agreement.ts').match(/ANNEX_IV_SERVICES = \[([^\]]+)\]/)[1]
  const listed = read('lib/subprocessors.ts')
  for (const name of annex.match(/'([^']+)'/g).map((s) => s.slice(1, -1))) {
    assert.ok(listed.includes(`service: '${name}'`), `${name} is not in lib/subprocessors.ts`)
  }
})

test('the terms, the policy, the trust page, the footer, the sitemap and llms.txt all point to /dpa', () => {
  const terms = read('app/terms/page.tsx')
  assert.ok(terms.includes('href="/dpa"'), 'terms: no link to /dpa')
  assert.ok(terms.includes('9.3. California (CCPA)'), 'terms: no section 9.3')
  assert.ok(!terms.includes('available upon request at'), 'terms: still offers the agreement on request only')
  assert.ok(read('app/privacy/page.tsx').includes('href="/dpa"'), 'privacy: no link to /dpa')
  assert.ok(read('components/overhaul/trust/content.ts').includes("href: '/dpa'"), 'trust: the review kit does not link /dpa')
  assert.ok(read('components/overhaul/footer/footer-data.tsx').includes("href: '/dpa'"), 'footer: no /dpa')
  assert.ok(read('app/sitemap.ts').includes('/dpa`'), 'sitemap: no /dpa')
  assert.equal(read('scripts/generate-llms.ts').match(/\$\{SITE\}\/dpa/g)?.length, 2, 'llms.txt and llms-full.txt: /dpa')
})
