/**
 * The glossary's read seam.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §38 (D29)
 *
 * 🔑 THIS FILE EXISTS SO ITS FOUR READERS DID NOT HAVE TO CHANGE. `app/glossary/page.tsx`,
 * `app/sitemap.ts` and `scripts/generate-llms.ts` import `glossaryTerms`,
 * `GLOSSARY_CATEGORIES` and `termsByCategory` exactly as they did when the terms were
 * four TypeScript files. Unioning here rather than at the generated file means the
 * migration touched the term page alone.
 *
 * 🔴 THE TERMS ARE BUILD OUTPUT NOW. `lib/glossary.gen.ts` is written by
 * `scripts/generate-glossary.ts` from WordPress and is git-ignored. To change a
 * definition, edit it at https://cms.ciphera.net → Glossary.
 */
import type { GlossaryCategory, GlossaryTerm } from './types'
import { generatedGlossaryTerms, GLOSSARY_CATEGORY_NAMES } from '../glossary.gen'

export type { GlossaryCategory, GlossaryTerm } from './types'

/**
 * Category display order — mirrors the site's product story, and now comes from the
 * CMS's own term meta rather than from a literal here.
 * ⚠️ The cast is the seam's one honest compromise: the generated file carries strings,
 * and the union type is what every caller already expects. The generator fails the build
 * if a term has no category at all, which is the case that would actually break a page.
 */
export const GLOSSARY_CATEGORIES = GLOSSARY_CATEGORY_NAMES as GlossaryCategory[]

/** All terms, alphabetized within the full set — the generator sorts them. */
export const glossaryTerms: GlossaryTerm[] = generatedGlossaryTerms

export function getTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug)
}

export function termsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  return glossaryTerms.filter((t) => t.category === category)
}
