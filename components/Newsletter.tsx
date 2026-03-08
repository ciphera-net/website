'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowRightIcon } from '@ciphera-net/ui'
import { track } from '../lib/pulse'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    track('newsletter_signup_attempt')

    // * Simulate API call - replace with actual newsletter service
    setTimeout(() => {
      setStatus('success')
      track('newsletter_signup_success')
      setEmail('')

      setTimeout(() => setStatus('idle'), 5000)
    }, 1000)
  }

  return (
    <section className="section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="p-8 sm:p-12 md:p-16 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <h2 className="heading-2 mb-3">
              New article every week
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed max-w-lg mx-auto">
              Privacy guides, security research, and product updates. No spam, no tracking — obviously.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-sm"
                disabled={status === 'loading' || status === 'success'}
                required
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' && 'Subscribing...'}
                {status === 'success' && 'Subscribed!'}
                {status === 'idle' && (
                  <>
                    Subscribe
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
                {status === 'error' && 'Try Again'}
              </button>
            </form>

            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-brand-orange mt-4 text-sm font-medium"
              >
                Thanks for subscribing! Check your inbox for confirmation.
              </motion.p>
            )}

            <p className="text-neutral-500 text-xs mt-6">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
