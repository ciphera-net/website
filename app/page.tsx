import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import FeatureSection from '../components/feature-section'
import ProductShowcase from '../components/ProductShowcase'
import SwissPrivacy from '../components/SwissPrivacy'
import FAQ from '../components/FAQ'
import ClosingCta from '../components/ClosingCta'

// * JSON-LD structured data for homepage
const homepageSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ciphera',
    url: 'https://ciphera.net',
    description: 'Built for privacy. Ciphera provides privacy-first infrastructure and applications built on zero-knowledge principles.',
    publisher: {
      '@type': 'Organization',
      name: 'Ciphera',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ciphera.net/ciphera_logo_no_margins.png',
      },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://ciphera.net/#organization',
    name: 'Ciphera',
    legalName: 'Ciphera BV',
    vatID: 'BE1013721660',
    url: 'https://ciphera.net',
    logo: {
      '@type': 'ImageObject',
      url: 'https://ciphera.net/ciphera_logo_no_margins.png',
    },
    description: 'Privacy-first infrastructure and applications built on zero-knowledge principles',
    disambiguatingDescription:
      'Ciphera (Ciphera BV) is a Belgian privacy-infrastructure company behind Pulse cookieless analytics, Ciphera ID, Ciphera Captcha, Ciphera Relay, and the open-source Tessera authentication library. Not affiliated with other companies, apps, or fictional characters sharing the Ciphera name.',
    foundingDate: '2024-01-01',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'De Kleetlaan 2',
      addressLocality: 'Diegem',
      postalCode: '1831',
      addressCountry: 'BE',
    },
    telephone: '+3278480710',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@ciphera.net',
      contactType: 'customer service',
    },
    sameAs: [
      'https://github.com/ciphera-net',
      'https://x.com/CipheraNET',
      'https://www.linkedin.com/company/ciphera/',
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
]

export default function HomePage() {
  return (
    <>
      {/* * JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchemas) }}
      />
      {/* Rails now live in the root layout (app/layout.tsx) so every page
          inherits the continuous header→footer frame. Sections provide their
          own horizontal hairlines via border-b. */}
      <Hero />
      <TrustStrip />
      <FeatureSection />
      <ProductShowcase />
      <SwissPrivacy />
      <FAQ />
      <ClosingCta />
    </>
  )
}
