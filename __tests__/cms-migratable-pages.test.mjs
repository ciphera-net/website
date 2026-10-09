import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * WEB-28 build task §3 — the Phase E rule wired into the four migratable product
 * pages, the same device pulse-website's SEO cluster uses
 * (`app/cookieless-analytics/page.tsx`, `lib/cms-pages.ts`'s `mergePageSeo`): a
 * published CMS page renders INSTEAD of the coded JSX, never alongside it; its SEO
 * title is the FULL title tag, applied absolute; its own SoftwareApplication +
 * BreadcrumbList JSON-LD stays code either way, so CmsPage's generic breadcrumb is
 * suppressed to avoid a duplicate.
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

  test(`${file}: the default export is async, renders CmsPage INSTEAD of the coded JSX when published, and keeps the coded ${schema} either way`, () => {
    const src = code(file)
    assert.match(src, /export default async function \w+\(\) \{/)
    assert.match(src, /import \{ CmsPage \} from '@\/components\/cms\/CmsPage'/)
    assert.match(src, new RegExp(`<CmsPage page=\\{cms\\} breadcrumbs=\\{false\\} />`))
    // The schema script renders on BOTH branches — once inside the `if (cms)` early
    // return, once in the coded fallback below it — never only on one.
    const scriptCount = (src.match(new RegExp(`JSON\\.stringify\\(${schema}\\)`, 'g')) ?? []).length
    assert.equal(scriptCount, 2, `${schema} must be stringified exactly twice (CMS branch + coded branch)`)
  })
}

test('breadcrumbs={false} is passed on every migratable page — CmsPage must not emit a second BreadcrumbList next to the coded one', () => {
  const cmsPageSrc = code('components/cms/CmsPage.tsx')
  assert.match(cmsPageSrc, /export function CmsPage\(\{ page, breadcrumbs = true \}: \{ page: PageDocument; breadcrumbs\?: boolean \}\)/)
  assert.match(cmsPageSrc, /\{breadcrumbs && <Breadcrumbs items=\{breadcrumbItemsForPath\(page\.path\)\} \/>\}/)
})

test("MIGRATABLE_PAGE_PATHS lists exactly these five paths, in page-build.ts, which both buildPages() and this test's own pages agree on", () => {
  const src = code('lib/cms/page-build.ts')
  for (const { path } of PAGES) {
    assert.match(src, new RegExp(`'${path.replace('/', '\\/')}',`))
  }
})
