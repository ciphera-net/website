/**
 * /sustainability's core (R12; plan §5n): the estimate prints as a receipt from a square device (D60, after dqnamo's
 * Receipt Printer, rebuilt from observation in our design; no licence is stated, so nothing here comes from its code),
 * beside the section's words, with notes in the margin beside the lines they explain (D61).
 *
 * What makes it ours: square corners; the card surface and hairlines, no sheen or shadow; the mark in one ink; orange as
 * one point, the 6 px status dot; Geist with tabular figures (nothing here is code, so nothing is mono); the receipt
 * prints the working, each input with its source under it; the barcode encodes the text printed under it (D64).
 *
 * Server component: every string and figure arrives formatted (receipt.ts, from website-backend's report) and goes to
 * PrinterMotion, the one client island, as finished markup. The server renders the receipt printed.
 *
 * Layout (D61): a two-column grid on a desktop, the heading on the left, the printer in a 460 px column on the right,
 * starting 157 px down, level with the lead under the heading (which also keeps its status line below the fold of a
 * 1440 x 1000 screen, so it prints the first time it scrolls into view). The grid is the notes' size container (100cqw).
 * On a phone it is one column: the heading, the printer, then the notes as a list.
 */
import type { ReactNode } from 'react'
import { CoreFrame, CoreHeader } from './CoreFrame'
import { PrinterMotion } from './PrinterMotion'
import { code128BBars } from './code128'
import { NOTES, PRINTER } from './content'
import type { Printed, ReceiptView, Row as RowView } from './receipt'

const P = PRINTER

/** The Ciphera mark (Public/brand/masters/ciphera-icon-mono-black.svg), one path, drawn in the current text colour. */
function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200.03 1270.71" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M532.05 20.42C574.45 -6.81 625.57 -6.81 667.99 20.42L1161.22 337.09C1212.97 370.31 1212.97 458.38 1161.22 491.6L937.31 635.35L1161.22 779.11C1212.97 812.32 1212.97 900.4 1161.22 933.61L667.99 1250.29C625.57 1277.51 574.45 1277.51 532.05 1250.29L38.79 933.61C12.75 916.89 -0.18 886.25 0 855.72L0 414.99C-0.18 384.45 12.75 353.82 38.79 337.09ZM532.05 462.44L262.71 635.35L532.05 808.27C574.45 835.49 625.57 835.49 667.99 808.27L937.31 635.35L667.99 462.44C625.57 435.21 574.45 435.21 532.05 462.44Z"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------------------------------------------ the device */

function DeviceTop() {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="grid h-8 w-8 place-items-center border border-border bg-background text-foreground">
        <Mark className="h-4 w-auto" />
      </span>
      <span className="text-xs text-muted-foreground">{P.place}</span>
    </div>
  )
}

function DevicePanel({ view }: { view: Printed }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <p className="text-[15px] font-medium text-foreground">{P.panel.title}</p>
        <p className="mt-1 text-sm tabular-nums text-muted-foreground">{view.period}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs text-muted-foreground">{view.panelLabel}</p>
        <p className="mt-1 leading-none text-foreground">
          <span data-figure="panel-total" className="text-2xl font-semibold tabular-nums tracking-[-0.02em]">
            {view.total}
          </span>
          <span className="ml-1.5 text-sm font-medium text-muted-foreground">{view.totalUnit}</span>
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------------- the paper */

/** Paper and its inks: an off-white sheet that reads as paper on the dark page without becoming its brightest light. */
const INK = 'text-[#161616]'
const INK_MUTED = 'text-[#6b6862]'
const RULE = 'border-t border-dashed border-[#b8b4ab]'

/**
 * A note in the page's margin, beside the receipt line it explains (desktop only; a phone lists the notes after the
 * printer). It lives inside its line, so it lines up with it at any receipt height, and is drawn out over the page: its
 * right edge sits on the paper's left edge (the line's own left edge, less the paper's 24 px padding), and it is as wide
 * as the gap from the section's left edge to the paper (100cqw of the layout grid, less the 460 px printer column, plus
 * the 7% of it each side of the paper: 427.8 px). Text on the left, in line with the heading; a hairline leader runs from
 * the text to the paper, level with the line's first row. Hidden while the printer works; it fades in once printed, one
 * note after another.
 */
function MarginNote({ text, index }: { text: string; index: number }) {
  return (
    <span
      data-r12-note={index}
      className="absolute top-1 hidden items-start font-normal opacity-0 transition-opacity ease-apple [transition-duration:400ms] group-data-[stage=complete]/printer:opacity-100 motion-reduce:transition-none lg:flex"
      style={{ right: 'calc(100% + 24px)', width: 'calc(100cqw - 427.8px)', transitionDelay: `${index * 90}ms` }}
    >
      <span data-r12-note-text className="block max-w-[17.5rem] text-sm leading-[22px] text-muted-foreground">
        {text}
      </span>
      <span aria-hidden="true" data-r12-leader className="ml-5 mt-[11px] h-px min-w-6 flex-1 bg-border" />
    </span>
  )
}

/** One printed line: the input and its value, with where the value comes from in small type under the input. */
function Line({ row, notes }: { row: RowView; notes: Printed['notes'] }) {
  const note = row.note === undefined ? undefined : notes.find((n) => n.index === row.note)
  return (
    <div className="relative flex items-baseline justify-between gap-4 py-1.5">
      <dt className={`min-w-0 text-[13px] leading-snug ${INK} ${row.strong ? 'font-semibold' : ''}`}>
        {row.label}
        {row.source && <span className={`mt-0.5 block text-[11px] leading-snug ${INK_MUTED}`}>{row.source}</span>}
        {note && <MarginNote text={note.text} index={note.index} />}
      </dt>
      <dd data-figure={row.key} className={`shrink-0 text-right text-[13px] tabular-nums ${INK} ${row.strong ? 'font-semibold' : ''}`}>
        {row.value}
      </dd>
    </div>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${INK}`}>{title}</h3>
      <dl className="mt-2.5">{children}</dl>
    </div>
  )
}

/**
 * The barcode (D64): Code 128 set B, encoding the text printed under it (proven by decoding with ZXing, plan §5n). The
 * bars are drawn at whole modules in a viewBox with a quiet zone of 10 modules each side; `crispEdges` keeps them sharp.
 * The picture repeats the caption, so it is hidden from screen readers and the caption is read instead.
 */
function Barcode({ text }: { text: string }) {
  const { bars, modules } = code128BBars(text)
  const quiet = 10
  return (
    <div className="flex flex-col items-center">
      <svg
        aria-hidden="true"
        data-r12-barcode={text}
        viewBox={`0 0 ${modules + 2 * quiet} 40`}
        preserveAspectRatio="none"
        className="h-10 w-full max-w-[18.5rem]"
        shapeRendering="crispEdges"
      >
        {bars.map((b) => (
          <rect key={b.x} x={b.x + quiet} y={0} width={b.w} height={40} fill="#161616" />
        ))}
      </svg>
      <span className={`mt-2 text-[10px] tracking-[0.3em] ${INK_MUTED}`}>{text}</span>
    </div>
  )
}

function Paper({ view }: { view: Printed }) {
  return (
    <div data-r12-receipt-paper className={INK}>
      {/* The colour is on the sheet's body and its torn strip, never on this wrapper, or the teeth would show paper.
          pt-8: the slot covers the top 8 px of the sheet at rest. */}
      <div className="bg-[#ebebe8] px-5 pb-6 pt-8 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <Mark className="h-7 w-auto text-[#161616]" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em]">{P.receipt.title}</p>
          <p className={`mt-1 text-xs tabular-nums ${INK_MUTED}`}>{view.period}</p>
        </div>

        {view.groups.map((g, i) => (
          <div key={g.title} className={`${i === 0 ? 'mt-5' : 'mt-4'} pt-5 ${RULE}`}>
            <Group title={g.title}>
              {g.rows.map((row) => (
                <Line key={row.key} row={row} notes={view.notes} />
              ))}
            </Group>
          </div>
        ))}

        <div className={`mt-4 flex items-baseline justify-between gap-4 pt-5 ${RULE}`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em]">{view.totalLabel}</p>
          <p className="leading-none">
            <span data-figure="total" className="text-[28px] font-semibold tabular-nums tracking-[-0.02em]">
              {view.total}
            </span>
            <span className="ml-1.5 text-sm font-medium">{view.totalUnit}</span>
          </p>
        </div>

        <dl className={`mt-5 pt-4 ${RULE}`}>
          {view.meta.map(({ label, value }) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-1">
              <dt className={`text-xs ${INK_MUTED}`}>{label}</dt>
              <dd className="text-xs tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <Barcode text={view.barcodeText} />
        </div>
      </div>
      {/* The torn edge: 12 px teeth cut by a mask, so it is the paper's own colour and nothing is drawn on the page. */}
      <div
        aria-hidden="true"
        data-r12-torn
        className="h-2 bg-[#ebebe8]"
        style={{
          WebkitMask: 'conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 12px 100%',
          mask: 'conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 12px 100%',
        }}
      />
    </div>
  )
}

/** On a phone there is no margin, so the notes follow the printer, each under the name of its line. */
function NotesList({ notes, className }: { notes: Printed['notes']; className?: string }) {
  return (
    <div data-r12-notes-list className={className}>
      <h3 className="text-sm text-muted-foreground">{NOTES.phoneTitle}</h3>
      <dl className="mt-3 border-t border-border">
        {notes.map((n) => (
          <div key={n.index} className="border-b border-border py-4">
            <dt className="text-[15px] font-medium leading-6 text-foreground">{n.name}</dt>
            <dd className="mt-1 text-[15px] leading-6 text-muted-foreground">{n.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/**
 * No report the page can read: the device says so and prints nothing. A static server component, with no motion and no
 * Print again: there is nothing to print.
 */
function Unavailable() {
  return (
    <div data-r12-printer data-stage="unavailable" className="relative mx-auto w-full max-w-[460px]">
      <div data-r12-device className="border border-border bg-card px-5 pb-5 pt-5">
        <DeviceTop />
        <div data-r12-panel className="mt-5 border border-border bg-background px-5 pb-5 pt-4">
          <p className="text-[15px] font-medium text-foreground">{P.panel.title}</p>
          <p role="status" className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
            {P.unavailable}
          </p>
        </div>
        <div aria-hidden="true" data-r12-slot className="mt-5 h-2 border border-border bg-black" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------------ the section */

export function Estimate({ view }: { view: ReceiptView }) {
  const notes = view.state === 'estimate' && view.notes.length > 0
  return (
    <CoreFrame>
      <div data-r12-beside className="grid gap-14 [container-type:inline-size] lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16">
        <div data-r12-left className="contents lg:block">
          <div className="order-1">
            <CoreHeader lead={view.lead} />
          </div>
        </div>
        <div data-r12-right className="order-2 lg:order-none lg:pt-[157px]">
          {view.state === 'unavailable' ? (
            <Unavailable />
          ) : (
            <>
              <PrinterMotion
                top={<DeviceTop />}
                panel={<DevicePanel view={view} />}
                paper={<Paper view={view} />}
                status={P.status}
                again={P.again}
                notes={notes}
              />
              {notes && <NotesList notes={view.notes} className="mt-12 lg:hidden" />}
            </>
          )}
        </div>
      </div>
    </CoreFrame>
  )
}
