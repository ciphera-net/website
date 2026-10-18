/**
 * Round 5 (mock, 17-10-2026): the Trust page's "What we keep" block (Section id `data`), three options over the one DATA
 * export of content.ts. Every visible string is rendered by reference; the only characters added here are the " · "
 * separators option C is asked for. The copy names no company and no country, so there are no brand marks and no flags.
 * Nothing here is code or machine data, so no monospace; digits inside a sentence ("180 days") get tabular-nums. Colour is
 * foreground and muted only; brand orange appears solely when the policy link is hovered (an action).
 *
 * A: two ledgers. One column per group, kept items as ruled rows with a small check, never items as quieter ruled rows
 *    with a minus. The "not used" sentence and the policy link close both ledgers as full-width rows.
 * B: one grid. A single three-column matrix on lg (group, we keep, never) with a header row and hairlines between the
 *    group rows. Stacks on mobile, where every cell carries its own label.
 * C: plain. One column: the group label, the kept items in larger type, and the never items on one muted line. No icons,
 *    no inner rules.
 */
import { ArrowRight, Check, Minus } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'
import { Reveal } from '../home/Reveal'
import { Section } from '../home/Section'
import { ProofLink } from '../home/rules'
import { DATA } from './content'

type Group = (typeof DATA.groups)[number]

/* ------------------------------------------------------------------------------------------------------------------ */
/* A: two ledgers                                                                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

function Ledger({ g }: { g: Group }) {
  const id = `data-a-${g.key}`
  return (
    <div>
      <h3 id={id} className="text-lg font-semibold tracking-tight text-foreground">
        {g.label}
      </h3>

      <p id={`${id}-kept`} className="mt-7 text-sm text-muted-foreground">
        {DATA.keptLabel}
      </p>
      <ul role="list" aria-labelledby={`${id} ${id}-kept`} className="mt-3 divide-y divide-border border-y border-border">
        {g.kept.map((item) => (
          <li key={item} className="flex items-start gap-3 py-3.5 text-[15px] leading-relaxed tabular-nums text-pretty text-foreground">
            <Check className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p id={`${id}-never`} className="mt-10 text-sm text-muted-foreground">
        {DATA.neverLabel}
      </p>
      <ul role="list" aria-labelledby={`${id} ${id}-never`} className="mt-3 divide-y divide-border border-y border-border">
        {g.never.map((item) => (
          <li key={item} className="flex items-start gap-3 py-2.5 text-sm leading-relaxed tabular-nums text-pretty text-muted-foreground">
            <Minus className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DataA() {
  return (
    <Section id={DATA.id} eyebrow={DATA.eyebrow} title={DATA.title} lead={DATA.lead}>
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-x-16">
        {DATA.groups.map((g, i) => (
          <Reveal key={g.key} delay={i * 80}>
            <Ledger g={g} />
          </Reveal>
        ))}
      </div>

      {/* Closes both ledgers: the sentence as a ruled row, the link as RecordB's whole-row link (arrow lights on hover). */}
      <Reveal delay={80}>
        <div className="mt-16 border-t border-border">
          <p className="max-w-3xl py-6 text-[15px] leading-relaxed text-foreground">{DATA.notUsed}</p>
          <a href={DATA.policyHref} className="group flex items-center justify-between gap-6 border-y border-border py-4">
            <span className="text-[15px] font-medium text-foreground transition-colors duration-150 group-hover:text-primary">
              {DATA.policyLabel}
            </span>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary"
              aria-hidden="true"
            />
          </a>
        </div>
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* B: one grid                                                                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

// The one column template, shared by the header row and every group row so the columns line up exactly.
const COLS = 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.7fr)_minmax(0,1.2fr)] lg:gap-x-10'

function GridRow({ g }: { g: Group }) {
  const id = `data-b-${g.key}`
  return (
    <div className={cn('grid gap-y-6 py-8 lg:items-baseline lg:gap-y-0', COLS)}>
      <h3 id={id} className="text-balance text-lg font-semibold tracking-tight text-foreground">
        {g.label}
      </h3>

      {/* From lg up the header row names the column, so the cell's own label is for assistive technology only. */}
      <div>
        <p id={`${id}-kept`} className="text-sm text-muted-foreground lg:sr-only">
          {DATA.keptLabel}
        </p>
        <ul
          role="list"
          aria-labelledby={`${id} ${id}-kept`}
          className="mt-3 space-y-3 text-[15px] leading-relaxed tabular-nums text-pretty text-foreground lg:mt-0"
        >
          {g.kept.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <p id={`${id}-never`} className="text-sm text-muted-foreground lg:sr-only">
          {DATA.neverLabel}
        </p>
        <ul
          role="list"
          aria-labelledby={`${id} ${id}-never`}
          className="mt-3 space-y-3 text-[15px] leading-relaxed tabular-nums text-pretty text-muted-foreground lg:mt-0"
        >
          {g.never.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function DataB() {
  return (
    <Section id={DATA.id} eyebrow={DATA.eyebrow} title={DATA.title} lead={DATA.lead}>
      <div className="border-t border-border">
        {/* Visual header only (aria-hidden): each cell below names itself for assistive technology. */}
        <div aria-hidden="true" className={cn('hidden border-b border-border py-3.5 text-sm text-muted-foreground lg:grid', COLS)}>
          <span />
          <span>{DATA.keptLabel}</span>
          <span>{DATA.neverLabel}</span>
        </div>
        {DATA.groups.map((g, i) => (
          <Reveal key={g.key} delay={i * 70} className="border-b border-border">
            <GridRow g={g} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={70}>
        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-12">
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{DATA.notUsed}</p>
          <div className="self-start sm:self-auto">
            <ProofLink href={DATA.policyHref}>{DATA.policyLabel}</ProofLink>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* C: plain                                                                                                           */
/* ------------------------------------------------------------------------------------------------------------------ */

function PlainGroup({ g }: { g: Group }) {
  const id = `data-c-${g.key}`
  return (
    <div className="max-w-3xl">
      <h3 id={id} className="text-lg font-semibold tracking-tight text-foreground">
        {g.label}
      </h3>
      <p id={`${id}-kept`} className="mt-1.5 text-sm text-muted-foreground">
        {DATA.keptLabel}
      </p>
      <ul
        role="list"
        aria-labelledby={`${id} ${id}-kept`}
        className="mt-6 space-y-4 text-balance text-lg leading-snug tracking-tight tabular-nums text-foreground sm:text-xl lg:text-2xl"
      >
        {g.kept.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {/* One muted line: the label runs straight into the items, which stay a real list (inline) with aria-hidden dots. */}
      <div className="mt-8 text-[15px] leading-relaxed text-muted-foreground">
        <span id={`${id}-never`} className="mr-3 font-medium text-foreground">
          {DATA.neverLabel}
        </span>
        <ul role="list" aria-labelledby={`${id} ${id}-never`} className="inline">
          {g.never.map((item, i) => (
            <li key={item} className="inline">
              {item}
              {i < g.never.length - 1 && <span aria-hidden="true">{' · '}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function DataC() {
  return (
    <Section id={DATA.id} eyebrow={DATA.eyebrow} title={DATA.title} lead={DATA.lead}>
      <div>
        {DATA.groups.map((g) => (
          <Reveal key={g.key} className="border-t border-border py-10">
            <PlainGroup g={g} />
          </Reveal>
        ))}
        <Reveal className="border-t border-border pt-10">
          <div className="max-w-2xl">
            <p className="text-[15px] leading-relaxed text-muted-foreground">{DATA.notUsed}</p>
            <div className="mt-5">
              <ProofLink href={DATA.policyHref}>{DATA.policyLabel}</ProofLink>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
