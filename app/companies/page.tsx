'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  LockClosedIcon, 
  CodeIcon, 
  CheckCircledIcon,
  ArrowRightIcon,
  PersonIcon,
  EnvelopeClosedIcon,
  LightningBoltIcon,
  EyeNoneIcon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons'

const problems = [
  {
    icon: ExclamationTriangleIcon,
    title: 'Data Breaches',
    description: 'Your current systems expose sensitive data. One breach could cost millions and destroy customer trust.',
  },
  {
    icon: EyeNoneIcon,
    title: 'Privacy Violations',
    description: 'You\'re collecting more data than necessary, violating GDPR and risking regulatory fines.',
  },
  {
    icon: CodeIcon,
    title: 'Legacy Systems',
    description: 'Outdated infrastructure with security vulnerabilities and poor privacy practices.',
  },
]

const solutions = [
  {
    icon: LockClosedIcon,
    title: 'Privacy by Design',
    description: 'We help you rebuild your infrastructure with privacy as the foundation, not an afterthought.',
    benefits: [
      'End-to-end encryption for all data',
      'Zero-knowledge architecture',
      'Minimal data collection',
      'GDPR compliance built-in',
    ],
  },
  {
    icon: LockClosedIcon,
    title: 'Secure Infrastructure',
    description: 'Replace vulnerable systems with battle-tested, privacy-first alternatives.',
    benefits: [
      'Double-hashed password storage',
      'OAuth2 and JWT authentication',
      'Bot protection without tracking',
      'Secure email infrastructure',
    ],
  },
  {
    icon: CodeIcon,
    title: 'Open Source & Auditable',
    description: 'Transparency builds trust. Our code is open for inspection and verification.',
    benefits: [
      'Public codebase for security audits',
      'No vendor lock-in',
      'Self-hostable solutions',
      'Community-driven improvements',
    ],
  },
]

const services = [
  {
    icon: '/drop_icon_no_margins.png',
    isImage: true,
    name: 'Drop for Business',
    description: 'Enterprise file sharing with zero-knowledge encryption. Perfect for secure document sharing, client communications, and internal collaboration.',
    features: [
      'End-to-end encrypted file sharing',
      'Team workspaces',
      'Admin controls and permissions',
      'Audit logs',
      'Custom retention policies',
      'SSO integration',
    ],
    gradient: 'from-neutral-500 to-neutral-700',
  },
  {
    icon: PersonIcon,
    isImage: false,
    name: 'Ciphera Auth',
    description: 'Enterprise identity provider with advanced security features. Replace vulnerable authentication systems with zero-knowledge architecture.',
    features: [
      'OAuth2 and SAML support',
      'Multi-factor authentication',
      'Account lockout protection',
      'Session management',
      'Enterprise SSO',
      'Custom branding',
    ],
    gradient: 'from-neutral-500 to-neutral-700',
  },
  {
    icon: LockClosedIcon,
    isImage: false,
    name: 'Ciphera Captcha',
    description: 'Bot protection that respects privacy. No tracking, no cookies, just effective protection.',
    features: [
      'Privacy-first bot protection',
      'No user tracking',
      'Proof-of-Work challenges',
      'API rate limiting',
      'Custom difficulty settings',
      'Analytics-free',
    ],
    gradient: 'from-neutral-500 to-neutral-700',
  },
  {
    icon: EnvelopeClosedIcon,
    isImage: false,
    name: 'Ciphera Relay',
    description: 'Secure email infrastructure for transactional emails. High deliverability with TLS encryption.',
    features: [
      'TLS 1.2/1.3 encryption',
      'High deliverability rates',
      'SMTP AUTH required',
      'Admin dashboard',
      'Email analytics',
      'Custom domain support',
    ],
    gradient: 'from-neutral-500 to-neutral-700',
  },
]

const benefits = [
  {
    title: 'Regulatory Compliance',
    description: 'Meet GDPR, CCPA, and other privacy regulations without the complexity.',
  },
  {
    title: 'Customer Trust',
    description: 'Build trust by demonstrating your commitment to privacy and security.',
  },
  {
    title: 'Reduced Risk',
    description: 'Minimize data breach risks with zero-knowledge architecture.',
  },
  {
    title: 'Cost Savings',
    description: 'Avoid fines, lawsuits, and reputation damage from privacy violations.',
  },
]

export default function CompaniesPage() {
  return (
    <>
      {/* * JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Ciphera Enterprise Privacy Solutions',
            description: 'Privacy-first infrastructure and applications for businesses',
            provider: {
              '@type': 'Organization',
              name: 'Ciphera',
              url: 'https://ciphera.net',
            },
            areaServed: 'Worldwide',
            serviceType: 'Privacy and Security Solutions',
          }),
        }}
      />

      {/* * Hero Section */}
      <section className="relative section-padding overflow-hidden">
        {/* * Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-brand-orange/10 rounded-full blur-[128px] opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] bg-neutral-500/10 dark:bg-neutral-400/10 rounded-full blur-[128px] opacity-30" />
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
              Enterprise Solutions
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tight">
              Transform your company into a{' '}
              <span className="gradient-text">privacy-first</span> organization
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Stop collecting data you don't need. Stop using systems that violate privacy. 
              We help companies rebuild their infrastructure with privacy as the foundation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* * Problems Section */}
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="badge-neutral mb-4 inline-flex">The Problem</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Your current infrastructure is a liability
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Most companies are one data breach away from disaster. Your legacy systems, 
              third-party trackers, and poor privacy practices put you at risk.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {problems.map((problem, index) => {
              const Icon = problem.icon
              return (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card p-6 lg:p-8"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/5 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {problem.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* * Solutions Section */}
      <section className="section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="badge-primary mb-4 inline-flex">The Solution</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Privacy-first infrastructure
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              We help you rebuild with privacy as the foundation. Every system, every process, 
              every decision—privacy first.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon
              return (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card card-hover p-6 lg:p-8"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-brand-orange" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                    {solution.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                    {solution.description}
                  </p>
                  <ul className="space-y-2">
                    {solution.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <CheckCircledIcon className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* * Services Section */}
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="badge-primary mb-4 inline-flex">Our Services</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Privacy-first applications for your business
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Replace vulnerable systems with our enterprise-grade privacy infrastructure. 
              Each service works standalone or as part of a complete privacy transformation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon as React.ComponentType<{ className?: string }>
              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full card card-hover p-6 lg:p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg`}>
                          {service.isImage ? (
                            <Image 
                              src={service.icon as string} 
                              alt={service.name} 
                              width={32} 
                              height={32}
                              loading="lazy"
                              className="w-8 h-8"
                            />
                          ) : (
                            <Icon className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                            {service.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <CheckCircledIcon className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:gap-3 transition-all duration-200"
                    >
                      Request enterprise demo
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* * Benefits Section */}
      <section className="section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="badge-neutral mb-4 inline-flex">Why It Matters</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              The benefits of going privacy-first
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 flex items-center justify-center mx-auto mb-4">
                  <CheckCircledIcon className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* * CTA Section */}
      <section className="section-padding bg-neutral-900 dark:bg-neutral-800">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-8 md:p-16 text-center"
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
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to transform your company?
              </h2>
              <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
                Let's discuss how we can help you become a privacy-first organization. 
                No sales pitch, just honest conversation about your privacy needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact" className="btn-primary">
                  Schedule a Consultation
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <a
                  href="mailto:business@ciphera.net"
                  className="btn-ghost text-white hover:text-white hover:bg-white/10"
                >
                  business@ciphera.net
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
