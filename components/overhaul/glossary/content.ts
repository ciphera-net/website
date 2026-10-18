/**
 * Every word the glossary's chrome says (Round 8, 18-10-2026; layout D42, wording W8 = D43, as drafted). The terms' own
 * words come from the CMS; nothing here restates them.
 */

export const INDEX = {
  title: 'Glossary',
  lead: 'Plain definitions of the privacy and security terms we use.',
  azLabel: 'A to Z',
  nav: 'Categories',
  count: (n: number) => `${n} terms`,
  // The DefinedTermSet's name and description in the JSON-LD (plan §5j: no "email-infrastructure" any more).
  setName: 'Ciphera Privacy Glossary',
  description: 'Plain definitions of the privacy and security terms Ciphera uses.',
} as const

export const TERM = {
  back: { label: 'Glossary', href: '/glossary' },
  questions: 'Questions',
  see: 'See also',
  related: 'Related terms',
} as const

/**
 * Terms the site no longer lists or serves: the warrant canary (D6) and the five email-authentication terms (D43, W8-1).
 * Each redirects to /glossary (next.config.ts for the canary, the CMS for the five); this keeps them off every list even
 * before WordPress unpublishes them.
 */
export const REMOVED = ['warrant-canary', 'dkim', 'dmarc', 'mta-sts', 'spf', 'transactional-email'] as const

/** The term every term option shows by default: questions, three see-also links, five related terms. */
export const SHOWCASE = 'fadp'
