/**
 * Round 5c (mock, 17-10-2026): four more options (D to G) for the Trust page's "How sign-in works" block (Section id
 * `sign-in`), asked for by the owner after A to C. The words are SignIn.tsx's: the one SIGN_IN export of content.ts,
 * rendered by reference and not reworded here. Every option shows the title (through Section), both body paragraphs, the
 * email and recovery paragraphs in full, sessions, the stored list under its label with the Ciphera ID mark and all four
 * column names, and the link to the open-source block last. The column names are the only mono text (machine data);
 * everything else is Geist sans, digits in tabular-nums. Nothing drawn is a value: no hex string, no scrambled password,
 * and no light, arrow or line leaves the password itself, because OPAQUE never sends it (review F1). The only literal text
 * is F's step digits, 1 to 4.
 *
 * D, lit topics: What we keep D's device, so the two blocks read as one page. Four topics (the password, the email
 *    address, forgetting the password, once you are in) in a 2 x 2 grid, each beside a LitTile with its own icon. The
 *    stored list runs full width below as SignInB's compact four-up. Colour: the four lit tiles. Reuses LitTile, IdMark,
 *    Column and TesseraLink.
 * E, the exchange drawn large: SignInB's drawing (tiles opaque over a wire, the wire centred on them, stacked below lg)
 *    with real stations. Your device is a drawn password field, masking dots only, with its lock; On the way is a plain
 *    tile on the wire; Our server is a card holding a database tile, the Exoscale mark and the Swiss flag with the place.
 *    The wire out of the device is plain. The one out of On the way carries two lights, one to the server and one back
 *    (an exchange, not a password travelling). Colour: the lock (the one lit point of the device: the password is locked
 *    there), the two lights (the homepage arc's `eo-pulse`, #FFB36B, with its own reduced-motion rule), the Exoscale
 *    mark and the flag in their real colours. Reuses SignInB's Wire and its geometry, QuietTile, ProviderMark and FlagCH.
 * F, one sign-in step by step: the homepage stepper's vocabulary, simplified. Four LitTiles on a hairline track, each with
 *    its number, title and line; the track lights once, left to right (top to bottom below lg), when the block is
 *    revealed, and is lit at once under reduced motion. The light starts at the SECOND step (review F1, applied by the
 *    lead 17-10): typing the password and the browser's proof both happen on the device, so that first stretch stays a
 *    plain hairline, as B and E keep the wire out of the device plain. Colour: the lit tiles and the drawn track (the one place orange
 *    is a line; it is a 2px stroke, never a panel). Reuses LitTile and Reveal's data-reveal hook.
 * G, who can read what: an access grid in What we keep D's language, lit where something can be read and struck where it
 *    cannot, in a real table with a header row and a header column. Colour: the lit and struck tiles. Reuses LitTile,
 *    StruckTile and ProvidersB's focusable scroll region.
 */
import type { ComponentType } from 'react'
import {
  ArrowsLeftRight,
  Check,
  Database,
  EnvelopeSimple,
  IdentificationCard,
  Keyboard,
  Lifebuoy,
  LockKey,
  Password,
  ShieldCheck,
  SignIn as SignInIcon,
  Timer,
} from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'
import { Reveal } from '../home/Reveal'
import { Section } from '../home/Section'
import { SIGN_IN } from './content'
import { FlagCH, ProviderMark } from './Providers'
import { Column, IdMark, TesseraLink, Wire } from './SignIn'
import { LitTile, QuietTile, StruckTile } from './tiles'

type IconType = ComponentType<{ className?: string }>

/* ------------------------------------------------------------------------------------------------------------------ */
/* Shared                                                                                                             */
/* ------------------------------------------------------------------------------------------------------------------ */

/** Muted 15px text. The recovery and sessions paragraphs carry digits, so they get tabular-nums. (Never quote the recovery
 * paragraph in a comment here: the repo's recovery-copy guard treats any file that does as a surface it must check.) */
const MUTED = 'text-[15px] leading-relaxed tabular-nums text-muted-foreground'

/** The stored list's heading: the Ciphera ID mark beside the label, as SignInB sets it. */
function StoredHeading() {
  return (
    <h3 className="flex items-center gap-2.5 text-sm font-medium text-foreground">
      <IdMark /> {SIGN_IN.storedLabel}
    </h3>
  )
}

/** SignInB's compact four-up: a hairline over each cell, the column name over what it holds. */
function StoredFourUp() {
  return (
    <div>
      <StoredHeading />
      <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {SIGN_IN.stored.map((s) => (
          <div key={s.column} className="min-w-0 border-t border-border pt-4">
            <dt className="[overflow-wrap:anywhere]">
              <Column name={s.column} />
            </dt>
            <dd className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{s.what}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** The same four rows stacked, for a column too narrow to hold four across (F and G). */
function StoredLedger() {
  return (
    <div>
      <StoredHeading />
      <dl className="mt-5">
        {SIGN_IN.stored.map((s) => (
          <div key={s.column} className="border-t border-border py-4">
            <dt className="[overflow-wrap:anywhere]">
              <Column name={s.column} />
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.what}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** The block's last line, in every option: the link to the open-source block. */
function OpenSourceLink() {
  return (
    <div className="mt-12 border-t border-border pt-6">
      <TesseraLink />
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* D: lit topics                                                                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

type Topic = { label: string; Icon: IconType; paragraphs: { text: string; lead?: boolean }[] }

const TOPICS: Topic[] = [
  {
    label: SIGN_IN.topics.password,
    Icon: Password,
    paragraphs: [{ text: SIGN_IN.body[0], lead: true }, { text: SIGN_IN.body[1] }],
  },
  { label: SIGN_IN.topics.email, Icon: EnvelopeSimple, paragraphs: [{ text: SIGN_IN.email }] },
  { label: SIGN_IN.topics.recovery, Icon: Lifebuoy, paragraphs: [{ text: SIGN_IN.recovery }] },
  { label: SIGN_IN.topics.sessions, Icon: Timer, paragraphs: [{ text: SIGN_IN.sessions }] },
]

export function SignInD() {
  return (
    <Section id={SIGN_IN.id} eyebrow={SIGN_IN.eyebrow} title={SIGN_IN.title}>
      <ul role="list" className="grid gap-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
        {TOPICS.map(({ label, Icon, paragraphs }, i) => (
          <li key={label} className="min-w-0">
            <Reveal delay={i * 60}>
              <div className="flex items-start gap-4">
                <LitTile>
                  <Icon className="h-5 w-5" />
                </LitTile>
                <div className="min-w-0 pt-2">
                  <h3 className="text-[15px] font-semibold text-foreground">{label}</h3>
                  <div className="mt-2 space-y-3 text-[15px] leading-relaxed tabular-nums">
                    {paragraphs.map((p) => (
                      <p key={p.text} className={p.lead ? 'text-foreground' : 'text-muted-foreground'}>
                        {p.text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={60}>
        <div className="mt-16">
          <StoredFourUp />
        </div>
        <OpenSourceLink />
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* E: the exchange, drawn large                                                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

/** Eight masking dots in the drawn field. They stand for nothing: no value is drawn. */
const DOTS = Array.from({ length: 8 }, (_, i) => i)

/**
 * The two station cards share one box, 110px tall: on lg the wire runs through the middle of that row (55px down, the
 * 2px wire at 54px), and the On the way tile (44px) is centred on it. Both cards sit above the wire (z-10) and are opaque,
 * so the wire shows only between them. Below lg the card is capped at 28rem so it does not stretch across a tablet.
 */
const CARD = 'relative z-10 flex h-[110px] max-w-md flex-col justify-center border border-border bg-card p-5 lg:max-w-none'

/** A station's place and line. The middle one centres under its tile on lg; the other two start at their card's edge. */
function Caption({ place, line, centered, className }: { place: string; line: string; centered?: boolean; className?: string }) {
  return (
    <div className={cn('min-w-0', centered && 'lg:text-center', className)}>
      <p className="text-[15px] font-medium text-foreground">{place}</p>
      <p className={cn('mt-1.5 max-w-[19rem] text-balance text-sm leading-relaxed text-muted-foreground', centered && 'lg:mx-auto')}>{line}</p>
    </div>
  )
}

/**
 * The return light. Wire draws the hairline and the light that travels toward the server; this draws only the light that
 * travels back, on the reversed path, started 3.4s in so it leaves as the first one arrives. Same `eo-pulse` class (and
 * with it the reduced-motion rule), same pathLength and stretch as Wire.
 */
function WireBack({ axis }: { axis: 'x' | 'y' }) {
  const x = axis === 'x'
  const d = x ? 'M1000 1H0' : 'M1 1000V0'
  return (
    <svg viewBox={x ? '0 0 1000 2' : '0 0 2 1000'} preserveAspectRatio="none" className="block h-full w-full" aria-hidden="true">
      <path className="eo-pulse" style={{ animationDelay: '3.4s' }} d={d} pathLength={1} fill="none" stroke="#FFB36B" strokeWidth="1.8" />
    </svg>
  )
}

/** Below lg a station that holds a card is only a point on the rail, level with the middle of its card (55px down). */
function RailPoint() {
  return (
    <span aria-hidden="true" className="absolute left-0 top-[33px] z-10 flex h-11 w-11 items-center justify-center lg:hidden">
      <span className="h-2.5 w-2.5 border border-muted-foreground bg-background" />
    </span>
  )
}

/** The device: a password field as it looks when typed in. The lock is the field's one lit point. Decorative. */
function PasswordCard() {
  return (
    <div aria-hidden="true" className={CARD}>
      <p className="text-xs leading-4 text-muted-foreground">{SIGN_IN.fieldLabel}</p>
      <div className="mt-3 flex h-10 items-center justify-between border border-border bg-background px-3">
        <span className="flex items-center gap-1.5">
          {DOTS.map((i) => (
            <span key={i} className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
          ))}
        </span>
        <LockKey className="h-5 w-5 shrink-0 text-primary" />
      </div>
    </div>
  )
}

/** The server: a database tile and the Exoscale mark, and where it stands. */
function ServerCard() {
  return (
    <div className={CARD}>
      <div aria-hidden="true" className="flex items-center justify-between gap-4">
        <QuietTile>
          <Database className="h-5 w-5" />
        </QuietTile>
        <ProviderMark mark="exoscale" size={20} />
      </div>
      <p className="mt-2 flex items-center gap-2.5 text-sm leading-5 text-muted-foreground">
        <FlagCH className="h-3.5 w-auto shrink-0" />
        {SIGN_IN.serverPlace}
      </p>
    </div>
  )
}

// On lg the stations are three columns and the list is the drawing; below lg a 44px rail runs down the left with the
// wire on it, and the stations sit to its right.
const STATION = 'relative pb-10 pl-16 last:pb-0 lg:pb-0 lg:pl-0'

/**
 * The drawing. The two wires are drawn from the edge of one card (8px under it, hidden) to the middle tile's centre (the
 * container's middle), and from there to the edge of the other card. A column is (100% - 64px) / 3 wide (two 32px gaps),
 * which is where the first card ends and the last one begins. Device to On the way is plain; On the way to Our server
 * carries a light each way.
 */
function Drawing() {
  const [device, way, server] = SIGN_IN.flow
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc((100%-64px)/3-8px)] right-1/2 top-[54px] hidden h-[2px] lg:block"
      >
        <Wire axis="x" pulse={false} />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 right-[calc((100%-64px)/3-8px)] top-[54px] hidden h-[2px] lg:block"
      >
        <Wire axis="x" />
        <span className="absolute inset-0 block">
          <WireBack axis="x" />
        </span>
      </div>

      <ol role="list" className="lg:grid lg:grid-cols-3 lg:gap-x-8">
        <li className={STATION}>
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-[22px] left-[21px] top-[55px] w-[2px] lg:hidden">
            <Wire axis="y" pulse={false} />
          </span>
          <RailPoint />
          <PasswordCard />
          <Caption place={device.place} line={device.line} className="mt-4" />
        </li>

        <li className={cn(STATION, 'min-h-11 lg:flex lg:min-h-0 lg:flex-col lg:items-center')}>
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-[55px] left-[21px] top-[22px] w-[2px] lg:hidden">
            <Wire axis="y" />
            <span className="absolute inset-0 block">
              <WireBack axis="y" />
            </span>
          </span>
          <span className="absolute left-0 top-0 lg:static lg:flex lg:h-[110px] lg:items-center">
            <QuietTile className="relative z-10 h-11 w-11">
              <ArrowsLeftRight className="h-5 w-5" />
            </QuietTile>
          </span>
          <Caption place={way.place} line={way.line} centered className="pt-[11px] lg:mt-4 lg:pt-0" />
        </li>

        <li className={STATION}>
          <RailPoint />
          <ServerCard />
          <Caption place={server.place} line={server.line} className="mt-4" />
        </li>
      </ol>
    </div>
  )
}

export function SignInE() {
  return (
    <Section id={SIGN_IN.id} eyebrow={SIGN_IN.eyebrow} title={SIGN_IN.title}>
      <Reveal>
        <Drawing />
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-16 max-w-2xl space-y-5">
          <p className="text-lg leading-relaxed text-foreground">{SIGN_IN.body[0]}</p>
          <p className="text-[15px] leading-relaxed text-muted-foreground">{SIGN_IN.body[1]}</p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          {[SIGN_IN.email, SIGN_IN.recovery].map((t) => (
            <p key={t} className={cn('border-t border-border pt-6', MUTED)}>
              {t}
            </p>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed tabular-nums text-muted-foreground">{SIGN_IN.sessions}</p>
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-14">
          <StoredFourUp />
        </div>
        <OpenSourceLink />
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* F: one sign-in, step by step                                                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

const STEP_ICONS: IconType[] = [Keyboard, ArrowsLeftRight, ShieldCheck, SignInIcon]

// The easing every lit stroke on the site uses: Facet's `ease-apple`, cubic-bezier(0.32, 0.72, 0, 1). The durations are
// inline styles: an arbitrary-value duration or easing class is ambiguous with tailwindcss-animate's utility of the same
// name, and Tailwind then emits no CSS for it at all (measured: it warns and drops the class).
const LIT = 'transition-transform ease-apple motion-reduce:transition-none'

/**
 * A step's own stretch of the vertical track (below lg): from the middle of its tile to the middle of the next one's,
 * drawn in turn so the line reaches each tile after the one above. The base is the hairline, the top is the lit stroke.
 */
function StepRung({ i }: { i: number }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -bottom-5 left-[19px] top-5 w-[2px] lg:hidden">
      <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-border" />
      {/* No light on the first rung: nothing leaves the device between typing the password and the proof (F1). */}
      {i > 0 && (
        <span
          className={cn(
            'absolute inset-0 block origin-top scale-y-0 bg-primary opacity-70 group-data-[reveal=shown]:scale-y-100 motion-reduce:scale-y-100',
            LIT,
          )}
          style={{ transitionDuration: '600ms', transitionDelay: `${(i - 1) * 600}ms` }}
        />
      )}
    </span>
  )
}

export function SignInF() {
  const last = SIGN_IN.steps.length - 1
  return (
    <Section id={SIGN_IN.id} eyebrow={SIGN_IN.eyebrow} title={SIGN_IN.title}>
      <Reveal>
        <p className="max-w-2xl text-lg leading-relaxed text-foreground">{SIGN_IN.body[0]}</p>
      </Reveal>

      <Reveal className="group mt-14">
        <div className="relative">
          {/* lg: one track from the first tile's centre to the last one's (a column is (100% - 96px) / 4 wide, three
              32px gaps; the tile is 40px, so its centre is 20px in). Lit left to right once the block is revealed. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-5 right-[calc((100%-96px)/4-20px)] top-[19px] hidden h-[2px] lg:block"
          >
            <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-border" />
          </div>
          {/* The lit stroke starts at the second tile's centre (one column, one 32px gap and half a tile in: +52px), so the
              stretch between typing the password and the proof stays plain (F1). Two thirds of the track, so 1200ms. */}
          <div
            aria-hidden="true"
            data-lit-track=""
            className="pointer-events-none absolute left-[calc((100%-96px)/4+52px)] right-[calc((100%-96px)/4-20px)] top-[19px] hidden h-[2px] lg:block"
          >
            <span
              className={cn(
                'absolute inset-0 block origin-left scale-x-0 bg-primary opacity-70 group-data-[reveal=shown]:scale-x-100 motion-reduce:scale-x-100',
                LIT,
              )}
              style={{ transitionDuration: '1200ms' }}
            />
          </div>

          <ol role="list" className="lg:grid lg:grid-cols-4 lg:gap-x-8">
            {SIGN_IN.steps.map((s, i) => {
              const Icon = STEP_ICONS[i]
              return (
                <li key={s.title} className="relative flex gap-5 pb-10 last:pb-0 lg:block lg:pb-0">
                  {i < last && <StepRung i={i} />}
                  <LitTile className="relative z-10">
                    <Icon className="h-5 w-5" />
                  </LitTile>
                  <div className="min-w-0 pt-2.5 lg:pt-0">
                    <p className="text-sm tabular-nums text-muted-foreground lg:mt-5">{i + 1}</p>
                    <h3 className="mt-1 text-[15px] font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.line}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <p className="text-[15px] leading-relaxed text-muted-foreground">{SIGN_IN.body[1]}</p>
            <div className="mt-10">
              <StoredLedger />
            </div>
          </div>
          <div className="min-w-0 space-y-8">
            {/* lg: the first paragraph drops its hairline so both columns start on the same line (the left one opens
                with text); stacked, the hairline stays and divides it from the ledger above. */}
            {[SIGN_IN.email, SIGN_IN.recovery, SIGN_IN.sessions].map((t) => (
              <p key={t} className={cn('border-t border-border pt-6 lg:first:border-t-0 lg:first:pt-0', MUTED)}>
                {t}
              </p>
            ))}
          </div>
        </div>
        <OpenSourceLink />
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* G: who can read what                                                                                               */
/* ------------------------------------------------------------------------------------------------------------------ */

const ACCESS = SIGN_IN.access
// One icon per column of the table, in the order of ACCESS.columns: the password, the name, the email address.
const COLUMN_ICONS: IconType[] = [Password, IdentificationCard, EnvelopeSimple]

export function SignInG() {
  return (
    <Section id={SIGN_IN.id} eyebrow={SIGN_IN.eyebrow} title={SIGN_IN.title}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <Reveal className="min-w-0">
          <div className="max-w-xl">
            <p className="text-lg leading-relaxed text-foreground">{SIGN_IN.body[0]}</p>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{SIGN_IN.body[1]}</p>
          </div>
        </Reveal>

        <Reveal delay={90} className="min-w-0">
          {/* The grid fits every width (lead's fix, 17-10: with a 520px minimum it scrolled on a phone and hid the two
              columns that make its point). table-fixed: the three columns take 20 % each and the row names the rest; a
              column is ~68px on a 390px phone, room for its 40px tile. `relative` keeps the cells' sr-only spans (absolutely
              positioned) inside the table's box. */}
          <div className="relative">
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="caption-top pb-3 text-left text-sm text-muted-foreground">{ACCESS.caption}</caption>
              <thead>
                <tr>
                  <td />
                  {ACCESS.columns.map((c) => (
                    <th key={c} scope="col" className="w-[20%] px-1 pb-3 align-bottom text-center text-xs font-normal text-muted-foreground sm:text-sm">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACCESS.rows.map((r) => (
                  <tr key={r.who} className="border-t border-border">
                    <th scope="row" className="py-4 pr-3 text-left text-sm font-medium text-foreground sm:pr-4 sm:text-[15px]">
                      {r.who}
                    </th>
                    {r.can.map((can, i) => {
                      const Icon = COLUMN_ICONS[i]
                      return (
                        <td key={ACCESS.columns[i]} className="py-4 text-center">
                          {can ? (
                            <LitTile className="mx-auto">
                              <Check className="h-5 w-5" />
                            </LitTile>
                          ) : (
                            <StruckTile className="mx-auto">
                              <Icon className="h-5 w-5" />
                            </StruckTile>
                          )}
                          <span className="sr-only">{can ? ACCESS.yes : ACCESS.no}</span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">{SIGN_IN.email}</p>
        </Reveal>
      </div>

      <Reveal delay={60}>
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <p className={MUTED}>{SIGN_IN.recovery}</p>
            <p className={cn('mt-8 border-t border-border pt-6', MUTED)}>{SIGN_IN.sessions}</p>
          </div>
          <div className="min-w-0">
            <StoredLedger />
          </div>
        </div>
        <OpenSourceLink />
      </Reveal>
    </Section>
  )
}
