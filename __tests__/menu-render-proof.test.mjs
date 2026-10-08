import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * M2's PROOF step: Header and Footer, refactored to render from a `MenuDocument`, must
 * produce byte-identical `renderToStaticMarkup` output to the pre-refactor coded arrays
 * (frozen in `__tests__/fixtures/legacy-*.tsx`, captured before this change touched
 * either file) when fed the mechanically generated seed (`lib/cms/menu-seed.ts`).
 *
 * 🔑 WHY A REAL RENDER, NOT SOURCE-STRING MATCHING (unlike this suite's other TSX
 * coverage, e.g. `cms-page-render.test.mjs`): the claim here is about the ACTUAL BYTES a
 * browser receives, and a string-matching test cannot see a reordered attribute, a
 * dropped prop, or a markup-structure change that still "contains the right words". The
 * render happens out-of-process (`harness-entry.tsx`, bundled by esbuild with minimal
 * `next/navigation` / `next/image` / `next/link` shims — real Next SSR needs the full
 * `next build`/`next dev` runtime, not available here) so this file stays plain `.mjs`,
 * consistent with every other test in this suite.
 *
 * Negative control: `harness-entry.tsx` also renders the SAME components fed a seed with
 * one label mutated — proving the comparison is sensitive to the data, not vacuously
 * equal because nothing was actually exercised.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, '__tests__', 'render', '.out')
const outFile = join(outDir, 'harness.mjs')

let result

before(() => {
  mkdirSync(outDir, { recursive: true })
  execFileSync(
    'npx',
    [
      '--yes', 'esbuild',
      join(root, '__tests__', 'render', 'harness-entry.tsx'),
      '--bundle', '--platform=node', '--format=esm', '--target=node20',
      `--tsconfig=${join(root, 'tsconfig.json')}`,
      '--packages=external',
      `--alias:next/navigation=${join(root, '__tests__', 'render', 'shim-next-navigation.ts')}`,
      `--alias:next/image=${join(root, '__tests__', 'render', 'shim-next-image.tsx')}`,
      `--alias:next/link=${join(root, '__tests__', 'render', 'shim-next-link.tsx')}`,
      `--outfile=${outFile}`,
    ],
    { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] }
  )
  const stdout = execFileSync('node', [outFile], { cwd: root, encoding: 'utf-8' })
  result = JSON.parse(stdout)
})

test('Header: a plain page (no Features panel) renders byte-identical from the seed document and the pre-refactor coded arrays', () => {
  assert.equal(result.headerPlain.current, result.headerPlain.legacy)
})

test('Header: a product page (Features panel present, stays code) renders byte-identical from the seed document and the pre-refactor coded arrays', () => {
  assert.equal(result.headerProduct.current, result.headerProduct.legacy)
})

test('Footer renders byte-identical from the seed document and the pre-refactor coded arrays', () => {
  assert.equal(result.footerCurrent, result.footerLegacy)
})

test('negative control: a mutated seed diverges from both the legacy render and the unmutated seed render (Header)', () => {
  assert.notEqual(result.headerMutated, result.headerPlain.legacy)
  assert.notEqual(result.headerMutated, result.headerPlain.current)
})

test('negative control: a mutated seed diverges from both the legacy render and the unmutated seed render (Footer)', () => {
  assert.notEqual(result.footerMutated, result.footerLegacy)
  assert.notEqual(result.footerMutated, result.footerCurrent)
})

test('the comparison is non-trivial: every rendered string is non-empty and the two sites of the comparison are not comparing a component against itself by mistake', () => {
  assert.ok(result.headerPlain.legacy.length > 1000)
  assert.ok(result.footerLegacy.length > 500)
  // Sanity: the product page's render differs from the plain page's (the Features panel
  // actually renders) — otherwise this pair would prove nothing about that code path.
  assert.notEqual(result.headerPlain.legacy, result.headerProduct.legacy)
})
