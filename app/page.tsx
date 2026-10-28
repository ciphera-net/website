import type { Metadata } from 'next'
import { OverhaulHero } from '@/components/overhaul/OverhaulHero'
import { WhatWeBuildB } from '@/components/overhaul/home/variants/WhatWeBuildB'
import { HowWeBuildM } from '@/components/overhaul/home/variants/HowWeBuildStepper'
import { WhereDataLivesB } from '@/components/overhaul/home/variants/WhereDataLivesB'
import { OpenByDefault } from '@/components/overhaul/home/OpenByDefault'
import { FromTheBlogB } from '@/components/overhaul/home/variants/FromTheBlogB'
import { HomeFaq, FAQ } from '@/components/overhaul/home/HomeFaq'
import { Closing } from '@/components/overhaul/home/Closing'
import { cdnUrl } from '@/lib/cdn'
import { jsonLdHtml } from '@/lib/json-ld'
import { seoForAsync } from '@/lib/seo'
import { pageCardImages } from '@/lib/og/cards'

/**
 * The homepage (the overhaul, 18-10-2026): the approved hero (R1, D4, D26: the routes into the data's city, Geneva since 28-10-2026, no city lights) and
 * the owner's Round 2 picks (D15, D16): What we build B, How we build M, Where your data lives B, Open by default A,
 * From the blog B, the FAQ (seven questions, D24) and the closing band. Header and footer come from the root layout.
 *
 * ⚠️ The homepage has its own metadata object: the root layout renders every page, so a title set there is a title set
 * everywhere. The wording is W1 (D5). A WordPress route stub for '/' overrides this at request time (seoForAsync).
 */
const TITLE = 'Ciphera — Privacy-first software, made in Europe'
const HOME_CARD = pageCardImages('home')
const DESCRIPTION = 'Ciphera is a Belgian software company. We build privacy-first tools for the web and run them on Swiss infrastructure.'

export async function generateMetadata(): Promise<Metadata> {
  return seoForAsync('/', {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: 'https://ciphera.net' },
    // The card is set here as well as in the root layout: a WordPress stub's image yields only to a page whose own
    // metadata carries its card (lib/seo.ts), and Next replaces a parent's openGraph instead of merging into it.
    openGraph: { type: 'website', locale: 'en_US', url: 'https://ciphera.net', siteName: 'Ciphera', title: TITLE, description: DESCRIPTION, images: HOME_CARD.openGraph },
    twitter: { card: 'summary_large_image', site: '@CipheraNET', title: TITLE, description: DESCRIPTION, images: HOME_CARD.twitter },
  })
}

const homepageSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://ciphera.net/#organization',
    name: 'Ciphera',
    alternateName: ['Ciphera BV'],
    legalName: 'Ciphera BV',
    vatID: 'BE1013721660',
    // * Machine-readable company identifiers. Google names iso6523 and naics as properties used "behind the scenes to
    // * disambiguate your organization from other organizations", the whole problem with several unrelated entities
    // * also called Ciphera. ICD 0208 is the Belgian KBO/BCE scheme (Peppol code list).
    iso6523Code: '0208:1013721660',
    naics: '541511',
    url: 'https://ciphera.net',
    logo: { '@type': 'ImageObject', url: cdnUrl('/ciphera_logo_no_margins.png') },
    description: DESCRIPTION,
    disambiguatingDescription:
      'Ciphera (Ciphera BV) is a Belgian software company. It makes Pulse, privacy-first web analytics. It is not affiliated with ciphera.co, ciphera.org, Ciphera Ltd (ciphera.uk) or the Ciphera apps.',
    foundingDate: '2024-09-18',
    foundingLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'BE' } },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'De Kleetlaan 2',
      addressLocality: 'Diegem',
      postalCode: '1831',
      addressCountry: 'BE',
    },
    telephone: '+3278480710',
    contactPoint: { '@type': 'ContactPoint', email: 'hello@ciphera.net', contactType: 'customer service' },
    // * Every URL here was confirmed to exist before being added: a sameAs pointing at a dead page weakens the entity
    // * cluster instead of corroborating it. Package registries are corroboration a namesake cannot fake.
    sameAs: [
      'https://github.com/ciphera-net',
      'https://x.com/CipheraNET',
      'https://www.linkedin.com/company/ciphera/',
      'https://profiles.wordpress.org/ciphera/',
      'https://crates.io/crates/ciphera-tessera',
      'https://www.npmjs.com/package/@ciphera-net/tessera',
      'https://pkg.go.dev/github.com/ciphera-net/tessera-go',
      'https://docs.rs/ciphera-tessera',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://ciphera.net/#website',
    url: 'https://ciphera.net',
    name: 'Ciphera',
    publisher: { '@id': 'https://ciphera.net/#organization' },
  },
  {
    // The visible questions, word for word: FAQPage data must match what the page shows.
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
]

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(homepageSchemas) }} />
      <OverhaulHero chrome="barGlass" showBadge={false} below="globe-routes" />
      <WhatWeBuildB />
      <HowWeBuildM />
      <WhereDataLivesB />
      <OpenByDefault />
      <FromTheBlogB />
      <HomeFaq />
      <Closing />
    </>
  )
}
