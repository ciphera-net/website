/**
 * Round 8 (mock, 18-10-2026): what the glossary options read, on the server, from the same resolver the live glossary
 * uses (CMS content zone first, build seed as fallback). Server-only: through lib/glossary this module carries every
 * term, so no client module may import it (__tests__/client-boundary.test.mjs).
 */
import { getGlossaryCategories, getGlossaryTerms, getTerm, type GlossaryTerm } from '@/lib/glossary'
import { REMOVED } from './content'

const gone = new Set<string>(REMOVED)

export async function loadTerms(): Promise<GlossaryTerm[]> {
  return (await getGlossaryTerms()).filter((t) => !gone.has(t.slug)).sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }))
}

export async function loadCategories(): Promise<string[]> {
  const terms = await loadTerms()
  const present = new Set(terms.map((t) => t.category))
  return (await getGlossaryCategories()).filter((c) => present.has(c))
}

export async function loadTerm(slug: string): Promise<GlossaryTerm | null> {
  if (gone.has(slug)) return null
  return (await getTerm(slug)) ?? null
}

/**
 * Whether /glossary/<slug> has a term: the ONE answer, asked by the term route and by proxy.ts before anything renders
 * (lib/routing/not-found-routes.mjs says why the proxy must ask). A retired term (D6, D43) counts as missing.
 */
export async function termExists(slug: string): Promise<boolean> {
  return (await loadTerm(slug)) !== null
}

/** 'Privacy & regulation' → 'privacy-regulation', for section anchors. */
export const anchorOf = (category: string) => category.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** The first letter a term files under: digits and symbols go under '#'. */
export const letterOf = (term: string) => {
  const c = term.trim().charAt(0).toUpperCase()
  return /[A-Z]/.test(c) ? c : '#'
}
