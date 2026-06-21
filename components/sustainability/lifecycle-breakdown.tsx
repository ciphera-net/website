import { Factory, Truck, Lightning, Recycle } from '@phosphor-icons/react/dist/ssr'
import { ProgressRadial } from '@/components/ui/progress-radial'
import type { ImpactReport } from './types'

interface LifecycleBreakdownProps {
  report: ImpactReport
}

/**
 * Section 5 — Four radial progress rings showing each Boavizta lifecycle
 * phase (manufacturing, transport, use, end-of-life) as a percentage of
 * the total GWP. This is the "we count the whole lifecycle, not just the
 * plug" section — the Boavizta differentiator.
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
      isUse: false,
    },
    {
      name: 'Transport',
      icon: Truck,
      amount: transport.amount,
      pct: (transport.amount / safeTotal) * 100,
      isUse: false,
    },
    {
      name: 'Use',
      icon: Lightning,
      amount: use.amount,
      pct: (use.amount / safeTotal) * 100,
      isUse: true,
    },
    {
      name: 'End of life',
      icon: Recycle,
      amount: endOfLife.amount,
      pct: (endOfLife.amount / safeTotal) * 100,
      isUse: false,
    },
  ]

  const useOnlyPct = phases.find((p) => p.isUse)?.pct ?? 0
  const hiddenPct = 100 - useOnlyPct

  return (
    <section className="border-b border-border bg-background py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-xs text-muted-foreground">03 · Lifecycle</p>
        <div className="mt-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              We count the whole lifecycle, not just the plug.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Most cloud providers report the CO₂ from electricity use and stop
              there. That&apos;s the &ldquo;plug&rdquo; phase — and it&apos;s only
              part of the real impact.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Every server is manufactured, shipped, used for years, then
              decommissioned. Each step has its own carbon cost. We use the
              Boavizta life-cycle assessment framework, which tracks all four
              phases — so we can show you the whole picture.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <strong className="text-foreground">
                Use phase is only {useOnlyPct.toFixed(0)}% of our real impact.
              </strong>{' '}
              Most cloud providers hide the other {hiddenPct.toFixed(0)}%.
            </p>
          </div>

          {/* Right — 4 radial rings */}
          <div className="grid grid-cols-2 gap-6">
            {phases.map((phase) => (
              <div
                key={phase.name}
                className="border border-border bg-card p-6 flex flex-col items-center"
              >
                <ProgressRadial
                  value={phase.pct}
                  size={140}
                  strokeWidth={10}
                  indicatorClassName={
                    phase.isUse ? 'text-foreground' : 'text-muted-foreground'
                  }
                  trackClassName="text-foreground/[0.05]"
                >
                  <div className="flex flex-col items-center">
                    <phase.icon
                      weight="duotone"
                      className="mb-1 h-5 w-5 text-muted-foreground"
                    />
                    <span className="text-2xl font-bold text-foreground tabular-nums">
                      {phase.pct.toFixed(0)}
                      <span className="text-sm text-muted-foreground">%</span>
                    </span>
                  </div>
                </ProgressRadial>
                <div className="mt-4 text-center">
                  <div className="text-sm font-medium text-foreground">{phase.name}</div>
                  <div className="text-xs text-muted-foreground tabular-nums">
                    {(phase.amount * 1000).toFixed(0)} g CO₂e
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
