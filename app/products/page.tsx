import { Metadata } from 'next'
import Link from 'next/link'
import { FileTextIcon, PersonIcon, LockClosedIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons'

export const metadata: Metadata = {
  title: 'Products - Ciphera',
  description: 'Explore the Ciphera ecosystem of privacy-first applications and infrastructure services.',
}

const products = [
  {
    icon: FileTextIcon,
    name: 'Drop',
    description: 'Privacy-first file sharing with end-to-end encryption. Share files securely without compromising your privacy.',
    features: [
      'Client-side encryption (AES-256-GCM)',
      'Zero-knowledge architecture',
      'Secure link sharing with optional passwords',
      'File request functionality',
      'Configurable expiration times',
      'One-time download option',
    ],
    link: 'https://drop.ciphera.net',
    status: 'Available',
  },
  {
    icon: PersonIcon,
    name: 'Ciphera Auth',
    description: 'Centralized identity provider with secure authentication, OAuth flows, and JWT issuance for the Ciphera ecosystem.',
    features: [
      'Double-hashed passwords (PBKDF2 + Argon2id)',
      'JWT-based stateless authentication',
      'OAuth2 flows',
      'Email verification',
      'Account lockout protection',
      'Two-factor authentication support',
    ],
    link: '#',
    status: 'Available',
  },
  {
    icon: LockClosedIcon,
    name: 'Ciphera Captcha',
    description: 'Bot protection service with visual captchas and Proof-of-Work challenges to prevent automated abuse.',
    features: [
      'Visual alphanumeric captchas',
      'Proof-of-Work (PoW) challenges',
      'Stateless verification',
      'JWT-based tokens',
      'Configurable difficulty',
    ],
    link: '#',
    status: 'Available',
  },
  {
    icon: EnvelopeClosedIcon,
    name: 'Ciphera Relay',
    description: 'Self-hosted transactional email infrastructure for secure, privacy-first email delivery.',
    features: [
      'Stalwart Mail Server',
      'TLS 1.2/1.3 encryption',
      'SMTP AUTH required',
      'High deliverability',
      'Admin UI with SSH tunnel access',
    ],
    link: '#',
    status: 'Available',
  },
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
            Ciphera Products
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A comprehensive suite of privacy-first applications and infrastructure services
          </p>
        </div>

        <div className="space-y-16">
          {products.map((product, index) => {
            const Icon = product.icon
            return (
              <div
                key={product.name}
                className="bg-white dark:bg-neutral-900 p-8 md:p-12 rounded-3xl shadow-lg shadow-neutral-200/50 dark:shadow-black/50 border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-brand-orange/10 dark:bg-brand-orange/20 flex items-center justify-center">
                      <Icon className="w-10 h-10 text-brand-orange" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                          {product.name}
                        </h2>
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {product.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                        Key Features
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-400">
                            <svg className="w-5 h-5 text-brand-orange mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {product.link !== '#' ? (
                      <Link
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center"
                      >
                        Visit {product.name}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    ) : (
                      <span className="text-neutral-400 font-medium">
                        Documentation coming soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
