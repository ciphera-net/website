/**
 * Round 8 (mock, 18-10-2026): a glossary term page, three options over any live term.
 *   A: the blog post's form (D37). The sunrise opening (D23) with a link back to the glossary, the term, its definition
 *      as the standfirst and its category; the body in one ~680 px column; the questions as a plain list; "See also" and
 *      "Related terms" as plain link rows.
 *   B: two columns. A plain opening over the text; "Related terms" and "See also" in a rail beside the body on wide
 *      screens (below it on phones).
 *   C: the lean one. A plain opening, the body and the questions; related terms as one line.
 *   (The questions show in every option: they feed the page's FAQPage data, which must match what is visible.)
 * Gone from every option: the filled question panel, the related-term chips, "Common questions" in a bordered box.
 */
import { notFound } from 'next/navigation'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '@/components/overhaul/home/Reveal'
import { SunriseArc } from '@/components/overhaul/system/PageOpening'
import type { GlossaryTerm } from '@/lib/glossary'
import { INDEX, TERM } from './content'
import { loadTerm } from './data'
import { jsonLdHtml } from '@/lib/json-ld'

export type GlossaryTermVariant = 'a' | 'b' | 'c'
export const GLOSSARY_TERM_VARIANTS: GlossaryTermVariant[] = ['a', 'b', 'c']

const READ = 'max-w-[42.5rem]'
const termHref = (_variant: GlossaryTermVariant, slug: string) => `/glossary/${slug}`
const BACK = 'text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground'
const TITLE = 'font-display text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground text-balance sm:text-5xl lg:text-6xl'
// The body is the generator's sanitised HTML (as on the live term page), styled like the blog's reading column.
const BODY = 'prose prose-invert max-w-none sm:prose-lg prose-p:leading-[1.75] prose-a:text-foreground'

function Body({ term }: { term: GlossaryTerm }) {
  return <div data-mock-block="body" data-cms className={BODY} dangerouslySetInnerHTML={{ __html: term.html }} />
}

function Questions({ term }: { term: GlossaryTerm }) {
  if (!term.faq?.length) return null
  return (
    <section data-mock-block="questions" aria-labelledby="questions" className="mt-16 border-t border-border pt-10">
      <h2 id="questions" className="font-display text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
        {TERM.questions}
      </h2>
      <dl data-cms className="mt-6 divide-y divide-border">
        {term.faq.map((f) => (
          <div key={f.q} className="py-6">
            <dt className="text-lg font-medium leading-snug text-foreground">{f.q}</dt>
            <dd className="mt-3 text-base leading-relaxed text-muted-foreground">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function SeeAlso({ term, compact = false }: { term: GlossaryTerm; compact?: boolean }) {
  if (!term.see.length) return null
  return (
    <section data-mock-block="see" className={compact ? '' : 'mt-14 border-t border-border pt-8'}>
      <h2 className="text-sm text-muted-foreground">{TERM.see}</h2>
      <ul className="mt-4 space-y-3">
        {term.see.map((s) => {
          const external = /^https?:\/\//.test(s.href)
          return (
            <li key={s.href}>
              <a data-cms href={s.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="text-base text-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-foreground">
                {s.label}
                {external && <ArrowUpRight aria-hidden="true" className="ml-1.5 inline-block h-3.5 w-3.5 align-[-1px] text-muted-foreground" />}
                {external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Related({ variant, related, compact = false, inline = false }: { variant: GlossaryTermVariant; related: GlossaryTerm[]; compact?: boolean; inline?: boolean }) {
  if (!related.length) return null
  if (inline) {
    return (
      <p data-mock-block="related" className="mt-14 border-t border-border pt-8 text-base leading-relaxed text-muted-foreground">
        <span className="text-foreground">{TERM.related}:</span>{' '}
        {related.map((r, i) => (
          <span key={r.slug}>
            <a data-cms href={termHref(variant, r.slug)} className="underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-foreground hover:decoration-foreground">
              {r.term}
            </a>
            {i < related.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
    )
  }
  return (
    <section data-mock-block="related" className={compact ? 'mt-10' : 'mt-14 border-t border-border pt-8'}>
      <h2 className="text-sm text-muted-foreground">{TERM.related}</h2>
      <ul className="mt-4 space-y-3">
        {related.map((r) => (
          <li key={r.slug}>
            <a data-cms href={termHref(variant, r.slug)} className="text-base text-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-foreground">
              {r.term}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export async function GlossaryTermPage({ variant, slug }: { variant: GlossaryTermVariant; slug: string }) {
  const term = await loadTerm(slug)
  if (!term) notFound()
  const related = (await Promise.all(term.related.map((s) => loadTerm(s)))).filter((t): t is GlossaryTerm => !!t)
  const url = `https://ciphera.net/glossary/${term.slug}`
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': url,
      name: term.term,
      description: term.short,
      url,
      inDefinedTermSet: { '@type': 'DefinedTermSet', '@id': 'https://ciphera.net/glossary', name: INDEX.setName },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
        { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://ciphera.net/glossary' },
        { '@type': 'ListItem', position: 3, name: term.term, item: url },
      ],
    },
    ...(term.faq?.length
      ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: term.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }]
      : []),
  ]
  return (
    <div data-mock-glossary="term" data-mock-variant={variant}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(schema) }} />
      {variant === 'a' ? (
        <div data-mock-block="opening" data-mock-variant="sunrise">
          <section data-mock-opening="c" className="relative isolate overflow-hidden px-6 pb-28 pt-32 text-center sm:px-10 sm:pb-40 sm:pt-36 lg:pb-48 lg:pt-44">
            <SunriseArc />
            <Reveal>
              <p>
                <a href={TERM.back.href} className={BACK}>
                  {TERM.back.label}
                </a>
              </p>
              <h1 data-cms className={`mx-auto mt-6 max-w-4xl ${TITLE}`}>{term.term}</h1>
              <p data-cms className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">{term.short}</p>
              <p className="mt-8 text-sm text-muted-foreground">{term.category}</p>
            </Reveal>
          </section>
        </div>
      ) : (
        <div data-mock-block="opening" data-mock-variant="plain">
          <section data-mock-opening="plain" className="px-6 pb-12 pt-36 sm:px-10 lg:pt-44">
            <div className={variant === 'b' ? 'mx-auto max-w-5xl' : `mx-auto ${READ}`}>
              <p>
                <a href={TERM.back.href} className={BACK}>
                  {TERM.back.label}
                </a>
                <span className="text-sm text-muted-foreground"> · {term.category}</span>
              </p>
              <h1 data-cms className={`mt-6 ${TITLE.replace(' lg:text-6xl', '')}`}>{term.term}</h1>
              <p data-cms className={`mt-7 text-lg leading-relaxed text-foreground ${READ}`}>{term.short}</p>
            </div>
          </section>
        </div>
      )}
      <div className="border-t border-border px-6 pb-20 pt-14 sm:px-10 lg:pb-24 lg:pt-16">
        {variant === 'b' ? (
          <div className="mx-auto grid max-w-5xl gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,42.5rem)_minmax(0,1fr)]">
            <div className="min-w-0">
              <Body term={term} />
              <Questions term={term} />
            </div>
            <aside data-glossary-rail className="lg:sticky lg:top-28 lg:self-start">
              <Related variant={variant} related={related} compact />
              <div className="mt-10">
                <SeeAlso term={term} compact />
              </div>
            </aside>
          </div>
        ) : (
          <div className={`mx-auto w-full ${READ}`}>
            <Body term={term} />
            <Questions term={term} />
            <SeeAlso term={term} />
            <Related variant={variant} related={related} inline={variant === 'c'} />
          </div>
        )}
      </div>
    </div>
  )
}
