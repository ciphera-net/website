import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, GithubIcon, XIcon } from '@ciphera-net/facet'
import Breadcrumbs from '@/components/Breadcrumbs'
import { cdnUrl } from '@/lib/cdn'

export const metadata: Metadata = {
  title: 'Press & Media Kit',
  description:
    'Press and media resources for Ciphera BV: company boilerplate, fact sheet, logo and brand assets, and press contact. Belgian privacy-software company, KBO/BCE 1013.721.660.',
  alternates: {
    canonical: 'https://ciphera.net/press',
  },
  openGraph: {
    title: 'Press & Media Kit | Ciphera',
    description:
      'Company boilerplate, fact sheet, logo and brand assets, and press contact for Ciphera BV — a Belgian privacy-software company.',
    url: 'https://ciphera.net/press',
    siteName: 'Ciphera',
    images: [{ url: cdnUrl('/ciphera_logo_no_margins.png'), width: 1200, height: 630, alt: 'Ciphera' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@CipheraNET',
    title: 'Press & Media Kit | Ciphera',
    description:
      'Company boilerplate, fact sheet, logo and brand assets, and press contact for Ciphera BV.',
    images: [cdnUrl('/ciphera_logo_no_margins.png')],
  },
}

const pressSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Press & Media Kit',
  description:
    'Press and media resources for Ciphera BV: company boilerplate, fact sheet, logo and brand assets, and press contact.',
  url: 'https://ciphera.net/press',
  about: { '@id': 'https://ciphera.net/#organization' },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: cdnUrl('/ciphera_logo_no_margins.png'),
  },
}

// * Fact sheet — every value is verifiable in the codebase, the footer, or the
// * Belgian enterprise register (KBO/BCE).
const facts: { term: string; detail: string }[] = [
  { term: 'Legal name', detail: 'Ciphera BV' },
  { term: 'Company type', detail: 'Private limited company (besloten vennootschap)' },
  { term: 'Enterprise number (KBO/BCE)', detail: '1013.721.660' },
  { term: 'VAT number', detail: 'BE1013721660' },
  { term: 'Founded', detail: '18 September 2024' },
  { term: 'Headquarters', detail: 'De Kleetlaan 2, 1831 Diegem, Belgium' },
  { term: 'Jurisdiction', detail: 'Belgium / EU — GDPR and NIS2' },
  { term: 'Data residency', detail: 'Switzerland' },
]

const productLines: { name: string; href: string; line: string }[] = [
  { name: 'Pulse', href: '/products/pulse', line: 'Privacy-first, cookieless web analytics. Open source under AGPL-3.0.' },
  { name: 'Ciphera ID', href: '/products/id', line: 'Zero-knowledge identity provider; passwords proven with OPAQUE, never sent.' },
  { name: 'Ciphera Captcha', href: '/products/captcha', line: 'Stateless, privacy-first bot protection with adaptive proof-of-work.' },
  { name: 'Ciphera Relay', href: '/products/relay', line: 'Transactional email on Ciphera’s own mail servers.' },
  { name: 'Tessera', href: '/products/tessera', line: 'Open-source OPAQUE authentication library (Apache-2.0).' },
]

// * Brand assets — existing CDN files only; no new assets invented.
const assets: { label: string; note: string; file: string }[] = [
  { label: 'Wordmark logo (PNG)', note: 'Full Ciphera logo, transparent background', file: '/ciphera_logo_no_margins.png' },
  { label: 'App icon (PNG)', note: 'Square Ciphera mark', file: '/ciphera_icon.png' },
  { label: 'Pulse icon (PNG)', note: 'Product mark', file: '/pulse_icon_no_margins.png' },
  { label: 'Ciphera ID icon (PNG)', note: 'Product mark', file: '/id_icon_no_margins.png' },
  { label: 'Ciphera Captcha icon (PNG)', note: 'Product mark', file: '/captcha_icon_no_margins.png' },
  { label: 'Ciphera Relay icon (PNG)', note: 'Product mark', file: '/relay_icon_no_margins.png' },
]

const links: { label: string; href: string; icon?: 'linkedin' | 'github' | 'x' }[] = [
  {
    label: 'Belgian enterprise register (KBO/BCE)',
    href: 'https://kbopub.economie.fgov.be/kbopub/toonondernemingps.html?ondernemingsnummer=1013721660&lang=en',
  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ciphera/', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/ciphera-net', icon: 'github' },
  { label: 'X (Twitter)', href: 'https://x.com/CipheraNET', icon: 'x' },
]

// * Brand marks for the profile links; LinkedIn has no facet icon, so the
// * footer's inline path is reused to keep the two renderings identical.
function ProfileLinkIcon({ icon }: { icon?: 'linkedin' | 'github' | 'x' }) {
  if (icon === 'github')
    return <GithubIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
  if (icon === 'x')
    return <XIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
  if (icon === 'linkedin')
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-muted-foreground"
      >
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0z" />
      </svg>
    )
  return null
}

const BOILERPLATE =
  'Ciphera BV is a Belgian privacy-software company founded in 2024. It builds zero-knowledge infrastructure and applications — including Pulse (cookieless web analytics), Ciphera ID (a zero-knowledge identity provider), Ciphera Captcha (privacy-first bot protection), Ciphera Relay (transactional email), and the open-source Tessera authentication library. Ciphera’s products encrypt user data before it reaches the company’s servers, and run on Swiss infrastructure under EU (GDPR and NIS2) jurisdiction. Ciphera is headquartered at De Kleetlaan 2, 1831 Diegem, Belgium. Learn more at ciphera.net.'

export default function PressPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pressSchema) }}
      />
      <Breadcrumbs items={[{ label: 'Press' }]} />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">Press &amp; Media Kit</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            Press &amp; media kit
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Facts, boilerplate, and brand assets for writing about Ciphera. Everything here is
            verifiable — the company details match the Belgian enterprise register, linked below.
          </p>
          <p className="mt-6 text-xs text-muted-foreground">
            Media enquiries:{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact us
            </Link>{' '}
            or{' '}
            <a href="mailto:hello@ciphera.net" className="text-primary hover:underline">
              hello@ciphera.net
            </a>
          </p>
        </div>
      </section>

      {/* Boilerplate */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="text-xs text-muted-foreground">01 · Boilerplate</p>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Company description
          </h2>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Use this paragraph verbatim when you need a standard description of the company.
          </p>
          <blockquote className="mt-6 max-w-3xl border border-border bg-card p-6 text-base leading-relaxed text-foreground">
            {BOILERPLATE}
          </blockquote>
        </div>
      </section>

      {/* Fact sheet */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="text-xs text-muted-foreground">02 · Fact sheet</p>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            The essentials
          </h2>
          <dl className="mt-8 grid max-w-4xl gap-x-12 gap-y-6 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.term} className="border-t border-border pt-3">
                <dt className="text-xs text-muted-foreground">{f.term}</dt>
                <dd className="mt-1.5 text-sm text-foreground">{f.detail}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-14 font-display text-lg font-bold tracking-tight text-foreground">
            Products
          </h3>
          <ul className="mt-6 max-w-3xl">
            {productLines.map((p) => (
              <li key={p.name} className="flex flex-col gap-1 border-t border-border py-4 last:border-b sm:flex-row sm:items-baseline sm:gap-4">
                <Link
                  href={p.href}
                  className="shrink-0 text-sm font-semibold text-primary hover:underline sm:w-40"
                >
                  {p.name}
                </Link>
                <span className="text-sm leading-relaxed text-muted-foreground">{p.line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Brand assets */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="text-xs text-muted-foreground">03 · Brand assets</p>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Logos and marks
          </h2>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Please use the Ciphera name and logo to refer to the company and its products only.
            Don&rsquo;t alter, recolour, or stretch the marks. Files are served from our CDN.
          </p>
          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((a) => (
              <a
                key={a.file}
                href={cdnUrl(a.file)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-background p-6 transition-colors hover:bg-card"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-card">
                  <Image
                    src={cdnUrl(a.file)}
                    alt=""
                    width={28}
                    height={28}
                    unoptimized
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    {a.label}
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{a.note}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Links & contact */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="text-xs text-muted-foreground">04 · Official links</p>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Verify and follow
          </h2>
          <ul className="mt-8 max-w-3xl">
            {links.map((l) => (
              <li key={l.href} className="border-t border-border last:border-b">
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                    <ProfileLinkIcon icon={l.icon} />
                    {l.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-primary group-hover:underline">
                    Open
                    <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-3xl leading-relaxed text-muted-foreground">
            For interviews, quotes, or anything not covered here, reach us at{' '}
            <a href="mailto:hello@ciphera.net" className="text-primary underline">
              hello@ciphera.net
            </a>{' '}
            or through the{' '}
            <Link href="/contact" className="text-primary underline">
              contact page
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Footer nav */}
      <section className="border-b border-border">
        <div className="flex items-center justify-between px-6 py-8">
          <Link href="/" className="text-xs text-primary hover:underline">
            <span aria-hidden="true">&larr; </span>Back to Home
          </Link>
          <Link href="/about" className="text-xs text-primary hover:underline">
            About Ciphera<span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </section>
    </>
  )
}
