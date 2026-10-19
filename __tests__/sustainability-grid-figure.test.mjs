import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * /sustainability states one Swiss grid figure, from one place (lib/sustainability-grid.ts), with its source. Until
 * 19-10-2026 the page said the grid "runs at about 12 grams of CO₂ per kilowatt-hour", cited to the Swiss Federal Office
 * of Energy; no published figure for the electricity used in Switzerland is anywhere near it (42 to 114 g across the
 * sources checked). The figure is now the 2025 Swiss consumer mix from VSE.
 *
 * 🔑 SOURCE-LEVEL, like the rest of this suite: the module's figure stays in a plausible consumer-mix range and names
 * its source; no file the site ships states a 12 g grid; the grid block and the page's emergency report both read the
 * module instead of typing a number.
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

test('the grid figure is a plausible Swiss consumer-mix value, with its source named', () => {
  const src = read('lib/sustainability-grid.ts')
  const g = Number(/gCO2ePerKWh:\s*(\d+(?:\.\d+)?)/.exec(src)?.[1])
  // VSE's location-based consumer mix: 57 g in 2024, 90 g in 2025, over 180 g in the mid-2010s.
  assert.ok(g >= 30 && g <= 250, `gCO2ePerKWh is ${g}: outside 30-250 g/kWh, so not a consumer-mix figure`)
  const source = /source:\s*'([^']+)'/.exec(src)?.[1] ?? ''
  assert.match(source, /consumer mix/, 'the source must say it is the consumer mix')
  assert.match(source, /VSE/, 'the source must name its publisher')
})

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

test('the grid block and the emergency report read the shared figure', () => {
  const block = code(read('components/sustainability/swiss-grid-block.tsx'))
  assert.ok((block.match(/SWISS_GRID\.gCO2ePerKWh/g) ?? []).length >= 2, 'the stat and the sentence both read SWISS_GRID')
  const page = code(read('app/sustainability/page.tsx'))
  assert.doesNotMatch(page, /gridIntensity:\s*\{\s*amount:\s*\d/, 'the emergency report types its own grid number')
  assert.match(page, /gridIntensity:\s*\{\s*amount:\s*SWISS_GRID\.gCO2ePerKWh/)
  assert.match(page, /gridSource:\s*SWISS_GRID\.source/)
})
