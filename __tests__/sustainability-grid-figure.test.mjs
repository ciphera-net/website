import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * /sustainability prints numbers it does not compute. Until 19-10-2026 the page said the Swiss grid "runs at about 12
 * grams of CO₂ per kilowatt-hour", cited to the Swiss Federal Office of Energy; no published figure for the electricity
 * used in Switzerland is near it (42 to 114 g across the sources checked), and the figure is now the 2025 consumer mix,
 * which website-backend serves with its year. The rebuilt page (R12) also dropped the emergency report that stood in for
 * a missing backend with an invented 0.5 kg.
 *
 * 🔑 SOURCE-LEVEL, like the rest of this suite: no file the site ships states a 12 g grid; the receipt prints the API's
 * grid figure and year, never a typed one; the grid note, which speaks of 2025, prints only for the 2025 figure; and the
 * route has no report of its own to fall back on.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')

function files(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...files(p))
    else if (/\.(tsx?|jsx?|mdx?)$/.test(name)) out.push(p)
  }
  return out
}

function code(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, '')) // keep the newlines, so a line number is the file's
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('no file the site ships states a 12 g grid', () => {
  const claims = []
  const scan = (p, src) => {
    const body = /\.(tsx?|jsx?)$/.test(p) ? code(src) : src
    for (const m of body.matchAll(/~?\b12\s?(?:g|grams)\b[^\n]{0,40}?(?:CO|kWh)/gi)) {
      claims.push(`${relative(root, p)}:${body.slice(0, m.index).split('\n').length}: ${m[0]}`)
    }
  }
  let seen = 0
  for (const dir of ['app', 'components', 'lib']) {
    for (const p of files(join(root, dir))) {
      seen++
      scan(p, readFileSync(p, 'utf-8'))
    }
  }
  for (const f of ['public/llms.txt', 'public/llms-full.txt']) scan(join(root, f), read(f))
  assert.ok(seen > 50, `scanned only ${seen} files: the scan is not reading the site`)
  assert.deepEqual(claims, [], `a 12 g grid claim: ${claims.join(' | ')}`)
})

test("the receipt prints the API's grid figure and year, never a typed one", () => {
  const receipt = code(read('components/overhaul/sustainability/receipt.ts'))
  assert.match(receipt, /nf\(w\.gridGCO2ePerKWh\)/, 'the grid line prints working.gridGCO2ePerKWh')
  assert.match(receipt, /R\.grid\.source\(w\.gridYear\)/, "the grid line's source carries working.gridYear")
  assert.doesNotMatch(receipt, /g CO₂e\/kWh[^`]*\b(?:12|42|78|90)\b|\b(?:12|42|78|90) g CO₂e\/kWh/, 'a grid number typed into the receipt')
})

test('the grid note, which speaks of 2025, prints only for the 2025 figure', () => {
  const content = read('components/overhaul/sustainability/content.ts')
  const year = Number(/gridYear:\s*(\d{4})/.exec(content)?.[1])
  const note = /grid:\s*'([^']+)'/.exec(content)?.[1] ?? ''
  assert.ok(year >= 2020, 'NOTES.gridYear is missing')
  assert.ok(note.includes(`In ${year},`), `the grid note does not speak of ${year}: ${note}`)
  assert.match(code(read('components/overhaul/sustainability/receipt.ts')), /w\.gridYear === NOTES\.gridYear/)
})

test('the route has no report of its own to fall back on', () => {
  const page = code(read('app/sustainability/page.tsx'))
  assert.doesNotMatch(page, /emergencyFallback|amount:\s*\d/, 'the route types a report of its own')
  assert.match(page, /receiptFrom\(await fetchImpactReport\(\)\)/)
})
