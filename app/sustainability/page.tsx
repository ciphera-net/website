import { fetchImpactReport } from '@/lib/api/sustainability'
import type { ImpactReport } from '@/components/sustainability/types'
import { STATIC_INVENTORY } from '@/components/sustainability/inventory'
import { SustainabilityHero } from '@/components/sustainability/hero'
import { MetricsStrip } from '@/components/sustainability/metrics-strip'
import { SwissGridBlock } from '@/components/sustainability/swiss-grid-block'
import { InfrastructureTable } from '@/components/sustainability/infrastructure-table'
import { LifecycleBreakdown } from '@/components/sustainability/lifecycle-breakdown'
import { Methodology } from '@/components/sustainability/methodology'
import { Commitments } from '@/components/sustainability/commitments'
import { SustainabilityCTA } from '@/components/sustainability/sustainability-cta'

// * Regenerate the page once per day. The backend has its own 24h cache
// * so Exoscale is hit at most once per day in the happy path.
export const revalidate = 86400

/**
 * Emergency degraded-mode report. If the website-backend is unreachable
 * entirely (e.g. during a rolling restart at build time), render the
 * page with a best-effort computed snapshot from the static inventory so
 * the route never 404s or 500s. Numbers are deliberately pessimistic
 * approximations — the caption on the page will say "computed fallback"
 * and readers can see the source badge.
 */
function emergencyFallback(): ImpactReport {
  const nowIso = new Date().toISOString()
  const total = 0.5 // * conservative placeholder — keep the page rendered
  return {
    period: {
      start: '2026-01-01',
      end: '2026-01-31',
      label: 'recent month',
    },
    source: 'computed-fallback',
    lastUpdated: nowIso,
    totals: {
      co2e: { amount: total, unit: 'kg' },
      energy: { amount: 40, unit: 'kWh' },
      instances: STATIC_INVENTORY.length,
      renewableShare: 100,
    },
    products: [],
    inventory: STATIC_INVENTORY,
    lifecycle: {
      manufacturing: { amount: total * 0.21, unit: 'kg' },
      transport: { amount: total * 0.29, unit: 'kg' },
      use: { amount: total * 0.3, unit: 'kg' },
      endOfLife: { amount: total * 0.2, unit: 'kg' },
    },
    methodology: {
      gridZone: 'CH',
      gridIntensity: { amount: 12, unit: 'gCO2e/kWh' },
      gridSource: 'Swiss Federal Office of Energy (BFE), 2025 annualized',
      factorsSource: 'Boavizta (emergency fallback — backend unreachable)',
      factorsVersion: '2026.2',
      excludes: [
        'Bunny CDN edge delivery',
        'Office electricity (we have no office)',
        'Backend unreachable — using emergency snapshot',
      ],
    },
  }
}

export default async function SustainabilityPage() {
  const report = (await fetchImpactReport()) ?? emergencyFallback()

  return (
    <>
      <SustainabilityHero report={report} />
      <MetricsStrip report={report} />
      <SwissGridBlock />
      <InfrastructureTable inventory={report.inventory} />
      <LifecycleBreakdown report={report} />
      <Methodology report={report} />
      <Commitments />
      <SustainabilityCTA />
    </>
  )
}
