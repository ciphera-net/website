'use client'

import { motion } from 'framer-motion'
import { HeartIcon, LockClosedIcon, GlobeIcon } from '@radix-ui/react-icons'

const philosophyPoints = [
  {
    icon: LockClosedIcon,
    title: 'Cryptography First',
    description: 'We don\'t rely on promises or policies. Our architecture uses zero-knowledge cryptography, meaning we mathematically cannot access your data—even if we wanted to.',
  },
  {
    icon: HeartIcon,
    title: 'Accessible Security',
    description: 'Strong encryption shouldn\'t require technical expertise. We build tools that protect your data by default, making privacy accessible to everyone.',
  },
  {
    icon: GlobeIcon,
    title: 'Verified, Not Vouched',
    description: 'Our code is open source because verification beats marketing. Anyone can audit our security claims, and we welcome the scrutiny.',
  },
]

export default function Philosophy() {
  return (
    <section className="section-padding bg-neutral-900 dark:bg-neutral-950 text-white overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* * Left - Main message */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge bg-white/10 text-white/80 border-white/10 mb-6 inline-flex">
              Our Philosophy
            </span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Encryption you can{' '}
              <span className="gradient-text">verify</span>, not just trust
            </h2>
            
            <p className="text-lg text-neutral-400 leading-relaxed mb-8">
              Ciphera was built on a simple principle: if we can't see your data, we can't sell it, leak it, or lose it. 
              Our <a href="/products" className="text-brand-orange hover:text-brand-orange-hover underline">zero-knowledge architecture</a> ensures your files are encrypted before they leave your device—every time. 
              Learn more <a href="/about" className="text-brand-orange hover:text-brand-orange-hover underline">about our mission</a>.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-sm font-semibold"
                  >
                    {['C', 'D', 'A', 'R'][i]}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold text-white">Built by privacy advocates</div>
                <div className="text-neutral-500">For privacy advocates</div>
              </div>
            </div>
          </motion.div>

          {/* * Right - Philosophy points */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {philosophyPoints.map((point, index) => {
              const Icon = point.icon
              return (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-hover flex items-center justify-center shrink-0 shadow-lg shadow-brand-orange/20">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{point.title}</h3>
                      <p className="text-neutral-400 leading-relaxed text-sm">{point.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
