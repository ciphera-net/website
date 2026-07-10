import type { GlossaryCategory, GlossaryTerm } from './types'
import { cryptoTerms } from './terms-crypto'
import { privacyTerms } from './terms-privacy'
import { analyticsTerms } from './terms-analytics'
import { emailTerms } from './terms-email'

export type { GlossaryCategory, GlossaryTerm } from './types'

/** Category display order — mirrors the site's product story. */
export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  'Cryptography & authentication',
  'Privacy & regulation',
  'Analytics & web',
  'Email & infrastructure',
]

/** All terms, alphabetized within the full set. */
export const glossaryTerms: GlossaryTerm[] = [
  ...cryptoTerms,
  ...privacyTerms,
  ...analyticsTerms,
  ...emailTerms,
].sort((a, b) => a.term.localeCompare(b.term))

export function getTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug)
}

export function termsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  return glossaryTerms.filter((t) => t.category === category)
}
