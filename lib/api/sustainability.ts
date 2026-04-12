import type {
  ImpactReport,
  Indicator,
} from '@/components/sustainability/types'
import { env } from '@/lib/env'

/**
 * Derive the six Boavizta indicators from a report's total GWP. Used as a
 * defensive fallback when the upstream API response omits the `indicators`
 * field (older backend build, schema skew, etc.) — keeps the FootprintBento
 * section from crashing during prerender. Ratios are the same ones used in
 * the emergencyFallback() in app/sustainability/page.tsx.
 */
export function deriveIndicators(totalCo2eKg: number): Indicator[] {
  return [
    {
      key: 'GWP',
      label: 'Climate change',
      description: 'Global impact due to greenhouse-gas emissions.',
      amount: totalCo2eKg,
      unit: 'kg CO2-Eq',
    },
    {
      key: 'WU',
      label: 'Water use',
      description:
        'Freshwater consumption from lakes, rivers, or groundwater.',
      amount: totalCo2eKg * 0.064,
      unit: 'm3 world eq. deprived',
    },
    {
      key: 'ADPf',
      label: 'Fossil depletion',
      description:
        'Decreased availability of fossil resources for future generations.',
      amount: totalCo2eKg * 12.5,
      unit: 'MJ, net calorific value',
    },
    {
      key: 'ADPe',
      label: 'Mineral depletion',
      description: 'Decreased availability of mineral and metal resources.',
      amount: totalCo2eKg * 2.7e-6,
      unit: 'kg Sb-Eq',
    },
    {
      key: 'ODP',
      label: 'Ozone depletion',
      description: 'Stratospheric ozone layer damage.',
      amount: totalCo2eKg * 0.0025,
      unit: 'kg CFC-11-Eq',
    },
    {
      key: 'IR',
      label: 'Ionising radiation',
      description: 'Human health impact from ionising radiation exposure.',
      amount: totalCo2eKg * 0.049,
      unit: 'kBq U235-Eq',
    },
  ]
}

/**
 * Server-side fetch of the environmental-impact report from website-backend.
 * Called from the /sustainability page's server component during ISR
 * revalidation — never runs in the browser.
 *
 * Next.js caches the fetch response according to the ISR revalidate
 * setting on the caller (currently 86400s = 24h). Setting `next.revalidate`
 * here explicitly is redundant with the page-level export but doesn't
 * hurt — it documents the intent locally.
 *
 * Error handling: if the backend is unreachable or returns a non-2xx,
 * this function returns null. The caller is expected to render a graceful
 * degraded state (the page never 500s because of this).
 *
 * Schema safety: if the backend returns a report without the `indicators`
 * field (older build / schema skew), we synthesize them from the total GWP
 * so FootprintBento always has 6 cards to render.
 */
export async function fetchImpactReport(): Promise<ImpactReport | null> {
  const url = `${env.NEXT_PUBLIC_WEBSITE_API_URL}/api/v1/environmental-impact`

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) {
      console.error('sustainability: backend returned', res.status)
      return null
    }
    const data = (await res.json()) as ImpactReport
    // * Defensive: older backend builds don't return `indicators`. Derive
    // * them from the total GWP so the page still prerenders cleanly.
    if (!data.indicators || data.indicators.length === 0) {
      data.indicators = deriveIndicators(data.totals?.co2e?.amount ?? 0)
    }
    return data
  } catch (err) {
    console.error('sustainability: fetch failed:', err)
    return null
  }
}
