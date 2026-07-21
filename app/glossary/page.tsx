import type { Metadata } from 'next'
import Link from 'next/link'
import { cdnUrl } from '@/lib/cdn'
import { GLOSSARY_CATEGORIES, glossaryTerms, termsByCategory } from '@/lib/glossary'

export const metadata: Metadata = {
  title: 'Glossary - Privacy, Cryptography & Analytics Terms',
  description:
    'Precise definitions of the cryptography, privacy-regulation, analytics, and email-infrastructure terms behind Ciphera — written from implementations we run in production.',
  alternates: {
    canonical: 'https://ciphera.net/glossary',
  },
  openGraph: {
    title: 'Glossary - Privacy, Cryptography & Analytics Terms | Ciphera',
    description:
      'Precise definitions of the cryptography, privacy-regulation, analytics, and email-infrastructure terms behind Ciphera.',
    url: 'https://ciphera.net/glossary',
    siteName: 'Ciphera',
    locale: 'en_US',
    type: 'website',
    images: [{ url: cdnUrl('/og-homepage.png'), width: 1200, height: 630, alt: 'Ciphera' }],
  },
}

// * DefinedTermSet — the machine-readable index AI engines and rich results
// * consume. Each term page carries its own DefinedTerm pointing back here.
const schema = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  '@id': 'https://ciphera.net/glossary',
  name: 'Ciphera Privacy & Infrastructure Glossary',
  description:
    'Definitions of cryptography, privacy-regulation, analytics, and email-infrastructure terms, maintained by Ciphera.',
  url: 'https://ciphera.net/glossary',
  publisher: {
    '@type': 'Organization',
    name: 'Ciphera',
    url: 'https://ciphera.net',
  },
  hasDefinedTerm: glossaryTerms.map((t) => ({
    '@type': 'DefinedTerm',
    name: t.term,
    description: t.short,
    url: `https://ciphera.net/glossary/${t.slug}`,
  })),
}

const categoryAnchor = (category: string) =>
  category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function GlossaryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">Reference</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            The privacy glossary.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {glossaryTerms.length} precise definitions — cryptography, regulation, measurement, and
            email infrastructure — written from implementations we actually run, not paraphrased
            marketing.
          </p>
          {/* Category jump links */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {GLOSSARY_CATEGORIES.map((c) => (
              <a
                key={c}
                href={`#${categoryAnchor(c)}`}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {c} ({termsByCategory(c).length})
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Term sections */}
      {GLOSSARY_CATEGORIES.map((category, i) => {
        const terms = termsByCategory(category)
        if (terms.length === 0) return null
        return (
          <section
            key={category}
            id={categoryAnchor(category)}
            className="scroll-mt-24 border-b border-border"
          >
            <div className="px-6 py-14 sm:py-16">
              <p className="text-xs text-muted-foreground">
                {String(i + 1).padStart(2, '0')} · {category}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2">
                {terms.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/glossary/${t.slug}`}
                    className="group bg-card p-5 transition-colors hover:bg-background"
                  >
                    <span className="text-sm font-semibold text-foreground">{t.term}</span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                      {t.short.split('. ')[0].replace(/\.$/, '')}.
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
