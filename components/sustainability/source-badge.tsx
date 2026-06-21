import type { ReportSource } from './types'
import { CircleNotch } from '@phosphor-icons/react/dist/ssr'

export interface SourceBadgeProps {
  source: ReportSource
  periodLabel: string
  className?: string
}

/**
 * Small pill shown near the hero that tells readers which data path served
 * the current report. Transparent about fallback state — when the upstream
 * measurement API is unavailable, this badge shows "Approximated" in amber.
 */
export function SourceBadge({ source, periodLabel, className }: SourceBadgeProps) {
  const isLive = source === 'exoscale-api'
  return (
    <span
      className={
        'inline-flex items-center gap-2 border border-border px-3 py-1 font-mono text-xs text-muted-foreground ' +
        (className ? className : '')
      }
    >
      {isLive ? (
        <span className="h-1.5 w-1.5 animate-pulse bg-muted-foreground" />
      ) : (
        <CircleNotch className="h-4 w-4" />
      )}
      {isLive
        ? `Live data · ${periodLabel}`
        : `Approximated · Measurement API unavailable`}
    </span>
  )
}
