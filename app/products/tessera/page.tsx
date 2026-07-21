import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, CheckIcon, GithubIcon } from '@ciphera-net/facet'
import { authShowcaseBg, authIcon, pulseIcon } from '@/lib/images'
import { cdnUrl } from '@/lib/cdn'

export const metadata: Metadata = {
  title: 'Tessera - Open-Source OPAQUE Authentication',
  description:
    'Tessera is Ciphera’s open-source OPAQUE authentication library (Apache-2.0): a Rust core and sidecar, a Go server SDK, and a browser SDK. Zero-knowledge auth where the password never reaches the server.',
  alternates: {
    canonical: 'https://ciphera.net/products/tessera',
  },
  openGraph: {
    title: 'Tessera - Open-Source OPAQUE Authentication | Ciphera',
    description:
      'Ciphera’s open-source OPAQUE authentication library (Apache-2.0): Rust core + sidecar, Go server SDK, and browser SDK. The password never reaches the server.',
    url: 'https://ciphera.net/products/tessera',
    siteName: 'Ciphera',
    images: [
      {
        url: cdnUrl('/ciphera_logo_no_margins.png'),
        width: 1200,
        height: 630,
        alt: 'Tessera - Open-Source OPAQUE Authentication',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@CipheraNET',
    title: 'Tessera - Open-Source OPAQUE Authentication | Ciphera',
    description:
      'Ciphera’s open-source OPAQUE authentication library (Apache-2.0): Rust core + sidecar, Go server SDK, and browser SDK.',
    images: [cdnUrl('/ciphera_logo_no_margins.png')],
  },
}

const tesseraSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'Tessera',
    description:
      'Open-source OPAQUE (RFC 9807) authentication library: a Rust core and sidecar, a Go server SDK, and a browser SDK. Asymmetric password-authenticated key exchange where the password never reaches the server.',
    url: 'https://ciphera.net/products/tessera',
    codeRepository: [
      'https://github.com/ciphera-net/tessera',
      'https://github.com/ciphera-net/tessera-go',
      'https://github.com/ciphera-net/tessera-ts',
    ],
    programmingLanguage: ['Rust', 'Go', 'TypeScript'],
    license: 'https://www.apache.org/licenses/LICENSE-2.0',
    provider: { '@id': 'https://ciphera.net/#organization' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://ciphera.net/#products' },
      { '@type': 'ListItem', position: 3, name: 'Tessera' },
    ],
  },
]

const packages = [
  {
    name: 'tessera',
    lang: 'Rust',
    role: 'OPAQUE core + sidecar',
    body: 'The cryptographic core — an OPAQUE (RFC 9807) implementation and an HTTP sidecar. Configuration #1: ristretto255-SHA-512, 3DH, Argon2id.',
    repo: 'https://github.com/ciphera-net/tessera',
    registryLabel: 'crates.io',
    registryIcon: '/icons/registries/rust.png',
    langIcon: '/icons/langs/rust.png',
    registry: 'https://crates.io/crates/ciphera-tessera',
    pkg: 'ciphera-tessera',
  },
  {
    name: 'tessera-go',
    lang: 'Go',
    role: 'Server SDK',
    body: 'The Go server SDK — the registration and login flows a backend needs to speak OPAQUE, with the crypto handled by the Rust core.',
    repo: 'https://github.com/ciphera-net/tessera-go',
    registryLabel: 'pkg.go.dev',
    registryIcon: '/icons/registries/go.png',
    langIcon: '/icons/langs/go-wordmark.png',
    registry: 'https://pkg.go.dev/github.com/ciphera-net/tessera-go',
    pkg: 'github.com/ciphera-net/tessera-go',
  },
  {
    name: 'tessera-ts',
    lang: 'TypeScript',
    role: 'Browser SDK',
    body: 'The browser SDK that runs the client half of OPAQUE in the user’s browser. Published on npm as @ciphera-net/tessera.',
    repo: 'https://github.com/ciphera-net/tessera-ts',
    registryLabel: 'npm',
    registryIcon: '/icons/registries/npm.png',
    langIcon: '/icons/langs/typescript.png',
    registry: 'https://www.npmjs.com/package/@ciphera-net/tessera',
    pkg: '@ciphera-net/tessera',
  },
] as const

export default function TesseraPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tesseraSchema) }}
      />

      {/* Hero — full-bleed, mirrors the other product pages */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src={authShowcaseBg}
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
          <p className="text-xs text-muted-foreground">Tessera</p>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Zero-knowledge auth,{' '}<br className="hidden sm:inline" />open source.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Tessera is Ciphera&rsquo;s open-source OPAQUE authentication library. The user proves
            their password without ever sending it — released under Apache-2.0 so the claim can be
            checked against code, not taken on trust.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-y-3 text-xs text-muted-foreground">
            {['Apache-2.0', 'OPAQUE (RFC 9807)', 'Rust · Go · TypeScript'].map((label, i) => (
              <span key={label} className="flex items-center gap-2 whitespace-nowrap">
                {i > 0 && (
                  <span className="mx-2 text-muted-foreground" aria-hidden="true">
                    ·
                  </span>
                )}
                {label}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href="https://github.com/ciphera-net/tessera"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              View on GitHub
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="/products/id" className="btn-secondary">
              How Ciphera ID uses it
            </Link>
          </div>
        </div>
      </section>

      {/* 01 · What it is */}
      <section id="what-it-is" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">01 · What it is</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            An OPAQUE library you can read
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            OPAQUE (RFC 9807) is an asymmetric password-authenticated key exchange: the password is
            proven to the server, never transmitted to it. Tessera is our implementation of it,
            packaged as three libraries so it can run wherever authentication happens — the server,
            the browser, and the cryptographic core between them.
          </p>
          <ul className="mt-8 max-w-3xl space-y-3">
            {[
              'Apache-2.0 — permissive, and free to inspect, fork, and reuse',
              'A language-neutral conformance kit so implementations can be checked for parity',
              'Rust core with a published self-audit and threat model',
              'CI-gated cross-language parity tests',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-muted-foreground">
                <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Honesty over marketing: Tessera has not yet had an independent third-party security
            audit. What exists today is a self-audit, a threat model, and conformance vectors anyone
            can run — see the{' '}
            <Link href="/trust#open-source-and-audit-status" className="text-primary underline">
              open source &amp; audit status
            </Link>{' '}
            on our trust hub.
          </p>
        </div>
      </section>

      {/* 02 · The three packages */}
      <section id="packages" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">02 · Packages</p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Three packages, one protocol
          </h2>
          <div className="mt-14 grid gap-px border border-border bg-border lg:grid-cols-3">
            {packages.map((p) => (
              <div key={p.name} className="flex flex-col bg-background p-8">
                <div className="flex items-center gap-2">
                  <Image
                    src={cdnUrl(p.langIcon)}
                    alt=""
                    width={24}
                    height={16}
                    unoptimized
                    aria-hidden="true"
                    className="h-4 w-auto max-w-[28px] object-contain grayscale"
                  />
                  <p className="text-xs text-muted-foreground">{p.lang}</p>
                </div>
                <h3 className="mt-3 font-mono text-lg font-bold tracking-tight text-foreground">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-foreground">{p.role}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <div className="mt-5 flex items-center gap-2.5 border-t border-border pt-4">
                  {/* * Footer-style bordered icon tiles — the site's canonical
                      external-brand-link treatment (see components/Footer.tsx). */}
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.name} on GitHub`}
                    title="GitHub"
                    className="inline-flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors duration-fast hover:border-line-hover hover:text-foreground"
                  >
                    <GithubIcon className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href={p.registry}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.pkg} on ${p.registryLabel}`}
                    title={p.registryLabel}
                    className="group inline-flex h-9 w-9 items-center justify-center border border-border transition-colors duration-fast hover:border-line-hover"
                  >
                    <Image
                      src={cdnUrl(p.registryIcon)}
                      alt=""
                      width={24}
                      height={16}
                      unoptimized
                      aria-hidden="true"
                      className="h-4 w-6 object-contain grayscale transition-[filter] duration-fast group-hover:grayscale-0"
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 · Why OPAQUE */}
      <section id="why-opaque" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">03 · Why OPAQUE</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            The password never reaches the server
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Most login systems send your password to the server, which then hashes and compares it.
            OPAQUE removes that step entirely. The client and server run a key exchange in which the
            server verifies you know the password without ever receiving it. The server stores only
            an OPAQUE record — not a password, and not a password hash.
          </p>

          {/* * OPAQUE flow — the same device→server visual used on the Ciphera
              ID page (Tessera is the library that performs it), labelled by the
              package that runs each half. The password never leaves the first
              card. */}
          <div className="mt-10 max-w-xl space-y-4 border border-border bg-background p-6">
            {/* Client half — tessera-ts */}
            <div className="border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs text-muted-foreground">Browser</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">tessera-ts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1 border border-border bg-background px-3 py-2">
                  <p className="mb-0.5 text-[10px] text-muted-foreground">password</p>
                  <p className="tracking-widest text-foreground">••••••••</p>
                </div>
                <ArrowRightIcon
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                />
                <div className="min-w-0 flex-1 border border-primary/30 bg-primary/5 px-3 py-2">
                  <p className="mb-0.5 text-[10px] text-primary/70">proof</p>
                  <p className="truncate font-mono text-[11px] text-primary">a7f3c8e1b9d2…</p>
                </div>
              </div>
            </div>

            {/* Transit — only the proof crosses */}
            <div className="flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <div className="flex items-center gap-1.5 border border-border bg-background px-3 py-1">
                <svg
                  className="h-3 w-3 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-[10px] text-muted-foreground">
                  only the proof crosses — never the password
                </span>
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Server half — tessera-go */}
            <div className="border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
                    />
                  </svg>
                  <span className="text-xs text-muted-foreground">Server</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">tessera-go</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1 border border-primary/30 bg-primary/5 px-3 py-2">
                  <p className="mb-0.5 text-[10px] text-primary/70">proof</p>
                  <p className="truncate font-mono text-[11px] text-primary">a7f3c8e1b9d2…</p>
                </div>
                <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-foreground" />
                <div className="min-w-0 flex-1 border border-border bg-background px-3 py-2">
                  <p className="mb-0.5 text-[10px] text-muted-foreground">stored record</p>
                  <p className="truncate font-mono text-[11px] text-muted-foreground">
                    9f2c4e8a…b1d7
                  </p>
                </div>
              </div>
            </div>

            {/* Core — the Rust package both halves call */}
            <div className="flex items-center gap-2.5 border border-border bg-background px-4 py-3">
              <Image
                src={cdnUrl('/icons/langs/rust.png')}
                alt=""
                width={16}
                height={16}
                unoptimized
                aria-hidden="true"
                className="h-4 w-4 shrink-0 object-contain grayscale"
              />
              <p className="text-[11px] text-muted-foreground">
                tessera (Rust core) runs the OPAQUE math on both sides
              </p>
            </div>
          </div>

          <ul className="mt-8 max-w-3xl space-y-3">
            {[
              'The password is never transmitted, so a compromised server cannot leak it',
              'No plaintext password to phish from the wire or log by accident',
              'A server breach exposes no password hashes to crack offline',
              'The exchange also yields a key material the client can use to unwrap a vault key',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-muted-foreground">
                <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            New to the term? Read the plain-language definition of{' '}
            <Link href="/glossary/opaque" className="text-primary underline">
              OPAQUE
            </Link>{' '}
            in our glossary.
          </p>
        </div>
      </section>

      {/* 04 · Who uses it */}
      <section id="who-uses-it" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">04 · Who uses it</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            It runs in production at Ciphera
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Tessera is not a demo. It is the authentication layer behind{' '}
            <Link href="/products/id" className="text-primary underline">
              Ciphera ID
            </Link>{' '}
            and the auth for{' '}
            <Link href="/products/pulse" className="text-primary underline">
              Pulse
            </Link>
            . The same open code you can read is the code that verifies real Ciphera logins — the
            cryptographic core our whole platform depends on.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {[
              { image: authIcon, label: 'Ciphera ID', href: '/products/id' },
              { image: pulseIcon, label: 'Pulse', href: '/products/pulse' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-2.5 border border-border px-4 py-2.5 transition-colors duration-fast hover:border-line-hover"
              >
                <Image
                  src={item.image}
                  alt=""
                  width={20}
                  height={20}
                  unoptimized
                  aria-hidden="true"
                  className="h-5 w-5 object-contain"
                />
                <span className="text-xs text-foreground">{item.label}</span>
              </Link>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            For how this fits the wider architecture, see the{' '}
            <Link href="/trust#the-zero-knowledge-architecture" className="text-primary underline">
              zero-knowledge architecture
            </Link>{' '}
            section of our trust hub.
          </p>
        </div>
      </section>

      {/* CTA — full-bleed close */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src={authShowcaseBg}
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
          <p className="text-xs text-muted-foreground">05 · Get the code</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Read it, run it, build on it.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The three Tessera repositories are public on GitHub and published to crates.io, npm, and
            the Go module registry. Apache-2.0 throughout.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href="https://github.com/ciphera-net/tessera"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              View on GitHub
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="/trust" className="btn-secondary">
              Trust &amp; Security
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
