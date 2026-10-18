/**
 * Round 2: closing band. A sunrise over the planet's edge mirrors the hero, so the page opens and closes on the same
 * image. Copy is a DRAFT.
 */
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from './Reveal'

export function Closing() {
  return (
    <section data-mock-section="closing" className="relative isolate overflow-hidden border-t border-border px-6 pb-40 pt-28 text-center sm:px-10 lg:pt-36">
      <svg aria-hidden="true" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
        <defs>
          <radialGradient id="cl-haze" gradientUnits="userSpaceOnUse" cx="600" cy="1450" r="1300">
            <stop offset="0.86" stopColor="#FD5E0F" stopOpacity="0.5" />
            <stop offset="0.9" stopColor="#E54E00" stopOpacity="0.18" />
            <stop offset="1" stopColor="#3A1000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cl-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FD5E0F" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFC58F" />
            <stop offset="1" stopColor="#FD5E0F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="600" cy="1450" r="1300" fill="url(#cl-haze)" />
        <circle cx="600" cy="1450" r="1120" fill="#060606" />
        <circle className="hz-rim" cx="600" cy="1450" r="1120" pathLength={1} fill="none" stroke="url(#cl-rim)" strokeWidth="2" />
      </svg>
      <Reveal>
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-6xl">
          Try Pulse on your own site.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          It is free for one site. Or tell us what you are building.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="https://pulse.ciphera.net/signup" className="inline-flex h-12 items-center gap-2 bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[#E54E00]">
            Try Pulse free <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href="/contact" className="inline-flex h-12 items-center gap-2 border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-foreground backdrop-blur-md transition-colors duration-150 hover:bg-white/[0.08]">
            Contact us
          </a>
        </div>
      </Reveal>
    </section>
  )
}
