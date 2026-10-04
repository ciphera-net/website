import { Fragment, createElement, type ReactNode } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeSanitize from 'rehype-sanitize'
import rehypeReact from 'rehype-react'
import { BlogBlockquote } from './blog-blockquote'
import { ToolLogo } from './tool-logo'
import { MDXTable } from '../mdx-table'
import { cipheraBlocks, schema, cdnImagesOnly, toolLogosValidated } from '@/lib/blog-html'

/**
 * Render a WordPress-authored post body.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.5
 *
 * 🔴 PARSE TO REACT. NEVER dangerouslySetInnerHTML.
 * Authors are authenticated, so this is not the primary control — it is the difference
 * between a compromised wp-admin session being an embarrassment and being stored XSS on
 * ciphera.net. It is also what lets `<table>` reach MDXTable and `[data-ciphera-block]`
 * reach the components that already exist, rather than shipping WordPress's markup and
 * hoping the CSS matches.
 *
 * ⚠️ THE TEMPTING WRONG ANSWER, NAMED SO NOBODY TRIES IT. MDX is a superset of HTML, so
 * feeding WordPress's rendered HTML to the existing MDXRemote looks free. It is not: MDX
 * parses HTML as JSX, so `class=` throws, HTML comments throw, and any `{` in prose
 * becomes an expression. The mirror-image idea — convert the HTML *to* MDX and keep one
 * render path — fails on the same `{` hazard plus a second lossy transform.
 *
 * 🔑 THE PIPELINE PIECES THAT DO NOT TOUCH REACT — `cipheraBlocks`, the sanitize `schema`,
 * `cdnImagesOnly` and `toolLogosValidated` — live in lib/blog-html.ts, not here.
 * scripts/generate-blog-posts.ts needs the exact same parse → cipheraBlocks → sanitize →
 * cdnImagesOnly → toolLogosValidated chain to know in advance which images (and tool-logo
 * marks) will render (`renderableImageSources`), and a React-free module is what lets a
 * build script import it without pulling in React or JSX. Ported from
 * pulse-website@edcb673 / 70a90da (PULSE-243): the sanitizer's `protocols` map replaced
 * defaultSchema.protocols instead of merging it, and a tool-logo mark was never
 * shape-checked or HEAD-verified at all. See lib/blog-html.ts for the full history.
 */

type Props = Record<string, unknown> & { children?: ReactNode }

/**
 * Blocks arrive as empty elements carrying data-* attributes; the real components are
 * substituted here. `div` and `span` fall through to themselves when unmarked.
 */
function CipheraBlock(tag: 'div' | 'span') {
  return function Block(props: Props) {
    const kind = props['data-ciphera-block']
    if (kind === 'tool-logo') return <ToolLogo src={String(props['data-src'] ?? '')} />
    if (kind === 'faq') return null // lifted out at build time; never rendered inline
    const { children, ...rest } = props
    return createElement(tag, rest, children)
  }
}

function Blockquote(props: Props) {
  if (props['data-ciphera-block'] === 'callout') {
    const variant = props['data-variant'] === 'tldr' ? 'tldr' : 'default'
    return <BlogBlockquote variant={variant}>{props.children}</BlogBlockquote>
  }
  const { children, ...rest } = props
  return createElement('blockquote', rest, children)
}

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(cipheraBlocks)
  .use(rehypeSanitize, schema)
  .use(cdnImagesOnly)
  .use(toolLogosValidated)
  .use(rehypeReact, {
    Fragment,
    jsx,
    jsxs,
    components: {
      table: MDXTable as never,
      blockquote: Blockquote as never,
      span: CipheraBlock('span') as never,
      div: CipheraBlock('div') as never,
    },
  })

export function WpBody({ html }: { html: string }) {
  return <>{processor.processSync(html).result}</>
}
