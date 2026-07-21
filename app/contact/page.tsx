'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { officeHq } from '@/lib/images'
import {
  Input,
  Button,
  MailIcon,
  GlobeIcon,
  CheckCircleIcon,
  LockIcon,
  ArrowRightIcon,
  GithubIcon,
  Captcha
} from '@ciphera-net/facet'
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr'
import { track } from '../../lib/pulse'
import { env } from '@/lib/env'

// * Contact methods with response time SLAs
const contactMethods = [
  {
    icon: MailIcon,
    title: 'Email',
    description: 'For general inquiries and support',
    value: 'hello@ciphera.net',
    href: 'mailto:hello@ciphera.net',
    trackEvent: 'contact_email_hello_click' as const,
    responseTime: '24-48 hours',
  },
  {
    icon: LockIcon,
    title: 'Security',
    description: 'Report vulnerabilities responsibly',
    value: 'security@ciphera.net',
    href: 'mailto:security@ciphera.net',
    trackEvent: 'contact_email_security_click' as const,
    responseTime: '4-8 hours',
  },
  {
    icon: GlobeIcon,
    title: 'Business',
    description: 'Partnership and enterprise inquiries',
    value: 'business@ciphera.net',
    href: 'mailto:business@ciphera.net',
    trackEvent: 'contact_email_business_click' as const,
    responseTime: '1-2 business days',
  },
]

// * Common contact reasons with helpful links
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
    '@id': 'https://ciphera.net/#organization',
    name: 'Ciphera',
    url: 'https://ciphera.net',
    telephone: '+3278480710',
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
        contactType: 'technical support',
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
  })
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // * Captcha state - matching auth implementation
  const [captchaId, setCaptchaId] = useState('')
  const [captchaSolution, setCaptchaSolution] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')

  // * Honeypot ref — real users never touch this hidden field. Bots that
  // * auto-fill every input will populate it; the backend rejects any non-empty
  // * value. Using a ref instead of controlled state catches both onChange-aware
  // * automation (which triggers React updates) and dumb automation that sets
  // * input.value directly (which would not update React state).
  const honeypotRef = useRef<HTMLInputElement>(null)

  // * Page load timestamp — captured exactly once on mount. Sent with the form
  // * submission so the backend can reject implausibly fast submissions (<2s).
  // * Client-controlled so spoofable, but adds one more bar bots have to clear.
  const [pageLoadedAt] = useState<number>(() => Date.now())

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

  // * Field-level validation only kicks in after the first submit attempt, so
  // * errors never appear on blur before the user tries to send. After a submit
  // * attempt, blur re-validates that field for live feedback.
  const handleFieldBlur = (field: string, value: string) => {
    if (!submitAttempted) return
    setFieldErrors({ ...fieldErrors, [field]: validateField(field, value) })
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
    setSubmitAttempted(true)

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

    if (!captchaToken && (!captchaId || !captchaSolution)) {
      setErrorMessage('Please complete the captcha verification')
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch(`${env.NEXT_PUBLIC_WEBSITE_API_URL}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          captcha_id: captchaId,
          captcha_solution: captchaSolution,
          captcha_token: captchaToken,
          // * Honeypot — real users never populate this, bots auto-fill it
          website: honeypotRef.current?.value || '',
          // * Page dwell timestamp — backend rejects submissions faster than 2s
          page_loaded_at: pageLoadedAt,
        }),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' })
        setCaptchaId('')
        setCaptchaSolution('')
        setCaptchaToken('')
        track('contact_form_submit_success')
        setTimeout(() => setStatus('idle'), 8000)
      } else {
        const data = await response.json()
        setStatus('error')
        setErrorMessage(data.error || 'Failed to send message. Please try again.')
        track('contact_form_submit_error')
        setTimeout(() => { setStatus('idle'); setErrorMessage('') }, 5000)
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again or email us directly.')
      track('contact_form_submit_error')
      setTimeout(() => { setStatus('idle'); setErrorMessage('') }, 5000)
    }
  }

  return (
    <>
      {/* * JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      {/* * Hero — A1 full-bleed section with A2 mono kicker + font-display h1 */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">Get in touch</p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            We&apos;re here to help
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Have questions about our privacy tools? Want to report a security issue?
            Or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* * Send a message — A1 section, editorial split layout */}
      <section className="border-b border-border">
        <div className="grid lg:grid-cols-2">
          {/* * Left — info + office photo + business hours */}
          <div className="flex flex-col px-6 py-16 sm:py-24 lg:pr-14 border-b border-border lg:border-b-0 lg:border-r">
            <p className="text-xs text-muted-foreground">01 · Office</p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Send us a message
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Fill out the form and we&apos;ll get back to you as soon as possible.
              We typically respond within <span className="tabular-nums text-foreground">24–48 hours</span>.
            </p>

            {/* * Office Photo — sharp, no rounded/shadow, grayscale */}
            <div className="mt-8 border border-border overflow-hidden">
              <div className="relative aspect-video w-full bg-card">
                <Image
                  src={officeHq}
                  alt="Ciphera headquarters in Diegem, Belgium"
                  fill
                  className="object-cover grayscale"
                  unoptimized
                  onError={(e) => {
                    // * Fallback to placeholder if image doesn't exist
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `
                        <div class="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
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
              <div className="flex items-start gap-3 border-t border-border bg-card p-4">
                <GlobeIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Headquarters
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    De Kleetlaan 2<br />
                    1831 Diegem, Belgium
                  </p>
                </div>
              </div>
            </div>

            {/* * Business hours — A5 flat card */}
            <div className="mt-4 border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                {/* A6 framed icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-background">
                  <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Business Hours
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Monday – Friday<br />
                    <span className="tabular-nums text-foreground">08:00–12:00, 13:00–18:00 CET</span>
                  </p>
                </div>
              </div>
            </div>

            {/* * Important notes */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircleIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p>
                  We take security reports seriously. If you&apos;ve found a vulnerability,
                  please use the security email above for faster response.
                </p>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircleIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p>
                  You&apos;ll receive an automatic confirmation email once we receive your message.
                </p>
              </div>
            </div>
          </div>

          {/* * Right — form — A5 flat card container */}
          <div className="px-6 py-16 sm:py-24 lg:pl-14">
            <form onSubmit={handleSubmit} className="border border-border bg-card p-6 sm:p-8">
              {/*
                * Honeypot field — invisible to humans (off-screen, aria-hidden,
                * untabbable, no autocomplete) but present in the DOM so
                * auto-fill bots will populate it. A non-empty value on submit
                * identifies the submission as automated and the backend drops it.
                */}
              <input
                ref={honeypotRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                defaultValue=""
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
              />
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Name <span className="text-primary">*</span>
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
                      aria-invalid={(submitAttempted && !!fieldErrors.name) || undefined}
                      aria-describedby={submitAttempted && fieldErrors.name ? 'name-error' : undefined}
                    />
                    {submitAttempted && fieldErrors.name && (
                      <p id="name-error" className="text-sm text-destructive mt-1">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email <span className="text-primary">*</span>
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
                      aria-invalid={(submitAttempted && !!fieldErrors.email) || undefined}
                      aria-describedby={submitAttempted && fieldErrors.email ? 'email-error' : undefined}
                    />
                    {submitAttempted && fieldErrors.email && (
                      <p id="email-error" className="text-sm text-destructive mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full appearance-none border border-border bg-background px-4 py-3 pr-10 text-foreground focus-visible:ring-2 focus-visible:ring-ring focus:outline-none transition-colors"
                    >
                      {subjectOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <CaretDownIcon aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="message" className="block text-sm font-medium text-foreground">
                      Message <span className="text-primary">*</span>
                    </label>
                    <span className="text-xs text-muted-foreground">
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
                    className="w-full border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus:outline-none transition-colors resize-none"
                    placeholder="How can we help you?"
                    aria-invalid={(submitAttempted && !!fieldErrors.message) || undefined}
                    aria-describedby={submitAttempted && fieldErrors.message ? 'message-error' : undefined}
                  />
                  {submitAttempted && fieldErrors.message && (
                    <p id="message-error" className="text-sm text-destructive mt-1">{fieldErrors.message}</p>
                  )}
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
                    apiUrl={env.NEXT_PUBLIC_CAPTCHA_API_URL}
                    action="contact"
                  />
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
                  <div
                    className="p-4 border border-[var(--color-success)]/40 bg-card text-[var(--color-success)]"
                    role="alert"
                    aria-live="polite"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">Message sent successfully!</p>
                        <p className="text-sm text-muted-foreground">
                          We&apos;ve received your message and will respond within our typical timeframe.
                          You&apos;ll receive a confirmation email shortly.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div
                    className="p-4 border border-destructive/40 bg-card text-destructive"
                    role="alert"
                    aria-live="polite"
                  >
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Failed to send message</p>
                        <p className="text-sm text-muted-foreground">{errorMessage || 'Please try again or contact us directly via email.'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {errorMessage && status !== 'error' && status !== 'success' && (
                  <div
                    className="p-3 border border-[var(--color-warning)]/40 bg-card text-[var(--color-warning)] text-sm"
                    role="alert"
                    aria-live="polite"
                  >
                    {errorMessage}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* * Contact methods — A1 section with A5 flat cards */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">02 · Contact</p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Reach us directly
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.title}
                  className="border border-border bg-card p-6"
                >
                  {/* A6 icon — bare icon, no colored bubble */}
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-foreground">
                    {method.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {method.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href={method.href}
                      className="text-sm text-primary font-medium hover:underline"
                      onClick={() => track(method.trackEvent)}
                    >
                      {method.value}
                    </a>
                    <button
                      onClick={() => copyToClipboard(method.value)}
                      className="inline-flex items-center justify-center size-11 shrink-0 border border-border bg-card hover:bg-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus:outline-none"
                      title="Copy to clipboard"
                    >
                      {copiedEmail === method.value ? (
                        <CheckCircleIcon className="w-4 h-4 text-pos" />
                      ) : (
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Response:{' '}
                    <span className="tabular-nums text-foreground">{method.responseTime}</span>
                  </p>
                </div>
              )
            })}

            {/* * Phone number card */}
            <div className="border border-border bg-card p-6">
              {/* A6 icon — framed bare icon */}
              <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-foreground">
                Phone
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                For urgent matters
              </p>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href="tel:+32078480710"
                  className="text-sm text-primary font-medium hover:underline"
                  onClick={() => track('contact_phone_click')}
                >
                  +32 078 480 710
                </a>
                <button
                  onClick={() => copyToClipboard('+32 078 480 710')}
                  className="inline-flex items-center justify-center size-11 shrink-0 border border-border bg-card hover:bg-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus:outline-none"
                  title="Copy to clipboard"
                >
                  {copiedEmail === '+32 078 480 710' ? (
                    <CheckCircleIcon className="w-4 h-4 text-pos" />
                  ) : (
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Mon-Fri,{' '}
                <span className="tabular-nums text-foreground">08:00–12:00, 13:00–18:00</span>
              </p>
            </div>
          </div>

          {/* * Social links */}
          <div className="mt-10 flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Also on</p>
            <a
              href="https://github.com/ciphera-net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:bg-background transition-colors"
              onClick={() => track('contact_github_click')}
            >
              <GithubIcon className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="mailto:hello@ciphera.net"
              className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:bg-background transition-colors"
              onClick={() => track('contact_email_direct_click')}
            >
              <MailIcon className="w-4 h-4" />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
