'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { track } from '@/lib/pulse'
import { sustainabilityHeroBg } from '@/lib/images'
import type { ImpactReport } from './types'
import { CountUpNumber } from './count-up-number'
import { SourceBadge } from './source-badge'

interface SustainabilityHeroProps {
  report: ImpactReport
}

interface Beam {
  x: number
  y: number
  width: number
  length: number
  angle: number
  speed: number
  opacity: number
  pulse: number
  pulseSpeed: number
  layer: number
}

function createBeam(width: number, height: number, layer: number): Beam {
  const angle = -35 + Math.random() * 10
  const baseSpeed = 0.2 + layer * 0.2
  const baseOpacity = 0.03 + layer * 0.02
  const baseWidth = 10 + layer * 5
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    width: baseWidth,
    length: height * 2.5,
    angle,
    speed: baseSpeed + Math.random() * 0.2,
    opacity: baseOpacity + Math.random() * 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.015,
    layer,
  }
}

/**
 * Section 1 — Full-bleed animated canvas beam hero with a count-up CO2e
 * number and two CTAs. Adapted from PremiumHero — same brand-orange beam
 * gradient, no logo carousel (homepage only), no noise canvas (kept the
 * signal cleaner for a numbers-focused page).
 *
 * The hero number is formatted based on magnitude: under 1 kg shows grams,
 * 1-999 kg shows kg, over 1000 kg shows tonnes. Reformats as CountUpNumber
 * animates.
 */
export function SustainabilityHero({ report }: SustainabilityHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const beamsRef = useRef<Beam[]>([])
  const animationFrameRef = useRef<number>(0)

  const LAYERS = 3
  const BEAMS_PER_LAYER = 8

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      const scale = 0.5

      canvas.width = w * scale
      canvas.height = h * scale
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(scale, scale)

      beamsRef.current = []
      for (let layer = 1; layer <= LAYERS; layer++) {
        for (let i = 0; i < BEAMS_PER_LAYER; i++) {
          beamsRef.current.push(createBeam(w, h, layer))
        }
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const drawBeam = (beam: Beam) => {
      ctx.save()
      ctx.translate(beam.x, beam.y)
      ctx.rotate((beam.angle * Math.PI) / 180)

      const pulsingOpacity = Math.min(
        1,
        beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.4),
      )
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length)
      gradient.addColorStop(0, `rgba(253,94,15,0)`)
      gradient.addColorStop(0.2, `rgba(253,94,15,${pulsingOpacity * 0.5})`)
      gradient.addColorStop(0.5, `rgba(253,94,15,${pulsingOpacity})`)
      gradient.addColorStop(0.8, `rgba(253,94,15,${pulsingOpacity * 0.5})`)
      gradient.addColorStop(1, `rgba(253,94,15,0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length)
      ctx.restore()
    }

    const animate = () => {
      if (!canvas || !ctx) return

      // * Transparent clear so the Swiss mountain photo behind the canvas
      // * shows through. The dark "background" color is provided by the
      // * overlay div layer, not by the canvas fill.
      ctx.clearRect(0, 0, container.clientWidth, container.clientHeight)

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed * (beam.layer / LAYERS + 0.5)
        beam.pulse += beam.pulseSpeed
        if (beam.y + beam.length < -50) {
          beam.y = container.clientHeight + 50
          beam.x = Math.random() * container.clientWidth
        }
        drawBeam(beam)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  const co2eKg = report.totals.co2e.amount
  // * Pick a display unit and convert the amount accordingly
  let displayAmount = co2eKg
  let displayUnit = 'kg'
  let decimals = 2
  if (co2eKg < 1) {
    displayAmount = co2eKg * 1000
    displayUnit = 'g'
    decimals = 0
  } else if (co2eKg >= 1000) {
    displayAmount = co2eKg / 1000
    displayUnit = 't'
    decimals = 2
  }

  return (
    <section
      ref={containerRef}
      className="relative -mt-[88px] min-h-screen flex items-center pt-[88px] pb-20 lg:pb-32 bg-neutral-950 overflow-hidden"
    >
      {/* * Layer 0 — full-bleed Swiss mountain photograph */}
      <img
        src={sustainabilityHeroBg.src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 w-full h-full object-cover"
      />
      {/* * Layer 1 — dark overlay to bring the photo down to a readable
        * contrast level for the white text and the count-up number */}
      <div className="absolute inset-0 z-[1] bg-neutral-950/75" />
      {/* * Layer 2 — canvas beams (transparent clear so the photo shows
        * through between and around the beams) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[2]"
        style={{ filter: 'blur(3px)' }}
      />
      {/* * Layer 3 — bottom fade so the hero blends into the next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40vh] z-[3] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, hsl(0 0% 4%) 0%, hsl(0 0% 4%) 15%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <SourceBadge
          source={report.source}
          periodLabel={report.period.label}
          className="mb-6"
        />

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-8">
          Receipts, not promises.
        </h1>

        <div className="mb-8">
          <div className="flex items-baseline justify-center gap-3">
            <CountUpNumber
              value={displayAmount}
              decimals={decimals}
              className="text-7xl sm:text-8xl md:text-[10rem] font-bold tabular-nums text-white leading-none"
            />
            <span className="text-2xl md:text-4xl font-semibold text-brand-orange">
              {displayUnit}
            </span>
          </div>
          <p className="mt-3 text-sm text-neutral-500">
            CO₂ equivalent · {report.period.label}
          </p>
        </div>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral-400 leading-relaxed">
          Every Ciphera service runs on 100% renewable Swiss hydroelectric power.
          Here&apos;s what that actually costs the planet, measured with life-cycle
          assessment — not estimates.
        </p>

        <div className="flex flex-row gap-3 flex-wrap justify-center">
          <Button
            size="lg"
            className="gap-2 bg-brand-orange-button hover:bg-brand-orange-button-hover text-white"
            asChild
          >
            <Link
              href="#methodology"
              onClick={() => track('sustainability_hero_methodology_click')}
            >
              See the methodology <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-neutral-600 text-white hover:bg-neutral-800 hover:border-neutral-500"
            asChild
          >
            <Link
              href="#footprint"
              onClick={() => track('sustainability_hero_footprint_click')}
            >
              View our footprint
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
