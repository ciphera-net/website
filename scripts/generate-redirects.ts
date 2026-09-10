/**
 * generate-redirects.ts — Tier-2 content redirects, pulled from WordPress at BUILD time.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §6.4, §34
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
 */
import fs from 'fs'
import path from 'path'

const WP = process.env.WORDPRESS_GRAPHQL_URL ?? 'http://wordpress.apps.svc.cluster.local/graphql'
const SITE = 'ciphera-net'
const OUT = path.join(process.cwd(), 'lib', 'redirects.gen.ts')
const APP = path.join(process.cwd(), 'app')

/**
 * 🔴 THE EXPECTED COUNT IS A COMMITTED CONSTANT AND A BUILD GATE.
 * A redirect silently disappearing restores a 404 on a URL that still receives search
 * and backlink traffic — the exact failure the corpus purge's own note warns about
 * ("the Drop post leaked 17 visits/90d into a 404 after its redirect-less removal").
 * The build stays green and nobody finds out until a rankings report.
 *
 * ⚠️ THREE-PART CHANGE. This number, the `WordpressRedirectsDropped` threshold in
 * Infra/Kubernetes/workloads/prometheus/rules/wordpress.yml, and the redirects
 * themselves move IN ONE COMMIT — or the alert fires on a change that was correct.
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
  cipheraFrom: string | null
  cipheraTo: string | null
  modifiedGmt: string | null
  routeSites?: { nodes?: Array<{ slug: string }> }
}

function fail(msg: string): never {
  console.error(`\n✖ generate:redirects — ${msg}\n`)
  process.exit(1)
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

/** The same shape rule the CMS enforces, restated where it can be relied on. */
function validPath(p: string): boolean {
  if (!p.startsWith('/')) return false
  if (p.startsWith('//')) return false
  if (p.length > 200) return false
  if (/[\s<>"'\\]/.test(p)) return false
  if (p.includes('?') || p.includes('#')) return false
  return true
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
  // with a populated `errors` array and partial `data`.
  if (body.errors?.length) fail(`GraphQL errors: ${JSON.stringify(body.errors)}`)

  const mine = (nodes: Node[]) =>
    nodes.filter((n) => (n.routeSites?.nodes ?? []).some((t) => t.slug === SITE))

  const nodes = mine(body?.data?.redirects?.nodes ?? [])
  const livePosts = new Set(
    mine(body?.data?.blogPosts?.nodes ?? []).map((n) => `/blog/${(n as unknown as { slug: string }).slug}`)
  )
  const liveStatic = new Set(staticRoutes(APP).map(norm))

  const bySource = new Map<string, { source: string; destination: string; modified: string }>()

  for (const n of nodes) {
    const from = norm((n.cipheraFrom ?? '').trim())
    const to = norm((n.cipheraTo ?? '').trim())

    if (!from || !to) {
      fail(`a published redirect is missing one half — from="${from}" to="${to}". It looks complete in wp-admin.`)
    }
    if (!validPath(from)) fail(`redirect source "${from}" is not a site-relative path`)
    if (!validPath(to)) fail(`redirect destination "${to}" is not a site-relative path`)
    if (from === to) fail(`redirect "${from}" points at itself`)

    if (bySource.has(from)) fail(`two published redirects both claim "${from}" — one of them silently never fires`)

    // 🔴 TIER 1 WINS AND THIS SAYS SO OUT LOUD. Shadowed rules are worse than absent
    // ones: the agency creates one, sees it published, and it never fires.
    if (TIER1_EXACT.includes(from) || TIER1_PREFIX.some((p) => from === p || from.startsWith(`${p}/`))) {
      fail(
        `redirect source "${from}" collides with a Tier-1 rule in next.config.ts.\n` +
          `   Tier 1 is permanent infrastructure — the /transparency rules are cited inside\n` +
          `   GPG-signed canaries — and it is spread FIRST, so this rule would never fire.\n` +
          `   Delete it in the CMS, or change Tier 1 deliberately in a PR.`
      )
    }

    // A redirect over a real page takes that page off the site.
    if (liveStatic.has(from)) {
      fail(`redirect source "${from}" is a LIVE page on this site — publishing it would hide that page`)
    }
    if (livePosts.has(from)) {
      fail(`redirect source "${from}" is a LIVE blog post — publishing it would hide that post`)
    }

    bySource.set(from, { source: from, destination: to, modified: n.modifiedGmt ?? '' })
  }

  // 🔴 CHAINS LEAK PageRank SILENTLY and are the classic WordPress redirect-plugin
  // failure: A→B where B→C means every visitor and every crawler takes two hops, and
  // the second hop is invisible in the CMS because the two rows look unrelated.
  for (const { source, destination } of bySource.values()) {
    if (bySource.has(destination)) {
      fail(
        `redirect chain: "${source}" → "${destination}" → "${bySource.get(destination)!.destination}".\n` +
          `   Point "${source}" at the final destination instead.`
      )
    }
  }

  if (bySource.size !== EXPECTED_REDIRECTS) {
    fail(
      `expected ${EXPECTED_REDIRECTS} ${SITE} redirects, found ${bySource.size}.\n` +
        `   Found: ${[...bySource.keys()].sort().join(', ')}\n` +
        `   A redirect was deleted, unpublished or trashed — that URL would go back to\n` +
        `   returning 404 while it is still receiving search and backlink traffic. If the\n` +
        `   change was intended, update EXPECTED_REDIRECTS **and** the\n` +
        `   WordpressRedirectsDropped threshold in the same commit.`
    )
  }

  const sorted = [...bySource.values()].sort((a, b) => a.source.localeCompare(b.source))
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
  console.log(`generate:redirects — wrote ${sorted.length} redirects to lib/redirects.gen.ts`)
}

main()
