/**
 * The processing agreement's rows, shared by the page and its tests: how it applies, the Commission's ten Clauses word
 * for word, then Annexes I to IV. The number column shows the agreement's own numbering (Clause 7, Annex II), and the
 * Sections the Clauses sit in are captions above their first row.
 */
import { LegalTable } from '@/components/overhaul/legal/LegalTable'
import type { LegalSectionData } from '@/components/overhaul/legal/LegalSections'
import { ClauseBody } from '@/components/overhaul/legal/StandardClauses'
import type { DpaSectionId } from '@/components/overhaul/legal/legal-words'
import { H3, P, UL } from '@/components/overhaul/legal/styles'
import { ANNEX_I, ANNEX_II, ANNEX_III, ANNEX_IV, HOW_IT_APPLIES } from '@/lib/dpa/agreement'
import { STANDARD_CLAUSES } from '@/lib/dpa/standard-clauses'

const GROUP: Record<string, string> = {
  I: 'Section I',
  II: 'Section II: Obligations of the Parties',
  III: 'Section III: Final provisions',
}

function TermList({ rows }: { rows: { term: string; text: string }[] }) {
  return (
    <dl className="mt-2">
      {rows.map((r) => (
        <div key={r.term} className="mt-6">
          <dt className="text-base font-medium text-foreground sm:text-[17px]">{r.term}</dt>
          <dd className="mt-1.5 text-base leading-[1.75] text-foreground/85 sm:text-[17px]">{r.text}</dd>
        </div>
      ))}
    </dl>
  )
}

const clauseRows: LegalSectionData<DpaSectionId>[] = STANDARD_CLAUSES.flatMap((section) =>
  section.clauses.map((clause, i) => ({
    id: `clause-${clause.number}` as DpaSectionId,
    label: clause.number,
    title: clause.title,
    group: i === 0 ? GROUP[section.number] : undefined,
    body: <ClauseBody clause={clause} />,
  })),
)

export const DPA_SECTIONS: LegalSectionData<DpaSectionId>[] = [
  {
    id: 'how-this-agreement-applies',
    label: '',
    title: 'How this agreement applies',
    body: (
      <>
        {HOW_IT_APPLIES.map((t) => (
          <p key={t} className={P}>
            {t}
          </p>
        ))}
      </>
    ),
  },
  ...clauseRows,
  {
    id: 'annex-i',
    label: 'I',
    group: 'Annexes',
    title: 'List of parties',
    body: (
      <>
        <h3 className={H3}>Controller</h3>
        <ul className={UL}>
          {ANNEX_I.controller.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h3 className={H3}>Processor</h3>
        <ul className={UL}>
          {ANNEX_I.processor.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </>
    ),
  },
  { id: 'annex-ii', label: 'II', title: 'Description of the processing', body: <TermList rows={ANNEX_II} /> },
  {
    id: 'annex-iii',
    label: 'III',
    title: 'Technical and organisational measures',
    body: <TermList rows={ANNEX_III} />,
  },
  {
    id: 'annex-iv',
    label: 'IV',
    title: 'List of sub-processors',
    body: (
      <>
        <p className={P}>
          The controller authorises these sub-processors (Clause 7.7(a)). We tell you 30 days before we add or replace
          one, and you can object.
        </p>
        <LegalTable
          caption="Sub-processors: service, purpose, data processed, and location"
          head={['Service', 'Purpose', 'Data processed', 'Location']}
          rows={ANNEX_IV.map((s) => [s.service, s.purpose, s.dataProcessed, s.location])}
        />
      </>
    ),
  },
]
