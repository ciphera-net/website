import { TAGLINE_LINES } from '@/components/overhaul/footer/footer-data'
import { OPENING as ABOUT } from '@/components/overhaul/about/content'
import { OPENING as TRUST } from '@/components/overhaul/trust/content'
import { OPENING as CONTACT } from '@/components/overhaul/contact/content'
import { INDEX as BLOG, UNPUBLISHED } from '@/components/overhaul/blog/content'
import { INDEX as GLOSSARY, REMOVED } from '@/components/overhaul/glossary/content'
import { getBlogPost } from '@/lib/blog'
import { getTerm } from '@/lib/glossary'
import { getLearnArticle } from '@/lib/learn'
import { getPulsePostTitle } from '@/lib/cms/pulse-posts'
import type { OgCard, OgKind } from './spec'
import { cardPath, learnKey, ogCardImages } from './url'

/**
 * The words on every card (D52; plan §5l): each page's own opening, the words a visitor reads first. Labels are the
 * footer's columns (Company, Resources, Legal) or the section a page belongs to (Blog, Glossary, Learn); the homepage's
 * card is the tagline, with no label.
 */
const firstSentence = (s: string) => (s.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? s).trim()

export const PAGE_CARDS = {
  home: { label: '', title: TAGLINE_LINES.join(' ') },
  about: { label: 'Company', title: ABOUT.title, lead: firstSentence(ABOUT.lead) },
  trust: { label: 'Company', title: TRUST.title, lead: firstSentence(TRUST.lead) },
  contact: { label: 'Company', title: CONTACT.title, lead: firstSentence(CONTACT.lead) },
  sustainability: { label: 'Company', title: 'Sustainability', lead: 'Receipts, not promises.' },
  blog: { label: 'Resources', title: BLOG.title, lead: firstSentence(BLOG.lead) },
  glossary: { label: 'Resources', title: GLOSSARY.title, lead: firstSentence(GLOSSARY.lead) },
  learn: { label: 'Resources', title: 'Learn' },
  privacy: { label: 'Legal', title: 'Privacy policy' },
  terms: { label: 'Legal', title: 'Terms of service' },
  dpa: { label: 'Legal', title: 'Data processing agreement' },
} satisfies Record<string, OgCard>

export type PageCardKey = keyof typeof PAGE_CARDS

export const postCard = (title: string): OgCard => ({ label: 'Blog', title })
export const termCard = (term: string): OgCard => ({ label: 'Glossary', title: term })
export const learnCard = (title: string): OgCard => ({ label: 'Learn', title })
/** A pulse.ciphera.net post: ciphera.net's post card with Pulse's lockup. */
export const pulsePostCard = (title: string): OgCard => ({ label: 'Blog', title, brand: 'pulse' })

/** A post's card address, site-relative: its og:image, and its image on the blog index and in its BlogPosting. */
export const postCardUrl = (slug: string, title: string) => cardPath('post', slug, postCard(title))

/** A coded page's card images, for its metadata. */
export const pageCardImages = (key: PageCardKey) => ogCardImages('page', key, PAGE_CARDS[key])
export const postCardImages = (slug: string, title: string) => ogCardImages('post', slug, postCard(title))
export const termCardImages = (slug: string, term: string) => ogCardImages('term', slug, termCard(term))
export const learnCardImages = (product: string, slug: string, title: string) => ogCardImages('learn', learnKey(product, slug), learnCard(title))

/**
 * The words for one card, read the same way its page reads them; null for a page that does not exist. Throws only when
 * it cannot tell (a Pulse post's words come from the content CDN, with no seed behind them): the route answers 503.
 */
export async function resolveCard(kind: OgKind, key: string): Promise<OgCard | null> {
  switch (kind) {
    case 'page':
      return Object.hasOwn(PAGE_CARDS, key) ? PAGE_CARDS[key as PageCardKey] : null
    case 'post': {
      if ((UNPUBLISHED as readonly string[]).includes(key)) return null
      const post = await getBlogPost(key)
      return post ? postCard(post.title) : null
    }
    case 'term': {
      if ((REMOVED as readonly string[]).includes(key)) return null
      const term = await getTerm(key)
      return term ? termCard(term.term) : null
    }
    case 'learn': {
      const [product, slug] = key.split('~')
      const article = product && slug ? getLearnArticle(product, slug) : null
      return article ? learnCard(article.title) : null
    }
    case 'pulse-post': {
      // pulse.ciphera.net declares this card on its own post pages (Pulse/pulse-website lib/blog-card.ts).
      const title = await getPulsePostTitle(key)
      return title === null ? null : pulsePostCard(title)
    }
  }
}
