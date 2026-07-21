import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowRightIcon } from '@ciphera-net/facet'
import Breadcrumbs from '@/components/Breadcrumbs'
import { CopyButton } from '@/components/copy-button'
import { getCurrentCanary, listCanaries } from '@/lib/transparency'
import { cdnUrl } from '@/lib/cdn'

export const metadata: Metadata = {
  title: 'Warrant Canary',
  description:
    'Ciphera warrant canary: monthly GPG-signed statement that we have not received secret government compulsion. Offline-signed, independently verifiable.',
  alternates: { canonical: 'https://ciphera.net/trust/canary' },
  openGraph: {
    title: 'Warrant Canary | Ciphera',
    description: 'Monthly GPG-signed warrant canary. Offline-signed. Independently verifiable.',
    url: 'https://ciphera.net/trust/canary',
    siteName: 'Ciphera',
    images: [
      {
        url: cdnUrl('/og/canary.png'),
        width: 1200,
        height: 630,
        alt: 'Ciphera Warrant Canary',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@CipheraNET',
    images: [cdnUrl('/og/canary.png')],
  },
}

const dont = [
  'Ask Ciphera or its representatives why.',
  'Interpret any statement from Ciphera about "technical issues" as explaining the lapse.',
  'Assume the previous canary remains valid past its stated expiration.',
] as const

const doList = [
  'Treat the absence as meaningful.',
  'Recognise that Belgian/EU law may prohibit Ciphera from commenting on the reason for non-update.',
  'Consult your own legal counsel about what the lapse implies for your use of Ciphera services.',
] as const

export default async function WarrantCanaryPage() {
  const canary = await getCurrentCanary()
  const allCanaries = await listCanaries()
  const archive = allCanaries.filter((c) => c.period !== canary.period)
  const fingerprint = canary.text.match(/\b([0-9A-F]{40})\b/)?.[1] ?? null
  const fingerprintSpaced = fingerprint ? fingerprint.replace(/(.{4})(?=.)/g, '$1 ') : null
  const verifyCommand = `gpg --import canary-pubkey.asc\ngpg --verify \\\n  canary-${canary.period}.txt.asc \\\n  canary-${canary.period}.txt`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Ciphera Warrant Canary',
    description: 'Monthly GPG-signed warrant canary.',
    url: 'https://ciphera.net/trust/canary',
    dateModified: canary.publishedISO,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Breadcrumbs items={[{ label: 'Trust', href: '/trust' }, { label: 'Warrant canary' }]} />

      {/* Header */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <Link
            href="/trust"
            className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon aria-hidden="true" className="h-3.5 w-3.5" />
            Trust
          </Link>
          <p className="mt-6 font-mono text-xs text-muted-foreground">Warrant canary · {canary.periodLabel}</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            Warrant canary
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A statement we sign offline each month: that Ciphera has received no secret warrant, gag
            order, or demand for user keys or plaintext. The GPG signature is the proof — not our
            word. If a month’s canary ever fails to appear on time, the silence is the disclosure —
            read the{' '}
            <Link href="#non-update" className="text-primary underline">
              non-update protocol
            </Link>
            .
          </p>

          {/* Status ledger — foreground values */}
          <dl className="mt-10 grid max-w-3xl gap-x-12 gap-y-6 sm:grid-cols-2">
            {[
              { term: 'Period', detail: canary.periodLabel },
              { term: 'Published', detail: canary.publishedEuropean },
              { term: 'Next update', detail: `on or before ${canary.nextUpdateEuropean}` },
              { term: 'Signing key', detail: 'offline GPG' },
              {
                term: 'Status',
                detail: canary.isOverdue
                  ? `Overdue — no canary since ${canary.nextUpdateEuropean}`
                  : 'Current',
                destructive: canary.isOverdue,
              },
            ].map((s) => (
              <div key={s.term} className="border-t border-border pt-3">
                <dt className="font-mono text-xs text-muted-foreground">{s.term}</dt>
                <dd
                  className={`mt-1.5 font-mono text-sm tabular-nums ${
                    s.destructive ? 'text-destructive' : 'text-foreground'
                  }`}
                >
                  {s.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 01 · The signed statement */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">01 · The signed statement</p>
          <h2 className="sr-only">The signed statement</h2>
          <pre className="mt-6 max-w-3xl overflow-x-auto whitespace-pre-wrap break-words border border-border bg-card p-6 font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {canary.text}
          </pre>
        </div>
      </section>

      {/* 02 · Verify the signature */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">02 · Verify the signature</p>
          <h2 className="sr-only">Verify the signature</h2>
          <div className="mt-6 max-w-3xl border border-border bg-card p-6">
            {fingerprintSpaced && (
              <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted-foreground">Signing key fingerprint</p>
                  <p className="mt-1.5 break-words font-mono text-xs tabular-nums text-foreground">
                    {fingerprintSpaced}
                  </p>
                </div>
                <CopyButton value={fingerprint as string} />
              </div>
            )}
            <div className="flex items-start justify-between gap-4 pt-4">
              <pre tabIndex={0} className="min-w-0 overflow-x-auto font-mono text-xs leading-relaxed text-foreground">
                <code>{verifyCommand}</code>
              </pre>
              <CopyButton value={verifyCommand} />
            </div>
            <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
              Expect:{' '}
              <span className="text-foreground">
                Good signature from “Ciphera Warrant Canary &lt;canary@ciphera.net&gt;”
              </span>
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
              {[
                { label: 'Plaintext', href: canary.plaintextUrl },
                { label: 'Signature', href: canary.signatureUrl },
                { label: 'Public key', href: canary.pubkeyUrl },
              ].map((f) => (
                <a
                  key={f.label}
                  href={f.href}
                  aria-label={`${canary.periodLabel} canary — ${f.label.toLowerCase()} file`}
                  className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                >
                  {f.label}
                  <ArrowRightIcon aria-hidden="true" className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 03 · Archive — prior months, same verification path */}
      {archive.length > 0 && (
        <section className="border-b border-border">
          <div className="px-6 py-16 sm:py-20">
            <p className="font-mono text-xs text-muted-foreground">03 · Archive</p>
            <h2 className="sr-only">Archive</h2>
            <ul className="mt-6 max-w-3xl border-t border-border">
              {archive.map((c) => (
                <li
                  key={c.period}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-border py-3 font-mono text-xs"
                >
                  <span className="tabular-nums text-foreground">
                    {c.periodLabel} · published {c.publishedEuropean}
                  </span>
                  <span className="flex flex-wrap gap-x-5 gap-y-1">
                    <a
                      href={c.plaintextUrl}
                      aria-label={`${c.periodLabel} canary — plaintext file`}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Plaintext
                      <ArrowRightIcon aria-hidden="true" className="h-3 w-3" />
                    </a>
                    <a
                      href={c.signatureUrl}
                      aria-label={`${c.periodLabel} canary — detached signature file`}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Signature
                      <ArrowRightIcon aria-hidden="true" className="h-3 w-3" />
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 04 · Non-update protocol */}
      <section id="non-update" className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <p className="font-mono text-xs text-muted-foreground">04 · Non-update protocol</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            If the canary goes silent
          </h2>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            If it is past the date above and a new canary has <strong className="text-foreground">not</strong> been
            published, the lapse itself is the disclosure.
          </p>

          <div className="mt-10 grid max-w-3xl gap-10 sm:grid-cols-2">
            <div>
              <p className="font-mono text-xs text-muted-foreground">Don’t</p>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground marker:text-border">
                {dont.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground">Do</p>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground marker:text-border">
                {doList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-10 max-w-3xl border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
            The signing key exists on no production system. No employee, operator, or automated
            process can produce or sign a canary. Only the founder, holding the offline key, can
            publish — or deliberately withhold — a canary.
          </p>
        </div>
      </section>
    </>
  )
}
