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

      // 🔴 hast CAMEL-CASES EVERY data-* ATTRIBUTE, AND THAT SILENTLY EMPTIED THE BLOCK.
      // `<span data-src="…">` parses to `properties.dataSrc`, never `properties['data-src']`.
      // A rehype-sanitize allowlist written with hyphens therefore matches nothing,
      // strips the attribute, and leaves a well-formed `<span></span>` — no error, no
      // warning, and a ToolLogo that renders as an empty inline element. Measured
      // exactly that way on the first WordPress-authored post.
      // 🔑 The blockquote branch below HID the bug: it assigns literal hyphenated keys
      // itself, so the callout worked while everything parsed from HTML did not.
      // Canonicalising here means the sanitiser's allowlist and the component props
      // agree on one spelling, in one place.
      const kind = props.dataCipheraBlock ?? props['data-ciphera-block']
      if (kind) {
        node.properties = {
          ...props,
          'data-ciphera-block': String(kind),
          ...(props.dataSrc || props['data-src']
            ? { 'data-src': String(props.dataSrc ?? props['data-src']) }
            : {}),
          ...(props.dataVariant || props['data-variant']
            ? { 'data-variant': String(props.dataVariant ?? props['data-variant']) }
            : {}),
        }
        delete node.properties.dataCipheraBlock
        delete node.properties.dataSrc
        delete node.properties.dataVariant
        return
      }

      // 🔴 UNWRAP core/table's <figure>. WordPress renders a table as
      // `<figure class="wp-block-table"><table>…`, and MDX renders a bare `<table>`
      // through MDXTable — which already provides its own scroll container. Left in,
      // the figure is a second wrapper the MDX corpus never had, and it showed up as
      // the ONLY structural difference in 11 of the 16 migrated posts.
      if (node.tagName === 'figure' && className.includes('wp-block-table')) {
        const table = node.children.find((c) => c.type === 'element' && c.tagName === 'table')
        if (table && table.type === 'element') {
          node.tagName = 'table'
          node.properties = {}
          node.children = table.children
        }
        return
      }

      if (node.tagName === 'blockquote') {
        // 🔴 THREE CASES, NOT TWO, AND CONFLATING THEM WAS A REAL DIFFERENCE.
        // The corpus has 16 `<BlogBlockquote variant="tldr">`, 12 plain
        // `<BlogBlockquote>`, and one MARKDOWN `>` quote — and the last renders as a
        // bare <blockquote>, with none of the component's wrapper, border or padding.
        // Mapping every blockquote to BlogBlockquote gave that quote a card it never
        // had. `is-plain-quote` is what the migration marks it with; anything without
        // that marker is the component.
        if (className.includes('is-plain-quote')) {
          node.properties = {}
          return
        }
        node.properties = {
          ...props,
          'data-ciphera-block': 'callout',
          ...(className.includes('is-style-tldr') ? { 'data-variant': 'tldr' } : {}),
        }
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
    // 🔴 THE ONE CLASS THAT SURVIVES, AND ONLY BY EXPLICIT VALUE.
    // MDX emits `<code class="language-html">` for a fenced block's info string, and
    // stripping every class silently changed the corpus's one code block. rehype-sanitize
    // takes [attribute, ...allowedValues], so this is a value allowlist rather than a
    // hole: an author cannot smuggle an arbitrary class through `code`.
    // ⚠️ Adding a language means adding it HERE. That is deliberate — it keeps the
    // "no classes from the CMS" rule true, with a named, reviewable exception.
    code: [
      ['className', 'language-html', 'language-js', 'language-ts', 'language-json',
        'language-bash', 'language-sh', 'language-css', 'language-go', 'language-php',
        'language-sql', 'language-yaml', 'language-tsx', 'language-jsx'],
    ],
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
