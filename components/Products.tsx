'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { UserIcon, LockIcon, MailIcon, ArrowRightIcon, CheckIcon } from '@ciphera-net/ui'
import { track } from '../lib/pulse'

const products = [
  {
    icon: '/drop_icon_no_margins.png',
    isImage: true,
    name: 'Drop',
    tagline: 'Secure file sharing',
    description: 'Share files securely with end-to-end encryption. Your files are encrypted before they leave your device.',
    features: ['AES-256-GCM encryption', 'Zero-knowledge storage', 'Password protection', 'Expiring links'],
    link: 'https://drop.ciphera.net',
    gradient: 'from-neutral-500 to-neutral-700',
    available: true,
  },
  {
    icon: '/pulse_icon_no_margins.png',
    isImage: true,
    name: 'Pulse',
    tagline: 'Privacy-first analytics & replay',
    description: 'Real-time user insights and session replay without compromising user privacy. Visualize user journeys and debug issues instantly.',
    features: ['Session replay', 'Geographic heatmaps', 'Real-time traffic monitoring', 'Privacy-preserving data collection'],
    link: 'https://pulse.ciphera.net',
    gradient: 'from-neutral-500 to-neutral-700',
    available: true,
  },
  {
    icon: '/auth_icon_no_margins.png',
    isImage: true,
    name: 'Ciphera Auth',
    tagline: 'Identity provider',
    description: 'Secure authentication for the Ciphera ecosystem with OAuth2, JWT, and advanced security features.',
    features: ['Double-hashed passwords', 'Two-factor auth', 'Account lockout', 'Session management'],
    link: '#',
    gradient: 'from-neutral-500 to-neutral-700',
    available: true,
  },
  {
    icon: '/captcha_icon_no_margins.png',
    isImage: true,
    name: 'Ciphera Captcha',
    tagline: 'Bot protection',
    description: 'Protect your applications from bots and automated abuse with visual and proof-of-work challenges.',
    features: ['Visual captchas', 'Proof-of-Work', 'Stateless verification', 'JWT tokens'],
    link: '#',
    gradient: 'from-neutral-500 to-neutral-700',
    available: true,
  },
  {
    icon: MailIcon,
    isImage: false,
    name: 'Ciphera Relay',
    tagline: 'Email infrastructure',
    description: 'Transactional email infrastructure for secure, privacy-first email delivery with TLS encryption.',
    features: ['TLS encryption', 'High deliverability', 'SMTP AUTH', 'Admin dashboard'],
    link: '#',
    gradient: 'from-neutral-500 to-neutral-700',
    available: true,
  },
]

export default function Products() {
  return (
    <section className="section-padding">
      <div className="section-container">
        {/* * Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="badge-primary mb-4 inline-flex">Products</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Privacy-first applications
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A suite of tools designed to protect your privacy. Each product works standalone or as part of the ecosystem.
          </p>
        </motion.div>

        {/* * Products grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {products.map((product, index) => {
            const Icon = product.icon as React.ComponentType<{ className?: string }>
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="h-full p-6 lg:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-orange/50 dark:hover:border-brand-orange/50 hover:shadow-2xl hover:shadow-brand-orange/10 dark:hover:shadow-brand-orange/20 transition-all duration-300">
                  {/* * Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {product.isImage ? (
                          <Image 
                            src={product.icon as string} 
                            alt={`${product.name} - ${product.tagline} icon`}
                            width={32} 
                            height={32}
                            unoptimized
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <Icon className="w-7 h-7 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-brand-orange transition-colors duration-200">
                          {product.name}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {product.tagline}
                        </p>
                      </div>
                    </div>
                    {product.available && (
                      <span className="badge-neutral-status text-[10px]">Available</span>
                    )}
                  </div>

                  {/* * Description */}
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  {/* * Features */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2 mb-6">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <CheckIcon className="w-4 h-4 text-brand-orange shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* * CTA */}
                  {product.link !== '#' ? (
                    <Link
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:gap-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:rounded"
                      onClick={() => track(product.name === 'Drop' ? 'product_try_drop' : 'product_try_pulse')}
                    >
                      Try {product.name}
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-neutral-400 font-medium">
                      Infrastructure service
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* * CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/products" className="btn-secondary" onClick={() => track('view_all_products_click')}>
            View all products
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
