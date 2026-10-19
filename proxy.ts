import { NextResponse, type NextRequest } from 'next/server'
import { resolveRedirectDoc } from './lib/cms/redirect-runtime'
import { isRuntimeKind } from './lib/cms/runtime-config'
import { resolvePage } from './lib/cms/page-runtime'
import { postExists } from './components/overhaul/blog/data'
import { termExists } from './components/overhaul/glossary/data'
import { learnArticleExists } from './lib/learn'
import { CMS_PAGE_HEADER, NOT_FOUND_ROUTE, classifyPath } from './lib/routing/not-found-routes.mjs'

/**
 * Two jobs, in this order, before Next's router sees a request: the CMS's redirects, then the not-found gate.
 *
 * Next 16 renamed Middleware to Proxy (this was middleware.ts until R11, 20-10-2026). A proxy runs on the Node.js
 * runtime, which the gate needs: the blog and glossary resolvers read their build seeds from the filesystem.
 */
export async function proxy(req: NextRequest) {
  const redirect = await cmsRedirect(req)
  if (redirect) return redirect
  return notFoundGate(req)
}

const KIND = 'redirect'

/**
 * CMS redirects at request time — R13 (§4.1.3a, WEB-26 round 2). `null` means "no redirect here".
 *
 * 🔴 TIER 1 NEVER REACHES HERE. `next.config.ts`'s `redirects()` is resolved by Next's
 * router BEFORE middleware runs for every request — confirmed in Next 16.2.10's own
 * source: `calculateRoutes()` (node_modules/next/dist/server/lib/router-utils/
 * resolve-routes.js) builds its ordered route list with `fsChecker.redirects`
 * (config-level redirects) immediately before the `'middleware'` match entry, and the
 * same package's own docs page (`dist/docs/.../10-routing-information.md`,
 * `routing.beforeMiddleware`: "Routes applied before middleware execution. These
 * include generated header and redirect behavior.") says the same thing. So a Tier-1
 * request is answered and returned before this file's code ever executes — Tier 1
 * wins regardless of what this file does.
 *
 * 🔑 'redirect' OFF (today's default — DEFAULT_RUNTIME_KINDS has no 'redirect') is a
 * NO-OP, not merely "finds nothing": `resolveRedirectDoc()` takes its first `if` and
 * returns immediately, with no CDN read at all. Nothing here changes behaviour until
 * the kind is turned on.
 *
 * 🔴 THE KIND'S SHAPE RULES ARE THE SAME ONES THE GENERATOR ENFORCES
 * (lib/cms/redirect-build.ts) — a Tier-1 collision, an invalid path, a chain: none of
 * those can reach the published document at all (cms-publisher.ts refuses the whole
 * publish pass on one, same as the build does), so this file trusts the document's
 * shape without re-validating it.
 */
async function cmsRedirect(req: NextRequest): Promise<NextResponse | null> {
  if (!isRuntimeKind(KIND)) return null

  // A CDN failure must never 500 a request — fall through to the normal route, exactly
  // as an unreachable WordPress leaves a build on its last-good seed. resolveRedirectDoc()
  // already swallows every failure internally (lib/cms/redirect-runtime.ts) and only
  // ever returns undefined; this try/catch is defence in depth against it ever throwing.
  let doc
  try {
    doc = await resolveRedirectDoc()
  } catch {
    return null
  }
  if (!doc) return null

  const pathname = req.nextUrl.pathname
  const match = doc.redirects.find((r) => r.source === pathname)
  if (!match) return null

  // Every source/destination is a site-relative path by construction — the
  // publisher's validRedirectPath() (lib/cms/redirect-build.ts) requires a leading
  // "/", same allowlist the build enforces for next.config.ts's own REDIRECTS.
  const url = req.nextUrl.clone()
  url.pathname = match.destination
  url.search = ''
  return NextResponse.redirect(url, 308)
}

/**
 * The not-found gate (R11): a missing page is decided HERE, before rendering, so the router can answer it with Next's
 * own not-found page, rendered in full (lib/routing/not-found-routes.mjs has the reason a page cannot).
 *
 * - /blog/<slug>, /glossary/<slug>, /learn/<product>/<slug>: the routes' own `postExists`/`termExists`/
 *   `learnArticleExists`, the ONE answer the pages also use. A miss is rewritten to the not-found route; the address
 *   stays what the reader typed.
 * - /cms-page/...: the internal CMS route, never served at its own address.
 * - everything else: the content index decides whether a CMS page lives at this address; if one does,
 *   `CMS_PAGE_HEADER` lets next.config.ts's fallback rewrite reach it. A coded route matches before that rewrite is
 *   considered, so the header can never shadow one.
 *
 * 🔴 NEVER A FALSE 404 OR A 500 FROM HERE. The resolvers already fall back to the build seed or to "nothing" on any CDN
 * failure, exactly as the pages do; if something throws anyway, the request continues as it did before the gate
 * existed (the CMS route decides, at worst with the empty 404 this gate exists to replace).
 */
async function notFoundGate(req: NextRequest): Promise<NextResponse> {
  const route = classifyPath(req.nextUrl.pathname)
  try {
    switch (route.family) {
      case 'internal':
        return toNotFound(req)
      case 'blog':
        return (await postExists(route.slug)) ? continueTo(req, false) : toNotFound(req)
      case 'glossary':
        return (await termExists(route.slug)) ? continueTo(req, false) : toNotFound(req)
      case 'learn':
        return learnArticleExists(route.product, route.slug) ? continueTo(req, false) : toNotFound(req)
      case 'other':
        return continueTo(req, (await resolvePage(req.nextUrl.pathname)) !== undefined)
      default:
        return continueTo(req, false)
    }
  } catch {
    return continueTo(req, route.family === 'other')
  }
}

/** Next's own not-found route: prerendered in full, answered with 404, under the address the reader asked for. */
function toNotFound(req: NextRequest): NextResponse {
  return NextResponse.rewrite(new URL(NOT_FOUND_ROUTE, req.url))
}

/** On to Next's router. `CMS_PAGE_HEADER` is set only when `cmsPage` says so; a copy the client sent is removed. */
function continueTo(req: NextRequest, cmsPage: boolean): NextResponse {
  if (!cmsPage && !req.headers.has(CMS_PAGE_HEADER)) return NextResponse.next()
  const headers = new Headers(req.headers)
  headers.delete(CMS_PAGE_HEADER)
  if (cmsPage) headers.set(CMS_PAGE_HEADER, '1')
  return NextResponse.next({ request: { headers } })
}

export const config = {
  // 🔴 EXCLUDES _next, every static file (an extension in the path) and /sys — a
  // redirect over the asset pipeline or the machine-readable status endpoint would be
  // indistinguishable from an outage. Mirrors the shape of Next's own recommended
  // matcher for "everything except static assets". A dotted address never reaches the
  // gate either; it can never be a CMS page, so the router answers it on its own.
  matcher: ['/((?!_next/|sys/|.*\\..*).*)'],
}
