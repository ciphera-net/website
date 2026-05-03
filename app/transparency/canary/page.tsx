import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentCanary } from '@/lib/transparency'
import { cdnUrl } from '@/lib/cdn'

export const metadata: Metadata = {
  title: 'Warrant Canary — Ciphera',
  description:
    'Ciphera warrant canary: monthly GPG-signed statement that we have not received secret government compulsion. Offline-signed, independently verifiable.',
  alternates: { canonical: 'https://ciphera.net/transparency/canary' },
  openGraph: {
    title: 'Warrant Canary — Ciphera',
    description:
      'Monthly GPG-signed warrant canary. Offline-signed. Independently verifiable.',
    url: 'https://ciphera.net/transparency/canary',
    siteName: 'Ciphera',
    images: [
      {
        url: cdnUrl('/ciphera_logo_no_margins.png'),
        width: 1200,
        height: 630,
        alt: 'Ciphera Warrant Canary',
      },
    ],
    type: 'article',
  },
  twitter: { card: 'summary_large_image' },
}

export default async function WarrantCanaryPage() {
  const canary = await getCurrentCanary()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Ciphera Warrant Canary',
    description: 'Monthly GPG-signed warrant canary.',
    url: 'https://ciphera.net/transparency/canary',
    dateModified: canary.publishedISO,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="section-padding pt-32">
        <div className="section-container max-w-3xl mx-auto px-6">
          <div className="mb-8 text-sm text-neutral-500">
            <Link href="/transparency" className="text-brand-orange hover:underline">
              ← Transparency
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Warrant canary</h1>
          <p className="text-neutral-400 mb-2">
            Current period: <strong className="text-white">{canary.periodLabel}</strong>. Published{' '}
            {canary.publishedEuropean}. Next update on or before {canary.nextUpdateEuropean}.
          </p>
          <p className="text-neutral-400 mb-8 text-sm">
            If the date above has passed,{' '}
            <Link href="#non-update" className="text-brand-orange hover:underline">
              read the non-update protocol
            </Link>{' '}
            before drawing conclusions.
          </p>

          <pre className="whitespace-pre-wrap break-words text-xs sm:text-sm bg-neutral-950/80 border border-white/[0.08] rounded-xl p-6 text-neutral-200 overflow-x-auto">
            {canary.text}
          </pre>

          <div className="mt-8 rounded-xl border border-white/[0.08] bg-neutral-900/80 p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Verify the signature</h2>
            <ol className="text-neutral-400 text-sm space-y-2 list-decimal list-inside">
              <li>
                Download{' '}
                <a className="text-brand-orange hover:underline" href={canary.plaintextUrl}>
                  the plaintext canary
                </a>
                .
              </li>
              <li>
                Download{' '}
                <a className="text-brand-orange hover:underline" href={canary.signatureUrl}>
                  the detached GPG signature
                </a>
                .
              </li>
              <li>
                Download{' '}
                <a className="text-brand-orange hover:underline" href={canary.pubkeyUrl}>
                  our public key
                </a>{' '}
                and import it:{' '}
                <code className="text-brand-orange">gpg --import canary-pubkey.asc</code>
              </li>
              <li>
                Verify:{' '}
                <code className="text-brand-orange">
                  gpg --verify canary-{canary.period}.txt.asc canary-{canary.period}.txt
                </code>
              </li>
              <li>
                Expect: <em>Good signature from "Ciphera Warrant Canary &lt;canary@ciphera.net&gt;"</em>
              </li>
            </ol>
          </div>

          <div
            id="non-update"
            className="mt-8 rounded-xl border border-red-500/30 bg-red-950/20 p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-3">Non-update protocol</h2>
            <p className="text-neutral-300 text-sm mb-3">
              If it is past the date above and a new canary has <strong>not</strong> been
              published:
            </p>
            <p className="text-neutral-300 text-sm mb-2">
              <strong>Do not:</strong>
            </p>
            <ul className="text-neutral-400 text-sm space-y-1 list-disc list-inside mb-3">
              <li>Ask Ciphera or its representatives why.</li>
              <li>
                Interpret any statement from Ciphera about "technical issues" as explaining the
                lapse.
              </li>
              <li>Assume the previous canary remains valid past its stated expiration.</li>
            </ul>
            <p className="text-neutral-300 text-sm mb-2">
              <strong>Do:</strong>
            </p>
            <ul className="text-neutral-400 text-sm space-y-1 list-disc list-inside mb-3">
              <li>Treat the absence as meaningful.</li>
              <li>
                Recognize that Belgian/EU law may prohibit Ciphera from commenting on the reason
                for non-update.
              </li>
              <li>
                Consult your own legal counsel about what the lapse implies for your use of Ciphera
                services.
              </li>
            </ul>
            <p className="text-neutral-500 text-xs">
              The signing key exists on no production system. No employee, operator, or automated
              process can produce or sign a canary. Only the founder, holding the offline key, can
              publish — or deliberately withhold — a canary.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
