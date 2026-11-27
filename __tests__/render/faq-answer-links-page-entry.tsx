/**
 * Page FAQ answers keep their links (27-11-2026): a CMS page's `faq` and `faq-tabs` sections, from the section JSON
 * WordPress stores (the answer as the editor's HTML, every other field plain) through `buildPageDocument`
 * (lib/cms/page-build.ts, `faqAnswerOf`) to `CmsPage`'s render with Facet's `FaqBlock` and `FaqTabs`.
 *
 * `node <bundle>` — no arguments, prints one JSON object.
 */
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { buildPageDocument, type WpPageNode } from '@/lib/cms/page-build'
import { CmsPage } from '@/components/cms/CmsPage'

const node = (path: string, sections: unknown[]): WpPageNode => ({
  databaseId: 1,
  cipheraPath: path,
  cipheraSections: JSON.stringify(sections),
  modifiedGmt: '2026-11-27T00:00:00',
  cipheraTitle: null,
  cipheraDescription: null,
  cipheraCanonical: null,
  cipheraOgTitle: null,
  cipheraOgDescription: null,
  cipheraOgImage: null,
  cipheraTwitterTitle: null,
  cipheraTwitterDescription: null,
})

/** The page document the publisher would write, the repairs it would log, and the page as `CmsPage` draws it. */
function page(path: string, sections: unknown[]) {
  const repairs: string[] = []
  const doc = buildPageDocument(node(path, sections), (field, action, detail) => repairs.push(`${field} ${action}: ${detail}`))
  return { sections: doc.sections, repairs, html: renderToStaticMarkup(<CmsPage page={doc} breadcrumbs={false} />) }
}

const LINK_ANSWER = 'Swiss law has its own act, the <a href="/glossary/fadp">FADP</a>.'
const faq = (answer: string) => [{ type: 'faq', items: [{ question: 'Does Swiss law apply?', answer }] }]
const tabs = (answers: string[]) => [
  {
    type: 'faq-tabs',
    title: 'FAQs',
    subtitle: 'Questions',
    categories: [{ key: 'general', label: 'General' }],
    items: answers.map((answer, i) => ({ categoryKey: 'general', question: `Question ${i + 1}`, answer })),
  },
]

console.log(
  JSON.stringify({
    faqLink: page('/test-faq', faq(LINK_ANSWER)),
    faqLinkTessera: page('/products/tessera', faq(LINK_ANSWER)),
    faqPlain: page('/test-faq', faq("It's free & open, 100% of it.")),
    faqTypedTag: page('/test-faq', faq('Wrap it in &lt;code&gt; first.')),
    tabsLink: page('/test-faq', tabs([LINK_ANSWER, 'Words only.'])),
    tabsWordless: page('/test-faq', tabs(['<p></p>', 'Words only.'])),
    tabsAllWordless: page('/test-faq', tabs(['<p></p>'])),
  })
)
