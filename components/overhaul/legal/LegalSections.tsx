/**
 * The legal pages' body as folded sections (D51, 18-10-2026: round R9's option C, mock 32d096a). Under the sunrise
 * opening (D23): the number of sections and Open all, then every section as a native <details> whose row shows its
 * number, its title and a one-line summary (legal-words.ts); the summary hides while the section is open. A section's
 * id is its anchor, so /privacy#your-rights-under-gdpr-and-fadp (the homepage links it) lands on it and OpenAll opens it.
 *
 * The title is the section's <h2>, inside its <summary> (a summary may hold one heading), so the page keeps its outline.
 * The summary is a grid so the heading and the summary line stay direct children of <summary>: a <span> may not hold an
 * <h2>. Numbers are the clause numbers the text cites ("see Section 14"), in tabular figures, never mono.
 */
import { Fragment, type ReactNode } from 'react'
import Link from 'next/link'
import { CaretDown } from '@phosphor-icons/react/dist/ssr'
import { OpenAll } from './OpenAll'

/**
 * `label` replaces the position in the number column where the text numbers itself (the processing agreement's Clause 7,
 * Annex II); an empty label leaves the column blank. `group` sets a caption above the row, for a document whose own
 * structure has parts above its sections (the agreement's Sections I to III). Both are optional: the policy and the
 * terms number by position, as before.
 */
export type LegalSectionData<Id extends string> = { id: Id; title: string; body: ReactNode; label?: string; group?: string }

const READ = 'max-w-[42.5rem]' // the reading measure: 680 px, as the blog post's
const PAGER = 'text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground'

function LegalSection({ n, id, title, summary, children }: { n: number | string; id: string; title: string; summary: string; children: ReactNode }) {
  return (
    <details id={id} data-legal-section={n} className="group scroll-mt-28 border-b border-border">
      <summary className="grid cursor-pointer list-none grid-cols-[1.75rem_minmax(0,1fr)_1rem] gap-x-4 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
        <span className="col-start-1 row-start-1 pt-1 text-sm tabular-nums text-muted-foreground">{n}</span>
        <h2 className="col-start-2 row-start-1 text-xl font-semibold tracking-[-0.02em] text-foreground">{title}</h2>
        <span className="col-start-2 row-start-2 mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground group-open:hidden">
          {summary}
        </span>
        <CaretDown
          aria-hidden="true"
          className="col-start-3 row-start-1 mt-1.5 h-4 w-4 text-muted-foreground transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div className="pb-10 pl-11 [&_strong]:font-medium [&_strong]:text-foreground">{children}</div>
    </details>
  )
}

export function LegalSections<Id extends string>({
  sections,
  summaries,
  next,
}: {
  sections: LegalSectionData<Id>[]
  summaries: Record<Id, string>
  /** The other legal page, linked after the last section as before. */
  next: { href: string; label: string }
}) {
  return (
    <div className="border-t border-border px-6 pb-20 pt-14 sm:px-10 lg:pb-24 lg:pt-20">
      <div className={`mx-auto w-full ${READ}`}>
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            <span className="tabular-nums">{sections.length}</span> sections
          </p>
          <OpenAll />
        </div>
        <div className="mt-4 border-t border-border">
          {sections.map((s, i) => (
            <Fragment key={s.id}>
              {s.group ? <p className="pb-2 pt-10 text-sm text-muted-foreground">{s.group}</p> : null}
              <LegalSection n={s.label ?? i + 1} id={s.id} title={s.title} summary={summaries[s.id]}>
                {s.body}
              </LegalSection>
            </Fragment>
          ))}
        </div>
        <div className="mt-12 flex items-center justify-between gap-6">
          <Link href="/" className={PAGER}>
            &larr; Back to Home
          </Link>
          {/* One string, as before: written as `{label} &rarr;` the compiler drops the space before the arrow. */}
          <Link href={next.href} className={PAGER}>
            {`${next.label} →`}
          </Link>
        </div>
      </div>
    </div>
  )
}
