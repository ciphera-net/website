'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  Input, 
  Select, 
  Button, 
  MailIcon, 
  GlobeIcon, 
  CheckCircleIcon, 
  LockIcon,
  ArrowRightIcon,
  GithubIcon,
  TwitterIcon,
  Captcha
} from '@ciphera-net/ui'
import Breadcrumbs from '../../components/Breadcrumbs'
import { track } from '../../lib/pulse'

// * Contact methods with response time SLAs
const contactMethods = [
  {
    icon: MailIcon,
    title: 'Email',
    description: 'For general inquiries and support',
    value: 'hello@ciphera.net',
    href: 'mailto:hello@ciphera.net',
    gradient: 'from-brand-orange to-brand-orange-hover',
    trackEvent: 'contact_email_hello_click' as const,
    responseTime: '24-48 hours',
  },
  {
    icon: LockIcon,
    title: 'Security',
    description: 'Report vulnerabilities responsibly',
    value: 'security@ciphera.net',
    href: 'mailto:security@ciphera.net',
    gradient: 'from-red-600 to-red-800',
    trackEvent: 'contact_email_security_click' as const,
    responseTime: '4-8 hours',
  },
  {
    icon: GlobeIcon,
    title: 'Business',
    description: 'Partnership and enterprise inquiries',
    value: 'business@ciphera.net',
    href: 'mailto:business@ciphera.net',
    gradient: 'from-blue-600 to-blue-800',
    trackEvent: 'contact_email_business_click' as const,
    responseTime: '1-2 business days',
  },
]

// * Common contact reasons with helpful links
const commonQuestions = [
  { question: 'How does encryption work?', link: '/#faq' },
  { question: 'Pricing information', link: '/products' },
  { question: 'Technical documentation', link: '#' },
  { question: 'Report a bug', link: 'https://github.com/ciphera-net' },
]

const subjects = [
  'General Inquiry',
  'Security Issue',
  'Business Partnership',
  'Technical Support',
  'Feature Request',
  'Other',
]

const subjectOptions = subjects.map(s => ({ value: s, label: s }))

// * JSON-LD structured data for contact page
const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  mainEntity: {
    '@type': 'Organization',
    name: 'Ciphera',
    url: 'https://ciphera.net',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'hello@ciphera.net',
        contactType: 'Customer Service',
        areaServed: 'Worldwide',
      },
      {
        '@type': 'ContactPoint',
        email: 'security@ciphera.net',
        contactType: 'Security',
        areaServed: 'Worldwide',
      },
      {
        '@type': 'ContactPoint',
        email: 'business@ciphera.net',
        contactType: 'Sales',
        areaServed: 'Worldwide',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'De Kleetlaan 2',
      addressLocality: 'Diegem',
      postalCode: '1831',
      addressCountry: 'BE',
    },
  },
}

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
    gdprConsent: false,
  })
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  
  // * Captcha state - matching auth implementation
  const [captchaId, setCaptchaId] = useState('')
  const [captchaSolution, setCaptchaSolution] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')

  const MESSAGE_MAX_LENGTH = 1000

  // * Real-time field validation
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        if (value.length < 2) return 'Name must be at least 2 characters'
        return ''
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return ''
      case 'message':
        if (value.length < 10) return 'Message must be at least 10 characters'
        if (value.length > MESSAGE_MAX_LENGTH) return `Message must not exceed ${MESSAGE_MAX_LENGTH} characters`
        return ''
      default:
        return ''
    }
  }

  const handleFieldBlur = (field: string, value: string) => {
    const error = validateField(field, value)
    setFieldErrors({ ...fieldErrors, [field]: error })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // * Limit file size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must not exceed 5MB')
        return
      }
      setAttachedFile(file)
      setErrorMessage('')
    }
  }

  const copyToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      track('contact_email_copied')
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    
    // * Validate all fields
    const errors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message),
    }
    setFieldErrors(errors)

    if (Object.values(errors).some((error) => error)) {
      setErrorMessage('Please fix the errors above before submitting')
      return
    }

    if (!captchaId || !captchaSolution) {
      setErrorMessage('Please complete the captcha verification')
      return
    }

    if (!formData.gdprConsent) {
      setErrorMessage('Please accept the privacy policy to continue')
      return
    }

    setStatus('submitting')
    
    // * Simulated submission - connect to actual API endpoint in production
    setTimeout(() => {
      // * TODO: Connect to actual API - send formData, captchaId, captchaSolution, captchaToken, attachedFile
      const success = Math.random() > 0.1 // * 90% success rate simulation
      if (success) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '', gdprConsent: false })
        setAttachedFile(null)
        setCaptchaId('')
        setCaptchaSolution('')
        setCaptchaToken('')
        track('contact_form_submit_success')
        setTimeout(() => setStatus('idle'), 8000)
      } else {
        setStatus('error')
        setErrorMessage('Failed to send message. Please try again or email us directly.')
        track('contact_form_submit_error')
        setTimeout(() => setStatus('idle'), 5000)
      }
    }, 1500)
  }

  return (
    <>
      {/* * JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group card card-hover p-6 text-center relative"
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
                <div className="flex items-center justify-center gap-2 mb-2">
                  <a
                    href={method.href}
                    className="text-brand-orange font-medium hover:underline"
                    onClick={() => track(method.trackEvent)}
                  >
                    {method.value}
                  </a>
                  <button
                    onClick={() => copyToClipboard(method.value)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    title="Copy to clipboard"
                  >
                    {copiedEmail === method.value ? (
                      <CheckCircleIcon className="w-4 h-4 text-brand-orange" />
                    ) : (
                      <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Response: {method.responseTime}
                </p>
              </motion.div>
            )
          })}
          
          {/* * Phone number card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group card card-hover p-6 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
              Phone
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
              For urgent matters
            </p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <a
                href="tel:+32078480710"
                className="text-brand-orange font-medium hover:underline"
                onClick={() => track('contact_phone_click')}
              >
                +32 078 480 710
              </a>
              <button
                onClick={() => copyToClipboard('+32 078 480 710')}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange"
                title="Copy to clipboard"
              >
                {copiedEmail === '+32 078 480 710' ? (
                  <CheckCircleIcon className="w-4 h-4 text-brand-orange" />
                ) : (
                  <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Mon-Fri, 08:00-12:00, 13:00-18:00
            </p>
          </motion.div>
        </div>

        {/* * Social media links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            You can also reach us on
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/ciphera-net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300"
              onClick={() => track('contact_github_click')}
            >
              <GithubIcon className="w-5 h-5" />
              GitHub
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300"
              onClick={() => track('contact_twitter_click')}
            >
              <TwitterIcon className="w-5 h-5" />
              Twitter
            </a>
          </div>
        </motion.div>
      </section>

      {/* * Common Questions */}
      <section className="section-container pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card p-8 max-w-3xl mx-auto"
        >
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 text-center">
            Before you contact us, you might find your answer here:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {commonQuestions.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
                onClick={() => track('contact_common_question_click')}
              >
                <CheckCircleIcon className="w-5 h-5 text-brand-orange shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300 group-hover:text-brand-orange transition-colors">
                  {item.question}
                </span>
                <ArrowRightIcon className="w-4 h-4 text-neutral-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
          </div>
        </motion.div>
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
              <div className="space-y-4">
                {/* * Office Photo */}
                <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-lg">
                  <div className="relative aspect-video w-full bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src="/office.jpeg"
                      alt="Ciphera headquarters in Diegem, Belgium"
                      fill
                      unoptimized
                      className="object-cover"
                      onError={(e) => {
                        // * Fallback to placeholder if image doesn't exist
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `
                            <div class="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-600">
                              <svg class="w-16 h-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <p class="text-sm">Ciphera Headquarters</p>
                            </div>
                          `
                        }
                      }}
                    />
                  </div>
                  <div className="p-4 bg-white dark:bg-neutral-800">
                    <div className="flex items-start gap-3">
                      <GlobeIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                          Headquarters
                        </h4>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                          De Kleetlaan 2<br />
                          1831 Diegem, Belgium
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* * Business hours */}
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/10 dark:from-brand-orange/30 dark:to-brand-orange/20 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                        Business Hours
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                        Monday - Friday<br />
                        08:00 - 12:00, 13:00 - 18:00 CET
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* * Important notes */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                  <CheckCircleIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <p>
                    We take security reports seriously. If you've found a vulnerability, 
                    please use the security email above for faster response.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                  <CheckCircleIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <p>
                    You'll receive an automatic confirmation email once we receive your message.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* * Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="card p-4 sm:p-6 md:p-8">
                <div className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Name <span className="text-brand-orange">*</span>
                      </label>
                      <Input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value })
                          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' })
                        }}
                        onBlur={(e) => handleFieldBlur('name', e.target.value)}
                        placeholder="Your name"
                      />
                      {fieldErrors.name && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{fieldErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Email <span className="text-brand-orange">*</span>
                      </label>
                      <Input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value })
                          if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' })
                        }}
                        onBlur={(e) => handleFieldBlur('email', e.target.value)}
                        placeholder="you@example.com"
                      />
                      {fieldErrors.email && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Subject <span className="text-brand-orange">*</span>
                    </label>
                    <Select
                      id="subject"
                      value={formData.subject}
                      onChange={(value) => setFormData({ ...formData, subject: value })}
                      options={subjectOptions}
                      variant="input"
                      fullWidth
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Message <span className="text-brand-orange">*</span>
                      </label>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {formData.message.length}/{MESSAGE_MAX_LENGTH}
                      </span>
                    </div>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => {
                        if (e.target.value.length <= MESSAGE_MAX_LENGTH) {
                          setFormData({ ...formData, message: e.target.value })
                          if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' })
                        }
                      }}
                      onBlur={(e) => handleFieldBlur('message', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all duration-200 resize-none"
                      placeholder="How can we help you?"
                    />
                    {fieldErrors.message && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{fieldErrors.message}</p>
                    )}
                  </div>

                  {/* * File attachment */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Attachment (optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 px-4 py-3 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-brand-orange dark:hover:border-brand-orange cursor-pointer transition-colors">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                        <div className="flex items-center gap-2 justify-center text-sm text-neutral-600 dark:text-neutral-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          {attachedFile ? attachedFile.name : 'Choose file (max 5MB)'}
                        </div>
                      </label>
                      {attachedFile && (
                        <button
                          type="button"
                          onClick={() => setAttachedFile(null)}
                          className="p-2 text-neutral-500 hover:text-red-600 transition-colors"
                          title="Remove file"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Supported: Images, PDF, DOC, DOCX, TXT
                    </p>
                  </div>

                  {/* * Ciphera Captcha - same implementation as auth */}
                  <div className="pt-2">
                    <Captcha
                      onVerify={(id, solution, token) => {
                        setCaptchaId(id)
                        setCaptchaSolution(solution)
                        setCaptchaToken(token || '')
                        track('contact_captcha_verified')
                      }}
                      apiUrl={process.env.NEXT_PUBLIC_CAPTCHA_API_URL}
                    />
                  </div>

                  {/* * GDPR Consent */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="gdpr"
                      checked={formData.gdprConsent}
                      onChange={(e) => setFormData({ ...formData, gdprConsent: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-brand-orange focus:ring-brand-orange"
                      required
                    />
                    <label htmlFor="gdpr" className="text-sm text-neutral-600 dark:text-neutral-400">
                      I agree to the processing of my personal data as described in the{' '}
                      <a href="#" className="text-brand-orange hover:underline">
                        Privacy Policy
                      </a>
                      . Your data is encrypted in transit and handled securely. <span className="text-brand-orange">*</span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-4 h-auto text-base"
                    isLoading={status === 'submitting'}
                  >
                    {!status || status === 'idle' || status === 'success' || status === 'error' ? (
                      <>
                        Send Message
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                      </>
                    ) : null}
                  </Button>

                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl"
                      role="alert"
                      aria-live="polite"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Message sent successfully!</p>
                          <p className="text-sm">
                            We've received your message and will respond within our typical timeframe. 
                            You'll receive a confirmation email shortly.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl"
                      role="alert"
                      aria-live="polite"
                    >
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-semibold mb-1">Failed to send message</p>
                          <p className="text-sm">{errorMessage || 'Please try again or contact us directly via email.'}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {errorMessage && status !== 'error' && status !== 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 rounded-xl text-sm"
                      role="alert"
                      aria-live="polite"
                    >
                      {errorMessage}
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