'use client'

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { LockClosedIcon, EyeNoneIcon, CubeIcon, DesktopIcon } from '@radix-ui/react-icons'
import { MouseEvent } from 'react'

const features = [
  {
    icon: LockClosedIcon,
    title: 'Zero-Knowledge Architecture',
    description: 'End-to-end encryption ensures that even service providers cannot access your data. True privacy by design.',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
  },
  {
    icon: EyeNoneIcon,
    title: 'Privacy-First',
    description: 'Built with privacy as the core principle. No tracking, no data collection, no compromises.',
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-500',
  },
  {
    icon: CubeIcon,
    title: 'Microservices Architecture',
    description: 'Modular design with strict separation of concerns. Identity, storage, and application logic are isolated.',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500',
  },
  {
    icon: DesktopIcon,
    title: 'Self-Hosted Options',
    description: 'Full control over your infrastructure. Deploy on your own servers with complete autonomy.',
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-500',
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const Icon = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative bg-white dark:bg-neutral-900 p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 transition-all duration-300 overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(253, 94, 15, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      
      <div className="relative z-10">
        <div className={`w-14 h-14 flex items-center justify-center mb-6 rounded-2xl bg-gradient-to-br ${feature.color} border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-7 h-7 ${feature.iconColor}`} />
        </div>
        
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-brand-orange transition-colors duration-300">
          {feature.title}
        </h3>
        
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {feature.description}
        </p>

        <div className="mt-6 flex items-center text-sm font-semibold text-neutral-400 group-hover:text-brand-orange transition-colors duration-300 cursor-pointer">
          Learn more 
          <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* * Background Grid Pattern */}
      <div className="absolute inset-0 -z-20 opacity-[0.03] dark:opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
             backgroundSize: '40px 40px'
           }} 
      />

      {/* * Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 dark:opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-brand-orange uppercase bg-brand-orange/10 rounded-full border border-brand-orange/20">
            Security & Privacy
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tight">
            Built for Privacy
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Every component of the Ciphera platform is designed with privacy and security as the foundation, 
            ensuring your data remains yours alone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
