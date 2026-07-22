import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, LockIcon } from '@ciphera-net/facet'
import Breadcrumbs from '@/components/Breadcrumbs'
import { cdnUrl } from '@/lib/cdn'
import { officeHq, pulseIcon, authIcon, captchaIcon, relayIcon } from '@/lib/images'
import FAQAccordion from '@/components/FAQAccordion'

export const metadata: Metadata = {
  title: 'What is Ciphera?',
  description:
    'Ciphera is a Belgian privacy-software company (Ciphera BV) that builds zero-knowledge infrastructure and applications: Pulse analytics, Ciphera ID, Captcha, Relay, and the open-source Tessera authentication library.',
  alternates: {
    canonical: 'https://ciphera.net/what-is-ciphera',
  },
  openGraph: {
    title: 'What is Ciphera? | Ciphera',
    description:
      'Ciphera is a Belgian privacy-software company (Ciphera BV) that builds zero-knowledge infrastructure and applications: Pulse, Ciphera ID, Captcha, Relay, and the open-source Tessera library.',
    url: 'https://ciphera.net/what-is-ciphera',
    siteName: 'Ciphera',
    images: [{ url: cdnUrl('/og-homepage.png'), width: 1200, height: 630, alt: 'Ciphera' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@CipheraNET',
    title: 'What is Ciphera? | Ciphera',
    description:
      'Ciphera is a Belgian privacy-software company (Ciphera BV) that builds zero-knowledge infrastructure and applications.',
    images: [cdnUrl('/og-homepage.png')],
  },
}

// * Products, each linking to its own page. One factual line apiece.
const products = [
  {
    name: 'Pulse',
    image: pulseIcon,
    href: '/products/pulse',
    detail:
      'Privacy-first, cookieless web analytics — no cookies, no fingerprinting, no cross-visit tracking. Open source under AGPL-3.0, and GDPR compliant by design.',
  },
  {
    name: 'Ciphera ID',
    image: authIcon,
    href: '/products/id',
    detail:
      'A zero-knowledge identity provider. One account works across every Ciphera service, and your password is proven with OPAQUE (RFC 9807) — it never reaches our servers.',
  },
  {
    name: 'Ciphera Captcha',
    image: captchaIcon,
    href: '/products/captcha',
    detail:
      'Bot protection built on adaptive proof-of-work and puzzle challenges. Stateless, self-hosted, and free of third-party trackers.',
  },
  {
    name: 'Ciphera Relay',
    image: relayIcon,
    href: '/products/relay',
    detail:
      'Transactional email infrastructure that runs on our own mail servers, so no third-party email provider sees who we write to or why.',
  },
  {
    name: 'Tessera',
    image: null,
    href: '/products/tessera',
    detail:
      'Our open-source OPAQUE authentication library — a Rust core plus Go and browser SDKs, published under Apache-2.0. It is the cryptography behind Ciphera ID and Pulse auth.',
  },
] as const

// * FAQ rendered on-page and mirrored into FAQPage JSON-LD below, so the
// * structured data always matches the visible answers.
const faqs = [
  {
    q: 'What is Ciphera?',
    a: 'Ciphera is a Belgian privacy-software company (Ciphera BV) that builds zero-knowledge infrastructure and applications. Its products encrypt your data before it reaches Ciphera’s servers, so the company can run each service without being able to read what you store.',
  },
  {
    q: 'Is Ciphera a company or a product?',
    a: 'Both. Ciphera is the company — Ciphera BV — and it builds a family of privacy products under that name: Pulse, Ciphera ID, Ciphera Captcha, Ciphera Relay, and the open-source Tessera library. When people say “Ciphera”, they usually mean the company or the platform as a whole.',
  },
  {
    q: 'What can I use Ciphera for?',
    a: 'Cookieless web analytics with no consent banner (Pulse), zero-knowledge login and account management (Ciphera ID), bot protection that doesn’t profile your visitors (Ciphera Captcha), and transactional email with no tracking pixels (Ciphera Relay). Tessera, the OPAQUE library underneath, is available to developers on its own.',
  },
  {
    q: 'Where is Ciphera based, and where is my data stored?',
    a: 'Ciphera BV is registered in Belgium (KBO/BCE 1013.721.660, De Kleetlaan 2, 1831 Diegem) and operates under EU law — GDPR and NIS2. Customer data is hosted on Swiss infrastructure, protected by the Federal Act on Data Protection (FADP) alongside the GDPR.',
  },
  {
    q: 'Is Ciphera free to use?',
    a: 'Pulse has a free tier and paid plans, and you can explore the live demo without signing up. Ciphera’s other products are paid. Nothing here is ad-funded — you are the customer, never the product, and there is no data resale.',
  },
  {
    q: 'Is Ciphera open source?',
    a: 'Partly. Tessera — the OPAQUE authentication library behind Ciphera ID — is open source under Apache-2.0, and the Pulse analytics dashboard is open source under AGPL-3.0. The remaining services are not open source today, though more of the platform is being opened over time.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function WhatIsCipheraPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Breadcrumbs items={[{ label: 'What is Ciphera?' }]} />

      {/* Hero — statement definition, liftable by answer engines; editorial
          split with the HQ photo, mirroring the About hero. */}
      <section className="border-b border-border">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pr-14">
            <p className="text-xs text-muted-foreground">Definition</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              What is Ciphera?
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-foreground">
              <strong className="font-semibold text-foreground">
                Ciphera is a Belgian privacy-software company (Ciphera BV) that builds zero-knowledge
                infrastructure and applications — software where your data is encrypted before it
                reaches our servers, so we can run the service without being able to read what you
                store.
              </strong>
            </p>
            <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
              The company is registered in Belgium as Ciphera BV (KBO/BCE 1013.721.660, De Kleetlaan
              2, 1831 Diegem) and answers under EU law — GDPR and NIS2 — while hosting its services
              on Swiss infrastructure. Everything below can be checked against our{' '}
              <Link href="/trust" className="text-primary underline">
                trust hub
              </Link>{' '}
              and{' '}
              <Link href="/about" className="text-primary underline">
                about page
              </Link>
              .
            </p>
          </div>
          <div className="relative min-h-[440px] border-t border-border lg:border-l lg:border-t-0">
            <Image
              src={officeHq}
              alt="The Ciphera headquarters in Diegem, Belgium"
              fill
              unoptimized
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover grayscale"
            />
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">01 · What Ciphera builds</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Five things, one principle
          </h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            Ciphera ships four privacy-first products and one open-source library. They share a
            single design rule: collect as little as possible, and encrypt what remains before it
            leaves your device.
          </p>
          <div className="mt-12 grid gap-x-14 gap-y-10 sm:grid-cols-2">
            {products.map((p, i) => (
              <div key={p.name} className="border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt=""
                      width={28}
                      height={28}
                      unoptimized
                      aria-hidden="true"
                      className="h-7 w-7 object-contain"
                    />
                  ) : (
                    <LockIcon aria-hidden="true" className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {p.name}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{p.detail}</p>
                <Link
                  href={p.href}
                  className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  {p.name === 'Tessera' ? 'See Tessera' : `Explore ${p.name}`}
                  <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not to be confused with */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">02 · Not to be confused with</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Others share the name
          </h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            &ldquo;Ciphera&rdquo; is also used by unrelated companies, apps, and fictional characters.
            We are not affiliated with any of them. If you are looking for the privacy-software
            company described on this page:{' '}
            <Link href="/" className="text-primary underline">
              ciphera.net
            </Link>{' '}
            is us.
          </p>
        </div>
      </section>

      {/* FAQ — visible answers that mirror the FAQPage structured data */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">03 · Common questions</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Frequently asked
          </h2>
          <div className="mt-10 max-w-3xl">
            <FAQAccordion items={faqs} idPrefix="what-is" />
          </div>
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
