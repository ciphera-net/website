import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRightIcon } from '@ciphera-net/facet'
import { cdnUrl } from '@/lib/cdn'
import { getTerm, glossaryTerms } from '@/lib/glossary'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return glossaryTerms.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const term = getTerm(slug)
  if (!term) return {}
  return {
    title: `What is ${term.term}? - Glossary`,
    description: term.short,
    alternates: {
      canonical: `https://ciphera.net/glossary/${term.slug}`,
    },
    openGraph: {
      title: `What is ${term.term}? | Ciphera`,
      description: term.short,
      url: `https://ciphera.net/glossary/${term.slug}`,
      siteName: 'Ciphera',
      locale: 'en_US',
      type: 'article',
      images: [{ url: cdnUrl('/og-homepage.png'), width: 1200, height: 630, alt: 'Ciphera' }],
    },
  }
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params
  const term = getTerm(slug)
  if (!term) notFound()

  const related = term.related
    .map((s) => getTerm(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))

  // * DefinedTerm + breadcrumbs; FAQPage only when the entry carries Q&A.
  const schema: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': `https://ciphera.net/glossary/${term.slug}`,
      name: term.term,
      description: term.short,
      url: `https://ciphera.net/glossary/${term.slug}`,
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        '@id': 'https://ciphera.net/glossary',
        name: 'Ciphera Privacy & Infrastructure Glossary',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Glossary', item: 'https://ciphera.net/glossary' },
        { '@type': 'ListItem', position: 2, name: term.term, item: `https://ciphera.net/glossary/${term.slug}` },
      ],
    },
  ]
  if (term.faq && term.faq.length > 0) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: term.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <Link
            href="/glossary"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; All terms
          </Link>

          <p className="mt-8 text-xs text-muted-foreground">
            Glossary · {term.category}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            {term.term}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground">{term.short}</p>

          <div className="mt-8 space-y-5">
            {term.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>

          {term.faq && term.faq.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Common questions
              </h2>
              <dl className="mt-6 divide-y divide-border border border-border">
                {term.faq.map((f) => (
                  <div key={f.q} className="bg-card p-5">
                    <dt className="text-sm font-semibold text-foreground">{f.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {term.see && term.see.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xs text-muted-foreground">See also</h2>
              <ul className="mt-4 space-y-2">
                {term.see.map((s) => {
                  const external = s.href.startsWith('http')
                  return (
                    <li key={s.href}>
                      {external ? (
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
                        >
                          {s.label}
                          <ArrowUpRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <Link
                          href={s.href}
                          className="inline-flex items-center gap-1 text-sm text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
                        >
                          {s.label}
                          <ArrowUpRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xs text-muted-foreground">Related terms</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/glossary/${r.slug}`}
                    className="border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  >
                    {r.term}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  )
}
