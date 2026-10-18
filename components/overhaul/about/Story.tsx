/**
 * Round 4 (mock, 17-10-2026) — About page, "story" block (why we exist). Layout options over the same STORY copy
 * (content.ts, ruled wording — rendered verbatim, never reworded here).
 *
 * A — typographic: the three sentences as one large statement, no proofs.
 * B — story left, the four proofs right as a ruled, linked list (mirrors HomeFaq's divide-y device).
 * C — two-cell contrast: a muted "the policy" cell beside a "how it's built" cell that lists the proofs.
 * D — Round 4b (colour): story left as in A; right, "the stack" — the same four proofs, each row fronted by a
 *     44px tile holding its mark(s) in colour (the Ciphera icon, an envelope, the two Swiss providers' brand
 *     marks from brand-marks.ts filled with RuleStepper.tsx's BRAND_HEX, GitHub in white). The tile's border
 *     lights orange on hover, like the home "How we build" stepper's reached tiles.
 */
import Image from 'next/image'
import { ArrowRight, EnvelopeSimple, GithubLogo } from '@phosphor-icons/react/dist/ssr'
import { authIcon } from '@/lib/images'
import { Section } from '../home/Section'
import { Reveal } from '../home/Reveal'
import { INFRA_MARKS } from '../brand-marks'
import { STORY } from './content'

// Simple Icons' brand colours for the two Swiss providers — the same values as RuleStepper.tsx's BRAND_HEX
// (kept local rather than imported: that file is a 'use client' stepper with unrelated state).
const BRAND_HEX: Record<string, string> = { exoscale: '#DA291C', infomaniak: '#0098FF' }

export function StoryA() {
  return (
    <Section id="story" eyebrow={STORY.eyebrow} title={STORY.title}>
      <Reveal>
        <p className="max-w-4xl font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
          <span className="text-muted-foreground">{STORY.body[0]} </span>
          <span className="text-foreground">
            {STORY.body.slice(1).join(' ')}
          </span>
        </p>
      </Reveal>
    </Section>
  )
}

export function StoryB() {
  return (
    <Section id="story" eyebrow={STORY.eyebrow} title={STORY.title}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
        <Reveal>
          <div className="max-w-xl space-y-5">
            {STORY.body.map((s, i) => (
              <p key={s} className={i === 0 ? 'text-lg leading-relaxed text-muted-foreground' : 'text-lg leading-relaxed text-foreground'}>
                {s}
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={90}>
          <div className="divide-y divide-border border-y border-border">
            {STORY.proofs.map((p) => (
              <a key={p.label} href={p.href} className="group flex items-center justify-between gap-6 px-4 py-5 transition-colors duration-150 hover:bg-card">
                <span className="min-w-0">
                  <span className="block text-[15px] font-medium text-foreground">{p.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{p.detail}</span>
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

export function StoryC() {
  return (
    <Section id="story" eyebrow={STORY.eyebrow} title={STORY.title}>
      <Reveal>
        <div className="grid gap-px border border-border bg-border lg:grid-cols-2">
          <div className="bg-background p-7 sm:p-10">
            <p className="text-xs text-muted-foreground">{STORY.contrast.policy}</p>
            <p className="mt-4 max-w-md text-xl leading-relaxed text-muted-foreground">{STORY.body[0]}</p>
          </div>
          <div className="bg-background p-7 sm:p-10">
            <p className="text-xs text-primary">{STORY.contrast.built}</p>
            {/* Every sentence after the first, verbatim; the list below shows what they name. */}
            {STORY.body.slice(1).map((s) => (
              <p key={s} className="mt-4 max-w-md text-[15px] leading-relaxed text-foreground">{s}</p>
            ))}
            <ul className="mt-6 space-y-3 border-t border-border pt-6">
              {STORY.proofs.map((p) => (
                <li key={p.label} className="border-t border-border pt-3 text-[15px] leading-relaxed text-foreground first:border-t-0 first:pt-0">
                  {p.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

export function StoryD() {
  return (
    <Section id="story" eyebrow={STORY.eyebrow} title={STORY.title}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
        <Reveal>
          <p className="max-w-xl font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
            <span className="text-muted-foreground">{STORY.body[0]} </span>
            <span className="text-foreground">{STORY.body.slice(1).join(' ')}</span>
          </p>
        </Reveal>
        <Reveal delay={90}>
          <div className="divide-y divide-border border-y border-border">
            {STORY.proofs.map((p) => (
              <a
                key={p.label}
                href={p.href}
                className="group flex items-center gap-5 px-4 py-5 transition-colors duration-150 hover:bg-card"
              >
                <StackTile marks={p.marks} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium text-foreground">{p.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{p.detail}</span>
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

/** One 44px square tile per "stack" row, holding its mark(s) in colour. Its border lights orange on row hover. */
function StackTile({ marks }: { marks: string[] }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center gap-1.5 border border-border bg-card transition-colors duration-150 group-hover:border-primary">
      {marks.map((m) => (
        <StackMark key={m} mark={m} />
      ))}
    </span>
  )
}

function StackMark({ mark }: { mark: string }) {
  // The Ciphera ID logo (file 2375 × 2308), sized by max-h/max-w so the box never stretches it.
  if (mark === 'ciphera-id') return <Image src={authIcon} alt="" width={20} height={19} unoptimized className="max-h-5 max-w-5 h-auto w-auto" />
  if (mark === 'mail') return <EnvelopeSimple className="h-5 w-5 text-foreground" aria-hidden="true" />
  if (mark === 'github') return <GithubLogo className="h-5 w-5 text-foreground" aria-hidden="true" />
  const infra = INFRA_MARKS.find((i) => i.key === mark)
  if (!infra) return null
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0" fill={BRAND_HEX[infra.key]}>
      <path d={infra.path} />
    </svg>
  )
}
