/**
 * Footer — Option A, "Ledger" (mock, 16-10): text-led, pure Facet, no large decorative type. The
 * tagline stands as the footer's own headline instead of a wordmark graphic; the four link groups
 * read as a bordered ledger — vertical and horizontal hairlines do all the separating, no colour
 * anywhere except the status dot. Content is entirely footer-data.tsx; this file only lays it out.
 */
import Image from 'next/image'
import { cipheraIcon } from '@/lib/images'
import { cn } from '@/lib/utils'
import {
  BLURB,
  COMPANY_LINE,
  FooterAnchor,
  FooterStatus,
  GROUPS,
  SocialRow,
  TAGLINE_LINES,
} from './footer-data'

/**
 * Vertical hairlines separate columns; on phones the ledger is a 2x2 grid, so the left column of
 * each row (0, 2) stays flush and the right column (1, 3) carries the border — at lg that maps
 * onto a single row of four, so column 2 picks up a border it didn't need on phones, and the
 * phone-only row seam (border-t on 2, 3) drops away.
 */
function cellClass(i: number) {
  return cn(
    'px-6 sm:px-10 py-10',
    i % 2 === 1 && 'border-l border-border',
    i % 2 === 0 && i > 0 && 'lg:border-l lg:border-border',
    i >= 2 && 'border-t border-border lg:border-t-0',
  )
}

export function FooterA() {
  return (
    <footer data-mock-footer="" className="relative ml-[calc(50%-50vw)] w-screen border-t border-border">
      <div className="mx-auto w-full max-w-6xl sm:border-x sm:border-border">
        {/* Top band: brand + headline tagline on the left, blurb/status/social on the right */}
        <div className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <div>
              <div className="flex items-center gap-2">
                <Image src={cipheraIcon} alt="" width={27} height={28} unoptimized className="h-7 w-auto" />
                <span className="font-display text-lg font-semibold tracking-tight text-foreground">Ciphera</span>
              </div>
              <p className="mt-6 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-4xl">
                {TAGLINE_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
            <div className="flex flex-col gap-6 lg:max-w-sm lg:justify-self-end">
              <p className="text-[15px] leading-relaxed text-muted-foreground">{BLURB}</p>
              <FooterStatus />
              <SocialRow />
            </div>
          </div>
        </div>

        {/* Link ledger: four groups, bordered into cells */}
        <nav aria-label="Footer" className="grid grid-cols-2 border-t border-border lg:grid-cols-4">
          {GROUPS.map((group, i) => (
            <div key={group.label} className={cellClass(i)}>
              <h2 className="text-xs text-muted-foreground">{group.label}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <FooterAnchor link={item} className="text-sm text-foreground/80 hover:text-foreground" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom bar */}
        <div className="border-t border-border px-6 py-6 sm:px-10">
          <p className="text-xs text-muted-foreground">{COMPANY_LINE}</p>
        </div>
      </div>
    </footer>
  )
}
