import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Ciphera | Building Privacy-First Infrastructure',
  description: 'Learn about Ciphera\'s mission to build privacy-first infrastructure and applications. Discover our values, technology stack, and journey in creating zero-knowledge solutions.',
  keywords: ['about ciphera', 'privacy company', 'zero-knowledge', 'encryption', 'privacy-first', 'ciphera mission'],
  openGraph: {
    title: 'About Us - Ciphera | Building Privacy-First Infrastructure',
    description: 'Learn about Ciphera\'s mission to build privacy-first infrastructure and applications. Discover our values, technology stack, and journey in creating zero-knowledge solutions.',
    url: 'https://ciphera.net/about',
    siteName: 'Ciphera',
    images: [
      {
        url: '/ciphera_logo_no_margins.png',
        width: 1200,
        height: 630,
        alt: 'Ciphera Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Ciphera | Building Privacy-First Infrastructure',
    description: 'Learn about Ciphera\'s mission to build privacy-first infrastructure and applications.',
    images: ['/ciphera_logo_no_margins.png'],
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
