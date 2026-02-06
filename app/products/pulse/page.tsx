import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckIcon, LockIcon, GlobeIcon, ArrowRightIcon } from '@ciphera-net/ui'

// * Icon aliases for consistent display
const ShieldIcon = LockIcon
const ChartIcon = GlobeIcon
const ZapIcon = LockIcon

export const metadata: Metadata = {
  title: 'Pulse - Privacy-First Analytics | Ciphera',
  description: 'Privacy-respecting website analytics that gives you insights without compromising user privacy. GDPR compliant, no cookies, no tracking.',
}

export default function PulsePage() {
  return (
    <>
      {/* * Hero */}
      <section className="section-padding pt-32 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
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
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
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

      {/* * Comparison */}
      <section className="section-padding">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
            Why Choose Pulse?
          </h2>
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
                    ['Privacy-respecting', true, false],
                    ['Lightweight script', true, false],
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
          <div className="card p-12 text-center max-w-3xl mx-auto bg-gradient-to-br from-brand-orange to-brand-orange-hover text-white">
            <h2 className="text-3xl font-bold mb-4">
              Start Tracking With Privacy
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Get started with Pulse today and respect your visitors' privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://pulse.ciphera.net" className="btn bg-white text-brand-orange hover:bg-white/90">
                Get Started Free
              </a>
              <Link href="/contact" className="btn bg-white/10 text-white hover:bg-white/20 border-white/20">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
