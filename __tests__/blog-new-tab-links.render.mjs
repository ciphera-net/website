import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * A post body's link keeps what the editor set on it (24-10-2026). WordPress's "Open in new tab" writes
 * target="_blank" rel="noreferrer noopener" and its nofollow setting adds "nofollow"; the sanitizer kept only href and
 * title, so every body link opened in the same tab and lost its nofollow. Now `target="_blank"` and five rel tokens
 * survive (`lib/blog-html.ts` schema), and `newTabLinks` gives every new-tab link noopener, noreferrer and the site's
 * hidden " (opens in a new tab)" cue.
 *
 * REAL RENDER: `renderPostBody` (components/overhaul/blog/PostBody.tsx) through `renderToStaticMarkup`, bundled by
 * esbuild in one process, the same device as `cms-rich-text-links.render.mjs`.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, '__tests__', 'render', '.out')
const outFile = join(outDir, 'blog-new-tab.mjs')

let result

before(() => {
  mkdirSync(outDir, { recursive: true })
  execFileSync(
    'npx',
    [
      '--yes', 'esbuild',
      join(root, '__tests__', 'render', 'blog-new-tab-entry.tsx'),
      '--bundle', '--platform=node', '--format=esm', '--target=node20',
      `--tsconfig=${join(root, 'tsconfig.json')}`,
      '--packages=external',
      `--outfile=${outFile}`,
    ],
    { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] }
  )
  result = JSON.parse(execFileSync('node', [outFile], { cwd: root, encoding: 'utf-8' }))
}, 60_000)

const CUE = '<span class="sr-only select-none"> (opens in a new tab)</span>'

test('an internal link set to open in a new tab keeps target and rel, and ends with the hidden cue', () => {
  assert.equal(
    result.internal,
    `<p>See <a href="/blog/privacy-tools" target="_blank" rel="noreferrer noopener">privacy tools${CUE}</a>.</p>`
  )
})

test("an external new-tab link keeps the editor's nofollow beside noopener and noreferrer", () => {
  assert.equal(
    result.externalNofollow,
    `<p>See <a href="https://example.org/a" target="_blank" rel="noreferrer noopener nofollow">a source${CUE}</a>.</p>`
  )
})

test('a new-tab link without rel gets noopener and noreferrer', () => {
  assert.equal(result.noRel, `<p>See <a href="https://example.org/b" target="_blank" rel="noopener noreferrer">b${CUE}</a>.</p>`)
})

test('a target other than _blank is dropped, and the link gets no cue', () => {
  assert.equal(result.otherTarget, '<p>See <a href="/x">x</a>.</p>')
})

test('rel keeps only nofollow, noopener, noreferrer, sponsored and ugc; a link without a new tab gets no cue', () => {
  assert.equal(result.relOnly, '<p>See <a href="https://example.org/c" rel="nofollow sponsored">c</a>.</p>')
})

test('a rel whose every token is dropped leaves no rel attribute at all', () => {
  assert.equal(result.relEmptied, '<p>See <a href="https://example.org/d">d</a>.</p>')
})

test('a plain link is unchanged', () => {
  assert.equal(result.plain, '<p>See <a href="/trust">trust</a>.</p>')
})

test('an anchor whose unsafe href the sanitizer removed is not a link: no target, no cue', () => {
  assert.equal(result.unsafe, '<p>See <a>u</a>.</p>')
})

test('a new-tab link inside a heading: the heading keeps the cue, the table of contents and the id do not', () => {
  assert.equal(
    result.heading,
    `<h2 id="read-the-guide">Read <a href="/blog/x" target="_blank" rel="noopener noreferrer">the guide${CUE}</a></h2><p>Body.</p>`
  )
  assert.deepEqual(result.headings, [{ id: 'read-the-guide', text: 'Read the guide' }])
})
