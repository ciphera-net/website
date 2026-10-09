import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * WEB-28 real-render fix (09-10-2026) — isolated coverage for `CmsRichText.tsx`'s
 * inline-link handling (defect 3 of the real-render proof): an internal href
 * (`/…`) must render through `next/link` — same component the coded pages use for
 * their own inline links — while an external href (`https://…`) stays a plain
 * `<a>`, same as the coded page's own cross-origin links
 * (`app/products/id/page.tsx`'s `id.ciphera.net/login`). Real `next/link`
 * destructures `href` out of its own props and re-attaches it LAST
 * (`node_modules/next/dist/client/app-dir/link.js`): `<Link href=… className=…>`
 * renders `class="…" href="…"`, never the other way round, so this harness's
 * `next/link` shim (`__tests__/render/shim-next-link.tsx`) must reproduce that
 * reordering — a shim that merely renders a plain `<a href=… {...rest}>` cannot
 * tell "really goes through Link" apart from "fell back to a raw anchor", which is
 * exactly how this bug passed the parity harness while failing a real Next build
 * (see that shim file's own header).
 *
 * REAL RENDER (`renderToStaticMarkup`, bundled by esbuild — same device as
 * `pages-seed-parity.render.mjs`), one process.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, '__tests__', 'render', '.out')
const outFile = join(outDir, 'rich-text-links.mjs')

let result

before(() => {
  mkdirSync(outDir, { recursive: true })
  execFileSync(
    'npx',
    [
      '--yes', 'esbuild',
      join(root, '__tests__', 'render', 'rich-text-links-harness-entry.tsx'),
      '--bundle', '--platform=node', '--format=esm', '--target=node20',
      `--tsconfig=${join(root, 'tsconfig.json')}`,
      '--packages=external',
      `--alias:next/link=${join(root, '__tests__', 'render', 'shim-next-link.tsx')}`,
      `--outfile=${outFile}`,
    ],
    { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] }
  )
  const stdout = execFileSync('node', [outFile], { cwd: root, encoding: 'utf-8' })
  result = JSON.parse(stdout)
}, 60_000)

test('cmsRichNodes: an internal href (/glossary/opaque) renders through next/link — class BEFORE href, the real Link reordering', () => {
  assert.match(result.internalCmsRichNodes, /<a class="text-primary hover:underline" href="\/glossary\/opaque">OPAQUE<\/a>/)
})

test('cmsRichNodes: an external href (https://id.ciphera.net/login) stays a plain <a> — href BEFORE class, no reordering', () => {
  assert.match(result.externalCmsRichNodes, /<a href="https:\/\/id\.ciphera\.net\/login" class="text-primary hover:underline">id\.ciphera\.net<\/a>/)
})

test('cmsRichNodes: an in-page anchor (#pricing) is internal too — goes through next/link, same as a site-relative path', () => {
  assert.match(result.anchorCmsRichNodes, /<a class="text-primary hover:underline" href="#pricing">pricing<\/a>/)
})

test('cmsRichNodes: an href dropUnsafeHrefs already stripped (javascript:) renders a plain <a> with no href — not routed through Link with an undefined href', () => {
  assert.match(result.strippedHrefCmsRichNodes, /<a class="text-primary hover:underline">unsafe<\/a>/)
  assert.doesNotMatch(result.strippedHrefCmsRichNodes, /href=/)
})

test('CmsRichText (the plain text-section body, no styling class) applies the SAME internal/external rule as cmsRichNodes', () => {
  assert.match(result.internalCmsRichText, /<a href="\/glossary\/opaque">OPAQUE<\/a>/)
})

test('NEGATIVE CONTROL: the shim really does reorder — class before href is NOT simply how a raw <a href=… className=…> renders', () => {
  // The external case (plain <a>, no Link involved) keeps href FIRST — proving the
  // internal case's class-before-href ordering above comes from routing through
  // next/link, not from some blanket "always reorder" bug in the test fixtures.
  assert.match(result.externalCmsRichNodes, /<a href="https:\/\/id\.ciphera\.net\/login" class=/)
})
