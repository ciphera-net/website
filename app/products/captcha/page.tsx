import { Metadata } from 'next'
import Link from 'next/link'
import { LockIcon, CheckIcon, ArrowRightIcon } from '@ciphera-net/ui'

// * Icon aliases for consistent display
const ShieldIcon = LockIcon
const ZapIcon = LockIcon

export const metadata: Metadata = {
  title: 'Ciphera Captcha - Privacy-First Bot Protection | Ciphera',
  description: 'Protect your applications from bots with visual captchas and proof-of-work challenges. Privacy-respecting, stateless verification with JWT tokens.',
}

export default function CipheraCaptchaPage() {
  return (
    <>
      {/* * Hero */}
      <section className="section-padding pt-32 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-neutral-500 to-neutral-700 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <LockIcon className="w-10 h-10 text-white" />
            </div>
            <span className="badge-primary mb-4 inline-flex">Bot Protection</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
              Ciphera Captcha
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              Privacy-respecting bot protection with visual captchas and proof-of-work challenges. 
              Stop automated abuse without compromising user privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="btn-primary">
                Try Ciphera Captcha
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

      {/* * Comparison */}
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
            Why Choose Ciphera Captcha?
          </h2>
          <div className="card p-8 max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left py-4 px-4 font-bold text-neutral-900 dark:text-white">Feature</th>
                    <th className="text-center py-4 px-4 font-bold text-brand-orange">Ciphera</th>
                    <th className="text-center py-4 px-4 font-bold text-neutral-500 dark:text-neutral-400">Others</th>
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
                    <tr key={index} className="border-b border-neutral-200 dark:border-neutral-800">
                      <td className="py-4 px-4 text-neutral-600 dark:text-neutral-400">{feature}</td>
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
          <div className="card p-12 text-center max-w-3xl mx-auto bg-gradient-to-br from-brand-orange to-brand-orange-hover text-white">
            <h2 className="text-3xl font-bold mb-4">
              Protect Your Application Today
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Start blocking bots with privacy-respecting challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="btn bg-white text-brand-orange hover:bg-white/90">
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
