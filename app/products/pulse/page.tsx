import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PulseMockup } from '@/components/ui/pulse-mockup'
import { FunnelMockup } from '@/components/ui/funnel-mockup'
import { PulseFeaturesCarousel } from '@/components/ui/pulse-features-carousel'
import { EmailReportMockup } from '@/components/ui/email-report-mockup'
import PulseFAQ from '@/components/PulseFAQ'
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
          src="/pulse-showcase-bg.png"
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


      {/* Dashboard showcase — text left, mockup right */}
      <section className="py-20 lg:py-32 bg-neutral-950">
        <div className="container mx-auto px-6">
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
                    src="/pulse-showcase-bg.png"
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
      </section>

      {/* Features carousel — mockup left, text right */}
      <section className="py-20 lg:py-32 bg-neutral-950">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src="/pulse-showcase-bg.png"
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
      </section>

      {/* Conversion Funnels — text left, mockup right */}
      <section className="py-20 lg:py-32 bg-neutral-950">
        <div className="container mx-auto px-6">
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
                    src="/pulse-showcase-bg.png"
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
      </section>

      {/* Scheduled Reports — mockup left, text right */}
      <section className="py-20 lg:py-32 bg-neutral-950">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src="/pulse-showcase-bg.png"
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
      </section>

      {/* What we track vs. what we don't */}
      <section className="py-20 lg:py-32 bg-neutral-950 border-t border-white/[0.04]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Privacy by architecture.
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Pulse is GDPR compliant not because of configuration toggles, but
              because it&apos;s architecturally impossible for us to collect personal
              data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* What we track */}
            <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold text-white">What we track</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Page views and unique visitors',
                  'Referrer sources and UTM parameters',
                  'Device type, browser, and OS',
                  'Country-level geolocation',
                  'Bounce rate and visit duration',
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

            {/* What we don't */}
            <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                  <EyeSlash className="w-5 h-5 text-neutral-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  What we don&apos;t
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  'No personal identification data',
                  'No cross-site tracking',
                  'No fingerprinting techniques',
                  'No cookies — first or third-party',
                  'No data sold to third parties',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-neutral-500"
                  >
                    <X className="w-5 h-5 text-neutral-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features — alternating blocks */}
      <section className="py-20 lg:py-32 bg-neutral-950 space-y-28">
        {/* Lightweight script — mockup left, text right */}
        <div className="container mx-auto px-6">
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

        {/* Swiss infrastructure — text left, visual right */}
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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

            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-8 w-full max-w-[480px] shadow-2xl">
                <div className="space-y-5">
                  {[
                    {
                      icon: Globe,
                      title: 'Data residency',
                      desc: 'Switzerland (FADP protected)',
                    },
                    {
                      icon: Timer,
                      title: 'IP retention',
                      desc: '0 seconds — discarded at edge',
                    },
                    {
                      icon: ShieldCheck,
                      title: 'Compliance',
                      desc: 'GDPR, FADP, ePrivacy exempt',
                    },
                    {
                      icon: ChartLine,
                      title: 'Data model',
                      desc: 'Aggregated metrics, no user records',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.title}
                        </p>
                        <p className="text-sm text-neutral-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 lg:py-32 bg-neutral-950 border-t border-white/[0.04]">
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

          <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-8 max-w-3xl mx-auto shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="text-left py-4 pr-4 font-bold text-white">
                      Feature
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-brand-orange">
                      Pulse
                    </th>
                    <th className="text-center py-4 pl-4 font-bold text-neutral-500">
                      Google Analytics
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['No cookies required', true, false],
                    ['GDPR compliant by default', true, false],
                    ['No consent banner needed', true, false],
                    ['Open source client', true, false],
                    ['Script under 5KB', true, false],
                    ['Swiss infrastructure', true, false],
                    ['No cross-site tracking', true, false],
                    ['Free tier', true, true],
                    ['Real-time dashboard', true, true],
                  ].map(([feature, pulse, ga], index) => (
                    <tr key={index} className="border-b border-neutral-800/50">
                      <td className="py-4 pr-4 text-neutral-400 text-sm">
                        {feature as string}
                      </td>
                      <td className="text-center py-4 px-4">
                        {pulse ? (
                          <Check className="w-5 h-5 text-brand-orange mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-neutral-600 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-4 pl-4">
                        {ga ? (
                          <Check className="w-5 h-5 text-neutral-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-neutral-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              src="/pulse-showcase-bg.png"
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
