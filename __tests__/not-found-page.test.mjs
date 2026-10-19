import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * R11 (D66, W11) — the 404 and the error page in the overhaul's vocabulary. Source-level, same as the rest of this
 * suite; what the server sends for a missing page is measured by Public/docs/data/19-10-2026-r11-404-ssr/probe-404.mjs.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('the 404 opens with the sunrise (D23) and uses the site’s own buttons, not the legacy ones', () => {
  const view = code('components/overhaul/notfound/NotFoundView.tsx')
  assert.match(view, /<PageOpeningC title=\{NOT_FOUND\.title\} lead=\{NOT_FOUND\.lead\}>/)
  assert.match(code('app/not-found.tsx'), /return <NotFoundView \/>/)
  for (const f of ['app/not-found.tsx', 'components/overhaul/notfound/NotFoundView.tsx', 'app/error.tsx', 'components/overhaul/notfound/ErrorView.tsx']) {
    assert.doesNotMatch(code(f), /btn-primary|btn-secondary|gradient-text/, f)
  }
  assert.equal(existsSync(join(root, 'app/not-found-client.tsx')), false)
})

test('W11: the words as ruled, in sentence case', () => {
  const words = code('components/overhaul/notfound/content.ts')
  assert.match(words, /title: 'Page not found'/)
  assert.match(words, /lead: 'The link may be broken, or the page has moved\.'/)
  assert.match(words, /title: 'Something went wrong'/)
  assert.match(words, /lead: "This page didn't load\. Try again, and if it keeps failing, tell us\."/)
  assert.doesNotMatch(words, /Page Not Found|Go Home|Go Back|Try Again|notified/)
})

test('the error page shows the server’s reference and never the raw error message', () => {
  const page = code('app/error.tsx')
  const view = code('components/overhaul/notfound/ErrorView.tsx')
  assert.match(page, /<ErrorView digest=\{error\.digest\} onRetry=\{reset\} \/>/)
  assert.doesNotMatch(page + view, /error\.message|\.message\b/)
  assert.match(view, /\{digest && \(/)
})
