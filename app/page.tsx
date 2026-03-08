import Hero from '../components/Hero'
import Ecosystem from '../components/Ecosystem'
import Philosophy from '../components/Philosophy'
import EnhancedFAQ from '../components/EnhancedFAQ'
import Newsletter from '../components/Newsletter'

// * JSON-LD structured data for homepage
const homepageSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ciphera',
    url: 'https://ciphera.net',
    description: 'Where Privacy Still Exists. Ciphera provides privacy-first infrastructure and applications built on zero-knowledge principles.',
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
    url: 'https://ciphera.net',
    logo: {
      '@type': 'ImageObject',
      url: 'https://ciphera.net/ciphera_logo_no_margins.png',
    },
    description: 'Privacy-first infrastructure and applications built on zero-knowledge principles',
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
    sameAs: ['https://github.com/ciphera-net', 'https://x.com/CipheraNET'],
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
      <Hero />
      <Ecosystem />
      <Philosophy />
      <EnhancedFAQ />
      <Newsletter />
    </>
  )
}
