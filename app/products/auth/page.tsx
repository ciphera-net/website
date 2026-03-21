import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { UserIcon, CheckIcon, LockIcon, ArrowRightIcon } from '@ciphera-net/ui'
import { authIcon } from '@/lib/images'

// * Icon aliases for consistent display
const ShieldIcon = LockIcon
const KeyIcon = LockIcon

export const metadata: Metadata = {
  title: 'Ciphera Auth - Secure Identity Provider',
  description: 'Enterprise-grade authentication with OAuth2, JWT, and zero-knowledge principles. Double-hashed passwords (PBKDF2 + Argon2id) and two-factor authentication.',
  alternates: {
    canonical: 'https://ciphera.net/products/auth',
  },
  openGraph: {
    title: 'Ciphera Auth - Secure Identity Provider',
    description: 'Enterprise-grade authentication with OAuth2, JWT, and zero-knowledge principles. Double-hashed passwords (PBKDF2 + Argon2id) and two-factor authentication.',
    url: 'https://ciphera.net/products/auth',
    siteName: 'Ciphera',
    images: [{ url: '/auth_icon_no_margins.png', width: 512, height: 512, alt: 'Ciphera Auth - Secure Identity Provider' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ciphera Auth - Secure Identity Provider',
    description: 'Enterprise-grade authentication with OAuth2, JWT, and zero-knowledge principles. Double-hashed passwords and 2FA.',
    images: ['/auth_icon_no_margins.png'],
  },
}

const authSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ciphera Auth',
    description: 'Enterprise-grade authentication with OAuth2, JWT, and zero-knowledge principles. Secure identity management with double-hashed passwords and two-factor authentication.',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    url: 'https://auth.ciphera.net',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'Ciphera', url: 'https://ciphera.net' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://ciphera.net/products' },
      { '@type': 'ListItem', position: 3, name: 'Ciphera Auth' },
    ],
  },
]

export default function CipheraAuthPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authSchema) }} />
      {/* * Hero */}
      <section className="section-padding pt-32">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-3xl bg-neutral-800 ring-2 ring-brand-orange/40 flex items-center justify-center mx-auto mb-6 shadow-2xl p-3">
              <Image
                src={authIcon}
                alt="Ciphera Auth"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="badge-primary mb-4 inline-flex">Identity Provider</span>
            <h1 className="heading-1 mb-6">
              Ciphera Auth
            </h1>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
              Enterprise-grade authentication infrastructure with OAuth2, JWT tokens, and advanced security features. 
              Built for the Ciphera ecosystem and your applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://auth.ciphera.net" className="btn-primary">
                Try Ciphera Auth
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
          <h2 className="heading-2 mb-12 text-center">
            Enterprise Authentication Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: LockIcon, title: 'Double-Hashed Passwords', description: 'Passwords are hashed client-side before transmission, then hashed again server-side for maximum security.' },
              { icon: ShieldIcon, title: 'Two-Factor Authentication', description: 'Support for TOTP-based 2FA with app integrations and backup codes for account recovery.' },
              { icon: KeyIcon, title: 'OAuth2 & JWT', description: 'Industry-standard OAuth2 flows with JWT tokens for stateless authentication across services.' },
              { icon: UserIcon, title: 'Session Management', description: 'Manage active sessions, revoke tokens, and monitor login activity across devices.' },
              { icon: CheckIcon, title: 'Account Lockout', description: 'Automatic account protection against brute-force attacks with configurable lockout policies.' },
              { icon: ShieldIcon, title: 'Role-Based Access', description: 'Flexible permission system with roles and scopes for fine-grained access control.' },
            ].map((feature) => (
              <div key={feature.title} className="card p-6">
                <feature.icon className="w-12 h-12 text-brand-orange mb-4" />
                <h3 className="heading-3 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed">
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
            Built for Modern Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-8">
              <h3 className="heading-3 mb-4">
                For Developers
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-400">
                    RESTful API with comprehensive documentation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-400">
                    Client libraries for JavaScript, Python, and Go
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-400">
                    Webhook support for real-time event notifications
                  </span>
                </li>
              </ul>
            </div>
            <div className="card p-8">
              <h3 className="heading-3 mb-4">
                For Businesses
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-400">
                    SSO integration with existing identity providers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-400">
                    Audit logs and compliance reporting
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-400">
                    Enterprise-grade reliability and support
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* * CTA */}
      <section className="section-padding">
        <div className="section-container">
          <div className="w-full text-center bg-gradient-to-br from-brand-orange to-brand-orange-hover rounded-3xl px-6 sm:px-10 md:px-16 py-12 sm:py-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Secure Your Application?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Start with our free tier or contact us for enterprise pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://auth.ciphera.net" className="btn-white">
                Get Started Free
              </a>
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
