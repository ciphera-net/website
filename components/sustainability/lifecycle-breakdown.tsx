import type { ImpactReport } from './types'

interface LifecycleBreakdownProps {
  report: ImpactReport
}

/**
 * Section 03 — One 100% stacked bar of the four Boavizta lifecycle phases
 * (manufacturing, transport, use, end-of-life), Use highlighted in primary,
 * with a ledger of phase / share / grams underneath. This is the "we count
 * the whole lifecycle, not just the plug" section — the Boavizta
 * differentiator.
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
      amount: manufacturing.amount,
      pct: (manufacturing.amount / safeTotal) * 100,
      isUse: false,
    },
    {
      name: 'Transport',
      amount: transport.amount,
      pct: (transport.amount / safeTotal) * 100,
      isUse: false,
    },
    {
      name: 'Use',
      amount: use.amount,
      pct: (use.amount / safeTotal) * 100,
      isUse: true,
    },
    {
      name: 'End of life',
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
        <p className="text-xs text-muted-foreground">03 · Lifecycle</p>
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

          {/* Right — 100% stacked bar + ledger */}
          <div>
            <div
              className="flex h-10 w-full overflow-hidden border border-border"
              role="img"
              aria-label={`Lifecycle breakdown: ${useOnlyPct.toFixed(0)}% use, ${(100 - useOnlyPct).toFixed(0)}% other phases`}
            >
              {phases.map((p) => (
                <div
                  key={p.name}
                  className={
                    p.isUse
                      ? 'bg-primary'
                      : 'bg-foreground/15'
                  }
                  style={{ width: `${p.pct}%` }}
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* Ledger */}
            <ol className="mt-6 divide-y divide-border border border-border">
              {phases.map((p) => (
                <li
                  key={p.name}
                  className="grid grid-cols-[1fr_auto_auto] items-baseline gap-4 bg-background px-4 py-3 sm:px-5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        'inline-block h-2 w-2 ' +
                        (p.isUse ? 'bg-primary' : 'bg-foreground/30')
                      }
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-foreground">{p.name}</span>
                  </div>
                  <span className="text-sm tabular-nums text-foreground">
                    {p.pct.toFixed(0)}%
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {(p.amount * 1000).toFixed(0)} g CO₂e
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-4 text-xs text-muted-foreground">
              Bar segments sized by share of total lifecycle GWP. Use phase highlighted
              because it is the only phase competitors typically report.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
