import { Metadata } from 'next'
import Link from 'next/link'
import { UserIcon, CheckIcon, LockIcon, ArrowRightIcon } from '@ciphera-net/ui'

// * Icon aliases for consistent display
const ShieldIcon = LockIcon
const KeyIcon = LockIcon

export const metadata: Metadata = {
  title: 'Ciphera Auth - Secure Identity Provider | Ciphera',
  description: 'Enterprise-grade authentication with OAuth2, JWT, and zero-knowledge principles. Secure identity management with double-hashed passwords and two-factor authentication.',
}

export default function CipheraAuthPage() {
  return (
    <>
      {/* * Hero */}
      <section className="section-padding pt-32 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-neutral-500 to-neutral-700 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <span className="badge-primary mb-4 inline-flex">Identity Provider</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
              Ciphera Auth
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
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
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
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
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
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
            Built for Modern Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                For Developers
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    RESTful API with comprehensive documentation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Client libraries for JavaScript, Python, and Go
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Webhook support for real-time event notifications
                  </span>
                </li>
              </ul>
            </div>
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                For Businesses
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    SSO integration with existing identity providers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Audit logs and compliance reporting
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    99.9% uptime SLA with 24/7 support
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
          <div className="card p-12 text-center max-w-3xl mx-auto bg-gradient-to-br from-brand-orange to-brand-orange-hover text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Secure Your Application?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Start with our free tier or contact us for enterprise pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://auth.ciphera.net" className="btn bg-white text-brand-orange hover:bg-white/90">
                Get Started Free
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
