'use client'

/**
 * Round 3b, C1 and C2 (mock, 16-10): the footer wordmark, alive.
 *  - 'dots'      C1: the word drawn as a dot matrix, like the hero's dotted globe, with a slow band of warm light (the
 *                hero's city-light colour) sweeping across. Canvas; the faint SVG word underneath is the resting
 *                state before JavaScript and is hidden once the dots are drawn.
 *  - 'spotlight' C2: the faint word, and a second copy filled warm white to orange that shows only inside a soft
 *                light following the pointer; with no pointer (phones, idle) the light drifts slowly along the word.
 * Reduced motion: no sweep and no drift (the dots stay still; the spotlight rests on the word's centre). The canvas
 * loop runs only while the wordmark is on screen.
 */
import * as React from 'react'
import { WM } from './wordmark-geom'

function FlatWord({ textRef, className }: { textRef?: React.Ref<SVGTextElement>; className: string }) {
  return (
    <svg viewBox={`0 0 ${WM.w} ${WM.h}`} className={`-mb-px block h-auto w-full select-none ${className}`} aria-hidden="true">
      <text ref={textRef} x={WM.x} y={WM.y} fontSize={WM.size} fontWeight={600} letterSpacing={WM.spacing} fill="currentColor" className="font-display">
        {WM.word}
      </text>
    </svg>
  )
}

/** Deterministic randomness (mulberry32), so every load of the page draws the same field. */
function seeded(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * How the dots behave (Round 3b C1, then Round 3c on the owner's "i like C1 · Dot matrix. - try something else"):
 *  - 'band'     C1: a diagonal band of warm light sweeps across every 7 s
 *  - 'cursor'   C1a: dots near the pointer swell and warm; with no pointer for 1.5 s, the band
 *  - 'twinkle'  C1b: every dot on its own slow rhythm, ~3.5 % burning brighter and warmer, like the hero's cities
 *  - 'assemble' C1c: scattered like stars until the wordmark is a third on screen, then they fly into the word
 *               (left to right, ~1.4 s each, eased), grey in flight, and switch on to white as they land, then a
 *               quiet twinkle. Once per page view.
 */
export type DotMode = 'band' | 'cursor' | 'twinkle' | 'assemble'
/**
 * Round 3d, a hint of the brand orange (owner: "i like c1c but can we add a hint of orange ... our brand color?"):
 *  - 'tittle'  the dots that form the dot of the "i" settle in brand orange: one orange point. No glow (owner, 16-10:
 *              "remove the glow around the orange dotted I")
 *  - 'embers'  the ~3.5 % brighter "city" dots twinkle orange instead of warm white
 *  - 'flight'  dots fly in orange and cool to grey over 0.9 s as they land: orange only during the arrival
 */
export type DotAccent = 'none' | 'tittle' | 'embers' | 'flight'
type Dot = { x: number; y: number; sx: number; sy: number; ph: number; sp: number; city: boolean; delay: number; tittle: boolean; col: number; row: number }
const WARM = '255, 231, 200'
const COOL = '244, 244, 244'
const BRAND = '253, 94, 15' // Facet's brand orange, #FD5E0F

function Dots({ mode, accent = 'none' }: { mode: DotMode; accent?: DotAccent }) {
  const wrap = React.useRef<HTMLDivElement>(null)
  const canvas = React.useRef<HTMLCanvasElement>(null)
  const probe = React.useRef<SVGTextElement>(null)

  React.useEffect(() => {
    const el = wrap.current
    const cv = canvas.current
    if (!el || !cv) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const footer = el.closest('footer') ?? el
    let dots: Dot[] = []
    let w = 0
    let h = 0
    let r = 1.5
    let raf = 0
    let onScreen = false
    let arrivedAt = -1 // 'assemble': when the wordmark first came into view
    let ptr: { x: number; y: number; t: number } | null = null
    let tittle = { x: 0, y: 0, rad: 0 }
    const t0 = performance.now()

    const build = () => {
      w = el.clientWidth
      h = Math.round((w * WM.h) / WM.w)
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      cv.style.height = `${h}px`
      const s = w / WM.w
      // draw the word off-screen at the rendered size and sample it on a grid
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const o = off.getContext('2d')
      if (!o || !probe.current) return
      o.font = `600 ${WM.size * s}px ${getComputedStyle(probe.current).fontFamily}`
      ;(o as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${WM.spacing * s}px`
      o.fillStyle = '#fff'
      o.fillText(WM.word, WM.x * s, WM.y * s)
      const data = o.getImageData(0, 0, w, h).data
      const gap = Math.max(3.5, 8 * s)
      r = gap * 0.27
      const rnd = seeded(7)
      dots = []
      let row = 0
      for (let y = gap / 2; y < h; y += gap, row++) {
        let col = 0
        for (let x = gap / 2; x < w; x += gap, col++)
          if (data[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 127)
            dots.push({
              col,
              row,
              tittle: false,
              x,
              y,
              sx: rnd() * w,
              sy: rnd() * h,
              ph: rnd() * Math.PI * 2,
              sp: 0.5 + rnd() * 1.3,
              city: rnd() < 0.035,
              delay: (x / w) * 0.55 + rnd() * 0.25,
            })
      }
      // The dot of the "i": the small group of touching dots near the top of the word (8-neighbour components on the
      // sampling grid; every other letter is one large group). Found from the drawn word, not hard-coded coordinates.
      const at = new Map(dots.map((d, i) => [`${d.col},${d.row}`, i]))
      const seen = new Set<number>()
      let best: number[] | null = null
      for (let i = 0; i < dots.length; i++) {
        if (seen.has(i)) continue
        const group: number[] = []
        const stack = [i]
        seen.add(i)
        while (stack.length) {
          const k = stack.pop() as number
          group.push(k)
          for (let dc = -1; dc <= 1; dc++)
            for (let dr = -1; dr <= 1; dr++) {
              const n = at.get(`${dots[k].col + dc},${dots[k].row + dr}`)
              if (n !== undefined && !seen.has(n)) {
                seen.add(n)
                stack.push(n)
              }
            }
        }
        const top = Math.min(...group.map((k) => dots[k].y))
        if (group.length < dots.length * 0.05 && top < h * 0.35 && (!best || top < Math.min(...best.map((k) => dots[k].y)))) best = group
      }
      if (best) {
        best.forEach((k) => (dots[k].tittle = true))
        const xs = best.map((k) => dots[k].x)
        const ys = best.map((k) => dots[k].y)
        tittle = { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2, rad: Math.max(...xs) - Math.min(...xs) }
        el.dataset.tittle = String(best.length)
      }
      const ctx = cv.getContext('2d')
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
      el.dataset.ready = '1'
      draw(performance.now())
    }

    const dot = (ctx: CanvasRenderingContext2D, x: number, y: number, rad: number, rgb: string, a: number) => {
      ctx.fillStyle = `rgba(${rgb}, ${a.toFixed(3)})`
      ctx.beginPath()
      ctx.arc(x, y, rad, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = (t: number) => {
      const ctx = cv.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      const still = reduce.matches
      const secs = (t - t0) / 1000
      const band = still ? -1e9 : ((secs / 7) % 1) * (w + 600) - 300
      const usePtr = mode === 'cursor' && ptr && t - ptr.t < 1500
      for (const d of dots) {
        const tw = still ? 0.5 : 0.5 + 0.5 * Math.sin(secs * d.sp + d.ph)
        if (mode === 'band' || mode === 'cursor') {
          const k = usePtr && ptr
            ? Math.max(0, 1 - Math.hypot(d.x - ptr.x, d.y - ptr.y) / 150)
            : Math.max(0, 1 - Math.abs(d.x + d.y * 0.5 - band) / 170)
          dot(ctx, d.x, d.y, r * (1 + 0.45 * k), k > 0.02 ? WARM : COOL, 0.16 + 0.62 * k * k)
        } else if (mode === 'twinkle') {
          if (d.city) dot(ctx, d.x, d.y, r * 1.35, WARM, 0.35 + 0.5 * tw)
          else dot(ctx, d.x, d.y, r, COOL, 0.1 + 0.24 * tw * tw * tw)
        } else {
          // assemble: eased flight from the scattered start to the word, then a quiet twinkle
          let e = 1
          if (!still) {
            if (arrivedAt < 0) e = 0
            else e = Math.min(1, Math.max(0, ((t - arrivedAt) / 1000 - d.delay) / 1.4))
            e = 1 - Math.pow(1 - e, 4)
          }
          const drift = e === 0 && !still ? Math.sin(secs * 0.4 + d.ph) * 6 : 0
          const x = d.sx + (d.x - d.sx) * e + drift
          const y = d.sy + (d.y - d.sy) * e
          const settled = e >= 1
          if (accent === 'tittle' && d.tittle) {
            // the one orange point: lands like the others, then holds in brand orange
            dot(ctx, x, y, r * (settled ? 1.25 : 0.8 + 0.3 * e), BRAND, settled ? 0.95 : 0.25 + 0.6 * e)
            continue
          }
          if (accent === 'flight' && !still) {
            // orange in flight, cooling to grey over 0.9 s after landing
            const landed = arrivedAt < 0 ? -1 : (t - arrivedAt) / 1000 - d.delay - 1.4
            const heat = arrivedAt < 0 ? 0 : landed < 0 ? 1 : Math.max(0, 1 - landed / 0.9)
            if (heat > 0) {
              dot(ctx, x, y, r * (0.85 + 0.3 * e), BRAND, 0.25 + 0.6 * heat)
              continue
            }
          }
          // Owner, 17-10: "grey when assembling & white when done assembled". Dim grey while scattered and in flight;
          // each dot switches on over 0.5 s as it lands (so the word lights up left to right, in arrival order) and
          // rests at 55–70 % white, the city dots brighter; under reduced motion the word is lit at once.
          if (!settled) {
            dot(ctx, x, y, r * (0.8 + 0.3 * e), COOL, 0.12 + 0.1 * e)
          } else {
            const landedFor = still ? 9 : (t - arrivedAt) / 1000 - d.delay - 1.4
            const on = Math.min(1, Math.max(0, landedFor / 0.5))
            const rest = d.city ? (accent === 'embers' ? 0.45 + 0.5 * tw : 0.7 + 0.3 * tw) : 0.55 + 0.15 * tw * tw
            dot(ctx, x, y, r, d.city ? (accent === 'embers' ? BRAND : WARM) : COOL, 0.22 + (rest - 0.22) * on)
          }
        }
      }
    }

    const loop = (t: number) => {
      draw(t)
      raf = onScreen && !reduce.matches ? requestAnimationFrame(loop) : 0
    }
    const io = new IntersectionObserver(
      (es) => {
        const e = es[0]
        onScreen = e.isIntersecting
        if (mode === 'assemble' && arrivedAt < 0 && e.intersectionRatio >= 0.33) arrivedAt = performance.now()
        if (onScreen && !raf && !reduce.matches) raf = requestAnimationFrame(loop)
      },
      { threshold: [0, 0.33, 0.66, 1] },
    )
    io.observe(el)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const b = cv.getBoundingClientRect()
      ptr = { x: e.clientX - b.left, y: e.clientY - b.top, t: performance.now() }
    }
    if (mode === 'cursor') footer.addEventListener('pointermove', onMove as EventListener)
    const ro = new ResizeObserver(() => build())
    ro.observe(el)
    document.fonts?.ready.then(build).catch(() => {})
    return () => {
      io.disconnect()
      ro.disconnect()
      footer.removeEventListener('pointermove', onMove as EventListener)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [mode, accent])

  return (
    <div ref={wrap} data-wm="dots" data-wm-mode={mode} data-wm-accent={accent} className="relative">
      <FlatWord textRef={probe} className="wm-fallback text-foreground/[0.07]" />
      <canvas ref={canvas} className="absolute inset-x-0 top-0 block w-full" aria-hidden="true" />
    </div>
  )
}

function Spotlight() {
  const wrap = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = wrap.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const footer = el.closest('footer') ?? el
    let lastMove = -1e9
    let raf = 0
    const t0 = performance.now()
    const set = (x: number, y: number) => {
      el.style.setProperty('--mx', `${x.toFixed(1)}px`)
      el.style.setProperty('--my', `${y.toFixed(1)}px`)
    }
    const centre = () => set(el.clientWidth / 2, el.clientHeight * 0.62)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const b = el.getBoundingClientRect()
      lastMove = performance.now()
      set(e.clientX - b.left, e.clientY - b.top)
    }
    const drift = (t: number) => {
      // with no pointer for 1.5 s, the light drifts along the word on its own
      if (t - lastMove > 1500) {
        const p = ((t - t0) / 9000) * Math.PI * 2
        set(el.clientWidth * (0.5 + 0.42 * Math.sin(p)), el.clientHeight * (0.6 + 0.12 * Math.sin(p * 2)))
      }
      raf = requestAnimationFrame(drift)
    }
    centre()
    if (!reduce.matches) {
      footer.addEventListener('pointermove', onMove as EventListener)
      raf = requestAnimationFrame(drift)
    }
    return () => {
      footer.removeEventListener('pointermove', onMove as EventListener)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={wrap} data-wm="spotlight" className="relative">
      <FlatWord className="text-foreground/[0.07]" />
      <svg viewBox={`0 0 ${WM.w} ${WM.h}`} className="wm-lit absolute inset-0 block h-auto w-full select-none" aria-hidden="true">
        <defs>
          <linearGradient id="wm-lit-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE7C8" />
            <stop offset="0.55" stopColor="#FFB36B" />
            <stop offset="1" stopColor="#FD5E0F" />
          </linearGradient>
        </defs>
        <text x={WM.x} y={WM.y} fontSize={WM.size} fontWeight={600} letterSpacing={WM.spacing} fill="url(#wm-lit-fill)" className="font-display">
          {WM.word}
        </text>
      </svg>
    </div>
  )
}

export function WordmarkLive({ variant, accent = 'none' }: { variant: 'dots' | 'spotlight' | DotMode; accent?: DotAccent }) {
  if (variant === 'spotlight') return <Spotlight />
  return <Dots mode={variant === 'dots' ? 'band' : variant} accent={accent} />
}
