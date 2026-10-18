'use client'

/**
 * Round 2c (mock, 16-10): "How we build" as a scroll-drawn timeline, after the owner's 21st.dev reference (the
 * Hyperiux "Timeline": a pinned section whose track slides sideways while a line draws, stems grow and copy settles).
 * Rebuilt in Facet's idiom rather than pasted:
 *  - no GSAP: one rAF-throttled scroll handler writes a few CSS custom properties on the root; every moving part is
 *    a transform or an opacity derived from them (compositor-only, no layout per frame);
 *  - no stock photo: the section's own heading takes the reference's image slot;
 *  - square geometry, hairlines, Geist; orange only for progress (the drawn line and the reached markers);
 *  - copy is never hidden: it starts DIMMED and settles (plan §4 motion rule 5). Without JavaScript, below lg on the
 *    vertical rail's first paint, or with reduced motion, every custom property falls back to 1: the final state.
 *
 * variant:
 *  - 'track'   pinned; heading, the four rules and the footprint ride one horizontal track; rules alternate above and
 *              below the line on stems that grow away from it (closest to the reference)
 *  - 'tiles'   pinned; the heading stays put and the rules slide underneath on Option B's square icon tiles
 *  - 'inplace' not pinned; the reference's line, stems and alternation laid across the column, drawn while the
 *              section scrolls past
 * Below lg every variant is the same vertical rail, drawn as it scrolls.
 */
import * as React from 'react'
import { Eye, LockKey, MapPin, SignOut } from '@phosphor-icons/react/dist/ssr'
import { HEADING, ProofLink, RULES, ReceiptCaption, ReceiptFigure, ReceiptLedger, type Receipt, type RuleIcon } from '../rules'

const ICONS: Record<RuleIcon, typeof Eye> = { eye: Eye, pin: MapPin, lock: LockKey, out: SignOut }

type Variant = 'track' | 'tiles' | 'inplace'

// Desktop geometry in px, in one place so the layout and the scroll maths cannot disagree.
const INTRO = 460 // the heading's station at the start of the line ('track')
const LEAD_IN = 170 // line between the heading and the first rule
const STEP = 330 // distance between consecutive rules; they alternate sides, so neighbours may overlap a little
const ITEM = 340 // a rule's text column
const TAIL = 90 // line after the last rule
const TRACK_H = 560 // height of the 'track' row; the line runs through its middle
const TILE_W = 320 // a tile column ('tiles')
const TILE_GAP = 110
const TILE_LEAD = 520 // line before the first tile, so it enters from the right of the reading point at every lg width
const READ = 0.5 // where the line's tip sits when the pin starts, as a share of the stage width
const RAMP = 170 // px of line travel over which one rule settles
const VRAMP = 90 // the same on the vertical rail

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const kVar = (name: string) => ({ ['--k' as string]: `var(${name})` }) as React.CSSProperties

export function RuleTimeline({ variant, receipt }: { variant: Variant; receipt: Receipt }) {
  const root = React.useRef<HTMLDivElement>(null)
  const stage = React.useRef<HTMLDivElement>(null)
  const track = React.useRef<HTMLDivElement>(null)
  const line = React.useRef<HTMLDivElement>(null)
  const items = React.useRef<(HTMLDivElement | null)[]>([])
  const rail = React.useRef<HTMLDivElement>(null)
  const railItems = React.useRef<(HTMLDivElement | null)[]>([])
  const pinnable = variant !== 'inplace'
  const marker = variant === 'tiles' ? 32 : 0 // where on an item the line "arrives": a tile's centre, or the stem

  React.useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const desk = window.matchMedia('(min-width: 1024px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = (k: string, v: string) => el.style.setProperty(k, v)
    const VARS = ['--slide', '--line', '--kend', '--k0', '--k1', '--k2', '--k3', '--vline', '--v0', '--v1', '--v2', '--v3']
    let raf = 0
    let shift = 0
    let pinned = false

    const frame = () => {
      raf = 0
      if (reduce.matches) return
      const vh = window.innerHeight
      if (desk.matches) {
        const la = line.current
        if (!la) return
        const L = la.offsetWidth
        let tip: number // how far the drawn line reaches, in px from its start
        if (pinned && stage.current) {
          const r = el.getBoundingClientRect()
          const p = clamp01(-r.top / Math.max(1, r.height - vh))
          set('--slide', `${(-p * shift).toFixed(1)}px`)
          // starts at the reading point and completes exactly as the pin releases
          const t0 = Math.min(L, Math.max(0, READ * stage.current.clientWidth - la.offsetLeft))
          tip = t0 + p * (L - t0)
        } else {
          // in place: drawn while the line itself moves from 85% to 35% of the viewport's height
          const r = la.getBoundingClientRect()
          const y = r.top + r.height / 2
          tip = clamp01((vh * 0.85 - y) / (vh * 0.5)) * L
        }
        set('--line', clamp01(tip / L).toFixed(4))
        set('--kend', clamp01((tip - (L - 24)) / 24).toFixed(3))
        items.current.forEach((it, i) => {
          if (it) set(`--k${i}`, clamp01((tip - it.offsetLeft - marker) / RAMP).toFixed(4))
        })
      } else {
        const rl = rail.current
        if (!rl) return
        const tip = vh * 0.62 - rl.getBoundingClientRect().top
        set('--vline', clamp01(tip / Math.max(1, rl.offsetHeight)).toFixed(4))
        railItems.current.forEach((it, i) => {
          if (it) set(`--v${i}`, clamp01((tip - it.offsetTop) / VRAMP).toFixed(4))
        })
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const sync = () => {
      const motion = !reduce.matches
      pinned = motion && desk.matches && pinnable
      el.dataset.rtMotion = motion ? 'on' : 'off'
      el.dataset.rtPinned = pinned ? 'on' : 'off'
      if (pinned && stage.current && track.current) {
        shift = Math.max(0, track.current.offsetWidth - stage.current.clientWidth)
        el.style.height = `${Math.round(window.innerHeight + shift)}px`
      } else {
        shift = 0
        el.style.height = ''
      }
      if (!motion) VARS.forEach((v) => el.style.removeProperty(v))
      else {
        if (!pinned) el.style.removeProperty('--slide')
        schedule()
      }
    }

    // Keyboard: tabbing to a link that sits off-screen in the pinned track makes the browser scroll the
    // overflow-hidden stage sideways on its own, out of step with --slide. Undo that, and instead scroll the page to
    // the point of the pin where the focused element has slid to the reading position.
    const onFocus = (e: FocusEvent) => {
      const st = stage.current
      const tr = track.current
      if (!pinned || !st || !tr || !(e.target instanceof HTMLElement)) return
      st.scrollLeft = 0
      // Keyboard only: a mouse press focuses the link before mouseup, and scrolling the page there would move the
      // link out from under the cursor and swallow the click. Nothing to do either when it is already in view.
      if (!e.target.matches(':focus-visible')) return
      const r = e.target.getBoundingClientRect()
      const sr = st.getBoundingClientRect()
      if (r.left >= sr.left && r.right <= sr.right) return
      const x = r.left - tr.getBoundingClientRect().left + r.width / 2 // in track coordinates (both include --slide)
      const p = clamp01((x - READ * st.clientWidth) / Math.max(1, shift))
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: Math.round(top + p * (el.offsetHeight - window.innerHeight)), behavior: 'auto' })
    }

    sync()
    document.fonts?.ready.then(sync).catch(() => {})
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', sync)
    desk.addEventListener('change', sync)
    reduce.addEventListener('change', sync)
    const stageEl = stage.current
    stageEl?.addEventListener('focusin', onFocus)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      stageEl?.removeEventListener('focusin', onFocus)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', sync)
      desk.removeEventListener('change', sync)
      reduce.removeEventListener('change', sync)
    }
  }, [pinnable, marker])

  const desktop =
    variant === 'track' ? (
      <TrackRow receipt={receipt} trackRef={track} lineRef={line} items={items} />
    ) : variant === 'tiles' ? (
      <TilesRow receipt={receipt} trackRef={track} lineRef={line} items={items} />
    ) : (
      <InPlaceRow lineRef={line} items={items} />
    )

  const mobile = (
    <div className={pinnable ? 'px-6 py-24 sm:px-10 lg:hidden' : 'lg:hidden'}>
      {pinnable && <Heading />}
      <div ref={rail} className={`relative pl-9 ${pinnable ? 'mt-14' : ''}`}>
        <span aria-hidden="true" className="absolute bottom-0 left-[4px] top-2 w-px bg-white/10" />
        <span aria-hidden="true" className="rt-vline absolute bottom-0 left-[4px] top-2 w-px bg-primary" />
        {RULES.map((r, i) => (
          <div
            key={r.title}
            ref={(n) => {
              railItems.current[i] = n
            }}
            className="relative pb-12 last:pb-0"
            style={kVar(`--v${i}`)}
          >
            <Dot className="-left-9 top-2" />
            <div className="rt-text">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">{r.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{r.desc}</p>
              <div className="mt-4">
                <ProofLink href={r.href}>{r.proof}</ProofLink>
              </div>
            </div>
          </div>
        ))}
      </div>
      {pinnable && receipt && (
        <div className="mt-16">
          <ReceiptLedger r={receipt} />
        </div>
      )}
    </div>
  )

  if (!pinnable)
    return (
      <div ref={root} data-rt="" className="relative">
        <div className="hidden lg:block">{desktop}</div>
        {mobile}
      </div>
    )

  return (
    <section ref={root} id="how" data-mock-section="how" data-rt="" className="relative scroll-mt-24 border-t border-border">
      <div ref={stage} data-rt-stage="" className="hidden overflow-x-auto py-24 lg:block">
        {desktop}
      </div>
      {mobile}
    </section>
  )
}

function Heading({ big = false }: { big?: boolean }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{HEADING.eyebrow}</p>
      <h2
        className={`mt-4 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.035em] text-foreground ${big ? 'text-5xl' : 'text-4xl sm:text-5xl'}`}
      >
        {HEADING.title}
      </h2>
    </div>
  )
}

/** A status dot (Facet's one sanctioned round shape): neutral, with the orange "reached" state faded in by --k. */
function Dot({ className, k = true }: { className: string; k?: boolean }) {
  return (
    <>
      <span aria-hidden="true" className={`absolute h-[9px] w-[9px] rounded-full bg-line-hover ${className}`} />
      <span aria-hidden="true" className={`${k ? 'rt-on' : ''} absolute h-[9px] w-[9px] rounded-full bg-primary ${className}`} />
    </>
  )
}

function Line({ endVar = true }: { endVar?: boolean }) {
  return (
    <>
      <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
      <span aria-hidden="true" className="rt-line absolute inset-x-0 top-1/2 h-px bg-primary" />
      <span aria-hidden="true" className="absolute left-0 top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-line-hover" />
      <span aria-hidden="true" className="rt-start absolute left-0 top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
      <span aria-hidden="true" style={endVar ? kVar('--kend') : undefined} className="absolute right-0 top-1/2 h-[9px] w-[9px] -translate-y-1/2 translate-x-1/2 rounded-full bg-line-hover" />
      <span aria-hidden="true" style={endVar ? kVar('--kend') : undefined} className="rt-on absolute right-0 top-1/2 h-[9px] w-[9px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary" />
    </>
  )
}

/** One rule on a stem: above the line (stem grows up to a dot beside the title) or below (grows down). */
function Station({
  i,
  up,
  left,
  width,
  items,
}: {
  i: number
  up: boolean
  left: number | string
  width: number | string
  items: React.MutableRefObject<(HTMLDivElement | null)[]>
}) {
  const r = RULES[i]
  return (
    <div
      ref={(n) => {
        items.current[i] = n
      }}
      className="absolute h-1/2"
      style={{ left, width, top: up ? 0 : '50%', ...kVar(`--k${i}`) }}
    >
      <span
        aria-hidden="true"
        className={`rt-stem absolute left-0 w-px bg-white/25 ${up ? 'bottom-0 top-[6px] origin-bottom' : 'bottom-[6px] top-0 origin-top'}`}
      />
      <Dot className={`left-0 -translate-x-1/2 ${up ? 'top-[2px]' : 'bottom-[2px]'}`} />
      <div className={`rt-text flex h-full flex-col pl-7 ${up ? 'justify-start pb-10' : 'justify-end pt-10'}`}>
        <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">{r.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{r.desc}</p>
        <div className="mt-4">
          <ProofLink href={r.href}>{r.proof}</ProofLink>
        </div>
      </div>
    </div>
  )
}

type RowProps = {
  receipt: Receipt
  trackRef: React.RefObject<HTMLDivElement>
  lineRef: React.RefObject<HTMLDivElement>
  items: React.MutableRefObject<(HTMLDivElement | null)[]>
}

function TrackRow({ receipt, trackRef, lineRef, items }: RowProps) {
  const L = INTRO + LEAD_IN + 3 * STEP + ITEM + TAIL
  return (
    <div ref={trackRef} data-rt-track="" className="relative flex w-max px-10">
      <div ref={lineRef} className="relative shrink-0" style={{ width: L, height: TRACK_H }}>
        <Line />
        <div className="absolute left-0 top-0 flex h-1/2 flex-col justify-end pb-9" style={{ width: INTRO - 40 }}>
          <Heading big />
        </div>
        <div className="absolute left-0 top-1/2 pt-9" style={{ width: INTRO - 60 }}>
          <p className="text-lg leading-relaxed text-muted-foreground">{HEADING.lead}</p>
        </div>
        {RULES.map((r, i) => (
          <Station key={r.title} i={i} up={i % 2 === 0} left={INTRO + LEAD_IN + i * STEP} width={ITEM} items={items} />
        ))}
      </div>
      {receipt && (
        <div className="relative shrink-0 pl-16" style={{ width: 460, height: TRACK_H }}>
          <div className="flex h-1/2 flex-col justify-end pb-7">
            <ReceiptFigure r={receipt} />
          </div>
          <div className="flex flex-col gap-3 pt-7">
            <ReceiptCaption r={receipt} />
            <ProofLink href="/sustainability">How we measure it</ProofLink>
          </div>
        </div>
      )}
    </div>
  )
}

function TilesRow({ receipt, trackRef, lineRef, items }: RowProps) {
  return (
    <div>
      <div className="px-10">
        <Heading big />
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{HEADING.lead}</p>
      </div>
      <div ref={trackRef} data-rt-track="" className="relative mt-16 flex w-max px-10">
        <div ref={lineRef} className="relative flex shrink-0" style={{ gap: TILE_GAP, paddingLeft: TILE_LEAD, paddingRight: TAIL }}>
          <span aria-hidden="true" className="absolute inset-x-0 top-8 h-px bg-white/10" />
          <span aria-hidden="true" className="rt-line absolute inset-x-0 top-8 h-px bg-primary" />
          {RULES.map((r, i) => {
            const Icon = ICONS[r.icon]
            return (
              <div
                key={r.title}
                ref={(n) => {
                  items.current[i] = n
                }}
                className="relative shrink-0"
                style={{ width: TILE_W, ...kVar(`--k${i}`) }}
              >
                <span className="relative z-10 inline-flex h-16 w-16 items-center justify-center border border-border bg-background">
                  <span aria-hidden="true" className="rt-on absolute -inset-px border border-primary" />
                  <Icon className="rt-icon h-7 w-7 text-foreground" aria-hidden="true" />
                </span>
                <div className="rt-text mt-6">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">{r.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{r.desc}</p>
                  <div className="mt-5">
                    <ProofLink href={r.href}>{r.proof}</ProofLink>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {receipt && (
          <div className="flex w-[420px] shrink-0 flex-col gap-3 border-l border-border pl-12 pt-3">
            <ReceiptFigure r={receipt} size="md" />
            <ReceiptCaption r={receipt} />
            <ProofLink href="/sustainability">How we measure it</ProofLink>
          </div>
        )}
      </div>
    </div>
  )
}

function InPlaceRow({ lineRef, items }: Pick<RowProps, 'lineRef' | 'items'>) {
  return (
    <div ref={lineRef} className="relative" style={{ height: TRACK_H + 40 }}>
      <Line />
      {RULES.map((r, i) => (
        <Station key={r.title} i={i} up={i % 2 === 0} left={`${i * 22.67}%`} width="32%" items={items} />
      ))}
    </div>
  )
}
