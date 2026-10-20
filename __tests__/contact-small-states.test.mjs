import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * R11 (D69) — the contact form's small states. Source-level, same as the rest of this suite; the behaviour (the answer
 * 16 px under Send at both widths and on screen at 390, gone after one keystroke, a repeated line said again, the copy
 * words, the address selected on a failed copy) is measured in Chromium by
 * Public/docs/data/20-10-2026-r11-small-states/capture-states.mjs.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
function code(p) {
  return readFileSync(join(root, p), 'utf-8')
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}
const form = code('components/overhaul/contact/ContactForm.tsx')
const hook = form.slice(form.indexOf('function useContactForm('), form.indexOf('type MockForm'))
const status = form.slice(form.indexOf('function Status('), form.indexOf('function PrivacyNote('))
const formB = form.slice(form.indexOf('export function FormB('), form.indexOf('export function FormC('))
const copy = code('components/overhaul/trust/CopyButton.tsx')

test('every result line is set through announce(), which also bumps statusSeq', () => {
  assert.match(hook, /function announce\(next[^)]*\) \{\s*setStatus\(next\)\s*setStatusSeq\(\(n\) => n \+ 1\)/)
  for (const line of ["announce('captcha')", "announce('sending')", "announce('sent')", "announce('failed')"]) {
    assert.ok(hook.includes(line), `${line} is missing`)
  }
  assert.match(hook, /announce\(response\.status === 403 \? 'captcha' : 'failed'\)/)
  // Only "idle" (an invalid field, the check done) is set directly: it is not a result line.
  assert.doesNotMatch(hook, /setStatus\('(?:sending|sent|failed|captcha)'\)/)
  assert.doesNotMatch(hook, /setStatus\(response\.status/)
  assert.match(hook, /return \{[^}]*\bstatusSeq\b/)
})

test('editing a field clears "sent" and "failed": the line is about the message it was sent with', () => {
  const change = hook.slice(hook.indexOf('function change('), hook.indexOf('function announce('))
  assert.match(change, /setStatus\(\(s\) => \(s === 'sent' \|\| s === 'failed' \? 'idle' : s\)\)/)
})

test('a repeated line is emptied and filled again after a real 100 ms timer, never in the next frame', () => {
  assert.match(status, /form\.statusSeq !== last\.current\.seq && words === last\.current\.words/)
  assert.match(status, /window\.setTimeout\(\(\) => setBlank\(false\), 100\)/)
  assert.match(status, /return \(\) => window\.clearTimeout\(timer\)/)
  // A refill in the next animation frame is batched into the same render: the DOM never changes (measured).
  assert.doesNotMatch(status, /requestAnimationFrame/)
  assert.match(status, /<div role="status" className=\{className\}>/)
})

test('B: the line comes right after the button, in one grid with the notes and no row gap', () => {
  const grid = formB.slice(formB.indexOf('<div className="mt-8 grid'), formB.indexOf('</form>'))
  assert.match(grid, /^<div className="mt-8 grid justify-items-start lg:grid-cols-\[auto_minmax\(0,1fr\)\] lg:items-center lg:gap-x-8">/)
  const button = grid.indexOf('<SubmitButton form={form} />')
  const line = grid.indexOf('<Status form={form} className="w-full lg:col-span-2 lg:row-start-2" />')
  const notes = grid.indexOf('className="mt-5 space-y-1 text-sm text-muted-foreground lg:col-start-2 lg:row-start-1 lg:mt-0"')
  assert.ok(button > 0 && line > button && notes > line, `order: button ${button}, line ${line}, notes ${notes}`)
  // An empty line must take no space, so the grid has no row gap (the spacing is the line's own mt-4).
  assert.doesNotMatch(grid.slice(0, grid.indexOf('>')), /\bgap-(?!x-)/)
  // The line is no longer after the row, 120 px under the button on a phone.
  assert.equal((formB.match(/<Status /g) || []).length, 1)
})

test('a copy shows its word beside the button, and a failed copy selects the address where it is shown', () => {
  assert.match(copy, /'relative inline-flex h-10 w-10 shrink-0/)
  assert.match(
    copy,
    /\{word && \(\s*<span\s+aria-hidden="true"\s+className="pointer-events-none absolute right-full top-1\/2 mr-3 -translate-y-1\/2 whitespace-nowrap text-sm text-muted-foreground"\s*>\s*\{word\}/,
  )
  assert.match(copy, /const button = e\.currentTarget\s+try \{/)
  assert.match(copy, /button\.closest\('li, dd, div'\)/)
  assert.match(copy, /window\.getSelection\(\)\?\.selectAllChildren\(shown\)/)
  // The live region still speaks the result; the visible word is hidden from assistive technology.
  assert.match(copy, /<span className="sr-only" aria-live="polite">\s*\{word \?\? ''\}/)
})
