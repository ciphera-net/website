import {
  CloudLightning,
  Drop,
  Gauge,
  Atom,
  Cloud,
  Radioactive,
} from '@phosphor-icons/react/dist/ssr'
import type { Icon } from '@phosphor-icons/react'
import type { ImpactReport, Indicator } from './types'

interface FootprintBentoProps {
  report: ImpactReport
}

/**
 * Convert a raw Boavizta indicator amount into a human-friendly (value, unit)
 * tuple. The provider API hands us the raw SI value + unit, but those units
 * are nearly always awkward to read (m³ of water, kg Sb-Eq, kBq U-235). This
 * helper rescales each indicator into the magnitude a normal person can hold
 * in their head.
 */
function formatIndicator(indicator: Indicator): { value: string; unit: string } {
  const { key, amount } = indicator
  switch (key) {
    case 'GWP': {
      // * Amount is kg CO2-Eq. Follow the hero's magnitude ladder.
      if (amount < 1) {
        return { value: Math.round(amount * 1000).toLocaleString(), unit: 'g CO₂e' }
      }
      if (amount >= 1000) {
        return { value: (amount / 1000).toFixed(2), unit: 't CO₂e' }
      }
      return { value: amount.toFixed(2), unit: 'kg CO₂e' }
    }
    case 'WU': {
      // * m³ world eq. deprived → litres is the everyday unit
      const litres = amount * 1000
      if (litres >= 1000) {
        return { value: (litres / 1000).toFixed(2), unit: 'm³ water' }
      }
      return { value: litres.toFixed(0), unit: 'L water' }
    }
    case 'ADPf': {
      // * Megajoules of fossil resources
      return { value: amount.toFixed(1), unit: 'MJ' }
    }
    case 'ADPe': {
      // * kg Sb-Eq → μg Sb-Eq (1 kg = 1e9 μg)
      const micrograms = amount * 1e9
      return { value: micrograms.toFixed(0), unit: 'μg Sb-Eq' }
    }
    case 'ODP': {
      // * kg CFC-11-Eq → mg CFC-11 (1 kg = 1e6 mg)
      const milligrams = amount * 1e6
      return { value: milligrams.toFixed(2), unit: 'mg CFC-11' }
    }
    case 'IR': {
      // * kBq U-235-Eq → Bq U-235 (1 kBq = 1000 Bq)
      const bq = amount * 1000
      return { value: bq.toFixed(1), unit: 'Bq U-235' }
    }
    default:
      return { value: amount.toString(), unit: indicator.unit }
  }
}

const ICON_BY_KEY: Record<Indicator['key'], Icon> = {
  GWP: CloudLightning,
  WU: Drop,
  ADPf: Gauge,
  ADPe: Atom,
  ODP: Cloud,
  IR: Radioactive,
}

// * Bento spans: the two "headline" indicators (GWP, WU) get 2 columns each
// * on md+ screens. The rest fill the four remaining 1-col cells underneath.
const SPAN_BY_KEY: Record<Indicator['key'], string> = {
  GWP: 'md:col-span-2',
  WU: 'md:col-span-2',
  ADPf: 'md:col-span-1',
  ADPe: 'md:col-span-1',
  ODP: 'md:col-span-1',
  IR: 'md:col-span-1',
}

// * Preferred render order (featured cards first, then the four small ones).
const ORDER: Indicator['key'][] = ['GWP', 'WU', 'ADPf', 'ADPe', 'ODP', 'IR']

interface CardProps {
  indicator: Indicator
  featured: boolean
  icon: Icon
  spanClass: string
}

function IndicatorCard({ indicator, featured, icon: IconEl, spanClass }: CardProps) {
  const { value, unit } = formatIndicator(indicator)

  return (
    <div className={'bg-background px-4 py-5 sm:px-5 sm:py-6 ' + spanClass}>
      <IconEl className="h-5 w-5 text-muted-foreground" weight="duotone" />
      <p className="mt-4 text-sm text-muted-foreground">{indicator.label}</p>
      <div className="mt-2 flex items-baseline gap-2 flex-wrap">
        <span
          className={
            'font-bold text-foreground tabular-nums leading-none ' +
            (featured ? 'text-4xl md:text-5xl' : 'text-3xl')
          }
        >
          {value}
        </span>
        <span className="text-sm font-medium text-muted-foreground">{unit}</span>
      </div>
      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
        {indicator.description}
      </p>
    </div>
  )
}

/**
 * Section 2 — Bento grid showing all 6 LCA indicators (GWP, WU, ADPf, ADPe,
 * ODP, IR). Replaces the old 4-metric strip. GWP and WU are featured with
 * 2-column spans; the rest fall into the four 1-column cells underneath.
 */
export function FootprintBento({ report }: FootprintBentoProps) {
  // * Sort indicators into the featured order. Any indicator the backend
  // * sends that we don't know about falls through to the end, untouched.
  const byKey = new Map(report.indicators.map((i) => [i.key, i]))
  const sorted = [
    ...ORDER.map((k) => byKey.get(k)).filter(
      (i): i is Indicator => Boolean(i),
    ),
    ...report.indicators.filter((i) => !ORDER.includes(i.key)),
  ]

  return (
    <section id="footprint" className="border-b border-border py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs text-muted-foreground">01 · Footprint</p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground leading-tight">
            Six ways your cloud footprint matters
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Climate change is only one of them. We track all six, using the
            Boavizta life-cycle assessment framework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-px border border-border bg-border">
          {sorted.map((indicator) => {
            const featured = indicator.key === 'GWP' || indicator.key === 'WU'
            const IconEl = ICON_BY_KEY[indicator.key] ?? CloudLightning
            const spanClass = SPAN_BY_KEY[indicator.key] ?? 'md:col-span-1'
            return (
              <IndicatorCard
                key={indicator.key}
                indicator={indicator}
                featured={featured}
                icon={IconEl}
                spanClass={spanClass}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
