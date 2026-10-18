/**
 * Round 6 (mock, 17-10-2026): four options for the Contact page's "write" block (Section id `write`), the email addresses,
 * over the one WRITE copy of content.ts. Every visible string is rendered by reference; this file types no prose. All four
 * show the same four items (the term, the address as a mailto link, a copy button, and security's link to the disclosure
 * policy) in the frame the Trust blocks use (home/Section), and differ in device, not in spacing. The reply time is said
 * once, as the block's lead under its title (W6-1, D36), never per address. Type is Geist sans throughout, addresses
 * included (people read them): nothing here is mono.
 *
 * A = lit cards (ruled, D35): Trust closing D's device (TrustClosingMore.tsx). Four cards in a grid (a column on a phone,
 *     two from sm, four from xl), each holding a lit tile (tiles.tsx LitTile, What we keep D's recipe) with the copy
 *     button (CopyButton, a client island) level with it in the card's top-right corner, then the term and the address as
 *     a link. The button is not beside the address, as the brief drew it, because the four-up cards are too narrow for
 *     both on one line (measured; see Card). The card is NOT one big link as it is in Trust closing D: it holds two or
 *     three actions, so each one is its own link or button. Security's card adds the page's ProofLink under its address.
 *     Colour: the four lit tiles; an address turns orange on hover and the copy check is orange for two seconds.
 * B = one ledger: the quiet option. A single hairline-ruled description list (Disclosure C's ledger rows). From lg each
 *     row is two columns: a small grey tile (tiles.tsx QuietTile) with the term on the left, the address with its copy
 *     button on the right; below lg the rows stack. Security's link sits under its term. Colour: none but link hover and
 *     the copy check; the tiles are grey.
 * C = hello@ first, large: the first address is the block's headline, set in display type (Disclosure F's address-first
 *     headline): its term small above, the address with its copy button beside it. The other three follow as A's lit
 *     cards (the same Card), in a row from lg. Colour: the three lit tiles, link hover, the copy check.
 * D = the addresses, large: Trust closing G's device. Four ruled rows in a description list, each with the term small
 *     above and the address in display type beside its copy button, and security's link under its row. No tile and no
 *     card: the restrained option. Colour: link hover and the copy check only.
 *
 * Server component. Reveal and CopyButton are the only client islands. Square corners, flat, hairlines only, and no
 * tinted panel. Motion: the shared Reveal only (it dims, never hides).
 */
import type { ComponentType, ReactNode } from 'react'
import { ChatCircleText, Handshake, Scales, ShieldCheck } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '../home/Reveal'
import { Section } from '../home/Section'
import { ProofLink } from '../home/rules'
import { CopyButton } from '../trust/CopyButton'
import { LitTile, QuietTile } from '../trust/tiles'
import { WRITE } from './content'

type Item = (typeof WRITE.items)[number]
type IconComponent = ComponentType<{ className?: string }>

const { copy } = WRITE

/** The glyph for each `icon` name content.ts gives an item. */
const ICONS: Record<string, IconComponent> = { ChatCircleText, ShieldCheck, Scales, Handshake }

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/** C's headline is hello@ by key, so it stays the headline even if the order of the items ever changes. */
const LEAD_KEY = 'hello'

/** The frame every option shares: the block's id, eyebrow, title and lead (the one reply time), as the Trust blocks set them. */
function Frame({ children }: { children: ReactNode }) {
  return (
    <Section id={WRITE.id} eyebrow={WRITE.eyebrow} title={WRITE.title} lead={<span className="tabular-nums">{WRITE.lead}</span>}>
      {children}
    </Section>
  )
}

function Glyph({ name, className }: { name: string; className: string }) {
  const Icon = ICONS[name]
  return Icon ? <Icon className={className} aria-hidden="true" /> : null
}

/** The address as a mailto link. `type` is the option's own size, weight and tracking; the rest is the same everywhere. */
function AddressLink({ address, type }: { address: string; type: string }) {
  return (
    <a
      href={`mailto:${address}`}
      className={`min-w-0 text-foreground transition-colors duration-150 hover:text-primary [overflow-wrap:anywhere] ${RING} ${type}`}
    >
      {address}
    </a>
  )
}

/** The copy button for one address. Its name carries the address, so four buttons that say "Copy" are never ambiguous. */
function CopyAddress({ address, className }: { address: string; className?: string }) {
  return <CopyButton text={address} label={copy.label} done={copy.done} failed={copy.failed} className={className} />
}

/**
 * A's card, which C reuses for its other three. The card is not a link: it holds the address link, a copy button and,
 * for security, a second link, and a link inside a link is invalid. The term and what it points to are one description
 * (the address, and for security the policy link).
 *
 * The copy button sits in the card's top-right corner, level with the tile, and not beside the address. Measured in
 * Chromium with Geist at 1440 px: the page's content column stops at max-w-6xl (1152 px), so xl:grid-cols-4 makes the
 * cards 256 px wide (206 px inside the border and padding). "business@ciphera.net" is 155 px at 15 px medium, and with
 * a 12 px gap and the 40 px button it needs 207 px, one more than the card has, so it broke in the middle of the word;
 * a smaller gap would fit by 3 px and fail on any rounding or wording change. In the corner the address has the whole
 * 206 px to itself (51 px to spare). The button is still written after the address, so reading order and tab order go
 * term, address, copy; absolute positioning only moves it on the screen.
 */
function Card({ item }: { item: Item }) {
  return (
    <li className="relative flex min-w-0 flex-col border border-border p-6">
      <LitTile>
        <Glyph name={item.icon} className="h-5 w-5" />
      </LitTile>
      <dl className="mt-6">
        <dt className="text-sm text-muted-foreground">{item.term}</dt>
        <dd className="mt-1">
          <AddressLink address={item.address} type="text-[15px] font-medium" />
          <CopyAddress address={item.address} className="absolute right-6 top-6" />
        </dd>
        {item.link && (
          <dd className="mt-4">
            <ProofLink href={item.link.href}>{item.link.label}</ProofLink>
          </dd>
        )}
      </dl>
    </li>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* A: lit cards                                                                                                       */
/* ---------------------------------------------------------------------------------------------------------------- */

export function WriteA() {
  return (
    <Frame>
      <Reveal>
        <ul role="list" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {WRITE.items.map((item) => (
            <Card key={item.key} item={item} />
          ))}
        </ul>
      </Reveal>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* B: one ledger                                                                                                      */
/* ---------------------------------------------------------------------------------------------------------------- */

export function WriteB() {
  return (
    <Frame>
      <Reveal>
        <dl>
          {WRITE.items.map((item) => (
            // From lg each row is a two-column grid with every item placed by hand: the term in the first column, the
            // address in the second, and security's link in a second row under the term (pl-12 is the tile, 2rem, plus
            // its gap, 1rem, so it starts under the term and not under the tile). Below lg the items stack in document
            // order, which keeps the link next to the address it is about: term, address, link.
            // min-h-10: the first line is as tall as the copy button (40px), so the two columns share one centre line
            // whether or not the row has a link.
            <div
              key={item.key}
              className="grid grid-cols-1 gap-4 border-t border-border py-5 last:border-b lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-x-8 lg:gap-y-2"
            >
              <dt className="lg:col-start-1 lg:row-start-1">
                <span className="flex min-h-10 items-center gap-4">
                  <QuietTile className="h-8 w-8">
                    <Glyph name={item.icon} className="h-4 w-4" />
                  </QuietTile>
                  <span className="min-w-0 text-sm text-muted-foreground">{item.term}</span>
                </span>
              </dt>
              <dd className="flex items-center gap-3 lg:col-start-2 lg:row-start-1">
                <AddressLink address={item.address} type="text-[15px] font-medium" />
                <CopyAddress address={item.address} />
              </dd>
              {item.link && (
                <dd className="lg:col-start-1 lg:row-start-2 lg:pl-12">
                  <ProofLink href={item.link.href}>{item.link.label}</ProofLink>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </Reveal>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* C: hello@ first, large                                                                                              */
/* ---------------------------------------------------------------------------------------------------------------- */

export function WriteC() {
  const lead = WRITE.items.find((i) => i.key === LEAD_KEY) ?? WRITE.items[0]
  const rest = WRITE.items.filter((i) => i !== lead)
  return (
    <Frame>
      <Reveal>
        <dl>
          <dt className="text-sm text-muted-foreground">{lead.term}</dt>
          <dd className="mt-3 flex flex-wrap items-center gap-4">
            <AddressLink address={lead.address} type="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-5xl" />
            <CopyAddress address={lead.address} />
          </dd>
          {lead.link && (
            <dd className="mt-4">
              <ProofLink href={lead.link.href}>{lead.link.label}</ProofLink>
            </dd>
          )}
        </dl>
      </Reveal>
      <Reveal delay={80} className="mt-14">
        <ul role="list" className="grid gap-4 lg:grid-cols-3">
          {rest.map((item) => (
            <Card key={item.key} item={item} />
          ))}
        </ul>
      </Reveal>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* D: the addresses, large                                                                                            */
/* ---------------------------------------------------------------------------------------------------------------- */

export function WriteD() {
  return (
    <Frame>
      <Reveal>
        <dl>
          {WRITE.items.map((item) => (
            // One column: the term small above, the address in display type beside its copy button, and security's link
            // under its row, so the link sits next to the address it is about.
            <div key={item.key} className="border-t border-border py-6 last:border-b">
              <dt className="text-sm text-muted-foreground">{item.term}</dt>
              <dd className="mt-2 flex flex-wrap items-center gap-4">
                <AddressLink address={item.address} type="font-display text-2xl font-semibold tracking-[-0.03em] sm:text-4xl" />
                <CopyAddress address={item.address} />
              </dd>
              {item.link && (
                <dd className="mt-4">
                  <ProofLink href={item.link.href}>{item.link.label}</ProofLink>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </Reveal>
    </Frame>
  )
}
