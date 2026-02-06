import { Metadata } from 'next'
import Link from 'next/link'
import { CheckIcon, XIcon, ArrowRightIcon } from '@ciphera-net/ui'

export const metadata: Metadata = {
  title: 'Ciphera vs Competitors - Privacy-First File Sharing Comparison | Ciphera',
  description: 'See how Ciphera compares to other file sharing and privacy solutions. Zero-knowledge encryption, Swiss infrastructure, and open source.',
}

const comparisonData = {
  categories: [
    {
      name: 'Security & Privacy',
      features: [
        { name: 'Zero-knowledge encryption', ciphera: true, dropbox: false, gdrive: false, proton: true, tresorit: true },
        { name: 'End-to-end encryption', ciphera: true, dropbox: false, gdrive: false, proton: true, tresorit: true },
        { name: 'Client-side encryption', ciphera: true, dropbox: false, gdrive: false, proton: true, tresorit: true },
        { name: 'No tracking/analytics', ciphera: true, dropbox: false, gdrive: false, proton: true, tresorit: false },
        { name: 'Swiss data protection', ciphera: true, dropbox: false, gdrive: false, proton: true, tresorit: false },
      ],
    },
    {
      name: 'Transparency',
      features: [
        { name: 'Open source client', ciphera: true, dropbox: false, gdrive: false, proton: true, tresorit: false },
        { name: 'Open source server', ciphera: true, dropbox: false, gdrive: false, proton: false, tresorit: false },
        { name: 'Security audits', ciphera: true, dropbox: true, gdrive: true, proton: true, tresorit: true },
        { name: 'Publicly verifiable encryption', ciphera: true, dropbox: false, gdrive: false, proton: true, tresorit: false },
      ],
    },
    {
      name: 'Features',
      features: [
        { name: 'Password protection', ciphera: true, dropbox: true, gdrive: false, proton: true, tresorit: true },
        { name: 'Expiring links', ciphera: true, dropbox: true, gdrive: false, proton: true, tresorit: true },
        { name: 'File versioning', ciphera: false, dropbox: true, gdrive: true, proton: true, tresorit: true },
        { name: 'Team collaboration', ciphera: false, dropbox: true, gdrive: true, proton: true, tresorit: true },
      ],
    },
    {
      name: 'Pricing',
      features: [
        { name: 'Free tier available', ciphera: true, dropbox: true, gdrive: true, proton: true, tresorit: true },
        { name: 'Free tier file size (max)', ciphera: '5GB', dropbox: '2GB', gdrive: '15GB', proton: '1GB', tresorit: '5GB' },
        { name: 'Free tier storage', ciphera: 'Unlimited', dropbox: '2GB', gdrive: '15GB', proton: '5GB', tresorit: '5GB' },
      ],
    },
  ],
}

const competitors = [
  { id: 'ciphera', name: 'Ciphera', highlight: true },
  { id: 'dropbox', name: 'Dropbox' },
  { id: 'gdrive', name: 'Google Drive' },
  { id: 'proton', name: 'Proton Drive' },
  { id: 'tresorit', name: 'Tresorit' },
]

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <CheckIcon className="w-6 h-6 text-brand-orange mx-auto" />
    ) : (
      <XIcon className="w-6 h-6 text-neutral-400 mx-auto" />
    )
  }
  return <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{value}</span>
}

export default function ComparisonPage() {
  return (
    <>
      {/* * Hero */}
      <section className="section-padding pt-32 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="badge-primary mb-4 inline-flex">Comparison</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
              Why Choose Ciphera?
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              See how Ciphera's zero-knowledge architecture and open-source approach compare to other file sharing solutions.
            </p>
          </div>
        </div>
      </section>

      {/* * Comparison Table */}
      <section className="section-padding">
        <div className="section-container">
          <div className="overflow-x-auto">
            {comparisonData.categories.map((category, categoryIndex) => (
              <div key={category.name} className={categoryIndex > 0 ? 'mt-12' : ''}>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                  {category.name}
                </h2>
                <div className="card p-0 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800">
                        <th className="text-left py-4 px-4 sm:px-6 font-bold text-neutral-900 dark:text-white min-w-[200px]">
                          Feature
                        </th>
                        {competitors.map((competitor) => (
                          <th
                            key={competitor.id}
                            className={`text-center py-4 px-3 sm:px-4 font-bold min-w-[100px] ${
                              competitor.highlight
                                ? 'text-brand-orange bg-brand-orange/5'
                                : 'text-neutral-700 dark:text-neutral-300'
                            }`}
                          >
                            {competitor.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {category.features.map((feature, index) => (
                        <tr
                          key={index}
                          className="border-b border-neutral-200 dark:border-neutral-800 last:border-0"
                        >
                          <td className="py-4 px-4 sm:px-6 text-neutral-700 dark:text-neutral-300 font-medium">
                            {feature.name}
                          </td>
                          {competitors.map((competitor) => (
                            <td
                              key={competitor.id}
                              className={`text-center py-4 px-3 sm:px-4 ${
                                competitor.highlight ? 'bg-brand-orange/5' : ''
                              }`}
                            >
                              <CellValue
                                value={feature[competitor.id as keyof typeof feature] as boolean | string}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* * Key Differentiators */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
              What Makes Ciphera Different?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Fully Open Source',
                  description: 'Both client and server code are open source. Verify our security claims yourself.',
                },
                {
                  title: 'True Zero-Knowledge',
                  description: 'We mathematically cannot access your data. Your encryption keys never leave your device.',
                },
                {
                  title: 'Privacy by Design',
                  description: 'No tracking, no analytics, no data collection. Swiss infrastructure with strong privacy laws.',
                },
              ].map((item) => (
                <div key={item.title} className="card p-6">
                  <CheckIcon className="w-12 h-12 text-brand-orange mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* * CTA */}
      <section className="section-padding bg-gradient-to-br from-brand-orange to-brand-orange-hover">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience True Privacy?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Start using Ciphera Drop today with 5GB file sharing, completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://drop.ciphera.net" className="btn bg-white text-brand-orange hover:bg-white/90">
                Try Drop Free
                <ArrowRightIcon className="w-4 h-4" />
              </a>
              <Link href="/products" className="btn bg-white/10 text-white hover:bg-white/20 border-white/20">
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
