/**
 * Option B (mock) — "Tagline signature": today's footer structure kept as-is (brand cell +
 * four link columns, then a full-width typographic signature, then a bottom bar), with the
 * old "Built on privacy" wordmark replaced by the new two-line tagline. Familiar shape, new words.
 */
import Image from 'next/image'
import { cipheraIcon } from '@/lib/images'
import { TAGLINE, TAGLINE_LINES, BLURB, GROUPS, COMPANY_LINE, FooterAnchor, SocialRow, FooterStatus } from './footer-data'

export async function FooterB() {
  return (
    <footer data-mock-footer="" className="relative ml-[calc(50%-50vw)] w-screen border-t border-border">
      <div className="mx-auto w-full max-w-6xl sm:border-x sm:border-border">
        {/* Link grid: brand cell, then the four GROUPS as columns (2x2 on phones) */}
        <div className="px-6 py-16 sm:px-10">
          <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[1.7fr_1fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <Image src={cipheraIcon} alt="" width={27} height={28} unoptimized className="h-7 w-auto" />
                <span className="font-display text-lg font-semibold tracking-tight text-foreground">Ciphera</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{BLURB}</p>
              <SocialRow className="mt-6" />
            </div>

            <nav aria-label="Footer" className="lg:contents">
              <div className="grid grid-cols-2 gap-x-10 gap-y-12 lg:contents">
                {GROUPS.map((group) => (
                  <div key={group.label}>
                    <h2 className="text-xs text-muted-foreground">{group.label}</h2>
                    <ul className="mt-4 space-y-3">
                      {group.items.map((item) => (
                        <li key={item.label}>
                          <FooterAnchor link={item} className="inline-block py-1.5 text-sm text-foreground/80" />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Typographic signature — the new tagline, filled (never stroked: Geist's self-intersecting
            outlines show seams under a stroke), scaling exactly with the rail via the SVG viewBox. Sized from the
            rendered width (16-10): at 110 the first line spans ~1,097 of the 1,104-unit rail. */}
        <div className="px-6 py-6 sm:px-10">
          <svg viewBox="0 0 1104 226" className="h-auto w-full select-none text-foreground/[0.08]" aria-hidden="true">
            <text x={0} y={88} fontSize={110} fontWeight={600} letterSpacing={-3} fill="currentColor" className="font-display">
              {TAGLINE_LINES[0]}
            </text>
            <text x={0} y={198} fontSize={110} fontWeight={600} letterSpacing={-3} fill="currentColor" className="font-display">
              {TAGLINE_LINES[1]}
            </text>
          </svg>
          <p className="sr-only">{TAGLINE}</p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="text-xs text-muted-foreground">{COMPANY_LINE}</p>
          <FooterStatus />
        </div>
      </div>
    </footer>
  )
}
