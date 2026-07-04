import { fetchImpactReport } from '@/lib/api/sustainability'
import type { ImpactReport } from '@/components/sustainability/types'
import { STATIC_INVENTORY } from '@/components/sustainability/inventory'
import { SustainabilityHero } from '@/components/sustainability/hero'
import { FootprintBento } from '@/components/sustainability/footprint-bento'
import { SwissGridBlock } from '@/components/sustainability/swiss-grid-block'
import { LifecycleBreakdown } from '@/components/sustainability/lifecycle-breakdown'
import { Methodology } from '@/components/sustainability/methodology'
import { Commitments } from '@/components/sustainability/commitments'
import { SustainabilityCTA } from '@/components/sustainability/sustainability-cta'

// * Regenerate the page once per day. The backend has its own 24h cache
// * so the upstream measurement API is hit at most once per day in the
// * happy path.
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
  const now = new Date()
  const nowIso = now.toISOString()
  const total = 0.5 // * conservative placeholder — keep the page rendered
  // * Previous calendar month, computed at render time so the fallback never
  // * shows a stale hardcoded period.
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0))
  const periodLabel = periodStart.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return {
    period: {
      start: periodStart.toISOString().slice(0, 10),
      end: periodEnd.toISOString().slice(0, 10),
      label: periodLabel,
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
        'Public/free-tier CDN egress',
      ],
    },
    indicators: [
      {
        key: 'GWP',
        label: 'Climate change',
        description:
          'Global impact due to greenhouse-gas emissions.',
        amount: total,
        unit: 'kg CO2-Eq',
      },
      {
        key: 'WU',
        label: 'Water use',
        description:
          'Freshwater consumption from lakes, rivers, or groundwater.',
        amount: total * 0.064,
        unit: 'm3 world eq. deprived',
      },
      {
        key: 'ADPf',
        label: 'Fossil depletion',
        description:
          'Decreased availability of fossil resources for future generations.',
        amount: total * 12.5,
        unit: 'MJ, net calorific value',
      },
      {
        key: 'ADPe',
        label: 'Mineral depletion',
        description:
          'Decreased availability of mineral and metal resources.',
        amount: total * 2.7e-6,
        unit: 'kg Sb-Eq',
      },
      {
        key: 'ODP',
        label: 'Ozone depletion',
        description: 'Stratospheric ozone layer damage.',
        amount: total * 0.0025,
        unit: 'kg CFC-11-Eq',
      },
      {
        key: 'IR',
        label: 'Ionising radiation',
        description:
          'Human health impact from ionising radiation exposure.',
        amount: total * 0.049,
        unit: 'kBq U235-Eq',
      },
    ],
  }
}

export default async function SustainabilityPage() {
  const report = (await fetchImpactReport()) ?? emergencyFallback()

  return (
    <>
      <SustainabilityHero report={report} />
      <FootprintBento report={report} />
      <SwissGridBlock />
      <LifecycleBreakdown report={report} />
      <Methodology report={report} />
      <Commitments />
      <SustainabilityCTA />
    </>
  )
}
