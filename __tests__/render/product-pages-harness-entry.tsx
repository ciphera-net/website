/**
 * WEB-28 parity harness. NOT shipped — bundled by esbuild and run standalone by
 * `__tests__/pages-seed-parity.render.mjs` only (`npm run test:render`).
 *
 * Renders ONE (page, branch) combination per process invocation —
 * `node <bundle> <slug> coded|cms` — never two renders in the same process.
 * `@ciphera-net/facet`'s own bundled components call React 19's `ReactDOM.preload()`
 * for a fixed brand asset; React dedupes a `<link rel="preload">` it already emitted
 * WITHIN A PROCESS, so a second `renderToStaticMarkup()` call in the same process
 * (coded, then CMS) silently drops that one `<link>` from the second render only —
 * a measured artifact of this harness's own process reuse, not a real difference
 * between the coded and CMS-rendered page (confirmed: a single page rendered ALONE,
 * in its own process, carries the preload either way). One process per render
 * removes the possibility entirely, rather than working around it with an exclusion
 * list that would also hide a REAL future duplicate-preload regression.
 *
 * Builds the `PageDocument` from the page's mechanically-extracted seed
 * (`scripts/pages-seed/<slug>.json`) through the REAL `buildPageDocument()`
 * (`lib/cms/page-build.ts`) fed a `cipheraSections` JSON string shaped exactly like
 * WordPress's own `ciphera_page_parse_sections()` output
 * (`scripts/pages-seed/simulate-wordpress.mjs`).
 */
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import fs from 'fs'
import path from 'path'
import { buildPageDocument, type WpPageNode } from '@/lib/cms/page-build'
import { __setPage, __clearPages } from './shim-page-runtime'
import { simulateWordpressSections } from '../../scripts/pages-seed/simulate-wordpress.mjs'

const PAGE_IMPORTS: Record<string, () => Promise<any>> = {
  captcha: () => import('@/app/products/captcha/page'),
  id: () => import('@/app/products/id/page'),
  pulse: () => import('@/app/products/pulse/page'),
  relay: () => import('@/app/products/relay/page'),
  tessera: () => import('@/app/products/tessera/page'),
}
const CMS_PATHS: Record<string, string> = {
  captcha: '/products/captcha',
  id: '/products/id',
  pulse: '/products/pulse',
  relay: '/products/relay',
  tessera: '/products/tessera',
}

function readSeed(slug: string) {
  const SEED_DIR = path.join(process.cwd(), 'scripts', 'pages-seed')
  return JSON.parse(fs.readFileSync(path.join(SEED_DIR, `${slug}.json`), 'utf-8'))
}

function metaSnapshot(m: any) {
  return {
    title: m.title,
    description: m.description,
    canonical: m.alternates?.canonical,
    ogTitle: m.openGraph?.title,
    ogDescription: m.openGraph?.description,
    twitterTitle: m.twitter?.title,
    twitterDescription: m.twitter?.description,
  }
}

async function run() {
  const [slug, branch] = process.argv.slice(2)
  if (!PAGE_IMPORTS[slug] || (branch !== 'coded' && branch !== 'cms')) {
    throw new Error(`usage: node <bundle> <${Object.keys(PAGE_IMPORTS).join('|')}> <coded|cms>`)
  }
  const cmsPath = CMS_PATHS[slug]
  const seed = readSeed(slug)
  const rawSections = simulateWordpressSections(seed.blocks)
  const node: WpPageNode = {
    databaseId: 999,
    cipheraPath: seed.path,
    cipheraSections: JSON.stringify(rawSections),
    modifiedGmt: '2026-10-09T00:00:00',
    cipheraTitle: seed.seo.title,
    cipheraDescription: seed.seo.description,
    cipheraCanonical: seed.seo.canonical,
    cipheraOgTitle: seed.seo.ogTitle,
    cipheraOgDescription: seed.seo.ogDescription,
    cipheraOgImage: null,
    cipheraTwitterTitle: seed.seo.twitterTitle,
    cipheraTwitterDescription: seed.seo.twitterDescription,
  }
  const repairs: string[] = []
  const doc = buildPageDocument(node, (field, action, detail) => repairs.push(`${field}/${action}: ${detail}`))

  const mod = await PAGE_IMPORTS[slug]()

  __clearPages()
  if (branch === 'cms') __setPage(cmsPath, doc)

  const element = await (mod.default as () => Promise<React.ReactElement>)()
  const html = renderToStaticMarkup(element)
  const meta = await (mod.generateMetadata as () => Promise<any>)()

  process.stdout.write(
    JSON.stringify({
      repairs,
      sectionCount: doc.sections.length,
      html,
      meta: metaSnapshot(meta),
    })
  )
}

run()
