import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * WEB-28 — the CMS page renderer: `CmsPage`/`CmsRichText`/`CmsLink`, the catch-all
 * route (`app/[...slug]/page.tsx`), the preview route (`app/preview/page/[id]/page.tsx`),
 * and the sitemap addition. Source-level, same reason as cms-page-seam.test.mjs.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

// ── package.json / tailwind.config.ts ───────────────────────────────────────────────

test('@ciphera-net/facet-sections is a dependency, and its dist is in the Tailwind content scan', () => {
  const pkg = JSON.parse(read('package.json'))
  assert.match(pkg.dependencies['@ciphera-net/facet-sections'], /^\^0\.2\./)
  // read(), not code(): the glob's "/**/" reads as a block comment to the naive stripper.
  const tw = read('tailwind.config.ts')
  assert.match(tw, /node_modules\/@ciphera-net\/facet-sections\/dist\/\*\*\/\*\.\{js,mjs,cjs\}/)
})

// ── components/cms/CmsPage.tsx ───────────────────────────────────────────────────────

test('CmsPage renders every §4.2.1 section type through the shared facet-sections components', () => {
  const src = code('components/cms/CmsPage.tsx')
  assert.match(src, /from '@ciphera-net\/facet-sections'/)
  for (const comp of ['MarketingSection', 'SeoHero', 'FaqBlock', 'RelatedLinks', 'SeoPageCta']) {
    assert.ok(src.includes(comp), `CmsPage does not import/use ${comp}`)
  }
  for (const t of ["case 'hero'", "case 'text-section'", "case 'faq'", "case 'related-links'", "case 'closing-cta'"]) {
    assert.ok(src.includes(t), `CmsPage's Section switch is missing ${t}`)
  }
})

test('CmsPage derives BreadcrumbList from the path alone — no FAQPage JSON-LD of its own (FaqBlock already emits it)', () => {
  const src = code('components/cms/CmsPage.tsx')
  assert.match(src, /import Breadcrumbs from '@\/components\/Breadcrumbs'/)
  assert.match(src, /breadcrumbItemsForPath\(page\.path\)/)
  assert.doesNotMatch(src, /FAQPage/, 'FaqBlock already emits the FAQPage schema; CmsPage must not duplicate it')
})

test('CmsRichText parses to React — never dangerouslySetInnerHTML — against the SAME schema page-build.ts sanitises to', () => {
  const src = code('components/cms/CmsRichText.tsx')
  assert.doesNotMatch(src, /dangerouslySetInnerHTML/)
  assert.match(src, /import \{ dropUnsafeHrefs, richTextSchema \} from '@\/lib\/cms\/page-build'/)
  assert.match(src, /\.use\(rehypeSanitize, richTextSchema\)/)
})

test('CmsLink narrows next/link so it satisfies the injectable LinkComponentType', () => {
  const src = code('components/cms/CmsLink.tsx')
  assert.match(src, /href \?\? '#'/)
})

// ── app/[...slug]/page.tsx (the catch-all) ──────────────────────────────────────────

test('the catch-all has NO generateStaticParams — never even returning [] — so no path is ISR-cached', () => {
  const src = code('app/[...slug]/page.tsx')
  assert.doesNotMatch(src, /generateStaticParams/)
  assert.match(src, /resolvePage\(pathFromSlug\(slug\)\)/)
  assert.match(src, /if \(!page\) notFound\(\)/)
})

test('the catch-all builds its own Metadata from the page SEO fields, deriving the canonical when empty', () => {
  const src = code('app/[...slug]/page.tsx')
  assert.match(src, /seo\.canonical \|\| `https:\/\/ciphera\.net\$\{page\.path\}`/)
})

// ── app/preview/page/[id]/page.tsx ──────────────────────────────────────────────────

test('the page preview route mirrors app/preview/[slug]: force-dynamic, noindex, the id+int32 guards, WP_AUTH', () => {
  const src = code('app/preview/page/[id]/page.tsx')
  assert.match(src, /export const dynamic = 'force-dynamic'/)
  assert.match(src, /robots: \{ index: false, follow: false \}/)
  assert.match(src, /DATABASE_ID = \/\^\[1-9\]\[0-9\]\{0,9\}\$\//)
  assert.match(src, /GRAPHQL_INT32_MAX = 2147483647/)
  assert.match(src, /Authorization = `Basic \$\{Buffer\.from\(WP_AUTH\)\.toString\('base64'\)\}`/)
  assert.match(src, /if \(!WP\) notFound\(\)/)
})

test('the page preview reads cipheraPages by id (the connection, not the single-node resolver), same device as the blog preview', () => {
  const src = code('app/preview/page/[id]/page.tsx')
  assert.match(src, /cipheraPages\(first: 1, where: \{ id: \$id \}\)/)
})

test('the page preview uses buildPageDocument, NOT buildPages — a draft with no/bad path still renders its sections', () => {
  const src = code('app/preview/page/[id]/page.tsx')
  assert.match(src, /import \{ buildPageDocument, type WpPageNode \} from '@\/lib\/cms\/page-build'/)
  assert.match(src, /buildPageDocument\(node, \(\) => \{\}\)/)
  assert.doesNotMatch(src, /\bbuildPages\(/)
})

test('the page preview refuses a draft from the wrong site, same ordering rule the blog preview documents (PULSE-157)', () => {
  const src = code('app/preview/page/[id]/page.tsx')
  assert.match(src, /routeSites\?\.nodes \?\? \[\]\)\.some\(\(t\) => t\.slug === 'ciphera-net'\)/)
})

// ── app/sitemap.ts ───────────────────────────────────────────────────────────────────

test('the sitemap lists published CMS pages, with no noindex filter (a ciphera_page has none)', () => {
  const src = code('app/sitemap.ts')
  assert.match(src, /import \{ getAllPages \} from '@\/lib\/cms\/page-runtime'/)
  assert.match(src, /cmsPages = await getAllPages\(\)/)
  assert.match(src, /\.\.\.cmsPageEntries/)
})

// ── lib/cms/page-runtime.ts ──────────────────────────────────────────────────────────

test('getAllPages drops one failed document rather than failing the whole sitemap, and is [] with the kind off', () => {
  const src = code('lib/cms/page-runtime.ts')
  assert.match(src, /if \(!isRuntimeKind\(KIND\)\) return \[\]/)
  assert.match(src, /catch \{\s*return null\s*\}/)
})
