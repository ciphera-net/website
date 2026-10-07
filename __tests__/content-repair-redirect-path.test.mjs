import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validRedirectPath } from '../lib/redirect-path-rules.mjs'

/**
 * REAL execution, not source-grep — unlike the other P1-a content-repair test files,
 * `lib/redirect-path-rules.mjs` has zero imports, so the bare `node --test` CI runs
 * (no `npm ci`, no loader) can import and exercise it directly. This is the exact
 * verifier-reported defect, with a real fixture: a CMS redirect whose `from`/`to`
 * contains a path-to-regexp-significant character used to sail past the old denylist
 * and reach Next's own build-time validator unguarded (`checkCustomRoutes` →
 * `process.exit(1)`). Every case here is a value scripts/generate-redirects.ts's
 * `validPath()` now delegates to this same function for.
 */

test('rejects every path-to-regexp-significant character the old denylist let through', () => {
  // The verifier's own two confirmed repros.
  assert.equal(validRedirectPath('/blog/post+title'), false, '+ is a path-to-regexp modifier')
  assert.equal(validRedirectPath('/search*'), false, '* is a path-to-regexp modifier')

  // The rest of the character set path-to-regexp treats as syntax.
  assert.equal(validRedirectPath('/blog/(group)'), false, 'parens open a custom regex group')
  assert.equal(validRedirectPath('/blog/post)'), false)
  assert.equal(validRedirectPath('/products/:slug'), false, 'colon starts a named parameter')
  assert.equal(validRedirectPath('/blog/{optional}'), false)
  assert.equal(validRedirectPath('/blog/post\\title'), false, 'backslash is an escape character')
})

test('still rejects every shape the old denylist already caught', () => {
  assert.equal(validRedirectPath('relative/no-leading-slash'), false)
  assert.equal(validRedirectPath('//double-slash'), false)
  assert.equal(validRedirectPath('/has a space'), false)
  assert.equal(validRedirectPath('/has<angle>'), false)
  assert.equal(validRedirectPath('/has"quote'), false)
  assert.equal(validRedirectPath("/has'quote"), false)
  assert.equal(validRedirectPath('/query?x=1'), false)
  assert.equal(validRedirectPath('/hash#section'), false)
  assert.equal(validRedirectPath('/' + 'a'.repeat(200)), false, 'over the 200-char cap')
  assert.equal(validRedirectPath(''), false)
  assert.equal(validRedirectPath(null), false)
  assert.equal(validRedirectPath(undefined), false)
})

test('accepts ordinary CMS-authored paths, including percent-encoding and non-ASCII', () => {
  assert.equal(validRedirectPath('/blog/renamed'), true)
  assert.equal(validRedirectPath('/blog/post-title_v2.html'), true)
  assert.equal(validRedirectPath('/'), true)
  assert.equal(validRedirectPath('/a/b/c'), true)
  assert.equal(validRedirectPath('/blog/caf%C3%A9'), true, 'percent-encoded bytes are safe')
  assert.equal(validRedirectPath('/blog/café'), true, 'real non-ASCII letters are not "unsafe", merely non-English')
})
