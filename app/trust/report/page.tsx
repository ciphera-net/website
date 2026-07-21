import type { Metadata } from 'next'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { ArrowLeftIcon } from '@ciphera-net/facet'
import Breadcrumbs from '@/components/Breadcrumbs'
import { MDXTable } from '@/components/mdx-table'
import { getCurrentReport, listReports } from '@/lib/transparency'
import { cdnUrl } from '@/lib/cdn'

export const metadata: Metadata = {
  title: 'Transparency Report',
  description:
    'Ciphera transparency report: all law enforcement and legal process received by reporting period. Biannual, interim snapshots available.',
  alternates: { canonical: 'https://ciphera.net/trust/report' },
  openGraph: {
    title: 'Transparency Report | Ciphera',
    description:
      'Ciphera transparency report: all law enforcement and legal process received, by period.',
    url: 'https://ciphera.net/trust/report',
    siteName: 'Ciphera',
    images: [
      {
        url: cdnUrl('/og/report.png'),
        width: 1200,
        height: 630,
        alt: 'Ciphera Transparency Report',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@CipheraNET',
    images: [cdnUrl('/og/report.png')],
  },
}

export default async function TransparencyReportPage() {
  const current = await getCurrentReport()
  const all = await listReports()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: current.title,
    datePublished: current.publishedISO,
    dateModified: current.publishedISO,
    inLanguage: 'en',
    publisher: { '@type': 'Organization', name: 'Ciphera', url: 'https://ciphera.net' },
    url: 'https://ciphera.net/trust/report',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Breadcrumbs items={[{ label: 'Trust', href: '/trust' }, { label: 'Report' }]} />

      {/* Report document */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <Link
            href="/trust"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon aria-hidden="true" className="h-3.5 w-3.5" />
            Trust
          </Link>
          <p className="mt-6 text-xs tabular-nums text-muted-foreground">
            Transparency report · {current.status} · published {current.publishedEuropean}
          </p>

          <article
            className="prose prose-invert mt-8 max-w-3xl
              prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground
              prose-h1:text-4xl prose-h1:leading-[1.05] sm:prose-h1:text-5xl
              prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground
              prose-a:text-primary prose-a:underline
              prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
              prose-table:text-sm prose-th:text-foreground prose-th:border-border prose-td:border-border
              prose-hr:border-border"
          >
            <MDXRemote
              source={current.bodyMarkdown}
              components={{ table: MDXTable }}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </article>
        </div>
      </section>

      {/* Historical reports */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-20">
          <h2 className="sr-only">Historical reports</h2>
          <p className="text-xs text-muted-foreground" aria-hidden="true">Historical reports</p>
          {all.length > 1 ? (
            <ul className="mt-6 max-w-3xl border-t border-border">
              {all.slice(1).map((r) => (
                <li
                  key={r.slug}
                  className="grid gap-1 border-b border-border py-3 text-sm sm:grid-cols-[1fr_auto] sm:gap-6"
                >
                  <span className="text-foreground">{r.title}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {r.publishedEuropean} · {r.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-xs text-muted-foreground">
              First report — history accumulates here.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
