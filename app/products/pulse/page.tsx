import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PulseMockup } from '@/components/ui/pulse-mockup'
import { FunnelMockup } from '@/components/ui/funnel-mockup'
import { PulseFeaturesCarousel } from '@/components/ui/pulse-features-carousel'
import { EmailReportMockup } from '@/components/ui/email-report-mockup'
import { ModularScriptMockup } from '@/components/ui/modular-script-mockup'
import PulseFAQ from '@/components/PulseFAQ'
import { pulseShowcaseBg, pulseIcon, zurichPhoto } from '@/lib/images'
import {
  Cookie,
  ShieldCheck,
  Code,
  Lightning,
  Eye,
  EyeSlash,
  Globe,
  ChartLine,
  ArrowRight,
  Check,
  X,
  GithubLogo,
  Timer,
} from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Pulse - Privacy-First Website Analytics',
  description:
    'Cookie-free website analytics with real-time dashboards and geographic insights. GDPR compliant by design. Under 2KB tracking script. Open source.',
  alternates: {
    canonical: 'https://ciphera.net/products/pulse',
  },
  openGraph: {
    title: 'Pulse - Privacy-First Website Analytics',
    description:
      'Cookie-free website analytics with real-time dashboards and geographic insights. GDPR compliant by design. Under 2KB tracking script.',
    url: 'https://ciphera.net/products/pulse',
    siteName: 'Ciphera',
    images: [
      {
        url: '/pulse_icon_no_margins.png',
        width: 512,
        height: 512,
        alt: 'Pulse - Privacy-First Website Analytics',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse - Privacy-First Website Analytics',
    description:
      'Cookie-free website analytics with real-time dashboards and geographic insights. GDPR compliant by design.',
    images: ['/pulse_icon_no_margins.png'],
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
      { '@type': 'ListItem', position: 3, name: 'Pulse' },
    ],
  },
]

export default function PulsePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pulseSchema) }}
      />

      {/* Hero */}
      <section className="relative -mt-[88px] min-h-screen flex items-center pt-[88px] pb-20 lg:pb-32 bg-neutral-950 overflow-hidden">
        <img
          src={pulseShowcaseBg.src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-neutral-950 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
              Analytics without the surveillance.
            </h1>

            <p className="text-xl text-neutral-300 mb-10 leading-relaxed max-w-xl">
              Get the insights you need without compromising user privacy. No
              cookies, no fingerprinting, no personal data. GDPR compliant by
              design.
            </p>

            <div className="flex flex-row gap-3 flex-wrap mb-12">
              <Button
                size="lg"
                className="gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white"
                asChild
              >
                <a href="https://pulse.ciphera.net">
                  Try Pulse Free <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="gap-2 text-neutral-300 hover:text-white"
                asChild
              >
                <a
                  href="https://github.com/ciphera-net/pulse"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubLogo className="w-4 h-4" /> View on GitHub
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-400">
              <span className="flex items-center gap-2">
                <Cookie className="w-4 h-4 text-brand-orange" />
                Cookie-free
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4 text-brand-orange" />
                Open source client
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                GDPR compliant
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <Lightning className="w-4 h-4 text-brand-orange" />
                Under 2KB
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* Feature blocks — same spacing as landing page ProductShowcase */}
      <section className="py-20 lg:py-32 bg-neutral-950 space-y-28">
        {/* Dashboard showcase — text left, mockup right */}
        <div id="dashboard" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Your traffic, at a glance.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Real-time dashboard with unique visitors, pageviews, bounce
                rate, and visit duration. Filter by date range, compare periods,
                and export your data — all without a single cookie.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Live visitor count with real-time updates',
                  'Hourly, daily, and weekly trend charts',
                  'Referrer sources and UTM tracking',
                  'Country-level geographic breakdown',
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
              <Button
                size="lg"
                className="gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white"
                asChild
              >
                <a href="https://pulse.ciphera.net">
                  See it live <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={pulseShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <PulseMockup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Features carousel — mockup left, text right */}
        <div id="visitors" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={pulseShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative w-full">
                    <PulseFeaturesCarousel />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Everything you need to know about your visitors.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed">
                From top pages and referrer sources to browser breakdowns,
                geographic maps, and peak traffic hours — Pulse gives you the
                full picture without compromising privacy.
              </p>
            </div>
          </div>
        </div>
        {/* Conversion Funnels — text left, mockup right */}
        <div id="funnels" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                See where visitors drop off.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Build custom conversion funnels to understand how visitors move
                through your site. See exactly where they drop off and optimize
                each step of the journey — from landing page to signup.
              </p>
              <ul className="space-y-3">
                {[
                  'Multi-step funnels with conversion rates',
                  'Drop-off analysis between each step',
                  'Conversion trends over time',
                  'Breakdown by device, country, or referrer',
                  'Configurable conversion window (up to 90 days)',
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
                    src={pulseShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <FunnelMockup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Scheduled Reports — mockup left, text right */}
        <div id="reports" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={pulseShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <EmailReportMockup />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Reports delivered to your inbox.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Schedule automated reports and get your analytics summary
                delivered straight to your email or webhook. Stay informed
                without ever opening the dashboard.
              </p>
              <ul className="space-y-3">
                {[
                  'Daily, weekly, or monthly email summaries',
                  'Key metrics with period-over-period comparison',
                  'Top pages, referrers, and country breakdown',
                  'Webhook delivery for custom integrations',
                  'Multiple recipients per report',
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
        {/* Lightweight script — mockup left, text right */}
        <div id="script" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-6 w-full max-w-[480px] shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="text-[10px] text-neutral-500 ml-2 font-mono">
                    index.html
                  </span>
                </div>
                <pre className="font-mono text-[11px] leading-relaxed overflow-x-auto">
                  <code>
                    <span className="text-neutral-500">
                      {'<!-- Add before </head> -->'}
                    </span>
                    {'\n'}
                    <span className="text-neutral-500">{'<'}</span>
                    <span className="text-blue-400">{'script'}</span>
                    {'\n'}
                    <span className="text-purple-400">{'  defer'}</span>
                    {'\n'}
                    <span className="text-purple-400">{'  data-domain'}</span>
                    <span className="text-neutral-500">{'="'}</span>
                    <span className="text-amber-300">{'yoursite.com'}</span>
                    <span className="text-neutral-500">{'"'}</span>
                    {'\n'}
                    <span className="text-purple-400">{'  src'}</span>
                    <span className="text-neutral-500">{'="'}</span>
                    <span className="text-amber-300">
                      {'https://pulse.ciphera.net/js/script.js'}
                    </span>
                    <span className="text-neutral-500">{'"'}</span>
                    {'\n'}
                    <span className="text-neutral-500">{'>'}</span>
                    <span className="text-neutral-500">{'</'}</span>
                    <span className="text-blue-400">{'script'}</span>
                    <span className="text-neutral-500">{'>'}</span>
                  </code>
                </pre>
                <div className="mt-4 flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-800 pt-3">
                  <span>1.6 KB gzipped</span>
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Non-blocking, async
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                One script tag. That&apos;s it.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Add a single script tag to your site and you&apos;re done. Under
                2KB gzipped — that&apos;s 20x smaller than Google Analytics.
                Loads asynchronously, never blocks page rendering, works with
                any framework.
              </p>
              <ul className="space-y-3">
                {[
                  'Works with React, Next.js, Vue, Svelte, WordPress, plain HTML',
                  'No npm package required — just a script tag',
                  'No consent banner needed — exempt from ePrivacy requirements',
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

        {/* Modular script — text left, mockup right */}
        <div id="configuration" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Your script, your rules.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Enable only what you need. Scroll depth, outbound links, file
                downloads, 404 detection — each feature is a toggle. No bloat,
                no unnecessary tracking. Configure visitor recognition and
                privacy settings to match your requirements.
              </p>
              <ul className="space-y-3">
                {[
                  'Modular feature toggles — only load what you use',
                  'Frustration tracking for rage clicks and dead clicks',
                  'Configurable visitor identity and session duration',
                  'Framework-specific setup guides for 10+ platforms',
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
                    src={pulseShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative w-full">
                    <ModularScriptMockup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Comparison — side by side cards */}
      <section id="comparison" className="py-20 lg:py-32 bg-neutral-950 border-t border-white/[0.04] scroll-mt-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              How Pulse compares.
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Google Analytics is installed on over 28 million websites. Here&apos;s
              why Pulse is the better choice for privacy-conscious teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Pulse card — highlighted */}
            <div className="rounded-xl border border-brand-orange/20 bg-neutral-900/80 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-orange" />
              <div className="flex items-center gap-3 mb-8">
                <img
                  src={pulseIcon.src}
                  alt="Pulse"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">Pulse</h3>
                  <p className="text-xs text-brand-orange">Privacy-first analytics</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  'No cookies required',
                  'GDPR compliant by default',
                  'No consent banner needed',
                  'Open source client',
                  'Script under 2KB',
                  'Swiss infrastructure',
                  'No cross-site tracking',
                  'Free tier available',
                  'Real-time dashboard',
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

            {/* Google Analytics card — muted */}
            <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-8">
              <div className="flex items-center gap-3 mb-8">
                <img
                  src="https://www.google.com/s2/favicons?domain=analytics.google.com&sz=64"
                  alt="Google Analytics"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg bg-neutral-800 p-1.5"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">Google Analytics</h3>
                  <p className="text-xs text-neutral-500">Traditional tracking</p>
                </div>
              </div>
              <ul className="space-y-4">
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
                  {/* Info cards floating at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2.5">
                    {[
                      { icon: Globe, title: 'Data residency', desc: 'Switzerland (FADP protected)' },
                      { icon: Timer, title: 'IP retention', desc: '0 seconds — discarded at edge' },
                      { icon: ShieldCheck, title: 'Compliance', desc: 'GDPR, FADP, ePrivacy exempt' },
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
                All analytics data is processed and stored on Swiss
                infrastructure, protected by the Swiss Federal Act on Data
                Protection (FADP). IP addresses are used only for country-level
                geolocation at the edge and immediately discarded — never
                stored, never logged.
              </p>
              <ul className="space-y-3">
                {[
                  'Data never leaves Swiss jurisdiction',
                  'IP addresses discarded after geo lookup',
                  'Aggregated metrics only — no individual records',
                  'No cookies, no fingerprinting, no personal data',
                  'No Data Processing Agreement required',
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

      {/* FAQ */}
      <PulseFAQ />

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-neutral-950">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-neutral-900/80 px-6 py-20 sm:px-10 sm:py-24 max-w-6xl mx-auto">
            <img
              src={pulseShowcaseBg.src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Start tracking with privacy.
              </h2>
              <p className="text-lg text-neutral-300 mb-10">
                Add one script tag and get privacy-first analytics in under 60
                seconds. Free forever for personal sites.
              </p>
              <div className="flex flex-row gap-3 justify-center flex-wrap">
                <Button
                  size="lg"
                  className="gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white"
                  asChild
                >
                  <a href="https://pulse.ciphera.net">
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="gap-2 text-neutral-300 hover:text-white border border-white/10"
                  asChild
                >
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
