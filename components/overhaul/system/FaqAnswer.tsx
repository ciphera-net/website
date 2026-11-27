import type { ReactNode } from 'react'
import { cmsRichNodes } from '@/components/cms/CmsRichText'

/**
 * The link inside an FAQ answer: the post body's own link (styles/globals.css, `.prose a, a.post-body-link`), because
 * the answer sits outside the prose wrapper. Picked 27-11-2026 from mocks on the production pages
 * (Public/docs/data/27-11-2026-cms-faq-answer-links-mocks/).
 */
export const FAQ_ANSWER_LINK = 'post-body-link'

/**
 * An FAQ answer's content, for the `<dd>` a blog post or a glossary term draws round it. An answer that carries markup
 * (lib/blog-transform.ts's `answerHtml`, the glossary's `aHtml`) is parsed to React by `cmsRichNodes`, never injected,
 * with no wrapper of its own; an answer without it is its plain words, as every answer was before 27-11-2026.
 */
export function faqAnswerNodes(words: string, html?: string): ReactNode {
  return html ? cmsRichNodes(html, FAQ_ANSWER_LINK) : words
}
