import type { Metadata } from 'next'
import { seoForAsync } from '@/lib/seo'
import { cdnUrl } from '@/lib/cdn'
import { META } from '@/components/overhaul/contact/content'

// The overhaul (18-10-2026): Round 6's title and description. A WordPress route stub for '/contact' overrides these at
// request time (seoForAsync).
export async function generateMetadata(): Promise<Metadata> {
  return seoForAsync('/contact', {
    title: META.title,
    description: META.description,
    openGraph: {
      title: `${META.title} | Ciphera`,
      description: META.description,
      url: 'https://ciphera.net/contact',
      siteName: 'Ciphera',
      images: [{ url: cdnUrl('/ciphera_logo_no_margins.png'), width: 1200, height: 630, alt: 'Contact Ciphera' }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${META.title} | Ciphera`,
      description: META.description,
      images: [cdnUrl('/ciphera_logo_no_margins.png')],
    },
    alternates: { canonical: 'https://ciphera.net/contact' },
  })
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
