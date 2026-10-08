/**
 * The Route SEO (Page SEO) transform, extracted pure (WEB-26 round 2).
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1.3, §4.1.3a
 *
 * 🔑 ONE TRANSFORM, TWO CALLERS, SAME SHAPE OF REASON AS lib/cms/glossary-build.ts.
 * `scripts/generate-seo.ts` calls this at build time to produce the seed
 * (`lib/seo.gen.ts`); `scripts/cms-publisher.ts` calls it at publish time to produce
 * the CDN documents. There are no network- or filesystem-dependent checks in the
 * build-time generator for this kind (unlike blog/redirect) — everything it does is
 * reproduced here.
 */
import type { ContentRepairEntry } from '../content-repair-types'
import type { RouteSeo } from '../seo'

export const ROUTE_REPAIR_TYPE = 'route-seo'

export interface RouteSeoNode {
  databaseId: number | null
  cipheraPath: string | null
  cipheraTitle: string | null
  cipheraDescription: string | null
  cipheraCanonical: string | null
  cipheraOgTitle: string | null
  cipheraOgDescription: string | null
  cipheraOgImage: string | null
  cipheraTwitterTitle: string | null
  cipheraTwitterDescription: string | null
  cipheraNoindex: boolean | null
  cipheraNofollow: boolean | null
  modifiedGmt: string | null
}

export interface RouteBuildResult {
  /** Keyed by the route PATH (e.g. "/about"), as lib/seo.ts's routeSeo already is. */
  routes: Record<string, RouteSeo>
  repairs: ContentRepairEntry[]
  watermark: string
}

/**
 * A route stub's key for the content-addressed document path (§4.1.3a "Paths": "Page
 * SEO uses the path slugified, / → home"). Not reversible for every path in theory
 * (two paths could collapse to the same key), but every one of the 14 real routes is a
 * single flat or one-level segment and does not collide — reported in the publisher log
 * if it ever does (see cms-publisher.ts's publishRoute, which SKIPS a colliding key
 * rather than silently overwriting one route's document with another's).
 */
export function routeKey(path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, '')
  return trimmed === '' ? 'home' : trimmed.replace(/\//g, '-')
}

/**
 * Published, site-filtered `routeStubs` GraphQL nodes → the routes this site renders
 * metadata for, keyed by PATH, every repair/skip recorded (P1-a), and the watermark the
 * caller folds into its own. Mirrors scripts/generate-seo.ts's own rules exactly.
 */
export function buildRouteSeo(nodes: RouteSeoNode[]): RouteBuildResult {
  const repairs: ContentRepairEntry[] = []
  const repair = (ref: string, field: string, action: ContentRepairEntry['action'], detail: string): void => {
    repairs.push({ type: ROUTE_REPAIR_TYPE, ref, field, action, detail })
  }

  const byPath = new Map<string, RouteSeoNode[]>()
  for (const n of nodes) {
    const ref = n.databaseId != null ? `wp-db-${n.databaseId}` : '(unknown)'
    const p = (n.cipheraPath ?? '').trim()
    if (!p) {
      repair(ref, 'path', 'skipped', 'a published stub has an empty path')
      continue
    }
    if (!p.startsWith('/')) {
      repair(p, 'path', 'skipped', `path "${p}" does not start with "/"`)
      continue
    }
    const list = byPath.get(p) ?? []
    list.push(n)
    byPath.set(p, list)
  }

  const seen = new Map<string, RouteSeoNode>()
  for (const [p, group] of byPath) {
    const sorted = [...group].sort((a, b) => (a.databaseId ?? Infinity) - (b.databaseId ?? Infinity))
    seen.set(p, sorted[0])
    for (const loser of sorted.slice(1)) {
      repair(
        p,
        'path',
        'skipped',
        `duplicate stub for ${p} (databaseId ${loser.databaseId ?? 'unknown'}) — kept the lowest databaseId (${sorted[0].databaseId ?? 'unknown'})`
      )
    }
  }

  const routes: Record<string, RouteSeo> = {}
  for (const [p, n] of seen) {
    const ogImageRaw = (n.cipheraOgImage ?? '').trim()
    let ogImage = ''
    if (ogImageRaw) {
      if (ogImageRaw.startsWith('https://cdn.ciphera.net/')) {
        ogImage = ogImageRaw
      } else {
        repair(p, 'ogImage', 'repaired', `OG image is not on cdn.ciphera.net — got "${ogImageRaw}"; dropped`)
      }
    }
    const title = (n.cipheraTitle ?? '').trim()
    if (!title) repair(p, 'title', 'repaired', `${p}: stub has no title — the route's own in-code title applies`)
    const description = (n.cipheraDescription ?? '').trim()
    if (!description) repair(p, 'description', 'repaired', `${p}: stub has no meta description — the route's own in-code description applies`)

    routes[p] = {
      title,
      description,
      canonical: (n.cipheraCanonical ?? '').trim(),
      ogTitle: n.cipheraOgTitle ?? '',
      ogDescription: n.cipheraOgDescription ?? '',
      ogImage,
      twitterTitle: n.cipheraTwitterTitle ?? '',
      twitterDescription: n.cipheraTwitterDescription ?? '',
      noindex: n.cipheraNoindex === true,
      nofollow: n.cipheraNofollow === true,
      modified: n.modifiedGmt ?? '',
    }
  }

  const watermark = [...seen.values()].map((n) => n.modifiedGmt ?? '').filter(Boolean).sort().at(-1) ?? ''

  return { routes, repairs, watermark }
}
