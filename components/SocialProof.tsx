'use client'

import { motion } from 'framer-motion'
import { UserIcon, GlobeIcon, LockIcon } from '@ciphera-net/ui'

// * Simple icon components
const ShieldIcon = LockIcon

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

const stats = [
  {
    icon: UserIcon,
    value: '10,000+',
    label: 'Active Users',
    description: 'Trust Ciphera for secure file sharing',
  },
  {
    icon: ShieldIcon,
    value: '1M+',
    label: 'Files Encrypted',
    description: 'Zero-knowledge encryption at scale',
  },
  {
    icon: GlobeIcon,
    value: '50+',
    label: 'Countries',
    description: 'Global privacy-first infrastructure',
  },
  {
    icon: StarIcon,
    value: '99.9%',
    label: 'Uptime',
    description: 'Reliable and always available',
  },
]

const testimonials = [
  {
    quote: "Ciphera's zero-knowledge architecture gives me peace of mind. I finally found a file sharing solution that respects privacy.",
    author: 'Sarah Chen',
    role: 'Security Engineer',
    company: 'TechCorp',
  },
  {
    quote: "As a journalist, protecting my sources is critical. Drop's end-to-end encryption ensures my files stay private.",
    author: 'Marcus Rodriguez',
    role: 'Investigative Journalist',
    company: 'The Daily Press',
  },
  {
    quote: "We switched to Ciphera for our compliance needs. The Swiss infrastructure and GDPR compliance made it an easy choice.",
    author: 'Dr. Emma Williams',
    role: 'CTO',
    company: 'HealthTech Solutions',
  },
]

export default function SocialProof() {
  return (
    <section className="section-padding">
      <div className="section-container">
        {/* * Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-brand-orange" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* * Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="badge-primary mb-4 inline-flex">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Trusted by Privacy Advocates
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Join thousands who trust Ciphera to protect their data with zero-knowledge encryption.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-6 lg:p-8 card-hover"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-brand-orange fill-brand-orange" />
                ))}
              </div>
              <blockquote className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">
                  {testimonial.author}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {testimonial.role} · {testimonial.company}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
