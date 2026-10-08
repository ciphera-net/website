import { Fragment, type ReactNode } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeSanitize from 'rehype-sanitize'
import rehypeReact from 'rehype-react'
import { dropUnsafeHrefs, richTextSchema } from '@/lib/cms/page-build'

/**
 * Renders a `text-section`'s already-sanitised body (WEB-28, §4.2.1).
 *
 * 🔴 PARSE TO REACT. NEVER dangerouslySetInnerHTML — same conviction as
 * `components/blog/wp-body.tsx`. `lib/cms/page-build.ts` already cut this string
 * down to `p`/`a`/`strong`/`em`/`code`/`br` before it ever reached a content
 * document, so re-sanitising here is defence in depth, not the primary control: a
 * schema drift in the publish-time transform, or a document written some other way,
 * still cannot reach this page as raw HTML.
 */
const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, richTextSchema)
  .use(dropUnsafeHrefs)
  .use(rehypeReact, { Fragment, jsx, jsxs })

export function CmsRichText({ html, className }: { html: string; className?: string }): ReactNode {
  return <div className={className}>{processor.processSync(html).result}</div>
}

/**
 * Same parse-to-React pipeline, no wrapping `<div>` — for a product-page section
 * field (`product-banner.body`, `feature-split.text`, `comparison-cards.intro`,
 * `content-block.text`/`note`) that `@ciphera-net/facet-sections` renders directly
 * inside its own `<p>`: a nested `<div>` there would break that element's markup.
 * The sanitised string is still already paragraph-safe HTML (page-build.ts), so this
 * is purely about NOT adding a second wrapper the caller's own `<p>` doesn't want.
 */
export function cmsRichNodes(html: string): ReactNode {
  return processor.processSync(html).result
}
