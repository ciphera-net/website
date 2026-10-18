/**
 * Round 4b (mock, 17-10-2026): the About page's closing band. The owner looked at the About options and said the
 * page was "missing colors" and "not really cool like the landing page" — this reuses one of the homepage's actual
 * colour moments (home/Closing.tsx: the warm sun sitting on the planet's horizon) instead of inventing a new device,
 * so the page closes the same way it would if it were the homepage. Every gradient/mask id is prefixed `acl-` so it
 * never collides with another svg on the page (the opening's horizon, the footer's marks). `.hz-rim` is the shared
 * CSS class that draws the rim stroke in and already has its own `prefers-reduced-motion` rule (styles/overhaul-
 * mock.css) — reused as-is, not renamed, same as every other horizon on the site. Copy is CLOSING from content.ts,
 * untouched; `primary`/`secondary` are assigned exactly as content.ts orders them.
 */
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '../home/Reveal'
import { CLOSING } from './content'

// `arc={false}` (17-10): the sunrise now OPENS every inner page, so a page must not also end on the same arc. The
// words and buttons stay; the band loses its picture.
export function AboutClosing({ arc = true }: { arc?: boolean }) {
  return (
    <section
      data-mock-section="about-closing"
      className={arc ? 'relative isolate overflow-hidden border-t border-border px-6 pb-40 pt-28 text-center sm:px-10 lg:pt-36' : 'border-t border-border px-6 py-24 text-center sm:px-10 lg:py-32'}
    >
      {arc && <svg
        aria-hidden="true"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMax slice"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      >
        <defs>
          <radialGradient id="acl-haze" gradientUnits="userSpaceOnUse" cx="600" cy="1450" r="1300">
            <stop offset="0.86" stopColor="#FD5E0F" stopOpacity="0.5" />
            <stop offset="0.9" stopColor="#E54E00" stopOpacity="0.18" />
            <stop offset="1" stopColor="#3A1000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="acl-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FD5E0F" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFC58F" />
            <stop offset="1" stopColor="#FD5E0F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="600" cy="1450" r="1300" fill="url(#acl-haze)" />
        <circle cx="600" cy="1450" r="1120" fill="#060606" />
        <circle className="hz-rim" cx="600" cy="1450" r="1120" pathLength={1} fill="none" stroke="url(#acl-rim)" strokeWidth="2" />
      </svg>}
      <Reveal>
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-6xl">
          {CLOSING.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{CLOSING.lead}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={CLOSING.primary.href}
            className="inline-flex h-12 items-center gap-2 bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[#E54E00]"
          >
            {CLOSING.primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={CLOSING.secondary.href}
            className="inline-flex h-12 items-center gap-2 border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-foreground backdrop-blur-md transition-colors duration-150 hover:bg-white/[0.08]"
          >
            {CLOSING.secondary.label}
          </a>
        </div>
      </Reveal>
    </section>
  )
}
