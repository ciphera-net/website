import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTerm } from '@/lib/glossary'
import { GlossaryTermPage as TermPage } from '@/components/overhaul/glossary/GlossaryTerm'
import { REMOVED } from '@/components/overhaul/glossary/content'
import { termCardImages } from '@/lib/og/cards'

interface Props {
  params: Promise<{ slug: string }>
}

// 🔴 NO generateStaticParams (WEB-26). A runtime-kind term page reads the CDN at
// request time — a build-time param list would either miss a term published after
// this image was built, or statically freeze one that was later unpublished.
// `dynamicParams` stays its default `true`, so an unlisted slug still resolves through
// the same lib/glossary seam (falling back to the seed when the CDN or the kind flag
// says to) and 404s only when `getTerm` itself finds nothing.

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const term = await getTerm(slug)
  if (!term) return {}
  /**
   * 🔴 THE TITLE AND DESCRIPTION COME FROM THE CMS, NOT FROM A TEMPLATE.
   *
   * This route built its title as `What is ${term.term}?` against data that is sentence
   * case by contract — so Google was served `What is Blind index?`, `What is Bounce
   * rate?` and `What is Data controller?` on 29 of the 53. A template cannot fix it: a
   * countable noun takes an article, an uncountable one takes none, a plural takes
   * "are", and an acronym is unchanged. Each title is now written out in WordPress.
   *
   * 🔴 AND `description` IS NO LONGER `term.short`. That field is the visible lede and
   * the DefinedTerm description, written LONG on purpose — all 53 ran 186–262 characters
   * against Google's ~155, so every page was truncated. The meta description is its own
   * field, asserted <=160 by the generator, and there is NO fallback between them: a
   * fallback would restore the defect on every untouched term and look fixed (§38.11).
   *
   * ⚠️ `title.absolute` — the root layout's template appends " | Ciphera", and the CMS
   * value already carries the full string it should render.
   */
  const card = termCardImages(term.slug, term.term)
  return {
    title: { absolute: term.seoTitle },
    description: term.seoDescription,
    alternates: {
      canonical: term.canonical,
    },
    // Only when the term sets one: an explicit `robots: undefined` replaced the layout's directives with none (measured
    // on the live term pages, plan §5j).
    ...(term.noindex || term.nofollow ? { robots: { index: !term.noindex, follow: !term.nofollow } } : {}),
    openGraph: {
      title: term.seoTitle,
      description: term.seoDescription,
      url: `https://ciphera.net/glossary/${term.slug}`,
      siteName: 'Ciphera',
      locale: 'en_US',
      type: 'article',
      images: card.openGraph,
    },
    // The term's own words, as Open Graph has them (plan §5j): the root layout's card would otherwise describe the company.
    twitter: {
      card: 'summary_large_image',
      title: term.seoTitle,
      description: term.seoDescription,
      images: card.twitter,
    },
  }
}

/** The term page as ruled (D42, plan §5j): option A, the blog post's form with the sunrise. */
export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params
  // Retired terms (D6, D43) redirect before they reach here; until WordPress unpublishes them, one that gets past the
  // redirect must not render a term the glossary no longer lists.
  if ((REMOVED as readonly string[]).includes(slug)) notFound()
  return <TermPage variant="a" slug={slug} />
}
