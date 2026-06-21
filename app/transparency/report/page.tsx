import type { Metadata } from 'next'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getCurrentReport, listReports } from '@/lib/transparency'
import { cdnUrl } from '@/lib/cdn'

export const metadata: Metadata = {
  title: 'Transparency Report — Ciphera',
  description:
    'Ciphera transparency report: all law enforcement and legal process received by reporting period. Biannual, interim snapshots available.',
  alternates: { canonical: 'https://ciphera.net/transparency/report' },
  openGraph: {
    title: 'Transparency Report — Ciphera',
    description:
      'Ciphera transparency report: all law enforcement and legal process received, by period.',
    url: 'https://ciphera.net/transparency/report',
    siteName: 'Ciphera',
    images: [
      {
        url: cdnUrl('/ciphera_logo_no_margins.png'),
        width: 1200,
        height: 630,
        alt: 'Ciphera Transparency Report',
      },
    ],
    type: 'article',
  },
  twitter: { card: 'summary_large_image' },
}

export default async function TransparencyReportPage() {
  const current = await getCurrentReport()
  const all = await listReports()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: current.title,
    datePublished: current.publishedISO,
    publisher: { '@type': 'Organization', name: 'Ciphera', url: 'https://ciphera.net' },
    url: 'https://ciphera.net/transparency/report',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="border-b border-border section-padding pt-32">
        <div className="section-container max-w-3xl mx-auto px-6">
          <div className="mb-8 text-sm text-muted-foreground">
            <Link href="/transparency" className="text-primary hover:underline">
              ← Transparency
            </Link>
          </div>
          <article className="prose prose-invert max-w-none prose-headings:text-foreground prose-a:text-primary prose-code:text-primary">
            <MDXRemote
              source={current.bodyMarkdown}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </article>

          {all.length > 1 && (
            <div className="mt-16 border-t border-border pt-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Historical reports</h2>
              <ul className="space-y-2 text-muted-foreground text-sm">
                {all.slice(1).map((r) => (
                  <li key={r.slug}>
                    {r.title} — published {r.publishedEuropean} ({r.status})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
