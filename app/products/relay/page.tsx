import { Metadata } from 'next'
import Link from 'next/link'
import { RelayMockup } from '@/components/ui/relay-mockup'
import { EmailAuthMockup } from '@/components/ui/email-auth-mockup'
import { NoTrackingMockup } from '@/components/ui/no-tracking-mockup'
import { relayIcon, genA10, zurichPhoto } from '@/lib/images'
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeSlash,
  Globe,
  ArrowRight,
  Check,
  X,
  Timer,
  EnvelopeSimple,
  Fingerprint,
} from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Ciphera Relay - Secure Email Infrastructure',
  description:
    'Privacy-first transactional email delivery with TLS 1.3, DKIM, SPF, and DMARC. No tracking pixels, no open tracking, Swiss hosted. 99.8% deliverability.',
  alternates: {
    canonical: 'https://ciphera.net/products/relay',
  },
  openGraph: {
    title: 'Ciphera Relay - Secure Email Infrastructure',
    description:
      'Privacy-first transactional email delivery with TLS 1.3, DKIM, SPF, and DMARC. No tracking, Swiss hosted.',
    url: 'https://ciphera.net/products/relay',
    siteName: 'Ciphera',
    images: [
      {
        url: '/relay_icon_no_margins.png',
        width: 512,
        height: 512,
        alt: 'Ciphera Relay - Secure Email Infrastructure',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ciphera Relay - Secure Email Infrastructure',
    description:
      'Privacy-first transactional email with TLS 1.3, DKIM/SPF/DMARC. No tracking, Swiss infrastructure.',
    images: ['/relay_icon_no_margins.png'],
  },
}

const relaySchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ciphera Relay',
    description:
      'Privacy-first transactional email delivery with TLS encryption. High deliverability rates for verification emails, notifications, and alerts.',
    applicationCategory: 'CommunicationApplication',
    operatingSystem: 'Web',
    url: 'https://ciphera.net/products/relay',
    provider: {
      '@type': 'Organization',
      name: 'Ciphera',
      url: 'https://ciphera.net',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ciphera.net',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://ciphera.net/products',
      },
      { '@type': 'ListItem', position: 3, name: 'Ciphera Relay' },
    ],
  },
]

export default function CipheraRelayPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(relaySchema) }}
      />

      {/* Hero */}
      <section className="relative -mt-[88px] min-h-screen flex items-center pt-[88px] pb-20 lg:pb-32 bg-neutral-950 overflow-hidden">
        <img
          src={genA10.src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-neutral-950 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
              Transactional email that respects privacy.
            </h1>

            <p className="text-xl text-neutral-300 mb-10 leading-relaxed max-w-xl">
              The email backbone behind every Ciphera service. TLS 1.3
              encryption, DKIM signing, and zero tracking — verification
              codes, security alerts, and notifications delivered in under
              2 seconds.
            </p>

            <div className="flex flex-row gap-3 flex-wrap mb-12">
              <Button
                size="lg"
                className="gap-2 bg-brand-orange-button hover:bg-brand-orange-button-hover text-white"
                asChild
              >
                <Link href="/contact">
                  Contact Sales <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="gap-2 text-neutral-300 hover:text-white"
                asChild
              >
                <Link href="/about">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-400">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-orange" />
                TLS 1.3
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                DKIM / SPF / DMARC
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <EyeSlash className="w-4 h-4 text-brand-orange" />
                No tracking
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <EnvelopeSimple className="w-4 h-4 text-brand-orange" />
                99.8% deliverability
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature blocks */}
      <section className="py-20 lg:py-32 bg-neutral-950 space-y-28">
        {/* Security Alerts — text left, mockup right */}
        <div id="alerts" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Security-critical emails, delivered fast.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                When someone tries to break into an account or a password
                needs resetting, speed matters. Relay delivers verification
                codes, security alerts, and lockout notifications in under
                2 seconds — with TLS encryption from server to inbox.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Verification emails and password resets',
                  'Suspicious login alerts and account lockout notices',
                  'Billing alerts and uptime reports (Pulse)',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-neutral-400"
                  >
                    <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={genA10.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <RelayMockup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Authentication — mockup left, text right */}
        <div id="authentication" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={genA10.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <EmailAuthMockup />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Every email authenticated. Every time.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Relay signs every email with DKIM using per-domain key pairs,
                publishes strict SPF records, and enforces DMARC with a
                reject policy. The result: 99.8% inbox deliverability and
                zero spoofing.
              </p>
              <ul className="space-y-3">
                {[
                  'TLS 1.3 encryption for all email transmission',
                  'Per-domain DKIM key pairs — never shared between services',
                  'SPF records authorize only the Relay server IP',
                  'DMARC policy set to reject — spoofed emails are blocked',
                  'Reverse DNS (PTR) configured for SMTP HELO compliance',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-neutral-400"
                  >
                    <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy by Design — text left, mockup right */}
        <div id="privacy-design" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Zero trackers. Zero pixels. Zero profiling.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Most email services embed tracking pixels, log open rates,
                and profile recipients across sites. Relay sends clean
                emails with no hidden payloads — no open tracking, no click
                tracking, no third-party analytics. Delivery metadata is
                retained for 30 days, then deleted.
              </p>
              <ul className="space-y-3">
                {[
                  'No tracking pixels embedded in any email',
                  'No open or click rate monitoring',
                  'No recipient IP logging or profiling',
                  'No third-party analytics or data sharing',
                  '30-day metadata retention, then permanent deletion',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-neutral-400"
                  >
                    <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={genA10.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <NoTrackingMockup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration — code left, text right */}
        <div id="integration" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={genA10.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-6 w-full shadow-2xl space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                        <span className="text-[10px] text-neutral-500 ml-2 font-mono">
                          .env
                        </span>
                      </div>
                      <pre className="font-mono text-[11px] leading-relaxed">
                        <code>
                          <span className="text-neutral-500"># SMTP configuration</span>{'\n'}
                          <span className="text-purple-400">SMTP_HOST</span>
                          <span className="text-neutral-500">=</span>
                          <span className="text-amber-300">relay.ciphera.net</span>{'\n'}
                          <span className="text-purple-400">SMTP_PORT</span>
                          <span className="text-neutral-500">=</span>
                          <span className="text-amber-300">587</span>{'\n'}
                          <span className="text-purple-400">SMTP_USER</span>
                          <span className="text-neutral-500">=</span>
                          <span className="text-amber-300">authnoreply</span>{'\n'}
                          <span className="text-purple-400">SMTP_FROM</span>
                          <span className="text-neutral-500">=</span>
                          <span className="text-amber-300">noreply@id.ciphera.net</span>{'\n'}
                          {'\n'}
                          <span className="text-neutral-500"># Per-service sender domains</span>{'\n'}
                          <span className="text-neutral-600"># Auth  → noreply@id.ciphera.net</span>{'\n'}
                          <span className="text-neutral-600"># Pulse → noreply@pulse.ciphera.net</span>
                        </code>
                      </pre>
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-800 pt-3">
                        <span>Standard SMTP AUTH — works with any language</span>
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          STARTTLS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Standard SMTP. Any language.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                No SDK, no proprietary API. Relay uses standard SMTP AUTH
                over port 587 with STARTTLS — it works with any language,
                framework, or email library. Each Ciphera service gets its
                own sender domain and DKIM key for clean provenance.
              </p>
              <ul className="space-y-3">
                {[
                  'SMTP AUTH on port 587 (STARTTLS) or 465 (implicit TLS)',
                  'Per-service sender domains for email provenance',
                  'Works with Go, Node.js, Python, PHP — any SMTP client',
                  'Sub-2-second delivery for transactional emails',
                  'No proprietary SDK or API lock-in',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-neutral-400"
                  >
                    <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison — side by side cards */}
      <section id="comparison" className="py-20 lg:py-32 bg-neutral-950 border-t border-white/[0.04] scroll-mt-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              How Ciphera Relay compares.
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Most email services track opens, clicks, and recipient behavior.
              Relay just delivers the email.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Relay card — highlighted */}
            <div className="rounded-xl border border-brand-orange/20 bg-neutral-900/80 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-orange" />
              <div className="flex items-center gap-3 mb-8">
                <img
                  src={relayIcon.src}
                  alt="Ciphera Relay"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">Ciphera Relay</h3>
                  <p className="text-xs text-brand-orange">Privacy-first email</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  'No tracking pixels or open tracking',
                  'TLS 1.3 encryption',
                  'Per-domain DKIM signing',
                  'DMARC reject policy',
                  'Self-hosted (Swiss infrastructure)',
                  'Standard SMTP — no vendor lock-in',
                  '30-day metadata retention only',
                  'Transactional only — no marketing',
                  'Sub-2-second delivery',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-neutral-300"
                  >
                    <Check className="w-5 h-5 text-brand-orange shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Others card — muted */}
            <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-neutral-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Traditional Services</h3>
                  <p className="text-xs text-neutral-500">SendGrid, Postmark, SES</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  { feature: 'Tracking pixels by default', has: false },
                  { feature: 'TLS encryption', has: true },
                  { feature: 'Shared DKIM infrastructure', has: false },
                  { feature: 'DMARC support', has: true },
                  { feature: 'US cloud infrastructure', has: false },
                  { feature: 'Proprietary API required', has: false },
                  { feature: 'Indefinite data retention', has: false },
                  { feature: 'Marketing + transactional', has: false },
                  { feature: 'Fast delivery', has: true },
                ].map((item) => (
                  <li
                    key={item.feature}
                    className={`flex items-center gap-3 ${item.has ? 'text-neutral-400' : 'text-neutral-500'}`}
                  >
                    {item.has ? (
                      <Check className="w-5 h-5 text-neutral-500 shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-neutral-600 shrink-0" />
                    )}
                    <span className="text-sm">{item.feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Swiss Privacy — photo left, text right */}
      <section id="privacy" className="py-20 lg:py-32 bg-neutral-950 scroll-mt-28">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08]">
                  <img
                    src={zurichPhoto.src}
                    alt="Zurich, Switzerland"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2.5">
                    {[
                      { icon: Globe, title: 'Data residency', desc: 'Exoscale, Switzerland (CH-DK-2)' },
                      { icon: Timer, title: 'Data retention', desc: '30 days, then deleted' },
                      { icon: ShieldCheck, title: 'Compliance', desc: 'GDPR, FADP, no tracking' },
                    ].map((item) => (
                      <div key={item.title} className="flex items-center gap-3 rounded-xl bg-neutral-900/80 border border-white/[0.08] px-4 py-3 backdrop-blur-sm">
                        <item.icon className="w-5 h-5 text-brand-orange shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-white">{item.title}</p>
                          <p className="text-[11px] text-neutral-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Swiss infrastructure. Swiss privacy laws.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Relay runs on Exoscale in Switzerland, protected by the
                Swiss Federal Act on Data Protection (FADP). Email metadata
                is retained for 30 days under contract performance basis,
                then permanently deleted. No marketing emails, no behavioral
                data, no profiling.
              </p>
              <ul className="space-y-3">
                {[
                  'Hosted on Exoscale, Zurich (CH-DK-2)',
                  'Stalwart Mail Server — open-source foundation',
                  'Admin UI bound to localhost only (SSH tunnel access)',
                  'Let\'s Encrypt TLS certificates with auto-renewal',
                  'Transactional only — marketing emails are never sent',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-neutral-400"
                  >
                    <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-neutral-950">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-neutral-900/80 px-6 py-20 sm:px-10 sm:py-24 max-w-6xl mx-auto">
            <img
              src={genA10.src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Interested in Ciphera Relay?
              </h2>
              <p className="text-lg text-neutral-300 mb-10">
                Ciphera Relay is currently an internal service powering email
                delivery across the Ciphera ecosystem. Reach out if you&apos;re
                interested in the technology for your platform.
              </p>
              <div className="flex flex-row gap-3 justify-center flex-wrap">
                <Button
                  size="lg"
                  className="gap-2 bg-brand-orange-button hover:bg-brand-orange-button-hover text-white"
                  asChild
                >
                  <Link href="/contact">
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="gap-2 text-neutral-300 hover:text-white border border-white/10"
                  asChild
                >
                  <Link href="/about">About Ciphera</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
