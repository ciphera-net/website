import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(ROOT, p), 'utf8')

// 🔴 A "get started" CTA must land on /signup, not the bare app root.
//
// The root is Pulse's own marketing homepage, whose hero button opened the
// SIGN-IN form — so this site's most prominent product CTAs took a first-timer
// two hops to a screen saying "Welcome back" and asking for a password they
// never set. The header's CTA on the Pulse page has always pointed at /signup;
// the in-body ones had not. (Friction audit #2, 08-09-2026.)
const SURFACES = [
  ['app/products/pulse/page.tsx', 3],
  ['components/ClosingCta.tsx', 1],
  ['app/about/page.tsx', 1],
]

for (const [path, expected] of SURFACES) {
  test(`${path} sends a first-timer to signup`, () => {
    const src = read(path)
    const signup = [...src.matchAll(/https:\/\/pulse\.ciphera\.net\/signup/g)].length
    assert.equal(signup, expected, `${path} should carry ${expected} signup CTA(s)`)

    // The bare root must not appear as an href on these pages. It may still
    // appear as structured-data `url:` or in prose, so this is href-scoped.
    const bareHref = [...src.matchAll(/href="https:\/\/pulse\.ciphera\.net"/g)].length
    assert.equal(bareHref, 0, `${path} still links a CTA at the bare app root`)
  })
}

test('the header default CTA — every page that is not the Pulse page — goes to signup', () => {
  // 🔴 FOUND ON PRODUCTION, after the first fix deployed. The in-body CTAs were
  // all correct and /about still served one bare app-root link: the header's
  // OWN fallback, which renders on every page that does not set `signUp`. The
  // Pulse page sets it, so the surface under test was the one place the bug
  // could not be seen. Verified by counting hrefs in the SERVED html, not by
  // reading the source — the source looked fine.
  const src = read('components/ui/header-3.tsx')
  const bare = [...src.matchAll(/"https:\/\/pulse\.ciphera\.net"/g)].length
  assert.equal(bare, 0, 'the header still falls back to the bare app root')
  const fallbacks = [...src.matchAll(/branding\?\.signUp \|\| "https:\/\/pulse\.ciphera\.net\/signup"/g)].length
  assert.equal(fallbacks, 2, 'desktop and mobile headers must both fall back to signup')
})

test('the Pulse page header still offers a real sign-in', () => {
  // Not a blanket swap: somebody who already has an account needs the other door.
  const src = read('components/ui/header-3.tsx')
  assert.match(src, /signIn: 'https:\/\/pulse\.ciphera\.net\/login'/)
  assert.match(src, /signUp: 'https:\/\/pulse\.ciphera\.net\/signup'/)
})
