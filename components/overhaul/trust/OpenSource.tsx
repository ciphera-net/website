/**
 * Round 5 (mock, 17-10-2026): the Trust page's "Open source" block (Section id `open-source`), three options over the one
 * OPEN_SOURCE export of content.ts. Every visible string is rendered from that export, so only the pixels differ. What
 * this file adds is not copy: the sr-only "(opens in a new tab)" every external link carries and, inside option B's
 * terminal block, the
 * literal shell around the receipt's own URLs (`curl -s`, `| shasum -a 256`, the `$` prompts and the `  -` that shasum
 * prints for stdin). Soft line breaks (<wbr>) let a narrow screen wrap a path after a slash and a hash in the middle;
 * they add no character. No star counts: the copy has none and none is drawn.
 *
 * Type: Geist sans for everything a person reads. font-mono only where the text is code or machine data: the two script
 * paths, the SHA-256 and B's shell block. Licences, counts and names are words, so sans (tabular-nums where a digit shows).
 * Marks: the GitHub mark only (Phosphor's GithubLogo, drawn in white: its brand #181717 vanishes on #0a0a0a). No flags.
 * Colour: foreground and muted. Brand orange shows on hover (link text, an arrow, A's tile border) and, once per option at
 * most, as one deliberate point named below. Square throughout; the one round thing is C's dot.
 *
 * A (ledger): the public repositories as ruled, linked rows in About's StackTile device (a 44px tile holding the GitHub
 *   mark, rows inset 16px, the tile border and the arrow light orange on hover), closed by a roll-up row for the
 *   organisation. "Not public" is a quieter plain list; the receipt is a hairline-boxed row (the claim in sans, the two
 *   paths and a cut hash in mono); the audit lines and links close the block as plain text. No extra orange point.
 * B (two columns and a runnable check): public and not public side by side, each under its own hairline header; the
 *   receipt becomes a terminal block holding the two commands a reader can run and the hash each one prints. It shows
 *   the receipt through servedUrl and rawUrl, so `receipt.served` appears inside the first command and `receipt.repo`
 *   is not drawn as a separate string. Orange point: the terminal cursor on the last line (static, decorative,
 *   aria-hidden).
 * C (receipt first): the claim leads in display type; the two files and the one hash beneath it are drawn as a bracket
 *   that joins them. The public repositories follow as an open two-column grid, then "Not public" and the audit as ledger
 *   rows. Orange point: the dot at the join, beside the hash.
 * D (as ruled, owner 17-10): A's ledger, then B's runnable check in place of A's receipt box, then A's audit; no "Not
 *   public" list. A, B and C stay for the record; they share Ledger, Audit and RunnableCheck with D, so D is the same
 *   markup, not a copy. Orange point: B's cursor.
 */
import { Fragment } from 'react'
import { ArrowUpRight, GithubLogo } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'
import { Reveal } from '../home/Reveal'
import { Section } from '../home/Section'
import { OPEN_SOURCE } from './content'

const { receipt, notPublic } = OPEN_SOURCE

const ORG = OPEN_SOURCE.githubHref
const SHA = receipt.sha256
/** The hash in two halves, so a screen too narrow for one line breaks it in the middle (32 and 32), not at an uneven edge. */
const SHA_HALVES = [SHA.slice(0, 32), SHA.slice(32)] as const

/** A repo starting with "?" is an org search, the way home/OpenByDefault.tsx links its integrations card. */
function repoHref(repo: string) {
  return repo.startsWith('?') ? `${ORG}${repo}` : `${ORG}/${repo}`
}

/** Every link in this block leaves the site: a new tab, and the screen-reader text says so. */
const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const

function NewTab() {
  return <span className="sr-only"> (opens in a new tab)</span>
}

/**
 * A path or URL with a soft break after each run of slashes ("https://" stays whole). Without it a narrow screen cuts
 * the string wherever the line runs out ("publi" / "c/script.js"); with it the cut falls between segments. No character
 * is added, so copying a selection still gives the original string.
 */
function BreakAfterSlash({ text }: { text: string }) {
  const segments = text.match(/[^/]+\/*|\/+/g) ?? [text]
  return (
    <>
      {segments.map((segment, i) => (
        <Fragment key={i}>
          {segment}
          {i < segments.length - 1 && <wbr />}
        </Fragment>
      ))}
    </>
  )
}

/** The trailing arrow of a linked row: muted, orange while the row (its `group`) is hovered. Decorative. */
function Out({ className }: { className?: string }) {
  return (
    <ArrowUpRight
      className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary', className)}
      aria-hidden="true"
    />
  )
}

/** The text-link device used for the audit links: foreground, orange on hover. */
function TextLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      {...NEW_TAB}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary"
    >
      {children} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <NewTab />
    </a>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* A: ledger                                                                                                          */
/* ------------------------------------------------------------------------------------------------------------------ */

// A linked ledger row (Story.tsx's device): tile, text, arrow. The columns inside it only exist from lg, where the
// name, the line and the licence sit on one baseline and the tile and arrow centre on the row; below that the text
// stacks (up to five lines on a phone), so the tile and arrow sit at the top, level with the name.
const ROW = 'group flex items-start gap-4 px-4 py-5 transition-colors duration-150 hover:bg-card sm:gap-5 lg:items-center'
const COLS = 'grid min-w-0 flex-1 gap-1 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_9rem] lg:items-baseline lg:gap-x-8'
const ROW_ARROW = 'mt-3.5 lg:mt-0'

/** About's StackTile with the one mark every row here carries. The border lights orange while the row is hovered. */
function Tile() {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-card transition-colors duration-150 group-hover:border-primary">
      <GithubLogo className="h-5 w-5 text-white" aria-hidden="true" />
    </span>
  )
}

/** One path of the receipt as a whole-row link inside option A's box (mono comes from the list). */
function ReceiptPath({ href, text }: { href: string; text: string }) {
  return (
    <a
      href={href}
      {...NEW_TAB}
      className="group flex items-center justify-between gap-4 px-5 py-3.5 text-foreground transition-colors duration-150 hover:bg-card sm:px-6"
    >
      <span className="min-w-0 break-words">
        <BreakAfterSlash text={text} />
      </span>
      <Out />
      <NewTab />
    </a>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* Parts shared by the options (A's ledger and audit, B's runnable check; D composes them)                            */
/* ------------------------------------------------------------------------------------------------------------------ */

const CHECK_ID = 'os-b-check'

/** The same file, hashed from both ends: each command is built from the receipt's own URL, and prints the one hash. */
const COMMAND_URLS = [receipt.servedUrl, receipt.rawUrl]

/** A run of shell that must not wrap (a flag and its value, shasum's trailing "  -"), spaces kept exactly as written. */
function Whole({ children }: { children: string }) {
  return <span className="whitespace-pre">{children}</span>
}

/** A shell prompt. Decoration: not read aloud, not copied with the command. */
function Prompt() {
  return (
    <span aria-hidden="true" className="select-none text-muted-foreground">
      ${' '}
    </span>
  )
}

/** A's linked ledger of the public repositories, closed by the organisation's roll-up row. */
function Ledger() {
  return (
    <ul role="list" className="border-t border-border">
      {OPEN_SOURCE.public.map((r) => (
        <li key={r.repo} className="border-b border-border">
          <a href={repoHref(r.repo)} {...NEW_TAB} className={ROW}>
            <Tile />
            <span className={COLS}>
              <span className="text-[15px] font-medium tabular-nums text-foreground">{r.name}</span>
              <span className="text-sm leading-relaxed text-muted-foreground">{r.what}</span>
              <span className="text-sm tabular-nums text-muted-foreground lg:text-right">{r.licence}</span>
            </span>
            <Out className={ROW_ARROW} />
            <NewTab />
          </a>
        </li>
      ))}
      {/* The roll-up: the count and the organisation, one link, in the same row anatomy. */}
      <li className="border-b border-border">
        <a href={ORG} {...NEW_TAB} className={ROW}>
          <Tile />
          <span className={COLS}>
            <span className="text-[15px] font-medium tabular-nums text-foreground">{OPEN_SOURCE.publicCount}</span>
            <span className="text-sm text-muted-foreground">{OPEN_SOURCE.githubLabel}</span>
          </span>
          <Out className={ROW_ARROW} />
          <NewTab />
        </a>
      </li>
    </ul>
  )
}

/** The audit lines and their two links (A's spacing; B keeps its own copy below with its tighter rhythm). */
function Audit({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ul role="list" className="space-y-3 text-[15px] leading-relaxed tabular-nums text-foreground">
        {OPEN_SOURCE.audit.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <ul role="list" className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
        {OPEN_SOURCE.auditLinks.map((l) => (
          <li key={l.href}>
            <TextLink href={l.href}>{l.label}</TextLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** B's runnable check: the receipt's claim over a terminal block holding both commands, the one hash each prints, and the
 * orange cursor (the block's one deliberate orange point). */
function RunnableCheck({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h3 id={CHECK_ID} className="text-sm text-muted-foreground">
        {receipt.label}
      </h3>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-foreground">{receipt.line}</p>
      {/* Wraps below lg so both hashes sit on screen together on a phone or a tablet; from lg every line is whole, and
          the block still scrolls inside itself (focusable) if a narrower column ever cuts one. */}
      <pre
        tabIndex={0}
        role="region"
        aria-labelledby={CHECK_ID}
        className="mt-6 overflow-x-auto whitespace-pre-wrap break-words border border-border px-5 py-5 font-mono text-[13px] leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring lg:whitespace-pre lg:break-normal"
      >
        <code className="block">
          {COMMAND_URLS.map((url, i) => (
            <span key={url} className={cn('block', i > 0 && 'mt-4')}>
              <span className="block">
                <Prompt />
                {'curl '}
                <Whole>-s</Whole>{' '}
                <BreakAfterSlash text={url} />
                {' | shasum '}
                <Whole>-a 256</Whole>
              </span>
              <span className="block text-muted-foreground">
                {SHA_HALVES[0]}
                <wbr />
                {SHA_HALVES[1]}
                <Whole>{'  -'}</Whole>
              </span>
            </span>
          ))}
          {/* The one orange point: a cursor waiting at an empty prompt. Static; nothing blinks. */}
          <span aria-hidden="true" className="mt-4 block select-none">
            <span className="text-muted-foreground">$ </span>
            <span className="inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-primary" />
          </span>
        </code>
      </pre>
    </div>
  )
}

export function OpenSourceA() {
  return (
    <Section id={OPEN_SOURCE.id} eyebrow={OPEN_SOURCE.eyebrow} title={OPEN_SOURCE.title} lead={OPEN_SOURCE.lead}>
      <Reveal>
        <Ledger />
      </Reveal>

      {/* Quieter: no tile, no arrow, smaller type, muted. Inset like the ledger rows, so it hangs from the tiles' edge. */}
      <Reveal delay={80}>
        <div className="mt-14">
          <h3 className="text-sm text-muted-foreground">{notPublic.label}</h3>
          <ul role="list" className="mt-3 border-t border-border">
            {notPublic.items.map((item) => (
              <li key={item} className="border-b border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* The receipt: a hairline box, the claim on the left, the evidence on the right as three ruled mono lines. */}
      <Reveal delay={80}>
        <div className="mt-14 border border-border lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          <div className="p-5 sm:p-6">
            <h3 className="text-sm text-muted-foreground">{receipt.label}</h3>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-foreground">{receipt.line}</p>
          </div>
          <ul
            role="list"
            className="divide-y divide-border border-t border-border font-mono text-[13px] leading-relaxed lg:border-l lg:border-t-0"
          >
            <li>
              <ReceiptPath href={receipt.servedUrl} text={receipt.served} />
            </li>
            <li>
              <ReceiptPath href={receipt.rawUrl} text={receipt.repo} />
            </li>
            {/* The whole hash (review F2): a cut value cannot be compared or copied, which defeats "Check it yourself". */}
            <li className="min-w-0 break-words px-5 py-3.5 text-muted-foreground sm:px-6">
              {SHA_HALVES[0]}
              <wbr />
              {SHA_HALVES[1]}
            </li>
          </ul>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <Audit className="mt-14 max-w-2xl" />
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* B: two columns and a runnable check                                                                                */
/* ------------------------------------------------------------------------------------------------------------------ */

export function OpenSourceB() {
  return (
    <Section
      id={OPEN_SOURCE.id}
      eyebrow={OPEN_SOURCE.eyebrow}
      title={OPEN_SOURCE.title}
      lead={OPEN_SOURCE.lead}
      aside={
        <a
          href={ORG}
          {...NEW_TAB}
          className="inline-flex h-11 items-center gap-2 border border-border px-5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-accent"
        >
          <GithubLogo className="h-4 w-4 text-white" aria-hidden="true" /> {OPEN_SOURCE.githubLabel}
          <NewTab />
        </a>
      }
    >
      <Reveal>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h3 className="border-b border-border pb-3 text-sm tabular-nums text-muted-foreground">{OPEN_SOURCE.publicCount}</h3>
            <ul role="list" className="divide-y divide-border border-b border-border">
              {OPEN_SOURCE.public.map((r) => (
                <li key={r.repo}>
                  <a href={repoHref(r.repo)} {...NEW_TAB} className="group block py-4">
                    <span className="flex items-baseline gap-3">
                      <span className="min-w-0 flex-1 text-[15px] font-medium tabular-nums text-foreground transition-colors duration-150 group-hover:text-primary">
                        {r.name}
                      </span>
                      <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground">{r.licence}</span>
                      <Out className="h-3.5 w-3.5 self-center" />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{r.what}</span>
                    <NewTab />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="border-b border-border pb-3 text-sm text-muted-foreground">{notPublic.label}</h3>
            <ul role="list" className="divide-y divide-border border-b border-border">
              {notPublic.items.map((item) => (
                <li key={item} className="py-4 text-[15px] leading-relaxed text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <RunnableCheck className="mt-16 lg:mt-20" />
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-10 max-w-2xl">
          <ul role="list" className="space-y-3 text-[15px] leading-relaxed tabular-nums text-foreground">
            {OPEN_SOURCE.audit.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <ul role="list" className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {OPEN_SOURCE.auditLinks.map((l) => (
              <li key={l.href}>
                <TextLink href={l.href}>{l.label}</TextLink>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* C: receipt first                                                                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

const PATHS = [
  { href: receipt.servedUrl, text: receipt.served },
  { href: receipt.rawUrl, text: receipt.repo },
]

/**
 * Two files, one hash. From lg the paths sit right-aligned at the left, a bracket made of three borders joins them, and
 * the hash hangs off its middle; the rows are a fixed 3rem so the bracket's arms land on their centre lines exactly.
 * Below lg there is no bracket: the paths stack and the hash sits under a hairline.
 */
function Converge() {
  return (
    <div className="lg:grid lg:grid-cols-[auto_4rem_minmax(0,1fr)] lg:items-center">
      <ul role="list" className="font-mono text-[13px] leading-relaxed">
        {PATHS.map((p) => (
          <li key={p.href} className="py-2 lg:flex lg:h-12 lg:items-center lg:justify-end lg:py-0 lg:pr-3">
            <a
              href={p.href}
              {...NEW_TAB}
              className="break-words text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors duration-150 hover:text-primary hover:decoration-primary"
            >
              <BreakAfterSlash text={p.text} />
              <NewTab />
            </a>
          </li>
        ))}
      </ul>
      <span aria-hidden="true" className="hidden h-24 lg:block">
        <span className="mt-6 block h-12 border-y border-r border-border" />
      </span>
      <div className="mt-3 flex items-start gap-3 border-t border-border pt-4 lg:mt-0 lg:items-center lg:border-t-0 lg:pt-0">
        <span aria-hidden="true" className="flex shrink-0 items-center">
          <span className="hidden h-px w-8 bg-border lg:block" />
          {/* The one orange point: where the two files meet in a single hash. */}
          <span className="mt-[7px] h-2 w-2 rounded-full bg-primary lg:mt-0" />
        </span>
        <p className="min-w-0 break-words font-mono text-[13px] leading-relaxed text-foreground">
          {SHA_HALVES[0]}
          <wbr />
          {SHA_HALVES[1]}
        </p>
      </div>
    </div>
  )
}

export function OpenSourceC() {
  return (
    <Section id={OPEN_SOURCE.id} eyebrow={OPEN_SOURCE.eyebrow} title={OPEN_SOURCE.title} lead={OPEN_SOURCE.lead}>
      <Reveal>
        <h3 className="text-sm text-muted-foreground">{receipt.label}</h3>
        {/* 20.5em sits between the width of "...byte for byte" (19.7em) and "...byte for byte the" (21.4em), measured in
            Geist 500, so wherever it is the binding width the line breaks after the key phrase, at any type size. */}
        <p className="mt-4 max-w-[20.5em] text-pretty font-display text-3xl font-medium leading-[1.15] tracking-[-0.025em] text-foreground sm:text-4xl">
          {receipt.line}
        </p>
        <div className="mt-10">
          <Converge />
        </div>
      </Reveal>

      {/* Open grid, QuestionsB's device: a hairline above each cell, no boxes. Five repositories and the roll-up make six. */}
      <Reveal delay={80}>
        <ul role="list" className="mt-20 grid gap-x-12 border-b border-border lg:grid-cols-2">
          {OPEN_SOURCE.public.map((r) => (
            <li key={r.repo} className="border-t border-border">
              <a href={repoHref(r.repo)} {...NEW_TAB} className="group block py-6">
                <span className="flex items-baseline gap-3">
                  <span className="min-w-0 flex-1 text-[15px] font-medium tabular-nums text-foreground transition-colors duration-150 group-hover:text-primary">
                    {r.name}
                  </span>
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{r.licence}</span>
                  <Out className="self-center" />
                </span>
                <span className="mt-2 block max-w-md text-sm leading-relaxed text-muted-foreground">{r.what}</span>
                <NewTab />
              </a>
            </li>
          ))}
          <li className="border-t border-border">
            <a href={ORG} {...NEW_TAB} className="group block py-6">
              <span className="flex items-baseline gap-3">
                <span className="min-w-0 flex-1 text-[15px] font-medium tabular-nums text-foreground transition-colors duration-150 group-hover:text-primary">
                  {OPEN_SOURCE.publicCount}
                </span>
                <Out className="self-center" />
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{OPEN_SOURCE.githubLabel}</span>
              <NewTab />
            </a>
          </li>
        </ul>
      </Reveal>

      {/* Two ledger rows (RecordB's muted term column). The audit row keeps its sentences first in the DOM and swaps the
          sides from sm, so the links the sentence refers to read after it for everyone. */}
      <Reveal delay={80}>
        <div className="mt-12">
          <div className="flex flex-col gap-3 border-b border-border py-6 sm:flex-row sm:gap-6">
            <h3 className="text-sm text-muted-foreground sm:w-64 sm:shrink-0">{notPublic.label}</h3>
            <ul role="list" className="space-y-1.5 text-[15px] leading-relaxed text-muted-foreground">
              {notPublic.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5 border-b border-border py-6 sm:flex-row-reverse sm:justify-end sm:gap-6">
            <ul role="list" className="space-y-2 text-[15px] leading-relaxed tabular-nums text-foreground">
              {OPEN_SOURCE.audit.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <ul role="list" className="flex flex-wrap gap-x-8 gap-y-3 text-sm sm:w-64 sm:shrink-0 sm:flex-col">
              {OPEN_SOURCE.auditLinks.map((l) => (
                <li key={l.href}>
                  <TextLink href={l.href}>{l.label}</TextLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* D: as ruled (owner 17-10)                                                                                          */
/* ------------------------------------------------------------------------------------------------------------------ */

/**
 * The owner's ruling on Round 5: "go with option A but remove the 'not public' [list] & use the check it yourself from
 * option B". A's linked ledger and its roll-up row, then B's runnable check in place of A's receipt box, then A's audit
 * lines and links. The "not public" list is gone, and the title (content.ts) lost "and what is not" with it. Nothing on
 * the block says any more which code is private; nothing on it claims the rest is public either: the lead and the rows
 * name exactly what is (the dashboard and tracker, not the engine). Orange: B's cursor, the block's one point.
 */
export function OpenSourceD() {
  return (
    <Section id={OPEN_SOURCE.id} eyebrow={OPEN_SOURCE.eyebrow} title={OPEN_SOURCE.title} lead={OPEN_SOURCE.lead}>
      <Reveal>
        <Ledger />
      </Reveal>

      <Reveal delay={80}>
        <RunnableCheck className="mt-14" />
      </Reveal>

      <Reveal delay={80}>
        <Audit className="mt-14 max-w-2xl" />
      </Reveal>
    </Section>
  )
}
