'use client'

/**
 * One-shot reveal. Content is fully visible without JavaScript; with it, a block starts DIMMED (never invisible, so a
 * capture, a crawler or a link preview never sees a blank page) and settles when it first enters the viewport.
 */
import * as React from 'react'

export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [state, setState] = React.useState<'idle' | 'armed' | 'shown'>('idle')
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setState('shown')
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92) return setState('shown')
    setState('armed')
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setState('shown')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} data-reveal={state} className={className} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  )
}
