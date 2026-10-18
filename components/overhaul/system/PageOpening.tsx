/**
 * Round R3b (mock, 17-10-2026, plan §5e): three ways an inner page can open, sharing the approved vocabulary.
 *   A — horizon band: the homepage hero's lit rim and haze at the top (About D without the globe, which stays About's).
 *   B — quiet statement: About A's large plain title and lead, no visual; the colour moment is the closing band.
 *   C — sunrise: the closing band's warm arc drawn UNDER the title, so the page opens the way the homepage ends.
 * Every option renders the page's only <h1>. Gradient ids are prefixed `pso-` so they never collide with the closing
 * band (`acl-`) or the homepage hero (`hzd-`, `hzm-`) on the same page.
 */
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Horizon } from '../Horizon'
import { Reveal } from '../home/Reveal'

type Props = { title: string; lead: string }

const H1_STATEMENT =
  'font-display text-5xl font-semibold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl'

export function PageOpeningA({ title, lead }: Props) {
  return (
    <section
      data-mock-opening="a"
      className={cn(
        // Full-bleed like the hero; -mb-px puts its hairline on the next section's border-t (one line).
        'relative isolate -mb-px ml-[calc(50%-50vw)] w-screen overflow-hidden border-b border-border',
        'min-h-[60svh] pb-16',
      )}
    >
      <Horizon />
      <div className="relative mx-auto max-w-5xl px-6 pt-[300px] text-center md:pt-[220px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[110px] h-[420px] bg-[radial-gradient(ellipse_48%_46%_at_50%_50%,rgba(10,10,10,0.78)_0%,rgba(10,10,10,0.5)_45%,transparent_75%)] md:top-[140px]"
        />
        <h1 className="hz-in hz-in-2 relative mx-auto max-w-4xl font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-[76px]">
          {title}
        </h1>
        <p className="hz-in hz-in-3 relative mx-auto mt-6 max-w-[34rem] text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          {lead}
        </p>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background" />
    </section>
  )
}

export function PageOpeningB({ title, lead }: Props) {
  return (
    <section data-mock-opening="b" className="px-6 pb-20 pt-40 sm:px-10 lg:pb-28 lg:pt-48">
      <Reveal>
        <h1 className={H1_STATEMENT}>{title}</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lead}</p>
      </Reveal>
    </section>
  )
}

export function PageOpeningC({ title, lead, children }: Props & { children?: ReactNode }) {
  return (
    <section data-mock-opening="c" className="relative isolate overflow-hidden px-6 pb-44 pt-40 text-center sm:px-10 lg:pb-52 lg:pt-48">
      <SunriseArc />
      <Reveal>
        <h1 className={cn('mx-auto max-w-4xl', H1_STATEMENT)}>{title}</h1>
        <p className="mx-auto mt-8 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground">{lead}</p>
        {children}
      </Reveal>
    </section>
  )
}

/**
 * The sunrise itself, refactored out of PageOpeningC (R7, 18-10) so an opening that sets its own words (the blog
 * post's title, standfirst and date line) draws the same arc instead of a copy. Its parent must be `relative isolate`.
 *
 * Sized by the page's width, never by the opening's height (D50, 18-10): a band on the section's bottom edge, 15rem
 * tall at least and 36rem at most, at most 90rem wide and centred, its haze free to paint past the box. Filling the
 * section instead made the arc grow with every line of words, so on a phone the glow rose behind the title and the
 * date line (316 of 528 page widths under WCAG's 4.5:1; this shape: 0).
 */
export function SunriseArc() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[clamp(15rem,40vw,36rem)] w-full max-w-[90rem] -translate-x-1/2 overflow-visible"
    >
      <defs>
        <radialGradient id="pso-haze" gradientUnits="userSpaceOnUse" cx="600" cy="1450" r="1300">
          <stop offset="0.86" stopColor="#FD5E0F" stopOpacity="0.5" />
          <stop offset="0.9" stopColor="#E54E00" stopOpacity="0.18" />
          <stop offset="1" stopColor="#3A1000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pso-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FD5E0F" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFC58F" />
          <stop offset="1" stopColor="#FD5E0F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="600" cy="1450" r="1300" fill="url(#pso-haze)" />
      <circle cx="600" cy="1450" r="1120" fill="#060606" />
      <circle className="hz-rim" cx="600" cy="1450" r="1120" pathLength={1} fill="none" stroke="url(#pso-rim)" strokeWidth="2" />
    </svg>
  )
}
