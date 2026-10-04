// Split out of components/blog/wp-body.tsx so the sanitize pipeline has no React
// dependency and can run both at render time and at build time (scripts/generate-blog-posts.ts
// HEAD-checks exactly what this will render, via renderableImageSources()).
//
// Ported from pulse-website@edcb673 / 70a90da / ef2bf0e (PULSE-243): the sanitizer's
// `protocols` map replaced defaultSchema.protocols instead of merging it, so an <img src>
// carried no scheme check at all — javascript:, data: and any off-CDN https image rendered.
// ciphera-website's own wp-body.tsx had the identical bug (same origin, same code shape).
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from 'rehype-sanitize'
import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'

/**
 * The React-free half of the WordPress body pipeline: parse → cipheraBlocks →
 * rehype-sanitize → cdnImagesOnly → toolLogosValidated.
 *
 * components/blog/wp-body.tsx imports `cipheraBlocks`, `schema`, `cdnImagesOnly` and
 * `toolLogosValidated` from here and adds `rehype-react` on top to actually render to
 * React. scripts/generate-blog-posts.ts imports only `renderableImageSources()`, which
 * runs this exact chain, so the set of images (and tool-logo marks) the build HEAD-checks
 * and the set the page will actually render can never disagree — see that function's own
 * comment.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.5
 * Port:   Pulse/docs/plans/04-10-2026-cms-and-split-handover-5.md (WEB-16, mirrors PULSE-243)
 */

/**
 * 🔴 ORDER IS LOAD-BEARING: MAP SEMANTICS FIRST, THEN STRIP EVERY CLASS.
 * WordPress 7.1 emits `<p class="wp-block-paragraph">` and marks a TL;DR quote with
 * `is-style-tldr`. The first carries no meaning for this site and the second carries all
 * of it, so the meaning is lifted onto `data-ciphera-block` here and the sanitiser then
 * removes `class` entirely. Running these the other way round would delete the signal
 * before reading it — and would leave a WordPress class name deciding how the site looks.
 */
export function cipheraBlocks() {
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

/**
 * The CDN origin every renderable `<img src>` must start with, byte for byte
 * (case-sensitive, no scheme/host confusion tolerated — see `cdnImagesOnly` below).
 * Inline post media and tool-logo marks both resolve under ANY `cdn.ciphera.net` prefix
 * (scripts/generate-blog-posts.ts's own pre-existing comment: the uploader can write
 * under `website/blog/media/` or `pulse/blog/media/` since both sites share one
 * WordPress), so the allowlist is the bare CDN ORIGIN, not a per-site prefix.
 */
export const CDN_IMAGE_ORIGIN = 'https://cdn.ciphera.net/'

/** Everything the two custom blocks and the block styles need, and nothing else. */
export const schema: SanitizeSchema = {
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
  // 🔴 MERGE, NEVER REPLACE. `protocols` is a flat map keyed by PROPERTY NAME (not by
  // tag), and `defaultSchema.protocols` already carries `src: ['http', 'https']`
  // (hast-util-sanitize's own default). The code this replaces spread `defaultSchema`
  // and then wrote `protocols: { href: [...] }`, which REPLACED that whole map, so
  // `src` had no entry at all — hast-util-sanitize's own doc says an absent key means
  // "everything is fine" for that property, i.e. NO protocol check ran on `src`
  // whatsoever. `javascript:`, `data:`, and any off-CDN `https://` all rendered.
  // 🔑 The protocol check alone is still not enough: it only inspects the URL's SCHEME,
  // so `https://cdn.ciphera.net.evil.example/x.png` and
  // `https://cdn.ciphera.net@evil.example/x.png` both have an allowed scheme and would
  // still pass it. `cdnImagesOnly` below is the second, independent check that reads the
  // whole string, not just the scheme.
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto'],
    src: ['https'],
  },
}

/**
 * Runs AFTER rehype-sanitize. Removes every `img` whose `src` is not a string starting
 * EXACTLY (case-sensitive, no trimming) with `CDN_IMAGE_ORIGIN`. An img with no src, or
 * an empty src, is removed too. The element is removed from the tree outright — never
 * emptied — so a bare, borderless `<img>` cannot linger in the layout.
 *
 * 🔑 EXACT PREFIX, NOT A HOST PARSE. `new URL(src).hostname === 'cdn.ciphera.net'` looks
 * equivalent and is not: it would accept `https://cdn.ciphera.net.evil.example/x.png`
 * (a subdomain of evil.example, not of cdn.ciphera.net) exactly as readily as a real
 * `URL` parse would accept `https://cdn.ciphera.net@evil.example/x.png` (where
 * `cdn.ciphera.net` is HTTP userinfo, not the host, and `evil.example` is the actual
 * host). A literal `startsWith` on the full origin string, trailing slash included,
 * has no such ambiguity to parse.
 */
export function cdnImagesOnly() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'img') return
      const src = node.properties?.src
      const allowed = typeof src === 'string' && src.startsWith(CDN_IMAGE_ORIGIN)
      if (!allowed && parent && typeof index === 'number') {
        parent.children.splice(index, 1)
        // Revisit this index: the next sibling has shifted into the removed slot.
        return index
      }
    })
  }
}

/**
 * The tool-logo block's `data-src` shape, measured against production (ciphera.net's 16
 * live posts, the only corpus that uses the block): 42 tool-logo blocks, every one of
 * them a path under `/blog/tools/`, lowercase-led, `png`/`svg`/`webp`, with an optional
 * numeric `?v=` cache-buster — 4 of them carry one (auth0, clerk, hcaptcha) and must
 * survive byte-for-byte. All 42 HEAD-verified 200 at
 * https://cdn.ciphera.net/website<path> before this check was tightened (WEB-16).
 *
 * 🔴 `data-src` IS A '*' ATTRIBUTE (schema above), SO IT IS NEVER SHAPE-CHECKED BY
 * SANITIZE ITSELF. `<span data-ciphera-block="tool-logo" data-src="…">` survives the
 * hast pipeline unexamined and is substituted by `<ToolLogo>` only AFTER this whole
 * chain runs (components/blog/wp-body.tsx's `CipheraBlock`), which renders
 * `<img src={cdnUrl(data-src)}>` straight from the CMS-authored string — unchecked,
 * never returned by `renderableImageSources` (so the generator never HEAD-checks a
 * tool logo), and rendered relative to this app's own origin whenever
 * `NEXT_PUBLIC_CDN_URL` happens to be unset. `toolLogosValidated` below closes all
 * three holes by removing anything that does not match this shape, and
 * `renderableImageSources` reports every surviving one so the generator can HEAD it.
 */
export const TOOL_LOGO_SRC = /^\/blog\/tools\/[a-z0-9][a-z0-9._-]*\.(?:png|svg|webp)(?:\?v=[0-9]+)?$/

/**
 * Runs AFTER sanitize, same position as `cdnImagesOnly` and for the same reason:
 * `data-src` is a '*' attribute, never shape-checked there. Only `span` and `div`
 * become a `<ToolLogo>` (components/blog/wp-body.tsx's `CipheraBlock`); on any other
 * tag the block is mis-authored and would render as that element with an inert
 * data-src, so the attributes go but the element and its text stay (deleting a `<p>`
 * would delete the editor's prose). On `span`/`div`, removes the whole element when
 * `data-src` does not match `TOOL_LOGO_SRC` exactly — including when it is absent —
 * matching `cdnImagesOnly`'s own contract: an invalid mark must not linger as a bare,
 * styled-for-nothing `<span>`.
 */
export function toolLogosValidated() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.properties?.['data-ciphera-block'] !== 'tool-logo') return
      if (node.tagName !== 'span' && node.tagName !== 'div') {
        delete node.properties['data-ciphera-block']
        delete node.properties['data-src']
        return
      }
      const src = node.properties?.['data-src']
      const allowed = typeof src === 'string' && TOOL_LOGO_SRC.test(src)
      if (!allowed && parent && typeof index === 'number') {
        parent.children.splice(index, 1)
        // Revisit this index: the next sibling has shifted into the removed slot.
        return index
      }
    })
  }
}

const sanitizePipeline = unified()
  .use(rehypeParse, { fragment: true })
  .use(cipheraBlocks)
  .use(rehypeSanitize, schema)
  .use(cdnImagesOnly)
  .use(toolLogosValidated)

/**
 * Every image source that will actually reach a reader's browser from this post body,
 * deduped, in document order — both a surviving `<img src>` and a surviving tool-logo
 * mark's resolved CDN URL. It is the result of the EXACT SAME
 * parse → cipheraBlocks → sanitize → cdnImagesOnly → toolLogosValidated chain
 * components/blog/wp-body.tsx renders with, minus only the final rehype-react step
 * (which has no bearing on which elements survive).
 *
 * scripts/generate-blog-posts.ts HEAD-checks exactly this set, so the set it verifies
 * and the set a reader's browser requests are the same set by construction — never a
 * hand-written regex that can miss a quoting style rehype-parse accepts (a single-quoted
 * `src='…'`, for one) or drift from what the sanitizer actually allows through.
 *
 * `opts.toolLogoBase` is how a tool-logo mark's `data-src` (a bare path, e.g.
 * `/blog/tools/signal.png`) is turned into the ABSOLUTE url `ToolLogo` will actually
 * request in a production build — `cdnUrl(data-src)` there resolves against
 * `NEXT_PUBLIC_CDN_URL`, so this module does not hard-code which site's CDN prefix that
 * is; the caller (the generator) passes its own CDN constant. Left unset, it defaults
 * to the empty string, which is what `cdnUrl()` itself resolves to when
 * `NEXT_PUBLIC_CDN_URL` is unset.
 */
export function renderableImageSources(html: string, opts: { toolLogoBase?: string } = {}): string[] {
  const toolLogoBase = opts.toolLogoBase ?? ''
  const tree = sanitizePipeline.runSync(sanitizePipeline.parse(html)) as Root
  const seen = new Set<string>()
  const sources: string[] = []
  const add = (src: string) => {
    if (!seen.has(src)) {
      seen.add(src)
      sources.push(src)
    }
  }
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'img') {
      const src = node.properties?.src
      if (typeof src === 'string') add(src)
      return
    }
    if (node.properties?.['data-ciphera-block'] === 'tool-logo') {
      // toolLogosValidated has already removed anything whose data-src does not
      // match TOOL_LOGO_SRC (on span/div) or stripped the attributes entirely (on
      // any other tag), so every survivor here is a known-good path on span/div.
      const dataSrc = node.properties?.['data-src']
      if (typeof dataSrc === 'string') add(`${toolLogoBase}${dataSrc}`)
    }
  })
  return sources
}
