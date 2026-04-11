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

export interface InventoryItem {
  instance: string
  type: string
  vcpu: number
  ramGb: number
  zone: 'CH-DK-2' | 'CH-GVA-2'
  purpose: string
}

export interface Methodology {
  gridZone: string
  gridIntensity: NumberWithUnit
  gridSource: string
  factorsSource: string
  factorsVersion: string
  excludes: string[]
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
}
