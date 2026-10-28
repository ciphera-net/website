/**
 * The blocks of /sustainability after its core (R12; plan §5n). Each reuses the device the shipped pages already use for
 * the same job, so nothing here is new:
 *
 * Counts      — Trust's What we keep D: a lit tile (tiles.tsx LitTile) for what the estimate counts, the quiet grey tile
 *               (QuietTile, "neither lit nor struck") for what it leaves out. Not struck: leaving a thing out of the
 *               estimate is not a claim that it does not exist.
 * WhereItRuns — Trust's Where it runs A: a ruled row per provider, its mark in a 44 px tile in its real colour, the
 *               place with its flag. The sentences are D59's hosting line, rewritten for the move to Infomaniak
 *               (28-10-2026): each provider names its own place.
 * Commitments — the struck tile (StruckTile) Trust uses for what we never do, beside each line.
 * Closing     — Trust closing A's centred band: title and the two buttons, no arc and no photo, because the page opens on
 *               the sunrise (D23).
 *
 * Colour: the lit tiles' orange hairline and icon, the providers' marks, Switzerland's flag and the primary button.
 * No panel is tinted; square corners; type is Geist sans and nothing is mono. Server components; Reveal is the island.
 */
import type { ComponentType } from 'react'
import {
  AirplaneTilt,
  ArrowRight,
  ArrowsClockwise,
  Certificate,
  Database,
  GlobeHemisphereWest,
  HardDrives,
  Leaf,
  Lightning,
  Tree,
} from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '../home/Reveal'
import { Section } from '../home/Section'
import { LitTile, QuietTile, StruckTile } from '../trust/tiles'
import { FlagSlot, ProviderMark } from '../trust/Providers'
import { PRIMARY, SECONDARY } from '../trust/TrustClosing'
import { CLOSING, COMMITMENTS, COUNTS, WHERE } from './content'

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  AirplaneTilt,
  ArrowsClockwise,
  Certificate,
  Database,
  GlobeHemisphereWest,
  HardDrives,
  Leaf,
  Lightning,
  Tree,
}

function Icon({ name }: { name: string }) {
  const C = ICONS[name]
  return C ? <C className="h-5 w-5" aria-hidden="true" /> : null
}

/* ----------------------------------------------------------------------------------------------- what it counts */

export function Counts() {
  return (
    <Section id={COUNTS.id} eyebrow={COUNTS.eyebrow} title={COUNTS.title}>
      <CountsLists />
    </Section>
  )
}

/** The two lists, side by side on a desktop. */
function CountsLists() {
  return (
    <div data-r12-counts className="grid gap-14 lg:grid-cols-2 lg:gap-x-16">
      <Reveal>
        <h3 className="text-sm font-normal text-muted-foreground">{COUNTS.countedLabel}</h3>
        <ul role="list" className="mt-3 space-y-3">
          {COUNTS.counted.map((item) => (
            <li key={item.text} className="flex items-start gap-4">
              <LitTile>
                <Icon name={item.icon} />
              </LitTile>
              <span className="pt-2 text-[15px] leading-relaxed text-foreground">{item.text}</span>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={80}>
        <h3 className="text-sm font-normal text-muted-foreground">{COUNTS.notCountedLabel}</h3>
        <ul role="list" className="mt-3 space-y-3">
          {COUNTS.notCounted.map((item) => (
            <li key={item.text} className="flex items-start gap-4">
              <QuietTile>
                <Icon name={item.icon} />
              </QuietTile>
              <span className="pt-2 text-[15px] leading-relaxed text-muted-foreground">{item.text}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  )
}

/* ----------------------------------------------------------------------------------------------- where it runs */

export function WhereItRuns() {
  return (
    <Section id={WHERE.id} eyebrow={WHERE.eyebrow} title={WHERE.title}>
      <Reveal>
        <ul role="list" className="border-t border-border">
          {WHERE.rows.map((row, i) => (
            <li key={row.name} className="flex items-start gap-4 border-b border-border py-5 sm:gap-5">
              <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-card">
                <ProviderMark mark={row.mark} size={20} />
              </span>
              <div className="min-w-0 flex-1 sm:flex sm:items-start sm:justify-between sm:gap-10">
                {/* pt-2.5 centres a 24 px line on the 44 px tile. */}
                <p className="pt-2.5 text-[15px] leading-6 text-foreground">{row.text}</p>
                <p className="mt-1 flex items-start gap-2.5 text-sm leading-6 text-muted-foreground sm:mt-0 sm:shrink-0 sm:pt-2.5">
                  <FlagSlot place={row.flag ?? ''} uid={`r12-${i}`} />
                  <span>{row.place}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------- commitments */

export function Commitments() {
  return (
    <Section id={COMMITMENTS.id} eyebrow={COMMITMENTS.eyebrow} title={COMMITMENTS.title}>
      <Reveal>
        <ul role="list" className="border-t border-border">
          {COMMITMENTS.items.map((item) => (
            <li key={item.text} className="flex items-center gap-5 border-b border-border py-5">
              <StruckTile>
                <Icon name={item.icon} />
              </StruckTile>
              <span className="text-lg font-medium tracking-tight text-foreground sm:text-xl">{item.text}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}

/* ----------------------------------------------------------------------------------------------------- closing */

export function SustainabilityClosing() {
  return (
    <section
      data-mock-section="sustainability-closing"
      aria-labelledby="r12-closing-title"
      className="border-t border-border px-6 py-24 text-center sm:px-10 lg:py-32"
    >
      <Reveal>
        <h2
          id="r12-closing-title"
          className="mx-auto max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-6xl"
        >
          {CLOSING.title}
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={CLOSING.primary.href} className={PRIMARY}>
            {CLOSING.primary.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href={CLOSING.secondary.href} className={SECONDARY}>
            {CLOSING.secondary.label}
          </a>
        </div>
      </Reveal>
    </section>
  )
}
