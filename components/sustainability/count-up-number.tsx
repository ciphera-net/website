'use client'

import { useEffect, useState } from 'react'
import { useMotionValue, useTransform, animate } from 'motion/react'

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
 * CountUpNumber animates from 0 to `value` on mount. It is a client
 * component because motion's `animate()` is a runtime API. The wrapper
 * is a simple span so callers control font size, weight, and color via
 * the className prop.
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
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) =>
    latest.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  )
  const [display, setDisplay] = useState(
    (0).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  )

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      setDisplay(
        value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      )
      return
    }

    const controls = animate(count, value, {
      duration,
      ease: 'easeOut',
    })
    const unsubscribe = rounded.on('change', (v) => setDisplay(v))
    return () => {
      controls.stop()
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, duration])

  return <span className={className}>{display}</span>
}
