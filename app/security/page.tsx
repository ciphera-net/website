import { Metadata } from 'next'
import Link from 'next/link'
import { cdnUrl } from '@/lib/cdn'

export const metadata: Metadata = {
  title: 'Security',
  description:
    'How Ciphera is engineered, what our servers can and cannot see, our audit status, and how to report a vulnerability. Coordinated disclosure policy with safe harbor.',
  alternates: {
    canonical: 'https://ciphera.net/security',
  },
  openGraph: {
    title: 'Security | Ciphera',
    description:
      'How Ciphera is engineered, what our servers can and cannot see, our audit status, and how to report a vulnerability.',
    url: 'https://ciphera.net/security',
    siteName: 'Ciphera',
    images: [{ url: cdnUrl('/ciphera_logo_no_margins.png'), width: 1200, height: 630, alt: 'Ciphera Security' }],
    locale: 'en_US',
    type: 'website',
  },
}

const securitySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Security',
  description:
    'How Ciphera is engineered, what our servers can and cannot see, our audit status, and how to report a vulnerability.',
  url: 'https://ciphera.net/security',
  dateModified: '2026-07-19',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Security' },
    ],
  },
}

const SECTIONS = [
  { id: 'security-architecture', title: '1. Security Architecture' },
  { id: 'audit-status', title: '2. Audit Status' },
  { id: 'reporting-a-vulnerability', title: '3. Reporting a Vulnerability' },
  { id: 'scope', title: '4. Scope' },
  { id: 'out-of-scope', title: '5. Out of Scope' },
  { id: 'safe-harbor', title: '6. Safe Harbor' },
  { id: 'what-to-expect-from-us', title: '7. What to Expect From Us' },
  { id: 'our-track-record', title: '8. Our Track Record' },
] as const

function ContentsList() {
  return (
    <ol className="mt-4 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
      {SECTIONS.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="block py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  )
}

export default function SecurityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(securitySchema) }}
      />

      <section className="pt-32 pb-24 sm:pb-32">
        <div>
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Security
            </h1>
            <p className="text-muted-foreground mb-12">
              How Ciphera is engineered, what we can and cannot see, and how to
              report a vulnerability. Last updated: 19-07-2026
            </p>

            <nav aria-label="Contents" className="mb-12 hidden md:block border border-border bg-card p-6">
              <p className="font-mono text-xs text-muted-foreground">Contents</p>
              <ContentsList />
            </nav>

            <nav aria-label="Contents" className="mb-12 md:hidden">
              <details className="group border border-border bg-card p-6">
                <summary className="cursor-pointer list-none font-mono text-xs text-muted-foreground">Contents</summary>
                <ContentsList />
              </details>
            </nav>

            <div className="prose prose-invert max-w-none space-y-10">

              {/* 1. Security Architecture */}
              <section>
                <h2 id="security-architecture" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  1. Security Architecture
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ciphera accounts are protected by{' '}
                  <Link href="/glossary/opaque" className="text-primary hover:underline">OPAQUE</Link>{' '}
                  (RFC 9807), an asymmetric password-authenticated key exchange:
                  your password is proven, never transmitted. Our servers store
                  an OPAQUE record and a wrapped vault key — not a password, and
                  not a password hash. Account data such as your email address
                  is encrypted on your device before it reaches us; the key that
                  opens it exists only in your browser. We have written up{' '}
                  <Link href="/blog/zero-knowledge-encryption-guide" className="text-primary hover:underline">
                    how the encryption works
                  </Link>{' '}
                  and{' '}
                  <Link href="/blog/what-we-see-about-you-what-we-dont" className="text-primary hover:underline">
                    an itemized account of what our servers can and cannot see
                  </Link>.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  The cryptographic core is open source. Tessera — our OPAQUE
                  implementation, server SDK, and browser SDK — is published
                  under Apache-2.0 with a language-neutral conformance kit, so
                  the claims above can be checked against code rather than taken
                  on trust:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li>
                    <a href="https://github.com/ciphera-net/tessera" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      ciphera-net/tessera
                    </a>{' '}
                    — Rust OPAQUE core and sidecar (RFC 9807 configuration #1: ristretto255-SHA-512, 3DH, Argon2id)
                  </li>
                  <li>
                    <a href="https://github.com/ciphera-net/tessera-go" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      ciphera-net/tessera-go
                    </a>{' '}
                    — Go server SDK
                  </li>
                  <li>
                    <a href="https://github.com/ciphera-net/tessera-ts" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      ciphera-net/tessera-ts
                    </a>{' '}
                    — browser SDK, published on npm as <span className="font-mono text-sm">@ciphera-net/tessera</span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  All services run on{' '}
                  <Link href="/blog/why-swiss-infrastructure-matters-for-data-privacy" className="text-primary hover:underline">
                    Swiss infrastructure
                  </Link>{' '}
                  under the Swiss{' '}
                  <Link href="/glossary/fadp" className="text-primary hover:underline">FADP</Link>,
                  operated by Ciphera B.V. (Belgium) under GDPR. Transactional
                  email runs on our own mail servers — no third-party email
                  provider sees account activity. On top of the cryptography,
                  the platform ships the unglamorous controls that stop real
                  attacks: refresh-token rotation with reuse detection,
                  escalating account lockouts, tiered rate limiting, security
                  alerts on sensitive account changes, and audit logs that store
                  HMAC-hashed IP addresses only and are purged after 180 days.
                </p>
              </section>

              {/* 2. Audit Status */}
              <section>
                <h2 id="audit-status" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  2. Audit Status
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Honesty over marketing: <strong className="text-foreground">Tessera has not yet had an
                  independent security audit.</strong> What exists today is a
                  published{' '}
                  <a href="https://github.com/ciphera-net/tessera/blob/main/docs/SELF-AUDIT.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    self-audit
                  </a>{' '}
                  and{' '}
                  <a href="https://github.com/ciphera-net/tessera/blob/main/docs/THREAT-MODEL.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    threat model
                  </a>, CI-gated cross-language parity tests, and conformance
                  vectors anyone can run. An independent third-party audit is
                  planned; this page will state the result when it happens —
                  whatever it finds.
                </p>
              </section>

              {/* 3. Reporting a Vulnerability */}
              <section>
                <h2 id="reporting-a-vulnerability" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  3. Reporting a Vulnerability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you believe you have found a security vulnerability in any
                  Ciphera service or repository, email{' '}
                  <a href="mailto:security@ciphera.net" className="text-primary hover:underline">security@ciphera.net</a>.
                  A machine-readable version of this policy lives at{' '}
                  <a href="/.well-known/security.txt" className="text-primary hover:underline">
                    /.well-known/security.txt
                  </a>{' '}
                  (RFC 9116).
                </p>
                <div className="border border-border bg-card p-6 mt-4">
                  <p className="font-mono text-xs text-muted-foreground mb-3">A useful report includes</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>The affected service, endpoint, or repository</li>
                    <li>Steps to reproduce, or a proof of concept</li>
                    <li>The impact you believe it has</li>
                    <li>How you would like to be credited, if at all</li>
                  </ul>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We do not currently publish a PGP key. If your report is too
                  sensitive for plain email, say so in a first message and we
                  will arrange a secure channel.
                </p>
              </section>

              {/* 4. Scope */}
              <section>
                <h2 id="scope" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  4. Scope
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    Any service under <span className="font-mono text-sm">*.ciphera.net</span> — including
                    ciphera.net, id.ciphera.net, pulse.ciphera.net,
                    captcha.ciphera.net, relay.ciphera.net, and cdn.ciphera.net
                  </li>
                  <li>
                    Our public repositories under{' '}
                    <a href="https://github.com/ciphera-net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      github.com/ciphera-net
                    </a>
                  </li>
                </ul>
              </section>

              {/* 5. Out of Scope */}
              <section>
                <h2 id="out-of-scope" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  5. Out of Scope
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Denial-of-service, volumetric, or resource-exhaustion attacks</li>
                  <li>Social engineering or phishing of Ciphera staff or users</li>
                  <li>
                    Vulnerabilities in third-party services we use — please
                    report those to the vendor directly
                  </li>
                  <li>
                    Automated scanner output without a demonstrated,
                    reproducible impact
                  </li>
                </ul>
              </section>

              {/* 6. Safe Harbor */}
              <section>
                <h2 id="safe-harbor" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  6. Safe Harbor
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We will not pursue legal action against researchers who make a
                  good-faith effort to follow this policy — that means avoiding
                  privacy violations, data destruction, and service disruption,
                  accessing only the minimum data needed to demonstrate the
                  issue, and giving us reasonable time to remediate before any
                  public disclosure.
                </p>
              </section>

              {/* 7. What to Expect From Us */}
              <section>
                <h2 id="what-to-expect-from-us" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  7. What to Expect From Us
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Acknowledgement of your report within 3 business days</li>
                  <li>An initial assessment within 7 days</li>
                  <li>
                    Remediation prioritized by severity, and updates as we
                    progress
                  </li>
                  <li>Public credit after the fix ships, if you want it</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  We do not currently run a paid bug bounty program. We say so
                  here rather than let you find out after you have done the
                  work.
                </p>
              </section>

              {/* 8. Our Track Record */}
              <section>
                <h2 id="our-track-record" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  8. Our Track Record
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We hold ourselves to the same standard we ask of researchers.
                  In July 2026 we privately reported a server-side request
                  forgery vulnerability in a widely used open-source service we
                  evaluated during product research, with a proposed fix. We are
                  coordinating with the maintainer and will publish the details
                  once a fix is available — not before.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  We also publish{' '}
                  <Link href="/transparency" className="text-primary hover:underline">
                    transparency reports and a warrant canary
                  </Link>, updated on a fixed schedule.
                </p>
              </section>

            </div>

            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
              <Link href="/" className="text-primary hover:underline font-medium">
                &larr; Back to Home
              </Link>
              <Link href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
