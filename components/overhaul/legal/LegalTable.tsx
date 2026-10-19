/**
 * A table on the folded legal pages (D51: "tables as stacked rows on a phone"). Below md every row is a block: its first
 * cell is the row's title and each other cell a line labelled by its column's header, so nothing scrolls sideways (the
 * cookie table was 4,632 px tall on a phone as a scrolling table, plan §5k). From md it is a plain table.
 *
 * `rows` holds data rows (one cell per column) and group rows (`{ group }`), which head the rows after them: a small
 * muted line on a phone, a `<th scope="rowgroup">` in its own `<tbody>` from md. A data row's first cell is its row
 * header (`<th scope="row">`). Both forms are in the HTML and CSS shows one, so each is complete on its own; the
 * caption, read by screen readers only, sits on both.
 */
import { Fragment, type ReactNode } from 'react'

export type LegalTableRow = ReactNode[] | { group: ReactNode }

type Group = { label?: ReactNode; rows: ReactNode[][] }

function grouped(rows: LegalTableRow[]): Group[] {
  const groups: Group[] = []
  for (const row of rows) {
    if (Array.isArray(row)) {
      if (groups.length === 0) groups.push({ rows: [] })
      groups[groups.length - 1].rows.push(row)
    } else {
      groups.push({ label: row.group, rows: [] })
    }
  }
  return groups
}

export function LegalTable({ head, rows, caption }: { head: ReactNode[]; rows: LegalTableRow[]; caption?: string }) {
  const groups = grouped(rows)
  return (
    <div data-legal-table className="mt-6 tabular-nums">
      {/* Below md: each row a block, its first cell the title and the others labelled lines. */}
      <div className="border-t border-border md:hidden">
        {caption && <p className="sr-only">{caption}</p>}
        {groups.map((g, gi) => (
          <Fragment key={gi}>
            {g.label !== undefined && <p className="border-b border-border pb-2 pt-6 text-sm text-muted-foreground">{g.label}</p>}
            {g.rows.map((row, ri) => (
              <div key={ri} className="border-b border-border py-4">
                <p className="text-base font-medium text-foreground">{row[0]}</p>
                <dl className="mt-2 space-y-1.5">
                  {row.slice(1).map((cell, ci) => (
                    <div key={ci} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 text-sm leading-relaxed">
                      <dt className="text-muted-foreground">{head[ci + 1]}</dt>
                      <dd className="text-foreground/90">{cell}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      {/* From md: a table. */}
      <table className="hidden w-full border-collapse text-sm md:table">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" className="border-b border-border pb-3 pr-4 text-left align-bottom font-medium text-muted-foreground last:pr-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        {groups.map((g, gi) => (
          <tbody key={gi}>
            {g.label !== undefined && (
              <tr>
                <th colSpan={head.length} scope="rowgroup" className="border-b border-border pb-2 pt-6 text-left text-sm font-normal text-muted-foreground">
                  {g.label}
                </th>
              </tr>
            )}
            {g.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) =>
                  ci === 0 ? (
                    <th key={ci} scope="row" className="border-b border-border py-3 pr-4 text-left align-top font-medium leading-relaxed text-foreground">
                      {cell}
                    </th>
                  ) : (
                    <td key={ci} className="border-b border-border py-3 pr-4 align-top leading-relaxed text-foreground/85 last:pr-0">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}
