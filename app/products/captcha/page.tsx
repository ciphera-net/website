import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { LockIcon, CheckIcon, ArrowRightIcon } from '@ciphera-net/ui'
import { captchaIcon } from '@/lib/images'

// * Icon aliases for consistent display
const ShieldIcon = LockIcon
const ZapIcon = LockIcon

export const metadata: Metadata = {
  title: 'Ciphera Captcha - Privacy-First Bot Protection',
  description: 'Protect your applications from bots with visual captchas and proof-of-work challenges. Privacy-respecting, stateless verification with JWT tokens.',
  alternates: {
    canonical: 'https://ciphera.net/products/captcha',
  },
  openGraph: {
    title: 'Ciphera Captcha - Privacy-First Bot Protection',
    description: 'Protect your applications from bots with visual captchas and proof-of-work challenges. Privacy-respecting, stateless verification with JWT tokens.',
    url: 'https://ciphera.net/products/captcha',
    siteName: 'Ciphera',
    images: [{ url: '/captcha_icon_no_margins.png', width: 512, height: 512, alt: 'Ciphera Captcha - Privacy-First Bot Protection' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ciphera Captcha - Privacy-First Bot Protection',
    description: 'Protect your applications from bots with visual captchas and proof-of-work challenges. Stateless JWT verification.',
    images: ['/captcha_icon_no_margins.png'],
  },
}

const captchaSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ciphera Captcha',
    description: 'Protect your applications from bots with visual captchas and proof-of-work challenges. Privacy-respecting, stateless verification with JWT tokens.',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    url: 'https://ciphera.net/products/captcha',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'Ciphera', url: 'https://ciphera.net' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://ciphera.net/products' },
      { '@type': 'ListItem', position: 3, name: 'Ciphera Captcha' },
    ],
  },
]

export default function CipheraCaptchaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(captchaSchema) }} />
      {/* * Hero */}
      <section className="section-padding pt-32">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-3xl bg-neutral-800 ring-2 ring-brand-orange/40 flex items-center justify-center mx-auto mb-6 shadow-2xl p-3">
              <Image
                src={captchaIcon}
                alt="Ciphera Captcha"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <span className="badge-primary mb-4 inline-flex">Bot Protection</span>
            <h1 className="heading-1 mb-6">
              Ciphera Captcha
            </h1>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
              Privacy-respecting bot protection with visual captchas and proof-of-work challenges. 
              Stop automated abuse without compromising user privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Try Ciphera Captcha
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* * Features */}
      <section className="section-padding">
        <div className="section-container">
          <h2 className="heading-2 mb-12 text-center">
            Intelligent Bot Protection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: LockIcon, title: 'Visual Captchas', description: 'Human-friendly image and text-based challenges with accessibility support.' },
              { icon: ZapIcon, title: 'Proof-of-Work', description: 'CPU-based challenges that are costly for bots but instant for real users.' },
              { icon: ShieldIcon, title: 'Stateless Verification', description: 'JWT-based verification with no server-side session storage required.' },
              { icon: CheckIcon, title: 'Adaptive Difficulty', description: 'Automatically adjusts challenge difficulty based on threat level.' },
            ].map((feature) => (
              <div key={feature.title} className="card p-6">
                <feature.icon className="w-12 h-12 text-brand-orange mb-4" />
                <h3 className="heading-3 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* * Comparison */}
      <section className="section-padding">
        <div className="section-container">
          <h2 className="heading-2 mb-12 text-center">
            Why Choose Ciphera Captcha?
          </h2>
          <div className="card p-8 max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="text-left py-4 px-4 font-bold text-white">Feature</th>
                    <th className="text-center py-4 px-4 font-bold text-brand-orange">Ciphera</th>
                    <th className="text-center py-4 px-4 font-bold text-neutral-400">Others</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Privacy-respecting', true, false],
                    ['No tracking', true, false],
                    ['Self-hosted option', true, false],
                    ['Open source', true, false],
                    ['Stateless verification', true, false],
                  ].map(([feature, ciphera, others], index) => (
                    <tr key={index} className="border-b border-neutral-800">
                      <td className="py-4 px-4 text-neutral-400">{feature}</td>
                      <td className="text-center py-4 px-4">
                        {ciphera ? <CheckIcon className="w-5 h-5 text-brand-orange mx-auto" /> : '—'}
                      </td>
                      <td className="text-center py-4 px-4 text-neutral-400">
                        {others ? <CheckIcon className="w-5 h-5 mx-auto" /> : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* * CTA */}
      <section className="section-padding">
        <div className="section-container">
          <div className="w-full text-center bg-gradient-to-br from-brand-orange to-brand-orange-hover rounded-3xl px-6 sm:px-10 md:px-16 py-12 sm:py-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Protect Your Application Today
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Start blocking bots with privacy-respecting challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-white">
                Get Started Free
              </Link>
              <Link href="/contact" className="btn-white-outline">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
