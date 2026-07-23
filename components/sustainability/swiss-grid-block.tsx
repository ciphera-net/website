import { Check } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { swissGridBuildingsPhoto } from '@/lib/images'

/**
 * Section 02 — Swiss grid advantage. About-style editorial split: a grayscale
 * photo on the left, narrative + grid-composition facts on the right (text on
 * solid dark, never on raw photo brightness). Facet: sharp, monochrome,
 * scarce orange.
 */
const gridFacts = [
  { value: '~60%', label: 'Hydroelectric' },
  { value: '~30%', label: 'Nuclear' },
  { value: '~12g', label: 'CO₂e/kWh' },
] as const

const sources = [
  'Hosted on Exoscale, Zurich (CH-DK-2) — 100% on Swiss soil',
  'Sources: Swiss Federal Office of Energy (BFE), 2025 · EU/US averages, Ember 2024',
] as const

export function SwissGridBlock() {
  return (
    <section className="border-b border-border">
      <div className="grid lg:grid-cols-2">
        {/* Left — grayscale photo */}
        <div className="relative min-h-[360px] border-b border-border lg:border-b-0 lg:border-r">
          <Image
            src={swissGridBuildingsPhoto}
            alt="Swiss government buildings flying Swiss flags"
            fill
            unoptimized
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover grayscale"
          />
        </div>

        {/* Right — copy on solid dark */}
        <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pl-14">
          <p className="text-xs text-muted-foreground">02 · The Swiss grid</p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            One of the cleanest grids in Europe, by accident of geography.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            The Alps hand Switzerland roughly 60% of its electricity from hydro — gravity doing
            the work — and nuclear covers most of the rest. The result is a grid that runs at about
            12 grams of CO₂ per kilowatt-hour, against ~210 across the EU average and ~360 in the
            United States.
          </p>

          {/* Grid composition */}
          <div className="mt-10 grid grid-cols-3 gap-px border border-border bg-border">
            {gridFacts.map((f) => (
              <div key={f.label} className="bg-background px-4 py-5">
                <div className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {f.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{f.label}</div>
              </div>
            ))}
          </div>

          <ul className="mt-8 space-y-3">
            {sources.map((item) => (
              <li key={item} className="flex items-start gap-3 text-muted-foreground">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-foreground" weight="bold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
