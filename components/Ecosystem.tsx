'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, CheckIcon, UserIcon, LockIcon, MailIcon } from '@ciphera-net/ui'
import SwissFlagIcon from './SwissFlagIcon'

// * Use case-focused approach showing real-world scenarios
const useCases = [
  {
    id: 'secure-sharing',
    title: 'Secure File Sharing',
    description: 'Share confidential documents with clients or team members without compromising security.',
    flow: [
      { step: 'Upload', product: 'Drop', icon: '/drop_icon_no_margins.png' },
      { step: 'Authenticate', product: 'Auth', icon: '/auth_icon_no_margins.png' },
      { step: 'Protect', product: 'Captcha', icon: '/captcha_icon_no_margins.png' },
    ],
    gradient: 'from-brand-orange/10 to-neutral-100',
  },
  {
    id: 'user-analytics',
    title: 'Privacy-First Analytics',
    description: 'Track user behavior and debug issues while respecting user privacy.',
    flow: [
      { step: 'Track', product: 'Pulse', icon: '/pulse_icon_no_margins.png' },
      { step: 'Verify', product: 'Auth', icon: '/auth_icon_no_margins.png' },
      { step: 'Notify', product: 'Relay', icon: MailIcon },
    ],
    gradient: 'from-purple-100 to-neutral-100',
  },
  {
    id: 'complete-workflow',
    title: 'Complete Privacy Stack',
    description: 'Build your application with end-to-end privacy protection.',
    flow: [
      { step: 'Store', product: 'Drop', icon: '/drop_icon_no_margins.png' },
      { step: 'Analyze', product: 'Pulse', icon: '/pulse_icon_no_margins.png' },
      { step: 'Authenticate', product: 'Auth', icon: '/auth_icon_no_margins.png' },
      { step: 'Protect', product: 'Captcha', icon: '/captcha_icon_no_margins.png' },
      { step: 'Communicate', product: 'Relay', icon: MailIcon },
    ],
    gradient: 'from-blue-100 to-neutral-100',
  },
]

function UseCaseCard({ useCase, index }: { useCase: typeof useCases[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className={`h-full p-6 lg:p-8 rounded-2xl bg-gradient-to-br ${useCase.gradient} dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-black/50 transition-all duration-300 hover:-translate-y-1`}>
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
          {useCase.title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
          {useCase.description}
        </p>

        {/* * Product flow */}
        <div className="flex flex-wrap items-center gap-2">
          {useCase.flow.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-neutral-500 to-neutral-700 flex items-center justify-center">
                  {typeof item.icon === 'string' ? (
                    <Image 
                      src={item.icon} 
                      alt={item.product}
                      width={16} 
                      height={16}
                      unoptimized
                      className="w-4 h-4 object-contain"
                    />
                  ) : (
                    <item.icon className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {item.product}
                </span>
              </div>
              {idx < useCase.flow.length - 1 && (
                <ArrowRightIcon className="w-4 h-4 text-neutral-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Ecosystem() {
  return (
    <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden">
      <div className="section-container">
        {/* * Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="badge-primary mb-4 inline-flex">Use Cases</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Privacy by Design, Not by Policy
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Choose individual products for specific needs, or combine them for a complete privacy-first infrastructure. 
            Each tool works independently or as part of your privacy stack.
          </p>
          <span className="badge-neutral mt-4 inline-flex items-center gap-1.5">
            <SwissFlagIcon className="w-3.5 h-3.5" />
            Swiss infrastructure
          </span>
        </motion.div>

        {/* * Use cases grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={useCase.id} useCase={useCase} index={index} />
          ))}
        </div>

        {/* * Product benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-8 text-center max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            Why Choose Ciphera's Ecosystem?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <CheckIcon className="w-8 h-8 text-brand-orange mx-auto mb-3" />
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Modular & Flexible</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Use one product or combine them all</p>
            </div>
            <div className="text-center">
              <CheckIcon className="w-8 h-8 text-brand-orange mx-auto mb-3" />
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Zero-Knowledge</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">We can't access your data, mathematically</p>
            </div>
            <div className="text-center">
              <CheckIcon className="w-8 h-8 text-brand-orange mx-auto mb-3" />
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Open Source</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Verify our claims, audit our code</p>
            </div>
          </div>
        </motion.div>

        {/* * CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/products" className="btn-primary">
            Explore All Products
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
