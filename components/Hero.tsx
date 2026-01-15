'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircledIcon, LockClosedIcon, GlobeIcon } from '@radix-ui/react-icons'

// * Trust indicators displayed below CTAs
const trustIndicators = [
  { icon: LockClosedIcon, text: 'End-to-end encrypted' },
  { icon: CheckCircledIcon, text: 'Open source' },
  { icon: GlobeIcon, text: 'Zero-knowledge by design' },
]

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* * Background */}
      <div className="absolute inset-0 -z-10">
        {/* * Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[128px] opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[128px] opacity-40" />
        
        {/* * Grid pattern */}
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"
          style={{ maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)' }}
        />
      </div>

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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6"
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
          </motion.h1>

          {/* * Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Ciphera provides privacy-first infrastructure and applications built on zero-knowledge principles. 
            Your data is encrypted before it leaves your device—we can't see it, even if we wanted to.
          </motion.p>

          {/* * CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
            <Link href="/products" className="btn-primary text-base sm:text-lg px-8 py-3.5">
              Explore Products
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
            <Link href="/about" className="btn-secondary text-base sm:text-lg px-8 py-3.5">
              Our Mission
          </Link>
          </motion.div>

          {/* * Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
          >
            {trustIndicators.map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400"
              >
                <item.icon className="w-4 h-4 text-brand-orange" />
                <span>{item.text}</span>
              </div>
            ))}
        </motion.div>
        </div>
      </div>

      {/* * Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent pointer-events-none" />
    </section>
  )
}
