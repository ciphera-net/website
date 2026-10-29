/**
 * The Commission's standard contractual clauses as the processing agreement prints them (lib/dpa/standard-clauses.ts):
 * a lettered point hangs its label in a narrow column, a numbered item hangs inside its point, and a numbered sub-clause
 * (7.1 Instructions) is a sub-heading. Shared by every layout of /dpa, so the words render the same wherever they sit.
 */
import type { ScClause, ScPoint, ScSub } from '@/lib/dpa/standard-clauses'
import { P } from './styles'

const HANG = 'grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2'
const LABEL = 'tabular-nums text-muted-foreground'

function Point({ point }: { point: ScPoint }) {
  if (!point.label) return <p className={P}>{point.text}</p>
  return (
    <div className={`${P} ${HANG}`}>
      <span className={LABEL}>({point.label})</span>
      <div>
        <p>{point.text}</p>
        {point.items?.map((it) => (
          <div key={it.label} className={`mt-3 ${HANG}`}>
            <span className={LABEL}>({it.label})</span>
            <p>{it.text}</p>
          </div>
        ))}
        {point.after ? <p className="mt-3">{point.after}</p> : null}
      </div>
    </div>
  )
}

function Sub({ sub }: { sub: ScSub }) {
  return (
    <div className="mt-8">
      <h4 className="text-base font-semibold text-foreground sm:text-[17px]">
        <span className="tabular-nums">{sub.number}</span> {sub.title}
      </h4>
      {sub.blocks.map((b, i) => (
        <Point key={i} point={b} />
      ))}
    </div>
  )
}

export function ClauseBody({ clause }: { clause: ScClause }) {
  if (clause.notUsed) {
    return <p className={P}>This optional clause is not used: every customer accepts the agreement through our Terms of Service.</p>
  }
  return (
    <>
      {clause.blocks.map((b, i) => (b.kind === 'sub' ? <Sub key={i} sub={b} /> : <Point key={i} point={b} />))}
    </>
  )
}
