import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon } from '@ciphera-net/facet'
import Breadcrumbs from '../../components/Breadcrumbs'
import { getCurrentCanary, getCurrentReport } from '@/lib/transparency'
import { cdnUrl } from '@/lib/cdn'
import { swissGridBuildingsPhoto } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Transparency — Ciphera',
  description:
    'Ciphera transparency program: biannual reports on legal process received, monthly GPG-signed warrant canary, offline signing key custody. Independently verifiable.',
  alternates: { canonical: 'https://ciphera.net/transparency' },
  openGraph: {
    title: 'Transparency — Ciphera',
    description:
      'Biannual transparency reports and monthly GPG-signed warrant canary. Independently verifiable.',
    url: 'https://ciphera.net/transparency',
    siteName: 'Ciphera',
    images: [
      {
        url: cdnUrl('/ciphera_logo_no_margins.png'),
        width: 1200,
        height: 630,
        alt: 'Ciphera Transparency',
      },
    ],
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Transparency',
  description: 'Ciphera transparency program — biannual reports and monthly warrant canary.',
  url: 'https://ciphera.net/transparency',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Transparency' },
    ],
  },
}

const verifySteps = [
  'Pull the canary plaintext and its detached signature, as raw files, straight from this site.',
  'Import the public key — the same key, every month — and run gpg --verify.',
  'Diff each month against its Archive.org snapshot. Nothing should change after the fact.',
  'If a canary misses its next-update date, the silence is the disclosure. Read the non-update protocol.',
] as const

export default async function TransparencyIndexPage() {
  const canary = await getCurrentCanary()
  const report = await getCurrentReport()
  const fingerprint = canary.text.match(/\b([0-9A-F]{40})\b/)?.[1] ?? null
  const fingerprintSpaced = fingerprint ? fingerprint.replace(/(.{4})(?=.)/g, '$1 ') : null

  // * Live status facts — sourced from the canary/report data, no hardcoded counts.
  const status: { term: string; detail: string; wide?: boolean }[] = [
    { term: 'Current report', detail: report.title },
    { term: 'Report status', detail: `${report.status} · published ${report.publishedEuropean}` },
    { term: 'Current canary', detail: canary.periodLabel },
    { term: 'Next canary', detail: `on or before ${canary.nextUpdateEuropean}` },
    { term: 'Signing key', detail: fingerprint ? `${fingerprint} · offline` : 'offline GPG', wide: true },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Breadcrumbs items={[{ label: 'Transparency' }]} />

      {/* Hero — editorial split: headline + grayscale institutional photo */}
      <section className="border-b border-border">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pr-14">
            <p className="font-mono text-xs text-muted-foreground">Transparency</p>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Legal process received, disclosed in full.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              A biannual report of every legal request we receive, and a monthly GPG-signed warrant
              canary. Both are offline-signed and independently verifiable — built to outlast silent
              compulsion, not merely describe it.
            </p>
          </div>
          <div className="relative min-h-[440px] border-t border-border lg:border-l lg:border-t-0">
            <Image
              src={swissGridBuildingsPhoto}
              alt="Government buildings flying Swiss flags"
              fill
              unoptimized
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover grayscale"
            />
          </div>
        </div>
      </section>

      {/* Current status — two-column ledger, values in foreground */}
      <section className="border-b border-border">
        <div className="px-6 py-12 sm:py-14">
          <p className="font-mono text-xs text-muted-foreground">Current status</p>
          <dl className="mt-6 grid max-w-4xl gap-x-12 gap-y-6 sm:grid-cols-2">
            {status.map((s) => (
              <div key={s.term} className={`border-t border-border pt-3 ${s.wide ? 'sm:col-span-2' : ''}`}>
                <dt className="font-mono text-xs text-muted-foreground">{s.term}</dt>
                <dd className="mt-1.5 break-words font-mono text-sm tabular-nums text-foreground">
                  {s.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 01 · What we publish — composed document rows */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">01 · What we publish</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            A biannual report, and a monthly canary.
          </h2>

          <div className="mt-10 max-w-3xl">
            <Link
              href="/transparency/report"
              className="group -mx-4 block border-y border-border px-4 py-7 transition-colors hover:bg-card"
            >
              <p className="font-mono text-xs tabular-nums text-muted-foreground">
                Report · {report.status} · {report.publishedEuropean}
              </p>
              <h3 className="mt-2 flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground">
                {report.title}
                <ArrowRightIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground transition-[color,transform] duration-200 group-hover:translate-x-1 group-hover:text-primary"
                />
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Every legal request received, counted and categorised by type, jurisdiction, and
                outcome. Gag-ordered process is covered by the canary.
              </p>
            </Link>

            <Link
              href="/transparency/canary"
              className="group -mx-4 block border-b border-border px-4 py-7 transition-colors hover:bg-card"
            >
              <p className="font-mono text-xs tabular-nums text-muted-foreground">
                Canary · {canary.periodLabel} · next {canary.nextUpdateEuropean}
              </p>
              <h3 className="mt-2 flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground">
                Warrant canary
                <ArrowRightIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground transition-[color,transform] duration-200 group-hover:translate-x-1 group-hover:text-primary"
                />
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Signed offline every month with a key on no production system. Miss the date and the
                silence is the disclosure — there is no statement we can be compelled to fake.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 02 · Independent verification */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">02 · Independent verification</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Verify it yourself.
          </h2>

          <div className="mt-10 grid gap-x-16 gap-y-10 lg:grid-cols-2">
            <ol className="max-w-xl">
              {verifySteps.map((step, i) => (
                <li key={i} className="flex gap-4 border-t border-border py-4">
                  <span className="font-mono text-xs tabular-nums text-foreground">{`0${i + 1}`}</span>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step}</p>
                </li>
              ))}
            </ol>

            <div className="self-start border border-border bg-card p-6">
              <p className="font-mono text-xs text-muted-foreground">Verify the signature</p>
              <pre className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed text-foreground">
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
                  <Link
                    key={f.label}
                    href={f.href}
                    className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                  >
                    {f.label}
                    <ArrowRightIcon aria-hidden="true" className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
