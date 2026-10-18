/**
 * Round 8 (mock, 18-10-2026): the glossary index, three options over the live terms (the warrant canary's gone: D6).
 *   A: a section per category. The sunrise opening (D23), a row of jump links, then each category's terms as rows: the
 *      term on the left, its definition on the right (the blog's row grammar, D38).
 *   B: A to Z. A row of letters, then one alphabetical list grouped by letter, each row with its category.
 *   C: a section per category with cards: the terms as a grid of hairline cards (term and definition), no fill.
 * Every term links to the term page in option A.
 */
import { PageOpeningC } from '@/components/overhaul/system/PageOpening'
import { cn } from '@/lib/utils'
import type { GlossaryTerm } from '@/lib/glossary'
import { INDEX } from './content'
import { anchorOf, letterOf, loadCategories, loadTerms } from './data'
import { jsonLdHtml } from '@/lib/json-ld'

export type GlossaryIndexVariant = 'a' | 'b' | 'c'
export const GLOSSARY_INDEX_VARIANTS: GlossaryIndexVariant[] = ['a', 'b', 'c']

const termHref = (slug: string) => `/mock-glossary/term/a/${slug}`
const LINK = 'after:absolute after:inset-0 hover:underline hover:decoration-1 hover:underline-offset-4'

function JumpRow({ items }: { items: { href: string; label: string; n?: number; off?: boolean }[] }) {
  return (
    <nav aria-label={INDEX.nav} data-glossary-jump className="border-t border-border px-6 py-6 sm:px-10">
      <ul className="flex flex-wrap gap-x-8 gap-y-3">
        {items.map((i) => (
          <li key={i.href}>
            {i.off ? (
              <span className="text-sm text-muted-foreground/40">{i.label}</span>
            ) : (
              <a href={i.href} className="inline-flex items-baseline gap-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground">
                {i.label}
                {i.n !== undefined && <span className="tabular-nums">{i.n}</span>}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Row({ term, showCategory = false }: { term: GlossaryTerm; showCategory?: boolean }) {
  return (
    <li data-glossary-row className="relative grid gap-x-10 gap-y-2 border-t border-border py-6 sm:grid-cols-[15rem_minmax(0,1fr)]">
      <div>
        <h3 data-cms className="text-lg font-medium leading-snug text-foreground">
          <a href={termHref(term.slug)} className={LINK}>
            {term.term}
          </a>
        </h3>
        {showCategory && <p className="mt-1 text-sm text-muted-foreground">{term.category}</p>}
      </div>
      <p data-cms className="line-clamp-2 max-w-2xl text-base leading-relaxed text-muted-foreground">{term.short}</p>
    </li>
  )
}

function SectionsA({ terms, categories }: { terms: GlossaryTerm[]; categories: string[] }) {
  return (
    <>
      <JumpRow items={categories.map((c) => ({ href: `#${anchorOf(c)}`, label: c, n: terms.filter((t) => t.category === c).length }))} />
      {categories.map((c) => {
        const list = terms.filter((t) => t.category === c)
        return (
          <section key={c} id={anchorOf(c)} data-mock-block="category" data-count={list.length} className="scroll-mt-24 border-t border-border px-6 py-16 sm:px-10 lg:py-20">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground">{c}</h2>
            <ul className="mt-8 border-b border-border">
              {list.map((t) => (
                <Row key={t.slug} term={t} />
              ))}
            </ul>
          </section>
        )
      })}
    </>
  )
}

function AzB({ terms }: { terms: GlossaryTerm[] }) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const groups = new Map<string, GlossaryTerm[]>()
  for (const t of terms) groups.set(letterOf(t.term), [...(groups.get(letterOf(t.term)) ?? []), t])
  const used = [...groups.keys()].sort()
  return (
    <>
      <JumpRow items={letters.map((l) => ({ href: `#letter-${l.toLowerCase()}`, label: l, off: !groups.has(l) }))} />
      <section data-mock-block="az" className="border-t border-border px-6 pb-24 pt-10 sm:px-10 lg:pb-32">
        {used.map((l) => (
          <div key={l} id={`letter-${l.toLowerCase()}`} data-glossary-letter={l} className="scroll-mt-24 grid gap-x-10 pt-10 sm:grid-cols-[4rem_minmax(0,1fr)]">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground">{l}</h2>
            <ul className="border-b border-border">
              {(groups.get(l) ?? []).map((t) => (
                <Row key={t.slug} term={t} showCategory />
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}

function CardsC({ terms, categories }: { terms: GlossaryTerm[]; categories: string[] }) {
  return (
    <>
      <JumpRow items={categories.map((c) => ({ href: `#${anchorOf(c)}`, label: c, n: terms.filter((t) => t.category === c).length }))} />
      {categories.map((c) => {
        const list = terms.filter((t) => t.category === c)
        return (
          <section key={c} id={anchorOf(c)} data-mock-block="category" data-count={list.length} className="scroll-mt-24 border-t border-border px-6 py-16 sm:px-10 lg:py-20">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground">{c}</h2>
            <ul className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {list.map((t) => (
                <li key={t.slug} data-glossary-row className="relative bg-background p-6">
                  <h3 data-cms className="text-lg font-medium leading-snug text-foreground">
                    <a href={termHref(t.slug)} className={LINK}>
                      {t.term}
                    </a>
                  </h3>
                  <p data-cms className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{t.short}</p>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </>
  )
}

export async function GlossaryIndexPage({ variant }: { variant: GlossaryIndexVariant }) {
  const [terms, categories] = await Promise.all([loadTerms(), loadCategories()])
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': 'https://ciphera.net/glossary',
    name: INDEX.title,
    description: INDEX.lead,
    url: 'https://ciphera.net/glossary',
    hasDefinedTerm: terms.map((t) => ({ '@type': 'DefinedTerm', name: t.term, url: `https://ciphera.net/glossary/${t.slug}` })),
  }
  return (
    <div data-mock-glossary="index" data-mock-variant={variant} data-terms={terms.length}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(schema) }} />
      <div data-mock-block="opening" data-mock-variant="sunrise">
        <PageOpeningC title={INDEX.title} lead={INDEX.lead}>
          <p className={cn('mt-8 text-sm text-muted-foreground tabular-nums')}>{INDEX.count(terms.length)}</p>
        </PageOpeningC>
      </div>
      {variant === 'a' && <SectionsA terms={terms} categories={categories} />}
      {variant === 'b' && <AzB terms={terms} />}
      {variant === 'c' && <CardsC terms={terms} categories={categories} />}
    </div>
  )
}
