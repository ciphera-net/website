'use client'

import { motion } from 'framer-motion'
import { LockIcon, EyeOffIcon, LayoutDashboardIcon, GlobeIcon, CheckIcon, ZapIcon } from '@ciphera-net/ui'

const features = [
  {
    icon: LockIcon,
    title: 'End-to-End Encryption',
    description: 'Your data is encrypted before it leaves your device. Only you hold the keys—not even we can access your content.',
  },
  {
    icon: EyeOffIcon,
    title: 'Zero-Knowledge Architecture',
    description: 'We can\'t see your data, we can\'t share your data. Privacy isn\'t a promise, it\'s mathematically ensured.',
  },
  {
    icon: LayoutDashboardIcon,
    title: 'Open Source',
    description: 'Our code is public for anyone to inspect and verify. Transparency builds trust.',
  },
  {
    icon: GlobeIcon,
    title: 'Privacy by Default',
    description: 'No configuration needed. Your data is protected from the moment you sign up. Privacy isn\'t an option—it\'s the foundation.',
  },
  {
    icon: CheckIcon,
    title: 'No Tracking',
    description: 'We don\'t track you, we don\'t profile you, we don\'t sell your data. Your privacy is not for sale.',
  },
  {
    icon: ZapIcon,
    title: 'Modern & Fast',
    description: 'Built with modern technologies for speed and reliability without compromising on security.',
  },
]

export default function Features() {
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
          <span className="badge-primary mb-4 inline-flex">Why Ciphera</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Security that doesn't compromise
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Every feature is built with cryptographic guarantees. Your privacy isn't optional—it's the architecture. 
            Try <a href="https://drop.ciphera.net" target="_blank" rel="noopener noreferrer" className="link">Drop</a> for secure file sharing or explore our <a href="/products" className="link">complete product suite</a>.
          </p>
        </motion.div>

        {/* * Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full card card-hover p-6 lg:p-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-brand-orange" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
