import { Factory, Truck, Lightning, Recycle } from '@phosphor-icons/react/dist/ssr'
import type { ImpactReport } from './types'

interface LifecycleBreakdownProps {
  report: ImpactReport
}

/**
 * Section 5 — Per-product breakdown showing the four Boavizta lifecycle
 * phases as a stacked bar + 4 phase tiles. This is the "we count the whole
 * lifecycle, not just the plug" section — the Boavizta differentiator.
 */
export function LifecycleBreakdown({ report }: LifecycleBreakdownProps) {
  const { manufacturing, transport, use, endOfLife } = report.lifecycle
  const total =
    manufacturing.amount + transport.amount + use.amount + endOfLife.amount

  // * Avoid divide-by-zero in the unlikely event that the API returns 0s
  const safeTotal = total > 0 ? total : 1

  const phases = [
    {
      name: 'Manufacturing',
      icon: Factory,
      amount: manufacturing.amount,
      pct: (manufacturing.amount / safeTotal) * 100,
      color: 'bg-neutral-700',
      label: 'Embodied in hardware',
    },
    {
      name: 'Transport',
      icon: Truck,
      amount: transport.amount,
      pct: (transport.amount / safeTotal) * 100,
      color: 'bg-neutral-600',
      label: 'Factory to datacenter',
    },
    {
      name: 'Use',
      icon: Lightning,
      amount: use.amount,
      pct: (use.amount / safeTotal) * 100,
      color: 'bg-brand-orange',
      label: 'The plug (grid electricity)',
    },
    {
      name: 'End of life',
      icon: Recycle,
      amount: endOfLife.amount,
      pct: (endOfLife.amount / safeTotal) * 100,
      color: 'bg-neutral-500',
      label: 'Decommissioning + recycling',
    },
  ]

  const useOnlyPct = phases.find((p) => p.name === 'Use')?.pct ?? 0
  const hiddenPct = 100 - useOnlyPct

  return (
    <section className="py-20 lg:py-32 bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              We count the whole lifecycle, not just the plug.
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed mb-4">
              Most cloud providers report the CO₂ from electricity use and stop
              there. That&apos;s the &ldquo;plug&rdquo; phase — and it&apos;s only
              part of the real impact.
            </p>
            <p className="text-lg text-neutral-400 leading-relaxed mb-4">
              Every server is manufactured, shipped, used for years, then
              decommissioned. Each step has its own carbon cost. Exoscale uses
              the Boavizta life-cycle assessment framework, which tracks all four
              phases — so we can show you the whole picture.
            </p>
            <p className="text-lg text-neutral-400 leading-relaxed">
              <strong className="text-white">
                Use phase is only {useOnlyPct.toFixed(0)}% of our real impact.
              </strong>{' '}
              Most cloud providers hide the other {hiddenPct.toFixed(0)}%.
            </p>
          </div>

          {/* Right — stacked bar + 4 tiles */}
          <div>
            {/* Stacked bar */}
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-neutral-400">Total GWP</span>
                <span className="font-mono text-white tabular-nums">
                  {total.toFixed(3)} kg CO₂-Eq
                </span>
              </div>
              <div className="h-12 w-full flex rounded-lg overflow-hidden border border-white/[0.08]">
                {phases.map((phase) => (
                  <div
                    key={phase.name}
                    className={phase.color}
                    style={{ width: `${phase.pct}%` }}
                    title={`${phase.name}: ${phase.pct.toFixed(1)}%`}
                  />
                ))}
              </div>
            </div>

            {/* 4 phase tiles */}
            <div className="grid grid-cols-2 gap-3">
              {phases.map((phase) => (
                <div
                  key={phase.name}
                  className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-4 backdrop-blur-sm"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <phase.icon
                      weight="duotone"
                      className={
                        'w-4 h-4 ' +
                        (phase.name === 'Use' ? 'text-brand-orange' : 'text-neutral-400')
                      }
                    />
                    <span className="text-xs font-medium text-neutral-400">
                      {phase.name}
                    </span>
                  </div>
                  <div className="font-mono text-lg font-bold text-white tabular-nums">
                    {(phase.amount * 1000).toFixed(0)} g
                  </div>
                  <div className="text-[11px] text-neutral-500">{phase.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
