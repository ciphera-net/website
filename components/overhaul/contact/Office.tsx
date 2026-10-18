/**
 * Round 6 (mock, 17-10-2026): five options for the Contact page's "office" block (Section id `office`), over the one
 * OFFICE copy of content.ts. Every visible string is read from it by reference; this file types no prose, only the
 * middle dot (with its spaces) that C joins its details with. The rows are the registered office, the phone and the
 * company number, and every option ends on OFFICE.aboutLink as the homepage's ProofLink. No photo, no map and no
 * business hours (D34; content.ts says why the old photo went). Type is Geist sans throughout, the address and the
 * numbers included (people read them): nothing here is mono, and digits sit in tabular-nums. Colour is the same in all
 * three: Belgium's flag in its own colours (DataMore's FlagBE) before the registered office, and brand orange only
 * where a link is, on its hover and in the focus ring. No tile, panel or tint; square corners; flat. The phone is the
 * one link that sits among plain text, so it takes the Trust page's inline text link (DisclosureMore's TEXT_LINK,
 * without its weight): underlined in a quiet grey, orange on hover, so it is never told apart from its neighbours by
 * colour alone.
 *
 * A = the ledger. About Record D's ledger: one dl under a hairline, a ruled row per fact, the term muted in a 14rem
 *     column from sm up (above the detail on a phone) and the detail beside it at 15px. The flag, 14px high, leads the
 *     office address; the phone is a tel: link; the about link follows the ledger. A term and its detail share one
 *     baseline, the flagged row included. Colour: the flag's own, and orange on the two links' hover.
 * B = the address, set large. A split on lg: the office address in display type, the street on its own line and the
 *     town and country under it (cut from the one string at its first comma), the flag before it; on the right the
 *     phone and the company number, each under its muted term, then the about link; the two columns top-aligned. The
 *     flag is scaled to the type (24px high from sm up, 20px on a phone, where it rides above the address so the
 *     address keeps its two lines) and its foot sits on the first line's baseline. The office's own term stays for
 *     screen readers only, because the block's title already says it. Colour: the flag's own, and orange on hover.
 * C = one quiet line. The three details in one muted paragraph, joined by middle dots, the flag before the address, the
 *     phone the one brighter, underlined item; the about link beside it on lg and under it on a phone. The leanest: no
 *     visible terms (each is said to screen readers), no rules, one row of text. Each dot is glued to the detail before
 *     it (a no-break space), so a wrapped line ends on a dot instead of starting on one, and the phone and the company
 *     number never break inside. Colour: the flag's own, and orange on hover.
 * D = A with the photo (D35: "A/B but add the office image like before"; ruled). A's ledger on the left, each term
 *     above its detail (half the row is too narrow for a term column); the building on the right as today's page shows
 *     it (greyscale, 16:9, uncropped, a hairline frame). On a phone the photo comes first, as on today's page.
 * E = B with the photo. B's address in display type with the flag, the phone and the company number side by side
 *     under it, then the about link; the same photo on the right (first on a phone).
 *
 * Server component. Reveal, the homepage's client wrapper, is the only island here.
 */
import { Fragment } from 'react'
import Image from 'next/image'
import { officeHq } from '@/lib/images'
import { cn } from '@/lib/utils'
import { ProofLink } from '../home/rules'
import { Reveal } from '../home/Reveal'
import { Section } from '../home/Section'
import { FlagBE } from '../trust/DataMore'
import { OFFICE } from './content'

const { rows, aboutLink } = OFFICE
type Row = (typeof rows)[number]

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
const LINK = `text-foreground underline decoration-muted-foreground/60 underline-offset-4 transition-colors duration-150 hover:text-primary hover:decoration-primary ${RING}`
const JOIN = '\u00A0\u00B7 '

function rowOf(key: string): Row | undefined {
  return rows.find((r) => r.key === key)
}

/** Belgium's flag for a row that names it; nothing for any other row. */
function Flag({ place, className }: { place: string | undefined; className: string }) {
  return place === 'be' ? <FlagBE className={className} /> : null
}

/** A row's detail: a link when content.ts gives it an href (the phone's tel:), plain text otherwise. */
function Detail({ row, className }: { row: Row; className?: string }) {
  return row.href ? (
    <a href={row.href} className={cn(LINK, className)}>
      {row.detail}
    </a>
  ) : (
    <span className={className}>{row.detail}</span>
  )
}

function AboutLink() {
  return <ProofLink href={aboutLink.href}>{aboutLink.label}</ProofLink>
}

/** "De Kleetlaan 2, 1831 Diegem, Belgium" -> the street, then the rest; one line when there is no comma. */
function splitAddress(detail: string): { street: string; rest: string | null } {
  const at = detail.indexOf(', ')
  return at === -1 ? { street: detail, rest: null } : { street: detail.slice(0, at), rest: detail.slice(at + 2) }
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* A: the ledger                                                                                                      */
/* ---------------------------------------------------------------------------------------------------------------- */

/**
 * A's ledger, shared with D. `stacked` sets each term above its detail at every width, as on a phone: D gives the ledger
 * half the row, where "Enterprise number (KBO/BCE)" (192 px) and the address (287 px) cannot share one line in a fixed
 * term column (measured at 1440: the column is 511 px; narrower still from lg to 1152 px).
 */
function Ledger({ stacked = false }: { stacked?: boolean }) {
  return (
    <>
      <dl className="border-t border-border">
        {rows.map((row) => (
          <div
            key={row.key}
            className={cn('flex flex-col gap-1 border-b border-border py-4', !stacked && 'sm:flex-row sm:items-baseline sm:gap-6')}
          >
            <dt className={cn('text-sm text-muted-foreground', !stacked && 'sm:w-56 sm:shrink-0')}>{row.term}</dt>
            {/* The detail alone takes part in baseline alignment (self-baseline), so the row's term and its detail share
                one baseline even where a flag leads the line; the flag (mt-1: centred on a 22.5px line) stays on the
                first line if the address ever wraps. */}
            <dd className="flex min-w-0 items-start gap-2 text-[15px] tabular-nums text-foreground">
              <Flag place={row.place} className="mt-1 h-3.5 w-auto shrink-0" />
              <Detail row={row} className="min-w-0 self-baseline [overflow-wrap:anywhere]" />
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-8">
        <AboutLink />
      </div>
    </>
  )
}

export function OfficeA() {
  return (
    <Section id={OFFICE.id} eyebrow={OFFICE.eyebrow} title={OFFICE.title}>
      <Reveal>
        <Ledger />
      </Reveal>
    </Section>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* B: the address, set large                                                                                          */
/* ---------------------------------------------------------------------------------------------------------------- */

/** One fact on the right of B: the muted term, the value under it. */
function Fact({ row }: { row: Row }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{row.term}</dt>
      <dd className="mt-1 text-lg font-medium tabular-nums text-foreground">
        <Detail row={row} className="[overflow-wrap:anywhere]" />
      </dd>
    </div>
  )
}

/** B's office address in display type with the flag, shared with E. Renders nothing if the office row is missing. */
function LargeAddress() {
  const office = rowOf('office')
  const address = office ? splitAddress(office.detail) : null
  if (!office || !address) return null
  return (
    <dl>
      <div>
        <dt className="sr-only">{office.term}</dt>
        {/* The flag rides above the address on a phone (the address then keeps its two lines, flush with the title)
            and before it from sm up. sm:mt-2 sets its foot on the first line's baseline: the line box is 40px
            (text-4xl's own line height), the flag 24px. */}
        <dd className="flex flex-col items-start gap-4 sm:flex-row sm:gap-5">
          <Flag place={office.place} className="h-5 w-auto shrink-0 sm:mt-2 sm:h-6" />
          <address className="min-w-0 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] tabular-nums text-foreground not-italic sm:text-4xl [overflow-wrap:anywhere]">
            <span className="block">{address.street}</span>
            {address.rest && <span className="block">{address.rest}</span>}
          </address>
        </dd>
      </div>
    </dl>
  )
}

export function OfficeB() {
  const phone = rowOf('phone')
  const company = rowOf('company')
  return (
    <Section id={OFFICE.id} eyebrow={OFFICE.eyebrow} title={OFFICE.title}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
        <Reveal className="min-w-0">
          <LargeAddress />
        </Reveal>
        <Reveal delay={80} className="min-w-0">
          <dl className="space-y-6">
            {phone && <Fact row={phone} />}
            {company && <Fact row={company} />}
          </dl>
          <div className="mt-8">
            <AboutLink />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* C: one quiet line                                                                                                  */
/* ---------------------------------------------------------------------------------------------------------------- */

export function OfficeC() {
  return (
    <Section id={OFFICE.id} eyebrow={OFFICE.eyebrow} title={OFFICE.title}>
      <Reveal>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-baseline lg:justify-between lg:gap-12">
          <p className="min-w-0 max-w-3xl text-[15px] leading-relaxed tabular-nums text-muted-foreground">
            {rows.map((row, i) => (
              <Fragment key={row.key}>
                {i > 0 && JOIN}
                {/* No visible terms in this option, so a screen reader still hears what each detail is. */}
                <span className="sr-only">{row.term} </span>
                <Flag place={row.place} className="mr-2 inline-block h-3.5 w-auto align-[-2px]" />
                {/* A row that names a place is an address and may wrap; the others are short and stay whole. */}
                <Detail row={row} className={row.place ? '[overflow-wrap:anywhere]' : 'whitespace-nowrap'} />
              </Fragment>
            ))}
          </p>
          <div className="shrink-0">
            <AboutLink />
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* The photo (D35): D = A with it, E = B with it                                                                      */
/* ---------------------------------------------------------------------------------------------------------------- */

/**
 * The building, as today's live page shows it: greyscale, 16:9 (the photo's own 2048 x 1154 shape, so nothing is cropped
 * and the photographer's mark in its corner stays visible), in a hairline frame, square. The image is a property
 * agent's marketing photo of the shared building (plan §5h item 2); the owner put it back (D35) and the objection is
 * recorded there, with the fix: a photo of our own.
 */
function OfficePhoto() {
  return (
    <figure className="border border-border">
      <Image
        src={officeHq}
        alt={OFFICE.photo.alt}
        width={2048}
        height={1154}
        unoptimized
        className="block aspect-video h-auto w-full object-cover grayscale"
      />
    </figure>
  )
}

// D and E put the photo first in the reading order, so a phone shows the building first, as today's page does; from lg
// it moves to the right column (lg:order-last).
export function OfficeD() {
  return (
    <Section id={OFFICE.id} eyebrow={OFFICE.eyebrow} title={OFFICE.title}>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
        <Reveal className="min-w-0 lg:order-last">
          <OfficePhoto />
        </Reveal>
        <Reveal delay={80} className="min-w-0">
          <Ledger stacked />
        </Reveal>
      </div>
    </Section>
  )
}

export function OfficeE() {
  const phone = rowOf('phone')
  const company = rowOf('company')
  return (
    <Section id={OFFICE.id} eyebrow={OFFICE.eyebrow} title={OFFICE.title}>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
        <Reveal className="min-w-0 lg:order-last">
          <OfficePhoto />
        </Reveal>
        <Reveal delay={80} className="min-w-0">
          <LargeAddress />
          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            {phone && <Fact row={phone} />}
            {company && <Fact row={company} />}
          </dl>
          <div className="mt-8">
            <AboutLink />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
