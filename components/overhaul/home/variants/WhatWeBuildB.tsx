/**
 * Option B (mock, chosen 16-10): split layout; the product in a tilted device with an orange slab behind it,
 * bleeding off the column's edges, after the owner's reference. Facts sit as an inline strip in the copy column, not a header-aside grid.
 * Copy is a DRAFT; every fact matches Option A (audit §5.7).
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

export function WhatWeBuildB() {
  return (
    <section id="products" data-mock-section="products" className="scroll-mt-24">
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch">
        <Reveal className="flex flex-col justify-center gap-10 px-6 py-16 sm:px-10 lg:border-r lg:border-border lg:py-24">
          <div>
            <div className="inline-flex h-11 w-11 items-center justify-center border border-border bg-card">
              <Image src={pulseIcon} alt="" width={19} height={28} unoptimized className="h-7 w-auto" />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">What we build</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl">
              Pulse Analytics
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Web analytics that shows how your site is doing, without cookies and without following anyone. It runs
              on servers in Switzerland.
            </p>
          </div>
          <dl className="grid max-w-md grid-cols-3">
            {FACTS.map((f) => (
              <div
                key={f.label}
                className="flex flex-col gap-1 border-l border-border px-4 first:border-l-0 first:pl-0 sm:px-5"
              >
                <dd className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">{f.value}</dd>
                <dt className="text-[13px] leading-snug text-muted-foreground">{f.label}</dt>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-3">
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
        {/* The product in a device, tilted, an orange slab offset behind it, bleeding off the column's right and bottom
            edges (owner's reference, 16-10-2026). The bezel's rounded corners are a sanctioned exception to Facet's
            square radius, like MacWindow: it depicts hardware, not our UI. Captured from ciphera.net's own dashboard (16-10, avatar hidden),
            🔴 with ONE edit by owner ruling (17-10): the live count reads 10 instead of the real 0, drawn in the product's own
            live state (brand-orange dot with its ping halo, the count in the foreground colour, Geist text-sm tabular-nums,
            rendered by Chromium and calibrated on the original glyph). The alt text therefore no longer says it is
            ciphera.net's dashboard. Original kept beside it: cdn.ciphera.net/website/overhaul/pulse-dashboard-trust-16-10-2026.png (the unedited capture, used on Trust). */}
        <Reveal delay={80} className="relative h-[340px] w-full overflow-hidden sm:h-[460px] lg:h-full lg:min-h-[620px]">
          <div className="absolute left-[7%] top-[13%] w-[128%] [perspective:2400px] sm:left-[9%] lg:top-[14%] lg:w-[132%]">
            <div className="relative origin-left [transform:rotateY(-17deg)_rotateX(6deg)_rotateZ(-1.5deg)]">
              <div aria-hidden="true" className="absolute -bottom-8 -left-7 right-[22%] top-12 rounded-[34px] bg-gradient-to-br from-[#FD7A2F] to-[#E54E00]" />
              <div className="relative rounded-[30px] bg-[#161616] p-[11px] ring-1 ring-white/25">
                <div className="overflow-hidden rounded-[21px] bg-card p-3 ring-1 ring-white/[0.06]">
                  <Image
                    src={cdnUrl('/overhaul/pulse-dashboard-home-16-10-2026.png')}
                    alt="The Pulse Analytics dashboard: visitors, pageviews, pages per visit, bounce rate, visit duration, the daily chart and the top referrers and countries"
                    width={2880}
                    height={2120}
                    unoptimized
                    className="block h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
