'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, CheckIcon, UserIcon, LockIcon } from '@ciphera-net/ui'
import SwissFlagIcon from './SwissFlagIcon'

// * All products in the ecosystem
const allProducts = [
  { id: 'pulse', name: 'Pulse', icon: '/pulse_icon_no_margins.png', color: 'purple', description: 'Privacy-first analytics' },
  { id: 'drop', name: 'Drop', icon: '/drop_icon_no_margins.png', color: 'orange', description: 'Secure file sharing' },
  { id: 'auth', name: 'Auth', icon: '/auth_icon_no_margins.png', color: 'blue', description: 'Identity provider' },
  { id: 'captcha', name: 'Captcha', icon: '/captcha_icon_no_margins.png', color: 'red', description: 'Bot protection' },
  { id: 'relay', name: 'Relay', icon: '/relay_icon_no_margins.png', color: 'emerald', description: 'Email infrastructure' },
]

// * User scenarios/journeys
const journeys = [
  {
    id: 'analytics',
    title: 'I need analytics',
    description: 'Track user behavior and debug issues while respecting privacy',
    primaryProduct: 'pulse',
    flow: [
      { product: 'pulse', label: 'Track Events' },
      { product: 'auth', label: 'Authenticate Users' },
      { product: 'relay', label: 'Send Alerts' },
    ],
    integrations: ['auth', 'relay'],
  },
  {
    id: 'file-sharing',
    title: 'I need file sharing',
    description: 'Share confidential files securely with clients or team',
    primaryProduct: 'drop',
    flow: [
      { product: 'drop', label: 'Upload File' },
      { product: 'auth', label: 'Verify Identity' },
      { product: 'captcha', label: 'Block Bots' },
    ],
    integrations: ['auth', 'captcha'],
  },
  {
    id: 'identity',
    title: 'I need authentication',
    description: 'Secure user authentication for your application',
    primaryProduct: 'auth',
    flow: [
      { product: 'auth', label: 'Handle Login' },
      { product: 'captcha', label: 'Prevent Bots' },
      { product: 'relay', label: 'Email Verification' },
    ],
    integrations: ['captcha', 'relay'],
  },
  {
    id: 'complete',
    title: 'I need everything',
    description: 'Complete privacy-first infrastructure for your business',
    primaryProduct: 'pulse',
    flow: [
      { product: 'pulse', label: 'Insights' },
      { product: 'drop', label: 'Share' },
      { product: 'auth', label: 'Authenticate' },
      { product: 'captcha', label: 'Protect' },
      { product: 'relay', label: 'Communicate' },
    ],
    integrations: ['drop', 'auth', 'captcha', 'relay'],
  },
]

// * Product node component for the journey visualization
function ProductNode({ 
  product, 
  isActive, 
  isPrimary,
  delay 
}: { 
  product: typeof allProducts[0]
  isActive: boolean
  isPrimary: boolean
  delay: number 
}) {
  const Icon = product.icon as React.ComponentType<{ className?: string }>

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isActive ? 1 : 0.4,
        scale: isPrimary ? 1.1 : 1,
      }}
      transition={{ duration: 0.3, delay }}
      className="relative"
    >
      <div className={`p-6 rounded-2xl bg-white dark:bg-neutral-900 border-2 transition-all duration-300 ${
        isPrimary 
          ? 'border-brand-orange shadow-2xl shadow-brand-orange/20' 
          : isActive 
            ? 'border-brand-orange/50 shadow-lg' 
            : 'border-neutral-200 dark:border-neutral-800'
      }`}>
        <div className="flex flex-col items-center text-center gap-3">
          <div className={`w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40 flex items-center justify-center shadow-lg p-3 transition-transform duration-300 ${
            isPrimary ? 'scale-110' : ''
          }`}>
            {typeof product.icon === 'string' ? (
              <Image 
                src={product.icon} 
                alt={product.name}
                width={32} 
                height={32}
                unoptimized
                className="w-full h-full object-contain"
              />
            ) : (
              <Icon className="w-8 h-8 text-brand-orange" />
            )}
          </div>
          <div>
            <div className="font-bold text-neutral-900 dark:text-white text-sm">
              {product.name}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {product.description}
            </div>
          </div>
        </div>
        
        {isPrimary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-2 -right-2"
          >
            <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold bg-brand-orange text-white shadow-lg">
              Primary
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function Ecosystem() {
  const [selectedJourney, setSelectedJourney] = useState<string>('analytics')

  const activeJourney = journeys.find((j) => j.id === selectedJourney)
  const activeProducts = activeJourney 
    ? [activeJourney.primaryProduct, ...activeJourney.integrations]
    : []

  return (
    <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden">
      <div className="section-container">
        {/* * Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="badge-primary mb-4 inline-flex">Interactive Journey</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            What do you need?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Click a scenario below to see how Ciphera products work together to solve your privacy challenges.
          </p>
          <span className="badge-neutral mt-4 inline-flex items-center gap-1.5">
            <SwissFlagIcon className="w-3.5 h-3.5" />
            Swiss infrastructure
          </span>
        </motion.div>

        {/* * Journey selector buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {journeys.map((journey) => (
            <button
              key={journey.id}
              onClick={() => setSelectedJourney(journey.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedJourney === journey.id
                  ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30 scale-105'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {journey.title}
            </button>
          ))}
        </div>

        {/* * Active journey visualization */}
        <AnimatePresence mode="wait">
          {activeJourney && (
            <motion.div
              key={activeJourney.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-12"
            >
              <div className="card p-8 max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {activeJourney.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {activeJourney.description}
                  </p>
                </div>

                {/* * Product flow visualization */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                  {activeJourney.flow.map((step, idx) => {
                    const product = allProducts.find((p) => p.id === step.product)
                    if (!product) return null
                    const Icon = product.icon as React.ComponentType<{ className?: string }>
                    const isPrimary = step.product === activeJourney.primaryProduct

                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`relative p-4 rounded-xl border-2 ${
                            isPrimary 
                              ? 'border-brand-orange bg-brand-orange/5' 
                              : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40 flex items-center justify-center p-2">
                              {typeof product.icon === 'string' ? (
                                <Image 
                                  src={product.icon} 
                                  alt={product.name}
                                  width={24} 
                                  height={24}
                                  unoptimized
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Icon className="w-6 h-6 text-brand-orange" />
                              )}
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-bold text-neutral-900 dark:text-white">
                                {product.name}
                              </div>
                              <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                                {step.label}
                              </div>
                            </div>
                          </div>
                          
                          {isPrimary && (
                            <div className="absolute -top-2 -right-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-orange text-white">
                                Primary
                              </span>
                            </div>
                          )}
                        </motion.div>
                        
                        {idx < activeJourney.flow.length - 1 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1 + 0.2 }}
                          >
                            <ArrowRightIcon className="w-6 h-6 text-brand-orange" />
                          </motion.div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* * Integration note */}
                <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                  <p>
                    <span className="font-semibold text-neutral-900 dark:text-white">{allProducts.find(p => p.id === activeJourney.primaryProduct)?.name}</span>
                    {' '}integrates seamlessly with{' '}
                    {activeJourney.integrations.map((id, idx) => (
                      <span key={id}>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {allProducts.find(p => p.id === id)?.name}
                        </span>
                        {idx < activeJourney.integrations.length - 1 && (idx === activeJourney.integrations.length - 2 ? ' and ' : ', ')}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* * CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
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
