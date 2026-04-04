'use client'

import { useRef, useState, useEffect } from 'react'

function parseAspectRatio(ratio: string): number {
  const parts = ratio.split('/').map((s) => parseFloat(s.trim()))
  if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
    return parts[0] / parts[1]
  }
  return 3 / 2
}

export function useChartSize(aspectRatio: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const ratio = parseAspectRatio(aspectRatio)
  const height = width > 0 ? Math.round(width / ratio) : 0

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 0) setWidth(w)
      }
    })

    observer.observe(el)

    // Measure immediately in case ResizeObserver is delayed
    const rect = el.getBoundingClientRect()
    if (rect.width > 0) setWidth(rect.width)

    return () => observer.disconnect()
  }, [])

  return { containerRef, width, height }
}
