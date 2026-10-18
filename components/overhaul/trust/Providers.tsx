/**
 * Round 5 (mock, 17-10-2026): the Trust page's "Where it runs" block, three options over one source of words
 * (content.ts PROVIDERS, rendered by reference: no string is typed in this file). Every option opens with the empty
 * anchor that old #subprocessors links land on, shows both lead paragraphs, all seven companies, and the scope line
 * with its two notes. The options differ in device, not in spacing:
 *
 * A — ledger. One ruled row per company. A 44px square tile holds the brand mark in its real colour (About Story D's
 *     StackTile, minus the link states: nothing here is a link), then the name over what we use it for, then two
 *     labelled fields, what it sees and where, the place drawn with its flag (About Record D's flags).
 * B — table. A semantic <table> with the four column labels as <th scope="col"> and a 16px mark beside each name. No
 *     flags. On a phone it scrolls sideways inside its own region and the name column stays in view.
 * C — grouped by where. Three places side by side, each headed by its flag(s) and, when the group's rows agree on one
 *     place name, that name (Switzerland, United States). bunny.net and Mollie name two different places and content.ts
 *     has no word for the two together, so that heading is the flags alone and each of its cards says its own place.
 *     Hairline cards hold mark, name, role and what it sees.
 *
 * Marks: brand-marks.ts INFRA_MARKS for Exoscale, Infomaniak and bunny.net; Simple Icons (CC0, simple-icons@15) for
 * Let's Encrypt and Linear; Phosphor's GithubLogo for GitHub. Colours are Simple Icons' data values, except where the
 * brand colour cannot be read on the near-black page (GitHub #181717 is 1.1:1, Let's Encrypt #003A70 is 1.7:1): those
 * two are drawn white. Mollie has no icon in Simple Icons (404 in the latest release of every major from v5 to v16), so
 * its mark is its own: the "m" of the wordmark mollie.com serves inline (owner 17-10: "fix the mollie logo, it doesnt
 * show"), drawn white for the same reason as GitHub's.
 * Flags: flag-icons (MIT) 7.2.3 for Slovenia, the Netherlands and the United States; Switzerland's square flag is
 * copied from about/Record.tsx. All four carry the faint 1px frame FlagBE has, because the US canton (#192f5d) is
 * nearly the page's own black.
 *
 * Colour: marks and flags only. Nothing in this block is an action, so there is no orange in any option.
 */
import { GithubLogo } from '@phosphor-icons/react/dist/ssr'
import { INFRA_MARKS } from '../brand-marks'
import { Reveal } from '../home/Reveal'
import { Section } from '../home/Section'
import { PROVIDERS } from './content'

type Row = (typeof PROVIDERS.rows)[number]

/* ---------------------------------------------------------------- marks */

// Simple Icons (CC0-1.0), simple-icons@15, icons/<slug>.svg, path data only (viewBox 0 0 24 24).
const LETSENCRYPT_PATH =
  'M11.9914 0a.8829.8829 0 00-.8718.817v3.0209A.8829.8829 0 0012 4.7207a.8829.8829 0 00.8803-.8803V.817a.8829.8829 0 00-.889-.817zm7.7048 3.1089a.8804.8804 0 00-.5214.1742l-2.374 1.9482a.8804.8804 0 00.5592 1.5622.8794.8794 0 00.5592-.2001l2.3714-1.9506a.8804.8804 0 00-.5944-1.534zm-15.3763.0133a.8829.8829 0 00-.611 1.5206l2.37 1.9506a.876.876 0 00.5606.2001v-.002a.8804.8804 0 00.5597-1.5602L4.8277 3.2831a.8829.8829 0 00-.5078-.161zm7.6598 3.2275a5.0456 5.0456 0 00-5.0262 5.0455v1.4876H5.787a.9672.9672 0 00-.9647.9643v9.1887a.9672.9672 0 00.9647.9643H18.213a.9672.9672 0 00.9643-.9643v-9.1907a.9672.9672 0 00-.9643-.9623h-1.1684v-1.4876a5.0456 5.0456 0 00-5.0649-5.0455zm.0127 2.8933a2.1522 2.1522 0 012.1593 2.1522v1.4876H9.8473v-1.4876a2.1522 2.1522 0 012.145-2.1522zm7.3812.5033a.8829.8829 0 10.0705 1.7632h3.0267a.8829.8829 0 000-1.7609H19.444a.8829.8829 0 00-.0705-.0023zm-17.8444.0023a.8829.8829 0 000 1.7609h2.9983a.8829.8829 0 000-1.7609zm10.4596 6.7746a1.2792 1.2792 0 01.641 2.3926v1.2453a.6298.6298 0 01-1.2595 0v-1.2453a1.2792 1.2792 0 01.6185-2.3926z'
const LINEAR_PATH =
  'M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z'

// Mollie: the first glyph of the wordmark mollie.com draws inline in its header (a 43 x 13 SVG; fetched 17-10-2026), the
// same "m" its favicon shows white on black. Mollie's own path, unaltered; MARK_VIEWBOX crops a square around the glyph
// (x 0.07 to 12.62, y 4.23 to 12.81, centred), because it is not drawn on Simple Icons' 24 x 24 grid.
const MOLLIE_PATH =
  'M11.667 5.48654C12.2793 6.19992 12.6179 7.12292 12.6179 8.08167V12.8093H10.6201V8.02263C10.6159 7.08175 9.87342 6.31367 8.96965 6.31367C8.91779 6.31367 8.86127 6.318 8.80476 6.32288C7.9969 6.409 7.3192 7.20904 7.3192 8.07246V12.8093H5.32135V8.03617C5.3172 7.09096 4.57883 6.318 3.67505 6.318C3.6232 6.318 3.56668 6.32288 3.51016 6.32721C2.70646 6.41388 2.02461 7.21338 2.02461 8.08167V12.8093H0.0703125V8.02263C0.0703125 5.93179 1.69898 4.23204 3.69683 4.23204C4.69602 4.23204 5.64698 4.66808 6.3335 5.4275C7.0195 4.66375 7.97513 4.23204 8.98261 4.23204C9.0915 4.23204 9.19572 4.23638 9.30409 4.24558C10.2162 4.32738 11.0546 4.76829 11.667 5.48654Z'

const MARK_PATH: Record<string, string> = {
  ...Object.fromEntries(INFRA_MARKS.map((m) => [m.key, m.path])),
  letsencrypt: LETSENCRYPT_PATH,
  linear: LINEAR_PATH,
  mollie: MOLLIE_PATH,
}

/** A mark not drawn on the 24 x 24 grid names its own square crop. */
const MARK_VIEWBOX: Record<string, string> = { mollie: '0.0703 2.2469 12.5476 12.5476' }

// Exoscale and Infomaniak: home/variants/RuleStepper.tsx BRAND_HEX. The rest: simple-icons@15 data/simple-icons.json.
// Let's Encrypt's own #003A70 would vanish on the page, so its padlock is white (see the header).
const MARK_FILL: Record<string, string> = {
  exoscale: '#DA291C',
  infomaniak: '#0098FF',
  bunnydotnet: '#FFAA49',
  linear: '#5E6AD2',
  letsencrypt: '#FFFFFF',
  mollie: '#FFFFFF',
}

/** A brand mark in its real colour (white where that colour vanishes on the page); nothing for a company without one.
 * GitHub is Phosphor's, white. */
export function ProviderMark({ mark, size }: { mark: string; size: number }) {
  if (mark === 'github') return <GithubLogo size={size} className="text-white" aria-hidden="true" />
  const path = MARK_PATH[mark]
  const fill = MARK_FILL[mark]
  if (!path || !fill) return null
  return (
    <svg viewBox={MARK_VIEWBOX[mark] ?? '0 0 24 24'} width={size} height={size} fill={fill} aria-hidden="true" className="shrink-0">
      <path d={path} />
    </svg>
  )
}

/** Whether a company has a mark to draw (every company in the list does since Mollie's own "m", 17-10). */
const hasMark = (m: string) => m === 'github' || Boolean(MARK_PATH[m] && MARK_FILL[m])

/** A fixed box, so a name starts at the same x whether or not its company has a mark. */
export function MarkSlot({ mark, size }: { mark: string; size: number }) {
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <ProviderMark mark={mark} size={size} />
    </span>
  )
}

/* ---------------------------------------------------------------- flags */

/** The faint 1px frame FlagBE has (about/Record.tsx). Non-scaling, so it stays 1px at any flag size. */
function Frame({ w, h }: { w: number; h: number }) {
  return (
    <rect width={w} height={h} fill="none" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="2" vectorEffect="non-scaling-stroke" />
  )
}

/** Switzerland, copied from about/Record.tsx: the square flag, red field and white couped cross at 32:6:20. */
export function FlagCH({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={`${className} aspect-square`}>
      <rect x="0" y="0" width="32" height="32" fill="#DA291C" />
      <rect x="13" y="6" width="6" height="20" fill="#ffffff" />
      <rect x="6" y="13" width="20" height="6" fill="#ffffff" />
      <Frame w={32} h={32} />
    </svg>
  )
}

/** Slovenia: flag-icons (MIT) 7.2.3, flags/4x3/si.svg, inlined. Its clipPath is dropped: it equals the viewBox. */
function FlagSI({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" aria-hidden="true" className={`${className} aspect-[4/3]`}>
      <g fillRule="evenodd" transform="translate(14.1)scale(.9375)">
        <path fill="#fff" d="M-62 0H962v512H-62z" />
        <path fill="#d50000" d="M-62 341.3H962V512H-62z" />
        <path fill="#0000bf" d="M-62 170.7H962v170.6H-62z" />
        <path fill="#d50000" d="M228.4 93c-4 61.6-6.4 95.4-15.7 111-10.2 16.8-20 29.1-59.7 44-39.6-14.9-49.4-27.2-59.6-44-9.4-15.6-11.7-49.4-15.7-111l5.8-2c11.8-3.6 20.6-6.5 27.1-7.8 9.3-2 17.3-4.2 42.3-4.7 25 .4 33 2.8 42.3 4.8 6.4 1.4 15.6 4 27.3 7.7z" />
        <path fill="#0000bf" d="M222.6 91c-3.8 61.5-7 89.7-12 103.2-9.6 23.2-24.8 35.9-57.6 48-32.8-12.1-48-24.8-57.7-48-5-13.6-8-41.7-11.8-103.3 11.6-3.6 20.6-6.4 27.1-7.7 9.3-2 17.3-4.3 42.3-4.7 25 .4 33 2.7 42.3 4.7a284 284 0 0 1 27.4 7.7z" />
        <path fill="#ffdf00" d="m153 109.8 1.5 3.7 7 1-4.5 2.7 4.3 2.9-6.3 1-2 3.4-2-3.5-6-.8 4-3-4.2-2.7 6.7-1z" />
        <path fill="#fff" d="m208.3 179.6-3.9-3-2.7-4.6-5.4-4.7-2.9-4.7-5.4-4.9-2.6-4.7-3-2.3-1.8-1.9-5 4.3-2.6 4.7-3.3 3-3.7-2.9-2.7-4.8-10.3-18.3-10.3 18.3-2.7 4.8-3.7 2.9-3.3-3-2.7-4.7-4.9-4.3-1.9 1.8-2.9 2.4-2.6 4.7-5.4 4.9-2.9 4.7-5.4 4.7-2.7 4.6-3.9 3a65.8 65.8 0 0 0 18.6 36.3 107 107 0 0 0 36.6 20.5 104.1 104.1 0 0 0 36.8-20.5c5.8-6 16.6-19.3 18.6-36.3" />
        <path fill="#ffdf00" d="m169.4 83.9 1.6 3.7 7 1-4.6 2.7 4.4 2.9-6.3 1-2 3.4-2-3.5-6-.8 4-3-4.2-2.7 6.6-1zm-33 0 1.6 3.7 7 .9-4.5 2.7 4.3 2.9-6.3 1-2 3.4-2-3.4-6-.9 4-3-4.2-2.7 6.7-1z" />
        <path fill="#0000bf" d="M199.7 203h-7.4l-7-.5-8.3-4h-9.4l-8.1 4-6.5.6-6.4-.6-8.1-4H129l-8.4 4-6.9.6-7.6-.1-3.6-6.2.1-.2 11.2 1.9 6.9-.5 8.3-4.1h9.4l8.2 4 6.4.6 6.5-.6 8.1-4h9.4l8.4 4 6.9.6 10.8-2 .2.4zm-86.4 9.5 7.4-.5 8.3-4h9.4l8.2 4 6.4.5 6.4-.5 8.2-4h9.4l8.3 4 7.5.5 4.8-6h-.1l-5.2 1.4-6.9-.5-8.3-4h-9.4l-8.2 4-6.4.6-6.5-.6-8.1-4H129l-8.4 4-6.9.6-5-1.3v.2l4.5 5.6z" />
      </g>
      <Frame w={640} h={480} />
    </svg>
  )
}

/** The Netherlands: flag-icons (MIT) 7.2.3, flags/4x3/nl.svg, inlined. */
function FlagNL({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" aria-hidden="true" className={`${className} aspect-[4/3]`}>
      <path fill="#ae1c28" d="M0 0h640v160H0z" />
      <path fill="#fff" d="M0 160h640v160H0z" />
      <path fill="#21468b" d="M0 320h640v160H0z" />
      <Frame w={640} h={480} />
    </svg>
  )
}

/** The United States: flag-icons (MIT) 7.2.3, flags/4x3/us.svg, inlined. Its star marker needs an id per instance. */
function FlagUS({ className = '', uid }: { className?: string; uid: string }) {
  const star = `flag-us-star-${uid}`
  return (
    <svg viewBox="0 0 640 480" aria-hidden="true" className={`${className} aspect-[4/3]`}>
      <path fill="#bd3d44" d="M0 0h640v480H0" />
      <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640" />
      <path fill="#192f5d" d="M0 0h364.8v258.5H0" />
      <marker id={star} markerHeight="30" markerWidth="30">
        <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z" />
      </marker>
      <path fill="none" markerMid={`url(#${star})`} d="m0 0 16 11h61 61 61 61 60L47 37h61 61 60 61L16 63h61 61 61 61 60L47 89h61 61 60 61L16 115h61 61 61 61 60L47 141h61 61 60 61L16 166h61 61 61 61 60L47 192h61 61 60 61L16 218h61 61 61 61 60z" />
      <Frame w={640} h={480} />
    </svg>
  )
}

/** The flag for a row's `place`; nothing for a place no option has a flag for. `uid` keeps marker ids unique per page. */
export function Flag({ place, uid, className }: { place: string; uid: string; className: string }) {
  switch (place) {
    case 'ch':
      return <FlagCH className={className} />
    case 'si':
      return <FlagSI className={className} />
    case 'nl':
      return <FlagNL className={className} />
    case 'us':
      return <FlagUS className={className} uid={uid} />
    default:
      return null
  }
}

/** A flag in a box as tall as a line of text and wide enough for the widest flag, so place names start in one column. */
export function FlagSlot({ place, uid }: { place: string; uid: string }) {
  return (
    <span aria-hidden="true" className="flex h-6 w-5 shrink-0 items-center">
      <Flag place={place} uid={uid} className="h-3.5 w-auto" />
    </span>
  )
}

/* -------------------------------------------------------------- shared */

/** Old links to #subprocessors keep landing at the top of this block; its own id is PROVIDERS.id. */
function LegacyAnchor() {
  return <span id={PROVIDERS.legacyId} className="block scroll-mt-24" />
}

/** Section wraps `lead` in a <p>, so the two paragraphs are block spans rather than nested <p>. */
function Lead() {
  return (
    <>
      {PROVIDERS.lead.map((p, i) => (
        <span key={p} className={i === 0 ? 'block' : 'mt-4 block'}>
          {p}
        </span>
      ))}
    </>
  )
}

/** The scope line and its two notes, smaller and muted, under the list. */
function Scope() {
  return (
    <Reveal delay={90}>
      <div className="mt-10 max-w-2xl lg:mt-12">
        <p className="text-[15px] leading-relaxed text-muted-foreground">{PROVIDERS.scope}</p>
        <ul role="list" className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {PROVIDERS.scopeNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ A */

// The two right-hand fields. On a phone the label sits beside its value (two short lines, not four); from sm the label
// sits over the value and the two fields share a row; from lg all three columns share one row.
const FIELD = 'grid grid-cols-[4.75rem_minmax(0,1fr)] items-baseline gap-x-3 sm:mt-4 sm:block lg:row-span-2 lg:row-start-1 lg:mt-0'

/**
 * Option A — ledger with marks and flags. The name and what we use it for stack in the first column; what it sees and
 * where sit beside them, each with a small label. The row is a <dl>, so a screen reader hears all four fields named;
 * the first two labels ("Company", "What we use it for") are never drawn, because the name and its description read
 * as themselves.
 */
export function ProvidersA() {
  const c = PROVIDERS.columns
  return (
    <>
      <LegacyAnchor />
      <Section id={PROVIDERS.id} eyebrow={PROVIDERS.eyebrow} title={PROVIDERS.title} lead={<Lead />}>
        <Reveal>
          <ul role="list" className="border-t border-border">
            {PROVIDERS.rows.map((row, i) => (
              <li key={row.name} className="flex items-start gap-4 border-b border-border py-5 sm:gap-5">
                <span aria-hidden="true" className={`flex h-11 w-11 shrink-0 items-center justify-center${hasMark(row.mark) ? ' border border-border bg-card' : ''}`}>
                  <ProviderMark mark={row.mark} size={20} />
                </span>
                <dl className="grid min-w-0 flex-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.75fr)]">
                  <div className="sm:col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-1">
                    <dt className="sr-only">{c.name}</dt>
                    <dd className="text-[15px] font-medium leading-6 text-foreground">{row.name}</dd>
                  </div>
                  <div className="mt-1 sm:col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-2">
                    <dt className="sr-only">{c.role}</dt>
                    <dd className="text-sm leading-6 text-muted-foreground">{row.role}</dd>
                  </div>
                  <div className={`mt-3 ${FIELD} lg:col-start-2`}>
                    <dt className="text-sm leading-6 text-muted-foreground">{c.sees}</dt>
                    <dd className="text-sm leading-6 text-foreground sm:mt-1">{row.sees}</dd>
                  </div>
                  <div className={`mt-1 ${FIELD} lg:col-start-3`}>
                    <dt className="text-sm leading-6 text-muted-foreground">{c.where}</dt>
                    <dd className="flex items-start gap-2.5 text-sm leading-6 text-foreground sm:mt-1">
                      <FlagSlot place={row.place} uid={`a${i}`} />
                      <span>{row.where}</span>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </Reveal>
        <Scope />
      </Section>
    </>
  )
}

/* ------------------------------------------------------------------ B */

const B_COLUMNS = ['name', 'role', 'sees', 'where'] as const
// Fixed layout, so the columns keep their shares however long a cell runs: a name column just wide enough for the
// longest name beside its mark, two shares for the wordy columns, and the last column takes what is left.
const B_WIDTH = { name: 'w-[9.5rem]', role: 'w-[38%]', sees: 'w-[25%]', where: '' } as const

/**
 * Option B — table. The plain statement of the facts: four labelled columns, the company's small mark beside its name,
 * no flags. The region is focusable and named, so a keyboard user can scroll it; the name column is sticky, so on a
 * phone the company stays in view while the other columns move.
 */
export function ProvidersB() {
  return (
    <>
      <LegacyAnchor />
      <Section id={PROVIDERS.id} eyebrow={PROVIDERS.eyebrow} title={PROVIDERS.title} lead={<Lead />}>
        <Reveal>
          <div role="region" tabIndex={0} aria-label={PROVIDERS.title} className="table-scroll overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
            <table className="w-full min-w-[820px] table-fixed border-separate border-spacing-0 text-left">
              <caption className="sr-only">{PROVIDERS.title}</caption>
              <thead>
                <tr>
                  {B_COLUMNS.map((k) => (
                    <th
                      key={k}
                      scope="col"
                      className={`border-y border-border py-3 pr-6 text-left text-sm font-normal text-muted-foreground last:pr-0 ${B_WIDTH[k]} ${
                        k === 'name' ? 'sticky left-0 bg-background' : ''
                      }`}
                    >
                      {PROVIDERS.columns[k]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROVIDERS.rows.map((row) => (
                  <tr key={row.name}>
                    <th
                      scope="row"
                      className="sticky left-0 border-b border-border bg-background py-5 pr-6 text-left align-top text-[15px] font-medium leading-6 text-foreground"
                    >
                      <span className="flex items-start gap-3">
                        <span className="flex h-6 items-center">
                          <MarkSlot mark={row.mark} size={16} />
                        </span>
                        {row.name}
                      </span>
                    </th>
                    <td className="border-b border-border py-5 pr-6 align-top text-[15px] leading-6 text-muted-foreground">{row.role}</td>
                    <td className="border-b border-border py-5 pr-6 align-top text-[15px] leading-6 text-foreground">{row.sees}</td>
                    <td className="border-b border-border py-5 align-top text-[15px] leading-6 text-foreground">{row.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Scope />
      </Section>
    </>
  )
}

/* ------------------------------------------------------------------ C */

// Which places share a column. Europe holds bunny.net (si) and Mollie (nl). A row whose place is listed nowhere gets a
// column of its own at the end, so no company can drop out of the list.
const C_GROUPS: readonly (readonly string[])[] = [['ch'], ['si', 'nl'], ['us']]

function groupRows() {
  const taken = new Set<string>()
  const groups = C_GROUPS.map((places) => {
    const rows = PROVIDERS.rows.filter((r) => places.includes(r.place))
    rows.forEach((r) => taken.add(r.name))
    return rows
  })
  const rest = PROVIDERS.rows.filter((r) => !taken.has(r.name))
  return [...groups, rest]
    .filter((rows) => rows.length > 0)
    .map((rows) => ({
      rows,
      places: [...new Set(rows.map((r) => r.place))],
      wheres: [...new Set(rows.map((r) => r.where))],
    }))
}

/** One hairline card: mark and name, what we use it for, what it sees. A group with no single place name adds its own. */
function Card({ row, showPlace, uid }: { row: Row; showPlace: boolean; uid: string }) {
  return (
    <li className="border border-border p-5">
      {showPlace && (
        <p className="mb-4 flex items-center gap-2.5 text-sm leading-6 text-muted-foreground">
          <FlagSlot place={row.place} uid={uid} />
          <span className="sr-only">{PROVIDERS.columns.where}</span>
          {row.where}
        </p>
      )}
      <h4 className="flex items-center gap-3 text-[15px] font-medium leading-6 text-foreground">
        <MarkSlot mark={row.mark} size={20} />
        {row.name}
      </h4>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{row.role}</p>
      <dl className="mt-4">
        <dt className="text-sm text-muted-foreground">{PROVIDERS.columns.sees}</dt>
        <dd className="mt-1 text-sm leading-relaxed text-foreground">{row.sees}</dd>
      </dl>
    </li>
  )
}

/**
 * Option C, grouped by where. Each heading is its flag(s) and a group label from content.ts (PROVIDERS.groupLabels). In
 * the mixed group (bunny.net, Mollie) each card also states its own place, so nobody has to guess which is which.
 */
/** A group's heading (review F12): Switzerland, the United States, or "Elsewhere in Europe" for the mixed group. */
function groupLabel(places: string[]) {
  if (places.includes('ch')) return PROVIDERS.groupLabels.ch
  if (places.includes('us')) return PROVIDERS.groupLabels.us
  return PROVIDERS.groupLabels.europe
}

export function ProvidersC() {
  const groups = groupRows()
  return (
    <>
      <LegacyAnchor />
      <Section id={PROVIDERS.id} eyebrow={PROVIDERS.eyebrow} title={PROVIDERS.title} lead={<Lead />}>
        <div className="grid gap-x-8 gap-y-14 lg:grid-cols-3">
          {groups.map((g, gi) => {
            const place = g.wheres.length === 1 ? g.wheres[0] : null
            return (
              <Reveal key={g.places.join('-')} delay={gi * 90} className="min-w-0">
                <div className="border-t border-border pt-6">
                  <h3 className="flex h-7 items-center gap-3">
                    <span aria-hidden="true" className="flex items-center gap-2">
                      {g.places.map((p) => (
                        <Flag key={p} place={p} uid={`c${gi}`} className="h-6 w-auto" />
                      ))}
                    </span>
                    <span className="text-xl font-medium tracking-tight text-foreground">{groupLabel(g.places)}</span>
                  </h3>
                  <ul role="list" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    {g.rows.map((row, ri) => (
                      <Card key={row.name} row={row} showPlace={place === null} uid={`c${gi}-${ri}`} />
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
        <Scope />
      </Section>
    </>
  )
}
