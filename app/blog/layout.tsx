import { Metadata } from 'next'
import { seoForAsync } from '@/lib/seo'
import { INDEX } from '@/components/overhaul/blog/content'
import { pageCardImages } from '@/lib/og/cards'

const CARD = pageCardImages('blog')

export async function generateMetadata(): Promise<Metadata> {
  return seoForAsync('/blog', {
    title: INDEX.title,
    description: INDEX.lead,
    alternates: {
      canonical: 'https://ciphera.net/blog',
    },
    openGraph: {
      title: `${INDEX.title} | Ciphera`,
      description: INDEX.lead,
      url: 'https://ciphera.net/blog',
      siteName: 'Ciphera',
      images: CARD.openGraph,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${INDEX.title} | Ciphera`,
      description: INDEX.lead,
      images: CARD.twitter,
    },
  })
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
