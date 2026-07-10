import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { RelayMockup } from '@/components/ui/relay-mockup'
import { relayIcon, genA10, zurichPhoto } from '@/lib/images'
import { cdnUrl } from '@/lib/cdn'
import {
  ArrowRightIcon,
  CheckIcon,
  GlobeIcon,
  XIcon,
} from '@ciphera-net/facet'
import {
  ShieldCheck,
  Lock,
  EyeSlash,
  Eye,
  Timer,
  EnvelopeSimple,
} from '@phosphor-icons/react/dist/ssr'

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
      'Privacy-first transactional email delivery with TLS 1.3, DKIM, SPF, and DMARC. No tracking pixels, no open tracking.',
    url: 'https://ciphera.net/products/relay',
    siteName: 'Ciphera',
    images: [
      {
        url: cdnUrl('/relay_icon_no_margins.png'),
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
      'Privacy-first transactional email with TLS 1.3, DKIM/SPF/DMARC. No tracking, 99.8% deliverability.',
    images: [cdnUrl('/relay_icon_no_margins.png')],
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

const RELAY_FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Email authentication',
    body: 'Per-domain DKIM keys, strict SPF, and a DMARC reject policy over TLS 1.3 — 99.8% inbox deliverability and zero spoofing, with reverse-DNS configured for HELO compliance.',
  },
  {
    icon: EyeSlash,
    title: 'No tracking',
    body: 'No tracking pixels, no open or click monitoring, no recipient IP profiling, no third-party analytics — delivery metadata is retained 30 days, then permanently deleted.',
  },
] as const

export default function CipheraRelayPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(relaySchema) }}
      />

      {/* ─── Hero — A7 full-bleed ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={genA10}
          alt=""
          className="absolute inset-0 h-full w-full object-cover grayscale brightness-[0.4]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45"
        />
        <div className="relative px-6 py-24 sm:py-32">
          <p className="font-mono text-xs text-muted-foreground">Ciphera Relay</p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Transactional email that respects privacy.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The email backbone behind every Ciphera service. TLS 1.3
            encryption, DKIM signing, and zero tracking — verification
            codes, security alerts, and notifications delivered in under
            2 seconds.
          </p>
          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <Lock aria-hidden="true" className="h-3.5 w-3.5" />
              TLS 1.3
            </span>
            <span aria-hidden="true" className="text-border">|</span>
            <span className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
              DKIM / SPF / DMARC
            </span>
            <span aria-hidden="true" className="text-border">|</span>
            <span className="flex items-center gap-2">
              <EyeSlash aria-hidden="true" className="h-3.5 w-3.5" />
              No tracking
            </span>
            <span aria-hidden="true" className="text-border">|</span>
            <span className="flex items-center gap-2">
              <EnvelopeSimple aria-hidden="true" className="h-3.5 w-3.5" />
              99.8% deliverability
            </span>
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
          <dl className="mt-10 grid max-w-md grid-cols-2 gap-x-12">
            {[
              { term: 'Deliverability', detail: '99.8%' },
              { term: 'Send latency', detail: '< 2 s' },
            ].map((s) => (
              <div key={s.term} className="border-t border-border pt-3">
                <dt className="font-mono text-xs text-muted-foreground">{s.term}</dt>
                <dd className="mt-1.5 font-display text-3xl font-bold tabular-nums text-foreground">{s.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── 01 · Email — Security-critical emails ───────────────────── */}
      <section id="alerts" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Copy cell */}
          <div className="min-w-0 flex flex-col justify-center px-6 py-16 sm:py-24 lg:pr-14">
            <p className="font-mono text-xs text-muted-foreground">01 · Email</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Security-critical emails, delivered fast.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              When someone tries to break into an account or a password
              needs resetting, speed matters. Relay delivers verification
              codes, security alerts, and lockout notifications in under
              2 seconds — with TLS encryption from server to inbox.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Verification emails and password resets',
                'Suspicious login alerts and account lockout notices',
                'Billing alerts and uptime reports (Pulse)',
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
              <RelayMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 02 · Features — everything in Ciphera Relay ─────────────── */}
      <section id="features" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="font-mono text-xs text-muted-foreground">02 · Features</p>
          <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Everything in Ciphera Relay.
          </h2>
          <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2">
            {RELAY_FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col bg-background p-8">
                <Icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 03 · SMTP — Standard SMTP integration ───────────────────── */}
      <section id="integration" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Visual cell — left on desktop */}
          <div className="relative min-h-[400px] order-last border-t border-border lg:order-first lg:border-r lg:border-t-0 flex items-center justify-center px-6 py-12 bg-card">
            <div className="w-full max-w-md min-w-0">
              {/* SMTP config mockup — flat, sharp */}
              <div className="border border-border bg-background p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-muted-foreground/30" />
                  <div className="w-2 h-2 bg-muted-foreground/30" />
                  <div className="w-2 h-2 bg-muted-foreground/30" />
                  <span className="font-mono text-[10px] text-muted-foreground ml-2">.env</span>
                </div>
                <pre className="font-mono text-[11px] leading-relaxed">
                  <code>
                    <span className="text-muted-foreground"># SMTP configuration</span>{'\n'}
                    <span className="text-foreground">SMTP_HOST</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-primary">relay.ciphera.net</span>{'\n'}
                    <span className="text-foreground">SMTP_PORT</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-primary">587</span>{'\n'}
                    <span className="text-foreground">SMTP_USER</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-primary">authnoreply</span>{'\n'}
                    <span className="text-foreground">SMTP_FROM</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-primary">noreply@id.ciphera.net</span>{'\n'}
                    {'\n'}
                    <span className="text-muted-foreground"># Per-service sender domains</span>{'\n'}
                    <span className="text-muted-foreground/60"># Auth  → noreply@id.ciphera.net</span>{'\n'}
                    <span className="text-muted-foreground/60"># Pulse → noreply@pulse.ciphera.net</span>
                  </code>
                </pre>
                <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground border-t border-border pt-3">
                  <span>Standard SMTP AUTH — works with any language</span>
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-primary" />
                    STARTTLS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Copy cell */}
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pl-14">
            <p className="font-mono text-xs text-muted-foreground">03 · SMTP</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Standard SMTP. Any language.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              No SDK, no proprietary API. Relay uses standard SMTP AUTH
              over port 587 with STARTTLS — it works with any language,
              framework, or email library. Each Ciphera service gets its
              own sender domain and DKIM key for clean provenance.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'SMTP AUTH on port 587 (STARTTLS) or 465 (implicit TLS)',
                'Per-service sender domains for email provenance',
                'Works with Go, Node.js, Python, PHP — any SMTP client',
                'Sub-2-second delivery for transactional emails',
                'No proprietary SDK or API lock-in',
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

      {/* ─── 04 · Data residency — photo left, copy right ─────────────── */}
      <section id="privacy" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Photo cell */}
          <div className="relative min-h-[400px] border-b border-border lg:border-b-0 lg:border-r">
            <Image
              src={zurichPhoto}
              alt="Zurich, Switzerland — where Ciphera email is hosted"
              fill
              unoptimized
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover grayscale"
            />
            {/* Flat info items overlaid at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              {[
                { icon: GlobeIcon, title: 'Data residency', desc: 'Exoscale, Switzerland (CH-DK-2)' },
                { icon: Timer, title: 'Data retention', desc: '30 days, then deleted' },
                { icon: ShieldCheck, title: 'Compliance', desc: 'GDPR, FADP, no tracking' },
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
              Hosted in Switzerland. Deleted in 30 days.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Relay runs on Exoscale (CH-DK-2), under the Federal Act on
              Data Protection (FADP). Email metadata
              is retained for 30 days under contract performance basis,
              then permanently deleted. No marketing emails, no behavioral
              data, no profiling.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Hosted on Exoscale, Zurich (CH-DK-2)',
                'Stalwart Mail Server — open-source foundation',
                'Admin UI bound to localhost only (SSH tunnel access)',
                "Let's Encrypt TLS certificates with auto-renewal",
                'Transactional only — marketing emails are never sent',
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

      {/* ─── 05 · Compare ────────────────────────────────────────────── */}
      <section id="comparison" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="font-mono text-xs text-muted-foreground">05 · Compare</p>
          <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            How Ciphera Relay compares.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Most email services track opens, clicks, and recipient behavior.
            Relay just delivers the email.
          </p>

          <div className="mt-14 grid gap-px bg-border md:grid-cols-2 max-w-4xl">
            {/* Relay card */}
            <div className="bg-background p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
                  <img
                    src={relayIcon}
                    alt="Ciphera Relay"
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground">Ciphera Relay</h3>
                  <p className="font-mono text-xs text-primary">Privacy-first email</p>
                </div>
              </div>
              <ul className="space-y-1">
                {[
                  'No tracking pixels or open tracking',
                  'TLS 1.3 encryption',
                  'Per-domain DKIM signing',
                  'DMARC reject policy',
                  'Self-hosted — no third-party processors',
                  'Standard SMTP — no vendor lock-in',
                  '30-day metadata retention only',
                  'Transactional only — no marketing',
                  'Sub-2-second delivery',
                ].map((item) => (
                  <li key={item} className="group -mx-4 px-4 py-2 transition-colors hover:bg-card flex items-center gap-3 text-foreground">
                    <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-foreground" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Others card */}
            <div className="bg-background p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
                  <Eye aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground">Traditional Services</h3>
                  <p className="font-mono text-xs text-muted-foreground">SendGrid, Postmark, SES</p>
                </div>
              </div>
              <ul className="space-y-1">
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
                    className={`group -mx-4 px-4 py-2 transition-colors hover:bg-card flex items-center gap-3 ${item.has ? 'text-foreground' : 'text-muted-foreground'}`}
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

      {/* ─── 06 · Get started — A7 full-bleed CTA ────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={genA10}
          alt=""
          className="absolute inset-0 h-full w-full object-cover grayscale brightness-[0.4]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45"
        />
        <div className="relative px-6 py-24 sm:py-32">
          <p className="font-mono text-xs text-muted-foreground">06 · Get started</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Interested in Ciphera Relay?
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Ciphera Relay is currently an internal service powering email
            delivery across the Ciphera ecosystem. Reach out if you&apos;re
            interested in the technology for your platform.
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
