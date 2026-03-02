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
    <section className="section-padding !pt-6 sm:!pt-8 md:!pt-12">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full mx-auto text-center bg-gradient-to-br from-brand-orange to-brand-orange-hover rounded-3xl px-6 sm:px-10 md:px-16 py-12 sm:py-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Stay Updated on Privacy
          </h2>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Get the latest updates on privacy-first technologies, security tips, and product announcements. 
            No spam, unsubscribe anytime.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              disabled={status === 'loading' || status === 'success'}
              required
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="btn-white disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="text-white/90 mt-4 text-sm"
            >
              ✓ Thanks for subscribing! Check your inbox for confirmation.
            </motion.p>
          )}

          <p className="text-white/70 text-sm mt-6">
            We respect your privacy. Your email will never be shared.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
