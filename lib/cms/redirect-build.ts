/**
 * The redirect transform, extracted pure (WEB-26 round 2).
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1.3, §4.1.3a (R13)
 *
 * 🔑 ONE TRANSFORM, TWO CALLERS. `scripts/generate-redirects.ts` calls this at build
 * time to produce the seed (`lib/redirects.gen.ts`); `scripts/cms-publisher.ts` calls
 * it at publish time to produce the ONE `redirect` document per site (§4.1.3a "Paths":
 * key "all"). Both get the shape checks, the Tier-1 collision refusal, the duplicate
 * dedupe and the chain flattening from ONE function.
 *
 * 🔴 WHAT STAYS OUTSIDE THIS MODULE ON PURPOSE: the live-static-route shadow check and
 * the live-blog-post shadow check. Both need information this pure module cannot have
 * — a filesystem walk of `app/` and a second WordPress query — and BUILD TIME is where
 * they matter most: a Tier-2 rule shadowing a page that is ABOUT TO ship in the SAME
 * build is the case worth catching before `next build` fails obscurely. The publisher
 * does not replicate them: it is not deploying a new page, so a shadow it introduces
 * can only ever be against a page that is ALREADY live, and the SAME middleware that
 * applies a CMS redirect at runtime would equally apply a stale one — there is no
 * narrower runtime equivalent to add. Documented, not silently covered: a redirect
 * published through the CMS that shadows a live static route or post is NOT caught at
 * publish time, only at the next full build (which regenerates the seed and would
 * refuse it there, same as today). Tier 1 itself is immune either way — see below.
 */
import { validRedirectPath } from '../redirect-path-rules.mjs'
import type { ContentRepairEntry } from '../content-repair-types'

export const REDIRECT_REPAIR_TYPE = 'redirect'

/** Mirrors next.config.ts's Tier 1 exactly — see generate-redirects.ts's own copy. */
export const TIER1_EXACT = ['/security', '/companies', '/comparison', '/products', '/products/auth', '/products/drop']
export const TIER1_PREFIX = ['/transparency']

export function isTier1(from: string): boolean {
  return TIER1_EXACT.includes(from) || TIER1_PREFIX.some((p) => from === p || from.startsWith(`${p}/`))
}

export interface RedirectNode {
  databaseId: number | null
  cipheraFrom: string | null
  cipheraTo: string | null
  modifiedGmt: string | null
}

export interface RedirectRule {
  source: string
  destination: string
  permanent: true
}

export interface RedirectBuildResult {
  redirects: RedirectRule[]
  repairs: ContentRepairEntry[]
  watermark: string
}

const norm = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

/**
 * Published, site-filtered `redirects` GraphQL nodes → the flattened, deduped,
 * Tier-1-clean redirect list, every repair/skip recorded, and the watermark. Throws on
 * a Tier-1 collision — THE ONE HARD FAILURE this feature keeps (see
 * scripts/generate-redirects.ts's own header) — the caller decides what that means for
 * it (a failed build vs. a failed publish pass that keeps the previous document).
 */
export function buildRedirects(nodes: RedirectNode[]): RedirectBuildResult {
  const repairs: ContentRepairEntry[] = []
  const repair = (ref: string, field: string, action: ContentRepairEntry['action'], detail: string): void => {
    repairs.push({ type: REDIRECT_REPAIR_TYPE, ref, field, action, detail })
  }

  const byFrom = new Map<string, Array<{ source: string; destination: string; modified: string; databaseId: number | null }>>()

  for (const n of nodes) {
    const ref = n.databaseId != null ? `wp-db-${n.databaseId}` : '(unknown)'
    const from = norm((n.cipheraFrom ?? '').trim())
    const to = norm((n.cipheraTo ?? '').trim())

    if (!from || !to) {
      repair(from || ref, 'from/to', 'skipped', `a published redirect is missing one half — from="${from}" to="${to}"`)
      continue
    }
    if (!validRedirectPath(from)) {
      repair(from, 'from', 'skipped', `redirect source "${from}" is not a site-relative path`)
      continue
    }
    if (!validRedirectPath(to)) {
      repair(from, 'to', 'skipped', `redirect destination "${to}" is not a site-relative path`)
      continue
    }
    if (from === to) {
      repair(from, 'to', 'skipped', `redirect "${from}" points at itself`)
      continue
    }
    if (isTier1(from)) {
      throw new Error(
        `redirect source "${from}" collides with a Tier-1 rule — Tier 1 is permanent infrastructure and is spread ` +
          `first in next.config.ts, so this rule would never fire. Delete it in the CMS, or change Tier 1 deliberately in a PR.`
      )
    }

    const list = byFrom.get(from) ?? []
    list.push({ source: from, destination: to, modified: n.modifiedGmt ?? '', databaseId: n.databaseId })
    byFrom.set(from, list)
  }

  const bySource = new Map<string, { source: string; destination: string; modified: string }>()
  for (const [from, group] of byFrom) {
    const sorted = [...group].sort((a, b) => (a.databaseId ?? Infinity) - (b.databaseId ?? Infinity))
    bySource.set(from, { source: sorted[0].source, destination: sorted[0].destination, modified: sorted[0].modified })
    for (const loser of sorted.slice(1)) {
      repair(
        from,
        'from',
        'skipped',
        `two published redirects both claim "${from}" (databaseId ${loser.databaseId ?? 'unknown'}) — kept the lowest databaseId`
      )
    }
  }

  const flattened = new Map(bySource)
  const cyclic = new Set<string>()
  for (const [source, entry] of bySource) {
    if (cyclic.has(source)) continue
    const chain = [source]
    let dest = entry.destination
    let isCycle = false
    while (bySource.has(dest)) {
      if (chain.includes(dest)) {
        isCycle = true
        break
      }
      chain.push(dest)
      dest = bySource.get(dest)!.destination
    }
    if (isCycle) {
      for (const node of chain) cyclic.add(node)
    } else if (dest !== entry.destination) {
      repair(source, 'destination', 'repaired', `chain: "${chain.join('" → "')}" → "${dest}" — repointed "${source}" straight at "${dest}"`)
      flattened.set(source, { ...entry, destination: dest })
    }
  }
  for (const source of cyclic) {
    repair(source, 'from', 'skipped', `redirect "${source}" is part of a CYCLE — unusable, dropped`)
    flattened.delete(source)
  }

  const sorted = [...flattened.values()].sort((a, b) => a.source.localeCompare(b.source))
  const watermark = sorted.reduce((m, r) => (r.modified > m ? r.modified : m), '')

  return {
    redirects: sorted.map((r) => ({ source: r.source, destination: r.destination, permanent: true as const })),
    repairs,
    watermark,
  }
}
