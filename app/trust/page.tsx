import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRightIcon } from '@ciphera-net/facet'
import Breadcrumbs from '@/components/Breadcrumbs'
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
const PAGE_REVISED_ISO = '2026-07-20'

const SECTIONS = [
  { id: 'the-zero-knowledge-architecture', title: 'Architecture' },
  { id: 'data-handling-in-plain-language', title: 'Data handling' },
  { id: 'open-source-and-audit-status', title: 'Open source & audit' },
  { id: 'swiss-residency-belgian-jurisdiction', title: 'Residency & jurisdiction' },
  { id: 'warrant-canary-and-transparency-reports', title: 'Canary & reports' },
  { id: 'subprocessors', title: 'Subprocessors' },
  { id: 'coordinated-disclosure', title: 'Disclosure' },
  { id: 'scope-and-safe-harbor', title: 'Scope & safe harbor' },
  { id: 'what-to-expect-from-us', title: 'What to expect' },
  { id: 'our-track-record', title: 'Track record' },
  { id: 'for-security-reviewers', title: 'For reviewers' },
] as const

const verifySteps = [
  'Pull the canary plaintext and its detached signature, as raw files, straight from this site.',
  'Import the public key — the same key, every month — and run gpg --verify.',
  'Diff each month against its Archive.org snapshot. Nothing should change after the fact.',
  'If a canary misses its next-update date, the silence is the disclosure. Read the non-update protocol.',
] as const

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
  // * source exists yet — see the open-source & audit section).
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
      <Breadcrumbs items={[{ label: 'Trust' }]} />

      {/* Hero — statement headline, no imagery: the ledgers and receipts carry the page */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="font-mono text-xs text-muted-foreground">Trust &amp; Security</p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Built to be checked, not believed.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Everything on this page is something you can verify — open code,
            signed statements, raw files, named vendors. What we cannot prove,
            we say plainly.
          </p>
          <p className="mt-8 font-mono text-xs text-muted-foreground">
            Last updated {lastUpdatedEuropean} ·{' '}
            <a href="#for-security-reviewers" className="text-primary hover:underline">
              Running a vendor review? Jump to the review package
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </p>
        </div>
      </section>

      {/* Current status — live ledger, values from the published documents */}
      <section className="border-b border-border">
        <div className="px-6 py-12 sm:py-14">
          <p className="font-mono text-xs text-muted-foreground">Current status</p>
          <dl className="mt-6 grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
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
      </section>

      {/* Contents */}
      <nav aria-label="Contents" className="border-b border-border">
        <div className="flex flex-wrap gap-x-6 gap-y-2 px-6 py-5">
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="tabular-nums text-foreground/50">{String(i + 1).padStart(2, '0')}</span>{' '}
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      {/* 01 · The zero-knowledge architecture */}
      <section id="the-zero-knowledge-architecture" className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">01 · The zero-knowledge architecture</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Your password never reaches us.
          </h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            Ciphera accounts are protected by{' '}
            <Link href="/glossary/opaque" className="text-primary underline">OPAQUE</Link>{' '}
            (RFC 9807), an asymmetric password-authenticated key exchange:
            your password is proven, never transmitted. Our servers store
            an OPAQUE record and a wrapped vault key — not a password, and
            not a password hash. Account data such as your email address
            is encrypted on your device before it reaches us; the key that
            opens it exists only in your browser. We have written up{' '}
            <Link href="/blog/zero-knowledge-encryption-guide" className="text-primary underline">
              how the encryption works
            </Link>{' '}
            and{' '}
            <Link href="/blog/what-we-see-about-you-what-we-dont" className="text-primary underline">
              an itemized account of what our servers can and cannot see
            </Link>.
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            The cryptographic core is open source. Tessera — our OPAQUE
            implementation, server SDK, and browser SDK — is published
            under Apache-2.0 with a language-neutral conformance kit, so
            the claims above can be checked against code rather than taken
            on trust:
          </p>
          <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <a href="https://github.com/ciphera-net/tessera" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                ciphera-net/tessera<span className="sr-only"> (opens in a new tab)</span>
              </a>{' '}
              — Rust OPAQUE core and sidecar (RFC 9807 configuration #1: ristretto255-SHA-512, 3DH, Argon2id)
            </li>
            <li>
              <a href="https://github.com/ciphera-net/tessera-go" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                ciphera-net/tessera-go<span className="sr-only"> (opens in a new tab)</span>
              </a>{' '}
              — Go server SDK
            </li>
            <li>
              <a href="https://github.com/ciphera-net/tessera-ts" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                ciphera-net/tessera-ts<span className="sr-only"> (opens in a new tab)</span>
              </a>{' '}
              — browser SDK, published on npm as <span className="font-mono text-sm">@ciphera-net/tessera</span>
            </li>
          </ul>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            On top of the cryptography, the platform ships the unglamorous
            controls that stop real attacks: refresh-token rotation with
            reuse detection, escalating account lockouts, tiered rate
            limiting, security alerts on sensitive account changes, and
            audit logs that store HMAC-hashed IP addresses only and are
            purged after 180 days.
          </p>
        </div>
      </section>

      {/* 02 · Data handling in plain language */}
      <section id="data-handling-in-plain-language" className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">02 · Data handling in plain language</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            What we can see — and what we can&rsquo;t.
          </h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            The short version of{' '}
            <Link href="/privacy" className="text-primary underline">our privacy policy</Link>,
            per product:
          </p>
          <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <strong className="text-foreground">Ciphera ID</strong> — we cannot decrypt your
              vault; there is nothing useful to hand over, subpoena or
              not. Exactly what our servers do hold is itemized in{' '}
              <a href="#the-zero-knowledge-architecture" className="text-primary underline">
                the architecture section
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
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            The full, itemized account of what our servers can and cannot
            see is in{' '}
            <Link href="/blog/what-we-see-about-you-what-we-dont" className="text-primary underline">
              what we see about you — and what we don&rsquo;t
            </Link>.
          </p>
        </div>
      </section>

      {/* 03 · Open source & audit status */}
      <section id="open-source-and-audit-status" className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">03 · Open source &amp; audit status</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            The code is public. The audit is next.
          </h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            Honesty over marketing: <strong className="text-foreground">Tessera has not yet had an
            independent security audit.</strong> What exists today is a
            published{' '}
            <a href="https://github.com/ciphera-net/tessera/blob/main/docs/SELF-AUDIT.md" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              self-audit<span className="sr-only"> (opens in a new tab)</span>
            </a>{' '}
            and{' '}
            <a href="https://github.com/ciphera-net/tessera/blob/main/docs/THREAT-MODEL.md" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              threat model<span className="sr-only"> (opens in a new tab)</span>
            </a>, CI-gated cross-language parity tests, and conformance
            vectors anyone can run. An independent third-party audit is
            planned; this page will state the result when it happens —
            whatever it finds.
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            The open code goes beyond the crypto core: Pulse, our
            analytics engine, is open source under AGPL-3.0 at{' '}
            <a href="https://github.com/ciphera-net/pulse" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              ciphera-net/pulse<span className="sr-only"> (opens in a new tab)</span>
            </a>{' '}
            — the code that runs on your visitors is the code you can
            read.
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            We hold no SOC 2 or ISO 27001 certification. Rather than rent
            a badge, we publish the things a certification would attest
            to — the code, the threat model, the vendor list, the signed
            canary — and let you check them directly.
          </p>
        </div>
      </section>

      {/* 04 · Swiss residency, Belgian jurisdiction */}
      <section id="swiss-residency-belgian-jurisdiction" className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">04 · Swiss residency, Belgian jurisdiction</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Swiss data, Belgian company.
          </h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            Your data lives in Switzerland: all services run on{' '}
            <Link href="/blog/why-swiss-infrastructure-matters-for-data-privacy" className="text-primary underline">
              Swiss infrastructure
            </Link>{' '}
            in Zurich, under the Swiss{' '}
            <Link href="/glossary/fadp" className="text-primary underline">FADP</Link>.
            The company is Belgian: Ciphera BV (KBO/BCE 1013.721.660,
            De Kleetlaan 2, 1831 Diegem) operates from Belgium, under
            GDPR and NIS2 — you can look us up in the Belgian enterprise
            register. Two jurisdictions, both chosen on purpose — strong
            data-protection law where the data sits, EU accountability
            where the company answers for it.
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            The stack is deliberately European: Swiss compute and storage,
            EU payment processing, CDN and DNS from an EU provider, and
            transactional email on our own mail servers — no third-party
            email provider sees account activity. One US company remains
            in the{' '}
            <a href="#subprocessors" className="text-primary underline">vendor list below</a>:
            GitHub, for source-code hosting. No personal user data is
            stored there, and we treat jurisdiction as part of the threat
            model when we pick every new dependency.
          </p>
        </div>
      </section>

      {/* 05 · Warrant canary & transparency reports */}
      <section id="warrant-canary-and-transparency-reports" className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">05 · Warrant canary &amp; transparency reports</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Legal process received, disclosed in full.
          </h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            We publish a biannual report of every legal request we
            receive, and a monthly GPG-signed warrant canary. Both are
            offline-signed and independently verifiable — built to
            outlast silent compulsion, not merely describe it.
          </p>

          <div className="mt-10 max-w-3xl">
            <Link
              href="/trust/report"
              aria-label={report.title}
              className="group -mx-4 block border-y border-border px-4 py-7 transition-colors hover:bg-card"
            >
              <p className="font-mono text-xs tabular-nums text-muted-foreground">
                Report · {report.status} · published {report.publishedEuropean}
              </p>
              <h3 className="mt-2 flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground">
                {report.title}
                <ArrowRightIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground transition-[color,transform] duration-200 group-hover:translate-x-1 group-hover:text-primary"
                />
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Every legal request received, counted and categorised by
                type, jurisdiction, and outcome.
              </p>
            </Link>

            <Link
              href="/trust/canary"
              aria-label="Warrant canary"
              className="group -mx-4 block border-b border-border px-4 py-7 transition-colors hover:bg-card"
            >
              <p className="font-mono text-xs tabular-nums text-muted-foreground">
                Canary · {canary.periodLabel} · next on or before {canary.nextUpdateEuropean}
              </p>
              <h3 className="mt-2 flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground">
                Warrant canary
                <ArrowRightIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground transition-[color,transform] duration-200 group-hover:translate-x-1 group-hover:text-primary"
                />
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Signed offline every month with a key on no production
                system. Miss the date and the silence is the disclosure —
                see the non-update protocol.
              </p>
            </Link>
            <p className="mt-4 px-0 font-mono text-xs text-muted-foreground">
              If the canary goes silent:{' '}
              <Link href="/trust/canary#non-update" className="text-primary hover:underline">
                the non-update protocol
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </p>
          </div>

          <div className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs text-muted-foreground">Verify it yourself, without trusting this page</p>
              <ol className="mt-2 max-w-xl">
                {verifySteps.map((step, i) => (
                  <li key={step} className="flex gap-4 border-t border-border py-4 first:border-t-0 first:pt-6">
                    <span className="font-mono text-xs tabular-nums text-foreground">{`0${i + 1}`}</span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="self-start border border-border bg-card p-6">
              <p className="font-mono text-xs text-muted-foreground">Verify the signature</p>
              <pre tabIndex={0} className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed text-foreground">
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
          </div>
        </div>
      </section>

      {/* 06 · Subprocessors */}
      <section id="subprocessors" className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">06 · Subprocessors</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Five vendors. The whole list.
          </h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            We minimize our reliance on third-party services. The services
            we use, and the data they may process, are listed below — the
            same list published in{' '}
            <Link href="/privacy#third-party-services-and-data-processors" className="text-primary underline">
              our privacy policy
            </Link>, rendered from one source so the two can never drift
            apart:
          </p>
          <p className="mt-4 font-mono text-[10px] text-muted-foreground md:hidden" aria-hidden="true">scroll &rarr;</p>
          <div className="max-w-4xl overflow-x-auto" tabIndex={0} role="region" aria-label="Subprocessor table, scrollable">
            <table className="mt-2 w-full text-sm text-muted-foreground">
              <caption className="sr-only">Subprocessors — service, purpose, data processed, and location</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-4 text-left font-semibold text-foreground">Service</th>
                  <th scope="col" className="py-2 pr-4 text-left font-semibold text-foreground">Purpose</th>
                  <th scope="col" className="py-2 pr-4 text-left font-semibold text-foreground">Data Processed</th>
                  <th scope="col" className="py-2 text-left font-semibold text-foreground">Location</th>
                </tr>
              </thead>
              <tbody>
                {subprocessors.map((s, i) => (
                  <tr key={s.service} className={i < subprocessors.length - 1 ? 'border-b border-border' : ''}>
                    <th scope="row" className="py-2 pr-4 text-left font-medium">{s.service}</th>
                    <td className="py-2 pr-4">{s.purpose}</td>
                    <td className="py-2 pr-4">{s.dataProcessed}</td>
                    <td className="py-2">{s.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            This table is the whole list — there is no vendor we left
            out. Each one is bound by a Data Processing Agreement; full
            sub-processor identities, including registered addresses, are
            available on request at{' '}
            <a href="mailto:privacy@ciphera.net" className="text-primary underline">privacy@ciphera.net</a>.
            We do not use:
          </p>
          <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-6 text-muted-foreground">
            {weDoNotUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 07 · Coordinated disclosure */}
      <section id="coordinated-disclosure" className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">07 · Coordinated disclosure</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to report a vulnerability.
          </h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            If you believe you have found a security vulnerability in any
            Ciphera service or repository, email{' '}
            <a href="mailto:security@ciphera.net" className="text-primary underline">security@ciphera.net</a>.
            A machine-readable version of this policy lives at{' '}
            <a href="/.well-known/security.txt" className="text-primary underline">
              /.well-known/security.txt
            </a>{' '}
            (RFC 9116).
          </p>
          <div className="mt-6 max-w-3xl border border-border bg-card p-6">
            <p className="mb-3 font-mono text-xs text-muted-foreground">A useful report includes</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>The affected service, endpoint, or repository</li>
              <li>Steps to reproduce, or a proof of concept</li>
              <li>The impact you believe it has</li>
              <li>How you would like to be credited, if at all</li>
            </ul>
          </div>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            We do not currently publish a PGP key. If your report is too
            sensitive for plain email, say so in a first message and we
            will arrange a secure channel.
          </p>
        </div>
      </section>

      {/* 08 · Scope & safe harbor */}
      <section id="scope-and-safe-harbor" className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">08 · Scope &amp; safe harbor</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Where to look, and where you stand.
          </h2>
          <div className="mt-8 grid max-w-4xl gap-10 sm:grid-cols-2">
            <div>
              <p className="font-mono text-xs text-muted-foreground">In scope</p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  Any service under <span className="font-mono text-sm">*.ciphera.net</span> — including
                  ciphera.net, id.ciphera.net, pulse.ciphera.net,
                  captcha.ciphera.net, relay.ciphera.net, and cdn.ciphera.net
                </li>
                <li>
                  Our public repositories under{' '}
                  <a href="https://github.com/ciphera-net" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    github.com/ciphera-net<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground">Out of scope</p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
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
            </div>
          </div>
          <p className="mt-10 max-w-3xl border-t border-border pt-6 leading-relaxed text-muted-foreground">
            <span className="font-mono text-xs text-muted-foreground">Safe harbor — </span>
            We will not pursue legal action against researchers who make a
            good-faith effort to follow this policy — that means avoiding
            privacy violations, data destruction, and service disruption,
            accessing only the minimum data needed to demonstrate the
            issue, and giving us reasonable time to remediate before any
            public disclosure.
          </p>
        </div>
      </section>

      {/* 09 · What to expect from us */}
      <section id="what-to-expect-from-us" className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">09 · What to expect from us</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            What happens after you report.
          </h2>
          <ul className="mt-6 max-w-3xl list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Acknowledgement of your report within 3 business days</li>
            <li>An initial assessment within 7 days</li>
            <li>
              Remediation prioritized by severity, and updates as we
              progress
            </li>
            <li>Public credit after the fix ships, if you want it</li>
          </ul>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            We do not currently run a paid bug bounty program. We say so
            here rather than let you find out after you have done the
            work.
          </p>
        </div>
      </section>

      {/* 10 · Our track record */}
      <section id="our-track-record" className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">10 · Our track record</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            We report ours, too.
          </h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            We hold ourselves to the same standard we ask of researchers.
            In July 2026 we privately reported a server-side request
            forgery vulnerability in a widely used open-source service we
            evaluated during product research, with a proposed fix. We are
            coordinating with the maintainer and will publish the details
            once a fix is available — not before.
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            We will link the advisory here the day it publishes.
          </p>
        </div>
      </section>

      {/* 11 · For security reviewers */}
      <section id="for-security-reviewers" className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">11 · For security reviewers</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            The vendor-review package.
          </h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            Running a vendor review? The materials above are the review
            package: open-source cryptographic core with a published
            self-audit and threat model (section 03), the subprocessor
            list (section 06), data-handling summary (section 02), and the
            disclosure policy with response commitments (sections 07–09).
          </p>
          <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              A Data Processing Agreement is available on request at{' '}
              <a href="mailto:privacy@ciphera.net" className="text-primary underline">privacy@ciphera.net</a>
            </li>
            <li>
              Security questionnaires and architecture questions:{' '}
              <a href="mailto:security@ciphera.net" className="text-primary underline">security@ciphera.net</a>
            </li>
            <li>
              When the independent Tessera audit is complete, the report
              will be published here — not summarized, published
            </li>
            <li>
              Environmental footprint, measured by life-cycle assessment
              with no offsets:{' '}
              <Link href="/sustainability" className="text-primary underline">
                /sustainability
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer nav */}
      <section className="border-b border-border">
        <div className="flex items-center justify-between px-6 py-8">
          <Link href="/" className="font-mono text-xs text-primary hover:underline">
            <span aria-hidden="true">&larr; </span>Back to Home
          </Link>
          <Link href="/privacy" className="font-mono text-xs text-primary hover:underline">
            Privacy Policy<span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </section>
    </>
  )
}
