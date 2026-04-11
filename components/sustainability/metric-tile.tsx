import type { Icon } from '@phosphor-icons/react'

export interface MetricTileProps {
  icon: Icon
  label: string
  value: string
  caption: string
}

/**
 * Single headline metric tile for the Section 2 metrics strip. Uses the
 * canonical Pulse glass block pattern: bg-neutral-900/80 with a subtle
 * white border, rounded corners, and backdrop blur.
 *
 * This is a pure render — no animation, no data fetching. The hero uses
 * CountUpNumber for the big number; these tiles are static so users who
 * scroll past fast still see the values. (Animating 4 tiles in addition
 * to the hero would be visual noise.)
 */
export function MetricTile({ icon: Icon, label, value, caption }: MetricTileProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/80 p-6 md:p-8 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10">
          <Icon className="h-5 w-5 text-brand-orange" weight="duotone" />
        </div>
        <span className="text-sm font-medium text-neutral-400">{label}</span>
      </div>
      <div className="mb-2 text-3xl md:text-4xl font-bold text-white tabular-nums">
        {value}
      </div>
      <p className="text-sm text-neutral-500">{caption}</p>
    </div>
  )
}
