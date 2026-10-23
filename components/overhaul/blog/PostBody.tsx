/**
 * A post's body, as the post template (BlogPost.tsx) renders it (first built for round 7, 18-10-2026).
 * It starts with the shared parse → cipheraBlocks → sanitize → cdnImagesOnly → toolLogosValidated chain
 * (`sanitizeChain`, lib/blog-html.ts), the same one the build's image check runs, and builds elements from the tree,
 * never dangerouslySetInnerHTML. On top: two tree steps after the sanitizer and two quieter components.
 *
 * - `headingIds` writes an id on every <h2> and collects the list, so the contents list and every `#section` link exist
 *   in the server HTML. The older template wrote the ids in a client effect after hydration, so a shared `#section` link
 *   had no target at first load, and the whole raw post HTML shipped to the browser to build the list (plan §5i).
 * - Tables wrap their cells (BlogTable, below).
 * - A callout (WordPress's TL;DR style and the plain callout) is a label and two hairlines, never the orange-tinted panel
 *   with a side stripe (house rule: colour in a dot or a word, never a panel).
 */
import { Fragment, createElement, type ReactNode } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { unified } from 'unified'
import rehypeReact from 'rehype-react'
import { toString as hastToString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import type { Element, Root } from 'hast'
import type { VFile } from 'vfile'
import { ToolLogo } from '@/components/blog/tool-logo'
import { sanitizeChain } from '@/lib/blog-html'
import { POST } from './content'

export type Heading = { id: string; text: string }

/** 'How Pulse Counts Visits (and Visitors)' → 'how-pulse-counts-visits-and-visitors'. */
function slugify(text: string): string {
  const s = text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (s.length <= 64) return s
  return s.slice(0, 64).replace(/-[^-]*$/, '')
}

function headingIds() {
  return (tree: Root, file: VFile) => {
    const used = new Set<string>(['questions'])
    const list: Heading[] = []
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'h2') return
      const text = hastToString(node).replace(/\s+/g, ' ').trim()
      // An empty heading (one post's CMS body ends with <h2></h2>) has nothing to list: it would be a blank, unnamed link.
      if (!text) return
      const base = slugify(text) || 'section'
      let id = base
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`
      used.add(id)
      node.properties = { ...node.properties, id }
      list.push({ id, text })
    })
    file.data.headings = list
  }
}

type Props = Record<string, unknown> & { children?: ReactNode }

/**
 * Tables scroll inside their own region on a phone, as today (MDXTable), but cells WRAP. MDXTable keeps the first
 * column on one line, made for short labels ("Google Analytics"); on a table whose first column holds sentences it
 * leaves the second column ~128 px wide and every row ~185 px tall, measured live on how-to-migrate-off-google-analytics
 * (plan §5i). Header cells wrap too (cookieless-analytics has a 56-character header that alone made its table 861 px
 * wide); the 36rem minimum keeps narrow columns legible on a phone, where the region scrolls.
 */
function BlogTable(props: Props) {
  const { children, ...rest } = props
  return (
    <div className="table-scroll overflow-x-auto" tabIndex={0} role="region" aria-label="Table, scrollable">
      {createElement('table', { ...rest, className: 'min-w-[36rem] [&_th]:align-bottom' }, children)}
    </div>
  )
}

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
    const summary = props['data-variant'] === 'tldr'
    return (
      <aside data-blog-callout={summary ? 'summary' : 'note'} className="my-12 border-y border-border py-7 [&>div>*:first-child]:mt-0 [&>div>*:last-child]:mb-0">
        {summary && <p className="not-prose mb-4 text-sm text-muted-foreground">{POST.summary}</p>}
        <div>{props.children}</div>
      </aside>
    )
  }
  const { children, ...rest } = props
  return createElement('blockquote', rest, children)
}

/**
 * Two posts' CMS bodies carry an empty <h2>/<h3>, which screen readers list as a heading with no name, and two
 * comparison tables start with an empty <th>. Empty headings go; an empty header cell becomes a data cell (the corner of
 * a comparison table, whose column holds row labels: the W3C tables tutorial's advice). An empty heading has no line
 * box, so removing it moves nothing.
 */
function emptyCells() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      const empty = !hastToString(node).trim() && !node.children.some((c) => c.type === 'element' && c.tagName !== 'br')
      if (!empty) return
      if (/^h[1-6]$/.test(node.tagName) && parent && typeof index === 'number') {
        parent.children.splice(index, 1)
        return index
      }
      if (node.tagName === 'th') node.tagName = 'td'
    })
  }
}

const processor = unified()
  .use(sanitizeChain)
  .use(emptyCells)
  .use(headingIds)
  .use(rehypeReact, {
    Fragment,
    jsx,
    jsxs,
    components: {
      table: BlogTable as never,
      blockquote: Blockquote as never,
      span: CipheraBlock('span') as never,
      div: CipheraBlock('div') as never,
    },
  })

export function renderPostBody(html: string): { body: ReactNode; headings: Heading[] } {
  const file = processor.processSync(html)
  return { body: file.result as ReactNode, headings: (file.data.headings as Heading[] | undefined) ?? [] }
}
