/**
 * M2 render-comparison harness. NOT shipped — bundled by esbuild and run standalone by
 * `__tests__/menu-render-proof.test.mjs` only, never imported by the app itself.
 *
 * Renders the FROZEN pre-refactor Header/Footer (`__tests__/fixtures/legacy-*.tsx`,
 * captured before this change touched either file) and the REFACTORED, document-driven
 * components fed the mechanically generated seed (`lib/cms/menu-seed.ts`), and prints
 * both strings as JSON — the test does the byte comparison.
 */
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { __setPathname } from './shim-next-navigation'
import { Header as LegacyHeader } from '../fixtures/legacy-header-3'
import LegacyFooter from '../fixtures/legacy-footer'
import { HeaderClient } from '@/components/ui/header-3'
import { FooterView } from '@/components/Footer'
import { buildHeaderMenuDocument, buildFooterMenuDocument } from '@/lib/cms/menu-seed'
import type { MenuDocument } from '@/lib/cms/menu-build'

const seedHeaderDoc = buildHeaderMenuDocument()
const seedFooterDoc = buildFooterMenuDocument()

function renderHeaderPair(path: string) {
  __setPathname(path)
  const legacy = renderToStaticMarkup(React.createElement(LegacyHeader))
  const current = renderToStaticMarkup(React.createElement(HeaderClient, { menuDocument: seedHeaderDoc }))
  return { legacy, current }
}

// A plain page (no Features panel, no per-page branding) and a product page (Features
// panel present — the §4.2.2 "stays code" panel, exercised alongside the doc-driven
// panels so the proof covers both code paths coexisting in one render).
const headerPlain = renderHeaderPair('/press')
const headerProduct = renderHeaderPair('/products/pulse')

const footerLegacy = renderToStaticMarkup(React.createElement(LegacyFooter as unknown as React.ComponentType))
const footerCurrent = renderToStaticMarkup(React.createElement(FooterView, { doc: seedFooterDoc }))

// ── Negative control: mutate one field in the seed before re-rendering. If this does
// NOT diverge from the legacy render, the comparison above is not actually sensitive to
// the data — a guard with no proven failure mode is not a guard (M2's own hard rule).
const mutatedHeaderDoc: MenuDocument = JSON.parse(JSON.stringify(seedHeaderDoc))
mutatedHeaderDoc.groups[0].items[0].label = 'Mutated Label'
const headerMutated = renderToStaticMarkup(React.createElement(HeaderClient, { menuDocument: mutatedHeaderDoc }))

const mutatedFooterDoc: MenuDocument = JSON.parse(JSON.stringify(seedFooterDoc))
mutatedFooterDoc.groups[0].items[0].label = 'Mutated Label'
const footerMutated = renderToStaticMarkup(React.createElement(FooterView, { doc: mutatedFooterDoc }))

process.stdout.write(
  JSON.stringify({
    headerPlain,
    headerProduct,
    footerLegacy,
    footerCurrent,
    headerMutated,
    footerMutated,
  })
)
