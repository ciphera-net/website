import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * A glossary term's body goes through the post body's sanitizer (24-10-2026). Until then the term page injected
 * WordPress's HTML as sent (`dangerouslySetInnerHTML={{ __html: term.html }}`), while every post body went through the
 * allowlist.
 *
 * REAL RENDER: `renderGlossaryBody` (components/overhaul/glossary/body.tsx) through `renderToStaticMarkup`, bundled
 * by esbuild in one process, the same device as `blog-new-tab-links.render.mjs`. Exact strings, written from what the
 * sanitizer and the HTML parser do.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, '__tests__', 'render', '.out')
const outFile = join(outDir, 'glossary-body.mjs')

let result

before(() => {
  mkdirSync(outDir, { recursive: true })
  execFileSync(
    'npx',
    [
      '--yes', 'esbuild',
      join(root, '__tests__', 'render', 'glossary-body-entry.tsx'),
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

test("WordPress's block classes go and the text stays (no stylesheet of the site styles them)", () => {
  assert.equal(result.blockClasses, '<p>A term.</p><p><strong>Bold</strong></p>')
})

test('a quote stays a plain quote: no post callout on a term page', () => {
  assert.equal(result.quote, '<blockquote><p>Quoted.</p></blockquote>')
})

test('script, event handlers and an image off the CDN are gone', () => {
  assert.equal(result.script, '<p>Before</p><p>After</p>')
  assert.equal(result.offCdnImage, '<p></p>')
})

test('a new-tab link keeps target and rel and ends with the hidden cue', () => {
  assert.equal(
    result.newTab,
    `<p>See <a href="https://ciphera.net/blog/x" target="_blank" rel="noreferrer noopener">the guide${CUE}</a>.</p>`
  )
})

test('an unsafe href is removed: the anchor is not a link', () => {
  assert.equal(result.unsafeHref, '<p><a>x</a></p>')
})

test('a link nested in a new-tab link splits as in a browser: the visible link has no target', () => {
  assert.equal(
    result.nested,
    `<p><strong>Read: <a href="https://ciphera.net/blog" target="_blank" rel="noreferrer noopener">${CUE}</a><a href="https://ciphera.net/blog/cookieless-analytics">Guide</a></strong></p>`
  )
})

test('the term page renders the body through renderGlossaryBody, never as raw HTML', () => {
  const src = readFileSync(join(root, 'components', 'overhaul', 'glossary', 'GlossaryTerm.tsx'), 'utf-8')
  assert.match(src, /\{renderGlossaryBody\(term\.html\)\}/)
  assert.doesNotMatch(src, /__html: term\.html/)
})
