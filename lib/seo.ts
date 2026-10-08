import type { Metadata } from 'next'
import { routeSeo, SEO_ROUTE_COUNT, SEO_WATERMARK, SEO_POST_COUNT } from './seo.gen'
import { getContentDocument, getContentIndex } from './cms/content-client'
import { isRuntimeKind, SITE_KEY } from './cms/runtime-config'
import { routeKey } from './cms/route-build'

/**
 * Level 1: SEO fields come from WordPress; the page body does not.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §6
 *
 * 🔴 A ROUTE STUB IS METADATA BOLTED ONTO A REACT ROUTE THAT ALREADY EXISTS. It has
 * no body. This helper only ever replaces what goes in <head>.
 */

export interface RouteSeo {
  title: string
  description: string
  canonical: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterTitle: string
  twitterDescription: string
  noindex: boolean
  nofollow: boolean
  /** WordPress `modifiedGmt` for this stub — feeds the sitemap's lastmod. */
  modified: string
}

/** Every route the agency owns. Exported so app/sitemap.ts stays in step (§6.7). */
export { routeSeo, SEO_ROUTE_COUNT, SEO_WATERMARK, SEO_POST_COUNT }

export function seoForRoute(path: string): RouteSeo | undefined {
  return routeSeo[path]
}

/**
 * Merge WordPress over the page's hardcoded metadata, field by field.
 *
 * The hardcoded object stays in the page file and is the fallback: a route with no
 * stub renders exactly as it did before Level 1 existed. That is what makes a
 * WordPress outage a deploy problem rather than a serving problem (§5.3) — by the
 * time this runs, the content is already baked into the build.
 */
export function seoFor(path: string, fallback: Metadata): Metadata {
  const wp = routeSeo[path]
  if (!wp) return fallback

  const merged: Metadata = { ...fallback }

  // 🔴 `absolute`, NEVER a bare string. The root layout sets
  // `title: { template: '%s | Ciphera' }`, so a plain string here would be appended
  // to — and a WordPress title that already reads "Pulse … | Ciphera" would render
  // "Pulse … | Ciphera | Ciphera".
  //
  // 🔑 IT IS ALSO WHAT FREEZES TODAY'S OUTPUT. Measured 10-09-2026 on the live site:
  // the served titles are NOT uniform. /about renders "… | Ciphera" and
  // /products/pulse renders no suffix, from title declarations that look identical
  // in the source — the difference is emergent from Next's template inheritance
  // through app/products/layout.tsx. The stubs are seeded with the FULL SERVED
  // TITLE, so `absolute` reproduces exactly what is live today and makes the
  // behaviour explicit instead of accidental.
  if (wp.title) merged.title = { absolute: wp.title }
  if (wp.description) merged.description = wp.description

  // Empty means DERIVE, not "no canonical" — nullable state over a sentinel.
  merged.alternates = {
    ...(fallback.alternates ?? {}),
    canonical: wp.canonical || `https://ciphera.net${path === '/' ? '' : path}`,
  }

  const fbOg = (fallback.openGraph ?? {}) as Record<string, unknown>
  merged.openGraph = {
    ...fbOg,
    ...(wp.ogTitle ? { title: wp.ogTitle } : {}),
    ...(wp.ogDescription ? { description: wp.ogDescription } : {}),
    ...(wp.ogImage
      ? { images: [{ url: wp.ogImage, width: 1200, height: 630, alt: wp.ogTitle || wp.title }] }
      : {}),
  }

  const fbTw = (fallback.twitter ?? {}) as Record<string, unknown>
  merged.twitter = {
    ...fbTw,
    ...(wp.twitterTitle ? { title: wp.twitterTitle } : {}),
    ...(wp.twitterDescription ? { description: wp.twitterDescription } : {}),
    ...(wp.ogImage ? { images: [wp.ogImage] } : {}),
  }

  // Only ever narrow. A stub can take a page OUT of the index; it cannot put one in
  // that the page itself had excluded.
  if (wp.noindex || wp.nofollow) {
    merged.robots = { index: !wp.noindex, follow: !wp.nofollow }
  }

  return merged
}

// ── WEB-26 round 2: 'route' as a runtime kind ───────────────────────────────────────
//
// §4.1.3a's site key for this kind is "seo" (watermarks.seo, runtime.seo), not
// "route" — matching the pre-existing SEO_WATERMARK/routes naming in /sys/seo-state.
// The CMS kind itself is still named 'route' everywhere else (CMS_RUNTIME_KINDS,
// the publisher's index.kinds.route).
const KIND = 'route'
const KNOWN_SCHEMA = 1

export type RouteSeoSource = 'cdn' | 'seed'

export interface RouteSeoRuntimeState {
  enabled: boolean
  source: RouteSeoSource
  indexWatermark?: string
  publishedAt?: string
}

let lastState: RouteSeoRuntimeState = { enabled: isRuntimeKind(KIND), source: 'seed' }

/**
 * `/sys/seo-state`'s runtime block reads this — forces a fresh resolution first.
 * The probe path is never a real route; resolveRouteSeo only needs it to reach the
 * index-schema/CDN-reachability branches that set `lastState`, not to find a stub.
 */
export async function getRouteSeoRuntimeState(): Promise<RouteSeoRuntimeState> {
  await resolveRouteSeo('/__sys_route_seo_runtime_state_probe__')
  return lastState
}

async function resolveRouteSeo(path: string): Promise<RouteSeo | undefined> {
  const seedStub = routeSeo[path]

  if (!isRuntimeKind(KIND)) {
    lastState = { enabled: false, source: 'seed' }
    return seedStub
  }

  try {
    const index = await getContentIndex(SITE_KEY)
    const kind = index?.kinds?.[KIND]
    if (!index || !kind || kind.schema !== KNOWN_SCHEMA) {
      lastState = { enabled: true, source: 'seed' }
      return seedStub
    }
    const docPath = kind.items[routeKey(path)]
    if (!docPath) {
      // No CDN stub for this path — not an error, same as the seed having none.
      lastState = { enabled: true, source: 'cdn', indexWatermark: kind.watermark, publishedAt: index.published_at }
      return seedStub
    }
    try {
      const stub = await getContentDocument<RouteSeo>(docPath)
      lastState = { enabled: true, source: 'cdn', indexWatermark: kind.watermark, publishedAt: index.published_at }
      return stub
    } catch {
      lastState = { enabled: true, source: 'seed' }
      return seedStub
    }
  } catch {
    lastState = { enabled: true, source: 'seed' }
    return seedStub
  }
}

/**
 * The async counterpart to `seoFor()`, used through `generateMetadata` on every page
 * that used to call `seoFor()` as a module-scope `export const metadata`. With 'route'
 * off (today's default), this resolves synchronously-fast from the seed — the page's
 * served `<head>` is byte-identical to before. With 'route' on, it reads the content
 * CDN instead, falling back to the seed on any failure or unknown schema — see
 * resolveRouteSeo().
 */
export async function seoForAsync(path: string, fallback: Metadata): Promise<Metadata> {
  const wp = await resolveRouteSeo(path)
  if (!wp) return fallback
  return mergeRouteSeo(path, wp, fallback)
}

/** The field-by-field merge `seoFor()` already did — factored out so both the sync
 * seed path and the async CDN path produce IDENTICAL output for the same RouteSeo. */
function mergeRouteSeo(path: string, wp: RouteSeo, fallback: Metadata): Metadata {
  const merged: Metadata = { ...fallback }
  if (wp.title) merged.title = { absolute: wp.title }
  if (wp.description) merged.description = wp.description

  merged.alternates = {
    ...(fallback.alternates ?? {}),
    canonical: wp.canonical || `https://ciphera.net${path === '/' ? '' : path}`,
  }

  const fbOg = (fallback.openGraph ?? {}) as Record<string, unknown>
  merged.openGraph = {
    ...fbOg,
    ...(wp.ogTitle ? { title: wp.ogTitle } : {}),
    ...(wp.ogDescription ? { description: wp.ogDescription } : {}),
    ...(wp.ogImage
      ? { images: [{ url: wp.ogImage, width: 1200, height: 630, alt: wp.ogTitle || wp.title }] }
      : {}),
  }

  const fbTw = (fallback.twitter ?? {}) as Record<string, unknown>
  merged.twitter = {
    ...fbTw,
    ...(wp.twitterTitle ? { title: wp.twitterTitle } : {}),
    ...(wp.twitterDescription ? { description: wp.twitterDescription } : {}),
    ...(wp.ogImage ? { images: [wp.ogImage] } : {}),
  }

  if (wp.noindex || wp.nofollow) {
    merged.robots = { index: !wp.noindex, follow: !wp.nofollow }
  }

  return merged
}
