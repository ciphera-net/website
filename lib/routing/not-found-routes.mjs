/**
 * Which addresses can only be called missing once the content behind them is known, and how a missing one reaches
 * Next's fully rendered not-found page instead of an empty shell (R11, plan §5o).
 *
 * 🔴 WHY THIS EXISTS. Next 16 cannot server-render a `notFound()` thrown while a page renders on demand. React runs no
 * error boundary during SSR, so the throw escapes the whole render, and Next answers 404 with an EMPTY
 * `<html id="__next_error__">` document: no header, no text, no stylesheet. The page appears only after JavaScript,
 * under the homepage's title. Read in node_modules/next 16.2.10 (`renderToStream`'s catch → `getErrorRSCPayload`),
 * unchanged in 16.4.2; Next's in-place fallback exists only for prerenders with `cacheComponents`. An address the
 * ROUTER finds no page for is different: Next serves its prerendered `/_not-found`, fully rendered, with 404. So a
 * miss is decided here, before rendering, and the router answers it.
 *
 * ZERO IMPORTS, same reason as lib/glossary-category-rules.mjs: proxy.ts and next.config.ts import it, and the
 * node:test suite (no `npm ci` in CI) executes it for real.
 */

/**
 * The internal route a published CMS page at a NEW address renders through (WEB-28). Reached only through the
 * fallback rewrite in next.config.ts; a direct request for it is answered with the not-found page (proxy.ts).
 */
export const CMS_PAGE_ROUTE = '/cms-page'

/**
 * Set by proxy.ts on the REQUEST when the content index has a page at its path; the fallback rewrite matches on it.
 * proxy.ts removes any copy a client sends.
 */
export const CMS_PAGE_HEADER = 'x-ciphera-cms-page'

/** Where proxy.ts sends a definite miss: Next's own not-found route, prerendered in full, answered with 404. */
export const NOT_FOUND_ROUTE = '/_not-found'

/**
 * The family a request path belongs to:
 * - `blog` / `glossary`: one segment under /blog or /glossary, the dynamic routes whose content arrives at runtime;
 *   `slug` is decoded the way Next decodes the route param.
 * - `learn`: /learn/<product>/<slug>. Its articles are files fixed at build time, but the route renders on demand
 *   (the layout reads the CMS menus), and `dynamicParams = false` does nothing on a route that renders on demand
 *   (measured: the miss still came back as the empty shell), so the gate asks here too.
 * - `internal`: the CMS route, requested directly.
 * - `other`: everything else, i.e. a coded route, or an address no route owns (a CMS page, or a miss).
 * - `undecodable`: a percent-encoding that does not decode; left to Next.
 *
 * @param {string} pathname
 * @returns {{ family: 'blog' | 'glossary', slug: string } | { family: 'learn', product: string, slug: string } |
 *   { family: 'internal' | 'other' | 'undecodable' }}
 */
export function classifyPath(pathname) {
  if (pathname === CMS_PAGE_ROUTE || pathname.startsWith(CMS_PAGE_ROUTE + '/')) return { family: 'internal' }
  try {
    const post = /^\/(blog|glossary)\/([^/]+)$/.exec(pathname)
    if (post) return { family: post[1] === 'blog' ? 'blog' : 'glossary', slug: decodeURIComponent(post[2]) }
    const article = /^\/learn\/([^/]+)\/([^/]+)$/.exec(pathname)
    if (article) return { family: 'learn', product: decodeURIComponent(article[1]), slug: decodeURIComponent(article[2]) }
  } catch {
    return { family: 'undecodable' }
  }
  return { family: 'other' }
}
