'use client'

import { motion } from 'framer-motion'
import { LockClosedIcon, EyeNoneIcon, CubeIcon, DesktopIcon } from '@radix-ui/react-icons'

const features = [
  {
    icon: LockClosedIcon,
    title: 'Zero-Knowledge Architecture',
    description: 'End-to-end encryption ensures that even service providers cannot access your data. True privacy by design.',
  },
  {
    icon: EyeNoneIcon,
    title: 'Privacy-First',
    description: 'Built with privacy as the core principle. No tracking, no data collection, no compromises.',
  },
  {
    icon: CubeIcon,
    title: 'Microservices Architecture',
    description: 'Modular design with strict separation of concerns. Identity, storage, and application logic are isolated.',
  },
  {
    icon: DesktopIcon,
    title: 'Self-Hosted Options',
    description: 'Full control over your infrastructure. Deploy on your own servers with complete autonomy.',
  },
]

export default function Features() {
  return (
    <section className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Built for Privacy
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Every component of the Ciphera platform is designed with privacy and security as the foundation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-lg shadow-neutral-200/50 dark:shadow-black/50 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:shadow-neutral-300/50 dark:hover:shadow-black/70 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-brand-orange/10 dark:bg-brand-orange/20 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-brand-orange" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
