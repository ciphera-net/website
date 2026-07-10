import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CaptchaMockup } from '@/components/ui/captcha-mockup'
import { captchaIcon, captchaShowcaseBg, zurichPhoto } from '@/lib/images'
import { cdnUrl } from '@/lib/cdn'
import {
  ArrowRightIcon,
  CheckIcon,
  GlobeIcon,
  XIcon,
} from '@ciphera-net/facet'
import {
  ShieldCheck,
  Lightning,
  EyeSlash,
  Timer,
  Robot,
  Eye,
  PuzzlePiece,
} from '@phosphor-icons/react/dist/ssr'

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
        url: cdnUrl('/captcha_icon_no_margins.png'),
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
    images: [cdnUrl('/captcha_icon_no_margins.png')],
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

const CAPTCHA_FEATURES = [
  {
    icon: PuzzlePiece,
    title: 'Human challenge',
    body: 'When stronger proof is needed, a drag-to-fit SVG puzzle resists ML and OCR, verifies statelessly via HMAC-signed positions, and ships an audio fallback (WCAG 2.1 AAA).',
  },
  {
    icon: ShieldCheck,
    title: 'Risk scoring',
    body: 'Every check returns a 0–100 score from solve time, behavioral entropy, IP activity, and request patterns — your backend sets the threshold, strict or lenient.',
  },
] as const

export default function CipheraCaptchaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(captchaSchema) }}
      />

      {/* ─── Hero — A7 full-bleed ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src={captchaShowcaseBg}
          alt=""
          fill
          unoptimized
          priority
          sizes="100vw"
          className="object-cover grayscale brightness-[0.4]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45"
        />
        <div className="relative px-6 py-24 sm:py-32">
          <p className="font-mono text-xs text-muted-foreground">Ciphera Captcha</p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Stop bots without{' '}<br className="hidden sm:inline" />compromising privacy.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Adaptive proof-of-work, puzzle challenges, and behavioral
            analysis — all without tracking your users. Fully stateless,
            self-hosted, and GDPR compliant by design.
          </p>
          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center gap-y-3 font-mono text-xs text-muted-foreground">
            {[
              { icon: Lightning, label: 'Adaptive PoW' },
              { icon: EyeSlash, label: 'No tracking' },
              { icon: ShieldCheck, label: 'Stateless' },
              { icon: Robot, label: '5-signal risk scoring' },
            ].map((badge, i) => (
              <span key={badge.label} className="flex items-center gap-2 whitespace-nowrap">
                {i > 0 && <span className="mx-2 text-muted-foreground" aria-hidden="true">·</span>}
                <badge.icon aria-hidden="true" className="h-3.5 w-3.5" />
                {badge.label}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href="/contact" className="btn-primary">
              Contact Sales
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 01 · Bot defense — Invisible PoW ───────────────────────────── */}
      <section id="proof-of-work" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Copy cell */}
          <div className="min-w-0 flex flex-col justify-center px-6 py-16 sm:py-24 lg:pr-14">
            <p className="font-mono text-xs text-muted-foreground">01 · Bot defense</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Invisible to humans. Expensive for bots.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Ciphera&apos;s proof-of-work runs silently in a Web Worker
              — users see nothing while their browser solves a SHA-256
              challenge in the background. Difficulty adapts per-IP based
              on request rate, scaling from easy to hard as suspicious
              activity increases.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Zero friction — runs invisibly in a background thread',
                'Adaptive difficulty (4-6 leading zeros) based on request rate',
                'Web Worker keeps the UI fully responsive',
                'Graceful fallback to main thread on older browsers',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual cell — flat, fluid, no fixed width */}
          <div className="relative min-h-[400px] min-w-0 overflow-hidden border-t border-border lg:border-l lg:border-t-0 flex items-center justify-center px-6 py-12 bg-card">
            <div className="w-full max-w-md min-w-0">
              <CaptchaMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 02 · Features — everything in Ciphera Captcha ───────────── */}
      <section id="features" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="font-mono text-xs text-muted-foreground">02 · Features</p>
          <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Everything in Ciphera Captcha.
          </h2>
          <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2">
            {CAPTCHA_FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col bg-background p-8">
                <Icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 03 · Stateless — Stateless architecture ────────────────────── */}
      <section id="stateless" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Visual cell — left on desktop */}
          <div className="relative min-h-[400px] order-last border-t border-border lg:order-first lg:border-r lg:border-t-0 flex items-center justify-center px-6 py-12 bg-card">
            <div className="w-full max-w-md min-w-0">
              <div className="border border-border bg-background p-6 space-y-4">
                {/* Step 1 */}
                <div className="border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="text-xs font-medium text-foreground">Client requests challenge</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">POST /challenge?type=pow</p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <div className="flex items-center gap-1.5 border border-border bg-background px-3 py-1">
                    <svg className="w-3 h-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    <span className="text-[10px] text-muted-foreground">HMAC-signed challenge</span>
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Step 2 */}
                <div className="border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span className="text-xs font-medium text-foreground">Browser solves + submits</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">POST /verify &#123; nonce, signature &#125;</p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <div className="flex items-center gap-1.5 border border-border bg-background px-3 py-1">
                    <svg className="w-3 h-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-[10px] text-muted-foreground">JWT token issued</span>
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Step 3 */}
                <div className="border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" /></svg>
                    <span className="text-xs font-medium text-foreground">Your backend validates</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">POST /validate &#123; token, action, ip &#125;</p>
                </div>

                <div className="border border-border bg-card px-4 py-2.5 text-center">
                  <p className="text-[10px] text-muted-foreground">No database. No sessions. Just HMAC signatures.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy cell */}
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pl-14">
            <p className="font-mono text-xs text-muted-foreground">03 · Stateless</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              No database. No sessions. No state.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Challenges are HMAC-signed instead of stored — the server
              verifies its own signature, not a database record. This
              means zero state to manage, horizontal scaling without
              session affinity, and no cleanup jobs. JWT tokens bind to
              IP, action scope, and unique ID for replay prevention.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'HMAC-signed challenges — no database lookups',
                'Horizontal scaling with no session affinity',
                'JWT tokens scoped to action (login vs upload)',
                'IP-bound tokens prevent cross-origin reuse',
                'Zero-downtime key rotation via comma-separated HMAC keys',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── 04 · Data residency — photo left, copy right ─────────────────── */}
      <section id="privacy" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Photo cell */}
          <div className="relative min-h-[400px] border-b border-border lg:border-b-0 lg:border-r">
            <Image
              src={zurichPhoto}
              alt="Zurich, Switzerland — where Ciphera data is hosted"
              fill
              unoptimized
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover grayscale"
            />
            {/* Flat info items overlaid at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              {[
                { icon: GlobeIcon, title: 'Data residency', desc: 'Switzerland (FADP protected)' },
                { icon: Timer, title: 'Token lifetime', desc: '15 minutes, single-use' },
                { icon: ShieldCheck, title: 'Privacy', desc: 'No tracking, IPs hashed with SHA-256' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 border border-border bg-card px-4 py-3"
                >
                  <item.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.title}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Copy cell */}
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pl-14">
            <p className="font-mono text-xs text-muted-foreground">04 · Data residency</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Hosted in Switzerland. Zero telemetry.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Ciphera Captcha runs entirely on our own infrastructure,
              with no external dependencies. No telemetry sent to Google,
              Cloudflare, or any third party. Client IPs are SHA-256
              hashed before embedding in tokens — we verify without
              storing identities.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Self-contained — no external API calls',
                'IP addresses hashed, never stored in plaintext',
                'Behavioral signals are optional and session-scoped',
                'Tokens auto-expire with JTI replay prevention',
                'Audio samples embedded in binary — no TTS API',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── 05 · Compare ────────────────────────────────────────────────── */}
      <section id="comparison" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="font-mono text-xs text-muted-foreground">05 · Compare</p>
          <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            How Ciphera Captcha compares.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Most captcha services track your users and send telemetry to
            third parties. Ciphera Captcha is self-contained.
          </p>

          <div className="mt-14 grid gap-px bg-border md:grid-cols-2 max-w-4xl">
            {/* Ciphera Captcha card */}
            <div className="bg-background p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
                  <Image
                    src={captchaIcon}
                    alt="Ciphera Captcha"
                    width={24}
                    height={24}
                    unoptimized
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground">Ciphera Captcha</h3>
                  <p className="font-mono text-xs text-muted-foreground">Privacy-first bot protection</p>
                </div>
              </div>
              <ul className="space-y-1">
                {[
                  'Invisible adaptive proof-of-work',
                  'No user tracking or fingerprinting',
                  'Self-hosted — your infrastructure',
                  'Fully stateless (HMAC-signed)',
                  '5-signal behavioral risk scoring',
                  'Action-scoped JWT tokens',
                  'Zero-downtime key rotation',
                  'Audio + puzzle + PoW challenges',
                ].map((item) => (
                  <li key={item} className="-mx-4 px-4 py-2 flex items-center gap-3 text-foreground">
                    <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-foreground" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Traditional captchas card */}
            <div className="bg-background p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
                  <Eye aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground">Traditional Captchas</h3>
                  <p className="font-mono text-xs text-muted-foreground">reCAPTCHA, hCaptcha, Turnstile</p>
                </div>
              </div>
              <ul className="space-y-1">
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
                    className={`-mx-4 px-4 py-2 flex items-center gap-3 ${item.has ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {item.has ? (
                      <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <XIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="text-sm">{item.feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 06 · Get started — A7 full-bleed CTA ────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src={captchaShowcaseBg}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover grayscale brightness-[0.4]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45"
        />
        <div className="relative px-6 py-24 sm:py-32">
          <p className="font-mono text-xs text-muted-foreground">06 · Get started</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Interested in Ciphera Captcha?
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Ciphera Captcha is currently an internal service protecting
            the Ciphera ecosystem. Reach out if you&apos;re interested
            in the technology for your platform.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/contact" className="btn-primary">
              Contact Sales
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/about" className="btn-secondary">
              About Ciphera
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
