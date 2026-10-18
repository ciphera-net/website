/**
 * Round 8 (mock, 18-10-2026): every word the glossary's chrome says. The terms' own words come from the CMS and are W8's
 * job; nothing here restates them. All DRAFTS for W8, humanized.
 */

export const INDEX = {
  title: 'Glossary',
  lead: 'Plain definitions of the privacy and security terms we use.',
  azLabel: 'A to Z',
  nav: 'Categories',
  count: (n: number) => `${n} terms`,
} as const

export const TERM = {
  back: { label: 'Glossary', href: '/mock-glossary' },
  questions: 'Questions',
  see: 'See also',
  related: 'Related terms',
} as const

/** Ruling D6: the warrant canary is gone, so is its term. The mock leaves it out of every list, as the site will. */
export const REMOVED = ['warrant-canary'] as const

/** The term every term option shows by default: questions, three see-also links, five related terms. */
export const SHOWCASE = 'fadp'
