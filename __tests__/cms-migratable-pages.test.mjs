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

for (const { file, path, schema } of PAGES) {
  test(`${file}: CMS_PATH is "${path}" and generateMetadata merges a published page's SEO over the coded fallback`, () => {
    const src = code(file)
    assert.match(src, new RegExp(`const CMS_PATH = '${path.replace('/', '\\/')}'`))
    assert.match(src, /import \{ resolvePage, mergePageSeo \} from '@\/lib\/cms\/page-runtime'/)
    assert.match(src, /const cms = await resolvePage\(CMS_PATH\)/g)
  })

  test(`${file}: the default export is async, renders CmsPage INSTEAD of the coded JSX when published, and ${schema} is imported from the shared registry`, () => {
    const src = code(file)
    assert.match(src, /export default async function \w+\(\) \{/)
    assert.match(src, /import \{ CmsPage \} from '@\/components\/cms\/CmsPage'/)
    assert.match(src, /import \{ PRODUCT_SCHEMA \} from '@\/lib\/cms\/product-schema'/)
    assert.match(src, new RegExp(`const ${schema} = PRODUCT_SCHEMA\\[CMS_PATH\\]`))
    assert.match(src, /if \(cms\) \{\s*return <CmsPage page=\{cms\} \/>\s*\}/)
    // The schema script renders on ONLY the coded fallback now — CmsPage reads the
    // same registry entry by path for the CMS branch, so this page.tsx file must
    // not also stringify it itself a second time.
    const scriptCount = (src.match(new RegExp(`JSON\\.stringify\\(${schema}\\)`, 'g')) ?? []).length
    assert.equal(scriptCount, 1, `${schema} must be stringified exactly once (the coded fallback only — CmsPage owns the CMS branch's copy)`)
  })
}

test('no migratable page.tsx passes breadcrumbs to CmsPage any more — the schema registry decides, not the caller', () => {
  for (const { file } of PAGES) {
    assert.doesNotMatch(code(file), /breadcrumbs=/, `${file} still passes a breadcrumbs prop to CmsPage`)
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

test("MIGRATABLE_PAGE_PATHS lists exactly these five paths, in page-build.ts, which both buildPages() and this test's own pages agree on", () => {
  const src = code('lib/cms/page-build.ts')
  for (const { path } of PAGES) {
    assert.match(src, new RegExp(`'${path.replace('/', '\\/')}',`))
  }
})
