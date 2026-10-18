import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Every link that opens a new tab carries `noreferrer`, the site's convention for outbound links: without it the
 * browser sends ciphera.net as the Referer to the site the reader opens. The glossary's see-also links lost it when the
 * term page moved to its new component (18-10-2026), and nothing noticed.
 *
 * 🔑 SOURCE-LEVEL, like the rest of this suite: every `target` set to `_blank`, as a JSX attribute or an object
 * property, must have `noreferrer` within the same element, read as the 300 characters either side of it (comments
 * stripped first, so a doc comment that mentions `_blank` is not a link).
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = ['app', 'components', 'lib']
const BLANK = /target(?:=\{?\s*|\s*:\s*)["'`]_blank["'`]/g

function files(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...files(p))
    else if (/\.(tsx|ts|jsx|js|mjs)$/.test(name)) out.push(p)
  }
  return out
}

function code(p) {
  return readFileSync(p, 'utf-8')
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, '')) // keep the newlines, so a line number is the file's
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('every link that opens a new tab carries noreferrer', () => {
  const missing = []
  let seen = 0
  for (const dir of DIRS) {
    for (const file of files(join(root, dir))) {
      const src = code(file)
      for (const m of src.matchAll(BLANK)) {
        seen++
        const around = src.slice(Math.max(0, m.index - 300), m.index + 300)
        if (!around.includes('noreferrer')) {
          const line = src.slice(0, m.index).split('\n').length
          missing.push(`${relative(root, file)}:${line}`)
        }
      }
    }
  }
  assert.ok(seen > 0, 'the scan found no new-tab links at all, so it is not reading the tree')
  assert.deepEqual(missing, [], `new-tab links without noreferrer: ${missing.join(', ')}`)
})
