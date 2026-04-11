import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Environmental Impact',
  description:
    "Ciphera's environmental impact — every server we run, measured with life-cycle assessment, powered by 100% renewable Swiss hydroelectric grid. No offsets, no greenwashing, just receipts.",
  alternates: {
    canonical: 'https://ciphera.net/sustainability',
  },
  openGraph: {
    title: 'Environmental Impact — Ciphera',
    description:
      'Receipts, not promises. Ciphera runs on 100% renewable Swiss hydroelectric power. See every server, every lifecycle phase, every gram of CO₂.',
    url: 'https://ciphera.net/sustainability',
    siteName: 'Ciphera',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Environmental Impact — Ciphera',
    description:
      'Receipts, not promises. Ciphera runs on 100% renewable Swiss hydroelectric power.',
  },
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
    description:
      "Ciphera's environmental impact measured with life-cycle assessment, powered by 100% renewable Swiss hydroelectric grid.",
    publisher: {
      '@type': 'Organization',
      name: 'Ciphera',
      url: 'https://ciphera.net',
    },
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
