/**
 * Round 4 (mock, 17-10-2026): the About page's opening block (D18 outline, item 1) — four options (A–C, and D from
 * Round 4b) sharing the same ruled copy (content.ts OPENING). A–C start directly under the fixed glass header, so each
 * carries its own top clearance (pt-40 / lg:pt-48) instead of a Section's usual border-t; D is a full-bleed band like
 * the homepage hero. Every option renders exactly one <h1> with OPENING.title verbatim — the page's only H1.
 */
import { createMap } from 'svg-dotted-map'
import { cn } from '@/lib/utils'
import { lazy } from '../dotted-map-projection'
import { Reveal } from '../home/Reveal'
import { WM } from '../footer/wordmark-geom'
import { Horizon } from '../Horizon'
import { GlobeEurope, GlobeLegend } from '../GlobeEurope'
import { PageOpeningC } from '../system/PageOpening'
import { OPENING } from './content'

const H1_CLASS =
  'font-display text-5xl font-semibold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl'

// Option A's one-line strip: short forms of three RECORD.facts rows (content.ts OPENING.facts).
const QUICK_FACTS = OPENING.facts

/**
 * Option B's map: a small, quiet dotted Europe adapted from EuropeOrbit / WhereDataLivesB with the glow and the
 * pulse animation dropped (this page allows no gradients or glows) — flat dots, a plain line, two solid points.
 * Diegem is where Ciphera works (content.ts RECORD); Geneva is the data location the homepage names for the same
 * fact (WhereDataLivesB, GlobeEurope) — content.ts states it only as "Switzerland".
 */
const MINI_W = 320
const MINI_H = 220
// Lazy: the About route imports this module for its other openings, and sampling the land at module scope ran on every
// new server's first About request (components/overhaul/dotted-map-projection.ts).
const miniMap = lazy(() => {
  const { points: MINI_POINTS, addMarkers: miniAddMarkers } = createMap({
    width: MINI_W,
    height: MINI_H,
    mapSamples: 3200,
    region: { lat: { min: 42, max: 58.5 }, lng: { min: -14, max: 44 } },
  })
  const [MINI_DIEGEM, MINI_GENEVA] = miniAddMarkers([
    { lat: 50.8907, lng: 4.4614, key: 'diegem', name: 'Diegem' },
    { lat: 46.2044, lng: 6.1432, key: 'geneva', name: 'Geneva' },
  ])
  const MINI_MID_X = (MINI_DIEGEM.x + MINI_GENEVA.x) / 2
  const MINI_BEND_Y = Math.min(MINI_DIEGEM.y, MINI_GENEVA.y) - 20
  const MINI_ARC = `M ${MINI_DIEGEM.x.toFixed(1)} ${MINI_DIEGEM.y.toFixed(1)} Q ${MINI_MID_X.toFixed(1)} ${MINI_BEND_Y.toFixed(1)} ${MINI_GENEVA.x.toFixed(1)} ${MINI_GENEVA.y.toFixed(1)}`
  return { MINI_POINTS, MINI_DIEGEM, MINI_GENEVA, MINI_ARC }
})

function MiniEuropeMap() {
  const { MINI_POINTS, MINI_DIEGEM, MINI_GENEVA, MINI_ARC } = miniMap()
  return (
    <div className="w-full max-w-[260px]">
      <svg
        viewBox={`0 0 ${MINI_W} ${MINI_H}`}
        className="block h-auto w-full text-foreground"
        role="img"
        aria-label="A small dotted map of Europe marking Diegem, Belgium and Geneva, Switzerland"
      >
        {MINI_POINTS.map((p, i) => (
          <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="1.1" fill="currentColor" fillOpacity="0.14" />
        ))}
        <path d={MINI_ARC} fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1" />
        {/* One deliberate orange point: Geneva, where the data lives. Diegem stays white. */}
        <circle cx={MINI_DIEGEM.x} cy={MINI_DIEGEM.y} r="3" fill="currentColor" fillOpacity="0.85" />
        <circle cx={MINI_GENEVA.x} cy={MINI_GENEVA.y} r="3" fill="#FD5E0F" />
      </svg>
      <dl className="mt-4 flex items-start justify-between gap-6 text-xs text-muted-foreground">
        {[MINI_DIEGEM, MINI_GENEVA].map((m) => (
          <div key={m.key} className="flex items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/25" />
            <dt className="sr-only">Place</dt>
            <dd className="font-medium text-foreground/80">{m.name}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/**
 * Option C's backdrop: a faint, uncropped echo of the footer's wordmark device (wordmark-geom.ts) — same word, size
 * and spacing, but sized here to sit whole behind centred copy rather than cropped by a page edge. Flat fill only,
 * no gradient, no glow, no blur; purely decorative, so it is aria-hidden rather than described.
 */
function FaintWordmark() {
  const viewH = 330
  const y = 240
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${WM.w} ${viewH}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full max-h-[320px] w-full max-w-4xl select-none text-foreground/[0.05]"
    >
      <text x={WM.x} y={y} fontSize={WM.size} fontWeight={600} letterSpacing={WM.spacing} fill="currentColor" className="font-display">
        {WM.word}
      </text>
    </svg>
  )
}

/** A — confident statement: a very large H1 carries the block alone, left-aligned, with a thin hairline row of
 * plain facts closing it out. The calmest option: no device beyond type and a rule. */
export function OpeningA() {
  return (
    <section className="px-6 pb-24 pt-40 sm:px-10 lg:pb-32 lg:pt-48">
      <Reveal>
        <h1 className={H1_CLASS}>{OPENING.title}</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">{OPENING.lead}</p>
      </Reveal>
      <Reveal delay={90}>
        <ul className="mt-16 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border pt-6 text-sm tabular-nums text-muted-foreground lg:mt-20">
          {QUICK_FACTS.map((fact, i) => (
            <li key={fact} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-border" />}
              {fact}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

/** B — split: the statement on the left, the two jurisdictions placed on a small, quiet map on the right. The map
 * is the argument's second half (Belgian company, Swiss data) made visible rather than only stated. */
export function OpeningB() {
  return (
    <section className="px-6 pb-24 pt-40 sm:px-10 lg:pb-32 lg:pt-48">
      <Reveal>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16">
          <div>
            <h1 className={H1_CLASS}>{OPENING.title}</h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">{OPENING.lead}</p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <MiniEuropeMap />
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/** C — centred and quiet: the statement sits alone over a faint echo of the footer's wordmark. Calmest to read,
 * deliberately not a second hero — no map, no facts, just the sentence. */
export function OpeningC() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-40 text-center sm:px-10 lg:pb-32 lg:pt-48">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <FaintWordmark />
      </div>
      <Reveal className="relative">
        <h1 className={cn('mx-auto max-w-3xl', H1_CLASS)}>{OPENING.title}</h1>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">{OPENING.lead}</p>
      </Reveal>
    </section>
  )
}

/**
 * D — a smaller sibling of the homepage hero, full-bleed like it (breaks out of the max-w-6xl column the same way),
 * drawing the same lit Horizon and the same city-light GlobeEurope at the hero's own scale, with the two places this
 * page is about, Diegem and Geneva, labelled instead of the hero's whole-world routes (it is NOT zoomed; an earlier
 * note said so, wrongly). No badge, no buttons: just OPENING.title as
 * the page's only H1 and OPENING.lead under it, centred, in the hero's own showBadge=false vertical rhythm and type
 * scale, with its exact legibility scrim reused unchanged. ~80svh, not the hero's 100 — About is not a second hero.
 * GlobeEurope already labels Diegem/Geneva on desktop; on mobile the globe runs quiet (no dots, by its own design),
 * so GlobeLegend — the same component the homepage hero uses for the same reason — names the two places in text,
 * safely below the lead rather than over the (there dimmer, cropped) globe.
 */
export function OpeningD() {
  return (
    <section
      className={cn(
        // -mb-px: the full-width hairline sits on the next Section's border-t, one line, as under the homepage hero.
        'relative isolate -mb-px ml-[calc(50%-50vw)] w-screen overflow-hidden border-b border-border',
        // GlobeEurope scales with the width (its labels land ~0.53 × width from the top), so on wide screens the band
        // grows with the width rather than the height, or the labels fall into the bottom fade (review 17-10: at
        // 1440 × 1000 "Where your data is stored" was ~1.5:1). Checked for 1024 × 768 up to 2560 × 1440.
        'min-h-[80svh] pb-16 md:min-h-[max(80svh,calc(53.3vw_+_72px))]',
      )}
    >
      <Horizon />
      <GlobeEurope look="lights" />

      <div className="relative mx-auto max-w-5xl px-6 pt-[320px] text-center md:pt-[236px]">
        {/* Legibility scrim: the hero's own, unchanged — the rim passes behind the end of the first line there too. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[120px] h-[520px] bg-[radial-gradient(ellipse_48%_46%_at_50%_50%,rgba(10,10,10,0.78)_0%,rgba(10,10,10,0.5)_45%,transparent_75%)] md:top-[150px]"
        />

        <h1 className="hz-in hz-in-2 mx-auto max-w-4xl font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-[84px]">
          {OPENING.title}
        </h1>
        <p className="hz-in hz-in-3 mx-auto mt-6 max-w-[34rem] text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          {OPENING.lead}
        </p>

        <GlobeLegend />
      </div>

      {/* h-16, not the 100svh hero's h-40: a taller fade covered the globe's labels (review 17-10). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background" />
    </section>
  )
}

/**
 * E (17-10-2026, owner: "lets follow the same theme as /mock-about/cool - we need consistency ... replace the horizon
 * band with the sunrise for all"): the shared inner-page opening (system/PageOpening C), the closing band's warm arc
 * under the title. Every page except the homepage opens this way; About's horizon-and-globe opening stays as D.
 */
export function OpeningE() {
  return <PageOpeningC title={OPENING.title} lead={OPENING.lead} />
}
