import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckIcon, LockIcon, GlobeIcon, ArrowRightIcon } from '@ciphera-net/ui'

// * Icon aliases for consistent display
const ShieldIcon = LockIcon
const ChartIcon = GlobeIcon
const ZapIcon = LockIcon

export const metadata: Metadata = {
  title: 'Pulse - Privacy-First Website Analytics',
  description: 'Cookie-free website analytics with real-time dashboards, session replay, and geographic heatmaps. GDPR compliant by design. Under 1.6 KB tracking script.',
  alternates: {
    canonical: 'https://ciphera.net/products/pulse',
  },
  openGraph: {
    title: 'Pulse - Privacy-First Website Analytics',
    description: 'Cookie-free website analytics with real-time dashboards, session replay, and geographic heatmaps. GDPR compliant by design. Under 1.6 KB tracking script.',
    url: 'https://ciphera.net/products/pulse',
    siteName: 'Ciphera',
    images: [{ url: '/pulse_icon_no_margins.png', width: 512, height: 512, alt: 'Pulse - Privacy-First Website Analytics' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse - Privacy-First Website Analytics',
    description: 'Cookie-free website analytics with real-time dashboards, session replay, and geographic heatmaps. GDPR compliant by design.',
    images: ['/pulse_icon_no_margins.png'],
  },
}

const pulseSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Pulse',
    description: 'Privacy-respecting website analytics that gives you insights without compromising user privacy. GDPR compliant, no cookies, no tracking.',
    applicationCategory: 'AnalyticsApplication',
    operatingSystem: 'Web',
    url: 'https://pulse.ciphera.net',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'Ciphera', url: 'https://ciphera.net' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://ciphera.net/products' },
      { '@type': 'ListItem', position: 3, name: 'Pulse' },
    ],
  },
]

export default function PulsePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pulseSchema) }} />
      {/* * Hero */}
      <section className="section-padding pt-32">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40 flex items-center justify-center mx-auto mb-6 shadow-2xl p-3">
              <Image
                src="/pulse_icon_no_margins.png"
                alt="Pulse"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="badge-primary mb-4 inline-flex">Privacy-First Analytics</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
              Pulse
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              Get the insights you need without compromising user privacy. 
              No cookies, no tracking, just clean analytics that respect your visitors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://pulse.ciphera.net" className="btn-primary">
                Try Pulse
                <ArrowRightIcon className="w-4 h-4" />
              </a>
              <Link href="/contact" className="btn-secondary">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* * What is Pulse */}
      <section className="section-padding">
        <div className="section-container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
            What Is Pulse?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            Ciphera Pulse is a privacy-first website analytics platform that provides pageview tracking, referrer analysis, and geographic insights without using cookies, fingerprinting, or collecting any personal data as defined by GDPR Article 4. Unlike Google Analytics, which sets tracking cookies and builds cross-site behavioral profiles, Pulse treats each page view as an independent event with no persistent identifiers.
          </p>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            The Pulse tracking script is under 2KB gzipped — compared to Google Analytics at approximately 45KB and Segment at approximately 70KB. This means faster page loads and lower bandwidth consumption for your visitors. The script loads asynchronously and never blocks page rendering.
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            Because Pulse collects no personal data, it is GDPR compliant by architecture rather than by configuration. You do not need cookie consent banners for Pulse, you do not need a Data Processing Agreement, and you cannot receive data subject access requests because there are no data subjects in the dataset. IP addresses are used only for country-level geolocation at the edge and immediately discarded — they are never stored, logged, or written to disk.
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Pulse is open source and available on <a href="https://github.com/ciphera-net/pulse" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">GitHub</a>. All analytics data is processed on Swiss infrastructure protected by the Swiss Federal Act on Data Protection (FADP).
          </p>
        </div>
      </section>

      {/* * Features */}
      <section className="section-padding">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
            Analytics That Respect Privacy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldIcon, title: 'No Cookies', description: 'Track visitors without cookies or invasive tracking methods.' },
              { icon: LockIcon, title: 'GDPR Compliant', description: 'Built from the ground up to comply with privacy regulations.' },
              { icon: ChartIcon, title: 'Real-Time Insights', description: 'Monitor your website performance with live analytics data.' },
              { icon: ZapIcon, title: 'Lightweight', description: 'Minimal performance impact with our tiny tracking script.' },
            ].map((feature) => (
              <div key={feature.title} className="card p-6">
                <feature.icon className="w-12 h-12 text-brand-orange mb-4" />
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* * Key Metrics */}
      <section className="section-padding">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
            Essential Metrics Without Compromise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                What We Track
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Page views and unique visitors
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Referrer sources and UTM parameters
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Device type, browser, and OS
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Geographic location (country-level only)
                  </span>
                </li>
              </ul>
            </div>
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                What We Don't Track
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    No personal identification data
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    No cross-site tracking
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    No fingerprinting techniques
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    No sale of data to third parties
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* * Technical Specifications */}
      <section className="section-padding">
        <div className="section-container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
            Technical Specifications
          </h2>
          <div className="card p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {[
                    ['Script Size', 'Under 2KB gzipped'],
                    ['Loading Strategy', 'Async, non-blocking — never delays page rendering'],
                    ['Cookies', 'None — no first-party or third-party cookies'],
                    ['IP Handling', 'Used for country-level geo lookup at edge, then immediately discarded'],
                    ['Data Storage', 'Aggregated metrics only — no individual user records'],
                    ['Geolocation', 'Country-level only (no city, no precise coordinates)'],
                    ['Infrastructure', 'Swiss-hosted servers (FADP protected)'],
                    ['API', 'REST API for programmatic access to analytics data'],
                    ['Framework Support', 'Works with any framework: HTML, React, Next.js, Vue, Svelte, WordPress'],
                    ['Source Code', 'Open source — client and server on GitHub'],
                    ['Consent Required', 'No — exempt from ePrivacy cookie consent requirements'],
                    ['Pricing', 'Free tier available'],
                  ].map(([spec, value]) => (
                    <tr key={spec}>
                      <td className="py-3 pr-4 font-semibold text-neutral-900 dark:text-white whitespace-nowrap">{spec}</td>
                      <td className="py-3 text-neutral-600 dark:text-neutral-400">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* * Comparison */}
      <section className="section-padding">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 text-center">
            How Pulse Compares
          </h2>
          <p className="text-center text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-12">
            Google Analytics is installed on over 28 million websites, but it requires cookie consent banners in the EU and builds cross-site behavioral profiles. Pulse provides the metrics that drive product decisions without the surveillance trade-offs.
          </p>
          <div className="card p-8 max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left py-4 px-4 font-bold text-neutral-900 dark:text-white">Feature</th>
                    <th className="text-center py-4 px-4 font-bold text-brand-orange">Pulse</th>
                    <th className="text-center py-4 px-4 font-bold text-neutral-500 dark:text-neutral-400">Google Analytics</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['No cookies required', true, false],
                    ['GDPR compliant by default', true, false],
                    ['No consent banner needed', true, false],
                    ['Open source', true, false],
                    ['Script under 5KB', true, false],
                    ['Swiss infrastructure', true, false],
                    ['No cross-site tracking', true, false],
                  ].map(([feature, pulse, ga], index) => (
                    <tr key={index} className="border-b border-neutral-200 dark:border-neutral-800">
                      <td className="py-4 px-4 text-neutral-600 dark:text-neutral-400">{feature}</td>
                      <td className="text-center py-4 px-4">
                        {pulse ? <CheckIcon className="w-5 h-5 text-brand-orange mx-auto" /> : '—'}
                      </td>
                      <td className="text-center py-4 px-4 text-neutral-400">
                        {ga ? <CheckIcon className="w-5 h-5 mx-auto" /> : '—'}
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
              Start Tracking With Privacy
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Get started with Pulse today and respect your visitors' privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://pulse.ciphera.net" className="px-8 py-3.5 rounded-xl font-semibold bg-white text-brand-orange hover:bg-white/90 transition-all duration-200 inline-flex items-center gap-2">
                Get Started Free
              </a>
              <Link href="/contact" className="px-8 py-3.5 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-200 inline-flex items-center gap-2">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
