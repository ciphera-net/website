export type GlossaryCategory =
  | 'Cryptography & authentication'
  | 'Privacy & regulation'
  | 'Analytics & web'
  | 'Email & infrastructure'

export interface GlossaryTerm {
  /** URL slug under /glossary/ — kebab-case, stable forever. */
  slug: string
  /** Display name, sentence case except proper nouns/acronyms. */
  term: string
  category: GlossaryCategory
  /**
   * The canonical one-to-two-sentence definition. Must stand alone: it is the
   * meta description, the DefinedTerm description, and the answer an AI
   * engine should quote. Factual, no marketing. <= ~220 chars.
   */
  short: string
  /** Body copy, one string per paragraph. Plain text — no markdown. */
  paragraphs: string[]
  /** Slugs of related glossary terms (rendered as links; must exist). */
  related: string[]
  /** External or internal references (RFCs, repos, product pages). */
  see?: { label: string; href: string }[]
  /** Optional Q&A block — emits FAQPage structured data on the term page. */
  faq?: { q: string; a: string }[]
}
