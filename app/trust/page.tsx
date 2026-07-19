import { Metadata } from 'next'
import Link from 'next/link'
import { cdnUrl } from '@/lib/cdn'
import { getCurrentCanary, getCurrentReport } from '@/lib/transparency'
import { subprocessors, weDoNotUse } from '@/lib/subprocessors'

export const metadata: Metadata = {
  title: 'Trust & Security',
  description:
    'What you can verify yourself: the zero-knowledge architecture, open-source proofs, warrant canary, transparency reports, Swiss residency, subprocessors, and how to report a vulnerability.',
  alternates: {
    canonical: 'https://ciphera.net/trust',
  },
  openGraph: {
    title: 'Trust & Security | Ciphera',
    description:
      'What you can verify yourself: the zero-knowledge architecture, open-source proofs, warrant canary, transparency reports, and coordinated disclosure policy.',
    url: 'https://ciphera.net/trust',
    siteName: 'Ciphera',
    images: [{ url: cdnUrl('/og/trust.png'), width: 1200, height: 630, alt: 'Ciphera Trust & Security' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@CipheraNET',
    title: 'Trust & Security | Ciphera',
    description:
      'What you can verify yourself: the zero-knowledge architecture, open-source proofs, warrant canary, transparency reports, and coordinated disclosure policy.',
    images: [cdnUrl('/og/trust.png')],
  },
}

// * Bump when the page COPY changes. The rendered "Last updated" and JSON-LD
// * dateModified take the max of this and the live canary/report publish
// * dates, so monthly canary rolls refresh the page's freshness signals
// * without an edit here.
const PAGE_REVISED_ISO = '2026-07-19'

const SECTIONS = [
  { id: 'the-zero-knowledge-architecture', title: '1. The Zero-Knowledge Architecture' },
  { id: 'open-source-and-audit-status', title: '2. Open Source & Audit Status' },
  { id: 'swiss-residency-belgian-jurisdiction', title: '3. Swiss Residency, Belgian Jurisdiction' },
  { id: 'warrant-canary-and-transparency-reports', title: '4. Warrant Canary & Transparency Reports' },
  { id: 'coordinated-disclosure', title: '5. Coordinated Disclosure' },
  { id: 'scope-and-safe-harbor', title: '6. Scope & Safe Harbor' },
  { id: 'what-to-expect-from-us', title: '7. What to Expect From Us' },
  { id: 'our-track-record', title: '8. Our Track Record' },
  { id: 'subprocessors', title: '9. Subprocessors' },
  { id: 'data-handling-in-plain-language', title: '10. Data Handling in Plain Language' },
  { id: 'for-security-reviewers', title: '11. For Security Reviewers' },
] as const

const verifySteps = [
  'Pull the canary plaintext and its detached signature, as raw files, straight from this site.',
  'Import the public key — the same key, every month — and run gpg --verify.',
  'Diff each month against its Archive.org snapshot. Nothing should change after the fact.',
  'If a canary misses its next-update date, the silence is the disclosure. Read the non-update protocol.',
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

export default async function TrustPage() {
  const canary = await getCurrentCanary()
  const report = await getCurrentReport()
  const fingerprint = canary.text.match(/\b([0-9A-F]{40})\b/)?.[1] ?? null
  const fingerprintSpaced = fingerprint ? fingerprint.replace(/(.{4})(?=.)/g, '$1 ') : null

  const lastUpdatedISO = [PAGE_REVISED_ISO, canary.publishedISO, report.publishedISO]
    .sort()
    .at(-1) as string
  const lastUpdatedEuropean = lastUpdatedISO.split('-').reverse().join('-')

  const trustSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Trust & Security',
    description:
      'What you can verify yourself: the zero-knowledge architecture, open-source proofs, warrant canary, transparency reports, and coordinated disclosure policy.',
    url: 'https://ciphera.net/trust',
    dateModified: lastUpdatedISO,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
        { '@type': 'ListItem', position: 2, name: 'Trust' },
      ],
    },
  }

  // * Live status facts — canary and report values come from the published
  // * documents themselves; the audit line is a static label (no audit data
  // * source exists yet — see section 2).
  const status: { term: string; detail: string }[] = [
    { term: 'Warrant canary', detail: `${canary.periodLabel} · next on or before ${canary.nextUpdateEuropean}` },
    { term: 'Transparency report', detail: `${report.period} · ${report.status} · published ${report.publishedEuropean}` },
    { term: 'Independent audit', detail: 'planned — self-audit and threat model published' },
    { term: 'Vulnerability contact', detail: 'security@ciphera.net' },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trustSchema) }}
      />

      <section className="pt-32 pb-24 sm:pb-32">
        <div>
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Trust
            </h1>
            <p className="text-muted-foreground mb-12">
              Everything on this page is something you can check — open code,
              signed statements, raw files, named vendors. What we cannot prove,
              we say plainly. Last updated: {lastUpdatedEuropean}
            </p>

            <div className="mb-12 border border-border bg-card p-6">
              <p className="font-mono text-xs text-muted-foreground">Current status</p>
              <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {status.map((s) => (
                  <div key={s.term} className="border-t border-border pt-3">
                    <dt className="font-mono text-xs text-muted-foreground">{s.term}</dt>
                    <dd className="mt-1.5 break-words font-mono text-sm tabular-nums text-foreground">
                      {s.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <nav aria-label="Contents" className="mb-12 hidden md:block border border-border bg-card p-6">
              <p className="font-mono text-xs text-muted-foreground">Contents</p>
              <ContentsList />
            </nav>

            <nav aria-label="Contents" className="mb-12 md:hidden">
              <details className="group border border-border bg-card p-6">
                <summary className="cursor-pointer font-mono text-xs text-muted-foreground">Contents</summary>
                <ContentsList />
              </details>
            </nav>

            <div className="prose prose-invert max-w-none space-y-10">

              {/* 1. The Zero-Knowledge Architecture */}
              <section>
                <h2 id="the-zero-knowledge-architecture" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  1. The Zero-Knowledge Architecture
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
                      ciphera-net/tessera<span className="sr-only"> (opens in a new tab)</span>
                    </a>{' '}
                    — Rust OPAQUE core and sidecar (RFC 9807 configuration #1: ristretto255-SHA-512, 3DH, Argon2id)
                  </li>
                  <li>
                    <a href="https://github.com/ciphera-net/tessera-go" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      ciphera-net/tessera-go<span className="sr-only"> (opens in a new tab)</span>
                    </a>{' '}
                    — Go server SDK
                  </li>
                  <li>
                    <a href="https://github.com/ciphera-net/tessera-ts" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      ciphera-net/tessera-ts<span className="sr-only"> (opens in a new tab)</span>
                    </a>{' '}
                    — browser SDK, published on npm as <span className="font-mono text-sm">@ciphera-net/tessera</span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  On top of the cryptography, the platform ships the unglamorous
                  controls that stop real attacks: refresh-token rotation with
                  reuse detection, escalating account lockouts, tiered rate
                  limiting, security alerts on sensitive account changes, and
                  audit logs that store HMAC-hashed IP addresses only and are
                  purged after 180 days.
                </p>
              </section>

              {/* 2. Open Source & Audit Status */}
              <section>
                <h2 id="open-source-and-audit-status" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  2. Open Source &amp; Audit Status
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Honesty over marketing: <strong className="text-foreground">Tessera has not yet had an
                  independent security audit.</strong> What exists today is a
                  published{' '}
                  <a href="https://github.com/ciphera-net/tessera/blob/main/docs/SELF-AUDIT.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    self-audit<span className="sr-only"> (opens in a new tab)</span>
                  </a>{' '}
                  and{' '}
                  <a href="https://github.com/ciphera-net/tessera/blob/main/docs/THREAT-MODEL.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    threat model<span className="sr-only"> (opens in a new tab)</span>
                  </a>, CI-gated cross-language parity tests, and conformance
                  vectors anyone can run. An independent third-party audit is
                  planned; this page will state the result when it happens —
                  whatever it finds.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  The open code goes beyond the crypto core: Pulse, our
                  analytics engine, is open source under AGPL-3.0 at{' '}
                  <a href="https://github.com/ciphera-net/pulse" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    ciphera-net/pulse<span className="sr-only"> (opens in a new tab)</span>
                  </a>{' '}
                  — the code that runs on your visitors is the code you can
                  read.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  We hold no SOC 2 or ISO 27001 certification. Rather than rent
                  a badge, we publish the things a certification would attest
                  to — the code, the threat model, the vendor list, the signed
                  canary — and let you check them directly.
                </p>
              </section>

              {/* 3. Swiss Residency, Belgian Jurisdiction */}
              <section>
                <h2 id="swiss-residency-belgian-jurisdiction" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  3. Swiss Residency, Belgian Jurisdiction
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your data lives in Switzerland: all services run on{' '}
                  <Link href="/blog/why-swiss-infrastructure-matters-for-data-privacy" className="text-primary hover:underline">
                    Swiss infrastructure
                  </Link>{' '}
                  in Zurich, under the Swiss{' '}
                  <Link href="/glossary/fadp" className="text-primary hover:underline">FADP</Link>.
                  The company is Belgian: Ciphera BV (KBO/BCE 1013.721.660,
                  De Kleetlaan 2, 1831 Diegem) operates from Belgium, under
                  GDPR and NIS2 — you can look us up in the Belgian enterprise
                  register. Two jurisdictions, both chosen on purpose — strong
                  data-protection law where the data sits, EU accountability
                  where the company answers for it.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  The stack is deliberately European: Swiss compute and storage,
                  EU payment processing, CDN and DNS from an EU provider, and
                  transactional email on our own mail servers — no third-party
                  email provider sees account activity. One US company remains
                  in the{' '}
                  <a href="#subprocessors" className="text-primary hover:underline">vendor list below</a>:
                  GitHub, for source-code hosting. No personal user data is
                  stored there, and we treat jurisdiction as part of the threat
                  model when we pick every new dependency.
                </p>
              </section>

              {/* 4. Warrant Canary & Transparency Reports */}
              <section>
                <h2 id="warrant-canary-and-transparency-reports" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  4. Warrant Canary &amp; Transparency Reports
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Legal process received, disclosed in full. We publish a
                  biannual report of every legal request we receive, and a
                  monthly GPG-signed warrant canary. Both are offline-signed
                  and independently verifiable — built to outlast silent
                  compulsion, not merely describe it.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li>
                    <Link href="/trust/report" className="text-primary hover:underline">
                      {report.title}
                    </Link>{' '}
                    — {report.status}, published {report.publishedEuropean}.
                    Every legal request received, counted and categorised by
                    type, jurisdiction, and outcome.
                  </li>
                  <li>
                    <Link href="/trust/canary" className="text-primary hover:underline">
                      Warrant canary
                    </Link>{' '}
                    — {canary.periodLabel}, next update on or before{' '}
                    {canary.nextUpdateEuropean}. Signed offline every month with
                    a key on no production system. Miss the date and the silence
                    is the disclosure — see the{' '}
                    <Link href="/trust/canary#non-update" className="text-primary hover:underline">
                      non-update protocol
                    </Link>.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Verify it yourself, without trusting this page:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-3">
                  {verifySteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <div className="border border-border bg-card p-6 mt-4">
                  <p className="font-mono text-xs text-muted-foreground mb-3">Verify the signature</p>
                  <pre tabIndex={0} className="overflow-x-auto font-mono text-xs leading-relaxed text-foreground">
                    <code>{`gpg --import canary-pubkey.asc\ngpg --verify \\\n  canary-${canary.period}.txt.asc \\\n  canary-${canary.period}.txt`}</code>
                  </pre>
                  {fingerprintSpaced && (
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="font-mono text-xs text-muted-foreground">Signing key</p>
                      <p className="mt-1.5 break-words font-mono text-xs tabular-nums text-foreground">
                        {fingerprintSpaced}
                      </p>
                    </div>
                  )}
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
                    {[
                      { label: 'Plaintext', href: canary.plaintextUrl },
                      { label: 'Signature', href: canary.signatureUrl },
                      { label: 'Public key', href: canary.pubkeyUrl },
                    ].map((f) => (
                      <a
                        key={f.label}
                        href={f.href}
                        aria-label={`${canary.periodLabel} canary — ${f.label.toLowerCase()} file`}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {f.label} <span aria-hidden="true">&rarr;</span>
                      </a>
                    ))}
                  </div>
                </div>
              </section>

              {/* 5. Coordinated Disclosure */}
              <section>
                <h2 id="coordinated-disclosure" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  5. Coordinated Disclosure
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

              {/* 6. Scope & Safe Harbor */}
              <section>
                <h2 id="scope-and-safe-harbor" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  6. Scope &amp; Safe Harbor
                </h2>
                <p className="font-mono text-xs text-muted-foreground mb-3">In scope</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    Any service under <span className="font-mono text-sm">*.ciphera.net</span> — including
                    ciphera.net, id.ciphera.net, pulse.ciphera.net,
                    captcha.ciphera.net, relay.ciphera.net, and cdn.ciphera.net
                  </li>
                  <li>
                    Our public repositories under{' '}
                    <a href="https://github.com/ciphera-net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      github.com/ciphera-net<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                </ul>
                <p className="font-mono text-xs text-muted-foreground mb-3 mt-6">Out of scope</p>
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
                <p className="font-mono text-xs text-muted-foreground mb-3 mt-6">Safe harbor</p>
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
                  We will link the advisory here the day it publishes.
                </p>
              </section>

              {/* 9. Subprocessors */}
              <section>
                <h2 id="subprocessors" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  9. Subprocessors
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We minimize our reliance on third-party services. The services
                  we use, and the data they may process, are listed below — the
                  same list published in{' '}
                  <Link href="/privacy#third-party-services-and-data-processors" className="text-primary hover:underline">
                    our privacy policy
                  </Link>, rendered from one source so the two can never drift
                  apart:
                </p>
                <p className="font-mono text-[10px] text-muted-foreground md:hidden" aria-hidden="true">scroll &rarr;</p>
                <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Subprocessor table, scrollable">
                  <table className="w-full text-sm text-muted-foreground mt-2">
                    <caption className="sr-only">Subprocessors — service, purpose, data processed, and location</caption>
                    <thead>
                      <tr className="border-b border-border">
                        <th scope="col" className="text-left py-2 pr-4 font-semibold text-foreground">Service</th>
                        <th scope="col" className="text-left py-2 pr-4 font-semibold text-foreground">Purpose</th>
                        <th scope="col" className="text-left py-2 pr-4 font-semibold text-foreground">Data Processed</th>
                        <th scope="col" className="text-left py-2 font-semibold text-foreground">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subprocessors.map((s, i) => (
                        <tr key={s.service} className={i < subprocessors.length - 1 ? 'border-b border-border' : ''}>
                          <th scope="row" className="text-left py-2 pr-4 font-medium">{s.service}</th>
                          <td className="py-2 pr-4">{s.purpose}</td>
                          <td className="py-2 pr-4">{s.dataProcessed}</td>
                          <td className="py-2">{s.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  This table is the whole list — there is no vendor we left
                  out. Each one is bound by a Data Processing Agreement; full
                  sub-processor identities, including registered addresses, are
                  available on request at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-primary hover:underline">privacy@ciphera.net</a>.
                  We do not use:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                  {weDoNotUse.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              {/* 10. Data Handling in Plain Language */}
              <section>
                <h2 id="data-handling-in-plain-language" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  10. Data Handling in Plain Language
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The short version of{' '}
                  <Link href="/privacy" className="text-primary hover:underline">our privacy policy</Link>,
                  per product:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li>
                    <strong className="text-foreground">Ciphera ID</strong> — we cannot decrypt your
                    vault; there is nothing useful to hand over, subpoena or
                    not. Exactly what our servers do hold is itemized in{' '}
                    <a href="#the-zero-knowledge-architecture" className="text-primary hover:underline">
                      section 1
                    </a>.
                  </li>
                  <li>
                    <strong className="text-foreground">Pulse</strong> — cookieless analytics. No
                    cookies, no fingerprinting, no cross-visit visitor
                    tracking, no third-party trackers on your site or ours.
                  </li>
                  <li>
                    <strong className="text-foreground">Captcha</strong> — bot protection we built and
                    run ourselves, so no third-party CAPTCHA vendor sees your
                    visitors.
                  </li>
                  <li>
                    <strong className="text-foreground">Relay</strong> — transactional email on our own
                    mail servers. No third-party email provider sees who we
                    write to or why.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  The full, itemized account of what our servers can and cannot
                  see is in{' '}
                  <Link href="/blog/what-we-see-about-you-what-we-dont" className="text-primary hover:underline">
                    what we see about you — and what we don&rsquo;t
                  </Link>.
                </p>
              </section>

              {/* 11. For Security Reviewers */}
              <section>
                <h2 id="for-security-reviewers" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  11. For Security Reviewers
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Running a vendor review? The materials above are the review
                  package: open-source cryptographic core with a published
                  self-audit and threat model (section 2), the subprocessor
                  list (section 9), data-handling summary (section 10), and the
                  disclosure policy with response commitments (sections 5–7).
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li>
                    A Data Processing Agreement is available on request at{' '}
                    <a href="mailto:privacy@ciphera.net" className="text-primary hover:underline">privacy@ciphera.net</a>
                  </li>
                  <li>
                    Security questionnaires and architecture questions:{' '}
                    <a href="mailto:security@ciphera.net" className="text-primary hover:underline">security@ciphera.net</a>
                  </li>
                  <li>
                    When the independent Tessera audit is complete, the report
                    will be published here — not summarized, published
                  </li>
                  <li>
                    Environmental footprint, measured by life-cycle assessment
                    with no offsets:{' '}
                    <Link href="/sustainability" className="text-primary hover:underline">
                      /sustainability
                    </Link>
                  </li>
                </ul>
              </section>

            </div>

            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
              <Link href="/" className="text-primary hover:underline font-medium">
                <span aria-hidden="true">&larr; </span>Back to Home
              </Link>
              <Link href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy<span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
