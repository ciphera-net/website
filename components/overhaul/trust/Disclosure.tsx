/**
 * Round 5 (mock, 17-10-2026): the Trust page's "Security reports" block, three options over the one DISCLOSURE copy
 * (content.ts, rendered as written). The only text typed here is the sr-only "(opens in a new tab)" every external link
 * carries. security.txt's Policy field points at this block (id "disclosure"), so it stays on the page in every option.
 * The three differ in device, not in spacing:
 *
 * A: two columns. The ask on the left (how, the mail button, the security.txt link, bounty and encryption); the four
 *    timelines on the right as About's RecordB ledger. Scope in two columns and the safe harbour run full width
 *    underneath, and the record line closes the block as a band whose link is an outlined button.
 * B: security.txt as the exhibit. The policy is a vertical stack of labelled, hairline-topped sections on the left; the
 *    literal file sits in a hairline code card on the right (sticky on lg, so it stays beside the text while you read).
 *    The record line is one plain sentence with an inline link.
 * C: one ledger. Every item is a row of a single RecordB-style list (DISCLOSURE.labels as the terms, the timelines
 *    carrying their own), the address is the link inside the sentence that asks for it, and the security.txt link is the
 *    ledger's final linked row.
 *
 * Type: Geist throughout. font-mono only on the wildcard host pattern (machine data) and on the security.txt lines
 * (the literal file). Colour: brand orange only on the mail button and on link hovers (actions). The one other colour is
 * a small dot before the two scope labels: the homepage status line's green (#3ECF8E) for what is in scope, a hollow
 * ring for what is not. Server components throughout; Reveal is the homepage's own client wrapper.
 */
import { Fragment, type ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr'
import { Section } from '../home/Section'
import { ProofLink } from '../home/rules'
import { Reveal } from '../home/Reveal'
import { DISCLOSURE } from './content'

const { email, how, timelines, bounty, pgp, scope, safeHarbour, record, labels, securityTxt } = DISCLOSURE

/** Every external link carries this for screen readers; sighted readers get the arrow. */
export function NewTab() {
  return <span className="sr-only"> (opens in a new tab)</span>
}

/** The one filled action (orange is allowed on an action). Same recipe as the About closing's primary button. */
export function MailButton() {
  return (
    <a
      href={`mailto:${email}`}
      className="inline-flex h-12 items-center gap-2.5 bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[#E54E00]"
    >
      <EnvelopeSimple className="h-4 w-4 shrink-0" aria-hidden="true" />
      {email}
    </a>
  )
}

/** The security.txt link: the homepage's ProofLink (review F13). Same tab: the file is on this site. */
export function TxtLink() {
  return <ProofLink href={securityTxt.href}>{securityTxt.label}</ProofLink>
}

/** Scope marker: a filled dot for what is in, a hollow ring for what is out. Decorative: the label says it in words. */
export function ScopeDot({ kind }: { kind: 'in' | 'out' }) {
  return kind === 'in' ? (
    <span className="h-2 w-2 shrink-0 rounded-full bg-[#3ECF8E]" aria-hidden="true" />
  ) : (
    <span className="h-2 w-2 shrink-0 rounded-full border border-muted-foreground" aria-hidden="true" />
  )
}

/** The wildcard host pattern is machine data, so it alone is set in mono; the rest of the sentence stays as written. */
export function ScopeText({ text }: { text: string }) {
  const parts = text.split(/(\*\.[a-z0-9.-]+)/i)
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-mono text-[0.9em]">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  )
}

/** One scope list under its label. `hairlines` sets the items as ruled rows (A); otherwise they are a plain list. */
export function ScopeList({ idPrefix, kind, hairlines = false }: { idPrefix: string; kind: 'in' | 'out'; hairlines?: boolean }) {
  const isIn = kind === 'in'
  const id = `${idPrefix}-${kind}`
  return (
    <div className="min-w-0">
      <p id={id} className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <ScopeDot kind={kind} />
        {isIn ? scope.inLabel : scope.outLabel}
      </p>
      <ul role="list" aria-labelledby={id} className={hairlines ? 'mt-3 border-t border-border' : 'mt-3 space-y-2'}>
        {(isIn ? scope.in : scope.out).map((item) => (
          <li
            key={item}
            className={`text-[15px] leading-relaxed ${isIn ? 'text-foreground' : 'text-muted-foreground'} ${hairlines ? 'border-b border-border py-3' : ''}`}
          >
            <ScopeText text={item} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** About's RecordB rows (muted term, medium detail), narrowed to fit half a column. `compact` is the smaller B form. */
export function TimelineLedger({ compact = false }: { compact?: boolean }) {
  return (
    <dl className="border-t border-border">
      {timelines.map((t) => (
        <div
          key={t.term}
          className={`flex flex-col gap-1 border-b border-border sm:flex-row sm:items-baseline sm:gap-6 ${compact ? 'py-3' : 'py-4'}`}
        >
          <dt className="text-sm text-muted-foreground sm:w-36 sm:shrink-0">{t.term}</dt>
          <dd className={`text-pretty font-medium tabular-nums text-foreground ${compact ? 'text-sm' : 'text-[15px]'}`}>{t.detail}</dd>
        </div>
      ))}
    </dl>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* A: two columns                                                                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export function DisclosureA() {
  return (
    <Section id={DISCLOSURE.id} eyebrow={DISCLOSURE.eyebrow} title={DISCLOSURE.title}>
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="min-w-0">
          <p className="max-w-xl text-lg leading-relaxed text-foreground">{how}</p>
          <div className="mt-8">
            <MailButton />
          </div>
          <div className="mt-6">
            <TxtLink />
          </div>
          <div className="mt-10 space-y-4 border-t border-border pt-8">
            <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">{bounty}</p>
            <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">{pgp}</p>
          </div>
        </Reveal>
        <Reveal delay={90} className="min-w-0">
          <TimelineLedger />
        </Reveal>
      </div>

      <Reveal className="mt-16 lg:mt-20">
        <div className="grid grid-cols-1 gap-10 border-t border-border pt-10 md:grid-cols-2 md:gap-12 lg:gap-20">
          <ScopeList idPrefix="dsc-a" kind="in" hairlines />
          <ScopeList idPrefix="dsc-a" kind="out" hairlines />
        </div>
        <p className="mt-12 max-w-3xl text-lg leading-relaxed text-foreground">{safeHarbour}</p>
      </Reveal>

      <Reveal className="mt-16 lg:mt-20">
        <div className="flex flex-col gap-6 border-t border-border pt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <p className="max-w-2xl text-[15px] leading-relaxed tabular-nums text-muted-foreground">{record.text}</p>
          <a
            href={record.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 self-start border border-border px-5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-accent lg:self-auto"
          >
            {record.linkLabel} <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            <NewTab />
          </a>
        </div>
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* B: security.txt as the exhibit                                                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

/** One line of the literal file. The comment and each field name read quieter than their values; the text is untouched. */
function TxtLine({ line }: { line: string }) {
  if (line.startsWith('#')) return <span className="text-muted-foreground">{line}</span>
  const at = line.indexOf(':')
  if (at === -1) return <>{line}</>
  return (
    <>
      <span className="text-muted-foreground">{line.slice(0, at + 1)}</span>
      {line.slice(at + 1)}
    </>
  )
}

/** The hairline code card: its header links to the file, its body is the file, line for line. No fill behind it. */
function Exhibit() {
  const headingId = 'dsc-b-txt'
  return (
    <div className="border border-border">
      <a href={securityTxt.href} className="group flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <span
          id={headingId}
          className="text-sm font-medium text-foreground transition-colors duration-150 group-hover:text-primary"
        >
          {securityTxt.label}
        </span>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary"
          aria-hidden="true"
        />
      </a>
      <pre
        tabIndex={0}
        role="region"
        aria-labelledby={headingId}
        className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <code>
          {securityTxt.lines.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && '\n'}
              <TxtLine line={line} />
            </Fragment>
          ))}
        </code>
      </pre>
    </div>
  )
}

/**
 * One section of the policy column: a hairline, a small heading, then the text. `quietLabel` keeps the heading for
 * screen readers only, for a section whose content already names itself (the scope lists carry "In scope" and "Out of
 * scope"), so a sighted reader is not told "Scope" twice.
 */
function PolicyItem({ label, quietLabel = false, children }: { label: string; quietLabel?: boolean; children: ReactNode }) {
  return (
    <div className="border-t border-border pt-6">
      <h3 className={quietLabel ? 'sr-only' : 'text-sm font-normal text-muted-foreground'}>{label}</h3>
      <div className={quietLabel ? '' : 'mt-3'}>{children}</div>
    </div>
  )
}

export function DisclosureB() {
  return (
    <Section id={DISCLOSURE.id} eyebrow={DISCLOSURE.eyebrow} title={DISCLOSURE.title}>
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <Reveal className="min-w-0">
          <div className="max-w-2xl space-y-8 lg:max-w-none">
            <PolicyItem label={labels.contact}>
              <p className="text-[15px] leading-relaxed text-foreground">{how}</p>
              <div className="mt-6">
                <MailButton />
              </div>
            </PolicyItem>

            <TimelineLedger compact />

            <PolicyItem label={labels.scope} quietLabel>
              <div className="space-y-6">
                <ScopeList idPrefix="dsc-b" kind="in" />
                <ScopeList idPrefix="dsc-b" kind="out" />
              </div>
            </PolicyItem>

            <PolicyItem label={labels.safeHarbour}>
              <p className="text-[15px] leading-relaxed text-foreground">{safeHarbour}</p>
            </PolicyItem>

            <PolicyItem label={labels.bounty}>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{bounty}</p>
            </PolicyItem>

            <PolicyItem label={labels.pgp}>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{pgp}</p>
            </PolicyItem>
          </div>
        </Reveal>

        <Reveal delay={90} className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <Exhibit />
        </Reveal>
      </div>

      <Reveal className="mt-16 lg:mt-20">
        <div className="border-t border-border pt-8">
          <p className="max-w-3xl text-[15px] leading-relaxed tabular-nums text-muted-foreground">
            {record.text}{' '}
            <a
              href={record.href}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap font-medium text-foreground underline decoration-muted-foreground/60 underline-offset-4 transition-colors duration-150 hover:text-primary hover:decoration-primary"
            >
              {record.linkLabel}
              <ArrowUpRight className="ml-1 inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />
              <NewTab />
            </a>
          </p>
        </div>
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* C: one ledger                                                                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

/** The ask, with the address as the link inside it. If the sentence ever stops naming the address once, the link trails it. */
export function HowWithLink() {
  const parts = how.split(email)
  const link = (
    <a
      href={`mailto:${email}`}
      className="font-medium text-foreground underline decoration-muted-foreground/60 underline-offset-4 transition-colors duration-150 hover:text-primary hover:decoration-primary"
    >
      {email}
    </a>
  )
  if (parts.length !== 2) {
    return (
      <>
        {how} {link}
      </>
    )
  }
  return (
    <>
      {parts[0]}
      {link}
      {parts[1]}
    </>
  )
}

/** RecordB's row: a muted term in a fixed column from sm up (stacked on mobile) and the detail beside it. */
function LedgerRow({ term, strong = false, children }: { term: string; strong?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-border py-4 sm:flex-row sm:items-baseline sm:gap-6">
      <dt className="text-sm text-muted-foreground sm:w-64 sm:shrink-0">{term}</dt>
      <dd className={`min-w-0 text-[15px] tabular-nums text-foreground ${strong ? 'font-medium' : 'leading-relaxed'}`}>{children}</dd>
    </div>
  )
}

export function DisclosureC() {
  return (
    <Section id={DISCLOSURE.id} eyebrow={DISCLOSURE.eyebrow} title={DISCLOSURE.title}>
      <Reveal>
        <dl className="border-t border-border">
          <LedgerRow term={labels.contact}>
            <HowWithLink />
          </LedgerRow>

          {timelines.map((t) => (
            <LedgerRow key={t.term} term={t.term} strong>
              {t.detail}
            </LedgerRow>
          ))}

          <LedgerRow term={labels.bounty}>{bounty}</LedgerRow>
          <LedgerRow term={labels.pgp}>{pgp}</LedgerRow>

          <LedgerRow term={labels.scope}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
              <ScopeList idPrefix="dsc-c" kind="in" />
              <ScopeList idPrefix="dsc-c" kind="out" />
            </div>
          </LedgerRow>

          <LedgerRow term={labels.safeHarbour}>{safeHarbour}</LedgerRow>

          <LedgerRow term={labels.record}>
            <p>{record.text}</p>
            <a
              href={record.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 font-medium text-foreground transition-colors duration-150 hover:text-primary"
            >
              {record.linkLabel} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <NewTab />
            </a>
          </LedgerRow>
        </dl>

        <a href={securityTxt.href} className="group flex items-center justify-between gap-6 border-b border-border py-4">
          <span className="text-[15px] font-medium text-foreground transition-colors duration-150 group-hover:text-primary">
            {securityTxt.label}
          </span>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary"
            aria-hidden="true"
          />
        </a>
      </Reveal>
    </Section>
  )
}
