import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRightIcon,
  CheckIcon,
  GlobeIcon,
  LockIcon,
  EyeOffIcon,
  LayoutDashboardIcon,
} from '@ciphera-net/facet'
import Breadcrumbs from '../../components/Breadcrumbs'
import {
  zurichPhoto,
  swissAlpsFlagPhoto,
  officeHq,
  pulseIcon,
  authIcon,
  captchaIcon,
  relayIcon,
} from '@/lib/images'
import { cdnUrl } from '@/lib/cdn'

const stats = [
  { value: '2024', label: 'Founded' },
  { value: '4', label: 'Services shipped' },
  { value: 'AGPL-3.0', label: 'Open source' },
] as const

const values = [
  {
    icon: LockIcon,
    title: 'Privacy by design',
    description:
      'Every component is built with privacy as the foundation — end-to-end encryption, zero-knowledge architecture, and minimal data collection.',
  },
  {
    icon: EyeOffIcon,
    title: 'Zero-knowledge',
    description:
      'Your password never reaches our servers, and your vault is encrypted on your own device. We verify who you are without ever seeing your secrets.',
  },
  {
    icon: LayoutDashboardIcon,
    title: 'Transparency',
    description:
      'Our code is open for anyone to inspect — and we’re opening more of it. We publish a warrant canary and a transparency report. Trust is earned, not marketed.',
    href: '/transparency',
    linkLabel: 'Read the transparency report',
  },
  {
    icon: GlobeIcon,
    title: 'User control',
    description:
      'You own your encryption keys and can delete your data at any time. We can’t decrypt your vault — not even under a court order.',
  },
] as const

const techStack = [
  { name: 'Go (Gin)', description: 'High-performance backend services' },
  { name: 'Next.js', description: 'Modern React framework for frontends' },
  { name: 'PostgreSQL', description: 'Reliable database for metadata' },
  { name: 'SRP-6a', description: 'Zero-knowledge password authentication' },
  { name: 'PBKDF2-SHA256', description: 'Client-side key derivation (1M iterations)' },
  { name: 'AES-256-GCM', description: 'Client-side vault encryption' },
] as const

const architecture = [
  { image: authIcon, name: 'Ciphera ID', detail: 'Identity & authentication' },
  { image: pulseIcon, name: 'Pulse', detail: 'Privacy-first analytics' },
  { image: captchaIcon, name: 'Ciphera Captcha', detail: 'Bot protection' },
  { image: relayIcon, name: 'Ciphera Relay', detail: 'Transactional email' },
] as const

const timeline = [
  { year: '2024', event: 'Ciphera founded to build privacy-first infrastructure from the ground up.' },
  { year: '2025', event: 'Pulse, Ciphera ID, Captcha, and Relay shipped.' },
  {
    year: '2026',
    event: 'Moved Ciphera ID to zero-knowledge authentication and published our first transparency report.',
  },
] as const

// * JSON-LD structured data for organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://ciphera.net/#organization',
  name: 'Ciphera',
  url: 'https://ciphera.net',
  logo: {
    '@type': 'ImageObject',
    url: cdnUrl('/ciphera_logo_no_margins.png'),
  },
  description: 'Privacy-first infrastructure and applications built on zero-knowledge principles',
  foundingDate: '2024-01-01',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'De Kleetlaan 2',
    addressLocality: 'Diegem',
    postalCode: '1831',
    addressCountry: 'BE',
  },
  telephone: '+3278480710',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@ciphera.net',
    contactType: 'customer service',
  },
  sameAs: ['https://github.com/ciphera-net', 'https://x.com/CipheraNET'],
}

export default function AboutPage() {
  return (
    <>
      {/* * JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      {/* Hero — editorial split: headline + tall Zurich photo */}
      <section className="border-b border-border">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pr-14">
            <p className="font-mono text-xs text-muted-foreground">About Ciphera</p>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Building the future of privacy.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Ciphera is dedicated to creating privacy-first infrastructure and applications that put
              users in control of their data. We believe encryption should be the default, not an
              add-on.
            </p>
          </div>
          <div className="relative min-h-[440px] border-t border-border lg:border-l lg:border-t-0">
            <Image
              src={zurichPhoto}
              alt="Zurich, Switzerland — where Ciphera data is hosted"
              fill
              unoptimized
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover grayscale"
            />
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <section className="border-b border-border">
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-background px-6 py-8">
              <div className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 font-mono text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission — split: monochrome photo + dark text panel (mirrors hero) */}
      <section className="border-b border-border">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[360px] border-b border-border lg:border-b-0 lg:border-r">
            <Image
              src={swissAlpsFlagPhoto}
              alt="The Swiss Alps — Ciphera hosts its data in Switzerland"
              fill
              unoptimized
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover grayscale"
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pl-14">
            <p className="font-mono text-xs text-muted-foreground">01 · Mission</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Encryption that works invisibly
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We build tools that protect your data automatically — no configuration, no trade-offs.
              Your files are encrypted client-side, so we never see them. When data is encrypted before
              it leaves your device, there’s nothing to track, profile, or compromise. That’s not a
              feature — it’s the foundation.
            </p>
            <p className="mt-6 font-mono text-xs text-muted-foreground">
              Data residency: Switzerland.{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                See our privacy policy →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Values — editorial list */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="font-mono text-xs text-muted-foreground">02 · Values</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What we stand for
          </h2>
          <div className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-2">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <div key={v.title} className="border-t border-border pt-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                    <Icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {v.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{v.description}</p>
                  {'href' in v && (
                    <Link
                      href={v.href}
                      className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                    >
                      {v.linkLabel}
                      <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology — airy two-column */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="font-mono text-xs text-muted-foreground">03 · Technology</p>
          <div className="mt-8 grid gap-14 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built with modern, secure technologies
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                We use battle-tested technologies chosen for their security, performance, and
                reliability. Every component is carefully selected to keep your data protected.
              </p>
              <Link
                href="https://github.com/ciphera-net"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
              >
                See our open-source code on GitHub
                <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
                {techStack.map((tech) => (
                  <div key={tech.name} className="flex items-start gap-3 border-t border-border pt-4">
                    <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{tech.name}</div>
                      <div className="text-xs text-muted-foreground">{tech.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pl-14">
              <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                Architecture overview
              </h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Ciphera follows a microservices architecture with strict separation of concerns. Each
                service is isolated to maintain security boundaries.
              </p>
              <div className="mt-8">
                {architecture.map((svc) => (
                  <div
                    key={svc.name}
                    className="flex items-center gap-4 border-t border-border py-4 last:border-b"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
                      <Image
                        src={svc.image}
                        alt=""
                        width={24}
                        height={24}
                        loading="lazy"
                        unoptimized
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{svc.name}</div>
                      <div className="text-xs text-muted-foreground">{svc.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey — big editorial years */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="font-mono text-xs text-muted-foreground">04 · Journey</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Building privacy, one step at a time
          </h2>
          <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-3">
            {timeline.map((item) => (
              <div key={item.year} className="border-t border-border pt-6">
                <div className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                  {item.year}
                </div>
                <p className="mt-5 leading-relaxed text-muted-foreground">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — full-bleed dark monochrome close, gradient to solid bg for legibility */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src={officeHq}
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
          <p className="font-mono text-xs text-muted-foreground">05 · Get started</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            One account. Every product.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            One Ciphera ID works across every product we build — a single, zero-knowledge account
            whose password never reaches our servers. Create yours in seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="https://id.ciphera.net/signup" className="btn-primary">
              Create your Ciphera ID
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/#products" className="btn-secondary">
              Explore products
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
