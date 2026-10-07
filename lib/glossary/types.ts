/**
 * The glossary's shape.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §38 (D29)
 *
 * 🔴 THIS IS NO LONGER A SOURCE FILE'S SHAPE — IT DESCRIBES WHAT WORDPRESS RETURNS.
 * The 53 terms live in the CMS (`ciphera_glossary`) and reach the site through
 * `scripts/generate-glossary.ts` at build time. Editing a definition means editing it at
 * https://cms.ciphera.net → Glossary, not here.
 */

/**
 * 🔴 WIDENED FROM A 4-MEMBER LITERAL UNION TO `string` (P1-a verifier finding,
 * 07-10-2026). `glossaryCategories` is a WordPress taxonomy — CMS content the agency
 * administers, not a closed set this codebase controls — so a rename, a typo, or a new
 * category an editor creates must not fail `next build`'s type-check the way the old
 * literal union did (`category: cat.name` straight from WordPress, checked against four
 * exact strings). `scripts/generate-glossary.ts` normalizes near-matches of the four
 * categories the site renders section headings for and FLAGS anything that does not
 * match at all (see `lib/glossary-category-rules.mjs`); the type itself no longer
 * enforces it, matching `BlogPost.category`'s own `string` (lib/blog-types.ts), which
 * never had this problem.
 */
export type GlossaryCategory = string

export interface GlossaryTerm {
  /** URL slug under /glossary/ — kebab-case, stable forever. */
  slug: string
  /**
   * Display name — and the <h1>.
   * 🔑 Sentence case is CORRECT here: it is a heading, and a heading wants it. The
   * defect fixed in §38.11 was the title TAG, which embedded this string mid-sentence
   * as "What is Blind index?". The two are separate fields for that reason.
   */
  term: string
  category: GlossaryCategory
  /** The category's slug, for grouping without matching on a display string. */
  categorySlug: string
  /**
   * The canonical one-to-two-sentence definition: the visible lede AND the
   * `DefinedTerm` description AND the answer an AI engine should quote.
   * 🔴 IT IS NOT THE META DESCRIPTION AND MUST NEVER FALL BACK TO ONE. This is written
   * LONG on purpose (~220 chars); `seoDescription` is the short one. Collapsing them is
   * what put all 53 pages over Google's truncation point in the first place.
   */
  short: string
  /**
   * The body, as rendered HTML from the block editor.
   * 🔑 NOT `paragraphs: string[]` any more. That shape could only carry flat plain text —
   * a limitation that existed only because the content lived in TypeScript. An editor can
   * now write a link, a list or emphasis, and a string array would silently drop the
   * markup while still rendering the words.
   */
  html: string
  /** The same body as plain text, one entry per paragraph. For llms-full.txt only. */
  paragraphs: string[]
  /** Slugs of related terms. 🔴 Every one is asserted to resolve at build time. */
  related: string[]
  /** External or internal references (RFCs, repos, product pages). */
  see: { label: string; href: string }[]
  /** Optional Q&A block — emits FAQPage structured data on the term page. */
  faq?: { q: string; a: string }[]

  /**
   * 🔴 THE SEO FIELDS THE AGENCY OWNS, read from Yoast post meta.
   * `seoTitle` is written out per term because no rule can derive it: a countable noun
   * takes an article, an uncountable one takes none, a plural takes "are", and an
   * acronym is left alone.
   */
  seoTitle: string
  /** ≤160 chars, asserted by the generator. */
  seoDescription: string
  canonical: string
  noindex: boolean
  nofollow: boolean
  /** WordPress's `modifiedGmt` — feeds the publish watcher's watermark. */
  modified: string
}
