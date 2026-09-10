/**
 * generate-seo.ts — pull Level 1 SEO fields from WordPress at BUILD time.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §5, §6
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
 */
import fs from 'fs'
import path from 'path'

const WP = process.env.WORDPRESS_GRAPHQL_URL ?? 'http://wordpress.apps.svc.cluster.local/graphql'
const SITE = 'ciphera-net'
const OUT = path.join(process.cwd(), 'lib', 'seo.gen.ts')

/**
 * 🔴 THE EXPECTED COUNT IS A COMMITTED CONSTANT AND A BUILD GATE.
 * A stub silently disappearing is the failure this whole feature can suffer without
 * anyone noticing: the route falls back to its hardcoded metadata, the build stays
 * green, and a page the agency believes they control quietly reverts.
 *
 * ⚠️ THREE-PART CHANGE. This number, the `WordpressSeoStubsDropped` alert threshold
 * in Infra/Kubernetes/workloads/prometheus/rules/wordpress.yml, and the routes
 * themselves move IN ONE COMMIT — or the alert fires on a change that was correct.
 *
 * 14, not 23: of the site's 23 routes, 5 are Level 0 by decision (/trust,
 * /trust/canary, /trust/report, /privacy, /terms — design §2), 3 are dynamic and take
 * their metadata from content, and /sys/ping is internal.
 */
const EXPECTED_ROUTES = 14

const QUERY = `{
  routeStubs(first: 100, where: { status: PUBLISH }) {
    nodes {
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

function fail(msg: string): never {
  console.error(`\n🔴 generate-seo: ${msg}\n`)
  process.exit(1)
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
  // one outcome worse than not shipping.
  if (body.errors?.length) fail(`GraphQL errors: ${JSON.stringify(body.errors)}`)

  const nodes: Node[] = body?.data?.routeStubs?.nodes ?? []
  const seen = new Map<string, Node>()

  for (const n of nodes) {
    const p = (n.cipheraPath ?? '').trim()
    if (!p) fail('a published stub has an empty path — it can never match a route, and looks correct in wp-admin')
    if (!p.startsWith('/')) fail(`path "${p}" does not start with "/"`)

    const sites = n.routeSites?.nodes?.map((t) => t.slug) ?? []
    if (!sites.includes(SITE)) continue // Pulse's stubs (Phase 4) live in the same WordPress

    // The application-level guard in the mu-plugin catches the common case; this is
    // the guarantee. A duplicate must not be able to ship whatever put it there —
    // an import, a revision restore, a direct SQL write.
    if (seen.has(p)) fail(`duplicate stub for ${p} — two stubs for one route`)
    seen.set(p, n)
  }

  if (seen.size !== EXPECTED_ROUTES) {
    fail(
      `expected ${EXPECTED_ROUTES} ${SITE} stubs, found ${seen.size}.\n` +
        `   Found: ${[...seen.keys()].sort().join(', ')}\n` +
        `   A stub was deleted, unpublished or trashed — the affected route would\n` +
        `   silently fall back to its hardcoded metadata. If the change was intended,\n` +
        `   update EXPECTED_ROUTES **and** the WordpressSeoStubsDropped threshold in\n` +
        `   the same commit.`
    )
  }

  const out: Record<string, unknown> = {}
  for (const [p, n] of [...seen.entries()].sort()) {
    const ogImage = (n.cipheraOgImage ?? '').trim()

    // 🔴 THE CDN RULE IS A BUILD GATE, NOT A CONVENTION. Images live on
    // cdn.ciphera.net; the WordPress media library must never become a second,
    // unbacked image host (design §6.1, §8.3).
    if (ogImage && !ogImage.startsWith('https://cdn.ciphera.net/')) {
      fail(`${p}: OG image is not on cdn.ciphera.net — got "${ogImage}"`)
    }

    // A stub with a title but no description, or vice versa, is a half-filled entry
    // that looks complete in wp-admin. Both are load-bearing in a SERP.
    if (!(n.cipheraTitle ?? '').trim()) fail(`${p}: stub has no title`)
    if (!(n.cipheraDescription ?? '').trim()) fail(`${p}: stub has no meta description`)

    out[p] = {
      title: n.cipheraTitle ?? '',
      description: n.cipheraDescription ?? '',
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

  // Newest stub modification consumed by this build — see SEO_WATERMARK above.
  const watermark = [...seen.values()]
    .map((n) => n.modifiedGmt ?? '')
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

export const SEO_ROUTE_COUNT = ${seen.size}

/**
 * 🔑 THE WATERMARK IS WHAT MAKES THE DEPLOY TRIGGER LEVEL-TRIGGERED (D9).
 * The newest \`modifiedGmt\` this build consumed, served at /sys/seo-state. The
 * wordpress-publish-watcher CronJob compares WordPress's current maximum against
 * this, so desired state and actual state are both QUERYABLE and it stores nothing.
 * That detects a missed deploy for ANY reason — a failed pipeline, a reverted commit,
 * an image rolled back by hand — not merely a publish a webhook happened to witness.
 */
export const SEO_WATERMARK = ${JSON.stringify(watermark)}

export const routeSeo: Record<string, RouteSeo> = ${JSON.stringify(out, null, 2)}
`,
    'utf-8'
  )

  console.log(`Generated ${seen.size} route stubs → lib/seo.gen.ts`)
  for (const p of [...seen.keys()].sort()) console.log(`  ${p}`)
}

main()
