import { Metadata } from 'next'
import { seoForAsync } from '@/lib/seo'
import { cdnUrl } from '@/lib/cdn'
import { INDEX } from '@/components/overhaul/blog/content'

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
      images: [{ url: cdnUrl('/blog/og/_index.png'), width: 1200, height: 630, alt: 'Ciphera Blog' }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${INDEX.title} | Ciphera`,
      description: INDEX.lead,
      images: [cdnUrl('/blog/og/_index.png')],
    },
  })
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
