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
  /**
   * 🔴 THE TITLE AND DESCRIPTION COME FROM THE CMS, NOT FROM A TEMPLATE.
   *
   * This route built its title as `What is ${term.term}?` against data that is sentence
   * case by contract — so Google was served `What is Blind index?`, `What is Bounce
   * rate?` and `What is Data controller?` on 29 of the 53. A template cannot fix it: a
   * countable noun takes an article, an uncountable one takes none, a plural takes
   * "are", and an acronym is unchanged. Each title is now written out in WordPress.
   *
   * 🔴 AND `description` IS NO LONGER `term.short`. That field is the visible lede and
   * the DefinedTerm description, written LONG on purpose — all 53 ran 186–262 characters
   * against Google's ~155, so every page was truncated. The meta description is its own
   * field, asserted <=160 by the generator, and there is NO fallback between them: a
   * fallback would restore the defect on every untouched term and look fixed (§38.11).
   *
   * ⚠️ `title.absolute` — the root layout's template appends " | Ciphera", and the CMS
   * value already carries the full string it should render.
   */
  return {
    title: { absolute: term.seoTitle },
    description: term.seoDescription,
    alternates: {
      canonical: term.canonical,
    },
    robots:
      term.noindex || term.nofollow ? { index: !term.noindex, follow: !term.nofollow } : undefined,
    openGraph: {
      title: term.seoTitle,
      description: term.seoDescription,
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

          {/*
            🔑 THE BODY IS CMS HTML NOW, AND THE PIXELS ARE DELIBERATELY IDENTICAL.
            It rendered `term.paragraphs.map(...)` as styled <p> elements; the child
            selectors below reproduce exactly that, so migrating the content changed no
            page's appearance. Adopting the blog's `prose` block would have been a visual
            change to 53 pages riding along on a content migration.
            ⚠️ WordPress emits <p class="wp-block-paragraph">, which `[&>p]` matches. The
            list and anchor rules are new only in the sense that the previous shape — a
            plain string array — could not express them at all.
          */}
          <div
            className="mt-8 space-y-5 [&>p]:text-base [&>p]:leading-relaxed [&>p]:text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-semibold [&_strong]:text-foreground [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:text-base [&>ul]:leading-relaxed [&>ul]:text-muted-foreground [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:text-base [&>ol]:leading-relaxed [&>ol]:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: term.html }}
          />

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

          {term.see.length > 0 && (
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
