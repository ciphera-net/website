import { Metadata } from 'next'
import Link from 'next/link'
import { CaptchaMockup } from '@/components/ui/captcha-mockup'
import { PuzzleMockup } from '@/components/ui/puzzle-mockup'
import { RiskScoreMockup } from '@/components/ui/risk-score-mockup'
import { captchaIcon, captchaShowcaseBg, zurichPhoto } from '@/lib/images'
import {
  ShieldCheck,
  Lightning,
  Eye,
  EyeSlash,
  Globe,
  ArrowRight,
  Check,
  X,
  Timer,
  Robot,
  Fingerprint,
} from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Ciphera Captcha - Privacy-First Bot Protection',
  description:
    'Protect your applications from bots with adaptive proof-of-work, puzzle challenges, and behavioral analysis. No cookies, no cross-site tracking, fully stateless.',
  alternates: {
    canonical: 'https://ciphera.net/products/captcha',
  },
  openGraph: {
    title: 'Ciphera Captcha - Privacy-First Bot Protection',
    description:
      'Protect your applications from bots with adaptive proof-of-work, puzzle challenges, and behavioral analysis. No cookies, no cross-site tracking.',
    url: 'https://ciphera.net/products/captcha',
    siteName: 'Ciphera',
    images: [
      {
        url: '/captcha_icon_no_margins.png',
        width: 512,
        height: 512,
        alt: 'Ciphera Captcha - Privacy-First Bot Protection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ciphera Captcha - Privacy-First Bot Protection',
    description:
      'Adaptive proof-of-work, puzzle challenges, and 5-signal risk scoring. No tracking, fully stateless.',
    images: ['/captcha_icon_no_margins.png'],
  },
}

const captchaSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ciphera Captcha',
    description:
      'Privacy-first bot protection with adaptive proof-of-work, puzzle challenges, audio verification, and behavioral risk scoring. Stateless, self-hosted, no tracking.',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    url: 'https://ciphera.net/products/captcha',
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
      { '@type': 'ListItem', position: 3, name: 'Ciphera Captcha' },
    ],
  },
]

export default function CipheraCaptchaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(captchaSchema) }}
      />

      {/* Hero */}
      <section className="relative -mt-[88px] min-h-screen flex items-center pt-[88px] pb-20 lg:pb-32 bg-neutral-950 overflow-hidden">
        <img
          src={captchaShowcaseBg.src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-neutral-950 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
              Stop bots without compromising privacy.
            </h1>

            <p className="text-xl text-neutral-300 mb-10 leading-relaxed max-w-xl">
              Adaptive proof-of-work, puzzle challenges, and behavioral
              analysis — all without tracking your users. Fully stateless,
              self-hosted, and GDPR compliant by design.
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
                <Lightning className="w-4 h-4 text-brand-orange" />
                Adaptive PoW
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <EyeSlash className="w-4 h-4 text-brand-orange" />
                No tracking
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                Stateless
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <Robot className="w-4 h-4 text-brand-orange" />
                5-signal risk scoring
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature blocks */}
      <section className="py-20 lg:py-32 bg-neutral-950 space-y-28">
        {/* Invisible PoW — text left, mockup right */}
        <div id="proof-of-work" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Invisible to humans. Expensive for bots.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Ciphera&apos;s proof-of-work runs silently in a Web Worker
                — users see nothing while their browser solves a SHA-256
                challenge in the background. Difficulty adapts per-IP based
                on request rate, scaling from easy to hard as suspicious
                activity increases.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Zero friction — runs invisibly in a background thread',
                  'Adaptive difficulty (4-6 leading zeros) based on request rate',
                  'Web Worker keeps the UI fully responsive',
                  'Graceful fallback to main thread on older browsers',
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
                    src={captchaShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <CaptchaMockup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Puzzle Challenge — mockup left, text right */}
        <div id="puzzle" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={captchaShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <PuzzleMockup />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                A puzzle only humans can solve.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                When stronger verification is needed, users drag a puzzle
                piece into position on an SVG background. It&apos;s spatial
                recognition — harder for computer vision than image labeling,
                and verified statelessly via HMAC-signed positions. No
                server-side session storage needed.
              </p>
              <ul className="space-y-3">
                {[
                  'SVG-native puzzles — crisp at any resolution',
                  'Spatial positioning resists ML/OCR attacks',
                  'Stateless verification via HMAC signatures',
                  '±5px tolerance for natural human imprecision',
                  'Audio fallback for full accessibility (WCAG 2.1 AAA)',
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

        {/* Risk Scoring — text left, mockup right */}
        <div id="risk-scoring" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Five signals. One confidence score.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Every verification produces a 0-100 risk score combining
                solve time, challenge difficulty, behavioral analysis, IP
                activity, and request patterns. Your backend decides the
                threshold — strict for payments, lenient for page views.
              </p>
              <ul className="space-y-3">
                {[
                  'Solve time analysis — instant solutions flag bots',
                  'Behavioral signals: mouse entropy, typing patterns, scroll events',
                  'IP activity tracking with automatic rate scaling',
                  'Success/failure ratio over time detects brute-force',
                  'Classify as low, medium, or high risk',
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
                    src={captchaShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <RiskScoreMockup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stateless Architecture — diagram left, text right */}
        <div id="stateless" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={captchaShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-6 w-full shadow-2xl space-y-4">
                      {/* Step 1 */}
                      <div className="rounded-lg border border-white/[0.08] bg-neutral-900 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <span className="text-xs font-medium text-white">Client requests challenge</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono">POST /challenge?type=pow</p>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <div className="h-px flex-1 bg-neutral-800" />
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700">
                          <svg className="w-3 h-3 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                          <span className="text-[10px] text-neutral-400">HMAC-signed challenge</span>
                        </div>
                        <div className="h-px flex-1 bg-neutral-800" />
                      </div>

                      {/* Step 2 */}
                      <div className="rounded-lg border border-white/[0.08] bg-neutral-900 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          <span className="text-xs font-medium text-white">Browser solves + submits</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono">POST /verify &#123; nonce, signature &#125;</p>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <div className="h-px flex-1 bg-neutral-800" />
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700">
                          <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          <span className="text-[10px] text-neutral-400">JWT token issued</span>
                        </div>
                        <div className="h-px flex-1 bg-neutral-800" />
                      </div>

                      {/* Step 3 */}
                      <div className="rounded-lg border border-white/[0.08] bg-neutral-900 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" /></svg>
                          <span className="text-xs font-medium text-white">Your backend validates</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono">POST /validate &#123; token, action, ip &#125;</p>
                      </div>

                      <div className="rounded-lg bg-neutral-800/50 border border-neutral-700/50 px-4 py-2.5 text-center">
                        <p className="text-[10px] text-neutral-500">No database. No sessions. Just HMAC signatures.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                No database. No sessions. No state.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Challenges are HMAC-signed instead of stored — the server
                verifies its own signature, not a database record. This
                means zero state to manage, horizontal scaling without
                session affinity, and no cleanup jobs. JWT tokens bind to
                IP, action scope, and unique ID for replay prevention.
              </p>
              <ul className="space-y-3">
                {[
                  'HMAC-signed challenges — no database lookups',
                  'Horizontal scaling with no session affinity',
                  'JWT tokens scoped to action (login vs upload)',
                  'IP-bound tokens prevent cross-origin reuse',
                  'Zero-downtime key rotation via comma-separated HMAC keys',
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
              How Ciphera Captcha compares.
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Most captcha services track your users and send telemetry to
              third parties. Ciphera Captcha is self-contained.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Captcha card — highlighted */}
            <div className="rounded-xl border border-brand-orange/20 bg-neutral-900/80 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-orange" />
              <div className="flex items-center gap-3 mb-8">
                <img
                  src={captchaIcon.src}
                  alt="Ciphera Captcha"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">Ciphera Captcha</h3>
                  <p className="text-xs text-brand-orange">Privacy-first bot protection</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  'Invisible adaptive proof-of-work',
                  'No user tracking or fingerprinting',
                  'Self-hosted — your infrastructure',
                  'Fully stateless (HMAC-signed)',
                  '5-signal behavioral risk scoring',
                  'Action-scoped JWT tokens',
                  'Zero-downtime key rotation',
                  'Audio + puzzle + PoW challenges',
                  'Swiss infrastructure',
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
                  <h3 className="text-xl font-bold text-white">Traditional Captchas</h3>
                  <p className="text-xs text-neutral-500">reCAPTCHA, hCaptcha, Turnstile</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  { feature: 'Visible challenges or limited PoW', has: false },
                  { feature: 'Sends telemetry to third parties', has: false },
                  { feature: 'SaaS-only — vendor infrastructure', has: false },
                  { feature: 'Session-based state', has: false },
                  { feature: 'Proprietary risk scoring', has: true },
                  { feature: 'Global tokens (no action scope)', has: false },
                  { feature: 'Manual key rotation', has: false },
                  { feature: 'Multiple challenge types', has: true },
                  { feature: 'US/EU infrastructure', has: false },
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
                      { icon: Globe, title: 'Data residency', desc: 'Switzerland (FADP protected)' },
                      { icon: Timer, title: 'Token lifetime', desc: '15 minutes, single-use' },
                      { icon: ShieldCheck, title: 'Privacy', desc: 'No tracking, IPs hashed with SHA-256' },
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
                Swiss infrastructure. Zero telemetry.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Ciphera Captcha runs entirely on Swiss infrastructure with
                no external dependencies. No telemetry sent to Google,
                Cloudflare, or any third party. Client IPs are SHA-256
                hashed before embedding in tokens — we verify without
                storing identities.
              </p>
              <ul className="space-y-3">
                {[
                  'Self-contained — no external API calls',
                  'IP addresses hashed, never stored in plaintext',
                  'Behavioral signals are optional and session-scoped',
                  'Tokens auto-expire with JTI replay prevention',
                  'Audio samples embedded in binary — no TTS API',
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
              src={captchaShowcaseBg.src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Interested in Ciphera Captcha?
              </h2>
              <p className="text-lg text-neutral-300 mb-10">
                Ciphera Captcha is currently an internal service protecting
                the Ciphera ecosystem. Reach out if you&apos;re interested
                in the technology for your platform.
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
