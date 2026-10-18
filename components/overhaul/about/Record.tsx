/**
 * Round 4 (mock, 17-10-2026): the "On the record" block (R4), three options for the eight company facts, the
 * register link and the "not to be confused with" list. Copy is entirely RECORD from content.ts — see its header
 * for what is ruled vs draft. Values are names and numbers for people, never code, so tabular-nums throughout and
 * no font-mono. The three differ in device: A is a definition-list grid, B a single full-width ledger with the
 * register link as its own closing row, C a split two-column page (compact ledger beside a bordered panel).
 */
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { Section } from '../home/Section'
import { RECORD } from './content'

function RegisterLink({ className }: { className?: string }) {
  return (
    <a
      href={RECORD.registerHref}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? 'inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary'}
    >
      {RECORD.registerLabel} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    </a>
  )
}

/**
 * Option A — definition-list grid: each fact is its own cell with a hairline above the term, 2 columns on md and 4
 * on lg (so the eight facts read as one even field, not a hierarchy). The register link sits below the grid as its
 * own line; the not-us list is a smaller, muted block under that — three distinct tiers of attention.
 */
export function RecordA() {
  return (
    <Section id="record" eyebrow={RECORD.eyebrow} title={RECORD.title} lead={RECORD.lead}>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
        {RECORD.facts.map((f) => (
          <div key={f.term} className="border-t border-border pt-5">
            <dt className="text-sm text-muted-foreground">{f.term}</dt>
            <dd className="mt-2 text-[15px] font-medium leading-snug tabular-nums text-foreground">{f.detail}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 border-t border-border pt-8">
        <RegisterLink />
      </div>

      <div className="mt-14 border-t border-border pt-8">
        <p className="text-sm text-muted-foreground">{RECORD.notUs.label}</p>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{RECORD.notUs.intro}</p>
        <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
          {RECORD.notUs.names.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <p className="mt-5 text-[15px] font-medium text-foreground">{RECORD.notUs.outro}</p>
      </div>
    </Section>
  )
}

/**
 * Option B — ledger: one divided list, term left (muted, a fixed ~16rem column from sm up, stacked on mobile so a
 * long detail never overflows) and detail right. The register link closes the ledger as its own undivided row. A
 * second, smaller ledger underneath carries the not-us names at a lower register (text-sm, not text-[15px]).
 */
export function RecordB() {
  return (
    <Section id="record" eyebrow={RECORD.eyebrow} title={RECORD.title} lead={RECORD.lead}>
      <div className="border-t border-border">
        {RECORD.facts.map((f) => (
          <div key={f.term} className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:items-baseline sm:gap-6">
            <p className="text-sm text-muted-foreground sm:w-64 sm:shrink-0">{f.term}</p>
            <p className="text-[15px] font-medium tabular-nums text-foreground">{f.detail}</p>
          </div>
        ))}
        <a
          href={RECORD.registerHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-6 border-b border-border py-4"
        >
          <span className="text-[15px] font-medium text-foreground transition-colors duration-150 group-hover:text-primary">
            {RECORD.registerLabel}
          </span>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary"
            aria-hidden="true"
          />
        </a>
      </div>

      <div className="mt-14">
        <p className="text-sm text-muted-foreground">{RECORD.notUs.label}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{RECORD.notUs.intro}</p>
        <div className="mt-4 border-t border-border">
          {RECORD.notUs.names.map((n) => (
            <p key={n} className="border-b border-border py-2.5 text-sm leading-relaxed text-muted-foreground">
              {n}
            </p>
          ))}
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">{RECORD.notUs.outro}</p>
      </div>
    </Section>
  )
}

/**
 * Option C — split: the facts as a compact ledger (7 of 12 columns, smaller type than B, the register link
 * trailing it as a plain line) beside the not-us block set in its own bordered panel (5 of 12) with the names as a
 * plain list — the panel is the device that separates "our record" from "who else uses the name", not another
 * ledger. Columns collapse to one on mobile.
 */
export function RecordC() {
  return (
    <Section id="record" eyebrow={RECORD.eyebrow} title={RECORD.title} lead={RECORD.lead}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-7">
          <div className="border-t border-border">
            {RECORD.facts.map((f) => (
              <div
                key={f.term}
                className="flex flex-col gap-0.5 border-b border-border py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <p className="text-sm text-muted-foreground">{f.term}</p>
                <p className="text-sm font-medium tabular-nums text-foreground sm:text-right">{f.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <RegisterLink />
          </div>
        </div>

        <div className="border border-border bg-card p-7 lg:col-span-5">
          <p className="text-sm text-muted-foreground">{RECORD.notUs.label}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{RECORD.notUs.intro}</p>
          <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
            {RECORD.notUs.names.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p className="mt-5 border-t border-border pt-5 text-[15px] font-medium text-foreground">{RECORD.notUs.outro}</p>
        </div>
      </div>
    </Section>
  )
}

/** Belgium: vertical black/yellow/red tricolour, official 13:15 proportions, height to width, so LANDSCAPE (Wikimedia's file is 900 × 780; the first version drew it portrait, review 17-10). A faint white outline (15% opacity) so
 * the black band separates from the page's own near-black background instead of bleeding into it. */
function FlagBE({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 45 39" aria-hidden="true" className={className}>
      <rect x="0" y="0" width="15" height="39" fill="#000000" />
      <rect x="15" y="0" width="15" height="39" fill="#FDDA24" />
      <rect x="30" y="0" width="15" height="39" fill="#EF3340" />
      <rect x="0.5" y="0.5" width="44" height="38" fill="none" stroke="#ffffff" strokeOpacity="0.15" />
    </svg>
  )
}

/** Switzerland: square, red field, white couped cross at the official 32:6:20 proportions (edge : arm width : arm span). */
function FlagCH({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect x="0" y="0" width="32" height="32" fill="#DA291C" />
      <rect x="13" y="6" width="6" height="20" fill="#ffffff" />
      <rect x="6" y="13" width="20" height="6" fill="#ffffff" />
    </svg>
  )
}

/** Renders nothing when a fact carries no `place` — most of the ledger rows don't. */
function Flag({ place, className }: { place: string | undefined; className: string }) {
  if (place === 'be') return <FlagBE className={`${className} aspect-[15/13]`} />
  if (place === 'ch') return <FlagCH className={`${className} aspect-square`} />
  return null
}

/** `RECORD.facts` mixes rows that carry a `place` with rows that don't, so TS infers a union — narrow with `in`
 * rather than reading `.place` straight off the union member. */
function placeOf(f: (typeof RECORD.facts)[number]): string | undefined {
  return 'place' in f ? f.place : undefined
}

/**
 * Option D (Round 4b, owner: "missing colors", "not really cool like the landing page") — this block's colour comes
 * from flags, never a tinted panel. Two wide cells open it: the registered office and where data lives, each with
 * its country's flag drawn at a generous size, the term small and muted above a large detail. The remaining facts
 * follow as RecordB's ledger, a small flag ahead of any detail that names a place; the register link and the
 * not-us block are RecordB's, unchanged. Flags are drawn in SVG — no emoji, no external images.
 */
export function RecordD() {
  const office = RECORD.facts.find((f) => f.term === 'Registered office')
  const dataFact = RECORD.facts.find((f) => f.term === 'Where data lives')
  const rest = RECORD.facts.filter((f) => f !== office && f !== dataFact)

  return (
    <Section id="record" eyebrow={RECORD.eyebrow} title={RECORD.title} lead={RECORD.lead}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {[office, dataFact].filter((f): f is NonNullable<typeof f> => f != null).map((f) => (
          <div key={f.term} className="flex items-start gap-5 border-t border-border pt-6">
            <Flag place={placeOf(f)} className="h-12 w-auto shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">{f.term}</p>
              <p className="mt-2 text-xl font-medium leading-snug tabular-nums text-foreground sm:text-2xl">{f.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-border">
        {rest.map((f) => (
          <div key={f.term} className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:items-baseline sm:gap-6">
            <p className="text-sm text-muted-foreground sm:w-64 sm:shrink-0">{f.term}</p>
            <p className="flex items-center gap-2 text-[15px] font-medium tabular-nums text-foreground">
              <Flag place={placeOf(f)} className="h-3.5 w-auto shrink-0" />
              {f.detail}
            </p>
          </div>
        ))}
        <a
          href={RECORD.registerHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-6 border-b border-border py-4"
        >
          <span className="text-[15px] font-medium text-foreground transition-colors duration-150 group-hover:text-primary">
            {RECORD.registerLabel}
          </span>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary"
            aria-hidden="true"
          />
        </a>
      </div>

      <div className="mt-14">
        <p className="text-sm text-muted-foreground">{RECORD.notUs.label}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{RECORD.notUs.intro}</p>
        <div className="mt-4 border-t border-border">
          {RECORD.notUs.names.map((n) => (
            <p key={n} className="border-b border-border py-2.5 text-sm leading-relaxed text-muted-foreground">
              {n}
            </p>
          ))}
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">{RECORD.notUs.outro}</p>
      </div>
    </Section>
  )
}
