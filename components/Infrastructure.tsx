'use client'

import { motion } from 'framer-motion'
import { PersonIcon, LockClosedIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons'

const layers = [
  {
    title: 'Ciphera Auth',
    description: 'The trust anchor of our platform. A secure, stateless identity provider using double-hashing and JWT protocols.',
    icon: PersonIcon,
  },
  {
    title: 'Ciphera Relay',
    description: 'The secure data pipeline. Self-hosted transactional infrastructure that never touches unencrypted content.',
    icon: EnvelopeClosedIcon,
  },
  {
    title: 'Ciphera Captcha',
    description: 'The barrier against abuse. High-performance bot protection using Proof-of-Work challenges.',
    icon: LockClosedIcon,
  },
]

export default function Infrastructure() {
  return (
    <section className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              The Infrastructure Layer
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              Apps are only as private as the protocols they run on. We've built a foundational layer 
              of secure microservices that power everything we do.
            </p>
            
            <div className="space-y-6">
              {layers.map((layer, index) => (
                <div key={layer.title} className="flex gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 shadow-sm">
                    <layer.icon className="w-6 h-6 text-neutral-900 dark:text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{layer.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">{layer.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] md:h-[500px] flex items-center justify-center"
          >
            {/* * Abstract Infrastructure Graphic */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-transparent rounded-full blur-3xl opacity-30" />
            <div className="relative w-full h-full border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm shadow-2xl flex flex-col justify-center space-y-8 overflow-hidden">
              <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                  className="h-full bg-brand-orange"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                <div className="h-24 rounded-2xl bg-brand-orange/20 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="h-24 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <div className="space-y-4">
                <div className="h-2 w-2/3 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
                <div className="h-2 w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
                <div className="h-2 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Network Secure</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
