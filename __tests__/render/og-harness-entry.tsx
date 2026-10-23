// The OG card system's render proof (D52, 19-10-2026): bundled by esbuild and run by __tests__/og-render.render.mjs,
// which asserts on the JSON this prints. It draws with next/og itself, so it measures what the route will serve.
import type { ReactElement } from 'react'
import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { decodePng, decodePngAlpha } from '../../lib/og/png'
import { DOT_BASELINE, DOT_LINE_HEIGHT, DOT_SIZE } from '../../lib/og/dots'
import { TITLE, wrapLead, wrapTitle } from '../../lib/og/layout'
import { SATORI_BASELINE, renderCard, renderCover, titleDots } from '../../lib/og/render'
import { cardHash, cardPath, coverHash, coverPath, hasSystemCard, parseCardFile } from '../../lib/og/url'

const semibold = readFileSync('lib/og/fonts/Geist-SemiBold.ttf')
const fonts = [{ name: 'Geist', data: semibold, weight: 600 as const, style: 'normal' as const }]
const GLYPH = { fontFamily: 'Geist', fontWeight: 600, fontSize: DOT_SIZE, lineHeight: DOT_LINE_HEIGHT, color: '#fff' } as const

async function alphaOf(node: ReactElement, width: number, height: number) {
  return decodePngAlpha(new Uint8Array(await new ImageResponse(node, { width, height, fonts }).arrayBuffer()))
}

/** Gaps wider than a letter's own spacing between runs of inked columns: the word gaps. */
function wordGaps({ width, height, alpha }: { width: number; height: number; alpha: Uint8Array }): number[] {
  const inked = Array.from({ length: width }, (_, x) => {
    for (let y = 0; y < height; y++) if (alpha[y * width + x] > 60) return true
    return false
  })
  const runs: [number, number][] = []
  for (let x = 0; x < width; x++) {
    if (inked[x] && !inked[x - 1]) runs.push([x, x])
    else if (inked[x] && runs.length) runs[runs.length - 1][1] = x
  }
  return runs.slice(1).map((r, i) => r[0] - runs[i][1]).filter((g) => g > 14)
}

async function main() {
  // 1. Where Satori puts a 100 px Geist SemiBold glyph's baseline in a node at top 0: the row under the H's bottom edge.
  const h = await alphaOf(<div style={{ display: 'flex', position: 'relative', width: 200, height: 130 }}><div style={{ ...GLYPH, position: 'absolute', left: 10, top: 0 }}>H</div></div>, 200, 130)
  let bottom = -1
  for (let y = 0; y < h.height; y++) for (let x = 0; x < h.width; x++) if (h.alpha[y * h.width + x] > 128) bottom = y

  // 2. Word gaps of one line, set by lib/og/layout.ts and drawn glyph by glyph (unstroked, as Chrome measured them),
  //    and the same line set by next/og's own text layout (the control).
  const line = 'How to Migrate Off'
  const placed = TITLE.place(line)
  const ours = await alphaOf(
    <div style={{ display: 'flex', position: 'relative', width: 1100, height: 120 }}>
      {placed.glyphs.map((g, i) => <div key={i} style={{ ...GLYPH, position: 'absolute', left: g.x, top: DOT_BASELINE - SATORI_BASELINE }}>{g.char}</div>)}
    </div>, 1100, 120)
  const theirs = await alphaOf(
    <div style={{ display: 'flex', width: 1100, height: 120 }}><div style={{ ...GLYPH, display: 'flex', letterSpacing: TITLE.letterSpacing }}>{line}</div></div>, 1100, 120)

  // 3. Cards.
  const card = { label: 'Company', title: 'About Ciphera', lead: 'We are a small software company in Belgium.' }
  const png = new Uint8Array(await renderCard(card))
  const view = new DataView(png.buffer)
  const metrics = await titleDots('Privacy policy')
  const fallback = await titleDots('Hello 👋 world')

  // 4. The cover: the card's pixels, at the card's size, on the card's ground. Every byte of the cover's middle is
  //    compared with the card, and every byte outside it with the ground (#0a0a0a, opaque).
  const coverPng = new Uint8Array(await renderCover(card))
  const c = decodePng(coverPng)
  const k = decodePng(png)
  const left = (c.width - k.width) / 2
  let middleDiff = 0
  let groundDiff = 0
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      const at = (y * c.width + x) * c.channels
      const inCard = x >= left && x < left + k.width && y < k.height
      for (let ch = 0; ch < Math.min(c.channels, 3); ch++) {
        if (inCard) middleDiff = Math.max(middleDiff, Math.abs(c.pixels[at + ch] - k.pixels[(y * k.width + x - left) * k.channels + ch]))
        else groundDiff = Math.max(groundDiff, Math.abs(c.pixels[at + ch] - 10))
      }
    }
  }

  console.log(JSON.stringify({
    baselineBottomRow: bottom,
    satoriBaseline: SATORI_BASELINE,
    gaps: { ours: wordGaps(ours), theirs: wordGaps(theirs) },
    wrap: {
      post: wrapTitle('How to Migrate Off Google Analytics: A 2026 Guide'),
      shortWord: wrapTitle('Cookie banners are not a requirement for analytics in a 2026 world'),
      period: wrapTitle('About Ciphera.'),
      lead: wrapLead('We are a small software company in Belgium.'),
    },
    card: { signature: Array.from(png.slice(0, 8)), width: view.getUint32(16), height: view.getUint32(20), bytes: png.length },
    cover: { width: c.width, height: c.height, cardChannels: k.channels, coverChannels: c.channels, middleDiff, groundDiff, left },
    titleDots: { metrics: { layout: metrics.layout, lines: metrics.lines, dots: metrics.dots }, fallback: { layout: fallback.layout, lines: fallback.lines, dots: fallback.dots } },
    url: {
      page: cardPath('page', 'about', card),
      learn: cardPath('learn', 'pulse~core-web-vitals', { label: 'Learn', title: 'Core Web Vitals' }),
      parsed: [
        parseCardFile(cardPath('page', 'about', card).slice(4)),
        parseCardFile('learn--pulse~core-web-vitals--0123456789ab.png'),
        parseCardFile('page--About--0123456789ab.png'),
        parseCardFile('page--..--0123456789ab.png'),
        parseCardFile('page--about--0123456789ab.jpg'),
        parseCardFile('nope--about--0123456789ab.png'),
      ],
      hashChangesWithWords: cardHash(card) !== cardHash({ ...card, title: 'About Ciphera BV' }),
      cover: coverPath('post', 'privacy-tools', card),
      coverParsed: [
        parseCardFile(coverPath('post', 'privacy-tools', card).slice(4)),
        parseCardFile('post--privacy-tools--0123456789ab--cover.jpg'),
        parseCardFile('post--privacy-tools--0123456789ab--covers.png'),
      ],
      coverHashIsItsOwn: coverHash(card) !== cardHash(card),
      coverHashChangesWithWords: coverHash(card) !== coverHash({ ...card, title: 'About Ciphera BV' }),
      systemCard: [hasSystemCard('/og/page--about--0123456789ab.png'), hasSystemCard([{ url: '/og/x.png' }]), hasSystemCard([{ url: 'https://cdn.ciphera.net/website/og/trust.png' }]), hasSystemCard(undefined)],
    },
  }))
}
main()
