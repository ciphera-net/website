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
import { sanitizeRichText } from '@/lib/cms/page-build'
import { EDITOR_LINK_ATTRIBUTES } from '@/lib/blog-html'

const CASES: Record<string, string> = {
  internalCmsRichNodes: 'See <a href="/glossary/opaque">OPAQUE</a> for details.',
  externalCmsRichNodes: 'Sign in at <a href="https://id.ciphera.net/login">id.ciphera.net</a> first.',
  anchorCmsRichNodes: 'Jump to <a href="#pricing">pricing</a> below.',
  strippedHrefCmsRichNodes: 'An <a href="javascript:alert(1)">unsafe</a> link.',
  internalCmsRichText: 'See <a href="/glossary/opaque">OPAQUE</a> for details.',
  // 24-10-2026: the editor's "Open in new tab" and nofollow, as WordPress writes them.
  newTabInternalCmsRichNodes: 'See <a href="/glossary/opaque" target="_blank" rel="noreferrer noopener">OPAQUE</a> for details.',
  newTabExternalNofollowCmsRichNodes:
    'Read <a href="https://example.org/a" target="_blank" rel="noreferrer noopener nofollow">a source</a>.',
  newTabNoRelCmsRichText: '<p>See <a href="https://example.org/b" target="_blank">b</a>.</p>',
  otherTargetCmsRichNodes: 'See <a href="/x" target="_top">x</a>.',
  relOnlyCmsRichNodes: 'See <a href="https://example.org/c" rel="nofollow evil sponsored">c</a>.',
  relEmptiedCmsRichNodes: 'See <a href="https://example.org/d" rel="external evil">d</a>.',
  unsafeNewTabCmsRichNodes: 'An <a href="javascript:alert(1)" target="_blank">unsafe</a> link.',
  protocolRelativeNewTabCmsRichText: '<p>See <a href="//evil.example/x" target="_blank" rel="noopener">e</a>.</p>',
  // The publish-time sanitizer (`sanitizeRichText`): what is STORED in the page document.
  storedNewTab: '<p>See <a href="/blog/x" target="_blank" rel="noreferrer noopener nofollow">x</a>.</p>',
  storedOtherTarget: '<p>See <a href="/x" target="_top">x</a>.</p>',
  storedRelEmptied: '<p>See <a href="https://example.org/d" rel="external">d</a>.</p>',
  storedProtocolRelative: '<p>See <a href="//evil.example/x" target="_blank" rel="noopener">e</a>.</p>',
}

function run() {
  const out: Record<string, unknown> = {}
  for (const [name, html] of Object.entries(CASES)) {
    if (name.startsWith('stored')) {
      out[name] = sanitizeRichText(html)
      continue
    }
    const element = name.endsWith('CmsRichText')
      ? React.createElement(CmsRichText, { html })
      : React.createElement(React.Fragment, null, cmsRichNodes(html))
    out[name] = renderToStaticMarkup(element)
  }
  out.editorLinkAttributes = EDITOR_LINK_ATTRIBUTES
  process.stdout.write(JSON.stringify(out))
}

run()
