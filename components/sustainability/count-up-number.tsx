'use client'

import { useEffect, useState } from 'react'

/**
 * Props for CountUpNumber.
 */
export interface CountUpNumberProps {
  /** Final value to display. */
  value: number
  /** Number of decimal places to show (default 0). */
  decimals?: number
  /** Animation duration in seconds (default 1.5). */
  duration?: number
  /** Optional className passed through to the wrapper span. */
  className?: string
}

/**
 * CountUpNumber animates from 0 to `value` on mount using requestAnimationFrame
 * (no animation library). The wrapper is a simple span so callers control font
 * size, weight, and color via the className prop.
 *
 * Respects prefers-reduced-motion: users with the OS-level reduced-motion
 * preference see the final value immediately, no animation.
 */
export function CountUpNumber({
  value,
  decimals = 0,
  duration = 1.5,
  className,
}: CountUpNumberProps) {
  const format = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })

  const [display, setDisplay] = useState(() => format(0))

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      setDisplay(format(value))
      return
    }

    let raf = 0
    let start: number | null = null
    const ms = Math.max(0, duration * 1000)
    // easeOut cubic — matches motion's previous 'easeOut' feel
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      if (start === null) start = now
      const t = ms === 0 ? 1 : Math.min(1, (now - start) / ms)
      setDisplay(format(value * ease(t)))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setDisplay(format(value))
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, duration])

  return <span className={className}>{display}</span>
}
