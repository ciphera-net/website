'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react'
import { track } from '@/lib/pulse'
import { sustainabilityHeroBg } from '@/lib/images'
import type { ImpactReport } from './types'
import { CountUpNumber } from './count-up-number'
import { SourceBadge } from './source-badge'

interface SustainabilityHeroProps {
  report: ImpactReport
}

/**
 * Section 1 — Full-bleed grayscale Swiss-mountain photograph with a gradient
 * that resolves to the solid background on the text side, a count-up CO2e
 * number, and two CTAs. Facet: sharp 0px, monochrome imagery, text on a
 * gradient-to-background (never on raw photo brightness), scarce orange
 * (only the primary CTA button carries it).
 *
 * The hero number is formatted by magnitude: under 1 kg shows grams,
 * 1-999 kg shows kg, over 1000 kg shows tonnes.
 */
export function SustainabilityHero({ report }: SustainabilityHeroProps) {
  const co2eKg = report.totals.co2e.amount
  let displayAmount = co2eKg
  let displayUnit = 'kg'
  let decimals = 2
  if (co2eKg < 1) {
    displayAmount = co2eKg * 1000
    displayUnit = 'g'
    decimals = 0
  } else if (co2eKg >= 1000) {
    displayAmount = co2eKg / 1000
    displayUnit = 't'
    decimals = 2
  }

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Full-bleed grayscale photo */}
      <Image
        src={sustainabilityHeroBg}
        alt=""
        aria-hidden="true"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover grayscale brightness-[0.4]"
      />
      {/* Gradient resolving to the solid background on the text side */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45"
      />

      <div className="relative px-6 py-20 sm:py-28 lg:py-32">
        <p className="font-mono text-xs text-muted-foreground">Environmental impact</p>

        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Receipts, not promises.
        </h1>

        <div className="mt-10 flex items-baseline gap-3">
          <CountUpNumber
            value={displayAmount}
            decimals={decimals}
            className="font-display text-7xl font-bold leading-none tabular-nums text-foreground sm:text-8xl"
          />
          <span className="text-2xl font-semibold text-muted-foreground sm:text-4xl">
            {displayUnit}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="font-mono text-xs text-muted-foreground">
            CO₂ equivalent · {report.period.label}
          </p>
          <SourceBadge source={report.source} periodLabel={report.period.label} />
        </div>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Every Ciphera service runs on one of Europe’s lowest-carbon grids — Swiss hydro and
          nuclear, ~12 gCO₂e/kWh. Here’s what that actually costs the planet, measured with
          life-cycle assessment — not estimates.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link
            href="#methodology"
            onClick={() => track('sustainability_hero_methodology_click')}
            className="btn-primary"
          >
            See the methodology
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="#footprint"
            onClick={() => track('sustainability_hero_footprint_click')}
            className="btn-secondary"
          >
            View our footprint
          </Link>
        </div>
      </div>
    </section>
  )
}
