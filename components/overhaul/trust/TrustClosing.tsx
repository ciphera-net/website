/**
 * Round 5 (mock, 17-10-2026): the Trust page's closing band, three options over the same CLOSING copy (content.ts).
 * No arc, sun or horizon: the page opens on the sunrise and an arc never sits at both ends of a page (D23). It is a
 * plain closing band like AboutClosing with arc={false}: border-t border-border, generous padding, words and buttons.
 * Every visible string is read from CLOSING; the lead is rendered exactly as written (nothing is linkified inside it).
 *
 * A = centred, AboutClosing's quiet form: title, lead, the two buttons, the updated line under them. No rules at all.
 * B = contacts ledger: title, lead and both buttons on the left, CLOSING.contacts on the right as a hairline-ruled
 *     list (term muted, address a mailto link, the whole row is the tap target), the updated line along the bottom.
 *     The only option that uses CLOSING.contacts, so the only one where privacy@ is a link outside the buttons. It
 *     repeats the addresses the lead and the primary label already name; if B wins, the wording round can shorten the lead.
 * C = the section frame's split (home/Section.tsx): the title alone on the left; the lead, both buttons and the updated
 *     line bottom-aligned on the right (stacked on a phone). Rebuilt after review F15: it had differed from A only by
 *     alignment.
 *
 * Colour: orange only on the primary button (and its darker hover) and on link hover. Type is Geist sans throughout
 * (email addresses are read by people, so no mono); numbers carry tabular-nums. Square corners, flat, hairlines only.
 * Motion: the shared Reveal only (dims, never hides). Server component; Reveal is the one client island.
 */
import { Fragment } from 'react'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '../home/Reveal'
import { CLOSING } from './content'

// The two buttons are AboutClosing's, class for class (primary = orange action, secondary = the glass button), plus
// justify-center so they can stretch to the full width of a phone without their label drifting left.
export const BUTTON = 'inline-flex h-12 items-center justify-center gap-2 px-6 text-sm font-medium transition-colors duration-150'
export const PRIMARY = `${BUTTON} bg-primary text-primary-foreground hover:bg-[#E54E00]`
export const SECONDARY = `${BUTTON} border border-white/10 bg-white/[0.04] text-foreground backdrop-blur-md hover:bg-white/[0.08]`

/**
 * The lead, word for word. It is two sentences, each its own instruction, so each sits in an inline-block: a line can
 * break between them or inside one, but never strand a lone "For" at the end of the first line. The split is on
 * ". " only and the full stop goes back on, so the text and the space between the sentences are unchanged for
 * copy and paste and for a screen reader.
 */
export function Lead({ className }: { className: string }) {
  const parts = CLOSING.lead.split('. ')
  return (
    <p className={className}>
      {parts.map((s, i) => (
        <Fragment key={s}>
          {i > 0 && ' '}
          <span className="inline-block">{i < parts.length - 1 ? `${s}.` : s}</span>
        </Fragment>
      ))}
    </p>
  )
}

/** Both buttons, primary first. `className` carries the option's own flex direction, gap and spacing. */
export function Actions({ className }: { className: string }) {
  return (
    <div className={className}>
      <a href={CLOSING.primary.href} className={PRIMARY}>
        {CLOSING.primary.label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
      <a href={CLOSING.secondary.href} className={SECONDARY}>
        {CLOSING.secondary.label}
      </a>
    </div>
  )
}

/** Option A: centred and quiet. */
export function TrustClosingA() {
  return (
    <section
      data-mock-section="trust-closing"
      aria-labelledby="trust-closing-a-title"
      className="border-t border-border px-6 py-24 text-center sm:px-10 lg:py-32"
    >
      <Reveal>
        <h2
          id="trust-closing-a-title"
          className="mx-auto max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-6xl"
        >
          {CLOSING.title}
        </h2>
        <Lead className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground" />
        <Actions className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" />
        <p className="mt-8 text-sm tabular-nums text-muted-foreground">{CLOSING.updated}</p>
      </Reveal>
    </section>
  )
}

/**
 * Option B: the contacts ledger. The left column is wide enough for the longer lead sentence to stay on one line at
 * 1152 px and up, the ledger takes the rest; lg:items-end lands the ledger's last rule on the bottom edge of the
 * buttons. The row is the tap target: the address link stretches over its row (after:absolute after:inset-0 inside
 * a relative row), so hovering anywhere on the row lights the address, while the markup stays a term/description pair.
 */
export function TrustClosingB() {
  return (
    <section
      data-mock-section="trust-closing"
      aria-labelledby="trust-closing-b-title"
      className="border-t border-border px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-x-20">
        <Reveal>
          <h2
            id="trust-closing-b-title"
            className="max-w-xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl"
          >
            {CLOSING.title}
          </h2>
          <Lead className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground" />
          <Actions className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" />
        </Reveal>
        <Reveal delay={90}>
          <dl className="border-t border-border">
            {CLOSING.contacts.map((c) => (
              <div
                key={c.term}
                className="relative flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <dt className="text-sm text-muted-foreground">{c.term}</dt>
                <dd className="shrink-0">
                  <a
                    href={`mailto:${c.detail}`}
                    className="text-[15px] font-medium text-foreground transition-colors duration-150 after:absolute after:inset-0 hover:text-primary"
                  >
                    {c.detail}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
      <Reveal delay={160} className="mt-12">
        <p className="text-sm tabular-nums text-muted-foreground">{CLOSING.updated}</p>
      </Reveal>
    </section>
  )
}

/**
 * Option C: the left-aligned band. One hairline separates the message from its action row, so the date has a row of
 * its own to sit on. lg:items-baseline puts the updated line on the buttons' label baseline, not their centre line.
 */
/**
 * Option C (review F15: it differed from A only by alignment), the section frame's own split, borrowed from
 * home/Section.tsx (title left, the aside bottom-aligned on the right): the title alone on the left; the lead, both
 * buttons and the date as the right column. A is centred, B is a contacts ledger, C is this split.
 */
export function TrustClosingC() {
  return (
    <section
      data-mock-section="trust-closing"
      aria-labelledby="trust-closing-c-title"
      className="border-t border-border px-6 py-24 sm:px-10 lg:py-28"
    >
      <Reveal>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h2
            id="trust-closing-c-title"
            className="max-w-xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl"
          >
            {CLOSING.title}
          </h2>
          <div>
            <Lead className="max-w-md text-lg leading-relaxed text-muted-foreground" />
            <Actions className="mt-8 flex flex-col gap-3 sm:flex-row" />
            <p className="mt-8 text-sm tabular-nums text-muted-foreground">{CLOSING.updated}</p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
