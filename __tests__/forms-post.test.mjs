import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Every form declares method="post". A form's submit handler runs only after hydration; before it, or without
 * JavaScript, the browser submits the form itself, and a form with no method submits with GET, which puts every field
 * in the address bar, the browser history and the access logs. Measured on the contact form, 19-10-2026: pressing Send
 * before hydration put the whole message in the URL.
 *
 * 🔑 SOURCE-LEVEL, like the rest of this suite: every `<form` opening tag in app/ and components/ (comments stripped
 * first) must carry method="post".
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = ['app', 'components']

function files(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...files(p))
    else if (/\.(tsx|jsx)$/.test(name)) out.push(p)
  }
  return out
}

function code(p) {
  return readFileSync(p, 'utf-8')
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, '')) // keep the newlines, so a line number is the file's
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('every form submits with POST, so nothing typed into it reaches a URL', () => {
  const missing = []
  let seen = 0
  for (const dir of DIRS) {
    for (const p of files(join(root, dir))) {
      const src = code(p)
      for (const m of src.matchAll(/<form\b[^>]*>/g)) {
        seen++
        if (!/\bmethod="post"/.test(m[0])) {
          const line = src.slice(0, m.index).split('\n').length
          missing.push(`${relative(root, p)}:${line}`)
        }
      }
    }
  }
  assert.ok(seen > 0, 'found no <form> at all: the scan is not reading the components')
  assert.deepEqual(missing, [], `forms without method="post": ${missing.join(', ')}`)
})
