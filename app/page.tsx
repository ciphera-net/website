import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import FeatureSection from '../components/feature-section'
import ProductShowcase from '../components/ProductShowcase'
import SwissPrivacy from '../components/SwissPrivacy'
import FAQ from '../components/FAQ'
import ClosingCta from '../components/ClosingCta'
import { cdnUrl } from '@/lib/cdn'

// * JSON-LD structured data for homepage
const homepageSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://ciphera.net/#organization',
    name: 'Ciphera',
    alternateName: ['Ciphera BV'],
    legalName: 'Ciphera BV',
    vatID: 'BE1013721660',
    // * Machine-readable company identifiers. Google names iso6523 and naics as
    // * properties used "behind the scenes to disambiguate your organization from
    // * other organizations" — which is the whole problem here, given the several
    // * unrelated entities also called Ciphera. ICD 0208 is the Belgian KBO/BCE
    // * scheme (Peppol code list); companyweb.be publishes the identical PEPPOL ID.
    iso6523Code: '0208:1013721660',
    naics: '541511',
    url: 'https://ciphera.net',
    logo: {
      '@type': 'ImageObject',
      url: cdnUrl('/ciphera_logo_no_margins.png'),
    },
    description: 'Privacy-first infrastructure and applications built on zero-knowledge principles',
    disambiguatingDescription:
      'Ciphera (Ciphera BV) is a Belgian privacy-infrastructure company behind Pulse cookieless analytics, Ciphera ID, Ciphera Captcha, Ciphera Relay, and the open-source Tessera authentication library. Not affiliated with other companies, apps, or fictional characters sharing the Ciphera name.',
    foundingDate: '2024-09-18',
    foundingLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressCountry: 'BE' },
    },
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
    // * Every URL here was confirmed to exist before being added — a sameAs
    // * pointing at a dead page weakens the entity cluster rather than
    // * corroborating it. crates.io and npmjs.com both sit behind bot
    // * protection (404 / Cloudflare "Just a moment..." to a plain fetch), so
    // * they were confirmed two other ways: browser-header request returning
    // * 200, and their registry APIs, which are the canonical source and are
    // * never gated. Package registries are corroboration a namesake cannot
    // * fake — they are tied to published artifacts, not to a claim.
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
