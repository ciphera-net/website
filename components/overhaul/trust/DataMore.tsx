/**
 * Round 5b (mock, 17-10-2026): four more options for the Trust page's "What we keep" block (Section id `data`), asked
 * for by the owner: "give me more options for What we keep block.. more colorfull... idk...". Each takes its colour from
 * a device the site already uses, never a tinted panel:
 *
 * D, lit tiles: the homepage stepper's icon tiles. What we keep sits in tiles lit brand orange; what we never keep sits
 *    in grey tiles, struck through. Each group is headed by its real product mark (Pulse, Ciphera ID).
 * E, the record: one pageview as Pulse keeps it, field by field, with a flag and the browser's real mark; then what is
 *    not in the record, struck. The account beside it in the same form. Values are EXAMPLES and say so on the page.
 * F, the real dashboard: ciphera.net's own Pulse dashboard in full colour, with orange pins on the panels that show
 *    something Pulse keeps; the lists beside it.
 * G, chips: square chips, warm for what we keep, struck for what we never keep. The most compact.
 *
 * Copy is DATA from content.ts, rendered by reference. Marks: the Pulse and Ciphera ID logos (lib/images, sized by
 * height, never stretched); Firefox's mark from simple-icons@15 (CC0, hex #FF7139); Belgium's flag copied from
 * about/Record.tsx (13:15, landscape). Mono only for machine data (a path, a hash).
 */
import Image from 'next/image'
import type { ComponentType } from 'react'
import {
  ClockCounterClockwise,
  Cookie,
  Devices,
  EnvelopeSimple,
  FileText,
  Footprints,
  Hash,
  Key,
  Keyboard,
  MapPin,
  Network,
  Password,
  Robot,
  Vault,
  X,
} from '@phosphor-icons/react/dist/ssr'
import { authIcon, pulseIcon } from '@/lib/images'
import { cn } from '@/lib/utils'
import { Reveal } from '../home/Reveal'
import { Section } from '../home/Section'
import { ProofLink } from '../home/rules'
import { DATA } from './content'

type Group = (typeof DATA.groups)[number]
type IconProps = { className?: string; weight?: 'regular' | 'bold' | 'duotone' | 'fill' | 'light' | 'thin' }

const ICONS: Record<string, ComponentType<IconProps>> = {
  FileText, MapPin, Devices, Hash, Robot, Key, Vault, EnvelopeSimple, ClockCounterClockwise, Cookie, Network, Keyboard,
  Footprints, Password,
}

function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name]
  return C ? <C className={className} aria-hidden="true" /> : null
}

/** The group's real product mark: Pulse (file 1891 x 2806) or Ciphera ID (2375 x 2308), sized by height. */
function GroupMark({ g, className }: { g: Group; className?: string }) {
  return g.key === 'pulse' ? (
    <Image src={pulseIcon} alt="" width={14} height={20} unoptimized className={cn('h-5 w-auto shrink-0', className)} />
  ) : (
    <Image src={authIcon} alt="" width={21} height={20} unoptimized className={cn('h-5 w-auto shrink-0', className)} />
  )
}

function GroupTitle({ g }: { g: Group }) {
  return (
    <h3 className="flex items-center gap-3 text-lg font-semibold tracking-tight text-foreground">
      <GroupMark g={g} />
      {g.label}
    </h3>
  )
}

/** The closing row every option shares: the sentence and the privacy-policy link. */
function NotUsed({ className }: { className?: string }) {
  return (
    <Reveal delay={80}>
      <div className={cn('mt-16 flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-12', className)}>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{DATA.notUsed}</p>
        <div className="shrink-0">
          <ProofLink href={DATA.policyHref}>{DATA.policyLabel}</ProofLink>
        </div>
      </div>
    </Reveal>
  )
}

/** Belgium, from about/Record.tsx: 13:15 height to width, so landscape; a faint outline so black meets the page. */
export function FlagBE({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 45 39" aria-hidden="true" className={className}>
      <rect x="0" y="0" width="15" height="39" fill="#000000" />
      <rect x="15" y="0" width="15" height="39" fill="#FDDA24" />
      <rect x="30" y="0" width="15" height="39" fill="#EF3340" />
      <rect x="0.5" y="0.5" width="44" height="38" fill="none" stroke="#ffffff" strokeOpacity="0.15" />
    </svg>
  )
}

/** Firefox Browser, simple-icons@15 (CC0), its brand colour #FF7139. */
function FirefoxMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="#FF7139">
      <path d="M8.824 7.287c.008 0 .004 0 0 0zm-2.8-1.4c.006 0 .003 0 0 0zm16.754 2.161c-.505-1.215-1.53-2.528-2.333-2.943.654 1.283 1.033 2.57 1.177 3.53l.002.02c-1.314-3.278-3.544-4.6-5.366-7.477-.091-.147-.184-.292-.273-.446a3.545 3.545 0 01-.13-.24 2.118 2.118 0 01-.172-.46.03.03 0 00-.027-.03.038.038 0 00-.021 0l-.006.001a.037.037 0 00-.01.005L15.624 0c-2.585 1.515-3.657 4.168-3.932 5.856a6.197 6.197 0 00-2.305.587.297.297 0 00-.147.37c.057.162.24.24.396.17a5.622 5.622 0 012.008-.523l.067-.005a5.847 5.847 0 011.957.222l.095.03a5.816 5.816 0 01.616.228c.08.036.16.073.238.112l.107.055a5.835 5.835 0 01.368.211 5.953 5.953 0 012.034 2.104c-.62-.437-1.733-.868-2.803-.681 4.183 2.09 3.06 9.292-2.737 9.02a5.164 5.164 0 01-1.513-.292 4.42 4.42 0 01-.538-.232c-1.42-.735-2.593-2.121-2.74-3.806 0 0 .537-2 3.845-2 .357 0 1.38-.998 1.398-1.287-.005-.095-2.029-.9-2.817-1.677-.422-.416-.622-.616-.8-.767a3.47 3.47 0 00-.301-.227 5.388 5.388 0 01-.032-2.842c-1.195.544-2.124 1.403-2.8 2.163h-.006c-.46-.584-.428-2.51-.402-2.913-.006-.025-.343.176-.389.206-.406.29-.787.616-1.136.974-.397.403-.76.839-1.085 1.303a9.816 9.816 0 00-1.562 3.52c-.003.013-.11.487-.19 1.073-.013.09-.026.181-.037.272a7.8 7.8 0 00-.069.667l-.002.034-.023.387-.001.06C.386 18.795 5.593 24 12.016 24c5.752 0 10.527-4.176 11.463-9.661.02-.149.035-.298.052-.448.232-1.994-.025-4.09-.753-5.844z" />
    </svg>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* D: lit tiles                                                                                                       */
/* ---------------------------------------------------------------------------------------------------------------- */

function LitGroup({ g }: { g: Group }) {
  return (
    <div>
      <GroupTitle g={g} />
      <p className="mt-6 text-sm text-muted-foreground">{DATA.keptLabel}</p>
      <ul role="list" className="mt-3 space-y-3">
        {g.kept.map((item, i) => (
          <li key={item} className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-primary/50 bg-card">
              <Icon name={g.keptIcons[i]} className="h-5 w-5 text-primary" />
            </span>
            <span className="pt-2 text-[15px] leading-relaxed tabular-nums text-foreground">{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted-foreground">{DATA.neverLabel}</p>
      <ul role="list" className="mt-3 space-y-2.5">
        {g.never.map((item, i) => (
          <li key={item} className="flex items-center gap-4">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-border">
              <Icon name={g.neverIcons[i]} className="h-5 w-5 text-muted-foreground/70" />
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-[140%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-muted-foreground/80" />
            </span>
            <span className="text-[15px] text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DataD() {
  return (
    <Section id={DATA.id} eyebrow={DATA.eyebrow} title={DATA.title} lead={DATA.lead}>
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-x-16">
        {DATA.groups.map((g, i) => (
          <Reveal key={g.key} delay={i * 80}>
            <LitGroup g={g} />
          </Reveal>
        ))}
      </div>
      <NotUsed />
    </Section>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* E: the record                                                                                                      */
/* ---------------------------------------------------------------------------------------------------------------- */

const R = DATA.record

function RecordCard() {
  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <h3 className="flex items-center gap-3 text-[15px] font-semibold tracking-tight text-foreground">
          <GroupMark g={DATA.groups[0]} className="h-4" />
          {R.title}
        </h3>
        <span className="shrink-0 border border-border px-2 py-0.5 text-xs text-muted-foreground">{R.note}</span>
      </div>
      <dl className="divide-y divide-border">
        {R.fields.map((f) => (
          <div key={f.label} className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] items-baseline gap-4 px-5 py-3 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
            <dt className="text-sm text-muted-foreground">{f.label}</dt>
            <dd className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-[15px] text-foreground">
              {'place' in f && f.place === 'be' && <FlagBE className="h-3.5 w-auto shrink-0" />}
              {'mark' in f && f.mark === 'firefox' && <FirefoxMark className="h-4 w-4 shrink-0" />}
              <span className={cn('min-w-0 break-words', 'code' in f && f.code && 'font-mono text-[13px]', 'note' in f && f.note && 'text-primary')}>
                {f.value}
              </span>
              {'note' in f && f.note && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {f.note}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-border px-5 py-4">
        <p className="text-sm text-muted-foreground">{R.absentTitle}</p>
        <ul role="list" className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {R.absent.map((a) => (
            <li key={a} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground line-through decoration-muted-foreground/60">
              <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {a}
            </li>
          ))}
        </ul>
      </div>
      <p className="border-t border-border px-5 py-3 text-sm tabular-nums text-muted-foreground">{DATA.groups[0].kept[4]}</p>
    </div>
  )
}

function AccountCard() {
  const g = DATA.groups[1]
  return (
    <div className="border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <GroupMark g={g} className="h-4" />
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{DATA.accountRecord.title}</h3>
      </div>
      <ul role="list" className="divide-y divide-border">
        {g.kept.map((item, i) => (
          <li key={item} className="flex items-start gap-3.5 px-5 py-3.5">
            <Icon name={g.keptIcons[i]} className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary" />
            <span className="text-[15px] leading-relaxed tabular-nums text-foreground">{item}</span>
          </li>
        ))}
      </ul>
      <div className="border-t border-border px-5 py-4">
        <p className="text-sm text-muted-foreground">{R.absentTitle}</p>
        <ul role="list" className="mt-3">
          {g.never.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground line-through decoration-muted-foreground/60">
              <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function DataE() {
  return (
    <Section id={DATA.id} eyebrow={DATA.eyebrow} title={DATA.title} lead={DATA.lead}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <Reveal>
          <RecordCard />
        </Reveal>
        <Reveal delay={80}>
          <AccountCard />
        </Reveal>
      </div>
      <NotUsed />
    </Section>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* F: the real dashboard                                                                                              */
/* ---------------------------------------------------------------------------------------------------------------- */

const D = DATA.dashboard

function Pin({ x, y, label, i }: { x: number; y: number; label: string; i: number }) {
  return (
    <span className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <span className="relative block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2">
        <span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-ping" style={{ animationDelay: `${i * 400}ms` }} />
        <span aria-hidden="true" className="absolute inset-0.5 rounded-full border-2 border-[#0a0a0a] bg-primary" />
      </span>
      {/* The label rides ABOVE its pin from lg up (it cannot reach a neighbouring pin sideways); on smaller screens the
          legend under the image carries the words. bottom-6, not bottom-3: the anchor box is the 14 px dot's, so
          bottom-3 put the label's lower edge 2 px below the pin's centre and covered it (caught by looking, 17-10). */}
      <span className="absolute bottom-6 left-[-7px] hidden whitespace-nowrap border border-border bg-background/90 px-2.5 py-1 text-xs text-foreground backdrop-blur-sm lg:block">
        {label}
      </span>
    </span>
  )
}

export function DataF() {
  const pulse = DATA.groups[0]
  const account = DATA.groups[1]
  return (
    <Section id={DATA.id} eyebrow={DATA.eyebrow} title={DATA.title} lead={DATA.lead}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.35fr)] lg:items-start lg:gap-12">
        <Reveal>
          <div>
            <GroupTitle g={pulse} />
            <ul role="list" className="mt-5 divide-y divide-border border-y border-border">
              {pulse.kept.map((item) => (
                <li key={item} className="py-3 text-[15px] leading-relaxed tabular-nums text-foreground">{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              <span className="mr-2 font-medium text-foreground">{DATA.neverLabel}</span>
              {pulse.never.join(' · ')}
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <figure className="m-0">
            <div className="relative border border-border">
              <Image src={D.src} alt={D.alt} width={D.w} height={D.h} unoptimized className="block h-auto w-full" />
              {D.pins.map((p, i) => (
                <Pin key={p.label} x={p.x} y={p.y} label={p.label} i={i} />
              ))}
            </div>
            <ul role="list" className="mt-4 space-y-2 lg:hidden">
              {D.pins.map((p) => (
                <li key={p.label} className="flex items-center gap-2.5 text-sm text-foreground">
                  <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  {p.label}
                </li>
              ))}
            </ul>
            <figcaption className="mt-3 text-sm text-muted-foreground">{D.caption}</figcaption>
          </figure>
        </Reveal>
      </div>
      <Reveal delay={80}>
        <div className="mt-16 border-t border-border pt-8">
          <GroupTitle g={account} />
          <ul role="list" className="mt-5 grid gap-x-12 sm:grid-cols-2">
            {account.kept.map((item) => (
              <li key={item} className="border-t border-border py-3 text-[15px] leading-relaxed tabular-nums text-foreground">{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            <span className="mr-2 font-medium text-foreground">{DATA.neverLabel}</span>
            {account.never.join(' · ')}
          </p>
        </div>
      </Reveal>
      <NotUsed className="mt-12" />
    </Section>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* G: chips                                                                                                           */
/* ---------------------------------------------------------------------------------------------------------------- */

function ChipGroup({ g }: { g: Group }) {
  return (
    <div className="border-t border-border pt-7">
      <GroupTitle g={g} />
      <ul role="list" aria-label={DATA.keptLabel} className="mt-6 flex flex-wrap gap-2.5">
        {g.kept.map((item) => (
          <li key={item} className="inline-flex items-start gap-2.5 border border-primary/45 px-3.5 py-2 text-[15px] leading-snug tabular-nums text-foreground">
            <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
      <ul role="list" aria-label={DATA.neverLabel} className="mt-4 flex flex-wrap gap-2.5">
        {g.never.map((item) => (
          <li key={item} className="inline-flex items-center gap-2 border border-border px-3.5 py-2 text-[15px] leading-snug text-muted-foreground line-through decoration-muted-foreground/60">
            <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DataG() {
  return (
    <Section id={DATA.id} eyebrow={DATA.eyebrow} title={DATA.title} lead={DATA.lead}>
      <div className="space-y-12">
        {DATA.groups.map((g, i) => (
          <Reveal key={g.key} delay={i * 80}>
            <ChipGroup g={g} />
          </Reveal>
        ))}
      </div>
      <NotUsed />
    </Section>
  )
}
