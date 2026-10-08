/**
 * generate-seo.ts — pull Level 1 SEO fields from WordPress at BUILD time.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §5, §6
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1 P1-a
 *
 * 🔴 CONTENT REACHES THIS SITE AT BUILD TIME, NOT AT REQUEST TIME, AND THAT IS THE
 * WHOLE ARCHITECTURE (D1). ciphera.net runs as 42 independent Magic Containers
 * instances, each with its own on-disk cache and no shared store, behind a 300s HTML
 * TTL — so ISR there would mean 42 unsynchronised canonical tags. Building the
 * content in means every region is byte-identical and a WordPress outage blocks
 * DEPLOYS, not SERVING.
 *
 * ⚠️ THE ENDPOINT IS CLUSTER-INTERNAL. This runs on a Woodpecker agent inside the
 * cluster, which is why WordPress needs no public read surface at all.
 *
 * 🔴 P1-a: NO CMS CONTENT STATE MAY FAIL THIS BUILD. An empty title/description ships
 * empty — `lib/seo.ts`'s `seoFor()` already merges WordPress over a page's hardcoded
 * fallback FIELD BY FIELD (`if (wp.title) …`), so an empty field there is exactly what
 * makes that route's existing in-code metadata apply, same as a route with no stub at
 * all. An OG image not on the CDN is dropped the same way. A duplicate path keeps the
 * lowest WordPress databaseId. What still fails this build is INFRASTRUCTURE, not
 * content: WordPress unreachable, a non-200 response, or a populated GraphQL `errors[]`.
 */
import fs from 'fs'
import path from 'path'
import { buildRouteSeo, type RouteSeoNode } from '../lib/cms/route-build'
import { recordContentRepairs } from '../lib/content-repair-log'
import type { ContentRepairEntry } from '../lib/content-repair-types'

const WP = process.env.WORDPRESS_GRAPHQL_URL ?? 'http://wordpress.apps.svc.cluster.local/graphql'
const SITE = 'ciphera-net'
const OUT = path.join(process.cwd(), 'lib', 'seo.gen.ts')

/**
 * ⚠️ NO LONGER A BUILD GATE (P1-a). This used to be an exact-equality fail() — a stub
 * silently unpublished, for ANY reason, failed the whole site. `WordpressSeoStubsDropped`
 * (Infra/Kubernetes/workloads/prometheus/rules/wordpress.yml) already alerts on the same
 * condition independently, and a missing stub's route falls back to its own in-code
 * metadata (lib/seo.ts's `seoFor()`) rather than losing its SEO fields silently — so a
 * drop is detectable AND harmless, which is what made the build-time refusal redundant.
 * Kept as a constant purely for this comment's own arithmetic; nothing compares against
 * it any more.
 */
const EXPECTED_ROUTES = 14

const QUERY = `{
  blogPosts(first: 200, where: { status: PUBLISH }) {
    nodes { modifiedGmt routeSites { nodes { slug } } }
  }
  routeStubs(first: 100, where: { status: PUBLISH }) {
    nodes {
      databaseId
      cipheraPath
      cipheraTitle
      cipheraDescription
      cipheraCanonical
      cipheraOgTitle
      cipheraOgDescription
      cipheraOgImage
      cipheraTwitterTitle
      cipheraTwitterDescription
      cipheraNoindex
      cipheraNofollow
      modifiedGmt
      routeSites { nodes { slug } }
    }
  }
}`

/**
 * 🔑 EVERY FIELD IS ONE WE OWN, read from post meta by our own mu-plugin — no SEO
 * plugin's schema appears here. That is deliberate: this query runs on every build of
 * ciphera.net, and a plugin upgrade must not be able to change its contract. It is
 * also what makes a future switch to Rank Math a re-seed plus a one-line map change
 * in ciphera-routes.php rather than a rewrite of this file.
 */
interface Node {
  /** WordPress's own row id — lower created first. The P1-a duplicate tie-break. */
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
  routeSites: { nodes: { slug: string }[] } | null
}

/** Still fatal: this is an INFRASTRUCTURE failure, not a CMS content state (P1-a). */
function fail(msg: string): never {
  console.error(`\n🔴 generate-seo: ${msg}\n`)
  process.exit(1)
}

const REPAIR_TYPE = 'route-seo'
const repairs: ContentRepairEntry[] = []
function repair(ref: string, field: string, action: ContentRepairEntry['action'], detail: string): void {
  repairs.push({ type: REPAIR_TYPE, ref, field, action, detail })
}

async function main() {
  const res = await fetch(WP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
  }).catch((e) => fail(`cannot reach WordPress at ${WP} — ${e.message}`))

  if (!res.ok) fail(`WordPress returned HTTP ${res.status} from ${WP}`)
  const body = await res.json()

  // 🔴 A PARTIAL RESPONSE IS WORSE THAN NO RESPONSE. WPGraphQL can return HTTP 200
  // with a populated `errors` array and partial `data`; shipping half the SEO is the
  // one outcome worse than not shipping. Infrastructure, not content — stays fatal.
  if (body.errors?.length) fail(`GraphQL errors: ${JSON.stringify(body.errors)}`)

  const allNodes: Node[] = body?.data?.routeStubs?.nodes ?? []

  // 🔴 SITE FIRST, then everything else. Pulse's stubs live in the same WordPress
  // (Phase 4), and a malformed one must fail Pulse's build — never this one. Validating
  // before filtering let one tenant's editing mistake block the other tenant's deploys.
  const nodes: RouteSeoNode[] = allNodes.filter((n) => (n.routeSites?.nodes?.map((t) => t.slug) ?? []).includes(SITE))

  // ── Shared with the publisher (lib/cms/route-build.ts): shape checks, the
  // duplicate-path dedupe and the per-field repairs are ONE function now (P1-a). ──
  const built = buildRouteSeo(nodes)
  for (const r of built.repairs) {
    repairs.push(r)
    console.log(`${r.action === 'skipped' ? 'SKIP' : r.action.toUpperCase()} route stub ${r.ref}: ${r.detail}`)
  }

  const seenCount = Object.keys(built.routes).length
  // ⚠️ NO LONGER A BUILD GATE (P1-a) — see EXPECTED_ROUTES's comment above.
  if (seenCount !== EXPECTED_ROUTES) {
    console.log(
      `⚠️  publishing ${seenCount} ${SITE} route stubs; ${EXPECTED_ROUTES} expected. ` +
        `A route with no stub renders its own in-code fallback metadata — WordpressSeoStubsDropped watches this.`
    )
  }

  const out = Object.fromEntries(Object.entries(built.routes).sort(([a], [b]) => a.localeCompare(b)))

  // Newest modification consumed by this build, ACROSS BOTH TYPES — see SEO_WATERMARK.
  const postNodes: { modifiedGmt: string | null; routeSites: { nodes: { slug: string }[] } | null }[] =
    body?.data?.blogPosts?.nodes ?? []
  const sitePosts = postNodes.filter((n) => (n.routeSites?.nodes ?? []).some((t) => t.slug === SITE))

  const watermark = [built.watermark, ...sitePosts.map((n) => n.modifiedGmt ?? '')]
    .filter(Boolean)
    .sort()
    .at(-1) ?? ''

  const banner = `// Auto-generated from WordPress at build time — do not edit manually.
// Run: npm run generate:seo   (source: ${WP})
//
// 🔴 THIS FILE IS BUILD OUTPUT, NOT SOURCE. Editing it changes nothing: the next
// build overwrites it from WordPress. To change a title or a meta description, edit
// the route's stub at https://cms.ciphera.net → Route SEO.
`

  fs.writeFileSync(
    OUT,
    `${banner}
import type { RouteSeo } from './seo'

export const SEO_ROUTE_COUNT = ${seenCount}

/**
 * 🔑 THE WATERMARK IS WHAT MAKES THE DEPLOY TRIGGER LEVEL-TRIGGERED (D9).
 * The newest \`modifiedGmt\` this build consumed, served at /sys/seo-state. The
 * wordpress-publish-watcher CronJob compares WordPress's current maximum against
 * this, so desired state and actual state are both QUERYABLE and it stores nothing.
 * That detects a missed deploy for ANY reason — a failed pipeline, a reverted commit,
 * an image rolled back by hand — not merely a publish a webhook happened to witness.
 */
export const SEO_WATERMARK = ${JSON.stringify(watermark)}

/**
 * 🔴 THE HALF A WATERMARK CANNOT EXPRESS. A maximum only moves forward, so a deletion
 * is invisible to it — the count is what makes an unpublish detectable at all.
 */
export const SEO_POST_COUNT = ${sitePosts.length}

export const routeSeo: Record<string, RouteSeo> = ${JSON.stringify(out, null, 2)}
`,
    'utf-8'
  )

  recordContentRepairs([REPAIR_TYPE], repairs)

  console.log(`Generated ${seenCount} route stubs → lib/seo.gen.ts`)
  for (const p of Object.keys(out).sort()) console.log(`  ${p}`)
  if (repairs.length > 0) console.log(`  ${repairs.length} content repair(s)/skip(s)/flag(s) — see lib/content-repairs.gen.ts`)
}

main()
