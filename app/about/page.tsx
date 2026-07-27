import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRightIcon,
  CheckIcon,
  GithubIcon,
  LockIcon,
} from '@ciphera-net/facet'
import { Fingerprint, Key } from '@phosphor-icons/react/dist/ssr'
import Breadcrumbs from '../../components/Breadcrumbs'
import ValuesScroll from '@/components/ValuesScroll'
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
  { value: 'AGPL-3.0 / Apache-2.0', label: 'Open source' },
] as const

// * Brand marks (Go/Next.js/PostgreSQL) are monochrome Simple Icons on the CDN;
// * the three crypto primitives have no logo, so they take a line icon rather
// * than a faked mark.
const techStack = [
  { name: 'Go (Gin)', description: 'High-performance backend services', logo: cdnUrl('/icons/tech/go.svg') },
  { name: 'Next.js', description: 'Modern React framework for frontends', logo: cdnUrl('/icons/tech/nextdotjs.svg') },
  { name: 'PostgreSQL', description: 'Reliable database for metadata', logo: cdnUrl('/icons/tech/postgresql.svg') },
  { name: 'OPAQUE (RFC 9807)', description: 'Zero-knowledge password authentication', icon: Fingerprint },
  { name: 'PBKDF2-SHA256', description: 'Client-side key derivation (1M iterations)', icon: Key },
  { name: 'AES-256-GCM', description: 'Client-side vault encryption', icon: LockIcon },
]

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

// * Company facts — the registered legal entity, so an owned page answers the
// * exact-name query "Ciphera BV". Every value is verifiable in the Belgian
// * enterprise register (KBO/BCE), linked below.
const companyFacts: { term: string; detail: string }[] = [
  { term: 'Legal name', detail: 'Ciphera BV' },
  { term: 'Enterprise number (KBO/BCE)', detail: '1013.721.660' },
  { term: 'VAT number', detail: 'BE1013721660' },
  { term: 'Founded', detail: '18 September 2024' },
  { term: 'Headquarters', detail: 'De Kleetlaan 2, 1831 Diegem, Belgium' },
]

const KBO_URL =
  'https://kbopub.economie.fgov.be/kbopub/toonondernemingps.html?ondernemingsnummer=1013721660&lang=en'

// * JSON-LD structured data for organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://ciphera.net/#organization',
  name: 'Ciphera',
  alternateName: ['Ciphera BV'],
  legalName: 'Ciphera BV',
  vatID: 'BE1013721660',
  // * See app/page.tsx for why iso6523Code/naics are here: Google uses both to
  // * disambiguate one organization from another, and "Ciphera" collides with
  // * several unrelated entities. ICD 0208 = Belgian KBO/BCE.
  iso6523Code: '0208:1013721660',
  naics: '541511',
  url: 'https://ciphera.net',
  logo: {
    '@type': 'ImageObject',
    url: cdnUrl('/ciphera_logo_no_margins.png'),
  },
  description: 'Privacy-first infrastructure and applications built on zero-knowledge principles',
  disambiguatingDescription:
    'Ciphera (Ciphera BV) is a Belgian privacy-infrastructure company behind Pulse cookieless analytics, Ciphera ID, Ciphera Captcha, Ciphera Relay, and the open-source Tessera authentication library. Not affiliated with other companies, apps, or fictional characters sharing the Ciphera name.',
  foundingDate: '2024-09-18',
  foundingLocation: {
    '@type': 'Place',
    address: { '@type': 'PostalAddress', addressCountry: 'BE' },
  },
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
  // * Kept identical to the homepage node — a split sameAs set across two
  // * Organization nodes with the same @id is a contradiction, not extra
  // * coverage. Every URL verified 200; crates.io/npm omitted (bot-blocked,
  // * unconfirmed).
  sameAs: [
    'https://github.com/ciphera-net',
    'https://x.com/CipheraNET',
    'https://www.linkedin.com/company/ciphera/',
    'https://profiles.wordpress.org/ciphera/',
    'https://pkg.go.dev/github.com/ciphera-net/tessera-go',
  ],
}

// * Founder — public name "Usman Baig" (owner's choice); the KBO/BCE register
// * (1013.721.660) lists the director under his full registered name, appointed
// * on the 2024-09-18 founding date. worksFor references the Organization by
// * @id; sameAs points to the company profiles (no personal profiles are used).
const FOUNDER_NAME = 'Usman Baig'

const founderSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: FOUNDER_NAME,
  jobTitle: 'Founder',
  worksFor: { '@id': 'https://ciphera.net/#organization' },
  sameAs: [
    'https://www.linkedin.com/in/usman-baig-79b843238/',
    'https://github.com/uz1mani',
  ],
}

export default function AboutPage() {
  return (
    <>
      {/* * JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }}
      />
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      {/* Hero — editorial split: headline + tall Zurich photo */}
      <section className="border-b border-border">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pr-14">
            <p className="text-xs text-muted-foreground">About Ciphera</p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Building the future of privacy.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Ciphera is dedicated to creating privacy-first infrastructure and applications that put
              users in control of their data. We believe encryption should be the default, not an
              add-on.
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              New here?{' '}
              <Link href="/what-is-ciphera" className="text-primary hover:underline">
                Start with What is Ciphera →
              </Link>
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
              <div className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Company facts — the registered legal entity, so this owned page ranks
          for the exact-name query "Ciphera BV" */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="text-xs text-muted-foreground">Company facts</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Ciphera BV, on the record
          </h2>
          <dl className="mt-8 grid max-w-4xl gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {companyFacts.map((f) => (
              <div key={f.term} className="border-t border-border pt-3">
                <dt className="text-xs text-muted-foreground">{f.term}</dt>
                <dd className="mt-1.5 text-sm text-foreground">{f.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-2xl text-xs text-muted-foreground">
            <a
              href={KBO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Look us up in the Belgian enterprise register →
            </a>
          </p>
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
            <p className="text-xs text-muted-foreground">01 · Mission</p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Encryption that works invisibly
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We build tools that protect your data automatically — no configuration, no trade-offs.
              Your files are encrypted client-side, so we never see them. When data is encrypted before
              it leaves your device, there’s nothing to track, profile, or compromise. That’s not a
              feature — it’s the foundation.
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              Data residency: Switzerland.{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                See our privacy policy →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Values — scroll-driven reveal (see components/ValuesScroll) */}
      <ValuesScroll />

      {/* Technology — airy two-column */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">03 · Technology</p>
          <div className="mt-8 grid gap-14 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
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
                className="mt-6 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                See our open-source code on GitHub
                <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
                {techStack.map((tech) => {
                  const Icon = tech.icon
                  return (
                    <div key={tech.name} className="flex items-start gap-3 border-t border-border pt-4">
                      {tech.logo ? (
                        <Image
                          src={tech.logo}
                          alt=""
                          width={18}
                          height={18}
                          unoptimized
                          aria-hidden="true"
                          className="mt-0.5 h-[18px] w-[18px] shrink-0 object-contain"
                        />
                      ) : Icon ? (
                        <Icon aria-hidden="true" className="mt-0.5 h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                      ) : null}
                      <div>
                        <div className="text-sm font-semibold text-foreground">{tech.name}</div>
                        <div className="text-xs text-muted-foreground">{tech.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="lg:pl-14">
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
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
          <p className="text-xs text-muted-foreground">04 · Journey</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Building privacy, one step at a time
          </h2>
          <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-3">
            {timeline.map((item) => (
              <div key={item.year} className="border-t border-border pt-6">
                <div className="font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  {item.year}
                </div>
                <p className="mt-5 leading-relaxed text-muted-foreground">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team — founder. Personal details; this section is held for owner
          review before merge. Name is taken exactly from the KBO/BCE register. */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">Team</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Who&rsquo;s behind Ciphera
          </h2>
          <div className="mt-12 overflow-hidden border border-border">
            <div className="grid sm:grid-cols-[1fr_minmax(0,18rem)]">
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <p className="text-xs text-muted-foreground">Founder</p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
                  {FOUNDER_NAME}
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {FOUNDER_NAME}{' '}founded Ciphera BV in 2024 and leads it from Belgium. Ciphera&rsquo;s
                  privacy-first products — Pulse, Ciphera ID, Captcha, and Relay — and its open-source
                  Tessera authentication library were built under that direction.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <a
                    href="https://www.linkedin.com/in/usman-baig-79b843238/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
                      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0z" />
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/uz1mani"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <GithubIcon aria-hidden="true" className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                </div>
              </div>
              <div className="relative order-first min-h-[280px] border-b border-border sm:order-last sm:min-h-0 sm:border-b-0 sm:border-l">
                <Image
                  src={cdnUrl('/team/founder-usman.jpg')}
                  alt="Usman Baig, founder of Ciphera"
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 18rem, 100vw"
                  className="object-cover object-[center_25%]"
                />
              </div>
            </div>
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
          <p className="text-xs text-muted-foreground">05 · Get started</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
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
