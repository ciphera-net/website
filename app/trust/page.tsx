import type { Metadata } from 'next'
import { TrustPage } from '@/components/overhaul/trust/TrustPage'
import { META } from '@/components/overhaul/trust/content'
import { pageCardImages } from '@/lib/og/cards'

/**
 * Trust & security (the overhaul, 18-10-2026): outline A (D27) as ruled (D31, D32) with the wording of W5 (D33): What we
 * keep D, Where it runs A, How sign-in works G (#sign-in), Open source D (#open-source), Reporting a security problem D
 * (#disclosure), the review kit E. The page carries its own WebPage and BreadcrumbList data (D24).
 */
const CARD = pageCardImages('trust')

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  alternates: { canonical: 'https://ciphera.net/trust' },
  openGraph: {
    title: `${META.title} | Ciphera`,
    description: META.description,
    url: 'https://ciphera.net/trust',
    siteName: 'Ciphera',
    images: CARD.openGraph,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@CipheraNET',
    title: `${META.title} | Ciphera`,
    description: META.description,
    images: CARD.twitter,
  },
}

export default function Page() {
  return <TrustPage picks={{ data: 'd', providers: 'a', 'sign-in': 'g', 'open-source': 'd', disclosure: 'd', closing: 'e' }} />
}
