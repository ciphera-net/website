import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentCanary, getCurrentReport } from '@/lib/transparency'
import { cdnUrl } from '@/lib/cdn'

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

export default async function TransparencyIndexPage() {
  const canary = await getCurrentCanary()
  const report = await getCurrentReport()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24 max-w-4xl mx-auto">
          <p className="font-mono text-xs text-muted-foreground">01 · Transparency</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-6">
            What we disclose, and what we commit to never hide.
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-12">
            Ciphera publishes a biannual transparency report of all legal process received, and a
            monthly GPG-signed warrant canary — independently verifiable, offline-signed, and
            structurally resistant to silent compulsion.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/transparency/report"
              className="border border-border bg-card p-6 hover:bg-muted transition-colors block"
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Current transparency report
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                {report.title}. {report.status === 'interim' ? 'Interim snapshot' : 'Final'},
                published {report.publishedEuropean}.
              </p>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline">Read the report →</span>
            </Link>

            <Link
              href="/transparency/canary"
              className="border border-border bg-card p-6 hover:bg-muted transition-colors block"
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">Warrant canary</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Current period: {canary.period}. Published {canary.publishedEuropean}. Next update
                on or before {canary.nextUpdateEuropean}.
              </p>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline">View and verify →</span>
            </Link>
          </div>

          <div className="mt-16 border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">How to independently verify</h2>
            <ol className="text-muted-foreground text-sm space-y-2 list-decimal list-inside">
              <li>
                Download the canary plaintext and signature as raw files directly from this site.
              </li>
              <li>
                Import our public key (committed to the ciphera-website Git repo) and verify the
                detached signature with <code className="text-primary">gpg --verify</code>.
              </li>
              <li>
                Diff each month against prior Archive.org snapshots to confirm no retroactive
                changes.
              </li>
              <li>
                If a canary is not refreshed by its stated next-update date, treat the silence as
                the signal — see the{' '}
                <Link href="/transparency/canary" className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline">
                  canary page
                </Link>{' '}
                for the non-update protocol.
              </li>
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
