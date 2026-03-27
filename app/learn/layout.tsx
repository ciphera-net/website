import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learn - Web Performance & SEO Reference',
  description: 'Reference guides for Lighthouse audits, web performance metrics, accessibility standards, and SEO best practices. Understand what PageSpeed Insights measures and how to improve your scores.',
  alternates: {
    canonical: 'https://ciphera.net/learn',
  },
  openGraph: {
    title: 'Learn - Web Performance & SEO Reference',
    description: 'Reference guides for Lighthouse audits, web performance metrics, accessibility standards, and SEO best practices.',
    url: 'https://ciphera.net/learn',
    siteName: 'Ciphera',
    images: [{ url: '/ciphera_logo_no_margins.png', width: 1200, height: 630, alt: 'Ciphera Learn' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn - Web Performance & SEO Reference',
    description: 'Reference guides for Lighthouse audits, web performance metrics, accessibility standards, and SEO best practices.',
    images: ['/ciphera_logo_no_margins.png'],
  },
}

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Learn - Web Performance & SEO Reference',
    description: 'Reference guides for Lighthouse audits, web performance metrics, accessibility standards, and SEO best practices.',
    url: 'https://ciphera.net/learn',
    publisher: { '@type': 'Organization', name: 'Ciphera', url: 'https://ciphera.net' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Learn' },
    ],
  },
]

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
