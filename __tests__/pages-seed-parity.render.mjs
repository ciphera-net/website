import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * WEB-28 build task §7 — the CmsPage render of each page's mechanically-extracted
 * seed (scripts/pages-seed/<slug>.json) must be byte-identical to that page's own
 * coded JSX, and the merged SEO metadata must resolve to the same title/description/
 * canonical/OG/Twitter fields the coded fallback implies.
 *
 * 🔑 WHY A REAL RENDER (same reasoning as menu-render-proof.render.mjs): the claim
 * is about the ACTUAL BYTES a browser receives, not source text. The render happens
 * out-of-process (product-pages-harness-entry.tsx, bundled by esbuild with shims
 * for next/image, next/link, @/lib/seo and @/lib/cms/page-runtime — none of which
 * this harness may touch for real: no CDN fetch, no `seo.gen.ts`, no network).
 *
 * 🔑 ONE PROCESS PER (page, branch). `@ciphera-net/facet`'s own components call
 * React 19's `ReactDOM.preload()` for a fixed brand asset; React dedupes a
 * `<link rel="preload">` it has already emitted WITHIN A PROCESS, so rendering a
 * page's coded branch and its CMS branch back-to-back in one process silently
 * dropped that one link from the SECOND render only — measured directly (the same
 * page rendered alone, in its own process, carries the preload link either way).
 * Ten separate `node` invocations (bundle once, run ten times) make this, and any
 * future thing like it, structurally impossible rather than papering over one
 * instance with an exclusion list.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, '__tests__', 'render', '.out')
const outFile = join(outDir, 'pages-seed-parity.mjs')

const PAGES = ['captcha', 'id', 'pulse', 'relay', 'tessera']
const BRANCHES = ['coded', 'cms', 'preview']

/**
 * `mockup-captcha` (`components/ui/captcha-mockup.tsx`) wraps the REAL, live
 * `@ciphera-net/facet` `Captcha` widget, which calls React 19's `useId()` for its
 * checkbox/label pairing. `useId()`'s output encodes the component's PATH through the
 * fiber tree, which is necessarily different between the coded page's inline JSX and
 * the CMS path's extra `CmsPage -> Section -> FeatureSplit` wrapping — proven, not
 * assumed: the exact same widget rendered alone, in its own process, carries the
 * attribute either way, and every other attribute/byte around it matches exactly
 * once this one is normalised out. This is the ONLY place in all five pages' parity
 * that needed this — the other four mockups are static images/screenshots with no
 * interactive, labelled form control, so they call `useId()` nowhere. Captcha only.
 */
function normalizeReactUseIds(html) {
  return html.replace(/id="_R_[a-zA-Z0-9]+_"/g, 'id="_R__"')
}

function normalizeKnownDifferences(slug, branch, html) {
  if (slug === 'captcha') html = normalizeReactUseIds(html)
  return html
}

let result = {}

before(() => {
  mkdirSync(outDir, { recursive: true })
  execFileSync(
    'npx',
    [
      '--yes', 'esbuild',
      join(root, '__tests__', 'render', 'product-pages-harness-entry.tsx'),
      '--bundle', '--platform=node', '--format=esm', '--target=node20',
      `--tsconfig=${join(root, 'tsconfig.json')}`,
      '--packages=external',
      `--alias:next/image=${join(root, '__tests__', 'render', 'shim-next-image.tsx')}`,
      `--alias:next/link=${join(root, '__tests__', 'render', 'shim-next-link.tsx')}`,
      `--alias:@/lib/seo=${join(root, '__tests__', 'render', 'shim-lib-seo.ts')}`,
      `--alias:@/lib/cms/page-runtime=${join(root, '__tests__', 'render', 'shim-page-runtime.ts')}`,
      `--outfile=${outFile}`,
    ],
    { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] }
  )

  // lib/env.ts's Zod schema requires these two (no default) — captcha-mockup.tsx
  // reads env at module scope, so the bundle throws at import time without them.
  // Dummy, harness-only values; nothing here ever makes a network call.
  const env = {
    ...process.env,
    NEXT_PUBLIC_WEBSITE_API_URL: 'https://example.invalid',
    NEXT_PUBLIC_CAPTCHA_API_URL: 'https://example.invalid',
    // 🔴 Always render with a CDN base (09-10-2026). Production and CI set NEXT_PUBLIC_CDN_URL, so the coded pages emit
    // cdnUrl('/x.png'); with it unset locally both sides emitted the bare path and a CMS image that skipped cdnUrl()
    // (a 404 in production) passed here and failed only in CI. CI's own value wins when present.
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.example.invalid/website',
  }

  for (const slug of PAGES) {
    result[slug] = {}
    for (const branch of BRANCHES) {
      const stdout = execFileSync('node', [outFile, slug, branch], { cwd: root, encoding: 'utf-8', env })
      result[slug][branch] = JSON.parse(stdout)
    }
  }
}, 120_000)

for (const slug of PAGES) {
  test(`${slug}: the seed produced NO repairs (no unresolved key, no missing required field)`, () => {
    assert.deepEqual(result[slug].cms.repairs, [])
  })

  test(`${slug}: CmsPage's render of the seed is byte-identical to the coded page's own JSX`, () => {
    const cms = normalizeKnownDifferences(slug, 'cms', result[slug].cms.html)
    const coded = normalizeKnownDifferences(slug, 'coded', result[slug].coded.html)
    assert.equal(cms, coded)
  })

  test(`${slug}: CmsPage renders identically whether reached through page.tsx's CMS branch or bypassed entirely (the real preview route's own call shape) — WEB-28 real-render fix, 09-10-2026`, () => {
    // app/preview/page/[id]/page.tsx calls <CmsPage page={doc} /> directly — it has
    // no idea app/products/<slug>/page.tsx exists, so a difference between that
    // page's OWN CMS and coded branches is invisible to it. 'preview' renders the
    // exact same CmsPage call with nothing in between; it must match 'cms' exactly.
    const cms = normalizeKnownDifferences(slug, 'cms', result[slug].cms.html)
    const preview = normalizeKnownDifferences(slug, 'preview', result[slug].preview.html)
    assert.equal(preview, cms, `${slug}: the bare <CmsPage> call (preview) diverges from page.tsx's own CMS branch`)
  })

  test(`${slug}: the preview render's own JSON-LD <script> is the SAME object page.tsx's coded fallback imports from product-schema.ts — not re-derived, not hand-copied`, () => {
    const ldJson = (html) => {
      const m = html.match(/<script type="application\/ld\+json">([^<]*)<\/script>/)
      assert.ok(m, 'no application/ld+json script found')
      return JSON.parse(m[1])
    }
    assert.deepEqual(ldJson(result[slug].preview.html), ldJson(result[slug].coded.html))
  })

  test(`${slug}: the comparison is non-trivial — both renders are non-empty and actually differ from an empty page`, () => {
    assert.ok(result[slug].coded.html.length > 1000, `coded render suspiciously short: ${result[slug].coded.html.length} bytes`)
    assert.ok(result[slug].cms.sectionCount >= 5, `only ${result[slug].cms.sectionCount} sections parsed from the seed`)
  })

  test(`${slug}: the merged SEO title is the FULL title tag (layout template applied), matching the coded fallback`, () => {
    const coded = result[slug].coded.meta
    const cms = result[slug].cms.meta
    const expectedFullTitle = `${coded.title} | Ciphera`
    assert.equal(cms.title?.absolute, expectedFullTitle)
  })

  test(`${slug}: description, canonical, OG and Twitter fields match the coded fallback`, () => {
    const coded = result[slug].coded.meta
    const cms = result[slug].cms.meta
    assert.equal(cms.description, coded.description)
    assert.equal(cms.canonical, coded.canonical)
    assert.equal(cms.ogTitle, coded.ogTitle)
    assert.equal(cms.ogDescription, coded.ogDescription)
    assert.equal(cms.twitterTitle, coded.twitterTitle)
    assert.equal(cms.twitterDescription, coded.twitterDescription)
  })
}

test('NEGATIVE CONTROL: every known-difference normalisation is doing REAL work on exactly the page it claims, and is a no-op everywhere else', () => {
  // id, tessera, pulse and relay need NO normalisation — byte-identical raw. (pulse and relay needed an
  // unwrap of FeatureSplit's code-visual wrapper until facet-sections 0.3.1, 09-10-2026.)
  for (const slug of ['id', 'tessera', 'pulse', 'relay']) {
    assert.equal(result[slug].cms.html, result[slug].coded.html, `${slug} should already be identical with no normalisation at all`)
  }
  // captcha needs ONLY the useId() one.
  assert.notEqual(result.captcha.cms.html, result.captcha.coded.html, 'captcha should still differ without the useId() normalisation')
  assert.equal(normalizeReactUseIds(result.captcha.cms.html), normalizeReactUseIds(result.captcha.coded.html))
})

test('NEGATIVE CONTROL: different pages render different HTML — the comparison is not vacuously equal by construction', () => {
  assert.notEqual(result.captcha.cms.html, result.id.cms.html)
  assert.notEqual(result.captcha.coded.html, result.pulse.coded.html)
  assert.notEqual(result.relay.coded.html, result.tessera.coded.html)
})
