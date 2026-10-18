'use client'

/**
 * Round 4b (mock, 17-10-2026, owner: "missing colors", "not really cool like the landing page"): FounderD's
 * portrait, drawn in the footer wordmark's dot language (footer/WordmarkLive.tsx) instead of a plain photograph —
 * the About page's other borrowed "moment" from the homepage's vocabulary, this time for a real photo rather than
 * a word.
 *
 * FOUNDER.photoSrc is loaded into an offscreen canvas at the box's rendered size and sampled on a grid (object-fit:
 * cover, like the plain <Image> it replaces). Each cell becomes one dot, sized the same throughout and lit by the
 * pixel's luminance — grey while scattered, brightening to white as it lands, exactly the "landed dot" device
 * WordmarkLive's 'assemble' mode uses (COOL = rgb(244,244,244) at varying opacity reads as grey-to-white against
 * the dark page). 🔴 No warm dots on a portrait (17-10): the first version burned the brightest 3.5% orange like the
 * footer's city lights, and in a portrait the brightest pixels are the face, so the forehead, cheek and chin came out
 * in orange patches. Luminance is normalised to the photo's own range (5th to 99.5th percentile) and each dot is sized
 * and lit by it, a halftone, so a dark night photo still reads.
 *
 * Plays once: the real photo shows until a third of the box is on screen; then it cuts to the scattered dots, which
 * fly to place left to right over ~1.4s (same easing, same per-dot delay-by-x formula as WordmarkLive's 'assemble'),
 * light up, hold for a moment, and the real photo fades back in over them and stays (owner 17-10: "when all the dots
 * assemble, the real picture should show"). Under prefers-reduced-motion the photo is the whole thing: no dots.
 *
 * Deterministic positions (mulberry32, WordmarkLive's own generator) so the scatter is identical on every load.
 * Fills its parent box (`absolute inset-0`, the same contract the plain Image `fill` components on this page use) —
 * Founder.tsx sizes that box up to 276 CSS px wide at the photo's own 552:579 ratio, so object-fit: cover crops
 * nothing in the common case. Before the canvas has a frame to show, or if loading or sampling the photo fails
 * (no CORS, a decode error, a tainted canvas), the real photograph underneath is what's visible — the block is
 * never blank — and the photo keeps the accessible name throughout (hidden by opacity, never removed); the canvas is aria-hidden.
 */
import * as React from 'react'
import Image from 'next/image'
import { FOUNDER } from './content'

const COOL = '244, 244, 244' // Facet's near-white — WordmarkLive's landed-dot colour

type Dot = { x: number; y: number; sx: number; sy: number; delay: number; lum: number }

/** mulberry32 — the same deterministic generator WordmarkLive uses, so the scatter is stable across loads. */
function seeded(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function FounderDots() {
  const wrap = React.useRef<HTMLDivElement>(null)
  const fallback = React.useRef<HTMLDivElement>(null)
  const canvas = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const el = wrap.current
    const cv = canvas.current
    if (!el || !cv) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let dots: Dot[] = []
    let r = 1.5
    let w = 0
    let h = 0
    let raf = 0
    let onScreen = false
    let arrivedAt = -1 // when the box first crossed a third on screen
    let finished = false
    let cancelled = false
    let revealed = false // the real photo has faded back in: final, nothing replays after this

    const img = new window.Image() // not `new Image()`: the local `Image` import above is next/image's component
    img.crossOrigin = 'anonymous' // the CDN sends Access-Control-Allow-Origin: * — needed to read pixels back
    img.decoding = 'async'
    img.src = FOUNDER.photoSrc

    const build = () => {
      // Reduced motion: the real photo is the final state, so it stays and no dots are drawn at all.
      if (cancelled || revealed || reduce.matches) return
      w = el.clientWidth
      h = el.clientHeight
      if (!w || !h || !img.naturalWidth) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      cv.style.opacity = '1'
      cv.style.width = `${w}px`
      cv.style.height = `${h}px`

      // Draw the photo at the box's rendered size, object-fit: cover, and sample THAT — so the grid is in CSS px,
      // independent of devicePixelRatio, and matches what the fallback <Image> shows.
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const o = off.getContext('2d', { willReadFrequently: true })
      if (!o) return
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      o.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
      let data: Uint8ClampedArray
      try {
        data = o.getImageData(0, 0, w, h).data
      } catch {
        return // tainted canvas (no CORS) — the real photo underneath stays visible
      }

      const gap = Math.max(4, Math.min(5, w / 65)) // ~4-5 CSS px at ~300 CSS px wide
      r = gap * 0.46
      const rnd = seeded(11)
      const built: Dot[] = []
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const i = (Math.floor(y) * w + Math.floor(x)) * 4
          const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
          built.push({ x, y, sx: rnd() * w, sy: rnd() * h, delay: (x / w) * 0.55 + rnd() * 0.25, lum })
        }
      }
      // Normalise to the photo's own range so a dark night photo uses the whole scale (5th to 99.5th percentile).
      const sorted = built.map((d) => d.lum).sort((a, b) => a - b)
      const lo = sorted[Math.floor(sorted.length * 0.05)] ?? 0
      const hi = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.995))] ?? 1
      for (const d of built) d.lum = hi > lo ? Math.min(1, Math.max(0, (d.lum - lo) / (hi - lo))) : d.lum
      dots = built
      finished = false
      // The real photo stays until the dots actually start to arrive (review 17-10): before that, an unscrolled page,
      // a link preview or a crawler's capture must show the photograph, not a faint scatter. Reduced motion draws the
      // landed portrait at once, so it swaps immediately.
      if (arrivedAt >= 0) hidePhoto()
      draw(performance.now())
      if (onScreen && !raf && !reduce.matches && arrivedAt >= 0) raf = requestAnimationFrame(loop)
    }

    // opacity, not visibility: the photo keeps its alt text in the accessibility tree, so the page has one accessible
    // name for the portrait at every moment and the canvas stays decorative (aria-hidden).
    const hidePhoto = () => {
      const f = fallback.current
      if (!f) return
      f.style.transition = 'none' // a cut, as the footer's wordmark does
      f.style.opacity = '0'
    }
    // Owner 17-10: "when all the dots assemble, the real picture should show". A short hold on the assembled dots,
    // then the photograph fades in over them on Facet's curve and stays.
    // The canvas sits ABOVE the photo, so the photo fading in alone left the assembled dots on top of it (owner 17-10:
    // "the dots above the image don't disappear when they have assembled"). A crossfade: photo in, dots out, together.
    const showPhoto = () => {
      const f = fallback.current
      const fade = 'opacity 900ms cubic-bezier(0.32, 0.72, 0, 1)'
      if (f) {
        f.style.transition = fade
        f.style.opacity = '1'
      }
      cv.style.transition = fade
      cv.style.opacity = '0'
    }

    const dot = (ctx: CanvasRenderingContext2D, x: number, y: number, rad: number, rgb: string, a: number) => {
      if (a <= 0.004 || rad <= 0) return
      ctx.fillStyle = `rgba(${rgb}, ${a.toFixed(3)})`
      ctx.beginPath()
      ctx.arc(x, y, rad, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = (t: number) => {
      const ctx = cv.getContext('2d')
      if (!ctx) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const still = reduce.matches
      if (!still && arrivedAt < 0) return // not arrived yet: nothing on the canvas, the photo shows
      let allLanded = true
      for (const d of dots) {
        let e = 1
        if (!still) {
          e = arrivedAt < 0 ? 0 : Math.min(1, Math.max(0, ((t - arrivedAt) / 1000 - d.delay) / 1.4))
          e = 1 - Math.pow(1 - e, 4)
        }
        const x = d.sx + (d.x - d.sx) * e
        const y = d.sy + (d.y - d.sy) * e
        const settled = e >= 1
        if (!settled) {
          allLanded = false
          dot(ctx, x, y, r * (0.75 + 0.25 * e), COOL, 0.1 + 0.12 * e)
          continue
        }
        const landedFor = still ? 9 : (t - arrivedAt) / 1000 - d.delay - 1.4
        const on = Math.min(1, Math.max(0, landedFor / 0.5))
        if (on < 1) allLanded = false
        // Halftone: size and light both follow the normalised luminance; dark areas fall back to faint pinpoints.
        const k = Math.pow(d.lum, 0.9)
        dot(ctx, x, y, r * (0.45 + 0.6 * k), COOL, (0.05 + 0.9 * k) * on + (0.08 + 0.2 * k) * (1 - on))
      }
      if (allLanded && !finished) {
        finished = true
        window.setTimeout(() => {
          if (cancelled) return
          revealed = true
          showPhoto()
        }, 350)
      }
    }

    const loop = (t: number) => {
      draw(t)
      raf = onScreen && !finished && !reduce.matches && arrivedAt >= 0 ? requestAnimationFrame(loop) : 0
    }

    const io = new IntersectionObserver(
      (es) => {
        const e = es[0]
        onScreen = e.isIntersecting
        if (arrivedAt < 0 && e.intersectionRatio >= 0.33) {
          arrivedAt = performance.now()
          if (dots.length) hidePhoto()
        }
        if (onScreen && !raf && !finished && !reduce.matches && dots.length && arrivedAt >= 0) raf = requestAnimationFrame(loop)
      },
      { threshold: [0, 0.33, 0.66, 1] },
    )
    io.observe(el)

    const ro = new ResizeObserver(() => {
      if (img.complete && img.naturalWidth) build()
    })
    ro.observe(el)

    if (img.complete && img.naturalWidth) build()
    else {
      img.onload = () => build()
      img.onerror = () => {} // loading failed — the real photo underneath stays visible, canvas never draws
    }

    return () => {
      cancelled = true
      img.onload = null
      img.onerror = null
      io.disconnect()
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={wrap} className="absolute inset-0">
      <div ref={fallback} className="absolute inset-0">
        <Image src={FOUNDER.photoSrc} alt={FOUNDER.photoAlt} fill unoptimized sizes="276px" className="object-cover" />
      </div>
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
    </div>
  )
}
