'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  EnvelopeClosedIcon, 
  ChatBubbleIcon, 
  GlobeIcon,
  PaperPlaneIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons'

const contactMethods = [
  {
    icon: EnvelopeClosedIcon,
    title: 'Email',
    description: 'For general inquiries and support',
    value: 'hello@ciphera.net',
    href: 'mailto:hello@ciphera.net',
    gradient: 'from-brand-orange to-orange-600',
  },
  {
    icon: ExclamationTriangleIcon,
    title: 'Security',
    description: 'Report vulnerabilities responsibly',
    value: 'security@ciphera.net',
    href: 'mailto:security@ciphera.net',
    gradient: 'from-red-500 to-rose-600',
  },
  {
    icon: ChatBubbleIcon,
    title: 'Business',
    description: 'Partnership and enterprise inquiries',
    value: 'business@ciphera.net',
    href: 'mailto:business@ciphera.net',
    gradient: 'from-violet-500 to-purple-600',
  },
]

const subjects = [
  'General Inquiry',
  'Security Issue',
  'Business Partnership',
  'Technical Support',
  'Feature Request',
  'Other',
]

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    
    // * Simulated submission - connect to actual API endpoint in production
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    }, 1500)
  }

  return (
    <>
      {/* * Hero Section */}
      <section className="relative section-padding overflow-hidden">
        {/* * Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[128px] opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[128px] opacity-30" />
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
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tight">
              We're here to{' '}
              <span className="gradient-text">help</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Have questions about our privacy tools? Want to report a security issue? 
              Or just want to say hello? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* * Contact Methods */}
      <section className="section-container pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <motion.a
                key={method.title}
                href={method.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group card card-hover p-6 text-center"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                  {method.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                  {method.description}
                </p>
                <span className="text-brand-orange font-medium group-hover:underline">
                  {method.value}
                </span>
              </motion.a>
            )
          })}
        </div>
      </section>

      {/* * Contact Form Section */}
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* * Left - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge-neutral mb-6 inline-flex">Contact Form</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
                Send us a message
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                Fill out the form and we'll get back to you as soon as possible. 
                We typically respond within 24-48 hours.
              </p>

              {/* * Office Info */}
              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 flex items-center justify-center shrink-0">
                    <GlobeIcon className="w-6 h-6 text-neutral-600 dark:text-neutral-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                      Headquarters
                    </h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                      The Antwerp Tower<br />
                      Frankrijklei 5/401<br />
                      2000 Antwerp, Belgium
                    </p>
                  </div>
                </div>
              </div>

              {/* * Response time note */}
              <div className="mt-6 flex items-start gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                <CheckCircledIcon className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  We take security reports seriously. If you've found a vulnerability, 
                  please use the security email above for faster response.
                </p>
              </div>
            </motion.div>

            {/* * Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="card p-6 md:p-8">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all duration-200"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all duration-200"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all duration-200"
                    >
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all duration-200 resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-primary w-full py-4"
                  >
                    {status === 'submitting' ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <PaperPlaneIcon className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>

                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl text-center font-medium"
                    >
                      <CheckCircledIcon className="w-5 h-5 inline-block mr-2" />
                      Message sent successfully! We'll get back to you soon.
                    </motion.div>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
