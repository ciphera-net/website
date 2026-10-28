import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * What /sustainability's receipt prints after the move to Infomaniak (28-10-2026), through the real `receiptFrom`
 * (`components/overhaul/sustainability/receipt.ts`), bundled by esbuild and run in one process, the same device as
 * `breadcrumbs.render.mjs`. Exact strings and numbers.
 *
 * Our fleet is 7 servers and 22 vCPU: six at Infomaniak in Geneva, the mail server at Exoscale in Zurich. October's
 * receipt (744 h) is 2.0516802 kg CO₂e (the 21-vCPU report's 1.9584220 kg x 22/21), 9.8208 kWh, 883.872 g of it from use,
 * and the embodied share is unchanged at 56.9%. The host's own life-cycle report is retired: Exoscale removed the endpoint
 * it came from (HTTP 410), so a report that still carries that source prints as unavailable, never as a figure.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, '__tests__', 'render', '.out')
const outFile = join(outDir, 'sustainability-receipt.mjs')

let r

before(() => {
  mkdirSync(outDir, { recursive: true })
  execFileSync(
    'npx',
    [
      '--yes', 'esbuild',
      join(root, '__tests__', 'render', 'sustainability-receipt-entry.ts'),
      '--bundle', '--platform=node', '--format=esm', '--target=node20',
      `--tsconfig=${join(root, 'tsconfig.json')}`,
      '--packages=external',
      `--outfile=${outFile}`,
    ],
    { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] },
  )
  r = JSON.parse(execFileSync('node', [outFile], { cwd: root, encoding: 'utf-8' }))
}, 60_000)

const figures = (v) => Object.fromEntries(v.rows.map((row) => [row.key, row.value]))

test('the fixture arithmetic is the backend\'s: it gives the 19-10-2026 production report of 21 vCPU to the last digit', () => {
  assert.deepEqual(
    [r.previousWorking.energyKWh, r.previousWorking.useKg, r.previousWorking.embodiedKg, r.previousWorking.totalKg, r.previousWorking.embodiedShare],
    [9.3744, 0.8436959999999999, 1.1147260273972603, 1.9584220273972601, 0.5691960220028415],
  )
})

test('our fleet of 7 servers and 22 vCPU prints October at 2,052 g: 884 g to run them, 1,168 g to make, ship and dispose of them', () => {
  const v = r.fleet
  assert.equal(v.state, 'estimate')
  assert.deepEqual(figures(v), {
    servers: '7',
    vcpu: '22',
    hours: '744',
    watts: '0.5 W',
    pue: '1.2',
    energy: '9.821 kWh',
    grid: '90 g CO₂e/kWh',
    use: '884 g',
    embodiedPerVcpu: '2.5 kg CO₂e',
    lifetime: '4 years',
    share: '744 of 35,040 h',
    embodied: '1,168 g',
  })
  assert.equal(v.total, '2,052')
  assert.equal(884 + 1168, 2052, 'the parts a receipt lists add up to the total it prints')
  assert.equal(v.totalUnit, 'g CO₂e')
  assert.equal(v.panelLabel, 'Estimated')
  assert.equal(v.totalLabel, 'Total, estimated')
  assert.equal(v.period, 'October 2026')
  assert.equal(v.barcodeText, 'CO2E 2026 10')
  assert.deepEqual(v.meta, [
    { label: 'Period', value: 'October 2026' },
    { label: 'Method', value: 'Our estimate' },
    { label: 'Updated', value: '28 Oct 2026, 16:30 UTC' },
  ])
})

test('the servers row names Switzerland, and its note names both hosts', () => {
  const row = r.fleet.rows.find((x) => x.key === 'servers')
  assert.equal(row.label, 'Servers in Switzerland')
  assert.equal(row.source, 'Our server list')
  assert.equal(row.note, 0)
  assert.deepEqual(r.fleet.notes[0], {
    index: 0,
    name: 'Servers in Switzerland',
    text: 'Only our servers at Infomaniak and Exoscale. The receipt leaves out the Bunny containers that serve this website.',
  })
  assert.deepEqual(
    r.fleet.notes.map((n) => n.index),
    [0, 1, 2, 3],
  )
  assert.equal(
    r.fleet.notes[3].text,
    '57% of the total. Making, shipping and disposing of the servers emits more carbon than running them.',
  )
})

test('the estimate prints as it did on 19-10-2026 for the fleet it described then: 1,958 g, 843 + 1,115', () => {
  const v = r.previous
  assert.equal(v.state, 'estimate')
  assert.equal(v.total, '1,958')
  assert.deepEqual([figures(v).servers, figures(v).vcpu, figures(v).use, figures(v).embodied], ['7', '21', '843 g', '1,115 g'])
})

test('no report that is not our own estimate prints a figure: the retired host report, an unknown source, no working, a number that is not finite, no report', () => {
  for (const name of ['hostReport', 'hostReportWithWorking', 'noWorking', 'notFinite', 'none']) {
    assert.equal(r[name].state, 'unavailable', name)
    assert.deepEqual(Object.keys(r[name]).sort(), ['lead', 'state'], `${name}: nothing but its state and the section's lead`)
    assert.equal(r[name].lead, "We calculate it from the servers we run, a published grid figure and four assumptions of our own. We don't meter any of it.", name)
  }
})

test("nothing the receipt prints speaks of a host's report", () => {
  assert.doesNotMatch(JSON.stringify(r.fleet), /\bhost/i)
  assert.doesNotMatch(JSON.stringify(r.previous), /\bhost/i)
})
