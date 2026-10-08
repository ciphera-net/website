import { NextResponse, type NextRequest } from 'next/server'
import { resolveRedirectDoc } from './lib/cms/redirect-runtime'
import { isRuntimeKind } from './lib/cms/runtime-config'

/**
 * CMS redirects at request time — R13 (§4.1.3a, WEB-26 round 2).
 *
 * 🔴 TIER 1 NEVER REACHES HERE. `next.config.ts`'s `redirects()` is resolved by Next's
 * router BEFORE middleware runs for every request — confirmed in Next 16.2.10's own
 * source: `calculateRoutes()` (node_modules/next/dist/server/lib/router-utils/
 * resolve-routes.js) builds its ordered route list with `fsChecker.redirects`
 * (config-level redirects) immediately before the `'middleware'` match entry, and the
 * same package's own docs page (`dist/docs/.../10-routing-information.md`,
 * `routing.beforeMiddleware`: "Routes applied before middleware execution. These
 * include generated header and redirect behavior.") says the same thing. So a Tier-1
 * request is answered and returned before this file's code ever executes — the
 * GPG-signed-canary guarantee holds regardless of what this file does.
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
const KIND = 'redirect'

export async function middleware(req: NextRequest) {
  if (!isRuntimeKind(KIND)) return NextResponse.next()

  // A CDN failure must never 500 a request — fall through to the normal route, exactly
  // as an unreachable WordPress leaves a build on its last-good seed. resolveRedirectDoc()
  // already swallows every failure internally (lib/cms/redirect-runtime.ts) and only
  // ever returns undefined; this try/catch is defence in depth against it ever throwing.
  let doc
  try {
    doc = await resolveRedirectDoc()
  } catch {
    return NextResponse.next()
  }
  if (!doc) return NextResponse.next()

  const pathname = req.nextUrl.pathname
  const match = doc.redirects.find((r) => r.source === pathname)
  if (!match) return NextResponse.next()

  // Every source/destination is a site-relative path by construction — the
  // publisher's validRedirectPath() (lib/cms/redirect-build.ts) requires a leading
  // "/", same allowlist the build enforces for next.config.ts's own REDIRECTS.
  const url = req.nextUrl.clone()
  url.pathname = match.destination
  url.search = ''
  return NextResponse.redirect(url, 308)
}

export const config = {
  // 🔴 EXCLUDES _next, every static file (an extension in the path) and /sys — a
  // redirect over the asset pipeline or the machine-readable status endpoint would be
  // indistinguishable from an outage. Mirrors the shape of Next's own recommended
  // matcher for "everything except static assets".
  matcher: ['/((?!_next/|sys/|.*\\..*).*)'],
}
