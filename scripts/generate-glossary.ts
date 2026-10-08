/**
 * generate-glossary.ts — the 53 definition pages, from WordPress.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §38 (D29), §38.7
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1 P1-a, §4.1.3/§4.1.3a
 *
 * 🔑 THE TRANSFORM LIVES IN lib/cms/glossary-build.ts NOW (WEB-26). This script is the
 * BUILD-TIME caller: fetch from WordPress, run the shared transform, run the two checks
 * that only make sense at build time (the live-site count and the repo-hardcoded-link
 * scan — both need things a publish-time pass does not have: a reachable public site
 * and a checked-out source tree), then write the seed file. `scripts/cms-publisher.ts`
 * is the PUBLISH-TIME caller of the same transform; the two must never disagree about
 * what a valid term is, which is the entire reason the transform moved out of here.
 *
 * 🔴 CONTENT REACHES THE SEED AT BUILD TIME; THE RUNTIME SEAM READS THE CDN (WEB-26).
 * `lib/glossary/index.ts` reads this file's output only as a fallback — when 'glossary'
 * is not in `CMS_RUNTIME_KINDS` (today: always, until Phase 5 flips the flag) or when
 * the CDN is unreachable. This script's own build-time behaviour is unchanged by that:
 * it still reads WordPress directly, never the CDN, because at build time the publish
 * loop may not have run yet.
 *
 * 🔴 P1-a: NO CMS CONTENT STATE MAY FAIL THIS BUILD. See lib/cms/glossary-build.ts for
 * the repair/skip/flag rules. What still fails this build is INFRASTRUCTURE, not
 * content: WordPress unreachable, a non-200 response, or a populated GraphQL `errors[]`.
 */
import fs from 'fs'
import path from 'path'
import { buildGlossary, GLOSSARY_REPAIR_TYPE, type WpGlossaryTerm } from '../lib/cms/glossary-build'
import { recordContentRepairs } from '../lib/content-repair-log'
import type { ContentRepairEntry } from '../lib/content-repair-types'

const WP = process.env.WORDPRESS_GRAPHQL_URL ?? 'http://wordpress.apps.svc.cluster.local/graphql'
const SITE = 'ciphera-net'
const LIVE_STATE = process.env.LIVE_SEO_STATE_URL ?? 'https://ciphera.net/sys/seo-state'
const OUT = path.join(process.cwd(), 'lib', 'glossary.gen.ts')

/**
 * ⚠️ NO LONGER A BUILD GATE (P1-a). This used to be a collapse-vs-this-constant fail()
 * — a hardcoded "expected" count, not a measurement of the live site (unlike
 * generate-blog-posts.ts's shrink guard, which compares against the LIVE site's own
 * /sys/seo-state report and stays a hard failure — see its own comment for why that
 * one is different and kept). `WordpressGlossaryTermsDropped` already alerts on a drop
 * independently. Kept as a constant purely for this comment's own arithmetic.
 */
const EXPECTED_TERMS = 53

/** Same type value the shared transform uses — kept as a local alias so this script's
 * own `recordContentRepairs` call reads exactly like the other three generate-*.ts
 * scripts', even though the constant itself is now owned by lib/cms/glossary-build.ts. */
const REPAIR_TYPE = GLOSSARY_REPAIR_TYPE

const QUERY = `{
  glossaryTerms(first: 200, where: { status: PUBLISH }) {
    nodes {
      databaseId
      slug title content modifiedGmt
      cipheraDefinition cipheraRelated cipheraSee
      cipheraTitle cipheraDescription cipheraCanonical
      cipheraNoindex cipheraNofollow
      glossaryCategories { nodes { name slug cipheraOrder } }
      routeSites { nodes { slug } }
    }
  }
}`

/** Still fatal: this is an INFRASTRUCTURE failure, not a CMS content state (P1-a). */
function fail(msg: string): never {
  console.error(`\n🔴 generate-glossary: ${msg}\n`)
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
  // 🔴 A PARTIAL RESPONSE IS WORSE THAN NO RESPONSE. WPGraphQL can return HTTP 200 with a
  // populated `errors` array and partial `data`. Infrastructure, not content — stays fatal.
  if (body.errors?.length) fail(`GraphQL errors: ${JSON.stringify(body.errors)}`)

  const allNodes: WpGlossaryTerm[] = body?.data?.glossaryTerms?.nodes ?? []
  // Pulse's terms (Phase 4) would live in the same WordPress.
  const nodes = allNodes.filter((n) => (n.routeSites?.nodes ?? []).some((t) => t.slug === SITE))

  const { terms, categories: ordered, repairs: transformRepairs, watermark, count } = buildGlossary(nodes)

  // ── /glossary/<slug> LINKS HARDCODED IN THE REPO that no longer resolve: FLAG, don't fail ──
  // 🔴 §27.5. app/trust/page.tsx links /glossary/opaque and /glossary/fadp; products/pulse
  // links /glossary/fadp; four more pages link others. They are STRING LITERALS — nothing
  // checks them, not TypeScript, not a test. 🔑 P1-a point 3: there is no field-level repair
  // for a CODE file linking to a term the CMS no longer publishes (rewriting a hardcoded
  // link is not a content repair), so this ships the glossary UNCHANGED and FLAGS it for
  // review instead of failing every unrelated term's build. 🔑 BUILD-TIME ONLY
  // (WEB-26): this walks the checked-out source tree, which a publish-time pass does not
  // have — scripts/cms-publisher.ts does not run this scan.
  const slugs = new Set(terms.map((t) => t.slug))
  const linked = new Map<string, string[]>()
  const roots = ['app', 'components', 'lib']
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) return e.name === 'node_modules' ? [] : walk(p)
      return /\.(ts|tsx|mjs)$/.test(e.name) ? [p] : []
    })
  const repoLinkRepairs: ContentRepairEntry[] = []
  for (const file of roots.filter((r) => fs.existsSync(r)).flatMap(walk)) {
    if (file.endsWith('glossary.gen.ts')) continue
    const src = fs.readFileSync(file, 'utf-8')
    for (const m of src.matchAll(/["'`]\/glossary\/([a-z0-9-]+)["'`]/g)) {
      if (!linked.has(m[1])) linked.set(m[1], [])
      linked.get(m[1])!.push(file)
    }
  }
  const broken = [...linked.entries()].filter(([slug]) => !slugs.has(slug))
  for (const [slug, files] of broken) {
    repoLinkRepairs.push({
      type: GLOSSARY_REPAIR_TYPE,
      ref: slug,
      field: 'repo-link',
      action: 'flagged',
      detail: `severity=high — these pages link to /glossary/${slug}, which is not published: ${[...new Set(files)].join(', ')}`,
    })
  }

  // ── The count, no longer a build gate (P1-a) — Prometheus watches the drop ──
  if (count < EXPECTED_TERMS) {
    const shortfall = EXPECTED_TERMS - count
    console.log(
      `⚠️  publishing ${count} terms; ${EXPECTED_TERMS} expected. ${shortfall} fewer.\n` +
        `   Shipping: unpublishing a term is ordinary editorial work and must not block an\n` +
        `   unrelated deploy. WordpressGlossaryTermsDropped is what watches this.`
    )
  }

  // ⚠️ A live check, not a fatal one: the live site being unreachable must not block the
  // deploy that fixes it. Same judgement as generate-blog-posts.ts.
  try {
    const live = await fetch(LIVE_STATE, { signal: AbortSignal.timeout(15_000) })
    if (live.ok) {
      const state = (await live.json()) as { glossary?: number }
      if (typeof state.glossary === 'number' && state.glossary > count) {
        console.log(`⚠️  the live site serves ${state.glossary} terms; this build has ${count}.`)
      }
    }
  } catch {
    /* ignore — see above */
  }

  fs.writeFileSync(
    OUT,
    `// Auto-generated from WordPress at build time — do not edit manually.
// Run: npm run generate:glossary
//
// 🔴 BUILD OUTPUT, NOT SOURCE. Git-ignored, because a committed copy is a second source
// of truth for what the CMS says and the stale one wins an argument nobody knew was
// happening. To change a term, edit it at https://cms.ciphera.net → Glossary.

import type { GlossaryTerm } from './glossary/types'

/** The four categories, in the order the site renders them (term meta, not alphabet). */
export const GLOSSARY_CATEGORY_NAMES: string[] = ${JSON.stringify(ordered, null, 2)}

/** 🔴 Read by /sys/seo-state so the publish watcher can see a DELETION, not just a change. */
export const GLOSSARY_COUNT = ${terms.length}

/** The newest modification this build consumed — joins the watcher's watermark pair. */
export const GLOSSARY_WATERMARK = ${JSON.stringify(watermark)}

export const generatedGlossaryTerms: GlossaryTerm[] = ${JSON.stringify(terms, null, 2)}
`,
    'utf-8'
  )

  const repairs = [...transformRepairs, ...repoLinkRepairs]
  recordContentRepairs([REPAIR_TYPE], repairs)

  console.log(`\n✅ ${terms.length} glossary terms → ${OUT}`)
  console.log(`   categories: ${ordered.join(' · ')}`)
  console.log(`   watermark:  ${watermark}`)
  console.log(`   repo links checked: ${linked.size} distinct slugs, ${broken.length} flagged\n`)
  if (repairs.length > 0) console.log(`   ${repairs.length} content repair(s)/skip(s)/flag(s) — see lib/content-repairs.gen.ts`)
}

main()
