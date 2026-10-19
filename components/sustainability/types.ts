// Mirror of the Go ImpactReport shape in website-backend.
// Keep in sync with Public/website-backend/internal/sustainability/types.go.
// JSON field names match the Go struct tags byte-for-byte.

export type ReportSource = 'exoscale-api' | 'computed-fallback'

export interface NumberWithUnit {
  amount: number
  unit: string
}

export interface Period {
  start: string
  end: string
  label: string
}

export interface Totals {
  co2e: NumberWithUnit
  energy: NumberWithUnit
  instances: number
  renewableShare: number
}

export interface LifecyclePhases {
  manufacturing: NumberWithUnit
  transport: NumberWithUnit
  use: NumberWithUnit
  endOfLife: NumberWithUnit
}

export interface Product {
  name: string
  co2e: NumberWithUnit
  energy: NumberWithUnit
}

/** One server: its type, size and zone. The API never carries host names or what a host runs (website-backend#32). */
export interface InventoryItem {
  type: string
  vcpu: number
  ramGb: number
  zone: string
}

/**
 * Every number the /sustainability receipt prints for our own estimate, computed by website-backend (fallback.go,
 * `Working`): the page formats these and computes nothing. Present on the computed-fallback path, null on the host's.
 */
export interface Working {
  servers: number
  vcpu: number
  hours: number
  wattsPerVcpu: number
  pue: number
  energyKWh: number
  gridGCO2ePerKWh: number
  gridYear: number
  useKg: number
  embodiedKgPerVcpu: number
  lifetimeYears: number
  lifetimeHours: number
  embodiedKg: number
  totalKg: number
  /** embodiedKg / totalKg, 0 to 1. */
  embodiedShare: number
}

export interface Methodology {
  gridZone: string
  gridIntensity: NumberWithUnit
  gridSource: string
  factorsSource: string
  factorsVersion: string
  excludes: string[]
}

export interface Indicator {
  key: 'GWP' | 'WU' | 'ADPf' | 'ADPe' | 'ODP' | 'IR'
  label: string
  description: string
  amount: number
  unit: string
}

export interface ImpactReport {
  period: Period
  source: ReportSource
  lastUpdated: string
  totals: Totals
  products: Product[]
  inventory: InventoryItem[]
  lifecycle: LifecyclePhases
  methodology: Methodology
  indicators: Indicator[]
  /** Optional: a backend older than #32 does not send it. */
  working?: Working | null
}
