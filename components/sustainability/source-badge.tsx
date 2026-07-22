import type { ReportSource } from './types'
import { CircleNotch } from '@phosphor-icons/react/dist/ssr'

export interface SourceBadgeProps {
  source: ReportSource
  periodLabel: string
  className?: string
}

/**
 * Small pill shown near the hero that tells readers which data path served
 * the current report. Transparent about fallback state without advertising a
 * broken pipeline on the hero: when the report is not from the live
 * measurement API, the badge reads "Approximated" and names the actual basis
 * of the fallback numbers — Boavizta life-cycle factors — rather than pointing
 * at an outage. The full fallback disclosure lives in the Methodology section
 * lower on the page ("Source of truth").
 */
export function SourceBadge({ source, periodLabel, className }: SourceBadgeProps) {
  const isLive = source === 'exoscale-api'
  return (
    <span
      className={
        'inline-flex items-center gap-2 border border-border px-3 py-1 text-xs text-muted-foreground ' +
        (className ? className : '')
      }
    >
      {isLive ? (
        <span className="h-1.5 w-1.5 animate-pulse bg-muted-foreground" />
      ) : (
        <CircleNotch className="h-4 w-4" />
      )}
      {isLive
        ? `Measured · ${periodLabel}`
        : `Approximated · Boavizta life-cycle factors`}
    </span>
  )
}
