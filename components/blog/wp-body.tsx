import { Fragment, createElement, type ReactNode } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from 'rehype-sanitize'
import rehypeReact from 'rehype-react'
import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'
import { BlogBlockquote } from './blog-blockquote'
import { ToolLogo } from './tool-logo'
import { MDXTable } from '../mdx-table'

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
 */

/**
 * 🔴 ORDER IS LOAD-BEARING: MAP SEMANTICS FIRST, THEN STRIP EVERY CLASS.
 * WordPress 7.1 emits `<p class="wp-block-paragraph">` and marks a TL;DR quote with
 * `is-style-tldr`. The first carries no meaning for this site and the second carries all
 * of it, so the meaning is lifted onto `data-ciphera-block` here and the sanitiser then
 * removes `class` entirely. Running these the other way round would delete the signal
 * before reading it — and would leave a WordPress class name deciding how the site looks.
 */
function cipheraBlocks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const props = node.properties ?? {}
      const className = Array.isArray(props.className) ? props.className.map(String) : []

      if (node.tagName === 'blockquote' && className.includes('is-style-tldr')) {
        node.properties = { ...props, 'data-ciphera-block': 'callout', 'data-variant': 'tldr' }
        return
      }
      // A plain core/quote is still a blockquote, and BlogBlockquote's default variant
      // is what the MDX corpus uses for one — so it maps too, without a marker.
      if (node.tagName === 'blockquote') {
        node.properties = { ...props, 'data-ciphera-block': 'callout' }
      }
    })
  }
}

/** Everything the two custom blocks and the block styles need, and nothing else. */
const schema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'code', 'pre',
    'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'br',
    'span', 'div', 'figure', 'figcaption', 'img',
  ],
  attributes: {
    // 🔑 NO `className` ANYWHERE IN THIS MAP, DELIBERATELY. Stripping every class is
    // what stops the CMS making styling decisions; the site styles by element inside
    // `.prose`, and the two custom devices travel on data-* attributes instead.
    '*': ['data-ciphera-block', 'data-variant', 'data-src', 'data-q', 'data-a'],
    a: ['href', 'title'],
    img: ['src', 'alt', 'width', 'height'],
    th: ['colSpan', 'rowSpan', 'scope'],
    td: ['colSpan', 'rowSpan'],
  },
  protocols: {
    // ⚠️ `src` allows NO protocol at all. Every image is rewritten to a CDN path by the
    // build before this runs, so anything still carrying a scheme here is an image the
    // mirror did not handle — which must disappear rather than be fetched from wherever
    // an editor pointed it.
    href: ['http', 'https', 'mailto'],
  },
}

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
