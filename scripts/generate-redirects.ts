/**
 * generate-redirects.ts — Tier-2 content redirects, pulled from WordPress at BUILD time.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §6.4, §34
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1 P1-a
 *
 * 🔴 TIER 1 NEVER COMES FROM HERE, AND THIS SCRIPT REFUSES TO SHADOW IT.
 * `next.config.ts` keeps seven rules for ever. The trust-hub pair is the load-bearing
 * one: the GPG-signed canaries published 2026-04..2026-07 cite
 * `ciphera.net/transparency/canary-pubkey.asc` INSIDE their signed plaintext, which
 * cannot be edited without invalidating the signatures. A Tier-2 rule that collided
 * with one of those would be a CMS row quietly overriding a cryptographic commitment.
 * Two things stop it: the guard below, and the spread order in next.config.ts, which
 * puts Tier 1 first so it wins even if this file were bypassed.
 *
 * 🔑 NO MIDDLEWARE, DELIBERATELY. We already pull at build time, so a generated array
 * spread into `next.config.ts`'s existing `redirects()` is handled by Next's router
 * with ZERO per-request middleware invocation, on a site that has no middleware at
 * all. Middleware would only earn its cost if redirects had to change without a
 * deploy — and in this architecture nothing changes without a deploy.
 *
 * 🔴 P1-a: NO CMS CONTENT STATE MAY FAIL THIS BUILD, WITH EXACTLY ONE EXCEPTION. A
 * redirect missing a half, malformed, pointing at itself, shadowing a live page, or
 * duplicated is now SKIPPED (and recorded) rather than failing the build — the real
 * page or the lowest-databaseId redirect wins, and the agency sees the drop in the CMS
 * review queue rather than a red pipeline. A CHAIN (A→B→C) is REPAIRED by flattening A
 * to point straight at C. The ONE THING THAT STAYS A HARD FAILURE is a Tier-1 collision
 * — it is load-bearing (see above), not a content state this build may repair around.
 */
import fs from 'fs'
import path from 'path'
import { validRedirectPath } from '../lib/redirect-path-rules.mjs'
import { recordContentRepairs } from '../lib/content-repair-log'
import type { ContentRepairEntry } from '../lib/content-repair-types'

const WP = process.env.WORDPRESS_GRAPHQL_URL ?? 'http://wordpress.apps.svc.cluster.local/graphql'
const SITE = 'ciphera-net'
const OUT = path.join(process.cwd(), 'lib', 'redirects.gen.ts')
const APP = path.join(process.cwd(), 'app')

/**
 * ⚠️ NO LONGER A BUILD GATE (P1-a). This used to be an exact-equality fail() — a
 * redirect silently unpublished, for ANY reason, failed the whole site.
 * `WordpressRedirectsDropped` (Infra/Kubernetes/workloads/prometheus/rules/wordpress.yml)
 * already alerts on the same condition independently. Kept as a constant purely for
 * this comment's own arithmetic; nothing compares against it any more.
 */
const EXPECTED_REDIRECTS = 18

/**
 * Tier 1, mirrored here ONLY so a Tier-2 rule cannot be created that never fires.
 * ⚠️ This list and `next.config.ts` are one decision in two files. They are small,
 * they are permanent, and a Tier-2 rule shadowed by one of them is a redirect the
 * agency created and watched do nothing — so the build says so instead.
 */
const TIER1_EXACT = [
  '/security',
  '/companies',
  '/comparison',
  '/products',
  '/products/auth',
  '/products/drop',
]
/** `/transparency/:path*` matches the segment itself and everything beneath it. */
const TIER1_PREFIX = ['/transparency']

const QUERY = `{
  redirects(first: 200, where: { status: PUBLISH }) {
    nodes {
      databaseId
      cipheraFrom
      cipheraTo
      modifiedGmt
      routeSites { nodes { slug } }
    }
  }
  blogPosts(first: 200, where: { status: PUBLISH }) {
    nodes { slug routeSites { nodes { slug } } }
  }
}`

type Node = {
  databaseId: number | null
  cipheraFrom: string | null
  cipheraTo: string | null
  modifiedGmt: string | null
  routeSites?: { nodes?: Array<{ slug: string }> }
}

/** Still fatal: this is an INFRASTRUCTURE failure, not a CMS content state (P1-a). */
function fail(msg: string): never {
  console.error(`\n✖ generate:redirects — ${msg}\n`)
  process.exit(1)
}

const REPAIR_TYPE = 'redirect'
const repairs: ContentRepairEntry[] = []
function repair(ref: string, field: string, action: ContentRepairEntry['action'], detail: string): void {
  repairs.push({ type: REPAIR_TYPE, ref, field, action, detail })
}

/**
 * Every STATIC route this app serves.
 *
 * 🔴 STATIC ONLY, AND THE EXCLUSION IS THE POINT. `/blog/[slug]` is dynamic, and a
 * redirect source under it is exactly the case this feature exists for — a removed
 * post whose URL the dynamic route would now 404. Treating a dynamic segment as a
 * live route would refuse every legitimate redirect. A STATIC page, though, is a real
 * page: a redirect shadowing one takes a working page off the site, silently, because
 * Next applies redirects before routing.
 */
function staticRoutes(dir: string, prefix = ''): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      if (/^page\.(tsx|ts|jsx|js)$/.test(entry.name)) out.push(prefix || '/')
      continue
    }
    const name = entry.name
    if (name.startsWith('_') || name === 'api') continue
    // A route group `(marketing)` adds no URL segment.
    if (name.startsWith('(') && name.endsWith(')')) {
      out.push(...staticRoutes(path.join(dir, name), prefix))
      continue
    }
    // A dynamic segment is not a static route — see the header.
    if (name.startsWith('[')) continue
    out.push(...staticRoutes(path.join(dir, name), `${prefix}/${name}`))
  }
  return out
}

/**
 * The same shape rule the CMS enforces, restated where it can be relied on.
 *
 * 🔴 ALLOWLISTED, NOT DENYLISTED (P1-a verifier finding, 07-10-2026) — see
 * lib/redirect-path-rules.mjs's own header for why a denylist here let a
 * path-to-regexp-significant character (`*`, `+`, `(`, `)`, …) reach Next's build-time
 * redirect validator unguarded, and why the actual check lives in that zero-dependency
 * module rather than here.
 */
function validPath(p: string): boolean {
  return validRedirectPath(p)
}

const norm = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

async function main() {
  const res = await fetch(WP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
  }).catch((e) => fail(`cannot reach WordPress at ${WP} — ${e.message}`))

  if (!res.ok) fail(`WordPress returned HTTP ${res.status} from ${WP}`)
  const body = await res.json()

  // 🔴 A PARTIAL RESPONSE IS WORSE THAN NO RESPONSE — WPGraphQL can return HTTP 200
  // with a populated `errors` array and partial `data`. Infrastructure, not content —
  // stays fatal.
  if (body.errors?.length) fail(`GraphQL errors: ${JSON.stringify(body.errors)}`)

  const mine = (nodes: Node[]) =>
    nodes.filter((n) => (n.routeSites?.nodes ?? []).some((t) => t.slug === SITE))

  const nodes = mine(body?.data?.redirects?.nodes ?? [])
  const livePosts = new Set(
    mine(body?.data?.blogPosts?.nodes ?? []).map((n) => `/blog/${(n as unknown as { slug: string }).slug}`)
  )
  const liveStatic = new Set(staticRoutes(APP).map(norm))

  // ── Pass 1: per-redirect shape checks — an unusable key is SKIPPED, not failed ──
  const byFrom = new Map<string, Array<{ source: string; destination: string; modified: string; databaseId: number | null }>>()

  for (const n of nodes) {
    const ref = n.databaseId != null ? `wp-db-${n.databaseId}` : '(unknown)'
    const from = norm((n.cipheraFrom ?? '').trim())
    const to = norm((n.cipheraTo ?? '').trim())

    if (!from || !to) {
      repair(from || ref, 'from/to', 'skipped', `a published redirect is missing one half — from="${from}" to="${to}". It looks complete in wp-admin.`)
      console.log(`SKIP redirect ${from || ref}: missing from or to`)
      continue
    }
    if (!validPath(from)) {
      repair(from, 'from', 'skipped', `redirect source "${from}" is not a site-relative path`)
      console.log(`SKIP redirect ${from}: source is not a site-relative path`)
      continue
    }
    if (!validPath(to)) {
      repair(from, 'to', 'skipped', `redirect destination "${to}" is not a site-relative path`)
      console.log(`SKIP redirect ${from}: destination "${to}" is not a site-relative path`)
      continue
    }
    if (from === to) {
      repair(from, 'to', 'skipped', `redirect "${from}" points at itself`)
      console.log(`SKIP redirect ${from}: points at itself`)
      continue
    }

    // 🔴 TIER 1 WINS AND THIS SAYS SO OUT LOUD. THE ONE HARD FAILURE P1-a KEEPS.
    // Shadowed rules are worse than absent ones: the agency creates one, sees it
    // published, and it never fires — but a Tier-1 collision is not that case, it is a
    // cryptographic commitment at risk, so it stays load-bearing and refuses the build.
    if (TIER1_EXACT.includes(from) || TIER1_PREFIX.some((p) => from === p || from.startsWith(`${p}/`))) {
      fail(
        `redirect source "${from}" collides with a Tier-1 rule in next.config.ts.\n` +
          `   Tier 1 is permanent infrastructure — the /transparency rules are cited inside\n` +
          `   GPG-signed canaries — and it is spread FIRST, so this rule would never fire.\n` +
          `   Delete it in the CMS, or change Tier 1 deliberately in a PR.`
      )
    }

    // 🔑 P1-a REPAIR: a redirect over a real page used to fail the whole build. It is
    // SKIPPED instead — the real page keeps serving, which is what the agency actually
    // wants more often than not (a redirect created before a page was unpublished, or a
    // slug reused by mistake), and the drop surfaces in the CMS review queue.
    if (liveStatic.has(from)) {
      repair(from, 'from', 'skipped', `redirect source "${from}" is a LIVE page on this site — publishing it would hide that page`)
      console.log(`SKIP redirect ${from}: shadows a live page`)
      continue
    }
    if (livePosts.has(from)) {
      repair(from, 'from', 'skipped', `redirect source "${from}" is a LIVE blog post — publishing it would hide that post`)
      console.log(`SKIP redirect ${from}: shadows a live blog post`)
      continue
    }

    const list = byFrom.get(from) ?? []
    list.push({ source: from, destination: to, modified: n.modifiedGmt ?? '', databaseId: n.databaseId })
    byFrom.set(from, list)
  }

  // ── Duplicate `from`: keep the lowest WordPress databaseId, skip the rest (P1-a) ──
  const bySource = new Map<string, { source: string; destination: string; modified: string }>()
  for (const [from, group] of byFrom) {
    const sorted = [...group].sort((a, b) => (a.databaseId ?? Infinity) - (b.databaseId ?? Infinity))
    bySource.set(from, { source: sorted[0].source, destination: sorted[0].destination, modified: sorted[0].modified })
    for (const loser of sorted.slice(1)) {
      repair(
        from,
        'from',
        'skipped',
        `two published redirects both claim "${from}" (databaseId ${loser.databaseId ?? 'unknown'}) — ` +
          `one of them would silently never fire; kept the lowest databaseId (${sorted[0].databaseId ?? 'unknown'})`
      )
      console.log(`SKIP redirect ${from}: duplicate source, keeping the lowest databaseId`)
    }
  }

  // 🔑 P1-a REPAIR: a chain (A→B→C) leaks PageRank silently and used to fail the build.
  // It is flattened instead — A is repointed straight at the chain's final destination
  // — unless that would form an actual CYCLE (A→B→A), which has no final destination
  // to flatten to and is SKIPPED entirely (every member of the cycle).
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
      repair(
        source,
        'destination',
        'repaired',
        `chain: "${chain.join('" → "')}" → "${dest}" — repointed "${source}" straight at "${dest}"`
      )
      flattened.set(source, { ...entry, destination: dest })
    }
  }
  for (const source of cyclic) {
    repair(source, 'from', 'skipped', `redirect "${source}" is part of a CYCLE (it eventually points back to itself) — unusable, dropped`)
    console.log(`SKIP redirect ${source}: part of a redirect cycle`)
    flattened.delete(source)
  }

  // ⚠️ NO LONGER A BUILD GATE (P1-a) — see EXPECTED_REDIRECTS's comment above.
  if (flattened.size !== EXPECTED_REDIRECTS) {
    console.log(
      `⚠️  publishing ${flattened.size} ${SITE} redirects; ${EXPECTED_REDIRECTS} expected. ` +
        `WordpressRedirectsDropped watches this independently.`
    )
  }

  const sorted = [...flattened.values()].sort((a, b) => a.source.localeCompare(b.source))
  const watermark = sorted.reduce((m, r) => (r.modified > m ? r.modified : m), '')

  const file = `// Auto-generated from WordPress at build time — do not edit manually.
// Run: npm run generate:redirects
//
// 🔴 BUILD OUTPUT, NOT SOURCE. Editing this changes nothing — the next build
// overwrites it. To add or remove a redirect, use https://cms.ciphera.net → Redirects.
//
// ⚠️ COMMITTED AS AN EMPTY STUB so \`next.config.ts\` resolves on a fresh clone, the
// same convention as lib/blog-wp.gen.ts. A stub that reached production would put 18
// retired URLs back on 404 — which is why /sys/seo-state reports the count and the
// publish watcher compares it.

export const REDIRECT_COUNT = ${sorted.length}

/** The newest redirect modification this build consumed. Folded into the watermark. */
export const REDIRECT_WATERMARK = ${JSON.stringify(watermark)}

export const REDIRECTS: Array<{ source: string; destination: string; permanent: true }> = [
${sorted.map((r) => `  { source: ${JSON.stringify(r.source)}, destination: ${JSON.stringify(r.destination)}, permanent: true },`).join('\n')}
]
`

  fs.writeFileSync(OUT, file)
  recordContentRepairs([REPAIR_TYPE], repairs)
  console.log(`generate:redirects — wrote ${sorted.length} redirects to lib/redirects.gen.ts`)
  if (repairs.length > 0) console.log(`  ${repairs.length} content repair(s)/skip(s)/flag(s) — see lib/content-repairs.gen.ts`)
}

main()
