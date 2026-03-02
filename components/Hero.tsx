'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircleIcon, LockIcon, GlobeIcon } from '@ciphera-net/ui'
import { SwissFlagIcon } from '@ciphera-net/ui'
import { track } from '../lib/pulse'

// * Trust indicators displayed below CTAs
const trustIndicators = [
  { icon: LockIcon, text: 'End-to-end encrypted', iconClassName: 'w-4 h-4 text-brand-orange' },
  { icon: CheckCircleIcon, text: 'Open source', iconClassName: 'w-4 h-4 text-brand-orange' },
  { icon: GlobeIcon, text: 'Zero-knowledge by design', iconClassName: 'w-4 h-4 text-brand-orange' },
  { icon: SwissFlagIcon, text: 'Swiss infrastructure', iconClassName: 'w-4 h-4' },
]

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="section-container w-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* * Badge */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge-primary mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              Privacy-First Platform
            </span>
          </motion.div>

          {/* * Main headline */}
          <h1
            className="heading-1 lg:text-7xl mb-6"
          >
            Where{' '}
            <span className="relative">
              <span className="gradient-text">Privacy</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-brand-orange/30"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 9C50 3 150 3 200 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {' '}Still Exists
          </h1>

          {/* * Subtitle */}
          <p
            className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Ciphera provides privacy-first infrastructure and applications built on zero-knowledge principles.
            Your data is encrypted before it leaves your device—we can't see it, even if we wanted to.
          </p>

          {/* * CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
            <Link href="/products" className="btn-primary text-base sm:text-lg px-8 py-3.5" onClick={() => track('cta_explore_products')}>
              Explore Products
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
            <Link href="/about" className="btn-secondary text-base sm:text-lg px-8 py-3.5" onClick={() => track('cta_our_mission')}>
              Our Mission
          </Link>
          </motion.div>

          {/* * Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8"
          >
            {trustIndicators.map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400"
              >
                <item.icon className={item.iconClassName ?? 'w-4 h-4 text-brand-orange'} />
                <span>{item.text}</span>
              </div>
            ))}
        </motion.div>
        </div>
      </div>
    </section>
  )
}
