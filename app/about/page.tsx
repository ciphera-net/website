'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  LockClosedIcon, 
  EyeNoneIcon, 
  CodeIcon, 
  LightningBoltIcon,
  ArrowRightIcon,
  CheckIcon,
  GlobeIcon
} from '@radix-ui/react-icons'

const values = [
  {
    icon: LockClosedIcon,
    title: 'Privacy by Design',
    description: 'Every component of the Ciphera platform is designed with privacy as the foundation. We use end-to-end encryption, zero-knowledge architecture, and minimal data collection.',
    gradient: 'from-brand-orange to-orange-600',
  },
  {
    icon: EyeNoneIcon,
    title: 'Zero-Knowledge',
    description: 'We can\'t see your data, we can\'t share your data. Your privacy isn\'t a promise—it\'s mathematically ensured through cryptographic guarantees.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: CodeIcon,
    title: 'Transparency',
    description: 'We believe in open-source principles. Our code is public for anyone to inspect and verify. Trust is earned through transparency, not marketing.',
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    icon: GlobeIcon,
    title: 'User Control',
    description: 'You own your encryption keys and can delete your data at any time—no questions asked. We can\'t access your files, even with a court order.',
    gradient: 'from-sky-500 to-blue-600',
  },
]

const techStack = [
  { name: 'Go (Gin)', description: 'High-performance backend services' },
  { name: 'Next.js', description: 'Modern React framework for frontends' },
  { name: 'PostgreSQL', description: 'Reliable database for metadata' },
  { name: 'AES-256-GCM', description: 'Industry-standard encryption' },
  { name: 'JWT', description: 'Stateless authentication' },
  { name: 'Argon2id', description: 'Password hashing algorithm' },
]

const timeline = [
  { year: '2024', event: 'Ciphera founded with a mission to build privacy-first infrastructure' },
  { year: '2024', event: 'Drop launched—secure, encrypted file sharing for everyone' },
  { year: '2025', event: 'Ciphera Auth, Captcha, and Relay services deployed' },
  { year: '2026', event: 'Continuing to expand the privacy ecosystem' },
]

export default function AboutPage() {
  return (
    <>
      {/* * Hero Section */}
      <section className="relative section-padding overflow-hidden">
        {/* * Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[128px] opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[128px] opacity-30" />
        </div>

        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="badge-primary mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tight">
              Building the future of{' '}
              <span className="gradient-text">privacy</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Ciphera is dedicated to creating privacy-first infrastructure and applications 
              that put users in control of their data. We believe encryption should be the default, 
              not an add-on.
            </p>
          </motion.div>
        </div>
      </section>

      {/* * Mission Section */}
      <section className="section-container pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-neutral-900 dark:bg-neutral-800 p-8 md:p-12 lg:p-16"
        >
          {/* * Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            />
          </div>
          
          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <span className="badge bg-white/10 text-white/80 border-white/10 mb-6 inline-flex">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Encryption that works invisibly
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                We build tools that protect your data automatically—no configuration, no trade-offs. 
                Our zero-knowledge architecture means your files are encrypted client-side, so we never see them.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                When your data is encrypted before it leaves your device, there's nothing to track, profile, or compromise. 
                That's not a feature—it's the foundation.
              </p>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/30 to-purple-500/30 rounded-full blur-3xl" />
                <div className="relative w-full h-full rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Image
                    src="/ciphera_icon_no_margins.png"
                    alt="Ciphera"
                    width={120}
                    height={120}
                    className="w-28 h-28"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* * Values Section */}
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="badge-neutral mb-4 inline-flex">Our Values</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              What we stand for
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              These principles guide every decision we make and every line of code we write.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full card card-hover p-6 lg:p-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* * Tech Stack Section */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge-primary mb-6 inline-flex">Technology</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
                Built with modern, secure technologies
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
                We use battle-tested technologies chosen for their security, performance, and reliability. 
                Every component is carefully selected to ensure your data stays protected.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckIcon className="w-5 h-5 text-brand-orange mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white text-sm">
                        {tech.name}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {tech.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="card p-6 lg:p-8">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                  Architecture Overview
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                  Ciphera follows a microservices architecture with strict separation of concerns. 
                  Each service is isolated to maintain security boundaries.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <LockClosedIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white text-sm">Ciphera Auth</div>
                      <div className="text-xs text-neutral-500">Identity management</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                      <Image src="/drop_icon_no_margins.png" alt="Drop" width={24} height={24} className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white text-sm">Drop Backend</div>
                      <div className="text-xs text-neutral-500">Application logic</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <LightningBoltIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white text-sm">Ciphera Captcha</div>
                      <div className="text-xs text-neutral-500">Bot protection</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* * Timeline Section */}
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="badge-neutral mb-4 inline-flex">Our Journey</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Building privacy, one step at a time
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* * Timeline line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-orange via-purple-500 to-emerald-500" />
              
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative flex gap-6"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 border-2 border-brand-orange flex items-center justify-center shadow-lg">
                        <div className="w-3 h-3 rounded-full bg-brand-orange" />
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="text-sm font-bold text-brand-orange mb-1">{item.year}</div>
                      <p className="text-neutral-600 dark:text-neutral-400">{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* * CTA Section */}
      <section className="section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
              Start sharing files securely
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
              Try Drop—our encrypted file sharing application. 
              See how zero-knowledge encryption works in practice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="https://drop.ciphera.net" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Try Drop Free
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link href="/products" className="btn-secondary">
                Explore Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
