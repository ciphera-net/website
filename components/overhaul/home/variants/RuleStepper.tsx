'use client'

/**
 * Round 2d/2e (mock, 16-10): How we build as a STEPPED timeline.
 * Owner on Round 2c: "i like F but it should click onto those 4 different scroll things" and "it looks empty".
 * Owner on Round 2d: "i like h but i think we can show the data underneath the 4 points a bit better" and the live
 * `document.cookie` readout "doesn't even make sense for the users": replaced by what a visit leaves behind (what Pulse
 * counts and what it never does, as published in docs.ciphera.net/pulse/privacy).
 *
 * F's layout (the four rules alternate above and below one line, each on a stem), but the block holds while the reader
 * scrolls through four steps, and each scroll that comes to rest inside it eases on to the next step IN THE DIRECTION
 * the reader was scrolling (directional stepping, in code). Not CSS scroll-snap: with `proximity`, a single mouse-wheel
 * notch (~100 px) is always snapped back to the step it left, so a reader scrolling one notch at a time could never get
 * past the block (measured 16-10, every step and the exit). A step is discrete: the line slides to that rule's stem,
 * the stem grows, the copy settles, and the rule's icon tile turns orange (Facet: orange for the active indicator only).
 * Transitions run on Facet's curve.
 *
 * fill: 'icons' (tiles only) · 'proof' (plus evidence) · 'colour' (evidence with the providers' brand colours)
 * evidence, how the proof is shown:
 *  - 'inline'    under each rule's description, loose (Round 2d H and I)
 *  - 'cards'     under each rule's description, in one labelled card shape; the current card gets an orange top edge
 *  - 'band'      the rules carry text only; the four pieces of evidence form one ruled row under the timeline
 *  - 'spotlight' the rules carry text only; one larger panel beside the heading shows the current rule's evidence
 *  - 'line'      Round 2f, owner: "i feel like its too much": one quiet line per rule that adds what its description
 *                does not say (what Pulse counts, the providers' marks, the repository count, the file formats); no
 *                boxes, labels, lists or chips
 *
 * Without JavaScript, with reduced motion, below lg, or on a viewport too short to hold the block, nothing pins and
 * everything renders reached (no current step); 'spotlight' then shows its evidence as cards under each rule. Below lg
 * it is a vertical rail, drawn as it scrolls.
 */
import * as React from 'react'
import { BracketsCurly, Check, Eye, FileCsv, FileXls, GithubLogo, LockKey, MapPin, SignOut, Trash, X } from '@phosphor-icons/react/dist/ssr'
import { INFRA_MARKS } from '../../brand-marks'
import { HEADING, ProofLink, RULES, type RuleIcon } from '../rules'

type Fill = 'icons' | 'proof' | 'colour'
type Evidence = 'inline' | 'cards' | 'band' | 'spotlight' | 'line'

const ICONS: Record<RuleIcon, typeof Eye> = { eye: Eye, pin: MapPin, lock: LockKey, out: SignOut }
// Simple Icons' brand colours for the two Swiss providers (checked against simple-icons@15 data, 16-10): 'colour', and
// M's line by owner ruling 16-10 ("lets go for M but for the logos, can we have the real colors"). GitHub's is #181717,
// invisible on this page; its own convention on dark backgrounds is the white mark, which is what is drawn.
const BRAND_HEX: Record<string, string> = { exoscale: '#DA291C', infomaniak: '#0098FF' }
const EV_LABEL = ['What a visit leaves behind', 'Where it runs', 'Public code', 'Your way out']

// The row of four stations, and where the line crosses it (share of the row above the line). Sized from measured
// content (16-10, 1440 wide): the stations' natural heights must fit their half, and the whole block must fit under the
// header at 1440 x 1000 or it does not pin. Cards: the upper rules carry the taller evidence, so the line sits lower.
const ROW_H: Record<Evidence, number> = { inline: 640, cards: 725, band: 400, spotlight: 400, line: 500 }
const SPLIT: Record<Evidence, number> = { inline: 0.5, cards: 0.52, band: 0.5, spotlight: 0.5, line: 0.5 }
const SEG = 0.42 // scroll per step, as a share of the viewport height
const DWELL = 0.8 // extra steps' worth of scroll after the last step before the block releases
const HEADER = 72 // the fixed glass header the stage sits under
const VRAMP = 90

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const vars = (o: Record<string, string>) => o as React.CSSProperties

export function RuleStepper({ fill, evidence = 'inline' }: { fill: Fill; evidence?: Evidence }) {
  const root = React.useRef<HTMLDivElement>(null)
  const content = React.useRef<HTMLDivElement>(null)
  const line = React.useRef<HTMLDivElement>(null)
  const items = React.useRef<(HTMLDivElement | null)[]>([])
  const rail = React.useRef<HTMLDivElement>(null)
  const railItems = React.useRef<(HTMLDivElement | null)[]>([])
  const colour = fill === 'colour'
  const proof = fill !== 'icons'
  const split = SPLIT[evidence] * 100

  React.useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const desk = window.matchMedia('(min-width: 1024px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = (k: string, v: string) => el.style.setProperty(k, v)
    const STEP_VARS = ['--line', '--k0', '--k1', '--k2', '--k3', '--c0', '--c1', '--c2', '--c3', '--s0', '--s1', '--s2', '--s3']
    const RAIL_VARS = ['--vline', '--v0', '--v1', '--v2', '--v3']
    let raf = 0
    let pinned = false
    let seg = 0
    let step = -2 // nothing written yet

    const frame = () => {
      raf = 0
      if (reduce.matches) return
      const vh = window.innerHeight
      if (pinned) {
        const scrolled = -el.getBoundingClientRect().top
        const next = scrolled < -0.3 * vh ? -1 : scrolled > (3 + DWELL * 0.5) * seg ? 4 : Math.max(0, Math.min(3, Math.round(scrolled / seg)))
        if (next === step) return
        step = next
        el.dataset.rsStep = String(step)
        const la = line.current
        const L = la ? la.offsetWidth : 1
        // the line reaches the current rule's stem; after the last step it completes to the end
        const x = step < 0 ? 0 : step > 3 ? L : (items.current[step]?.offsetLeft ?? 0)
        set('--line', clamp01(x / L).toFixed(4))
        const spot = Math.max(0, Math.min(3, step)) // the spotlight always shows one rule's evidence
        for (let i = 0; i < 4; i++) {
          set(`--k${i}`, step >= i ? '1' : '0')
          set(`--c${i}`, step === i ? '1' : '0')
          set(`--s${i}`, spot === i ? '1' : '0')
        }
      } else if (!desk.matches) {
        const rl = rail.current
        if (!rl) return
        const tip = vh * 0.62 - rl.getBoundingClientRect().top
        set('--vline', clamp01(tip / Math.max(1, rl.offsetHeight)).toFixed(4))
        railItems.current.forEach((it, i) => {
          if (it) set(`--v${i}`, clamp01((tip - it.offsetTop) / VRAMP).toFixed(4))
        })
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const sync = () => {
      const motion = !reduce.matches
      const vh = window.innerHeight
      const want = motion && desk.matches
      // measure the PINNED layout (it differs from the static one for 'spotlight'), and pin only where the whole block
      // fits under the header; a short laptop screen gets the static layout
      el.dataset.rsPinned = want ? 'on' : 'off'
      const fits = want && (content.current?.offsetHeight ?? Infinity) + HEADER + 24 <= vh
      pinned = want && fits
      seg = Math.round(vh * SEG)
      el.dataset.rsMotion = motion ? 'on' : 'off'
      el.dataset.rsPinned = pinned ? 'on' : 'off'
      el.style.height = pinned ? `${Math.round(vh + (3 + DWELL) * seg)}px` : ''
      step = -2
      if (!pinned) {
        STEP_VARS.forEach((v) => el.style.removeProperty(v))
        delete el.dataset.rsStep
      }
      if (!motion || desk.matches) RAIL_VARS.forEach((v) => el.style.removeProperty(v))
      if (motion) schedule()
    }

    // Directional stepping. When a scroll comes to rest inside the block (between just before step 1 and the exit),
    // ease to the next stop in the direction the reader was going: one wheel notch, one arrow key or one flick moves one
    // step; resting exactly on a stop does nothing; past the exit the page scrolls freely. New input cancels the hold.
    let lastY = window.scrollY
    let dir = 0
    let endTimer = 0
    let holdUntil = 0
    const settle = () => {
      if (!pinned || performance.now() < holdUntil) return
      const top = el.getBoundingClientRect().top + window.scrollY
      const s = window.scrollY - top
      const stops = [0, 1, 2, 3, 3 + DWELL].map((i) => Math.round(i * seg))
      if (s < -0.15 * window.innerHeight || s > stops[4] + 1) return
      if (stops.some((t) => Math.abs(t - s) <= 2)) return
      const target = dir > 0 ? stops.find((t) => t > s) : [...stops].reverse().find((t) => t < s)
      if (target === undefined) return
      holdUntil = performance.now() + 900
      window.scrollTo({ top: Math.round(top + target), behavior: 'smooth' })
    }
    const onScroll = () => {
      const y = window.scrollY
      if (y !== lastY && performance.now() >= holdUntil) dir = y > lastY ? 1 : -1
      lastY = y
      schedule()
      if (!pinned) return
      window.clearTimeout(endTimer)
      endTimer = window.setTimeout(settle, 140)
    }
    const onInput = () => {
      holdUntil = 0
    }

    sync()
    document.fonts?.ready.then(sync).catch(() => {})
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onInput, { passive: true })
    window.addEventListener('touchstart', onInput, { passive: true })
    window.addEventListener('keydown', onInput)
    window.addEventListener('resize', sync)
    desk.addEventListener('change', sync)
    reduce.addEventListener('change', sync)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.clearTimeout(endTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onInput)
      window.removeEventListener('touchstart', onInput)
      window.removeEventListener('keydown', onInput)
      window.removeEventListener('resize', sync)
      desk.removeEventListener('change', sync)
      reduce.removeEventListener('change', sync)
    }
  }, [])

  return (
    <div ref={root} data-rs="" data-rs-evidence={evidence} className="relative">
      <div data-rs-stage="" className="hidden px-10 py-24 lg:block">
        <div ref={content}>
          <div className={evidence === 'spotlight' ? 'grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_400px]' : 'grid items-end gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]'}>
            <div>
              <p className="text-sm text-muted-foreground">{HEADING.eyebrow}</p>
              <h2 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl">
                {HEADING.title}
              </h2>
              {evidence === 'spotlight' && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{HEADING.lead}</p>}
            </div>
            {evidence !== 'spotlight' && <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{HEADING.lead}</p>}
            {evidence === 'spotlight' && proof && (
              <div className="rs-spot relative h-[200px]">
                {RULES.map((r, i) => (
                  <div key={r.title} className="rs-spot-item absolute inset-0" style={vars({ '--s': `var(--s${i})` })}>
                    <EvidenceCard i={i} className="h-full" spotlight>
                      <EvidenceBody i={i} colour={colour} size="md" />
                    </EvidenceCard>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div ref={line} className={`relative mt-10 ${evidence === 'spotlight' ? 'rs-row-spot' : ''}`} style={evidence === 'spotlight' ? undefined : { height: ROW_H[evidence] }}>
            <span aria-hidden="true" className="absolute inset-x-0 h-px bg-white/10" style={{ top: `${split}%` }} />
            <span aria-hidden="true" className="rs-line absolute inset-x-0 h-px bg-primary" style={{ top: `${split}%` }} />
            <span aria-hidden="true" className="absolute left-0 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-line-hover" style={{ top: `${split}%` }} />
            <span aria-hidden="true" className="rs-on-start absolute left-0 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" style={{ top: `${split}%` }} />
            <span aria-hidden="true" className="absolute right-0 h-[9px] w-[9px] -translate-y-1/2 translate-x-1/2 rounded-full bg-line-hover" style={{ top: `${split}%` }} />
            <span aria-hidden="true" className="rs-on-end absolute right-0 h-[9px] w-[9px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary" style={{ top: `${split}%` }} />
            {RULES.map((r, i) => (
              <Station key={r.title} i={i} split={split} items={items}>
                {proof && evidence === 'inline' && (
                  <div className="mt-4">
                    <EvidenceBody i={i} colour={colour} />
                  </div>
                )}
                {proof && evidence === 'cards' && (
                  <EvidenceCard i={i} className="mt-5">
                    <EvidenceBody i={i} colour={colour} />
                  </EvidenceCard>
                )}
                {proof && evidence === 'line' && <EvidenceLine i={i} />}
                {proof && evidence === 'spotlight' && (
                  <EvidenceCard i={i} className="rs-spot-inline mt-5">
                    <EvidenceBody i={i} colour={colour} />
                  </EvidenceCard>
                )}
              </Station>
            ))}
          </div>
          {proof && evidence === 'band' && (
            <div className="mt-8 grid grid-cols-4 border-t border-border">
              {RULES.map((r, i) => (
                <div
                  key={r.title}
                  className="relative border-l border-border px-6 pb-2 pt-5 first:border-l-0 first:pl-0"
                  style={vars({ '--k': `var(--k${i})`, '--c': `var(--c${i})` })}
                >
                  <span aria-hidden="true" className={`rs-cur absolute -top-px right-0 h-px bg-primary ${i === 0 ? 'left-0' : '-left-px'}`} />
                  <div className="rs-text">
                    <p className="text-xs text-muted-foreground">{EV_LABEL[i]}</p>
                    <div className="mt-3">
                      <EvidenceBody i={i} colour={colour} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* phones and tablets: a vertical rail, drawn as it scrolls */}
      <div className="px-6 py-24 sm:px-10 lg:hidden">
        <p className="text-sm text-muted-foreground">{HEADING.eyebrow}</p>
        <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">{HEADING.title}</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{HEADING.lead}</p>
        <div ref={rail} className="relative mt-14 pl-14">
          <span aria-hidden="true" className="absolute bottom-0 left-[19px] top-5 w-px bg-white/10" />
          <span aria-hidden="true" className="rs-vline absolute bottom-0 left-[19px] top-5 w-px bg-primary" />
          {RULES.map((r, i) => {
            const Icon = ICONS[r.icon]
            return (
              <div
                key={r.title}
                ref={(n) => {
                  railItems.current[i] = n
                }}
                className="relative pb-14 last:pb-0"
                style={vars({ '--k': `var(--v${i})`, '--c': '0' })}
              >
                <Tile Icon={Icon} className="-left-14 top-0" />
                <div className="rs-text">
                  <h3 className="pt-2 text-lg font-semibold tracking-tight text-foreground">{r.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{r.desc}</p>
                  {proof && evidence === 'line' && <EvidenceLine i={i} />}
                  {proof &&
                    evidence !== 'line' &&
                    (evidence === 'inline' ? (
                      <div className="mt-4">
                        <EvidenceBody i={i} colour={colour} />
                      </div>
                    ) : (
                      <EvidenceCard i={i} className="mt-5">
                        <EvidenceBody i={i} colour={colour} />
                      </EvidenceCard>
                    ))}
                  <div className="mt-4">
                    <ProofLink href={r.href}>{r.proof}</ProofLink>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** A square icon tile (Facet's geometry); the current step lights its border and icon orange. */
function Tile({ Icon, className }: { Icon: typeof Eye; className: string }) {
  return (
    <span className={`absolute z-10 inline-flex h-10 w-10 items-center justify-center border border-border bg-background ${className}`}>
      <span aria-hidden="true" className="rs-cur absolute -inset-px border border-primary" />
      <Icon className="rs-icon h-5 w-5 text-foreground" aria-hidden="true" />
      <Icon className="rs-cur absolute h-5 w-5 text-primary" aria-hidden="true" />
    </span>
  )
}

function Station({ i, split, items, children }: { i: number; split: number; items: React.MutableRefObject<(HTMLDivElement | null)[]>; children?: React.ReactNode }) {
  const r = RULES[i]
  const up = i % 2 === 0
  const Icon = ICONS[r.icon]
  return (
    <div
      ref={(n) => {
        items.current[i] = n
      }}
      data-rs-station=""
      className="absolute"
      style={{ left: `${i * 22.67}%`, width: '32%', top: up ? 0 : `${split}%`, height: `${up ? split : 100 - split}%`, ...vars({ '--k': `var(--k${i})`, '--c': `var(--c${i})` }) }}
    >
      <span aria-hidden="true" className={`rs-stem absolute left-0 w-px bg-white/25 ${up ? 'bottom-0 top-5 origin-bottom' : 'bottom-5 top-0 origin-top'}`} />
      <Tile Icon={Icon} className={`left-0 -translate-x-1/2 ${up ? 'top-0' : 'bottom-0'}`} />
      <div className={`rs-text flex h-full flex-col pl-9 ${up ? 'justify-start pb-8' : 'justify-end pt-8'}`}>
        <h3 className="pt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">{r.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{r.desc}</p>
        {children}
        <div className="mt-4">
          <ProofLink href={r.href}>{r.proof}</ProofLink>
        </div>
      </div>
    </div>
  )
}

/** One labelled card shape for every piece of evidence; the current step gives it an orange top edge. */
function EvidenceCard({ i, className = '', spotlight = false, children }: { i: number; className?: string; spotlight?: boolean; children: React.ReactNode }) {
  return (
    <div className={`relative border border-border bg-card ${spotlight ? 'p-6' : 'p-4'} ${className}`}>
      {!spotlight && <span aria-hidden="true" className="rs-cur absolute -left-px -right-px -top-px h-px bg-primary" />}
      {spotlight && <span aria-hidden="true" className="absolute -left-px -right-px -top-px h-px bg-primary" />}
      <p className={`${spotlight ? 'text-sm' : 'text-xs'} text-muted-foreground`}>{EV_LABEL[i]}</p>
      <div className={spotlight ? 'mt-4' : 'mt-3'}>{children}</div>
    </div>
  )
}

/**
 * The evidence for one rule. Every item is published fact: what Pulse counts and never does
 * (docs.ciphera.net/pulse/privacy), the two Swiss providers (the subprocessor list), the public repositories (the Open
 * by default block's figure, never stars), the export formats.
 */
function EvidenceBody({ i, colour, size = 'sm' }: { i: number; colour: boolean; size?: 'sm' | 'md' }) {
  const t = size === 'md' ? 'text-[15px]' : 'text-sm'
  if (i === 0 && size === 'sm')
    return (
      <ul className={`space-y-2 ${t}`}>
        <li className="flex gap-2.5">
          <Check className={`mt-[3px] h-3.5 w-3.5 shrink-0 ${colour ? 'text-pos' : 'text-foreground'}`} aria-hidden="true" />
          <span className="text-foreground">
            <span className="text-muted-foreground">Counts </span>pages, referrers, location and devices
          </span>
        </li>
        <li className="flex gap-2.5">
          <X className="mt-[3px] h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="text-foreground">
            <span className="text-muted-foreground">Never </span>cookies, fingerprinting, raw IP addresses, names or emails
          </span>
        </li>
      </ul>
    )
  if (i === 0)
    return (
      <div className={`grid grid-cols-2 gap-x-6 ${t}`}>
        <div>
          <p className="text-xs text-muted-foreground">Counts</p>
          <ul className="mt-2 space-y-1.5">
            {['Pages', 'Referrers', 'Location', 'Devices'].map((x) => (
              <li key={x} className="flex items-center gap-2 text-foreground">
                <Check className={`h-3.5 w-3.5 shrink-0 ${colour ? 'text-pos' : 'text-foreground'}`} aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Never</p>
          <ul className="mt-2 space-y-1.5">
            {['Cookies', 'Fingerprinting', 'Raw IP addresses', 'Names or emails'].map((x) => (
              <li key={x} className="flex items-center gap-2 text-muted-foreground">
                <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  if (i === 1)
    return (
      <ul className={`flex flex-col gap-3 ${t}`}>
        {INFRA_MARKS.filter((m) => m.where === 'Switzerland').map((m) => (
          <li key={m.key} className="flex items-start gap-3">
            <svg viewBox="0 0 24 24" aria-hidden="true" className={`${size === 'md' ? 'h-5 w-5' : 'h-4 w-4'} mt-0.5 shrink-0`} fill={colour ? BRAND_HEX[m.key] : 'currentColor'}>
              <path d={m.path} />
            </svg>
            <div>
              <p className="font-medium text-foreground">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.key === 'exoscale' ? 'Zurich · email and backup storage' : 'Geneva · servers, storage and backups'}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  if (i === 2)
    return (
      <div className={t}>
        <p className="flex items-center gap-2.5">
          <GithubLogo className={`${size === 'md' ? 'h-5 w-5' : 'h-4 w-4'} text-foreground`} aria-hidden="true" />
          <span className="font-medium text-foreground">25 public repositories</span>
        </p>
        <ul className="mt-2 space-y-1 font-mono text-xs text-muted-foreground">
          <li>ciphera-net/tessera</li>
          <li>ciphera-net/pulse-cli</li>
          <li>ciphera-net/website</li>
        </ul>
      </div>
    )
  return (
    <div className="flex flex-wrap gap-2">
      {(
        [
          ['CSV', FileCsv],
          ['Excel', FileXls],
          ['JSON', BracketsCurly],
          ['Delete', Trash],
        ] as const
      ).map(([label, Icon]) => (
        <span key={label} className={`inline-flex items-center gap-1.5 border border-border px-2.5 text-foreground ${size === 'md' ? 'h-9 text-sm' : 'h-8 text-xs'}`}>
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {label}
        </span>
      ))}
    </div>
  )
}

/**
 * Round 2f: one quiet line per rule, adding only what its description does not already say. Rules 1 and 4 speak for
 * the company (W2a, owner 16-10): the privacy policy's §5 commitments, and "No vendor lock-in" in the owner's words.
 */
function EvidenceLine({ i }: { i: number }) {
  const row = 'mt-3 flex items-center gap-2 text-sm text-muted-foreground'
  // W4d (owner 17-10): the humanizer flagged W2a's clipped "No tracking cookies, no ads, no data sales."; a full sentence.
  if (i === 0) return <p className="mt-3 text-sm text-muted-foreground">We don&apos;t use tracking cookies or ads, and we don&apos;t sell data.</p>
  if (i === 1)
    return (
      <p className={row}>
        {INFRA_MARKS.filter((m) => m.where === 'Switzerland').map((m, j) => (
          <span key={m.key} className="inline-flex items-center gap-2">
            {j > 0 && <span aria-hidden="true">·</span>}
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill={BRAND_HEX[m.key]}>
              <path d={m.path} />
            </svg>
            {m.name}
          </span>
        ))}
      </p>
    )
  if (i === 2)
    return (
      <p className={row}>
        <GithubLogo className="h-4 w-4 shrink-0" aria-hidden="true" />
        25 public repositories
      </p>
    )
  return <p className="mt-3 text-sm text-muted-foreground">No vendor lock-in.</p>
}
