import type { Metadata } from 'next'
import { seoForAsync } from '@/lib/seo'
import { META } from '@/components/overhaul/contact/content'
import { pageCardImages } from '@/lib/og/cards'

// The overhaul (18-10-2026): Round 6's title and description. A WordPress route stub for '/contact' overrides these at
// request time (seoForAsync).
const CARD = pageCardImages('contact')

export async function generateMetadata(): Promise<Metadata> {
  return seoForAsync('/contact', {
    title: META.title,
    description: META.description,
    openGraph: {
      title: `${META.title} | Ciphera`,
      description: META.description,
      url: 'https://ciphera.net/contact',
      siteName: 'Ciphera',
      images: CARD.openGraph,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${META.title} | Ciphera`,
      description: META.description,
      images: CARD.twitter,
    },
    alternates: { canonical: 'https://ciphera.net/contact' },
  })
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
