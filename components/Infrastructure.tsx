'use client'

import { motion } from 'framer-motion'
import { UserIcon, LockIcon, MailIcon, GlobeIcon } from '@ciphera-net/ui'
import Image from 'next/image'
import SwissFlagIcon from './SwissFlagIcon'

// * Architecture nodes for the ecosystem diagram
const services = [
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Privacy-first analytics',
    icon: '/pulse_icon_no_margins.png',
    isImage: true,
    iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40',
    position: 'top',
  },
  {
    id: 'drop',
    name: 'Drop',
    description: 'Secure file sharing',
    icon: '/drop_icon_no_margins.png',
    isImage: true,
    iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40',
    position: 'top-right',
  },
  {
    id: 'auth',
    name: 'Ciphera Auth',
    description: 'Identity provider',
    icon: '/auth_icon_no_margins.png',
    isImage: true,
    iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40',
    position: 'left',
  },
  {
    id: 'captcha',
    name: 'Ciphera Captcha',
    description: 'Bot protection',
    icon: '/captcha_icon_no_margins.png',
    isImage: true,
    iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40',
    position: 'right',
  },
  {
    id: 'relay',
    name: 'Ciphera Relay',
    description: 'Email infrastructure',
    icon: MailIcon,
    isImage: false,
    iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40',
    position: 'bottom',
  },
]

// * Service node component
function ServiceNode({ service, delay }: { service: typeof services[0]; delay: number }) {
  const Icon = service.icon as React.ComponentType<{ className?: string }>

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group"
    >
      <div className="relative p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center shadow-lg p-2`}>
            {service.isImage ? (
              <Image 
                src={service.icon as string} 
                alt={`${service.name} - ${service.description} logo`}
                width={32} 
                height={32}
                unoptimized
                className="w-full h-full object-contain"
              />
            ) : (
              <Icon className="w-7 h-7 text-brand-orange" />
            )}
          </div>
          <div>
            <div className="font-semibold text-sm text-neutral-900 dark:text-white">
              {service.name}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {service.description}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Infrastructure() {
  return (
    <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden">
      <div className="section-container">
        {/* * Header */}
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
          >
          <span className="badge-primary mb-4 inline-flex">Architecture</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            The Ciphera Ecosystem
            </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A modular architecture where identity, data, and protection are strictly separated—ensuring true privacy by design.
          </p>
          <span className="badge-neutral mt-4 inline-flex items-center gap-1.5">
            <SwissFlagIcon className="w-3.5 h-3.5" />
            Swiss infrastructure
          </span>
        </motion.div>

        {/* * Architecture Diagram */}
        <div className="relative max-w-3xl mx-auto">
          {/* * Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-brand-orange/20 rounded-full blur-[100px] opacity-50" />

          {/* * Diagram container */}
          <div className="relative aspect-square max-w-xs sm:max-w-sm md:max-w-lg mx-auto">
            {/* * Connection lines SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              <defs>
                <linearGradient id="lineGradientInfra" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FD5E0F" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#FD5E0F" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FD5E0F" stopOpacity="0.2" />
                </linearGradient>
                <marker id="arrowInfra" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#FD5E0F" opacity="0.6" />
                </marker>
              </defs>

              {/* * Drop -> Auth */}
              <motion.path
                d="M 160 100 Q 100 100 100 160"
                stroke="url(#lineGradientInfra)"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowInfra)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* * Drop -> Captcha */}
              <motion.path
                d="M 240 100 Q 300 100 300 160"
                stroke="url(#lineGradientInfra)"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowInfra)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
              />

              {/* * Auth -> Relay */}
              <motion.path
                d="M 100 240 Q 100 300 160 300"
                stroke="url(#lineGradientInfra)"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowInfra)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.9 }}
              />

              {/* * Auth <-> Captcha (dashed) */}
              <motion.path
                d="M 140 200 L 260 200"
                stroke="url(#lineGradientInfra)"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1.1 }}
              />
            </svg>

            {/* * Center hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-dashed border-brand-orange/30 flex items-center justify-center"
              >
                <GlobeIcon className="w-6 h-6 text-brand-orange" />
              </motion.div>
            </div>

            {/* * Service nodes positioned around */}
            {/* * Top - Drop */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <ServiceNode service={services[0]} delay={0.1} />
                  </div>

            {/* * Left - Auth */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0">
              <ServiceNode service={services[1]} delay={0.2} />
                  </div>

            {/* * Right - Captcha */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0">
              <ServiceNode service={services[2]} delay={0.3} />
                </div>

            {/* * Bottom - Relay */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <ServiceNode service={services[3]} delay={0.4} />
            </div>

            {/* * Connection labels */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="absolute top-[22%] left-[18%]"
            >
              <span className="text-[10px] font-mono font-semibold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">
                JWT
              </span>
          </motion.div>

          <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="absolute top-[22%] right-[18%]"
          >
              <span className="text-[10px] font-mono font-semibold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">
                PoW
              </span>
            </motion.div>

                <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="absolute bottom-[22%] left-[18%]"
            >
              <span className="text-[10px] font-mono font-semibold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">
                SMTP
              </span>
            </motion.div>
              </div>
            </div>

        {/* * Service details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-16">
          {services.map((service, index) => {
            const Icon = service.icon as React.ComponentType<{ className?: string }>
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 card-hover"
              >
                <div className={`icon-container ${service.iconBg} mb-4 shadow-lg p-2`}>
                  {service.isImage ? (
              <Image 
                src={service.icon as string} 
                alt={`${service.name} - ${service.description} logo`}
                width={28} 
                height={28}
                unoptimized
                className="w-full h-full object-contain"
              />
                  ) : (
                    <Icon className="w-6 h-6 text-brand-orange" />
                  )}
                </div>
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                  {service.description}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {service.id === 'drop' && 'End-to-end encrypted file sharing with zero-knowledge architecture.'}
                  {service.id === 'pulse' && 'Real-time analytics and session replay without compromising user privacy.'}
                  {service.id === 'auth' && 'Secure identity management with JWT tokens and double-hashed passwords.'}
                  {service.id === 'relay' && 'Secure email infrastructure for verification and notifications.'}
                  {service.id === 'captcha' && 'Proof-of-Work challenges and visual captchas for bot protection.'}
                </p>
          </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
