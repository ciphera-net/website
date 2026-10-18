/**
 * Option C (mock): the three facts are the hero - a centred, typographic layout, no split grid and no
 * bled image. "Pulse Analytics" and the product shot come second, as supporting evidence, not the lead
 * visual. Copy is a DRAFT; every fact matches Option A (audit §5.7).
 */
import Image from 'next/image'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { pulseIcon } from '@/lib/images'
import { Reveal } from '../Reveal'
import { cdnUrl } from '@/lib/cdn'

const FACTS = [
  { value: '75', label: 'platforms it plugs into' },
  { value: '2.7 KB', label: 'script, gzipped' },
  { value: 'Free', label: 'forever on the Personal plan' },
]

export function WhatWeBuildC() {
  return (
    <section
      id="products"
      data-mock-section="products"
      className="scroll-mt-24 border-t border-border px-6 py-24 sm:px-10 lg:py-32"
    >
      <Reveal>
        <p className="text-center text-sm text-muted-foreground">What we build</p>
        <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
          {FACTS.map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-2 px-6 text-center">
              <dd className="font-display text-5xl font-semibold tabular-nums tracking-[-0.02em] text-foreground sm:text-6xl">
                {f.value}
              </dd>
              <dt className="text-sm text-muted-foreground">{f.label}</dt>
            </div>
          ))}
        </dl>
      </Reveal>
      <Reveal delay={60} className="mx-auto mt-16 max-w-2xl text-center lg:mt-20">
        <div className="inline-flex items-center gap-3">
          <Image src={pulseIcon} alt="" width={22} height={32} unoptimized className="h-8 w-auto" />
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Pulse Analytics
          </span>
        </div>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Web analytics that shows how your site is doing without cookies and without following anyone. Hosted in
          Switzerland.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://pulse.ciphera.net"
            className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[#E54E00]"
          >
            Visit pulse.ciphera.net <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="https://pulse.ciphera.net/demo"
            className="inline-flex h-11 items-center gap-2 border border-border px-5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-accent"
          >
            Live demo
          </a>
        </div>
      </Reveal>
      <Reveal delay={120} className="mx-auto mt-16 max-w-4xl lg:mt-20">
        <figure className="border border-white/[0.08] bg-card p-1.5">
          <div className="flex items-center justify-between border-b border-border px-3 py-2 text-xs text-muted-foreground">
            <span>ciphera.net · last 30 days</span>
            <span>Live demo, collected without cookies</span>
          </div>
          <Image
            src={cdnUrl('/overhaul/pulse-dashboard-home-16-10-2026.png')}
            alt="The Pulse Analytics dashboard for ciphera.net: unique visitors, pageviews, pages per visit, bounce rate and visit duration over the last 30 days"
            width={2210}
            height={1030}
            unoptimized
            className="block h-auto w-full"
          />
        </figure>
      </Reveal>
    </section>
  )
}
