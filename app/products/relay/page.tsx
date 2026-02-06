import { Metadata } from 'next'
import Link from 'next/link'
import { MailIcon, CheckIcon, GlobeIcon, LockIcon, ArrowRightIcon } from '@ciphera-net/ui'

// * Icon aliases for consistent display
const ShieldIcon = LockIcon
const ZapIcon = LockIcon

export const metadata: Metadata = {
  title: 'Ciphera Relay - Secure Email Infrastructure | Ciphera',
  description: 'Privacy-first transactional email delivery with TLS encryption. High deliverability rates for verification emails, notifications, and alerts.',
}

export default function CipheraRelayPage() {
  return (
    <>
      {/* * Hero */}
      <section className="section-padding pt-32 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40 flex items-center justify-center mx-auto mb-6 shadow-2xl p-3">
              <MailIcon className="w-10 h-10 text-brand-orange" />
            </div>
            <span className="badge-primary mb-4 inline-flex">Email Infrastructure</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
              Ciphera Relay
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              Secure, privacy-first email infrastructure for transactional emails. 
              High deliverability with TLS encryption and Swiss data protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="btn-primary">
                Try Ciphera Relay
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
            Enterprise Email Delivery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldIcon, title: 'TLS Encryption', description: 'All emails are transmitted with TLS 1.3 encryption for maximum security.' },
              { icon: ZapIcon, title: 'High Deliverability', description: 'Optimized routing and reputation management ensure your emails reach inboxes.' },
              { icon: MailIcon, title: 'SMTP AUTH', description: 'Industry-standard SMTP with authentication for secure email sending.' },
              { icon: GlobeIcon, title: 'Admin Dashboard', description: 'Monitor delivery rates, track bounces, and manage your email infrastructure.' },
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

      {/* * Use Cases */}
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
            Perfect for Transactional Emails
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Verification Emails',
                description: 'Send account verification and password reset emails with high deliverability.',
                examples: ['Email verification', 'Password resets', 'Magic links'],
              },
              {
                title: 'Notifications',
                description: 'Keep users informed with real-time email notifications for important events.',
                examples: ['Security alerts', 'Activity updates', 'Status changes'],
              },
              {
                title: 'Alerts & Reports',
                description: 'Deliver critical alerts and scheduled reports directly to user inboxes.',
                examples: ['System alerts', 'Daily summaries', 'Performance reports'],
              },
            ].map((useCase) => (
              <div key={useCase.title} className="card p-6">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  {useCase.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                  {useCase.description}
                </p>
                <ul className="space-y-2">
                  {useCase.examples.map((example) => (
                    <li key={example} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                      <CheckIcon className="w-4 h-4 text-brand-orange shrink-0" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* * Pricing Preview */}
      <section className="section-padding">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: 'Free', emails: '1,000', features: ['1,000 emails/month', 'TLS encryption', 'Basic support', 'Admin dashboard'] },
              { name: 'Pro', price: '$29', emails: '50,000', features: ['50,000 emails/month', 'Priority delivery', 'Email support', 'Advanced analytics'], highlight: true },
              { name: 'Enterprise', price: 'Custom', emails: 'Unlimited', features: ['Unlimited emails', 'Dedicated IP', '24/7 support', 'SLA guarantee'] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`card p-8 ${plan.highlight ? 'ring-2 ring-brand-orange' : ''}`}
              >
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-brand-orange mb-1">
                  {plan.price}
                  {plan.price !== 'Free' && plan.price !== 'Custom' && <span className="text-lg text-neutral-500">/mo</span>}
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6">{plan.emails} emails/month</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={plan.highlight ? 'btn-primary w-full' : 'btn-secondary w-full'}>
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* * CTA */}
      <section className="section-padding bg-gradient-to-br from-brand-orange to-brand-orange-hover">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Start Sending Secure Emails
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join thousands of developers using Ciphera Relay for their transactional emails.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="btn bg-white text-brand-orange hover:bg-white/90">
                Start Free Trial
              </a>
              <Link href="/contact" className="btn bg-white/10 text-white hover:bg-white/20 border-white/20">
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
