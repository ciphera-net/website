/**
 * FAQ answers that keep their links (27-11-2026): `lib/blog-transform.ts`'s `extractFaqs` and `faqAnswerOf` (through
 * `lib/cms/page-build.ts`'s `inlineRichText`), run on answers written the way the CMS writes them into `data-a`.
 *
 * `node <bundle>` — no arguments, prints one JSON object.
 */
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { extractFaqs, decodeEntities } from '@/lib/blog-transform'
import { FAQ_ANSWER_LINK, faqAnswerNodes } from '@/components/overhaul/system/FaqAnswer'

/** The CMS writes an answer's HTML into `data-a` with EVERY `&` encoded (htmlspecialchars with double encoding). */
const asCmsAttribute = (html: string) =>
  html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const block = (q: string, answerHtml: string) =>
  `<div data-ciphera-block="faq" data-q="${q}" data-a="${asCmsAttribute(answerHtml)}"></div>`
const faqsOf = (html: string) => extractFaqs(html).faqs
/** The answer as BlogPost.tsx and GlossaryTerm.tsx draw it: inside the row's `<dd>`. */
const dd = (words: string, html?: string) => renderToStaticMarkup(<dd>{faqAnswerNodes(words, html)}</dd>)
const linkFaq = faqsOf(
  block('Q', 'Privacy by default is one of the <a href="/glossary/privacy-by-design">seven principles of privacy by design</a>.')
)[0]
const newTabFaq = faqsOf(
  block('Q', 'Read <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj" target="_blank" rel="nofollow">the regulation</a>.')
)[0]

console.log(
  JSON.stringify({
    link: faqsOf(
      block('Q', 'Privacy by default is one of the <a href="/glossary/privacy-by-design">seven principles of privacy by design</a>.')
    ),
    typedTag: faqsOf(block('Q', 'Wrap it in &lt;code&gt;, then read <a href="/docs">the docs</a>.')),
    // As the CMS wrote a plain-text answer before the change (esc_attr): the published corpus's shape.
    legacy: faqsOf(
      '<div data-ciphera-block="faq" data-q="Is it &quot;free&quot;?" data-a="It&#039;s free &amp; open, 100% of it."></div>'
    ),
    legacyNbsp: faqsOf('<div data-ciphera-block="faq" data-q="Q" data-a="Audits with staff training.\u00a0"></div>'),
    unsafe: faqsOf(block('Q', 'Click <a href="javascript:alert(1)">here</a> now.')),
    unwrap: faqsOf(block('Q', '<p>One <span class="x">two</span><img src="/y.png"> three.</p><p>Four <strong>five</strong>.</p>')),
    script: faqsOf(block('Q', 'Safe<script>alert(1)</script> text.')),
    newTab: faqsOf(block('Q', 'See <a href="https://example.com/x" target="_blank" rel="nofollow evil">the source</a>.')),
    decodeOnce: decodeEntities('&amp;lt;b&amp;gt;'),
    decodeTag: decodeEntities('&lt;a href=&quot;/x&quot;&gt;'),
    decodeQuotes: decodeEntities('It&#039;s &#39;a&#39; &#x27;b&#X27; &quot;c&quot; d&nbsp;e'),
    linkClass: FAQ_ANSWER_LINK,
    renderedLink: dd(linkFaq.answer, linkFaq.answerHtml),
    renderedNewTab: dd(newTabFaq.answer, newTabFaq.answerHtml),
    renderedPlain: dd("It's free & open, 100% of it."),
    renderedNoHtml: dd('Words only.', undefined),
  })
)
