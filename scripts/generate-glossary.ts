/**
 * generate-glossary.ts — the 53 definition pages, from WordPress.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §38 (D29), §38.7
 *
 * 🔴 CONTENT REACHES THIS SITE AT BUILD TIME, NOT AT REQUEST TIME (D1). Same
 * architecture as generate-seo.ts and generate-blog-posts.ts, same reason: ciphera.net
 * runs as 42 independent Magic Containers instances behind a 300s HTML TTL, so a
 * request-time read would mean 42 unsynchronised copies of the glossary.
 *
 * 🔴 FAIL LOUDLY, NEVER EMIT A PARTIAL. The glossary is 54 of the sitemap's 88 URLs —
 * 61% of the indexed site. A build that silently ships 40 of 53 would delete 13 indexed
 * pages with a green pipeline.
 *
 * 🔑 TWO PROJECTIONS OF ONE SOURCE, COMPUTED ONCE HERE. `html` is what the page renders;
 * `paragraphs` is plain text for llms-full.txt. They are derived from the same WordPress
 * body in this file, so they cannot disagree — which is exactly what two readers each
 * parsing the HTML their own way would eventually do.
 */
import fs from 'fs'
import path from 'path'
import { extractFaqs, textOf } from '../lib/blog-transform'
import { checkRecoveryCopy } from '../lib/recovery-copy-rules.mjs'

const WP = process.env.WORDPRESS_GRAPHQL_URL ?? 'http://wordpress.apps.svc.cluster.local/graphql'
const SITE = 'ciphera-net'
const LIVE_STATE = process.env.LIVE_SEO_STATE_URL ?? 'https://ciphera.net/sys/seo-state'
const OUT = path.join(process.cwd(), 'lib', 'glossary.gen.ts')

/**
 * 🔴 THREE-PART CHANGE, and this constant is one of the three (§23.4's standing rule).
 * This number, the `WordpressGlossaryTermsDropped` threshold, and the terms themselves
 * move in ONE commit — or the alert fires on a change that was correct.
 */
const EXPECTED_TERMS = 53

/** Google truncates around 155–160. The migration wrote every one of the 53 under this. */
const DESC_LIMIT = 160

const QUERY = `{
  glossaryTerms(first: 200, where: { status: PUBLISH }) {
    nodes {
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
  slug: string; title: string; content: string; modifiedGmt: string
  cipheraDefinition: string; cipheraRelated: string; cipheraSee: string
  cipheraTitle: string; cipheraDescription: string; cipheraCanonical: string
  cipheraNoindex: boolean; cipheraNofollow: boolean
  glossaryCategories: { nodes: { name: string; slug: string; cipheraOrder: number }[] }
  routeSites: { nodes: { slug: string }[] }
}

function fail(msg: string): never {
  console.error(`\n🔴 generate-glossary: ${msg}\n`)
  process.exit(1)
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
  // populated `errors` array and partial `data`.
  if (body.errors?.length) fail(`GraphQL errors: ${JSON.stringify(body.errors)}`)

  const nodes: WpTerm[] = body?.data?.glossaryTerms?.nodes ?? []
  const terms: Record<string, unknown>[] = []
  const categories = new Map<string, { name: string; order: number }>()
  const seen = new Set<string>()

  for (const n of nodes) {
    // Pulse's terms (Phase 4) would live in the same WordPress.
    if (!(n.routeSites?.nodes ?? []).some((t) => t.slug === SITE)) continue
    if (seen.has(n.slug)) fail(`duplicate published term for slug "${n.slug}"`)
    seen.add(n.slug)

    const cat = n.glossaryCategories?.nodes?.[0]
    if (!cat) fail(`${n.slug} has no category — it cannot be placed on /glossary.`)
    if (!categories.has(cat.slug)) categories.set(cat.slug, { name: cat.name, order: cat.cipheraOrder ?? 999 })

    const definition = (n.cipheraDefinition ?? '').trim()
    if (!definition) {
      fail(
        `${n.slug} has no Definition.\n` +
          `   It is the visible lede AND the schema.org DefinedTerm description.\n` +
          `   Fix it at https://cms.ciphera.net → Glossary.`
      )
    }

    // 🔴 NO FALLBACK FROM THE DEFINITION TO THE META DESCRIPTION, EVER.
    // They are separate fields precisely because only one of them wants ~155 characters.
    // A fallback would silently restore the defect this migration existed to fix — all 53
    // descriptions were 186–262 chars — on every term nobody had touched, and it would
    // look fixed.
    const description = (n.cipheraDescription ?? '').trim()
    if (!description) {
      fail(
        `${n.slug} has no SEO meta description.\n` +
          `   The Definition is NOT used as a fallback — it is written long on purpose.\n` +
          `   Write one under ${DESC_LIMIT} characters in the Yoast box.`
      )
    }
    if (description.length > DESC_LIMIT) {
      fail(`${n.slug}: meta description is ${description.length} chars, over ${DESC_LIMIT}. Google will cut it off.`)
    }

    const title = (n.cipheraTitle ?? '').trim()
    if (!title) fail(`${n.slug} has no SEO title. It is what Google shows; write the question out.`)

    const { html, faqs } = extractFaqs(n.content ?? '')
    if (!html.trim()) fail(`${n.slug} has an empty body.`)

    // 🔴 THE RECOVERY-COPY GUARD, run where the copy now lives (§27.5).
    // The glossary was never covered by the repository test either, so this closes a
    // hole rather than preserving one — and an external agency now writes these.
    const problems = checkRecoveryCopy(
      textOf(html) + ' ' + definition + ' ' + faqs.map((f) => `${f.question} ${f.answer}`).join(' '),
      n.slug
    )
    if (problems.length > 0) {
      fail(
        `${n.slug} makes a false or unqualified claim about account recovery:\n` +
          problems.map((x) => `   • ${x}`).join('\n') +
          `\n   Fix the copy at https://cms.ciphera.net → Glossary.`
      )
    }

    terms.push({
      slug: n.slug,
      term: n.title,
      category: cat.name,
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
    })
  }

  // ── Gate: every `related` slug resolves ───────────────────────────────────
  // 🔴 `getTerm` FILTERS UNKNOWNS OUT SILENTLY, so a broken reference renders as a
  // missing chip and nothing anywhere says so. Now that an agency can rename a slug,
  // that silence is the failure mode.
  const slugs = new Set(terms.map((t) => t.slug as string))
  const dangling: string[] = []
  for (const t of terms) {
    for (const r of t.related as string[]) if (!slugs.has(r)) dangling.push(`${t.slug} → ${r}`)
  }
  if (dangling.length) {
    fail(`related terms that do not resolve:\n${dangling.map((d) => `   • ${d}`).join('\n')}`)
  }

  // ── Gate: every /glossary/<slug> LINK IN THE REPOSITORY resolves ──────────
  // 🔴 §27.5 APPLIED BEFORE IT BITES. app/trust/page.tsx links /glossary/opaque and
  // /glossary/fadp; products/pulse links /glossary/fadp; four more pages link others.
  // They are STRING LITERALS — nothing checks them, not TypeScript, not a test. That was
  // harmless while changing a slug meant opening a PR. Now that the agency owns the 53,
  // renaming or unpublishing one silently 404s a link on the Trust page, which is the one
  // page whose whole job is being verifiable.
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
  if (broken.length) {
    fail(
      `these pages link to glossary terms that are not published:\n` +
        broken.map(([slug, files]) => `   • /glossary/${slug}  ←  ${[...new Set(files)].join(', ')}`).join('\n') +
        `\n   Either re-publish the term at https://cms.ciphera.net → Glossary, or fix the link.`
    )
  }

  // ── Gate: the count, and the shrink guard ─────────────────────────────────
  if (terms.length < EXPECTED_TERMS) {
    // 🔑 THE SHRINK GUARD'S SHAPE IS §30.3's, NOT A STRICTER ONE. v1 of the blog's guard
    // blocked on any decrease and deadlocked the publish watcher, which retries every 5
    // minutes and cannot set an env var. Unpublishing a term is ordinary editorial work.
    const shortfall = EXPECTED_TERMS - terms.length
    const collapse = shortfall > Math.max(2, Math.floor(EXPECTED_TERMS * 0.25))
    if (collapse && process.env.ALLOW_GLOSSARY_COUNT_DECREASE !== '1') {
      fail(
        `this build would publish ${terms.length} terms; ${EXPECTED_TERMS} are expected.\n` +
          `   That is ${shortfall} gone at once — too many to be ordinary editing, and the\n` +
          `   shape of a real loss: a restore that dropped rows, or terms that silently lost\n` +
          `   their site term and fell out of this filter.\n` +
          `   If it really was intended, rebuild with ALLOW_GLOSSARY_COUNT_DECREASE=1 and\n` +
          `   lower EXPECTED_TERMS **and** the WordpressGlossaryTermsDropped threshold in the\n` +
          `   same commit.`
      )
    }
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

  console.log(`\n✅ ${terms.length} glossary terms → ${OUT}`)
  console.log(`   categories: ${ordered.join(' · ')}`)
  console.log(`   watermark:  ${watermark}`)
  console.log(`   repo links checked: ${linked.size} distinct slugs, all resolve\n`)
}

main()
