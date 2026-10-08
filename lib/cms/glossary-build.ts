/**
 * The glossary transform, extracted pure (WEB-26).
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1.3, §4.1.3a
 *
 * 🔑 ONE TRANSFORM, TWO CALLERS, SAME SHAPE OF REASON AS lib/blog-transform.ts.
 * `scripts/generate-glossary.ts` calls this at build time to produce the seed
 * (`lib/glossary.gen.ts`); `scripts/cms-publisher.ts` calls it at publish time to
 * produce the CDN documents. Neither reads WordPress, walks the filesystem, or writes
 * anything — this file takes nodes already fetched over GraphQL and returns data. The
 * two things that stay OUTSIDE this module on purpose (per the design): the routeSites
 * site filter (the caller decides which site's nodes it is building for) and the
 * repo-hardcoded-/glossary/<slug>-link scan (it walks the live source tree, which only
 * exists at build time — a publish-time pass has no source tree to walk).
 *
 * 🔴 KEEP THIS FUNCTION'S OUTPUT DETERMINISTIC IN THE SAME NODE ORDER EVERY TIME.
 * `scripts/generate-glossary.ts`'s byte-identical-output proof depends on it: the same
 * GraphQL response must always produce the same `lib/glossary.gen.ts` bytes.
 */
import { extractFaqs, textOf, truncateAtWordBoundary } from '../blog-transform'
import { checkRecoveryCopy } from '../recovery-copy-rules.mjs'
import { normalizeGlossaryCategory, KNOWN_GLOSSARY_CATEGORIES } from '../glossary-category-rules.mjs'
import type { ContentRepairEntry } from '../content-repair-types'
import type { GlossaryTerm } from '../glossary/types'

export const GLOSSARY_REPAIR_TYPE = 'glossary-term'

/** Google truncates around 155–160. The migration wrote every one of the 53 under this. */
const DESC_LIMIT = 160

export interface WpGlossaryTerm {
  databaseId: number | null
  slug: string
  title: string
  content: string
  modifiedGmt: string
  cipheraDefinition: string
  cipheraRelated: string
  cipheraSee: string
  cipheraTitle: string
  cipheraDescription: string
  cipheraCanonical: string
  cipheraNoindex: boolean
  cipheraNofollow: boolean
  glossaryCategories: { nodes: { name: string; slug: string; cipheraOrder: number }[] }
  routeSites?: { nodes: { slug: string }[] }
}

export interface GlossaryBuildResult {
  terms: GlossaryTerm[]
  categories: string[]
  repairs: ContentRepairEntry[]
  watermark: string
  count: number
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

/**
 * The P1-a transform: published WordPress glossary-term nodes (already filtered to the
 * caller's site) → the terms this site renders, the categories in their display order,
 * every repair/skip/flag recorded along the way, and the watermark (max `modifiedGmt`)
 * the caller folds into its own.
 */
export function buildGlossary(nodes: WpGlossaryTerm[]): GlossaryBuildResult {
  const repairs: ContentRepairEntry[] = []
  const repair = (ref: string, field: string, action: ContentRepairEntry['action'], detail: string): void => {
    repairs.push({ type: GLOSSARY_REPAIR_TYPE, ref, field, action, detail })
  }

  // ── Pass 1: per-term checks — unusable keys are SKIPPED, everything else REPAIRED ──
  type Built = { n: WpGlossaryTerm; term: GlossaryTerm }
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

    let definition = (n.cipheraDefinition ?? '').trim()
    if (!definition) {
      definition = truncateAtWordBoundary(bodyText, 155)
      repair(ref, 'definition', 'repaired', `${ref} has no Definition — repaired from the first ~155 chars of the body`)
    }

    // 🔴 NO FALLBACK FROM THE DEFINITION TO THE META DESCRIPTION, EVER — see
    // scripts/generate-glossary.ts's own comment for why the two must stay independent.
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
  const terms: GlossaryTerm[] = []
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

  // ── Gate → repair: every `related` slug resolves; a dangling one is DROPPED ──
  const slugs = new Set(terms.map((t) => t.slug))
  for (const t of terms) {
    const kept = t.related.filter((r) => slugs.has(r))
    if (kept.length !== t.related.length) {
      for (const dangling of t.related.filter((r) => !slugs.has(r))) {
        repair(t.slug, 'related', 'repaired', `related term "${dangling}" does not resolve — dropped from this term's related list`)
      }
      t.related = kept
    }
  }

  // 🔴 CATEGORY ORDER IS DATA, NOT ALPHABET — resolved from each category's term meta.
  const ordered = [...categories.entries()]
    .sort((a, b) => a[1].order - b[1].order || a[1].name.localeCompare(b[1].name))
    .map(([, v]) => v.name)

  // A stable, meaningful sort — the same reason generate-blog-posts.ts sorts by slug.
  terms.sort((a, b) => a.term.localeCompare(b.term))

  const watermark = terms.map((t) => t.modified).filter(Boolean).sort().at(-1) ?? ''

  return { terms, categories: ordered, repairs, watermark, count: terms.length }
}
