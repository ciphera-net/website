import type { ReportSource } from './types'
import { CircleNotch } from '@phosphor-icons/react/dist/ssr'

export interface SourceBadgeProps {
  source: ReportSource
  periodLabel: string
  className?: string
}

/**
 * Small pill shown near the hero that tells readers which data path served
 * the current report. Transparent about fallback state — when the Exoscale
 * API is unavailable, this badge shows "Computed from inventory" in amber.
 */
export function SourceBadge({ source, periodLabel, className }: SourceBadgeProps) {
  const isLive = source === 'exoscale-api'
  return (
    <span
      className={
        'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm backdrop-blur-sm ' +
        (isLive
          ? 'border-brand-orange/20 bg-brand-orange/10 text-brand-orange'
          : 'border-amber-400/20 bg-amber-400/10 text-amber-400') +
        (className ? ' ' + className : '')
      }
    >
      {isLive ? (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange" />
      ) : (
        <CircleNotch className="h-4 w-4" />
      )}
      {isLive
        ? `Live from Exoscale · ${periodLabel}`
        : `Computed from inventory · Exoscale API unavailable`}
    </span>
  )
}
