/**
 * The receipt, read from website-backend's report and formatted on the server. The page computes nothing: the backend
 * owns the arithmetic (fallback.go, `Working`); this file only rounds and formats it. Three states:
 * - estimate: our own estimate, the report's `working`, each input with its source and the notes in the margin;
 * - host: our host's life-cycle report returned a month, so the receipt lists its four phases and makes no notes;
 * - unavailable: no report, or one this page cannot read honestly (a computed report without its working, a number
 *   that is not finite). The printer says so and prints nothing; it never shows an invented figure.
 */
import type { ImpactReport } from '@/components/sustainability/types'
import { CORE, NOTES, PRINTER } from './content'

export type Row = { key: string; label: string; value: string; source?: string; strong?: boolean; note?: number }
export type Group = { title: string; rows: Row[] }
export type Note = { index: number; name: string; text: string }
export type Printed = {
  state: 'estimate' | 'host'
  lead: string
  period: string
  panelLabel: string
  total: string
  totalUnit: string
  groups: Group[]
  totalLabel: string
  meta: { label: string; value: string }[]
  /** The text under the barcode, which the bars encode (D64): "CO2E 2026 10". */
  barcodeText: string
  /** In reading order; each sits beside the row whose `note` is its index. */
  notes: Note[]
}
export type ReceiptView = Printed | { state: 'unavailable'; lead: string }

const R = PRINTER.receipt.rows
const UNIT = 'g CO₂e'

const nf = (n: number, digits = 0) => n.toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits })

/**
 * Whole grams that add up: the largest-remainder method, so the parts a receipt lists always sum to the total it prints.
 * The total is the true total rounded; a part may sit a gram from its own rounding (843.7 g prints as 843 when that is
 * what it takes for 843 + 1,115 to be the 1,958 the total says).
 */
export function wholeGramsThatAddUp(partsKg: number[]): { parts: number[]; total: number } {
  const grams = partsKg.map((kg) => kg * 1000)
  const total = Math.round(grams.reduce((s, g) => s + g, 0))
  const parts = grams.map(Math.floor)
  let short = total - parts.reduce((s, g) => s + g, 0)
  const byRemainder = grams.map((g, i) => ({ i, r: g - Math.floor(g) })).sort((x, y) => y.r - x.r)
  for (const { i } of byRemainder) {
    if (short <= 0) break
    parts[i] += 1
    short -= 1
  }
  return { parts, total }
}

/** The report's timestamp as the receipt prints it, in UTC: "19 Oct 2026, 20:30 UTC". Empty when unparseable. */
export function printedTime(iso: string): string {
  // Cut to milliseconds: the backend sends nanoseconds, which not every engine parses.
  const d = new Date(iso.replace(/(\.\d{3})\d+/, '$1'))
  if (Number.isNaN(d.getTime())) return ''
  const s = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(d)
  return `${s} UTC`
}

/** The barcode's text, from the period's first day (2026-10-01 gives "CO2E 2026 10"). */
function barcodeText(start: string): string {
  const [y, m] = start.split('-')
  return `CO2E ${y} ${m}`
}

const finite = (...xs: number[]) => xs.every((x) => typeof x === 'number' && Number.isFinite(x))

export function receiptFrom(report: ImpactReport | null): ReceiptView {
  const unavailable: ReceiptView = { state: 'unavailable', lead: CORE.lead }
  if (!report || !report.period) return unavailable

  const meta = (method: string) => [
    { label: PRINTER.receipt.meta.period, value: report.period.label },
    { label: PRINTER.receipt.meta.method, value: method },
    { label: PRINTER.receipt.meta.updated, value: printedTime(report.lastUpdated) },
  ]

  if (report.source === 'computed-fallback') {
    const w = report.working
    if (
      !w ||
      !finite(w.servers, w.vcpu, w.hours, w.wattsPerVcpu, w.pue, w.energyKWh, w.gridGCO2ePerKWh, w.gridYear, w.useKg) ||
      !finite(w.embodiedKgPerVcpu, w.lifetimeYears, w.lifetimeHours, w.embodiedKg, w.totalKg, w.embodiedShare) ||
      w.totalKg <= 0
    ) {
      return unavailable
    }
    const grams = wholeGramsThatAddUp([w.useKg, w.embodiedKg])
    const [useG, embodiedG] = grams.parts
    const month = report.period.label.split(' ')[0]
    const days = Math.round(w.hours / 24)

    const notes: Note[] = [
      { index: 0, name: R.servers.label, text: NOTES.servers },
      { index: 1, name: R.watts.label, text: NOTES.watts },
    ]
    // D63: the grid note speaks of 2025; another year's figure prints without it.
    const gridNote = w.gridYear === NOTES.gridYear
    if (gridNote) notes.push({ index: 2, name: R.grid.label, text: NOTES.grid })
    // D63: the share is computed; the comparison prints only while it is true.
    const embodiedNote = [NOTES.embodiedShare(Math.round(w.embodiedShare * 100)), w.embodiedKg > w.useKg ? NOTES.embodiedOutweighs : '']
      .filter(Boolean)
      .join(' ')
    notes.push({ index: 3, name: PRINTER.receipt.groups.embodied, text: embodiedNote })

    return {
      state: 'estimate',
      lead: CORE.lead,
      period: report.period.label,
      panelLabel: PRINTER.panel.estimated,
      total: nf(grams.total),
      totalUnit: UNIT,
      totalLabel: PRINTER.receipt.total,
      groups: [
        {
          title: PRINTER.receipt.groups.electricity,
          rows: [
            { key: 'servers', label: R.servers.label, value: nf(w.servers), source: R.servers.source, note: 0 },
            { key: 'vcpu', label: R.vcpu.label, value: nf(w.vcpu), source: R.vcpu.source },
            { key: 'hours', label: R.hours.label, value: nf(w.hours), source: R.hours.source(days, month) },
            { key: 'watts', label: R.watts.label, value: `${nf(w.wattsPerVcpu, 1)} W`, source: R.watts.source, note: 1 },
            { key: 'pue', label: R.pue.label, value: nf(w.pue, 1), source: R.pue.source },
            { key: 'energy', label: R.energy.label, value: `${nf(w.energyKWh, 3)} kWh`, source: R.energy.source },
            {
              key: 'grid',
              label: R.grid.label,
              value: `${nf(w.gridGCO2ePerKWh)} g CO₂e/kWh`,
              source: R.grid.source(w.gridYear),
              note: gridNote ? 2 : undefined,
            },
            { key: 'use', label: PRINTER.receipt.subtotal, value: `${nf(useG)} g`, strong: true },
          ],
        },
        {
          title: PRINTER.receipt.groups.embodied,
          rows: [
            { key: 'embodiedPerVcpu', label: R.embodiedPerVcpu.label, value: `${nf(w.embodiedKgPerVcpu, 1)} kg CO₂e`, source: R.embodiedPerVcpu.source },
            { key: 'lifetime', label: R.lifetime.label, value: `${nf(w.lifetimeYears)} years`, source: R.lifetime.source },
            { key: 'share', label: R.share.label, value: `${nf(w.hours)} of ${nf(w.lifetimeHours)} h`, source: R.share.source },
            { key: 'embodied', label: PRINTER.receipt.subtotal, value: `${nf(embodiedG)} g`, strong: true, note: 3 },
          ],
        },
      ],
      meta: meta(PRINTER.receipt.meta.methodValue),
      barcodeText: barcodeText(report.period.start),
      notes,
    }
  }

  if (report.source === 'exoscale-api') {
    const L = report.lifecycle
    if (!L || !finite(L.use?.amount, L.manufacturing?.amount, L.transport?.amount, L.endOfLife?.amount)) return unavailable
    const grams = wholeGramsThatAddUp([L.use.amount, L.manufacturing.amount, L.transport.amount, L.endOfLife.amount])
    if (grams.total <= 0) return unavailable
    const [useG, mfgG, trnG, eolG] = grams.parts
    return {
      state: 'host',
      lead: CORE.hostLead,
      period: report.period.label,
      panelLabel: PRINTER.panel.host,
      total: nf(grams.total),
      totalUnit: UNIT,
      totalLabel: PRINTER.receipt.hostTotal,
      groups: [
        {
          title: PRINTER.receipt.groups.electricity,
          rows: [{ key: 'use', label: R.hostUse.label, value: `${nf(useG)} g`, source: R.hostUse.source, strong: true }],
        },
        {
          title: PRINTER.receipt.groups.embodied,
          rows: [
            { key: 'manufacturing', label: R.hostManufacturing.label, value: `${nf(mfgG)} g`, source: R.hostManufacturing.source },
            { key: 'transport', label: R.hostTransport.label, value: `${nf(trnG)} g`, source: R.hostTransport.source },
            { key: 'endOfLife', label: R.hostEndOfLife.label, value: `${nf(eolG)} g`, source: R.hostEndOfLife.source },
            { key: 'embodied', label: PRINTER.receipt.subtotal, value: `${nf(mfgG + trnG + eolG)} g`, strong: true },
          ],
        },
      ],
      meta: meta(PRINTER.receipt.meta.hostMethodValue),
      barcodeText: barcodeText(report.period.start),
      notes: [],
    }
  }

  return unavailable
}
