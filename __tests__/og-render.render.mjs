import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The OG card system drawn for real (D52, 19-10-2026; plan §5l): `og-harness-entry.tsx` is bundled by esbuild and run
 * with next/og, the renderer the route serves cards from, and prints what it measured.
 *
 * 🔑 The defect this exists for: next/og's own text layout places each word by its letters' unkerned widths and draws it
 * kerned, so every word left a gap as wide as its kerning ("Migrate  Off"). lib/og/layout.ts places every glyph the way
 * the approved mock's browser did. The gaps below were measured in Chrome's canvas (Geist SemiBold 100 px, -4 px
 * tracking: 22, 27 and 24 px); the control is the same line set by next/og itself, which must still miss them, or this
 * test could not see the defect.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, '__tests__', 'render', '.out')
const outFile = join(outDir, 'og-harness.mjs')
const CHROME_GAPS = [22, 27, 24]

let r

before(() => {
  mkdirSync(outDir, { recursive: true })
  execFileSync(
    'npx',
    [
      '--yes', 'esbuild',
      join(root, '__tests__', 'render', 'og-harness-entry.tsx'),
      '--bundle', '--platform=node', '--format=esm', '--target=node20',
      `--tsconfig=${join(root, 'tsconfig.json')}`,
      '--packages=external',
      // Next ships `og` as a CommonJS file with no exports map, so Node's ESM resolver needs the extension.
      '--alias:next/og=next/og.js',
      `--outfile=${outFile}`,
    ],
    { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] },
  )
  r = JSON.parse(execFileSync('node', [outFile], { cwd: root, encoding: 'utf-8' }))
})

test('the title is lifted by where next/og really puts a 100 px Geist SemiBold baseline', () => {
  // The H's bottom edge sits on the baseline: its last inked row is the one above it.
  assert.equal(r.baselineBottomRow + 1, r.satoriBaseline)
})

test('word gaps are the ones Chrome drew, and next/og’s own layout is not (the control)', () => {
  assert.equal(r.gaps.ours.length, 3)
  r.gaps.ours.forEach((g, i) => assert.ok(Math.abs(g - CHROME_GAPS[i]) <= 1, `gap ${i}: ${g} px, Chrome ${CHROME_GAPS[i]} px (${r.gaps.ours})`))
  assert.ok(r.gaps.theirs.some((g, i) => Math.abs(g - CHROME_GAPS[i]) > 3), `the control no longer shows the defect (${r.gaps.theirs})`)
})

test('titles wrap as the approved mock wrapped them', () => {
  assert.deepEqual(r.wrap.post, ['How to Migrate Off', 'Google Analytics:', 'A 2026 Guide'])
  // A one- or two-letter word never ends a line.
  for (const line of r.wrap.shortWord.slice(0, -1)) assert.doesNotMatch(line, /\s\S{1,2}$/, `"${line}" ends in a short word`)
  // The orange block is the full stop.
  assert.deepEqual(r.wrap.period, ['About Ciphera'])
  assert.deepEqual(r.wrap.lead, ['We are a small software company in Belgium.'])
})

test('a card is a 1200 x 630 PNG', () => {
  assert.deepEqual(r.card.signature, [137, 80, 78, 71, 13, 10, 26, 10])
  assert.equal(r.card.width, 1200)
  assert.equal(r.card.height, 630)
  assert.ok(r.card.bytes > 10000, `a ${r.card.bytes}-byte card has no title`)
})

test('a title outside the metrics still gets a card, set by the renderer', () => {
  assert.deepEqual(r.titleDots.metrics.layout, 'metrics')
  assert.equal(r.titleDots.metrics.lines, 1)
  // The approved card of the same title has 730 dots; the 1 px stroke keeps the system within a few per cent of it.
  assert.ok(Math.abs(r.titleDots.metrics.dots - 730) / 730 < 0.05, `${r.titleDots.metrics.dots} dots`)
  assert.equal(r.titleDots.fallback.layout, 'renderer')
  assert.ok(r.titleDots.fallback.dots > 200)
})

test('card addresses parse back, and nothing else parses', () => {
  assert.match(r.url.page, /^\/og\/page--about--[0-9a-f]{12}\.png$/)
  assert.match(r.url.learn, /^\/og\/learn--pulse~core-web-vitals--[0-9a-f]{12}\.png$/)
  const [page, learn, upper, dots, jpg, kind] = r.url.parsed
  assert.equal(page.kind, 'page')
  assert.equal(page.key, 'about')
  assert.deepEqual(learn, { kind: 'learn', key: 'pulse~core-web-vitals', hash: '0123456789ab', variant: 'card' })
  assert.equal(upper, null)
  assert.equal(dots, null)
  assert.equal(jpg, null)
  assert.equal(kind, null)
  assert.ok(r.url.hashChangesWithWords, 'a changed title must be a new address')
  assert.deepEqual(r.url.systemCard, [true, true, false, false])
})

test('a cover is the card, pixel for pixel, on the card’s ground at DEV’s 1000:420 shape', () => {
  assert.equal(r.cover.width, 1500)
  assert.equal(r.cover.height, 630)
  assert.equal(r.cover.width * 420, r.cover.height * 1000, 'not DEV’s cover shape: DEV would crop it')
  assert.equal(r.cover.left, 150)
  // The card's own pixels, unscaled and unfiltered: a resampled card would differ here.
  assert.equal(r.cover.middleDiff, 0, `the cover's middle differs from the card by up to ${r.cover.middleDiff}`)
  assert.equal(r.cover.groundDiff, 0, `the cover's ground differs from #0a0a0a by up to ${r.cover.groundDiff}`)
})

test('cover addresses parse back with their own hash, and nothing else parses', () => {
  assert.match(r.url.cover, /^\/og\/post--privacy-tools--[0-9a-f]{12}--cover\.png$/)
  const [cover, jpg, covers] = r.url.coverParsed
  assert.deepEqual({ kind: cover.kind, key: cover.key, variant: cover.variant }, { kind: 'post', key: 'privacy-tools', variant: 'cover' })
  assert.equal(jpg, null)
  assert.equal(covers, null)
  assert.ok(r.url.coverHashIsItsOwn, 'a cover must not share its card’s hash, or a change to the cover alone would keep its address')
  assert.ok(r.url.coverHashChangesWithWords, 'a changed title must be a new cover address')
})
