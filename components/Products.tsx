'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PersonIcon, LockClosedIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons'

const products = [
  {
    icon: '/drop_icon_no_margins.png',
    name: 'Drop',
    description: 'Privacy-first file sharing with end-to-end encryption. Share files securely without compromising your privacy.',
    link: 'https://drop.ciphera.net',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: PersonIcon,
    name: 'Ciphera Auth',
    description: 'Centralized identity provider with secure authentication, OAuth flows, and JWT issuance for the Ciphera ecosystem.',
    link: '#',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: LockClosedIcon,
    name: 'Ciphera Captcha',
    description: 'Bot protection service with visual captchas and Proof-of-Work challenges to prevent automated abuse.',
    link: '#',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: EnvelopeClosedIcon,
    name: 'Ciphera Relay',
    description: 'Self-hosted transactional email infrastructure for secure, privacy-first email delivery.',
    link: '#',
    color: 'from-orange-500 to-orange-600',
  },
]

export default function Products() {
  return (
    <section className="py-24 px-4 bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            The Ciphera Ecosystem
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A suite of privacy-first applications and infrastructure services working together seamlessly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => {
            const Icon = product.icon
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-lg shadow-neutral-200/50 dark:shadow-black/50 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:shadow-neutral-300/50 dark:hover:shadow-black/70 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {typeof Icon === 'string' ? (
                    <img src={Icon} alt={product.name} className="w-7 h-7 object-contain" />
                  ) : (
                    <Icon className="w-7 h-7 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                  {product.name}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                  {product.description}
                </p>
                {product.link !== '#' ? (
                  <Link
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-brand-orange font-medium hover:text-brand-orange/80 transition-colors"
                  >
                    Learn more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <span className="inline-flex items-center text-neutral-400 font-medium">
                    Coming soon
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="btn-primary text-lg px-8 py-3.5"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
