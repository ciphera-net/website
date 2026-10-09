import { Fragment, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import NextLink from 'next/link'
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
  .use(rehypeReact, { Fragment, jsx, jsxs, components: { a: richTextAnchor() } })

export function CmsRichText({ html, className }: { html: string; className?: string }): ReactNode {
  return <div className={className}>{processor.processSync(html).result}</div>
}

/**
 * `page-build.ts`'s `isSafeHref`/`SAFE_HREF_RE` is the only check an `<a>`'s `href`
 * has already passed by the time it reaches this module — three shapes:
 * `https?://…` (absolute, a genuinely different origin), `/…` (site-relative), or
 * `#…` (in-page). The coded pages route the first kind through a plain `<a
 * target="_blank">` and the other two through `next/link`'s `Link` — e.g.
 * `app/products/id/page.tsx`'s own `<a href="https://id.ciphera.net/login">` next to
 * its `<Link href="/glossary/opaque">` three lines later. A CMS-authored inline link
 * must pick the same way, or its real rendered `<a>` disagrees with the coded page's
 * on more than the `href` value: `next/link` destructures `href` out of its own
 * props and re-attaches it LAST (`{...restProps, ...childProps}`,
 * `node_modules/next/dist/client/app-dir/link.js`), so a `<Link href=… className=…>`
 * renders `class="…" href="…"` — attribute order a plain `<a href=… className=…>`
 * never reorders. Measured 09-10-2026 against a real preview render: this module's
 * `<a href>`-first rendering of an internal link (`/glossary/opaque`) disagreed with
 * the coded page's own `<Link>` for exactly this reason, byte for byte identical
 * text and all.
 */
function isExternalHref(href: string | undefined): boolean {
  return /^https?:\/\//.test(href ?? '')
}

/**
 * The shared inline `<a>` renderer for both exports below. `richTextSchema`
 * (page-build.ts) deliberately keeps only `href` on an anchor, never a `class` (the
 * six-tag allowlist has no "trust this one attribute value" case), so a styled
 * inline link needs its class reconstructed here rather than carried on the stored
 * HTML — `cmsRichNodes`'s product-page callers pass one; `CmsRichText`'s plain
 * `text-section` body passes none and is styled by its wrapper's `prose-a:*`
 * classes instead (an ancestor selector that matches an `<a>` regardless of which
 * React component rendered it, so routing through `next/link` here changes nothing
 * about how it looks). Every coded page's inline link uses one of exactly two
 * classes — `text-primary hover:underline` (Captcha/Ciphera ID/Pulse/Relay) or
 * `text-primary underline` (Tessera, which never hides the underline).
 */
function richTextAnchor(linkClassName?: string) {
  return function RichTextAnchor({ href, children }: AnchorHTMLAttributes<HTMLAnchorElement>) {
    if (href !== undefined && !isExternalHref(href)) {
      return (
        <NextLink href={href} className={linkClassName}>
          {children}
        </NextLink>
      )
    }
    return (
      <a href={href} className={linkClassName}>
        {children}
      </a>
    )
  }
}

const defaultLinkClass = 'text-primary hover:underline'
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- unified()'s own chained
// generics don't collapse to one assignable type across two differently-`.use()`-configured
// processors; this cache is internal, never part of this module's exported surface.
const productRichNodeProcessors: Record<string, any> = {}
function productRichNodeProcessor(linkClassName: string) {
  if (!productRichNodeProcessors[linkClassName]) {
    productRichNodeProcessors[linkClassName] = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSanitize, richTextSchema)
      .use(dropUnsafeHrefs)
      .use(rehypeReact, { Fragment, jsx, jsxs, components: { a: richTextAnchor(linkClassName) } })
  }
  return productRichNodeProcessors[linkClassName]
}

/**
 * Same parse-to-React pipeline, no wrapping `<div>` — for a product-page section
 * field (`product-banner.body`, `feature-split.text`, `comparison-cards.intro`,
 * `content-block.text`/`note`) that `@ciphera-net/facet-sections` renders directly
 * inside its own `<p>`: a nested `<div>` there would break that element's markup.
 * The sanitised string is still already paragraph-safe HTML (page-build.ts), so this
 * is purely about NOT adding a second wrapper the caller's own `<p>` doesn't want.
 *
 * `linkClassName` defaults to the four-of-five-pages style; CmsPage passes Tessera's
 * `text-primary underline` for that one page (see `product-page-anchors.ts`'s own
 * comment on keying page-specific, code-only presentation off `page.path`).
 */
export function cmsRichNodes(html: string, linkClassName: string = defaultLinkClass): ReactNode {
  return productRichNodeProcessor(linkClassName).processSync(html).result as ReactNode
}
