/**
 * WEB-28 real-render fix (09-10-2026) — isolated unit coverage for
 * `components/cms/CmsRichText.tsx`'s inline-link handling, independent of the
 * five product pages' own full-page comparisons (which already exercise this
 * incidentally; this harness exercises it directly, one href shape per case, and
 * is the thing that would have told someone WHICH shape was wrong without
 * reading a 50 KB page diff).
 *
 * `node <bundle>` — no arguments, prints one JSON object with every case's HTML.
 */
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CmsRichText, cmsRichNodes } from '@/components/cms/CmsRichText'

const CASES: Record<string, string> = {
  internalCmsRichNodes: 'See <a href="/glossary/opaque">OPAQUE</a> for details.',
  externalCmsRichNodes: 'Sign in at <a href="https://id.ciphera.net/login">id.ciphera.net</a> first.',
  anchorCmsRichNodes: 'Jump to <a href="#pricing">pricing</a> below.',
  strippedHrefCmsRichNodes: 'An <a href="javascript:alert(1)">unsafe</a> link.',
  internalCmsRichText: 'See <a href="/glossary/opaque">OPAQUE</a> for details.',
}

function run() {
  const out: Record<string, string> = {}
  for (const [name, html] of Object.entries(CASES)) {
    const element = name.endsWith('CmsRichText')
      ? React.createElement(CmsRichText, { html })
      : React.createElement(React.Fragment, null, cmsRichNodes(html))
    out[name] = renderToStaticMarkup(element)
  }
  process.stdout.write(JSON.stringify(out))
}

run()
