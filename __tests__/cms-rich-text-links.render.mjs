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

// ── "Open in new tab" and nofollow (24-10-2026) ─────────────────────────────────────
// Page text kept only href, so a link the editor set to open in a new tab opened in the same tab and lost its
// nofollow. Now the schema keeps target="_blank" and five rel tokens (EDITOR_LINK_ATTRIBUTES, lib/blog-html.ts, the
// post body's), the stored string keeps what the editor set, and the renderer adds noopener noreferrer and the
// hidden cue through the post body's newTabLinks. Exact strings, not patterns: the attribute order is part of it.
const CUE = '<span class="sr-only select-none"> (opens in a new tab)</span>'

test('new tab, internal (next/link): target and rel go through Link, the cue is the last child', () => {
  assert.equal(
    result.newTabInternalCmsRichNodes,
    `See <a class="text-primary hover:underline" target="_blank" rel="noreferrer noopener" href="/glossary/opaque">OPAQUE${CUE}</a> for details.`
  )
})

test("new tab, external: the editor's nofollow stays beside noopener and noreferrer", () => {
  assert.equal(
    result.newTabExternalNofollowCmsRichNodes,
    `Read <a href="https://example.org/a" target="_blank" rel="noreferrer noopener nofollow" class="text-primary hover:underline">a source${CUE}</a>.`
  )
})

test('CmsRichText (the text-section body): a new-tab link without rel gets noopener and noreferrer, and the cue', () => {
  assert.equal(
    result.newTabNoRelCmsRichText,
    `<div><p>See <a href="https://example.org/b" target="_blank" rel="noopener noreferrer">b${CUE}</a>.</p></div>`
  )
})

test('a target other than _blank is dropped, and the link gets no cue', () => {
  assert.equal(result.otherTargetCmsRichNodes, 'See <a class="text-primary hover:underline" href="/x">x</a>.')
})

test('rel keeps only nofollow, noopener, noreferrer, sponsored and ugc; without a new tab there is no cue', () => {
  assert.equal(
    result.relOnlyCmsRichNodes,
    'See <a href="https://example.org/c" rel="nofollow sponsored" class="text-primary hover:underline">c</a>.'
  )
})

test('a rel whose every token is dropped leaves no rel attribute', () => {
  assert.equal(result.relEmptiedCmsRichNodes, 'See <a href="https://example.org/d" class="text-primary hover:underline">d</a>.')
})

test('an anchor whose unsafe href was removed is not a link: no target, no cue', () => {
  assert.equal(result.unsafeNewTabCmsRichNodes, 'An <a class="text-primary hover:underline">unsafe</a> link.')
})

test("STORED (sanitizeRichText): the page document keeps the editor's target and rel, and NO cue", () => {
  // The cue is added at render time only: the allowlist has no span, so a stored cue would be unwrapped by the
  // render-time sanitizer into visible text.
  assert.equal(result.storedNewTab, '<p>See <a href="/blog/x" target="_blank" rel="noreferrer noopener nofollow">x</a>.</p>')
  assert.doesNotMatch(result.storedNewTab, /span|opens in a new tab/)
})

test('STORED: a target other than _blank and a rel with no allowed token are dropped', () => {
  assert.equal(result.storedOtherTarget, '<p>See <a href="/x">x</a>.</p>')
  assert.equal(result.storedRelEmptied, '<p>See <a href="https://example.org/d">d</a>.</p>')
})

test('STORED: a protocol-relative href goes, and its target with it', () => {
  assert.equal(result.storedProtocolRelative, '<p>See <a rel="noopener">e</a>.</p>')
})

test('CmsRichText (the text-section body): a protocol-relative href goes with its target, and there is no cue', () => {
  assert.equal(result.protocolRelativeNewTabCmsRichText, '<div><p>See <a rel="noopener">e</a>.</p></div>')
})

test('the allowlists are exactly _blank and the five rel tokens (shared with the post body)', () => {
  assert.deepEqual(result.editorLinkAttributes, [['target', '_blank'], ['rel', 'nofollow', 'noopener', 'noreferrer', 'sponsored', 'ugc']])
})
