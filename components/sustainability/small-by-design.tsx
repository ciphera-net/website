import { Cube, MapPin, Leaf } from '@phosphor-icons/react/dist/ssr'
import type { ImpactReport } from './types'

interface SmallByDesignProps {
  report: ImpactReport
}

/**
 * Section 4 — Aggregate "small by design" fleet stats. Deliberately does not
 * name the hosting provider or individual servers — the fleet size and
 * renewable share are the numbers that matter, the plumbing is not public
 * marketing.
 */
export function SmallByDesign({ report }: SmallByDesignProps) {
  return (
    <section className="py-20 lg:py-32 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Small by design.
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            We run lean on purpose. Every additional server is a liability — for our
            security posture, our budget, and our carbon footprint. The smallest
            possible fleet is the honest answer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/80 p-8 backdrop-blur-sm text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
              <Cube className="h-6 w-6 text-brand-orange" weight="duotone" />
            </div>
            <div className="text-5xl font-bold text-white tabular-nums mb-2">
              {report.totals.instances}
            </div>
            <p className="text-sm text-neutral-400">Virtual machines</p>
            <p className="mt-2 text-xs text-neutral-500">
              Entire Ciphera fleet — auth, analytics, website, observability, email
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/80 p-8 backdrop-blur-sm text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
              <MapPin className="h-6 w-6 text-brand-orange" weight="duotone" />
            </div>
            <div className="text-5xl font-bold text-white tabular-nums mb-2">2</div>
            <p className="text-sm text-neutral-400">Swiss zones</p>
            <p className="mt-2 text-xs text-neutral-500">
              Zurich (primary) + Geneva (regional failover) — 100% on Swiss soil
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/80 p-8 backdrop-blur-sm text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
              <Leaf className="h-6 w-6 text-brand-orange" weight="duotone" />
            </div>
            <div className="text-5xl font-bold text-white tabular-nums mb-2">
              {report.totals.renewableShare}%
            </div>
            <p className="text-sm text-neutral-400">Renewable power</p>
            <p className="mt-2 text-xs text-neutral-500">
              Swiss grid: ~60% hydro, ~30% nuclear, ~10% other renewables
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
