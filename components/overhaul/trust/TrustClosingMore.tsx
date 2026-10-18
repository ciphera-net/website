/**
 * Round 5c (mock, 17-10-2026): four more options for the Trust page's closing band, asked for by the owner, over the same
 * CLOSING copy as A to C (content.ts). Every visible string is read from it by reference; this file types no prose. Like
 * A to C there is no arc, sun or horizon, and nothing decorative behind the words: the page opens on the sunrise and an
 * arc never sits at both ends of a page (D23). Every option gives both routes (security@ for questionnaires, privacy@
 * for the data processing agreement), a way to the privacy policy and the updated line, inside the same frame as A to C
 * (its own title id per option). Type is Geist sans throughout, addresses included (people read them): nothing is mono.
 *
 * D = three lit contacts: the lead as in A to C, then CLOSING.contacts as three cards in a row, each one link to its
 *     mailto: with a lit tile (tiles.tsx LitTile, What we keep D's recipe), the term, the address and an arrow on the
 *     card's bottom edge. There is no button: the cards are the actions. A text link to the privacy policy and the
 *     updated line close the band. Colour: the three lit tiles; hovering a card lights its border and its address.
 * E = the review kit: the title alone, because the kit says what the lead says. CLOSING.kit as a 2 x 2 hairline grid
 *     (home/OpenByDefault's recipe: gap-px over bg-border, bg-background cells), each cell one link with a lit tile, the
 *     item's title over its action and an arrow. The only option that links the provider list (#providers, the block
 *     above). Colour: the four lit tiles; the action line and the arrow turn orange on hover.
 * F = the company card: A to C's Lead and Actions on the left; on the right a card with Ciphera's own icon, the legal
 *     name, Belgium's flag (DataMore's FlagBE) and the place, then the three addresses as rows, each with a copy button
 *     (CopyButton, a client island). The only option that shows who is writing. Colour: the icon's own, the flag's and
 *     the primary button's orange; the copy check turns orange for two seconds.
 * G = the addresses, large: the typographic option, restrained on purpose. The title alone, then the three addresses
 *     stacked as ruled rows in display type, each with a copy button, and the privacy policy link beside the updated
 *     line. No lead, no orange button, no tile. Colour: orange only on hover and on the copy check.
 *
 * Server component. Reveal and CopyButton are the only client islands. Square corners, flat, hairlines only.
 */
import Image from 'next/image'
import type { ComponentType, ReactNode } from 'react'
import { ArrowRight, Buildings, ChatCircleText, FileText, ListChecks, Scales, ShieldCheck } from '@phosphor-icons/react/dist/ssr'
import { cipheraIcon } from '@/lib/images'
import { cn } from '@/lib/utils'
import { Reveal } from '../home/Reveal'
import { ProofLink } from '../home/rules'
import { CopyButton } from './CopyButton'
import { FlagBE } from './DataMore'
import { CLOSING } from './content'
import { Actions, Lead } from './TrustClosing'
import { LitTile } from './tiles'

type Letter = 'd' | 'e' | 'f' | 'g'
type IconComponent = ComponentType<{ className?: string }>

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/** The frame A to C share, with the option's letter in its title id. */
function Frame({ x, children }: { x: Letter; children: ReactNode }) {
  return (
    <section
      data-mock-section="trust-closing"
      aria-labelledby={`trust-closing-${x}-title`}
      className="border-t border-border px-6 py-24 sm:px-10 lg:py-32"
    >
      {children}
    </section>
  )
}

function Title({ x }: { x: Letter }) {
  return (
    <h2
      id={`trust-closing-${x}-title`}
      className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl"
    >
      {CLOSING.title}
    </h2>
  )
}

function Updated({ className }: { className?: string }) {
  return <p className={cn('text-sm tabular-nums text-muted-foreground', className)}>{CLOSING.updated}</p>
}

/** The row D and G close on: the privacy policy as a text link, the updated line beside it (under it on a phone). */
function PolicyRow() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <ProofLink href={CLOSING.secondary.href}>{CLOSING.secondary.label}</ProofLink>
      <Updated />
    </div>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* D: three lit contacts                                                                                              */
/* ---------------------------------------------------------------------------------------------------------------- */

// By index, in CLOSING.contacts' order: Security, Privacy and data processing, Everything else.
const CONTACT_ICONS: IconComponent[] = [ShieldCheck, Scales, ChatCircleText]

export function TrustClosingD() {
  return (
    <Frame x="d">
      <Reveal>
        <Title x="d" />
        <Lead className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground" />
      </Reveal>
      <Reveal delay={80} className="mt-12">
        <ul role="list" className="grid gap-4 lg:grid-cols-3">
          {CLOSING.contacts.map((c, i) => {
            const Icon = CONTACT_ICONS[i]
            return (
              <li key={c.term}>
                <a
                  href={`mailto:${c.detail}`}
                  className={`group flex h-full flex-col border border-border p-6 transition-colors duration-150 hover:border-primary/60 ${RING}`}
                >
                  <LitTile>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </LitTile>
                  <span className="mt-6 text-sm text-muted-foreground">{c.term}</span>
                  {/* flex-1: the address takes any spare height, so the arrow sits on the card's bottom edge even if
                      a neighbour's term wraps to a second line. */}
                  <span className="mt-1 flex-1 text-[15px] font-medium text-foreground transition-colors group-hover:text-primary [overflow-wrap:anywhere]">
                    {c.detail}
                  </span>
                  <ArrowRight
                    className="mt-6 h-4 w-4 self-end text-muted-foreground transition-colors duration-150 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </a>
              </li>
            )
          })}
        </ul>
      </Reveal>
      <Reveal delay={160} className="mt-10">
        <PolicyRow />
      </Reveal>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* E: the review kit                                                                                                  */
/* ---------------------------------------------------------------------------------------------------------------- */

const KIT_ICONS: Record<string, IconComponent> = { dpa: FileText, questionnaire: ListChecks, providers: Buildings, privacy: ShieldCheck }

export function TrustClosingE() {
  return (
    <Frame x="e">
      <Reveal>
        <Title x="e" />
      </Reveal>
      <Reveal delay={80} className="mt-12">
        {/* The grid is one Reveal, not one per cell: a dimmed bg-background cell would let the bg-border behind it
            show through and read as a lighter tile. */}
        <ul role="list" className="grid gap-px border border-border bg-border md:grid-cols-2">
          {CLOSING.kit.map((k) => {
            const Icon = KIT_ICONS[k.key]
            return (
              <li key={k.key} className="bg-background">
                {/* ring-inset: a later cell's background would paint over an outer focus ring on the shared edge. */}
                <a
                  href={k.href}
                  className={`group flex h-full items-start gap-4 p-6 transition-colors duration-150 hover:bg-card ${RING} focus-visible:ring-inset`}
                >
                  <LitTile>{Icon && <Icon className="h-5 w-5" aria-hidden="true" />}</LitTile>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-pretty text-[15px] font-semibold text-foreground">{k.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground transition-colors group-hover:text-primary [overflow-wrap:anywhere]">
                      {k.action}
                    </p>
                  </div>
                  <ArrowRight
                    className="mt-2.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </a>
              </li>
            )
          })}
        </ul>
      </Reveal>
      <Reveal delay={160} className="mt-10">
        <Updated />
      </Reveal>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* F: the company card                                                                                                */
/* ---------------------------------------------------------------------------------------------------------------- */

export function TrustClosingF() {
  const { company, contacts, copy } = CLOSING
  return (
    <Frame x="f">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16">
        <Reveal>
          <Title x="f" />
          <Lead className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground" />
          <Actions className="mt-8 flex flex-col gap-3 sm:flex-row" />
        </Reveal>
        <Reveal delay={90}>
          <div className="border border-border bg-card">
            <div className="p-6">
              {/* ciphera_icon.png is 1207 x 1272 (PNG header, 17-10-2026), so about 38 x 40 px at h-10. */}
              <Image src={cipheraIcon} alt="" width={1207} height={1272} unoptimized className="h-10 w-auto shrink-0" />
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{company.name}</h3>
              <p className="mt-1.5 flex items-center gap-2.5 text-sm text-muted-foreground">
                <FlagBE className="h-3.5 w-auto shrink-0" />
                {company.place}
              </p>
            </div>
            <ul role="list">
              {contacts.map((c) => (
                <li key={c.term} className="flex items-center justify-between gap-4 border-t border-border px-6 py-4">
                  <dl className="min-w-0">
                    <dt className="text-sm text-muted-foreground">{c.term}</dt>
                    <dd className="mt-0.5 text-[15px]">
                      <a
                        href={`mailto:${c.detail}`}
                        className={`font-medium text-foreground transition-colors hover:text-primary [overflow-wrap:anywhere] ${RING}`}
                      >
                        {c.detail}
                      </a>
                    </dd>
                  </dl>
                  <CopyButton text={c.detail} label={copy.label} done={copy.done} failed={copy.failed} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
      {/* The updated line closes the band under both columns (lead's review, 17-10): inside the left column it fell between
          the buttons and the card on a phone. */}
      <Reveal delay={120} className="mt-10 lg:mt-12">
        <Updated />
      </Reveal>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* G: the addresses, large                                                                                            */
/* ---------------------------------------------------------------------------------------------------------------- */

export function TrustClosingG() {
  const { contacts, copy } = CLOSING
  return (
    <Frame x="g">
      <Reveal>
        <Title x="g" />
      </Reveal>
      <Reveal delay={80} className="mt-12">
        <dl>
          {contacts.map((c) => (
            <div key={c.term} className="border-t border-border py-6 last:border-b">
              <dt className="text-sm text-muted-foreground">{c.term}</dt>
              <dd className="mt-2 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${c.detail}`}
                  className={`font-display text-2xl font-semibold tracking-[-0.03em] text-foreground transition-colors duration-150 hover:text-primary sm:text-4xl [overflow-wrap:anywhere] ${RING}`}
                >
                  {c.detail}
                </a>
                <CopyButton text={c.detail} label={copy.label} done={copy.done} failed={copy.failed} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <Reveal delay={160} className="mt-10">
        <PolicyRow />
      </Reveal>
    </Frame>
  )
}
