import { Metadata } from 'next'
import { pageCardImages } from '@/lib/og/cards'
import { PageOpeningC } from '@/components/overhaul/system/PageOpening'
import { LegalSections } from '@/components/overhaul/legal/LegalSections'
import { DPA } from '@/components/overhaul/legal/legal-words'
import { DPA_IN_FORCE, DPA_PUBLISHED } from '@/lib/dpa/agreement'
import { DPA_SECTIONS } from './sections'

const CARD = pageCardImages('dpa')

export const metadata: Metadata = {
  title: 'Data Processing Agreement',
  description: 'The agreement under which Ciphera BV processes personal data for customers who use Pulse: the European Commission’s standard contractual clauses and four annexes.',
  alternates: { canonical: 'https://ciphera.net/dpa' },
  openGraph: {
    title: 'Data Processing Agreement | Ciphera',
    description: 'How Ciphera processes personal data for Pulse customers.',
    url: 'https://ciphera.net/dpa',
    siteName: 'Ciphera',
    images: CARD.openGraph,
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', images: CARD.twitter },
}

export default function DataProcessingAgreementPage() {
  return (
    <>
      <PageOpeningC title="Data Processing Agreement" lead={DPA.LEAD}>
        <p className="mt-8 text-sm text-muted-foreground">
          Published {DPA_PUBLISHED}. In force from {DPA_IN_FORCE}.
        </p>
      </PageOpeningC>
      <LegalSections sections={DPA_SECTIONS} summaries={DPA.SUMMARIES} next={{ href: '/terms', label: 'Terms of Service' }} />
    </>
  )
}
