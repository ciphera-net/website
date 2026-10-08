/**
 * The glossary's read seam.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §38 (D29)
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1.3, §4.1.3a (WEB-26)
 *
 * 🔴 EVERY ACCESSOR IS ASYNC NOW (WEB-26). When 'glossary' is not in
 * `CMS_RUNTIME_KINDS` (today: always, until Phase 5 flips it on), this resolves
 * synchronously-fast from the build-time seed — the site's behaviour is unchanged. Once
 * a site turns the kind on, this reads the content CDN at request time instead: the
 * index (in-memory, 15s), then each term's own content-addressed document (in-memory,
 * forever), falling back ITEM BY ITEM to the seed on any failure, an unreachable CDN, or
 * an index `schema` this build does not know how to read. `app/glossary/page.tsx` and
 * `app/glossary/[slug]/page.tsx` are the only readers that matter for behaviour;
 * `scripts/generate-llms.ts` reads the SEED directly (`../glossary.gen`), never this
 * seam, because it is a build-time-only CLI script with no request to serve.
 *
 * 🔴 THE TERMS ARE BUILD OUTPUT, EITHER WAY. `lib/glossary.gen.ts` (the seed) is
 * written by `scripts/generate-glossary.ts` from WordPress and is git-ignored; the CDN
 * documents are written by `scripts/cms-publisher.ts` from the same WordPress, through
 * the same shared transform (`lib/cms/glossary-build.ts`). To change a definition, edit
 * it at https://cms.ciphera.net → Glossary — never either generated file.
 */
import type { GlossaryCategory, GlossaryTerm } from './types'
import {
  generatedGlossaryTerms as SEED_TERMS,
  GLOSSARY_CATEGORY_NAMES as SEED_CATEGORY_NAMES,
  GLOSSARY_WATERMARK as SEED_WATERMARK,
} from '../glossary.gen'
import { getContentDocument, getContentIndex } from '../cms/content-client'
import { isRuntimeKind, SITE_KEY } from '../cms/runtime-config'

export type { GlossaryCategory, GlossaryTerm } from './types'

const KIND = 'glossary'
/** The only item shape this build knows how to read — bumped by the publisher side
 * whenever `GlossaryTerm`'s shape changes incompatibly (§4.1.3a "Index (schema 1)"). */
const KNOWN_SCHEMA = 1

export type GlossarySource = 'cdn' | 'seed'

export interface GlossaryRuntimeState {
  /** Whether 'glossary' is in CMS_RUNTIME_KINDS on this instance at all. */
  enabled: boolean
  /** What THIS resolution actually served — distinct from `enabled`, because an
   * enabled kind still falls back to the seed on an unreachable CDN or an unknown
   * schema (§4.1.3a; and see the ciphera-website discovery report §7 item 6 on why
   * this must be visible rather than reading identically to "the term doesn't exist"). */
  source: GlossarySource
  indexWatermark?: string
  publishedAt?: string
}

let lastState: GlossaryRuntimeState = { enabled: isRuntimeKind(KIND), source: 'seed' }

/** `/sys/seo-state`'s runtime block reads this — forces a fresh resolution first, so it
 * never reports a state from a page render that happened minutes ago. */
export async function getGlossaryRuntimeState(): Promise<GlossaryRuntimeState> {
  await resolveTerms()
  return lastState
}

async function resolveTerms(): Promise<GlossaryTerm[]> {
  if (!isRuntimeKind(KIND)) {
    lastState = { enabled: false, source: 'seed' }
    return SEED_TERMS
  }

  try {
    const index = await getContentIndex(SITE_KEY)
    const kind = index?.kinds?.[KIND]
    if (!index || !kind || kind.schema !== KNOWN_SCHEMA) {
      // No index yet, no glossary kind in it, or a schema bump this build predates —
      // every one of these is "cannot trust the CDN for this kind right now", not
      // "the glossary is empty". Fall back wholesale, same as an unreachable CDN below.
      lastState = { enabled: true, source: 'seed' }
      return SEED_TERMS
    }

    const seedBySlug = new Map(SEED_TERMS.map((t) => [t.slug, t]))
    const terms: GlossaryTerm[] = []
    for (const [slug, path] of Object.entries(kind.items)) {
      try {
        terms.push(await getContentDocument<GlossaryTerm>(path))
      } catch {
        // This ONE item's document failed (timeout, a 404 behind a stale index entry,
        // a malformed body) — fall back to the seed's copy of just this term, per
        // §4.1.3a ("falling back item by item to the build-time seed"). A term the seed
        // never had either is dropped, same as an unpublished term is today.
        const fallback = seedBySlug.get(slug)
        if (fallback) terms.push(fallback)
      }
    }
    lastState = { enabled: true, source: 'cdn', indexWatermark: kind.watermark, publishedAt: index.published_at }
    return terms
  } catch {
    // The index itself was unreachable (not a 404 — getContentIndex only throws on a
    // real failure). The whole kind falls back, exactly like "CMS_RUNTIME_KINDS" being
    // empty, except `enabled` stays true so the runtime report can tell the two apart.
    lastState = { enabled: true, source: 'seed' }
    return SEED_TERMS
  }
}

/** All terms, alphabetized within the full set. */
export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  return resolveTerms()
}

/**
 * Category display order — mirrors the site's product story. Category ORDER is seed
 * data (it rides on WordPress term meta the per-item document does not carry), so it
 * always starts from the seed's list; a category that only exists in a CDN-resolved
 * term the seed has never seen is appended, alphabetically, rather than silently
 * dropped from the index page's section nav.
 */
export async function getGlossaryCategories(): Promise<GlossaryCategory[]> {
  const terms = await resolveTerms()
  const present = new Set(terms.map((t) => t.category))
  const known = SEED_CATEGORY_NAMES.filter((c) => present.has(c))
  const extra = [...present].filter((c) => !known.includes(c)).sort()
  return [...known, ...extra] as GlossaryCategory[]
}

export async function getTerm(slug: string): Promise<GlossaryTerm | undefined> {
  const terms = await resolveTerms()
  return terms.find((t) => t.slug === slug)
}

export async function termsByCategory(category: GlossaryCategory): Promise<GlossaryTerm[]> {
  const terms = await resolveTerms()
  return terms.filter((t) => t.category === category)
}

/** The seed's own watermark — `/sys/seo-state`'s BUILD-TIME field, unaffected by the
 * runtime source (kept name-identical to before so that field's meaning doesn't shift
 * under existing callers). */
export const GLOSSARY_SEED_WATERMARK = SEED_WATERMARK
