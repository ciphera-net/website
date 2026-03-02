import Hero from '../components/Hero'
import Ecosystem from '../components/Ecosystem'
import Features from '../components/Features'
import Philosophy from '../components/Philosophy'
import Products from '../components/Products'
import EnhancedFAQ from '../components/EnhancedFAQ'
import Newsletter from '../components/Newsletter'

// * JSON-LD structured data for homepage
const homepageSchema = {
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
}

export default function HomePage() {
  return (
    <>
      {/* * JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />
      <Hero />
      <Ecosystem />
      <Features />
      <Philosophy />
      <Products />
      <EnhancedFAQ />
      <Newsletter />
    </>
  )
}
