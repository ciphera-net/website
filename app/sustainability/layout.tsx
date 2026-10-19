import type { Metadata } from 'next'
import { seoForAsync } from '@/lib/seo'
import { pageCardImages } from '@/lib/og/cards'

const CARD = pageCardImages('sustainability')

// * The <meta>, Open Graph, X and JSON-LD descriptions. 🔴 The first three are overridden at request time by the CMS
// * route stub for /sustainability (lib/seo.ts, seoForAsync), so this is their fallback; the JSON-LD is read from here.
const DESCRIPTION =
  "Ciphera's environmental impact: the servers we run in Zurich, estimated with life-cycle assessment, on one of Europe's lowest-carbon grids. We buy no carbon offsets."

export async function generateMetadata(): Promise<Metadata> {
  return seoForAsync('/sustainability', {
    title: 'Environmental Impact',
    description: DESCRIPTION,
    alternates: {
      canonical: 'https://ciphera.net/sustainability',
    },
    openGraph: {
      title: 'Environmental Impact | Ciphera',
      description: DESCRIPTION,
      url: 'https://ciphera.net/sustainability',
      siteName: 'Ciphera',
      locale: 'en_US',
      type: 'website',
      images: CARD.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Environmental Impact | Ciphera',
      description: DESCRIPTION,
      images: CARD.twitter,
    },
  })
}

export default function SustainabilityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Environmental Impact — Ciphera',
    url: 'https://ciphera.net/sustainability',
    description: DESCRIPTION,
    publisher: { '@id': 'https://ciphera.net/#organization' },
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
