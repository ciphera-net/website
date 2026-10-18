/**
 * Round 1 mock hero (16-10-2026). One composition — the reference's centred copy over
 * a lit horizon — in three chromes, plus a product-led variant. Copy is a DRAFT held
 * constant across options so only the pixels differ; the wording is its own round.
 */
import Image from 'next/image'
import { Instrument_Serif } from 'next/font/google'
import { ArrowRight, ArrowUpRight, Buildings, MapPin, GithubLogo, SealCheck, Leaf, Eye, LockKey, SignOut } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'
import { MacWindow } from '@/components/ui/mac-window'
import { Horizon } from './Horizon'
import type { Chrome } from './OverhaulHeader'
import { INFRA_MARKS } from './brand-marks'
import { EuropeOrbit } from './EuropeOrbit'
import { Fingerprint } from './Fingerprint'
import { GlobeEurope, GlobeLegend } from './GlobeEurope'

// 'globe-routes' | 'globe-places' | 'globe-half': the 17-10 subtraction options for the hero ("too much").
export type Below = 'proofs' | 'infra' | 'principles' | 'status' | 'none' | 'europe' | 'fingerprint' | 'europe-flat' | 'globe-land' | 'globe-lights' | 'globe-world' | 'globe-routes' | 'globe-places' | 'globe-half'

// DRAFT wording for the principles strip, each line checked against what is true today (16-10-2026).
const PRINCIPLES = [
  { title: 'We collect almost nothing', desc: 'No cookies, no fingerprinting, no profiles to leak or sell.', icon: Eye },
  { title: 'Stored in Switzerland', desc: 'Our servers and backups are in Swiss data centres.', icon: MapPin },
  { title: 'Open where it counts', desc: 'Our sign-in protocol and integrations are open source.', icon: LockKey },
  { title: 'You can walk away', desc: 'Export or delete your data whenever you want.', icon: SignOut },
]

/** One quiet line from the public status feed (status.ciphera.net reads the same file). */
async function StatusLine() {
  let overall: string | null = null
  let count: number | null = null
  try {
    const r = await fetch('https://ciphera-status.b-cdn.net/feed.json', { next: { revalidate: 60 } })
    if (r.ok) {
      const f = (await r.json()) as { overall?: string; serviceCount?: number }
      overall = f.overall ?? null
      count = f.serviceCount ?? null
    }
  } catch {
    overall = null
  }
  if (!overall) return null
  const ok = overall === 'operational'
  return (
    <a href="https://status.ciphera.net" className="inline-flex items-center gap-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground">
      <span className={cn('h-2 w-2 rounded-full', ok ? 'bg-[#3ECF8E]' : 'bg-[#F8836B]')} aria-hidden="true" />
      <span className="text-foreground/90">{ok ? 'All systems operational' : 'Some services are degraded'}</span>
      {count !== null && <span className="hidden sm:inline">· {count} services, checked from two locations</span>}
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  )
}

// Company-level proof, each linking to its evidence (all live on 16-10-2026).
const PROOFS = [
  { label: 'Belgian company', href: '/about', icon: Buildings },
  { label: 'Hosted in Zurich', href: '/trust', icon: MapPin },
  { label: 'Open source', href: 'https://github.com/ciphera-net', icon: GithubLogo },
  { label: 'Signed monthly canary', href: '/trust/canary', icon: SealCheck },
  { label: 'Measured footprint', href: '/sustainability', icon: Leaf },
]

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', display: 'swap' })

const badge: Record<Chrome, string> = {
  bar: 'border border-border bg-card',
  pill: 'rounded-full border border-border bg-card',
  glass: 'rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur',
  barGlass: 'border border-white/[0.08] bg-[#0f0f0f]/55 backdrop-blur-md',
  pillGlass: 'rounded-full border border-white/[0.08] bg-[#0f0f0f]/55 backdrop-blur-md',
}
const badgeChip: Record<Chrome, string> = {
  bar: 'bg-foreground text-background',
  pill: 'rounded-full bg-foreground text-background',
  glass: 'rounded-full bg-white/90 text-neutral-900',
  barGlass: 'bg-foreground text-background',
  pillGlass: 'rounded-full bg-foreground text-background',
}
const primary: Record<Chrome, string> = {
  bar: 'bg-primary text-primary-foreground hover:bg-[#E54E00]',
  pill: 'rounded-full bg-primary text-primary-foreground hover:bg-[#E54E00]',
  glass: 'rounded-full bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15',
  barGlass: 'bg-primary text-primary-foreground hover:bg-[#E54E00]',
  pillGlass: 'rounded-full bg-primary text-primary-foreground hover:bg-[#E54E00]',
}
const secondary: Record<Chrome, string> = {
  bar: 'border border-border bg-background/60 text-foreground hover:bg-accent',
  pill: 'rounded-full border border-border bg-background/60 text-foreground hover:bg-white/[0.06]',
  glass: 'rounded-full text-white/90 hover:text-white',
  barGlass: 'border border-white/10 bg-white/[0.04] text-foreground backdrop-blur-md hover:bg-white/[0.08]',
  pillGlass: 'rounded-full border border-white/10 bg-white/[0.04] text-foreground backdrop-blur-md hover:bg-white/[0.08]',
}

export function OverhaulHero({ chrome, serifHeadline = false, product = false, showBadge = true, below = 'proofs', rails = false }: { chrome: Chrome; serifHeadline?: boolean; product?: boolean; showBadge?: boolean; below?: Below; rails?: boolean }) {
  return (
    <section
      data-mock="hero"
      className={cn(
        'relative isolate ml-[calc(50%-50vw)] w-screen overflow-hidden border-b border-border',
        product ? 'pb-0' : below === 'none' ? 'min-h-[88svh] pb-16' : 'min-h-[100svh] pb-16',
      )}
    >
      <Horizon />
      {rails && (
        // The page's rails continued through the hero: the same max-w-6xl column edges, fading in under the header.
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-6xl -translate-x-1/2 border-x border-border [mask-image:linear-gradient(to_bottom,transparent_0,#000_160px)] sm:block" />
      )}
      {below === 'globe-land' && <GlobeEurope look="land" />}
      {below === 'globe-lights' && <GlobeEurope look="lights" />}
      {below === 'globe-world' && <GlobeEurope look="lights" world />}
      {below === 'globe-routes' && <GlobeEurope look="lights" world cities={false} />}
      {below === 'globe-places' && <GlobeEurope look="lights" cities={false} />}
      {below === 'globe-half' && <GlobeEurope look="lights" world half />}

      <div className={cn('relative mx-auto max-w-5xl px-6 text-center', product ? 'pt-[148px] md:pt-[176px]' : showBadge ? 'pt-[300px] md:pt-[208px]' : 'pt-[320px] md:pt-[236px]')}>
        {/* Legibility scrim: the rim passes behind the end of the first line. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[120px] h-[520px] bg-[radial-gradient(ellipse_48%_46%_at_50%_50%,rgba(10,10,10,0.78)_0%,rgba(10,10,10,0.5)_45%,transparent_75%)] md:top-[150px]" />
        {showBadge && <a
          href="/trust/canary"
          className={cn('hz-in hz-in-1 inline-flex items-center gap-3 py-1.5 pl-1.5 pr-3.5 text-sm transition-colors', badge[chrome])}
        >
          <span className={cn('px-2 py-0.5 text-xs font-medium', badgeChip[chrome])}>New</span>
          <span className="font-medium text-foreground/90">
            October warrant canary published<span className="hidden sm:inline">, signed 05-10-2026</span>
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        </a>}

        <h1
          className={cn(
            'hz-in hz-in-2 mx-auto max-w-4xl text-foreground', showBadge && 'mt-7',
            serifHeadline
              ? `${serif.className} text-[52px] font-normal leading-[1.02] tracking-[-0.01em] sm:text-7xl lg:text-[104px]`
              : 'font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[84px]',
          )}
        >
          Privacy-first software,
          <br className="hidden sm:block" /> made in Europe.
        </h1>

        <p className="hz-in hz-in-3 mx-auto mt-6 max-w-[34rem] text-base leading-relaxed text-muted-foreground sm:text-lg">
          Ciphera is a Belgian software company. We build privacy-first tools for the web and run them on Swiss infrastructure.
        </p>

        <div className="hz-in hz-in-4 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#products" className={cn('inline-flex h-12 items-center gap-2 px-6 text-sm font-medium transition-colors duration-150', primary[chrome])}>
            What we build <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href="/about" className={cn('inline-flex h-12 items-center gap-2 px-6 text-sm font-medium transition-colors duration-150', secondary[chrome])}>
            About Ciphera {chrome === 'glass' && <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
          </a>
        </div>

        {!product && below === 'proofs' && (
          <div className="hz-in hz-in-5 mx-auto mt-24 max-w-4xl">
            <p className="text-sm text-muted-foreground">Receipts, not promises</p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {PROOFS.map((m) => (
                <li key={m.label}>
                  <a href={m.href} className="flex items-center gap-2 text-foreground/60 transition-colors duration-150 hover:text-foreground">
                    <m.icon className="h-5 w-5" aria-hidden="true" />
                    <span className="text-sm font-medium">{m.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!product && below === 'infra' && (
          <div className="hz-in hz-in-5 mx-auto mt-24 max-w-4xl">
            <p className="text-sm text-muted-foreground">Runs on European infrastructure</p>
            <ul className="mt-7 flex flex-wrap items-start justify-center gap-x-14 gap-y-6">
              {INFRA_MARKS.map((m) => (
                <li key={m.key} className="flex items-center gap-3 text-left">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-foreground/80" fill="currentColor" aria-hidden="true">
                    <path d={m.path} />
                  </svg>
                  <span>
                    <span className="block text-[15px] font-medium text-foreground/90">{m.name}</span>
                    <span className="block text-xs text-muted-foreground">{m.role} · {m.where}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!product && below === 'principles' && (
          <div className="hz-in hz-in-5 mx-auto mt-24 grid max-w-5xl grid-cols-2 border-y border-white/[0.08] text-left md:grid-cols-4">
            {PRINCIPLES.map((m, i) => (
              <div key={m.title} className={cn('px-5 py-6', i > 0 && 'md:border-l md:border-white/[0.08]', i % 2 === 1 && 'border-l border-white/[0.08] md:border-l')}>
                <m.icon className="h-5 w-5 text-foreground/80" aria-hidden="true" />
                <p className="mt-4 text-sm font-medium text-foreground">{m.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        )}

        {!product && below === 'status' && (
          <div className="hz-in hz-in-5 mt-12">
            <StatusLine />
          </div>
        )}

        {!product && below === 'europe' && <EuropeOrbit />}
        {!product && below === 'europe-flat' && <EuropeOrbit flat />}
        {!product && below.startsWith('globe-') && <GlobeLegend />}
        {!product && below === 'fingerprint' && <Fingerprint />}

        {product && (
          <div className="hz-in hz-in-5 relative mx-auto mt-16 max-w-[1080px] [perspective:1800px]">
            <div className="hz-tilt">
              <MacWindow>
                <Image
                  src="https://cdn.ciphera.net/pulse/marketing/dashboard-hero-19-09-2026-2x.png"
                  alt="The Pulse Analytics dashboard"
                  width={2560}
                  height={2120}
                  priority
                  unoptimized
                  className="block h-auto w-full"
                />
              </MacWindow>
            </div>
          </div>
        )}
      </div>

      {below === 'none' && (
        <div aria-hidden="true" className="hz-in hz-in-5 absolute inset-x-0 bottom-10 z-10 flex justify-center">
          <span className="hz-cue relative block h-10 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 top-0 h-3 bg-foreground/70" />
          </span>
        </div>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </section>
  )
}
