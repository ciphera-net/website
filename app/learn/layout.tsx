import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learn - Knowledge Base',
  description: 'Technical guides and reference documentation from Ciphera. Web performance, security, encryption, analytics, and more.',
  alternates: {
    canonical: 'https://ciphera.net/learn',
  },
  openGraph: {
    title: 'Learn - Knowledge Base',
    description: 'Technical guides and reference documentation from Ciphera.',
    url: 'https://ciphera.net/learn',
    siteName: 'Ciphera',
    images: [{ url: '/ciphera_logo_no_margins.png', width: 1200, height: 630, alt: 'Ciphera Learn' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn - Knowledge Base',
    description: 'Technical guides and reference documentation from Ciphera.',
    images: ['/ciphera_logo_no_margins.png'],
  },
}

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Learn - Knowledge Base',
    description: 'Technical guides and reference documentation from Ciphera.',
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
