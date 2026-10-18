import type { Metadata } from 'next'
import { seoForAsync } from '@/lib/seo'
import { OPENING } from '@/components/overhaul/about/content'
import { pageCardImages } from '@/lib/og/cards'

// The overhaul (18-10-2026): the title and description are the page's own ruled opening (W4b, W4c), so a search
// result says what the page says. A WordPress route stub for '/about' overrides these at request time (seoForAsync).
const CARD = pageCardImages('about')

export async function generateMetadata(): Promise<Metadata> {
  return seoForAsync('/about', {
    title: { absolute: OPENING.title },
    description: OPENING.lead,
    openGraph: {
      title: OPENING.title,
      description: OPENING.lead,
      url: 'https://ciphera.net/about',
      siteName: 'Ciphera',
      images: CARD.openGraph,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: OPENING.title,
      description: OPENING.lead,
      images: CARD.twitter,
    },
    alternates: { canonical: 'https://ciphera.net/about' },
  })
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
