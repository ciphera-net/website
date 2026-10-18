import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * WEB-28 build task §3 — the Phase E rule wired into the five migratable product
 * pages, the same device pulse-website's SEO cluster uses
 * (`app/cookieless-analytics/page.tsx`, `lib/cms-pages.ts`'s `mergePageSeo`): a
 * published CMS page renders INSTEAD of the coded JSX, never alongside it; its SEO
 * title is the FULL title tag, applied absolute; its own SoftwareApplication (or
 * SoftwareSourceCode) + BreadcrumbList JSON-LD stays code either way.
 *
 * 🔁 CORRECTED 09-10-2026 — real-render fix. This file used to assert that the
 * schema script is stringified TWICE per page (once in the `if (cms)` branch, once
 * in the coded fallback) and that `<CmsPage page={cms} breadcrumbs={false} />` is
 * the call. That was the bug: `CmsPage` itself never saw the schema, so a caller
 * that renders it WITHOUT replicating that emission by hand — the draft preview
 * route, `app/preview/page/[id]/page.tsx`, which calls `<CmsPage page={page} />`
 * directly — got only `CmsPage`'s generic, derived BreadcrumbList, measured against
 * a real preview render. The schema now lives once in `lib/cms/product-schema.ts`,
 * keyed by path, and `CmsPage` reads it from there itself (see that module's and
 * `CmsPage.tsx`'s own comments) — so a page's CMS branch is just `<CmsPage
 * page={cms} />`, no sibling `<script>`, no `breadcrumbs` override, and the schema
 * is stringified exactly ONCE per page.tsx file (the coded fallback only).
 *
 * SOURCE-LEVEL, same reason as every sibling test here (`.woodpecker/test.yml`).
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

const PAGES = [
  { file: 'app/products/captcha/page.tsx', path: '/products/captcha', schema: 'captchaSchema' },
  { file: 'app/products/id/page.tsx', path: '/products/id', schema: 'idSchema' },
  { file: 'app/products/pulse/page.tsx', path: '/products/pulse', schema: 'pulseSchema' },
  { file: 'app/products/relay/page.tsx', path: '/products/relay', schema: 'relaySchema' },
  { file: 'app/products/tessera/page.tsx', path: '/products/tessera', schema: 'tesseraSchema' },
]

test('mergePageSeo exists and applies a CMS title as the FULL title tag (absolute), same device as pulse-website', () => {
  const src = code('lib/cms/page-runtime.ts')
  assert.match(src, /export function mergePageSeo\(path: string, fallback: Metadata, seo: PageSeo \| undefined\): Metadata/)
  assert.match(src, /if \(seo\.title\) merged\.title = \{ absolute: seo\.title \}/)
  assert.doesNotMatch(src, /template:/, 'ciphera.net pages have no title TEMPLATE to preserve (unlike pulse-website) — never invent one')
})

// 🔁 THE OVERHAUL (18-10-2026) RETIRED THE FIVE PRODUCT PAGES (plan D1/D2/D7). Their
// page.tsx files are gone and each address is a permanent Tier 1 redirect, so nothing a
// CMS page publishes at one of them can render. What used to be pinned per page is
// pinned here as the new state.
test('the product pages are gone and every one of their addresses is a Tier 1 redirect, mirrored in both copies', () => {
  const config = code('next.config.ts')
  const mirrors = ['scripts/generate-redirects.ts', 'lib/cms/redirect-build.ts'].map((f) => [f, code(f)])
  for (const { file, path } of PAGES) {
    assert.throws(() => read(file), /ENOENT/, `${file} must not exist any more`)
    assert.match(config, new RegExp(`\\['${path.replace('/', '\\/')}', '[^']+'\\]`), `${path} must be a Tier 1 redirect in next.config.ts`)
    for (const [f, src] of mirrors) {
      assert.match(src, new RegExp(`'${path.replace('/', '\\/')}',`), `${f}'s TIER1_EXACT must mirror ${path}`)
    }
  }
})

test("CmsPage reads lib/cms/product-schema.ts by page.path and emits that INSTEAD of the generic breadcrumb — unconditionally, not gated by the breadcrumbs prop", () => {
  const cmsPageSrc = code('components/cms/CmsPage.tsx')
  assert.match(cmsPageSrc, /import \{ productSchemaFor \} from '@\/lib\/cms\/product-schema'/)
  assert.match(cmsPageSrc, /const schema = productSchemaFor\(page\.path\)/)
  assert.match(cmsPageSrc, /schema \? \(\s*<script type="application\/ld\+json" dangerouslySetInnerHTML=\{\{ __html: JSON\.stringify\(schema\) \}\} \/>\s*\) : \(\s*breadcrumbs && <Breadcrumbs items=\{breadcrumbItemsForPath\(page\.path\)\} \/>\s*\)/)
})

test('product-schema.ts registers exactly the five migratable paths, each with a BreadcrumbList', () => {
  const src = code('lib/cms/product-schema.ts')
  for (const { path } of PAGES) {
    assert.match(src, new RegExp(`'${path.replace('/', '\\/')}': \\[`), `product-schema.ts has no entry for ${path}`)
  }
  // Exactly ONE literal BreadcrumbList type, in the shared helper — never one per
  // entry (that would be the five-near-duplicates shape this module replaced).
  const breadcrumbCount = (src.match(/'@type': 'BreadcrumbList'/g) ?? []).length
  assert.equal(breadcrumbCount, 1, 'BreadcrumbList must be built by ONE shared breadcrumbList() helper, not inlined per entry')
  assert.match(src, /function breadcrumbList\(leafName: string\)/)
})

test('MIGRATABLE_PAGE_PATHS is empty since the overhaul: no coded address can be served from the CMS', () => {
  const src = code('lib/cms/page-build.ts')
  assert.match(src, /export const MIGRATABLE_PAGE_PATHS: readonly string\[\] = \[\]/)
})
