/**
 * Round 2: What we build. One showcase (D11): Pulse, with a fresh capture of the public demo (16-10-2026, ciphera.net's
 * own traffic). Every figure is a measured fact (audit §5.7). Copy is a DRAFT.
 */
import Image from 'next/image'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { pulseIcon } from '@/lib/images'
import { Section } from './Section'
import { Reveal } from './Reveal'
import { cdnUrl } from '@/lib/cdn'

const FACTS = [
  { value: '75', label: 'platforms it plugs into' },
  { value: '2.7 KB', label: 'script, gzipped' },
  { value: 'Free', label: 'forever on the Personal plan' },
]

export function WhatWeBuild() {
  return (
    <Section
      id="products"
      eyebrow="What we build"
      title={
        <span className="inline-flex items-center gap-4">
          <Image src={pulseIcon} alt="" width={30} height={44} unoptimized className="h-10 w-auto sm:h-11" />
          Pulse Analytics
        </span>
      }
      lead="Our product: web analytics that shows how your site is doing without cookies and without following anyone. Hosted in Switzerland."
      aside={
        <div className="flex flex-col gap-6 lg:items-end">
          <dl className="grid grid-cols-3 gap-6 lg:text-right">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">{f.value}</dd>
                <dd className="mt-1 text-[13px] leading-snug text-muted-foreground">{f.label}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-2">
            <a href="https://pulse.ciphera.net" className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[#E54E00]">
              Visit pulse.ciphera.net <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="https://pulse.ciphera.net/demo" className="inline-flex h-11 items-center gap-2 border border-border px-5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-accent">
              Live demo
            </a>
          </div>
        </div>
      }
    >
      <Reveal className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute -inset-x-10 -bottom-10 top-1/3 bg-[radial-gradient(ellipse_60%_55%_at_50%_70%,rgba(253,94,15,0.16),transparent_70%)]" />
        <figure className="relative border border-white/[0.08] bg-card p-1.5">
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
    </Section>
  )
}
