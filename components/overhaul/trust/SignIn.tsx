/**
 * Round 5 (mock, 17-10-2026): the Trust page's "How sign-in works" block (Section id `sign-in`), three options over the
 * one SIGN_IN export of content.ts. Every visible string is rendered by reference and none is reworded here: the title,
 * both body paragraphs, email, recovery, sessions, the stored list with its label, and the link to the open-source block.
 * The four column names are the only mono text (they are machine data); everything else is Geist sans. Nothing drawn here
 * is a value: no hex string and no scrambled password, because OPAQUE does not hash and send.
 *
 * A: story and ledger. The prose runs on the left; what the sign-in server stores sits on the right in one square
 *    ledger headed by its label, each column name over its plain description. The link closes the block.
 * B: the exchange, drawn. Three stations (SIGN_IN.flow) in a row on lg, stacked below it, joined by a line that a light
 *    travels along (the homepage arc's `eo-pulse`, which carries its own reduced-motion rule). The password stays on the
 *    device, drawn as a lock. The prose follows the drawing; the stored list is a compact four-up.
 * C: one ledger. RecordB's rows with the term column from SIGN_IN.topics; the stored list sits inside its row and the
 *    link to open source is the last row.
 *
 * Colour: the Ciphera ID mark keeps its own colours and appears once per option, beside the stored label. B's one orange
 * point is the travelling light (#FFB36B, as WhereDataLivesB's arc). A and C have none; brand orange shows only when the
 * link is hovered (an action).
 */
import type { ReactNode } from 'react'
import Image from 'next/image'
import { ArrowRight, Database, LockKey } from '@phosphor-icons/react/dist/ssr'
import { authIcon } from '@/lib/images'
import { cn } from '@/lib/utils'
import { Reveal } from '../home/Reveal'
import { Section } from '../home/Section'
import { ProofLink } from '../home/rules'
import { SIGN_IN } from './content'

/** The Ciphera ID mark (file 2375 x 2308): h-4 w-auto reserves its box from the width/height attributes before the
 * PNG loads (review F4: max-h/max-w gave a 0x0 box and a 16 px shift); shrink-0 keeps flex from narrowing it. */
export function IdMark({ className }: { className?: string }) {
  return (
    <Image
      src={authIcon}
      alt=""
      width={20}
      height={19}
      unoptimized
      className={cn('h-4 w-auto shrink-0', className)}
    />
  )
}

/** The link to the open-source block: the homepage's ProofLink (review F13). On-page anchor, so no new tab. */
export function TesseraLink() {
  return <ProofLink href={SIGN_IN.tesseraHref}>{SIGN_IN.tesseraLabel}</ProofLink>
}

/** A column name is machine data, so it is the one text set in mono. */
export function Column({ name }: { name: string }) {
  return <code className="font-mono text-[13px] text-foreground">{name}</code>
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* A: story and ledger                                                                                                */
/* ------------------------------------------------------------------------------------------------------------------ */

export function SignInA() {
  return (
    <Section id={SIGN_IN.id} eyebrow={SIGN_IN.eyebrow} title={SIGN_IN.title}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
        <Reveal>
          <div className="max-w-xl">
            <div className="space-y-5">
              {SIGN_IN.body.map((p, i) => (
                <p
                  key={p}
                  className={i === 0 ? 'text-lg leading-relaxed text-foreground' : 'text-[15px] leading-relaxed text-muted-foreground'}
                >
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8 space-y-5 border-t border-border pt-8 text-[15px] leading-relaxed tabular-nums text-muted-foreground">
              <p>{SIGN_IN.email}</p>
              <p>{SIGN_IN.recovery}</p>
              <p>{SIGN_IN.sessions}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="border border-border">
            <h3 className="flex items-center gap-3 border-b border-border px-5 py-4 text-sm font-medium text-foreground">
              <IdMark /> {SIGN_IN.storedLabel}
            </h3>
            <dl className="divide-y divide-border">
              {SIGN_IN.stored.map((s) => (
                <div key={s.column} className="px-5 py-4">
                  <dt>
                    <Column name={s.column} />
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.what}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>

      <Reveal delay={60}>
        <div className="mt-14 border-t border-border pt-6">
          <TesseraLink />
        </div>
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* B: the exchange, drawn                                                                                             */
/* ------------------------------------------------------------------------------------------------------------------ */

/**
 * One wire: a hairline with a short light that travels it. `eo-pulse` is the class WhereDataLivesB's arc uses; it brings
 * its own prefers-reduced-motion rule (the light stops, lit near the start). The SVG is stretched along its one axis
 * only (the other axis is 1:1 with the viewBox), so the stroke keeps its width, and the dash is measured by pathLength,
 * so the light is the same share of the wire at any length. `delay` only offsets the start of the same animation.
 */
export function Wire({ axis, pulse = true }: { axis: 'x' | 'y'; pulse?: boolean }) {
  const x = axis === 'x'
  const d = x ? 'M0 1H1000' : 'M1 0V1000'
  return (
    <svg viewBox={x ? '0 0 1000 2' : '0 0 2 1000'} preserveAspectRatio="none" className="block h-full w-full" aria-hidden="true">
      <path d={d} pathLength={1} fill="none" stroke="#f4f4f4" strokeOpacity="0.16" strokeWidth="1.2" />
      {pulse && (
        <path className="eo-pulse" d={d} pathLength={1} fill="none" stroke="#FFB36B" strokeWidth="1.8" />
      )}
    </svg>
  )
}

/**
 * One station. The first holds a lock (the password stays), the last a database (a record that is not the password);
 * a station between them is only a point on the line, because what passes there is not a place. On lg the first sits at
 * the left edge, the last at the right and the one between them in the middle, so the line spans the whole column; below
 * lg the stations stack with a vertical wire from each tile's centre to the next one's.
 */
function Station({ i, last, place, line }: { i: number; last: number; place: string; line: string }) {
  const Glyph = i === 0 ? LockKey : i === last ? Database : null
  const align = i === 0 ? 'lg:items-start lg:text-left' : i === last ? 'lg:items-end lg:text-right' : 'lg:items-center lg:text-center'
  return (
    <li className={cn('relative flex gap-5 pb-10 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0', align)}>
      {i < last && (
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-[22px] left-[21px] top-[22px] w-[2px] lg:hidden">
          <Wire axis="y" pulse={i > 0} />
        </span>
      )}
      {Glyph ? (
        <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-background">
          <Glyph className="h-5 w-5 text-foreground" aria-hidden="true" />
        </span>
      ) : (
        <span aria-hidden="true" className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center">
          <span className="h-2.5 w-2.5 border border-muted-foreground bg-background" />
        </span>
      )}
      <div className="min-w-0 pt-[11px] lg:mt-5 lg:pt-0">
        <p className="text-[15px] font-medium text-foreground">{place}</p>
        <p className="mt-1.5 max-w-[19rem] text-sm leading-relaxed text-muted-foreground">{line}</p>
      </div>
    </li>
  )
}

/**
 * The drawing. On lg three equal columns; one wire runs behind the tiles from the first tile's centre to the last one's
 * (inset 22px, half of the 44px tile, on both sides; centred on the tiles at top 21px with its 2px height). The tiles are
 * opaque, so the wire shows only between them and the light appears to leave one and arrive at the other.
 */
function Exchange() {
  const last = SIGN_IN.flow.length - 1
  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute left-[22px] right-1/2 top-[21px] hidden h-[2px] lg:block">
        <Wire axis="x" pulse={false} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 right-[22px] top-[21px] hidden h-[2px] lg:block">
        <Wire axis="x" />
      </div>
      <ol role="list" className="lg:grid lg:grid-cols-3 lg:gap-x-8">
        {SIGN_IN.flow.map((f, i) => (
          <Station key={f.place} i={i} last={last} place={f.place} line={f.line} />
        ))}
      </ol>
    </div>
  )
}

export function SignInB() {
  return (
    <Section id={SIGN_IN.id} eyebrow={SIGN_IN.eyebrow} title={SIGN_IN.title}>
      <Reveal>
        <Exchange />
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-16 max-w-2xl space-y-5">
          {SIGN_IN.body.map((p, i) => (
            <p
              key={p}
              className={i === 0 ? 'text-lg leading-relaxed text-foreground' : 'text-[15px] leading-relaxed text-muted-foreground'}
            >
              {p}
            </p>
          ))}
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          {[SIGN_IN.email, SIGN_IN.recovery].map((t) => (
            <p key={t} className="border-t border-border pt-6 text-[15px] leading-relaxed tabular-nums text-muted-foreground">
              {t}
            </p>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed tabular-nums text-muted-foreground">{SIGN_IN.sessions}</p>
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-14">
          <h3 className="flex items-center gap-2.5 text-sm font-medium text-foreground">
            <IdMark /> {SIGN_IN.storedLabel}
          </h3>
          <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {SIGN_IN.stored.map((s) => (
              <div key={s.column} className="border-t border-border pt-4">
                <dt>
                  <Column name={s.column} />
                </dt>
                <dd className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{s.what}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <TesseraLink />
        </div>
      </Reveal>
    </Section>
  )
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* C: one ledger                                                                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

/** RecordB's row: a muted term column and the detail, side by side from md up (the prose needs the width), stacked below. */
function LedgerRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:items-baseline sm:gap-6">
      <dt className="text-sm text-muted-foreground sm:w-64 sm:shrink-0">{term}</dt>
      <dd className="min-w-0 flex-1 space-y-3">{children}</dd>
    </div>
  )
}

const PROSE = 'max-w-xl text-[15px] leading-relaxed tabular-nums'

export function SignInC() {
  return (
    <Section id={SIGN_IN.id} eyebrow={SIGN_IN.eyebrow} title={SIGN_IN.title}>
      <Reveal>
        <div className="border-t border-border">
          <dl>
            <LedgerRow term={SIGN_IN.topics.password}>
              {SIGN_IN.body.map((p, i) => (
                <p key={p} className={cn(PROSE, i === 0 ? 'text-foreground' : 'text-muted-foreground')}>
                  {p}
                </p>
              ))}
            </LedgerRow>

            <LedgerRow term={SIGN_IN.topics.stored}>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <IdMark className="mr-2 inline-block" />
                {SIGN_IN.storedLabel}
              </p>
              <dl className="space-y-3 pt-1">
                {SIGN_IN.stored.map((s) => (
                  <div key={s.column} className="flex flex-col gap-1 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-6">
                    <dt>
                      <Column name={s.column} />
                    </dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground">{s.what}</dd>
                  </div>
                ))}
              </dl>
            </LedgerRow>

            <LedgerRow term={SIGN_IN.topics.email}>
              <p className={cn(PROSE, 'text-foreground')}>{SIGN_IN.email}</p>
            </LedgerRow>

            <LedgerRow term={SIGN_IN.topics.recovery}>
              <p className={cn(PROSE, 'text-foreground')}>{SIGN_IN.recovery}</p>
            </LedgerRow>

            <LedgerRow term={SIGN_IN.topics.sessions}>
              <p className={cn(PROSE, 'text-foreground')}>{SIGN_IN.sessions}</p>
            </LedgerRow>
          </dl>

          <a href={SIGN_IN.tesseraHref} className="group flex items-center justify-between gap-6 border-b border-border py-4">
            <span className="text-[15px] font-medium text-foreground transition-colors duration-150 group-hover:text-primary">
              {SIGN_IN.tesseraLabel}
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
