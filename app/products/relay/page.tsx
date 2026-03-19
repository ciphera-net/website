import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MailIcon, CheckIcon, GlobeIcon, LockIcon, ArrowRightIcon } from '@ciphera-net/ui'

// * Icon aliases for consistent display
const ShieldIcon = LockIcon
const ZapIcon = LockIcon

export const metadata: Metadata = {
  title: 'Ciphera Relay - Secure Email Infrastructure',
  description: 'Privacy-first transactional email delivery with TLS 1.2/1.3 encryption, DKIM, SPF, and DMARC. High deliverability for verification emails and notifications.',
  alternates: {
    canonical: 'https://ciphera.net/products/relay',
  },
  openGraph: {
    title: 'Ciphera Relay - Secure Email Infrastructure',
    description: 'Privacy-first transactional email delivery with TLS 1.2/1.3 encryption, DKIM, SPF, and DMARC. High deliverability for verification emails and notifications.',
    url: 'https://ciphera.net/products/relay',
    siteName: 'Ciphera',
    images: [{ url: '/relay_icon_no_margins.png', width: 512, height: 512, alt: 'Ciphera Relay - Secure Email Infrastructure' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ciphera Relay - Secure Email Infrastructure',
    description: 'Privacy-first transactional email delivery with TLS encryption, DKIM, SPF, and DMARC.',
    images: ['/relay_icon_no_margins.png'],
  },
}

const relaySchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ciphera Relay',
    description: 'Privacy-first transactional email delivery with TLS encryption. High deliverability rates for verification emails, notifications, and alerts.',
    applicationCategory: 'CommunicationApplication',
    operatingSystem: 'Web',
    offers: [
      { '@type': 'Offer', name: 'Starter', price: '0', priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Pro', price: '29', priceCurrency: 'USD' },
    ],
    provider: { '@type': 'Organization', name: 'Ciphera', url: 'https://ciphera.net' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://ciphera.net/products' },
      { '@type': 'ListItem', position: 3, name: 'Ciphera Relay' },
    ],
  },
]

export default function CipheraRelayPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(relaySchema) }} />
      {/* * Hero */}
      <section className="section-padding pt-32">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-3xl bg-neutral-800 ring-2 ring-brand-orange/40 flex items-center justify-center mx-auto mb-6 shadow-2xl p-3">
              <Image
                src="/relay_icon_no_margins.png"
                alt="Ciphera Relay - Secure email infrastructure"
                width={56}
                height={56}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="badge-primary mb-4 inline-flex">Email Infrastructure</span>
            <h1 className="heading-1 mb-6">
              Ciphera Relay
            </h1>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
              Secure, privacy-first email infrastructure for transactional emails. 
              High deliverability with TLS encryption and Swiss data protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Try Ciphera Relay
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

      {/* * Use Cases */}
      <section className="section-padding">
        <div className="section-container">
          <h2 className="heading-2 mb-12 text-center">
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
                <h3 className="heading-3 mb-3">
                  {useCase.title}
                </h3>
                <p className="text-neutral-400 mb-4 leading-relaxed">
                  {useCase.description}
                </p>
                <ul className="space-y-2">
                  {useCase.examples.map((example) => (
                    <li key={example} className="flex items-center gap-2 text-sm text-neutral-400">
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
          <h2 className="heading-2 mb-12 text-center">
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
                <h3 className="heading-3 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-brand-orange mb-1">
                  {plan.price}
                  {plan.price !== 'Free' && plan.price !== 'Custom' && <span className="text-lg text-neutral-500">/mo</span>}
                </div>
                <p className="text-neutral-400 mb-6">{plan.emails} emails/month</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-400">
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
      <section className="section-padding">
        <div className="section-container">
          <div className="w-full text-center bg-gradient-to-br from-brand-orange to-brand-orange-hover rounded-3xl px-6 sm:px-10 md:px-16 py-12 sm:py-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start Sending Secure Emails
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Get started with Ciphera Relay for your transactional emails.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-white">
                Start Free Trial
              </Link>
              <Link href="/contact" className="btn-white-outline">
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
