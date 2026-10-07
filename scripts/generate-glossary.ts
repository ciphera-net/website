/**
 * generate-glossary.ts — the 53 definition pages, from WordPress.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §38 (D29), §38.7
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1 P1-a
 *
 * 🔴 CONTENT REACHES THIS SITE AT BUILD TIME, NOT AT REQUEST TIME (D1). Same
 * architecture as generate-seo.ts and generate-blog-posts.ts, same reason: ciphera.net
 * runs as 42 independent Magic Containers instances behind a 300s HTML TTL, so a
 * request-time read would mean 42 unsynchronised copies of the glossary.
 *
 * 🔴 P1-a: NO CMS CONTENT STATE MAY FAIL THIS BUILD. A term missing its Definition or
 * SEO description is REPAIRED from its own body text; a missing SEO title falls back
 * to the term name; a description over 160 chars is cut at a word boundary; a dangling
 * `related` slug is dropped from that one term. A term with no category or no title at
 * all is SKIPPED (no safe repair exists — see scripts/generate-blog-posts.ts for the
 * same shape of rule). An honesty-rule violation, or a repo-hardcoded link to a term
 * that is no longer published, ships UNCHANGED and is FLAGGED for the owner's review.
 * What still fails this build is INFRASTRUCTURE, not content: WordPress unreachable, a
 * non-200 response, or a populated GraphQL `errors[]`.
 *
 * 🔑 TWO PROJECTIONS OF ONE SOURCE, COMPUTED ONCE HERE. `html` is what the page renders;
 * `paragraphs` is plain text for llms-full.txt. They are derived from the same WordPress
 * body in this file, so they cannot disagree — which is exactly what two readers each
 * parsing the HTML their own way would eventually do.
 */
import fs from 'fs'
import path from 'path'
import { extractFaqs, textOf, truncateAtWordBoundary } from '../lib/blog-transform'
import { checkRecoveryCopy } from '../lib/recovery-copy-rules.mjs'
import { normalizeGlossaryCategory, KNOWN_GLOSSARY_CATEGORIES } from '../lib/glossary-category-rules.mjs'
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

/** Google truncates around 155–160. The migration wrote every one of the 53 under this. */
const DESC_LIMIT = 160

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

interface WpTerm {
  databaseId: number | null
  slug: string; title: string; content: string; modifiedGmt: string
  cipheraDefinition: string; cipheraRelated: string; cipheraSee: string
  cipheraTitle: string; cipheraDescription: string; cipheraCanonical: string
  cipheraNoindex: boolean; cipheraNofollow: boolean
  glossaryCategories: { nodes: { name: string; slug: string; cipheraOrder: number }[] }
  routeSites: { nodes: { slug: string }[] }
}

/** Still fatal: this is an INFRASTRUCTURE failure, not a CMS content state (P1-a). */
function fail(msg: string): never {
  console.error(`\n🔴 generate-glossary: ${msg}\n`)
  process.exit(1)
}

const REPAIR_TYPE = 'glossary-term'
const repairs: ContentRepairEntry[] = []
function repair(ref: string, field: string, action: ContentRepairEntry['action'], detail: string): void {
  repairs.push({ type: REPAIR_TYPE, ref, field, action, detail })
}

/**
 * Plain-text paragraphs, for llms-full.txt only.
 * ⚠️ Split on the closing tag BEFORE stripping tags — stripping first would join every
 * paragraph into one run-on line, which reads fine in a diff and is wrong in the file.
 */
function paragraphsOf(html: string): string[] {
  return html
    .split(/<\/p>/i)
    .map((chunk) => textOf(chunk).trim())
    .filter(Boolean)
}

/** "Label|href" per line → the shape the page renders. */
function parseSee(raw: string): { label: string; href: string }[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf('|')
      if (i < 1) return null
      return { label: line.slice(0, i).trim(), href: line.slice(i + 1).trim() }
    })
    .filter((x): x is { label: string; href: string } => x !== null && x.href !== '')
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

  const allNodes: WpTerm[] = body?.data?.glossaryTerms?.nodes ?? []
  // Pulse's terms (Phase 4) would live in the same WordPress.
  const nodes = allNodes.filter((n) => (n.routeSites?.nodes ?? []).some((t) => t.slug === SITE))

  // ── Pass 1: per-term checks — unusable keys are SKIPPED, everything else REPAIRED ──
  type Built = { n: WpTerm; term: Record<string, unknown> }
  const built: Built[] = []
  const categories = new Map<string, { name: string; order: number }>()

  for (const n of nodes) {
    const ref = (n.slug ?? '').trim() || (n.databaseId != null ? `wp-db-${n.databaseId}` : '(unknown)')

    const cat = n.glossaryCategories?.nodes?.[0]
    if (!cat) {
      // No safe repair: the category IS the glossary's placement — "an unusable Kind"
      // (P1-a point 2), same bucket as a missing slug or title.
      repair(ref, 'category', 'skipped', `${ref} has no category — it cannot be placed on /glossary.`)
      console.log(`SKIP glossary term ${ref}: no category`)
      continue
    }

    // 🔑 P1-a REPAIR/FLAG: `GlossaryCategory` is a free-text WordPress taxonomy value
    // now (lib/glossary/types.ts), not a closed set this codebase enforces. A near-match
    // of one of the four known categories (a typo, stray whitespace, "&" vs "and") is
    // REPAIRED to that category's exact string; anything else ships as given and is
    // FLAGGED — there is no field-level repair that can guess which heading an unknown
    // category belongs under, and bucketing it under the wrong one would misplace the
    // term silently, which is worse than shipping its own name under review.
    const normalizedCategory = normalizeGlossaryCategory(cat.name)
    if (!normalizedCategory.matched) {
      repair(
        ref,
        'category',
        'flagged',
        `${ref}: category "${cat.name}" does not match any of the site's known glossary ` +
          `categories (${KNOWN_GLOSSARY_CATEGORIES.join(', ')}) — shipped as given, needs review`
      )
    } else if (normalizedCategory.changed) {
      repair(ref, 'category', 'repaired', `${ref}: category "${cat.name}" normalized to "${normalizedCategory.name}"`)
    }

    const termName = (n.title ?? '').trim()
    const seoTitle = (n.cipheraTitle ?? '').trim()
    if (!termName && !seoTitle) {
      repair(ref, 'title', 'skipped', `${ref} has no title at all — neither a term name nor an SEO title.`)
      console.log(`SKIP glossary term ${ref}: no title`)
      continue
    }
    // 🔑 P1-a REPAIR: a missing SEO title falls back to the term's own display name.
    let title = seoTitle
    if (!title) {
      title = termName
      repair(ref, 'title', 'repaired', `${ref} has no SEO title — repaired to the term name "${termName}"`)
    }

    const { html, faqs } = extractFaqs(n.content ?? '')
    if (!html.trim()) {
      repair(ref, 'body', 'skipped', `${ref} has an empty body.`)
      console.log(`SKIP glossary term ${ref}: empty body`)
      continue
    }
    const bodyText = textOf(html)

    // 🔑 P1-a REPAIR: no Definition used to fail the build outright. The first ~155
    // chars of the term's own body is the same safe substitute generate-blog-posts.ts
    // uses for a missing meta description — never a fallback from description (the
    // field below), which stays forbidden (see its own comment).
    let definition = (n.cipheraDefinition ?? '').trim()
    if (!definition) {
      definition = truncateAtWordBoundary(bodyText, 155)
      repair(ref, 'definition', 'repaired', `${ref} has no Definition — repaired from the first ~155 chars of the body`)
    }

    // 🔴 NO FALLBACK FROM THE DEFINITION TO THE META DESCRIPTION, EVER.
    // They are separate fields precisely because only one of them wants ~155 characters.
    // A fallback would silently restore the defect this migration existed to fix — all 53
    // descriptions were 186–262 chars — on every term nobody had touched, and it would
    // look fixed. 🔑 P1-a REPAIR: a missing description (and one over DESC_LIMIT) no
    // longer fails the build — both resolve through the SAME word-boundary cut, from the
    // body text (not from the Definition, for the same reason a description→definition
    // fallback is forbidden above).
    let description = (n.cipheraDescription ?? '').trim()
    if (!description) {
      description = truncateAtWordBoundary(bodyText, 155)
      repair(ref, 'description', 'repaired', `${ref} has no SEO meta description — repaired from the first ~155 chars of the body`)
    } else if (description.length > DESC_LIMIT) {
      const cut = truncateAtWordBoundary(description, 157)
      repair(ref, 'description', 'repaired', `${ref}: meta description was ${description.length} chars, over ${DESC_LIMIT} — cut to "${cut}"`)
      description = cut
    }

    if (!categories.has(cat.slug)) categories.set(cat.slug, { name: normalizedCategory.name, order: cat.cipheraOrder ?? 999 })

    // 🔴 THE RECOVERY-COPY GUARD, run where the copy now lives (§27.5).
    // 🔑 P1-a point 3: an honesty-rule violation ships UNCHANGED and is FLAGGED
    // (severity high) — the CMS-side review queue and the owner's review own this now.
    const copyProblems = checkRecoveryCopy(
      bodyText + ' ' + definition + ' ' + faqs.map((f) => `${f.question} ${f.answer}`).join(' '),
      ref
    )
    if (copyProblems.length > 0) {
      repair(
        ref,
        'recovery-copy',
        'flagged',
        `severity=high — makes a false or unqualified claim about account recovery (shipped unchanged): ` +
          copyProblems.join('; ')
      )
    }

    built.push({
      n,
      term: {
        slug: n.slug,
        term: n.title,
        category: normalizedCategory.name,
        categorySlug: cat.slug,
        short: definition,
        html,
        paragraphs: paragraphsOf(html),
        faq: faqs.map((f) => ({ q: f.question, a: f.answer })),
        related: (n.cipheraRelated ?? '').split('\n').map((s) => s.trim()).filter(Boolean),
        see: parseSee(n.cipheraSee ?? ''),
        seoTitle: title,
        seoDescription: description,
        canonical: (n.cipheraCanonical ?? '').trim() || `https://ciphera.net/glossary/${n.slug}`,
        noindex: Boolean(n.cipheraNoindex),
        nofollow: Boolean(n.cipheraNofollow),
        modified: n.modifiedGmt,
      },
    })
  }

  // ── Duplicate slug: keep the lowest WordPress databaseId, skip the rest (P1-a) ──
  const bySlug = new Map<string, Built[]>()
  for (const b of built) {
    const list = bySlug.get(b.n.slug) ?? []
    list.push(b)
    bySlug.set(b.n.slug, list)
  }
  const terms: Record<string, unknown>[] = []
  for (const [slug, group] of bySlug) {
    const sorted = [...group].sort((a, b) => (a.n.databaseId ?? Infinity) - (b.n.databaseId ?? Infinity))
    terms.push(sorted[0].term)
    for (const loser of sorted.slice(1)) {
      repair(
        slug,
        'slug',
        'skipped',
        `duplicate published term for slug "${slug}" (databaseId ${loser.n.databaseId ?? 'unknown'}) — ` +
          `kept the lowest databaseId (${sorted[0].n.databaseId ?? 'unknown'})`
      )
      console.log(`SKIP glossary term ${slug}: duplicate published term, keeping the lowest databaseId`)
    }
  }

  // ── Gate → repair: every `related` slug resolves; a dangling one is DROPPED, not a build failure ──
  // 🔴 `getTerm` FILTERS UNKNOWNS OUT SILENTLY, so a broken reference renders as a
  // missing chip and nothing anywhere says so. 🔑 P1-a REPAIR: dropping the one dangling
  // slug here (recorded) is strictly more honest than that silent render, and no longer
  // fails every unrelated term's build alongside it.
  const slugs = new Set(terms.map((t) => t.slug as string))
  for (const t of terms) {
    const related = t.related as string[]
    const kept = related.filter((r) => slugs.has(r))
    if (kept.length !== related.length) {
      for (const dangling of related.filter((r) => !slugs.has(r))) {
        repair(t.slug as string, 'related', 'repaired', `related term "${dangling}" does not resolve — dropped from this term's related list`)
      }
      t.related = kept
    }
  }

  // ── /glossary/<slug> LINKS HARDCODED IN THE REPO that no longer resolve: FLAG, don't fail ──
  // 🔴 §27.5. app/trust/page.tsx links /glossary/opaque and /glossary/fadp; products/pulse
  // links /glossary/fadp; four more pages link others. They are STRING LITERALS — nothing
  // checks them, not TypeScript, not a test. 🔑 P1-a point 3: there is no field-level repair
  // for a CODE file linking to a term the CMS no longer publishes (rewriting a hardcoded
  // link is not a content repair), so this ships the glossary UNCHANGED and FLAGS it for
  // the owner's review instead of failing every unrelated term's build.
  const linked = new Map<string, string[]>()
  const roots = ['app', 'components', 'lib']
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) return e.name === 'node_modules' ? [] : walk(p)
      return /\.(ts|tsx|mjs)$/.test(e.name) ? [p] : []
    })
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
    repair(
      slug,
      'repo-link',
      'flagged',
      `severity=high — these pages link to /glossary/${slug}, which is not published: ${[...new Set(files)].join(', ')}`
    )
  }

  // ── The count, no longer a build gate (P1-a) — Prometheus watches the drop ──
  if (terms.length < EXPECTED_TERMS) {
    const shortfall = EXPECTED_TERMS - terms.length
    console.log(
      `⚠️  publishing ${terms.length} terms; ${EXPECTED_TERMS} expected. ${shortfall} fewer.\n` +
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
      if (typeof state.glossary === 'number' && state.glossary > terms.length) {
        console.log(`⚠️  the live site serves ${state.glossary} terms; this build has ${terms.length}.`)
      }
    }
  } catch {
    /* ignore — see above */
  }

  // 🔴 CATEGORY ORDER IS DATA, NOT ALPHABET. `GLOSSARY_CATEGORIES` carried the comment
  // "mirrors the site's product story"; a taxonomy has no inherent order, so the order
  // rides on term meta and is resolved here.
  const ordered = [...categories.entries()]
    .sort((a, b) => a[1].order - b[1].order || a[1].name.localeCompare(b[1].name))
    .map(([, v]) => v.name)

  // A stable, meaningful sort — the same reason generate-blog-posts.ts sorts by slug.
  terms.sort((a, b) => (a.term as string).localeCompare(b.term as string))

  const watermark = terms.map((t) => t.modified as string).filter(Boolean).sort().at(-1) ?? ''

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

  recordContentRepairs([REPAIR_TYPE], repairs)

  console.log(`\n✅ ${terms.length} glossary terms → ${OUT}`)
  console.log(`   categories: ${ordered.join(' · ')}`)
  console.log(`   watermark:  ${watermark}`)
  console.log(`   repo links checked: ${linked.size} distinct slugs, ${broken.length} flagged\n`)
  if (repairs.length > 0) console.log(`   ${repairs.length} content repair(s)/skip(s)/flag(s) — see lib/content-repairs.gen.ts`)
}

main()
