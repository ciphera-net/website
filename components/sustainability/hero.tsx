'use client'

import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { sustainabilityHeroBg } from '@/lib/images'
import { track } from '@/lib/pulse'
import type { ImpactReport } from './types'
import { CountUpNumber } from './count-up-number'
import { SourceBadge } from './source-badge'

interface SustainabilityHeroProps {
  report: ImpactReport
}

/**
 * Section 1 — Full-bleed Alpine dam photograph with a count-up CO2e number
 * and two CTAs. Mirrors the Pulse product page hero pattern exactly.
 *
 * The hero number is formatted based on magnitude: under 1 kg shows grams,
 * 1-999 kg shows kg, over 1000 kg shows tonnes. Reformats as CountUpNumber
 * animates.
 */
export function SustainabilityHero({ report }: SustainabilityHeroProps) {
  const co2eKg = report.totals.co2e.amount
  // * Pick a display unit and convert the amount accordingly
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
    <section className="relative -mt-[88px] min-h-screen flex items-center pt-[88px] pb-20 lg:pb-32 bg-neutral-950 overflow-hidden">
      <img
        src={sustainabilityHeroBg.src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-neutral-950 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <SourceBadge
          source={report.source}
          periodLabel={report.period.label}
          className="mb-6"
        />

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-8">
          Receipts, not promises.
        </h1>

        <div className="mb-8">
          <div className="flex items-baseline justify-center gap-3">
            <CountUpNumber
              value={displayAmount}
              decimals={decimals}
              className="text-7xl sm:text-8xl md:text-[10rem] font-bold tabular-nums text-white leading-none"
            />
            <span className="text-2xl md:text-4xl font-semibold text-brand-orange">
              {displayUnit}
            </span>
          </div>
          <p className="mt-3 text-sm text-neutral-500">
            CO₂ equivalent · {report.period.label}
          </p>
        </div>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral-400 leading-relaxed">
          Every Ciphera service runs on 100% renewable Swiss hydroelectric power.
          Here&apos;s what that actually costs the planet, measured with life-cycle
          assessment — not estimates.
        </p>

        <div className="flex flex-row gap-3 flex-wrap justify-center">
          <Button
            size="lg"
            className="gap-2 bg-brand-orange-button hover:bg-brand-orange-button-hover text-white"
            asChild
          >
            <Link
              href="#methodology"
              onClick={() => track('sustainability_hero_methodology_click')}
            >
              See the methodology <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-neutral-600 text-white hover:bg-neutral-800 hover:border-neutral-500"
            asChild
          >
            <Link
              href="#infrastructure"
              onClick={() => track('sustainability_hero_infrastructure_click')}
            >
              View our infrastructure
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
