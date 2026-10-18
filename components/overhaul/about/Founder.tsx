/**
 * Round 4 (mock, 17-10-2026): the About page's "founder" block (D18, outline A), options A/B/C/D. All four read the
 * SAME copy from content.ts (FOUNDER) and differ only in layout/device, per the round's brief:
 *   A — a bordered card: text left, the portrait right (~18rem wide), the idiom app/about/page.tsx already uses.
 *   B — portrait left (4:5 crop, ~280-320px), the name set very large beside it, open (no card).
 *   C — compact and minimal: a small square portrait in one row with name/role/links, the bio as one continuous line.
 *   D — Round 4b (17-10): B's layout at the photo's own 552:579 ratio. Until 19-10 the portrait assembled from the
 *       footer wordmark's dots before the photo showed; the owner removed that animation with the new photo (19-10:
 *       "lets get rid of the dot assembly animation"), so D now shows the photograph at once.
 * The only photograph on the page: FOUNDER.photoSrc (the owner's photo of 19-10, graded black and white, 552 × 579),
 * never shown wider than 276 CSS px (half its width, sharp on 2x screens).
 */
import Image from 'next/image'
import { EnvelopeSimple, GithubLogo, LinkedinLogo } from '@phosphor-icons/react/dist/ssr'
import type { IconProps } from '@phosphor-icons/react'
import type { ComponentType } from 'react'
import { Section } from '@/components/overhaul/home/Section'
import { FOUNDER } from './content'

const LINK_ICON: Record<string, ComponentType<IconProps>> = {
  LinkedIn: LinkedinLogo,
  GitHub: GithubLogo,
  Email: EnvelopeSimple,
}

// The three links every option shows: FOUNDER.links (LinkedIn, GitHub) plus the email, as a mailto, last.
const ALL_LINKS = [...FOUNDER.links, { label: 'Email', href: `mailto:${FOUNDER.email}`, text: FOUNDER.email }]

/** A — bordered card: text left, portrait right (~18rem / 288px). */
export function FounderA() {
  return (
    <Section id="founder" eyebrow={FOUNDER.eyebrow} title={FOUNDER.title}>
      <div className="overflow-hidden border border-border">
        <div className="grid sm:grid-cols-[1fr_minmax(0,18rem)]">
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{FOUNDER.name}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{FOUNDER.role}</p>
            <div className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
              {FOUNDER.bio.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              {ALL_LINKS.map((link) => {
                const Icon = LINK_ICON[link.label]
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="inline-flex items-center gap-1.5 text-sm text-foreground transition-colors duration-150 hover:text-primary"
                  >
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                    {'text' in link ? link.text : link.label}
                  </a>
                )
              })}
            </div>
          </div>
          <div className="relative order-first min-h-[280px] border-b border-border sm:order-last sm:min-h-0 sm:border-b-0 sm:border-l">
            <Image
              src={FOUNDER.photoSrc}
              alt={FOUNDER.photoAlt}
              fill
              unoptimized
              sizes="(min-width: 640px) 18rem, 100vw"
              className="object-cover object-[center_20%]"
            />
          </div>
        </div>
      </div>
    </Section>
  )
}

/** B — portrait left (4:5 crop, ~280-320px), name set very large beside it. Open: no card, no bordered block. */
export function FounderB() {
  return (
    <Section id="founder" eyebrow={FOUNDER.eyebrow} title={FOUNDER.title}>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="relative aspect-[552/579] w-[240px] shrink-0 overflow-hidden border border-border sm:w-[264px] lg:w-[276px]">
          <Image
            src={FOUNDER.photoSrc}
            alt={FOUNDER.photoAlt}
            fill
            unoptimized
            sizes="(min-width: 1024px) 276px, (min-width: 640px) 264px, 240px"
            className="object-cover object-[center_20%]"
          />
        </div>
        <div className="flex-1 pt-1">
          <h3 className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-foreground sm:text-6xl">
            {FOUNDER.name}
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">{FOUNDER.role}</p>
          <div className="mt-6 max-w-md space-y-2 text-[15px] leading-relaxed text-muted-foreground">
            {FOUNDER.bio.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
            {ALL_LINKS.map((link) => {
              const Icon = LINK_ICON[link.label]
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="inline-flex items-center gap-1.5 text-sm text-foreground transition-colors duration-150 hover:text-primary"
                >
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                  {'text' in link ? link.text : link.label}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </Section>
  )
}

/** C — compact and minimal: a small square portrait (~96px) in one row with name/role/links; the bio as one
 *  continuous line underneath. No card, no borders around text — the row and the single line of bio are the
 *  whole device. */
export function FounderC() {
  const bioLine = FOUNDER.bio.join(' ')
  return (
    <Section id="founder" eyebrow={FOUNDER.eyebrow} title={FOUNDER.title}>
      <div className="max-w-xl">
        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-border">
            <Image src={FOUNDER.photoSrc} alt={FOUNDER.photoAlt} fill unoptimized sizes="96px" className="object-cover object-[center_20%]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">{FOUNDER.name}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{FOUNDER.role}</p>
          </div>
          <div className="ml-auto flex items-center gap-4 pt-1 sm:pt-0">
            {ALL_LINKS.map((link) => {
              const Icon = LINK_ICON[link.label]
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  aria-label={link.label}
                  className="text-muted-foreground transition-colors duration-150 hover:text-primary"
                >
                  {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : <span className="text-sm">{link.label}</span>}
                </a>
              )
            })}
          </div>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{bioLine}</p>
      </div>
    </Section>
  )
}

/** D — B's layout (portrait left, the name set very large beside it, open — no card), at the photo's own 552:579
 *  ratio rather than B's 4:5 crop, same widths as B. The photograph shows at once (19-10: no dot animation). */
export function FounderD() {
  return (
    <Section id="founder" eyebrow={FOUNDER.eyebrow} title={FOUNDER.title}>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="relative aspect-[552/579] w-[240px] shrink-0 overflow-hidden border border-border sm:w-[264px] lg:w-[276px]">
          <Image src={FOUNDER.photoSrc} alt={FOUNDER.photoAlt} fill unoptimized sizes="276px" className="object-cover" />
        </div>
        <div className="flex-1 pt-1">
          <h3 className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-foreground sm:text-6xl">
            {FOUNDER.name}
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">{FOUNDER.role}</p>
          <div className="mt-6 max-w-md space-y-2 text-[15px] leading-relaxed text-muted-foreground">
            {FOUNDER.bio.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
            {ALL_LINKS.map((link) => {
              const Icon = LINK_ICON[link.label]
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="inline-flex items-center gap-1.5 text-sm text-foreground transition-colors duration-150 hover:text-primary"
                >
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                  {'text' in link ? link.text : link.label}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </Section>
  )
}
