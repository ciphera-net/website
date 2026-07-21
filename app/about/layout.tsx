import type { Metadata } from 'next'
import { cdnUrl } from '@/lib/cdn'

export const metadata: Metadata = {
  title: 'About Us - Building Privacy-First Infrastructure',
  description: 'Ciphera is a Belgian privacy company building zero-knowledge infrastructure. Learn about our mission, values, technology stack, and journey since 2024.',
  keywords: ['about ciphera', 'privacy company', 'zero-knowledge', 'encryption', 'privacy-first', 'ciphera mission'],
  openGraph: {
    title: 'About Us - Building Privacy-First Infrastructure | Ciphera',
    description: 'Ciphera is a Belgian privacy company building zero-knowledge infrastructure. Learn about our mission, values, technology stack, and journey since 2024.',
    url: 'https://ciphera.net/about',
    siteName: 'Ciphera',
    images: [
      {
        url: cdnUrl('/ciphera_logo_no_margins.png'),
        width: 1200,
        height: 630,
        alt: 'Ciphera - Building Privacy-First Infrastructure',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Building Privacy-First Infrastructure | Ciphera',
    description: 'Ciphera is a Belgian privacy company building zero-knowledge infrastructure. Learn about our mission, values, and technology.',
    images: [cdnUrl('/ciphera_logo_no_margins.png')],
  },
  alternates: {
    canonical: 'https://ciphera.net/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
