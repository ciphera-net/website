'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRightIcon,
  LockIcon,
  EyeOffIcon,
  EyeIcon,
  GlobeIcon,
} from '@ciphera-net/facet'
import { cn } from '@/lib/utils'

// * The four values live here (not in the server page) because this is a client
// * component and icon components can't cross the server→client prop boundary.
const VALUES = [
  {
    icon: LockIcon,
    title: 'We can’t read your data',
    description:
      'Your vault is encrypted on your device before it reaches us, and your password is proven with OPAQUE — never sent. We store ciphertext, not your keys, so we couldn’t read your data if we tried. Not even under a court order.',
  },
  {
    icon: EyeOffIcon,
    title: 'We collect almost nothing',
    description:
      'Pulse counts visitors with no cookies, no fingerprinting, and no cross-visit identifiers. There’s no profile to leak, sell, or hand over — because we never build one. Collecting less is the default, not a setting.',
  },
  {
    icon: EyeIcon,
    title: 'You can check our work',
    description:
      'Our cryptographic core is open source, our warrant canary is public, and we publish a transparency report. Don’t take the claims on faith — read the code and the receipts.',
    href: '/trust',
    linkLabel: 'See the trust hub',
  },
  {
    icon: GlobeIcon,
    title: 'You can walk away',
    description:
      'You own your keys and your data. Export it or delete it whenever you want — there’s no lock-in and nothing for us to hold hostage, because we can’t read it in the first place.',
  },
] as const

/**
 * Scroll-driven Values section. A sticky index rail (left) tracks scroll while
 * the four values advance one at a time on the right — the active one lights up,
 * the rest dim. Built from the site's index-number + border vocabulary.
 *
 * Robustness: before mount (and with JS off) every value renders at full
 * opacity, so nothing is hidden without JS. Under prefers-reduced-motion the
 * dimming and transitions are disabled — all four stay fully visible.
 */
export default function ValuesScroll() {
  const [active, setActive] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [reduced, setReduced] = useState(false)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    setMounted(true)
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
        }
      },
      // A step becomes active once it crosses the vertical middle of the viewport.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    stepRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="border-b border-border">
      <div className="grid px-6 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
        {/* Sticky index rail (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-0 flex h-screen flex-col justify-center py-16">
            <p className="text-xs text-muted-foreground">02 · Values</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              What we stand for
            </h2>
            <ol className="mt-10 border-l border-border">
              {VALUES.map((v, i) => {
                const on = mounted && !reduced && i === active
                return (
                  <li key={v.title}>
                    <button
                      type="button"
                      onClick={() =>
                        stepRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }
                      className="group flex w-full items-center gap-3 py-2.5 pl-4 text-left"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          '-ml-[calc(1rem+1px)] h-7 w-px shrink-0 transition-colors duration-300 motion-reduce:transition-none',
                          on ? 'bg-primary' : 'bg-transparent',
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs tabular-nums transition-colors duration-300 motion-reduce:transition-none',
                          on ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className={cn(
                          'text-sm transition-colors duration-300 motion-reduce:transition-none',
                          on
                            ? 'text-foreground'
                            : 'text-muted-foreground group-hover:text-foreground/80',
                        )}
                      >
                        {v.title}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        {/* Header (mobile only — the desktop header lives in the sticky rail) */}
        <div className="pt-16 lg:hidden">
          <p className="text-xs text-muted-foreground">02 · Values</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">
            What we stand for
          </h2>
        </div>

        {/* Scrolling steps */}
        <div className="pb-16 lg:py-0">
          {VALUES.map((v, i) => {
            const Icon = v.icon
            const on = !mounted || reduced || i === active
            return (
              <div
                key={v.title}
                data-index={i}
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                className="flex min-h-[70vh] flex-col justify-center border-t border-border py-12 lg:min-h-[80vh] lg:border-t-0"
              >
                <div
                  className={cn(
                    'max-w-xl transition-all duration-500 ease-out motion-reduce:transition-none',
                    on ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-30',
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display text-5xl font-semibold tabular-nums text-muted-foreground/40">
                      0{i + 1}
                    </span>
                    <Icon aria-hidden="true" className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {v.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>
                  {'href' in v && (
                    <Link
                      href={v.href}
                      className="mt-6 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {v.linkLabel}
                      <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
