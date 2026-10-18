import type { Metadata } from 'next'
import { seoForAsync } from '@/lib/seo'
import { cdnUrl } from '@/lib/cdn'
import { GlossaryIndexPage } from '@/components/overhaul/glossary/GlossaryIndex'
import { INDEX } from '@/components/overhaul/glossary/content'

// 'glossary' is a runtime kind (lib/cms/runtime-config.ts): the index reads the content zone per request, so a term
// published in the CMS appears without a build.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  // The WordPress route stub for '/glossary' overrides these at request time (seoForAsync).
  return seoForAsync('/glossary', {
    title: 'Glossary - Privacy, Cryptography & Analytics Terms',
    description: INDEX.lead,
    alternates: {
      canonical: 'https://ciphera.net/glossary',
    },
    openGraph: {
      title: 'Glossary - Privacy, Cryptography & Analytics Terms | Ciphera',
      description: INDEX.lead,
      url: 'https://ciphera.net/glossary',
      siteName: 'Ciphera',
      locale: 'en_US',
      type: 'website',
      images: [{ url: cdnUrl('/og-homepage.png'), width: 1200, height: 630, alt: 'Ciphera' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Glossary - Privacy, Cryptography & Analytics Terms | Ciphera',
      description: INDEX.lead,
      images: [cdnUrl('/og-homepage.png')],
    },
  })
}

/**
 * The glossary index as ruled (D42, plan §5j): the sunrise opening with the term count, the categories as jump links, then
 * each category's terms as rows (the blog's row grammar, D38). The DefinedTermSet data is emitted by the component, through
 * jsonLdHtml().
 */
export default function GlossaryPage() {
  return <GlossaryIndexPage variant="a" />
}
