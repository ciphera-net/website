'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { UserIcon, LockIcon, MailIcon, ArrowRightIcon, CheckIcon } from '@ciphera-net/ui'
import Breadcrumbs from '../../components/Breadcrumbs'
import { track } from '../../lib/pulse'

const products = [
  {
    icon: '/pulse_icon_no_margins.png',
    isImage: true,
    name: 'Pulse',
    tagline: 'Privacy-first analytics & replay',
    description: 'Real-time user insights and session replay without compromising user privacy. Visualize user journeys and debug issues instantly. Built for privacy advocates who need analytics.',
    features: [
      'Session replay with privacy filters',
      'Geographic heatmaps',
      'Real-time traffic monitoring',
      'Privacy-preserving data collection',
      'Custom event tracking',
      'Team collaboration features',
    ],
    link: '/products/pulse',
    iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40',
    status: 'Available',
    highlight: true,
  },
  {
    icon: '/drop_icon_no_margins.png',
    isImage: true,
    name: 'Drop',
    tagline: 'Secure file sharing',
    description: 'Privacy-first file sharing with end-to-end encryption. Share files securely without compromising your privacy. Your files are encrypted before they leave your device.',
    features: [
      'Client-side encryption (AES-256-GCM)',
      'Zero-knowledge architecture',
      'Secure link sharing with optional passwords',
      'File request functionality',
      'Configurable expiration times',
      'One-time download option',
    ],
    link: '/products/drop',
    iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40',
    status: 'Available',
    highlight: false,
  },
  {
    icon: '/auth_icon_no_margins.png',
    isImage: true,
    name: 'Ciphera Auth',
    tagline: 'Identity provider',
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
    iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40',
    status: 'Available',
    highlight: false,
  },
  {
    icon: '/captcha_icon_no_margins.png',
    isImage: true,
    name: 'Ciphera Captcha',
    tagline: 'Bot protection',
    description: 'Bot protection service with visual captchas and Proof-of-Work challenges to prevent automated abuse.',
    features: [
      'Visual alphanumeric captchas',
      'Proof-of-Work (PoW) challenges',
      'Stateless verification',
      'JWT-based tokens',
      'Configurable difficulty',
    ],
    link: '#',
    iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40',
    status: 'Available',
    highlight: false,
  },
  {
    icon: MailIcon,
    isImage: false,
    name: 'Ciphera Relay',
    tagline: 'Email infrastructure',
    description: 'Transactional email infrastructure for secure, privacy-first email delivery with TLS encryption.',
    features: [
      'Stalwart Mail Server',
      'TLS 1.2/1.3 encryption',
      'SMTP AUTH required',
      'High deliverability',
      'Admin UI with secure access',
    ],
    link: '#',
    iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40',
    status: 'Available',
    highlight: false,
  },
]

// * JSON-LD structured data for products
const productsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Ciphera Products',
  description: 'Privacy-first applications and infrastructure services',
  itemListElement: [
    {
      '@type': 'SoftwareApplication',
      name: 'Pulse',
      description: 'Privacy-first analytics and session replay without compromising user privacy',
      applicationCategory: 'AnalyticsApplication',
      operatingSystem: 'Web',
      url: 'https://pulse.ciphera.net',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Drop',
      description: 'Privacy-first file sharing with end-to-end encryption',
      applicationCategory: 'FileSharingApplication',
      operatingSystem: 'Web',
      url: 'https://drop.ciphera.net',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Ciphera Auth',
      description: 'Centralized identity provider with secure authentication',
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Web',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Ciphera Captcha',
      description: 'Bot protection service with visual captchas and Proof-of-Work challenges',
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Web',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Ciphera Relay',
      description: 'Transactional email infrastructure for secure, privacy-first email delivery',
      applicationCategory: 'CommunicationApplication',
      operatingSystem: 'Web',
    },
  ],
}

export default function ProductsPage() {
  return (
    <>
      {/* * JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
      />
      <Breadcrumbs items={[{ label: 'Products' }]} />
      {/* * Hero Section */}
      <section className="relative section-padding overflow-hidden">
        {/* * Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-brand-orange/10 rounded-full blur-[128px] opacity-50" />
          <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] bg-neutral-500/10 dark:bg-neutral-400/10 rounded-full blur-[128px] opacity-30" />
        </div>

        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="badge-primary mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              Our Ecosystem
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tight">
              Privacy-first{' '}
              <span className="gradient-text">applications</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
              A comprehensive suite of tools designed to protect your privacy. 
              Each product works standalone or as part of the Ciphera ecosystem. 
              Looking for <a href="/companies" className="link">enterprise solutions</a>? We offer privacy-first infrastructure for businesses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* * Featured Product - Pulse */}
      <section className="section-container pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand-orange/10 via-brand-orange/5 to-transparent border border-brand-orange/20 dark:border-brand-orange/30 p-6 sm:p-8 md:p-12">
            {/* * Background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/20 dark:bg-brand-orange/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40 flex items-center justify-center shadow-lg p-3">
                    <Image
                      src="/pulse_icon_no_margins.png"
                      alt="Pulse - Privacy-first analytics and session replay logo"
                      width={40}
                      height={40}
                      loading="lazy"
                      unoptimized
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Pulse</h2>
                    <p className="text-neutral-500 dark:text-neutral-400">Privacy-First Analytics</p>
                  </div>
                  <span className="badge-neutral-status text-[10px] ml-auto">Available</span>
                </div>

                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                  {products[0].description}
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {products[0].features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-400">
                      <CheckIcon className="w-5 h-5 text-brand-orange mt-0.5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/products/pulse"
                  className="btn-primary inline-flex"
                  onClick={() => track('product_view_pulse')}
                >
                  Learn More
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="hidden lg:block">
                <div className="relative aspect-square max-w-sm mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-brand-orange-hover/20 dark:from-brand-orange/15 dark:to-brand-orange-hover/15 rounded-3xl blur-2xl" />
                  <div className="relative w-full h-full rounded-3xl bg-white/5 dark:bg-white/5 border border-white/10 flex items-center justify-center">
                    <Image
                      src="/pulse_icon_no_margins.png"
                      alt="Pulse - Privacy-first analytics and session replay platform"
                      width={200}
                      height={200}
                      loading="lazy"
                      unoptimized
                      className="w-48 h-48 object-contain opacity-80"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* * Infrastructure Services */}
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="badge-neutral mb-4 inline-flex">Infrastructure</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              The foundation of privacy
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Our infrastructure services power the Ciphera ecosystem, providing secure authentication, bot protection, and email delivery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {products.slice(1).map((product, index) => {
              const Icon = product.icon as React.ComponentType<{ className?: string }>
              return (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full card card-hover p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${product.iconBg} flex items-center justify-center shadow-lg p-2`}>
                        {product.isImage ? (
                          <Image 
                            src={product.icon as string} 
                            alt={`${product.name} icon`}
                            width={32} 
                            height={32}
                            unoptimized
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Icon className="w-7 h-7 text-brand-orange" />
                        )}
                      </div>
                      <span className="badge-neutral-status text-[10px]">{product.status}</span>
                    </div>

                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                      {product.tagline}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed text-sm">
                      {product.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {product.features.slice(0, 4).map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <CheckIcon className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <span className="text-sm text-neutral-400 font-medium">
                        Internal service
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* * CTA Section */}
      <section className="section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-neutral-900 dark:bg-neutral-800 p-8 md:p-16 text-center"
          >
            {/* * Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }}
              />
            </div>
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Experience zero-knowledge encryption
              </h2>
              <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
                Try Drop—our encrypted file sharing application. Free, secure, and built on cryptographic guarantees.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/products/drop" className="btn-primary" onClick={() => track('product_view_drop')}>
                  Learn More About Drop
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link href="/about" className="btn-ghost text-white hover:text-white hover:bg-white/10" onClick={() => track('cta_learn_more_about_us')}>
                  Learn more about us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
