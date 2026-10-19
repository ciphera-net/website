'use client'

/**
 * Option P's motion (D60, 19-10): the printer's three stages, after dqnamo's Receipt Printer, measured look-only
 * (Public/docs/data/19-10-2026-sustainability-r12/receipt-printer-reference/): about 1.8 s calculating with a spinner (one
 * turn a second), a cross-fade to printing while the paper feeds out from under the slot over 1,750 ms, then a cross-fade
 * to printed. Ours feeds in steps, like a thermal printer, and the status cross-fades use Facet's curve (ease-apple).
 *
 * The server renders the PRINTED state: a crawler, a link preview or a reader without JavaScript sees the whole receipt
 * and "Receipt printed". After hydration, with motion allowed, the printer arms (paper back inside, calculating) only
 * while the parts that change (the status line and the paper) are out of view, so nothing visible ever un-prints; a
 * device top peeking over the fold changes nothing, so it still arms. It plays once when it scrolls in, and Print again
 * replays it. With reduced motion it stays printed, nothing animates, and there is no Print again.
 *
 * Only transform and opacity move. The paper's window keeps its height in every stage, so nothing below it shifts.
 */
import * as React from 'react'
import { CircleNotch } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'

type Stage = 'processing' | 'printing' | 'complete'

/** The reference's stage timings. */
const PROCESS_MS = 1800
const FEED_MS = 1750
const SETTLE_MS = 150
/** One step of the feed is about a line of thermal print. */
const STEP_PX = 18

const FADE = 'transition-opacity ease-apple [transition-duration:180ms] motion-reduce:transition-none'

export function PrinterMotion({
  top,
  panel,
  paper,
  status,
  again,
  notes = false,
}: {
  /** The device's top row (mark, place), server-rendered. */
  top: React.ReactNode
  /** The status panel's figures, server-rendered. */
  panel: React.ReactNode
  /** The printed receipt, server-rendered. */
  paper: React.ReactNode
  status: Record<Stage, string>
  again: string
  /**
   * The paper carries notes in the margin that reach out over the page beside it (D61). The window then clips the paper
   * vertically only (an inset with negative sides), so the paper still hides above the slot and the notes are not cut
   * off at the paper's edge.
   */
  notes?: boolean
}) {
  const [stage, setStage] = React.useState<Stage>('complete')
  const [replayable, setReplayable] = React.useState(false)
  const deviceRef = React.useRef<HTMLDivElement>(null)
  const statusRef = React.useRef<HTMLDivElement>(null)
  const windowRef = React.useRef<HTMLDivElement>(null)
  const paperRef = React.useRef<HTMLDivElement>(null)
  const timers = React.useRef<number[]>([])
  const feed = React.useRef<Animation | null>(null)

  const stop = React.useCallback(() => {
    for (const t of timers.current) window.clearTimeout(t)
    timers.current = []
    feed.current?.cancel()
    feed.current = null
  }, [])

  /** The paper back inside the printer: translated up by its own height, so its window shows nothing. */
  const tuckIn = React.useCallback(() => {
    if (paperRef.current) paperRef.current.style.transform = 'translateY(-100%)'
  }, [])

  const play = React.useCallback(() => {
    stop()
    tuckIn()
    setStage('processing')
    timers.current.push(
      window.setTimeout(() => {
        setStage('printing')
        const el = paperRef.current
        if (!el) return
        const steps = Math.max(12, Math.round(el.offsetHeight / STEP_PX))
        const anim = el.animate([{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }], {
          duration: FEED_MS,
          easing: `steps(${steps}, end)`,
          fill: 'forwards',
        })
        feed.current = anim
        anim.finished
          .then(() => {
            el.style.transform = ''
            anim.cancel()
            feed.current = null
            timers.current.push(window.setTimeout(() => setStage('complete'), SETTLE_MS))
          })
          .catch(() => {
            // Cancelled by Print again or an unmount: whoever cancelled it owns the next state.
          })
      }, PROCESS_MS),
    )
  }, [stop, tuckIn])

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setReplayable(true)
    const el = deviceRef.current
    if (!el || !statusRef.current || !windowRef.current) return
    const seen = (n: HTMLElement) => {
      const r = n.getBoundingClientRect()
      return r.top < window.innerHeight && r.bottom > 0
    }
    // What changes is already on screen at hydration: it stays printed (Print again still plays it).
    if (seen(statusRef.current) || seen(windowRef.current)) return
    tuckIn()
    setStage('processing')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          play()
        }
      },
      // Nearly all of the device in view, not most of it: beside the heading the device starts high, and on a 1440 x 1000
      // screen 60% of it already shows at load (151 of 252 px), which started the print before any scroll.
      { threshold: 0.9 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      stop()
    }
  }, [play, stop, tuckIn])

  const busy = stage !== 'complete'

  return (
    <div data-r12-printer data-stage={stage} className="group/printer relative isolate mx-auto w-full max-w-[460px]">
      {/* The device: a square body on the card surface, hairline edges, no shadow or sheen. */}
      <div ref={deviceRef} data-r12-device className="relative border border-border bg-card px-5 pb-5 pt-5">
        {top}
        <div data-r12-panel className="mt-5 border border-border bg-background px-5 pb-5 pt-4">
          {panel}
          <div ref={statusRef} className="mt-5 flex items-center gap-3 text-sm">
            <span aria-hidden="true" className="grid h-4 w-4 shrink-0 place-items-center">
              <CircleNotch
                data-r12-spinner
                weight="bold"
                className={cn(
                  'col-start-1 row-start-1 h-4 w-4 text-muted-foreground',
                  FADE,
                  busy ? 'animate-spin opacity-100' : 'opacity-0',
                )}
              />
              {/* The one orange point: the site's 6 px status dot. */}
              <span
                data-r12-dot
                className={cn('col-start-1 row-start-1 h-1.5 w-1.5 rounded-full bg-primary', FADE, busy ? 'opacity-0' : 'opacity-100')}
              />
            </span>
            <span aria-hidden="true" className="grid">
              {(['processing', 'printing', 'complete'] as const).map((s) => (
                <span
                  key={s}
                  data-r12-status={s}
                  className={cn(
                    'col-start-1 row-start-1 whitespace-nowrap',
                    s === 'complete' ? 'text-foreground' : 'text-muted-foreground',
                    FADE,
                    stage === s ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  {status[s]}
                </span>
              ))}
            </span>
            <span className="sr-only" aria-live="polite">
              {status[stage]}
            </span>
          </div>
        </div>
        {/* The slot the paper feeds from. Above the paper (z-20), so the paper's top edge sits under it. */}
        <div aria-hidden="true" data-r12-slot className="relative z-20 mt-5 h-2 border border-border bg-black" />
      </div>

      {/* The paper's window starts at the slot's top edge (8 px slot + 20 px lip + 1 px border = 29 px up), above the
          device's lip and under the slot; it clips the paper while the paper is tucked in. */}
      <div
        ref={windowRef}
        data-r12-paper-window
        className={cn('relative z-10 mx-auto -mt-[29px] w-[86%]', notes ? '[clip-path:inset(0_-100vw_0_-100vw)]' : 'overflow-hidden')}
      >
        <div ref={paperRef} data-r12-paper className="will-change-transform">
          {paper}
        </div>
      </div>

      {/* Print again: the legal pages' Open all, as a text button. Its row is reserved on the server so nothing shifts
          when it appears; it never appears with reduced motion or without JavaScript, where it could not work. */}
      <div className="mt-8 flex h-6 justify-center">
        {replayable && (
          <button
            type="button"
            data-r12-again
            onClick={play}
            className="text-sm text-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-foreground"
          >
            {again}
          </button>
        )}
      </div>
    </div>
  )
}
