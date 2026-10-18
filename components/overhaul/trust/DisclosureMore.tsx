/**
 * Round 5c (mock, 17-10-2026): four more options for the Trust page's "Security reports" block (Section id `disclosure`),
 * asked for by the owner ("provide more options"), over the one DISCLOSURE copy of content.ts. Every visible string is
 * rendered by reference; the only text typed here is the sr-only "(opens in a new tab)" every external link carries. The
 * block stays on the page in every option, because security.txt's Policy field points at it. The helpers are
 * Disclosure.tsx's (MailButton, TxtLink, ScopeList, TimelineLedger, NewTab) and the tiles are tiles.tsx's, so the block
 * reads as the same page as What we keep D, the lit tiles the owner picked. The record line is the ruled one linked
 * line (D29) in all four, never a card, a badge or a feature.
 *
 * D: the report's journey, drawn. Five stations in a row on lg (stacked below it): the report itself in a grey tile
 *    (the address is the link, and the block's only action: no orange button, the closing has it), then the four
 *    timelines in lit tiles, joined by the hairline wire of How sign-in works B
 *    with its travelling light, started a beat later on each segment so the light runs on from the report to the credit.
 *    Colour: the lit tiles and the light (#FFB36B, `eo-pulse`, which carries its own reduced-motion rule: the light stops,
 *    lit near the start of each segment). Scope sits under it on the left, the safe harbour on the right.
 * E: the email, drafted. A hairline email card (To, Subject, then what to include as four small lit check tiles) whose
 *    one orange button opens the reader's mail app with that subject and body already filled in; the four timelines sit
 *    beside it as the existing ledger. Colour: the small lit check tiles and the one orange button. The card says what
 *    to send, so this option does not repeat the ask in prose.
 * F: the address first. The address set as the block's headline, a link with the copy button beside it (a client island
 *    whose check turns orange for two seconds), then the four timelines as four ruled cells each led by a lit tile.
 *    Colour: the lit tiles, the address on hover and the copy check. There is no mail button: the address is the action.
 * G: two sides of one agreement. What we promise (the four timelines and the legal promise) on the left, each in a lit
 *    tile; what we ask of you on the right, each in a grey tile, in the same row shape. The safe harbour sentence runs
 *    underneath both, as written. Colour: lit tiles on our side (what we commit to), quiet tiles on the reader's side.
 *
 * Type: Geist throughout. font-mono appears only where ScopeText sets the wildcard host pattern (machine data); the
 * address is read by people, so it is sans everywhere. Digits sit in tabular-nums. Square corners; the only round shapes
 * are the 8px scope dots. Server components throughout, with Reveal (the homepage's wrapper) and the CopyButton island.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ArrowUpRight,
  ChatText,
  Check,
  ClockCountdown,
  Database,
  EnvelopeSimple,
  MagnifyingGlass,
  Medal,
  PencilSimple,
  Pulse,
  Wrench,
} from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '../home/Reveal'
import { Section } from '../home/Section'
import { CopyButton } from './CopyButton'
import { DISCLOSURE } from './content'
import { MailButton, NewTab, ScopeList, TimelineLedger, TxtLink } from './Disclosure'
import { Wire } from './SignIn'
import { LitTile, QuietTile } from './tiles'

const { email, how, timelines, bounty, pgp, safeHarbour, record, labels, draft, copy, sides } = DISCLOSURE

/** The four timelines' glyphs, in the order of DISCLOSURE.timelines: reply, assess, fix, credit. */
const TIMELINE_ICONS = [ChatText, MagnifyingGlass, Wrench, Medal]
/** The four things we ask of the reader, in the order of DISCLOSURE.sides.ask: report, data, service, time. */
const ASK_ICONS = [EnvelopeSimple, Database, Pulse, ClockCountdown]

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
/** An inline text link, the one device the page uses for a link inside a sentence: underlined in a quiet grey, orange on hover. */
const TEXT_LINK = `font-medium text-foreground underline decoration-muted-foreground/60 underline-offset-4 transition-colors duration-150 hover:text-primary hover:decoration-primary ${FOCUS}`

/** The ruled one-line track record: the sentence, with its one external link inline (same recipe as Disclosure B). */
function RecordLine() {
  return (
    <p className="max-w-3xl text-[15px] leading-relaxed tabular-nums text-muted-foreground">
      {record.text}{' '}
      <a href={record.href} target="_blank" rel="noopener noreferrer" className={`whitespace-nowrap ${TEXT_LINK}`}>
        {record.linkLabel}
        <ArrowUpRight className="ml-1 inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />
        <NewTab />
      </a>
    </p>
  )
}

/** The block's last lines in every option: the record line, then the link to the security.txt that points here. */
function RecordAndTxt() {
  return (
    <>
      <RecordLine />
      <div className="mt-6">
        <TxtLink />
      </div>
    </>
  )
}

/** The two short notes every option carries: no bounty, no PGP key. */
function Notes({ className }: { className: string }) {
  return (
    <div className={className}>
      <p>{bounty}</p>
      <p>{pgp}</p>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* D: the report's journey, drawn                                                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

/** Stations run 0 (the report) to LAST (the credit); the wire runs between neighbours, so the last station has none. */
const LAST = timelines.length
/**
 * The light on each segment starts a beat after the one before it, so it reads as one light travelling from the report
 * to the credit. 1.8 s is eo-pulse's own start delay (overhaul-mock.css), kept as the first segment's. Under
 * prefers-reduced-motion eo-pulse's rule stops the animation outright, so the delay has no effect there.
 */
const RELAY_START = 1.8
const RELAY_STEP = 0.45

/**
 * One station: a tile, then its words. On lg the stations are five equal columns, the tile above its words, and each
 * segment of wire runs from this tile's centre to the next one's (the next column starts one grid gap, 1.5rem, after
 * this one ends). Below lg they stack, the words beside the tile, and the wire runs straight down from each tile's centre
 * to the next one's. The tiles are opaque and sit above the wire (relative z-10), so it shows only between them.
 */
function Station({ i, tile, children }: { i: number; tile: ReactNode; children: ReactNode }) {
  const relay = { '--wd': `${(RELAY_START + i * RELAY_STEP).toFixed(2)}s` } as CSSProperties
  return (
    <li className="relative flex gap-5 pb-10 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0">
      {i < LAST && (
        <>
          <span
            aria-hidden="true"
            style={relay}
            className="pointer-events-none absolute -bottom-5 left-[19px] top-5 w-[2px] lg:hidden [&_.eo-pulse]:[animation-delay:var(--wd)]"
          >
            <Wire axis="y" />
          </span>
          <span
            aria-hidden="true"
            style={relay}
            className="pointer-events-none absolute left-5 top-[19px] hidden h-[2px] w-[calc(100%_+_1.5rem)] lg:block [&_.eo-pulse]:[animation-delay:var(--wd)]"
          >
            <Wire axis="x" />
          </span>
        </>
      )}
      {tile}
      <div className="min-w-0 pt-2 lg:mt-5 lg:pt-0">{children}</div>
    </li>
  )
}

export function DisclosureD() {
  return (
    <Section id={DISCLOSURE.id} eyebrow={DISCLOSURE.eyebrow} title={DISCLOSURE.title}>
      {/* No orange button here (lead's review, 17-10): the address showed three times running (the sentence, the button,
          the first station), and the closing right below carries the same action. The first station's link is it. */}
      <Reveal>
        <p className="max-w-2xl text-lg leading-relaxed text-foreground">{how}</p>
      </Reveal>

      <Reveal className="mt-14" delay={60}>
        <ol role="list" className="lg:grid lg:grid-cols-5 lg:gap-x-6">
          <Station
            i={0}
            tile={
              <QuietTile className="relative z-10">
                <EnvelopeSimple className="h-5 w-5" aria-hidden="true" />
              </QuietTile>
            }
          >
            <h3 className="text-[15px] font-semibold text-foreground">{labels.contact}</h3>
            <p className="mt-1 text-sm">
              <a href={`mailto:${email}`} className={`[overflow-wrap:anywhere] ${TEXT_LINK}`}>
                {email}
              </a>
            </p>
          </Station>
          {timelines.map((t, i) => {
            const Glyph = TIMELINE_ICONS[i]
            return (
              <Station
                key={t.term}
                i={i + 1}
                tile={
                  <LitTile className="relative z-10">
                    <Glyph className="h-5 w-5" aria-hidden="true" />
                  </LitTile>
                }
              >
                <h3 className="text-[15px] font-semibold text-foreground">{t.term}</h3>
                <p className="mt-1 text-sm tabular-nums text-muted-foreground">{t.detail}</p>
              </Station>
            )
          })}
        </ol>
      </Reveal>

      <Reveal className="mt-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div className="min-w-0 space-y-8">
            <ScopeList idPrefix="dsc-d" kind="in" hairlines />
            <ScopeList idPrefix="dsc-d" kind="out" hairlines />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] leading-relaxed text-foreground">{safeHarbour}</p>
            <Notes className="mt-6 space-y-3 text-[15px] leading-relaxed text-muted-foreground" />
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-16 border-t border-border pt-8">
        <RecordAndTxt />
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* E: the email, drafted                                                                                               */
/* ------------------------------------------------------------------------------------------------------------------ */

/** Opens the reader's mail app with the subject set and the four things to include as headings in the body. */
const DRAFT_HREF =
  'mailto:' +
  email +
  '?subject=' +
  encodeURIComponent(draft.subject) +
  '&body=' +
  encodeURIComponent(draft.include.map((i) => i + ':\r\n\r\n').join(''))

// items-baseline: the label and the value share a baseline even where the value is a medium-weight link or wraps.
const DRAFT_ROW = 'flex items-baseline gap-4 border-b border-border px-5 py-3.5 text-[15px]'

function EmailCard() {
  const includeId = 'dsc-e-include'
  return (
    <div className="border border-border bg-card">
      <dl>
        <div className={DRAFT_ROW}>
          <dt className="w-20 shrink-0 text-muted-foreground">{draft.toLabel}</dt>
          <dd className="min-w-0">
            <a href={`mailto:${email}`} className={`[overflow-wrap:anywhere] ${TEXT_LINK}`}>
              {email}
            </a>
          </dd>
        </div>
        <div className={DRAFT_ROW}>
          <dt className="w-20 shrink-0 text-muted-foreground">{draft.subjectLabel}</dt>
          <dd className="min-w-0 text-foreground">{draft.subject}</dd>
        </div>
      </dl>

      <div className="px-5 py-5">
        <h3 id={includeId} className="text-sm font-normal text-muted-foreground">
          {draft.includeLabel}
        </h3>
        <ul role="list" aria-labelledby={includeId} className="mt-4 space-y-3">
          {draft.include.map((item) => (
            <li key={item} className="flex items-start gap-3.5">
              <LitTile className="h-8 w-8">
                <Check className="h-4 w-4" aria-hidden="true" />
              </LitTile>
              <span className="min-w-0 pt-1 text-[15px] text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border px-5 py-4">
        {/* MailButton's recipe, class for class, with the pencil: the one filled action of the option. */}
        <a
          href={DRAFT_HREF}
          className={`inline-flex h-12 items-center gap-2.5 bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[#E54E00] ${FOCUS}`}
        >
          <PencilSimple className="h-4 w-4 shrink-0" aria-hidden="true" />
          {draft.button}
        </a>
      </div>
    </div>
  )
}

export function DisclosureE() {
  return (
    <Section id={DISCLOSURE.id} eyebrow={DISCLOSURE.eyebrow} title={DISCLOSURE.title}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <Reveal className="min-w-0">
          <EmailCard />
        </Reveal>
        <Reveal className="min-w-0" delay={90}>
          <TimelineLedger />
          <Notes className="mt-8 space-y-3 text-[15px] leading-relaxed text-muted-foreground" />
        </Reveal>
      </div>

      <Reveal className="mt-16 border-t border-border pt-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          <ScopeList idPrefix="dsc-e" kind="in" hairlines />
          <ScopeList idPrefix="dsc-e" kind="out" hairlines />
        </div>
        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-foreground">{safeHarbour}</p>
        <div className="mt-12 border-t border-border pt-8">
          <RecordAndTxt />
        </div>
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* F: the address first                                                                                                */
/* ------------------------------------------------------------------------------------------------------------------ */

export function DisclosureF() {
  return (
    <Section id={DISCLOSURE.id} eyebrow={DISCLOSURE.eyebrow} title={DISCLOSURE.title}>
      <Reveal>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${email}`}
            className={`font-display text-3xl font-semibold tracking-[-0.03em] text-foreground transition-colors duration-150 hover:text-primary sm:text-5xl [overflow-wrap:anywhere] ${FOCUS}`}
          >
            {email}
          </a>
          <CopyButton text={email} label={copy.label} done={copy.done} failed={copy.failed} />
        </div>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{how}</p>
      </Reveal>

      <Reveal className="mt-14" delay={60}>
        <ul role="list" className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {timelines.map((t, i) => {
            const Glyph = TIMELINE_ICONS[i]
            return (
              <li key={t.term} className="min-w-0 border-t border-border pt-6">
                <LitTile>
                  <Glyph className="h-5 w-5" aria-hidden="true" />
                </LitTile>
                <dl>
                  <dt className="mt-5 text-sm text-muted-foreground">{t.term}</dt>
                  <dd className="mt-1 text-lg font-medium tabular-nums text-foreground">{t.detail}</dd>
                </dl>
              </li>
            )
          })}
        </ul>
      </Reveal>

      <Reveal className="mt-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div className="min-w-0 space-y-8">
            <ScopeList idPrefix="dsc-f" kind="in" />
            <ScopeList idPrefix="dsc-f" kind="out" />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] leading-relaxed text-foreground">{safeHarbour}</p>
            <Notes className="mt-6 space-y-3 text-[15px] leading-relaxed text-muted-foreground" />
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-16 border-t border-border pt-8">
        <RecordAndTxt />
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* G: two sides of one agreement                                                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

const SIDE_HEADING = 'border-b border-border pb-3 text-sm font-normal text-muted-foreground'
const SIDE_ROW = 'flex items-start gap-4 border-b border-border py-4'

export function DisclosureG() {
  return (
    <Section id={DISCLOSURE.id} eyebrow={DISCLOSURE.eyebrow} title={DISCLOSURE.title}>
      <Reveal>
        <p className="max-w-2xl text-lg leading-relaxed text-foreground">{how}</p>
        <div className="mt-8">
          <MailButton />
        </div>
      </Reveal>

      <Reveal className="mt-16" delay={60}>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <h3 className={SIDE_HEADING}>{sides.ours}</h3>
            <ul role="list">
              {[...timelines, sides.legal].map((t) => (
                <li key={t.term} className={SIDE_ROW}>
                  <LitTile>
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </LitTile>
                  <dl className="min-w-0">
                    <dt className="text-sm text-muted-foreground">{t.term}</dt>
                    <dd className="mt-0.5 text-[15px] font-medium tabular-nums text-foreground">{t.detail}</dd>
                  </dl>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className={SIDE_HEADING}>{sides.yours}</h3>
            <ul role="list">
              {sides.ask.map((item, i) => {
                const Glyph = ASK_ICONS[i]
                return (
                  <li key={item} className={SIDE_ROW}>
                    <QuietTile>
                      <Glyph className="h-5 w-5" aria-hidden="true" />
                    </QuietTile>
                    <span className="min-w-0 pt-2 text-[15px] text-foreground">{item}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <p className="mt-10 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">{safeHarbour}</p>
      </Reveal>

      <Reveal className="mt-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div className="min-w-0 space-y-8">
            <ScopeList idPrefix="dsc-g" kind="in" />
            <ScopeList idPrefix="dsc-g" kind="out" />
          </div>
          <Notes className="min-w-0 space-y-3 text-[15px] leading-relaxed text-muted-foreground" />
        </div>
      </Reveal>

      <Reveal className="mt-16 border-t border-border pt-8">
        <RecordAndTxt />
      </Reveal>
    </Section>
  )
}
