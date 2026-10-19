'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react'
import { track } from '@/lib/pulse'
import { sustainabilityHeroBg } from '@/lib/images'
import type { ReportSource } from './types'
import { SourceBadge } from './source-badge'

// * A client component's props are serialised into the page payload, so the hero takes only the three fields it
// * renders, never the whole report (which carries the server inventory).
interface SustainabilityHeroProps {
  co2eKg: number
  periodLabel: string
  source: ReportSource
}

/**
 * Section 1 — Full-bleed grayscale Swiss-mountain photograph with a gradient
 * that resolves to the solid background on the text side, the CO2e number,
 * and two CTAs. Facet: sharp 0px, monochrome imagery, text on a
 * gradient-to-background (never on raw photo brightness), scarce orange
 * (only the primary CTA button carries it).
 *
 * The hero number is formatted by magnitude: under 1 kg shows grams,
 * 1-999 kg shows kg, over 1000 kg shows tonnes. It is rendered as its final
 * value, so the server HTML carries the real figure (the count-up it replaced
 * started at 0, which is what crawlers and readers without JavaScript saw).
 * The locale is fixed so the server and the browser format it identically.
 */
export function SustainabilityHero({ co2eKg, periodLabel, source }: SustainabilityHeroProps) {
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
  const displayValue = displayAmount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

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
        className="object-cover grayscale"
      />
      {/* Gradient resolving to the solid background on the text side */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45"
      />

      <div className="relative px-6 py-20 sm:py-28 lg:py-32">
        <p className="text-xs text-muted-foreground">Environmental impact</p>

        <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Receipts, not promises.
        </h1>

        <div className="mt-10 flex items-baseline gap-3">
          <span className="font-display text-7xl font-semibold leading-none tabular-nums text-foreground sm:text-8xl">
            {displayValue}
          </span>
          <span className="text-2xl font-semibold text-muted-foreground sm:text-4xl">
            {displayUnit}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-xs text-muted-foreground">
            Estimated CO₂ equivalent · {periodLabel}
          </p>
          <SourceBadge source={source} periodLabel={periodLabel} />
        </div>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Our servers in Zurich run on one of Europe&apos;s lowest-carbon grids, powered by Swiss
          hydro and nuclear. Here is our estimate of what they cost the planet, using life-cycle
          assessment.
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
