import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PulseMockup } from '@/components/ui/pulse-mockup'
import PulseFAQ from '@/components/PulseFAQ'
import { pulseShowcaseBg, pulseIcon, zurichPhoto } from '@/lib/images'
import { cdnUrl } from '@/lib/cdn'
import {
  Cookie,
  ShieldCheck,
  Code,
  Lightning,
  Globe,
  Timer,
  Funnel,
  EnvelopeSimple,
} from '@phosphor-icons/react/dist/ssr'
import {
  ArrowRightIcon,
  CheckIcon,
  XIcon,
} from '@ciphera-net/facet'

export const metadata: Metadata = {
  title: 'Pulse - Privacy-First Website Analytics',
  description:
    'Cookie-free website analytics with real-time dashboards and geographic insights. GDPR compliant by design. Under 2KB tracking script. Open source.',
  alternates: {
    canonical: 'https://ciphera.net/products/pulse',
  },
  openGraph: {
    title: 'Pulse - Privacy-First Website Analytics | Ciphera',
    description:
      'Cookie-free website analytics with real-time dashboards and geographic insights. GDPR compliant by design. Under 2KB tracking script.',
    url: 'https://ciphera.net/products/pulse',
    siteName: 'Ciphera',
    images: [
      {
        url: cdnUrl('/og-pulse.png'),
        width: 1200,
        height: 630,
        alt: 'Pulse - Privacy-First Website Analytics',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse - Privacy-First Website Analytics | Ciphera',
    description:
      'Cookie-free website analytics with real-time dashboards and geographic insights. GDPR compliant by design.',
    images: [cdnUrl('/og-pulse.png')],
  },
}

const pulseSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Pulse',
    description:
      'Privacy-respecting website analytics that gives you insights without compromising user privacy. GDPR compliant, no cookies, no tracking.',
    applicationCategory: 'AnalyticsApplication',
    operatingSystem: 'Web',
    url: 'https://pulse.ciphera.net',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@id': 'https://ciphera.net/#organization' },
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
        item: 'https://ciphera.net/#products',
      },
      { '@type': 'ListItem', position: 3, name: 'Pulse' },
    ],
  },
]

const PULSE_FEATURES = [
  {
    icon: Globe,
    title: 'Visitor insights',
    body: 'Top pages, referrer sources, browser breakdowns, geographic maps, and peak-hour traffic — the full picture, no personal data collected.',
  },
  {
    icon: Funnel,
    title: 'Conversion funnels',
    body: 'Multi-step funnels with drop-off analysis between each step, conversion trends over time, and breakdowns by device, country, or referrer.',
  },
  {
    icon: EnvelopeSimple,
    title: 'Scheduled reports',
    body: 'Daily, weekly, or monthly email summaries with period-over-period comparison — or webhook delivery for custom integrations.',
  },
  {
    icon: Code,
    title: 'Modular configuration',
    body: 'Toggle only the features you use — scroll depth, outbound links, downloads, 404s, rage-click tracking — with setup guides for 10+ frameworks.',
  },
] as const

export default function PulsePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pulseSchema) }}
      />

      {/* ─── Hero — A7 full-bleed ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src={pulseShowcaseBg}
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
          <p className="text-xs text-muted-foreground">Pulse</p>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Analytics without{' '}<br className="hidden sm:inline" />the surveillance.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Get the insights you need without compromising user privacy. No
            cookies, no fingerprinting, no personal data. GDPR compliant by
            design.
          </p>
          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center gap-y-3 text-xs text-muted-foreground">
            {[
              { icon: Cookie, label: 'Cookie-free' },
              { icon: Code, label: 'Open source client' },
              { icon: ShieldCheck, label: 'GDPR compliant' },
              { icon: Lightning, label: 'Under 2KB' },
            ].map((badge, i) => (
              <span key={badge.label} className="flex items-center gap-2 whitespace-nowrap">
                {i > 0 && <span className="mx-2 text-muted-foreground" aria-hidden="true">·</span>}
                <badge.icon aria-hidden="true" className="h-3.5 w-3.5" />
                {badge.label}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href="https://pulse.ciphera.net" className="btn-primary">
              Get Started Free
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="https://github.com/ciphera-net/pulse"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 01 · Dashboard — Your traffic at a glance ───────────────── */}
      <section id="dashboard" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Copy cell */}
          <div className="min-w-0 flex flex-col justify-center px-6 py-16 sm:py-24 lg:pr-14">
            <p className="text-xs text-muted-foreground">01 · Dashboard</p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Your traffic, at a glance.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Real-time dashboard with unique visitors, pageviews, bounce
              rate, and visit duration. Filter by date range, compare periods,
              and export your data — all without a single cookie.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Live visitor count with real-time updates',
                'Hourly, daily, and weekly trend charts',
                'Referrer sources and UTM tracking',
                'Country-level geographic breakdown',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="https://pulse.ciphera.net" className="btn-primary">
                Get Started Free
                <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Visual cell — right on desktop */}
          <div className="relative min-h-[400px] min-w-0 overflow-hidden border-t border-border lg:border-l lg:border-t-0 flex items-center justify-center px-6 py-12 bg-card mockup-cell">
            <div className="w-full max-w-md min-w-0">
              <PulseMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 02 · Features — everything in Pulse ─────────────────────── */}
      <section id="features" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">02 · Features</p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Everything in Pulse.
          </h2>
          <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2">
            {PULSE_FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col bg-background p-8">
                <Icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 03 · Script snippet ───────────────────────────────────────── */}
      {/* Lightweight script — copy right, code left */}
      <section id="script" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Visual cell — code block, left on desktop */}
          <div className="relative min-h-[400px] order-last border-t border-border lg:order-first lg:border-r lg:border-t-0 flex items-center justify-center px-6 py-12 bg-card">
            <div className="w-full max-w-md min-w-0">
              <div className="border border-border bg-background p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-muted-foreground/30" />
                  <div className="w-2 h-2 bg-muted-foreground/30" />
                  <div className="w-2 h-2 bg-muted-foreground/30" />
                  <span className="text-[10px] text-muted-foreground ml-2 font-mono">
                    index.html
                  </span>
                </div>
                <pre className="font-mono text-[11px] leading-relaxed overflow-x-auto">
                  <code>
                    <span className="text-muted-foreground">
                      {'<!-- Add before </head> -->'}
                    </span>
                    {'\n'}
                    <span className="text-muted-foreground">{'<'}</span>
                    <span className="text-foreground">{'script'}</span>
                    {'\n'}
                    <span className="text-foreground">{'  defer'}</span>
                    {'\n'}
                    <span className="text-foreground">{'  data-domain'}</span>
                    <span className="text-muted-foreground">{'="'}</span>
                    <span className="text-primary">{'yoursite.com'}</span>
                    <span className="text-muted-foreground">{'"'}</span>
                    {'\n'}
                    <span className="text-foreground">{'  src'}</span>
                    <span className="text-muted-foreground">{'="'}</span>
                    <span className="text-primary">
                      {'https://pulse.ciphera.net/js/script.js'}
                    </span>
                    <span className="text-muted-foreground">{'"'}</span>
                    {'\n'}
                    <span className="text-muted-foreground">{'>'}</span>
                    <span className="text-muted-foreground">{'</'}</span>
                    <span className="text-foreground">{'script'}</span>
                    <span className="text-muted-foreground">{'>'}</span>
                  </code>
                </pre>
                <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-3">
                  <span>1.6 KB gzipped</span>
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-primary" />
                    Non-blocking, async
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Copy cell */}
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pl-14">
            <p className="text-xs text-muted-foreground">03 · Script</p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              One script tag. That&apos;s it.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Add a single script tag to your site and you&apos;re done. Under
              2KB gzipped — that&apos;s 20x smaller than Google Analytics.
              Loads asynchronously, never blocks page rendering, works with
              any framework.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Works with React, Next.js, Vue, Svelte, WordPress, plain HTML',
                'No npm package required — just a script tag',
                'No consent banner needed — exempt from ePrivacy requirements',
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
              alt="Zurich, Switzerland — where Pulse analytics data is hosted"
              fill
              unoptimized
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover grayscale"
            />
            {/* Flat info items overlaid at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              {[
                { icon: Globe, title: 'Data residency', desc: 'Switzerland (FADP protected)' },
                { icon: Timer, title: 'IP retention', desc: '0 seconds — discarded at edge' },
                { icon: ShieldCheck, title: 'Compliance', desc: 'GDPR, FADP, ePrivacy exempt' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 border border-border bg-card px-4 py-3"
                >
                  <item.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.title}</p>
                    <p className="text-[11px] tabular-nums text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Copy cell */}
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pl-14">
            <p className="text-xs text-muted-foreground">04 · Data residency</p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Hosted in Switzerland. Discarded at the edge.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              All analytics data is processed and stored under the <Link href="/glossary/fadp" className="text-primary hover:underline">Federal Act on Data Protection (FADP)</Link>. IP addresses are used only for country-level
              geolocation at the edge and immediately discarded — never
              stored, never logged.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Data never leaves Swiss jurisdiction',
                'IP addresses discarded after geo lookup',
                'Aggregated metrics only — no individual records',
                'No cookies, no fingerprinting, no personal data',
                'No Data Processing Agreement required',
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
          <p className="text-xs text-muted-foreground">05 · Compare</p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            How Pulse compares.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Google Analytics is installed on over 28 million websites. Here&apos;s
            why Pulse is the better choice for privacy-conscious teams.
          </p>

          <dl className="mb-10 grid max-w-3xl gap-x-12 gap-y-6 sm:grid-cols-2">
            {[
              { term: 'Script size', detail: 'Pulse 1.6 KB gzipped · GA 45+ KB' },
              { term: 'Cookies', detail: 'Pulse none · GA required' },
            ].map((s) => (
              <div key={s.term} className="border-t border-border pt-3">
                <dt className="text-xs text-muted-foreground">{s.term}</dt>
                <dd className="mt-1.5 text-sm tabular-nums text-foreground">{s.detail}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 grid gap-px bg-border md:grid-cols-2 max-w-4xl">
            {/* Pulse card */}
            <div className="bg-background p-8 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
                  <Image
                    src={pulseIcon}
                    alt="Pulse"
                    width={24}
                    height={24}
                    unoptimized
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">Pulse</h3>
                  <p className="text-xs text-primary">Privacy-first analytics</p>
                </div>
              </div>
              <ul className="space-y-1">
                {[
                  'No cookies required',
                  'GDPR compliant by default',
                  'No consent banner needed',
                  'Open source client',
                  'Script under 2KB',
                  'No cross-site tracking',
                  'Free tier available',
                  'Real-time dashboard',
                ].map((item) => (
                  <li key={item} className="-mx-4 px-4 py-2 flex items-center gap-3 text-foreground">
                    <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-foreground" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Google Analytics card — muted */}
            <div className="bg-background p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
                  <img
                    src="https://cdn.ciphera.net/website/ga-favicon.png"
                    alt="Google Analytics"
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain grayscale"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">Google Analytics</h3>
                  <p className="text-xs text-muted-foreground">Traditional tracking</p>
                </div>
              </div>
              <ul className="space-y-1">
                {[
                  { feature: 'Requires cookies', has: false },
                  { feature: 'GDPR requires configuration', has: false },
                  { feature: 'Consent banner required', has: false },
                  { feature: 'Closed source', has: false },
                  { feature: 'Script over 45KB', has: false },
                  { feature: 'US infrastructure', has: false },
                  { feature: 'Cross-site tracking', has: false },
                  { feature: 'Free tier available', has: true },
                  { feature: 'Real-time dashboard', has: true },
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

      {/* FAQ */}
      <PulseFAQ />

      {/* ─── 07 · Get started — A7 full-bleed CTA ────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src={pulseShowcaseBg}
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
          <p className="text-xs text-muted-foreground">07 · Get started</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Start tracking with privacy.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Add one script tag and get privacy-first analytics in under 60
            seconds. Free forever for personal sites.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="https://pulse.ciphera.net" className="btn-primary">
              Get Started Free
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
