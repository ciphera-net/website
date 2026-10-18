/**
 * Round 3 (mock) · Option C — "Name wordmark": the footer closes on the company name set as a
 * giant display glyph that the footer's own bottom edge crops, a closing device borrowed from
 * today's footer's typographic signature but pushed to full scale and tinted almost to nothing
 * (text-foreground/[0.07]) so it reads as texture, not a second headline.
 * Content: tagline/blurb/status sit left as "who we are", all four link groups sit right as
 * "where to go" — the two halves of the footer's job side by side above the wordmark.
 * Round 3b (owner: "i like C but we need to implement the wordmark in a cooler way"): `wordmark` picks the treatment,
 * flat (C) · dots (C1) · spotlight (C2) · world (C3); geometry is shared in wordmark-geom.ts.
 */
import Image from 'next/image'
import { cipheraIcon } from '@/lib/images'
import {
  BLURB,
  COMPANY_LINE,
  FooterAnchor,
  FooterStatus,
  GROUPS,
  SocialRow,
  TAGLINE_LINES,
} from './footer-data'
import { WM } from './wordmark-geom'
import { WordmarkLive } from './WordmarkLive'
import { WordmarkWorld } from './WordmarkWorld'

export async function FooterC({
  wordmark = 'flat',
  accent = 'none',
}: { wordmark?: 'flat' | 'dots' | 'spotlight' | 'world' | 'cursor' | 'twinkle' | 'assemble'; accent?: 'none' | 'tittle' | 'embers' | 'flight' } = {}) {
  return (
    <footer data-mock-footer="" className="relative ml-[calc(50%-50vw)] w-screen border-t border-border">
      <div className="mx-auto w-full max-w-6xl sm:border-x sm:border-border">
        <div className="grid gap-12 px-6 pt-16 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:pt-20">
          {/* Left: who we are */}
          <div>
            <div className="flex items-center gap-2">
              <Image src={cipheraIcon} alt="" width={27} height={28} unoptimized className="h-7 w-auto" />
              <span className="font-display text-lg font-semibold tracking-tight text-foreground">Ciphera</span>
            </div>
            <p className="mt-8 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-4xl">
              {TAGLINE_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">{BLURB}</p>
            <FooterStatus className="mt-6" />
          </div>

          {/* Right: where to go */}
          <nav aria-label="Footer">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              {GROUPS.map((group) => (
                <div key={group.label}>
                  <h2 className="text-xs text-muted-foreground">{group.label}</h2>
                  <ul className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <FooterAnchor link={item} className="inline-block py-1 text-sm text-foreground/80" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Meta row */}
        <div className="flex flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="text-xs text-muted-foreground">{COMPANY_LINE}</p>
          <SocialRow />
        </div>

        {/* Wordmark, last — cropped by the footer's own bottom edge. Fill only, never stroke
            (see the current footer's signature comment: Geist's self-intersecting outlines show
            visible seams under a stroke). No logo here — the lockup above already carries one. Sized from the
            rendered width (16-10): at 380 the word was 1,326 units wide and lost its last letters; at 318 it spans the
            rail, and the 200-unit viewBox crops the bottom quarter of the letters. */}
        <div aria-hidden="true" className="overflow-hidden px-6 sm:px-10">
          {wordmark === 'world' ? (
            <WordmarkWorld />
          ) : wordmark !== 'flat' ? (
            <WordmarkLive variant={wordmark} accent={accent} />
          ) : (
            <svg viewBox={`0 0 ${WM.w} ${WM.h}`} className="-mb-px block h-auto w-full select-none text-foreground/[0.07]">
              <text x={WM.x} y={WM.y} fontSize={WM.size} fontWeight={600} letterSpacing={WM.spacing} fill="currentColor" className="font-display">
                {WM.word}
              </text>
            </svg>
          )}
        </div>
      </div>
    </footer>
  )
}
