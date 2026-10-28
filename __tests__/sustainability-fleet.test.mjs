import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * /sustainability after the move to Infomaniak (28-10-2026; plan Public/docs/plans/28-10-2026-sustainability-fleet-update.md).
 * Six of our seven servers run at Infomaniak in Geneva and the mail server stays at Exoscale in Zurich, so the page names
 * both places wherever it names one: the printer's stamp, the receipt's servers row and its note, the counted line, the
 * Where block and the page description. Exoscale also removed the impact-report endpoint website-backend used to call
 * (HTTP 410), so the host's own report can never return: the page's third state is retired and every report is our own
 * estimate.
 *
 * 🔑 SOURCE-LEVEL, like the rest of this suite: the words are asserted as written, and the retired state as absent from
 * every file the site ships. What the receipt prints for a given report is proved by sustainability-receipt.render.mjs.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')

function files(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...files(p))
    else if (/\.(tsx?|jsx?|mjs)$/.test(name) && !/\.gen\.ts$/.test(name)) out.push(p)
  }
  return out
}

/** Source with its comments blanked (newlines kept, so a line number is the file's): a note about the past is not a use. */
function code(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ''))
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

const CONTENT = 'components/overhaul/sustainability/content.ts'

test('the receipt names both places: the stamp, the servers row, its note and the counted line', () => {
  const content = read(CONTENT)
  for (const line of [
    "place: 'Geneva · Zurich',",
    "servers: { label: 'Servers in Switzerland', source: 'Our server list' },",
    "servers: 'Only our servers at Infomaniak and Exoscale. The receipt leaves out the Bunny containers that serve this website.',",
    "{ icon: 'HardDrives', text: 'Compute: our servers at Infomaniak in Geneva and at Exoscale in Zurich' },",
  ]) {
    assert.ok(content.includes(line), `content.ts lacks: ${line}`)
  }
})

test('Where our servers are: Infomaniak, Exoscale, bunny.net, in that order, each with its own place', () => {
  const block = /export const WHERE = \{[\s\S]*?\n\} as const/.exec(read(CONTENT))?.[0] ?? ''
  const rows = [...block.matchAll(/\{ mark: '([^']+)', name: '([^']+)', text: '([^']+)', place: '([^']+)', flag: (?:'([^']+)'|null) \}/g)].map(
    (m) => m.slice(1),
  )
  assert.deepEqual(rows, [
    ['infomaniak', 'Infomaniak', 'Most of our servers run on Infomaniak in Geneva.', 'Geneva, Switzerland', 'ch'],
    ['exoscale', 'Exoscale', 'Our mail server runs on Exoscale in Zurich.', 'Zurich, Switzerland', 'ch'],
    ['bunnydotnet', 'bunny.net', 'This website is served by bunny.net from servers worldwide.', 'Worldwide', undefined],
  ])
})

test('every provider the Where block lists has a mark and a colour, so none draws as an empty tile', () => {
  const block = /export const WHERE = \{[\s\S]*?\n\} as const/.exec(read(CONTENT))?.[0] ?? ''
  const marks = [...block.matchAll(/mark: '([^']+)'/g)].map((m) => m[1])
  assert.equal(marks.length, 3)
  const paths = new Set([...read('components/overhaul/brand-marks.ts').matchAll(/key: '([^']+)'[^\n]*?path: '[^']+'/g)].map((m) => m[1]))
  const fillBlock = /const MARK_FILL: Record<string, string> = \{([\s\S]*?)\}/.exec(read('components/overhaul/trust/Providers.tsx'))?.[1] ?? ''
  const fills = new Set([...fillBlock.matchAll(/(\w+): '#[0-9A-Fa-f]{6}'/g)].map((m) => m[1]))
  for (const mark of marks) {
    assert.ok(paths.has(mark), `brand-marks.ts INFRA_MARKS has no path for "${mark}": ProviderMark would draw nothing`)
    assert.ok(fills.has(mark), `Providers.tsx MARK_FILL has no colour for "${mark}": ProviderMark would draw nothing`)
  }
})

test('the page description names both places, as the meta, Open Graph, X and JSON-LD descriptions all read it', () => {
  const layout = read('app/sustainability/layout.tsx')
  const description =
    "Ciphera's environmental impact: the servers we run in Geneva and Zurich, estimated with life-cycle assessment, on one of Europe's lowest-carbon grids. We buy no carbon offsets."
  assert.ok(layout.includes(description), 'the description is not the one that names Geneva and Zurich')
  assert.equal(layout.split('const DESCRIPTION =').length - 1, 1, 'one DESCRIPTION')
  assert.equal(layout.match(/description: DESCRIPTION/g)?.length, 4, 'meta, Open Graph, X and JSON-LD all read DESCRIPTION')
  assert.doesNotMatch(code(layout), /servers we run in Zurich/, 'a description that still places every server in Zurich')
})

test("no file the page ships still places our servers at Exoscale alone, in Zurich or by Exoscale's site code", () => {
  const stale = ['Exoscale servers in Zurich', 'Servers in Zurich', 'Zurich · CH-DK-2', 'CH-DK-2', 'Our servers run on Exoscale', 'Our Exoscale servers']
  const hits = []
  for (const dir of ['components/overhaul/sustainability', 'app/sustainability']) {
    for (const p of files(join(root, dir))) {
      const src = readFileSync(p, 'utf-8')
      for (const s of stale) if (src.includes(s)) hits.push(`${relative(root, p)}: ${s}`)
    }
  }
  assert.deepEqual(hits, [])
})

test("the host's own report is retired: one source, no state, no row, no words, anywhere the site ships", () => {
  assert.match(read('components/sustainability/types.ts'), /export type ReportSource = 'computed-fallback'\n/)
  const retired = [
    /exoscale-api/,
    /hostLead/,
    /panel\.host\b/,
    /\bhost(?:Use|Manufacturing|Transport|EndOfLife|Total|MethodValue)\b/,
    /state:\s*'host'/,
    /\.measured\b/,
    /From our host's report|Total, from our host|Our host's report|These figures come from our host's life-cycle report/,
  ]
  const hits = []
  let seen = 0
  for (const dir of ['app', 'components', 'lib']) {
    for (const p of files(join(root, dir))) {
      seen++
      const body = code(readFileSync(p, 'utf-8'))
      for (const re of retired) {
        const m = re.exec(body)
        if (m) hits.push(`${relative(root, p)}:${body.slice(0, m.index).split('\n').length}: ${m[0]}`)
      }
    }
  }
  assert.ok(seen > 50, `scanned only ${seen} files: the scan is not reading the site`)
  assert.deepEqual(hits, [])
})

test('the estimate and the unavailable states stay: an estimate prints only from our own report, anything else prints nothing', () => {
  const receipt = code(read('components/overhaul/sustainability/receipt.ts'))
  assert.match(receipt, /state: 'estimate'/)
  assert.match(receipt, /report\.source === 'computed-fallback'/)
  assert.match(receipt, /state: 'unavailable'/)
  assert.match(receipt, /export type Printed = \{\s*state: 'estimate'\s/, 'a printed receipt has one state')
})
