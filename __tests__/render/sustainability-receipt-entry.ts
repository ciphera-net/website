/**
 * /sustainability's receipt (components/overhaul/sustainability/receipt.ts) run for real: against our fleet after the move
 * to Infomaniak (28-10-2026: 7 servers, 22 vCPU), against the 19-10-2026 fleet (21 vCPU), and against every report the page
 * must not print as a figure. `node <bundle>` — no arguments, prints one JSON object for sustainability-receipt.render.mjs.
 *
 * The fixture's arithmetic is the backend's (website-backend fallback.go): these four constants and four formulas give the
 * 19-10-2026 production report of 21 vCPU to the last digit, which the test checks. The page itself computes nothing.
 */
import { receiptFrom, type ReceiptView } from '../../components/overhaul/sustainability/receipt'
import type { ImpactReport } from '../../components/sustainability/types'

const HOURS = 744
const WATTS_PER_VCPU = 0.5
const PUE = 1.2
const GRID = 90
const EMBODIED_PER_VCPU = 2.5
const LIFETIME_HOURS = 35040

function working(vcpu: number, servers: number) {
  const energyKWh = (vcpu * WATTS_PER_VCPU * HOURS * PUE) / 1000
  const useKg = (energyKWh * GRID) / 1000
  const embodiedKg = (vcpu * EMBODIED_PER_VCPU * HOURS) / LIFETIME_HOURS
  const totalKg = useKg + embodiedKg
  return {
    servers,
    vcpu,
    hours: HOURS,
    wattsPerVcpu: WATTS_PER_VCPU,
    pue: PUE,
    energyKWh,
    gridGCO2ePerKWh: GRID,
    gridYear: 2025,
    useKg,
    embodiedKgPerVcpu: EMBODIED_PER_VCPU,
    lifetimeYears: 4,
    lifetimeHours: LIFETIME_HOURS,
    embodiedKg,
    totalKg,
    embodiedShare: embodiedKg / totalKg,
  }
}

function report(vcpu: number, servers: number): ImpactReport {
  const w = working(vcpu, servers)
  return {
    period: { start: '2026-10-01', end: '2026-10-31', label: 'October 2026' },
    source: 'computed-fallback',
    lastUpdated: '2026-10-28T16:30:00.123456789Z',
    totals: { co2e: { amount: w.totalKg, unit: 'kg' }, energy: { amount: w.energyKWh, unit: 'kWh' }, instances: servers, renewableShare: 100 },
    products: [{ name: 'Compute', co2e: { amount: w.totalKg, unit: 'kg' }, energy: { amount: w.energyKWh, unit: 'kWh' } }],
    inventory: [],
    lifecycle: {
      manufacturing: { amount: w.embodiedKg * 0.3, unit: 'kg' },
      transport: { amount: w.embodiedKg * 0.4, unit: 'kg' },
      use: { amount: w.useKg, unit: 'kg' },
      endOfLife: { amount: w.embodiedKg * 0.3, unit: 'kg' },
    },
    methodology: {
      gridZone: 'CH',
      gridIntensity: { amount: GRID, unit: 'gCO2e/kWh' },
      gridSource: 'Swiss consumer mix 2025, VSE (strom.ch), partly provisional',
      factorsSource: 'Boavizta',
      factorsVersion: '2026.3',
      excludes: [],
    },
    indicators: [],
    working: w,
  }
}

/** What an old backend sent while Exoscale still answered: the host's own report. The page no longer reads it. */
const hostReport = { ...report(22, 7), source: 'exoscale-api', working: null } as unknown as ImpactReport
/** Even with a working beside it, a source the page does not know prints nothing. */
const hostReportWithWorking = { ...report(22, 7), source: 'exoscale-api' } as unknown as ImpactReport

const flat = (v: ReceiptView) =>
  v.state === 'unavailable'
    ? { state: v.state, lead: v.lead }
    : {
        state: v.state,
        lead: v.lead,
        period: v.period,
        panelLabel: v.panelLabel,
        total: v.total,
        totalUnit: v.totalUnit,
        totalLabel: v.totalLabel,
        rows: v.groups.flatMap((g) => g.rows.map((r) => ({ group: g.title, ...r }))),
        meta: v.meta,
        barcodeText: v.barcodeText,
        notes: v.notes,
      }

const brokenWorking = report(22, 7)
brokenWorking.working = { ...working(22, 7), totalKg: Number.NaN }

const out = {
  fleet: flat(receiptFrom(report(22, 7))),
  previous: flat(receiptFrom(report(21, 7))),
  previousWorking: working(21, 7),
  hostReport: flat(receiptFrom(hostReport)),
  hostReportWithWorking: flat(receiptFrom(hostReportWithWorking)),
  noWorking: flat(receiptFrom({ ...report(22, 7), working: null })),
  notFinite: flat(receiptFrom(brokenWorking)),
  none: flat(receiptFrom(null)),
}
process.stdout.write(JSON.stringify(out))
