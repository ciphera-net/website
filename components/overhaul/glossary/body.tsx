import { Fragment, type ReactNode } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeSanitize from 'rehype-sanitize'
import rehypeReact from 'rehype-react'
import { schema, newTabLinks, cdnImagesOnly } from '@/lib/blog-html'

/**
 * A glossary term's body, from WordPress (24-10-2026).
 *
 * 🔴 PARSE TO REACT, THROUGH THE POST BODY'S SANITIZER. NEVER dangerouslySetInnerHTML. A term body is CMS content
 * like a post body (`lib/cms/glossary-build.ts` takes out only the FAQ blocks), so it gets the same allowlist; until
 * 24-10-2026 the term page injected it as WordPress sent it. WordPress's own filter on save is one layer; the site's
 * allowlist is the second, for any write that does not pass through the editor.
 *
 * The chain is the post body's (`lib/blog-html.ts`: `schema`, then `newTabLinks`, then `cdnImagesOnly`) without
 * `cipheraBlocks`, which would turn a quote into the post callout, a look a term page does not have. The sanitizer
 * strips every class, including WordPress's block classes (`wp-block-paragraph`, `has-text-align-center`), which no
 * stylesheet of this site styles, so a term page looks as it did.
 */
const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, schema)
  .use(newTabLinks)
  .use(cdnImagesOnly)
  .use(rehypeReact, { Fragment, jsx, jsxs })

export function renderGlossaryBody(html: string): ReactNode {
  return processor.processSync(html).result as ReactNode
}
