import type { ReactElement } from 'react'
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { COVER_HEIGHT, COVER_WIDTH, OG_HEIGHT, OG_WIDTH, type OgBrand, type OgCard } from './spec'
import { decodePngAlpha } from './png'
import {
  DOT_BASELINE,
  DOT_LINE,
  DOT_LINE_HEIGHT,
  DOT_MAX_LINES,
  DOT_SIZE,
  DOT_WIDTH,
  DOT_WRAP_WIDTH,
  countLines,
  dotBoxHeight,
  dotsSvg,
  fullStop,
  inkEnd,
  sampleDots,
  titleText,
} from './dots'
import { LABEL, LEAD, LEAD_LINE_HEIGHT, LEAD_WIDTH, TITLE, wrapLead, wrapTitle } from './layout'

/**
 * Draws one OG card (D52, "D, at one size"; plan §5l). Two renders with next/og: the title alone, white on transparent,
 * whose alpha is sampled into dots exactly as the approved mock's DotText sampled its canvas; then the card, with those
 * dots as an SVG image beside the lockup, the label and the lead, at the mock's positions.
 *
 * 🔑 The title and the lead are set by lib/og/layout.ts and drawn one glyph at a time at the positions it gives:
 * next/og's own text layout places each word by its letters' UNKERNED widths but draws it kerned, which left a gap after
 * every word as wide as its kerning ("Migrate  Off"). The title's baselines are where the mock's canvas put them
 * (DOT_BASELINE, then one per line height); Satori draws a 100 px Geist SemiBold glyph with line height 1.02 with its
 * baseline 86 px below the node's top (measured; __tests__/og-render.render.mjs pins it), so each node is lifted by the
 * difference. The lead was a paragraph in the mock, so its glyphs sit in ordinary line boxes.
 */
export const SATORI_BASELINE = 86

const BG = '#0a0a0a'
const FG = '#f4f4f4'
const MUTED = '#8a8a8a'
const ORANGE = '#FD5E0F'

// The mock was drawn by Chrome on a Mac, whose text rendering is heavier than next/og's geometric one: unstroked, every
// approved title came out 3.5 to 6.7 % short of dots. A 1 px stroke (half a pixel outward) matches the eight approved
// titles to within 0.5 % on average and 3 % at most (docs/data/19-10-2026-og-system-build/calibrate-stroke.out).
const TITLE_GLYPH = { fontFamily: 'Geist', fontWeight: 600, fontSize: DOT_SIZE, lineHeight: DOT_LINE_HEIGHT, color: '#fff', WebkitTextStrokeWidth: 1, WebkitTextStrokeColor: '#fff' } as const
const LEAD_TEXT = { fontFamily: 'Geist', fontWeight: 400, fontSize: LEAD.size, lineHeight: LEAD_LINE_HEIGHT, color: MUTED } as const
const LEAD_LINE = LEAD.size * LEAD_LINE_HEIGHT

type Fonts = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>['fonts']
type Icon = { src: string; width: number }
type Assets = { fonts: Fonts; icons: Record<OgBrand, Icon> }
let assets: Promise<Assets> | null = null

/** Each brand's lockup: its mark (34 px tall, as the mock set Ciphera's) and its name, as its own site's header has it. */
const LOCKUP: Record<OgBrand, { file: string; type: string; width: number; height: number; name: string }> = {
  // The icon file is 1207 x 1272.
  ciphera: { file: 'public/ciphera_icon.png', type: 'image/png', width: 1207, height: 1272, name: 'Ciphera' },
  // The brand library's master (Public/brand masters/pulse-icon.svg), 885.47 x 1314.02; pulse.ciphera.net's header
  // sets it beside "Pulse".
  pulse: { file: 'lib/og/brand/pulse-icon.svg', type: 'image/svg+xml', width: 885.47, height: 1314.02, name: 'Pulse' },
}
const ICON_HEIGHT = 34

/**
 * The fonts (vendored, OFL; traced into the build by next.config.ts) and the lockups' icons (public/ and lib/og/brand/,
 * which the image ships), read once per process on the first card, never at import: a server's first request must stay
 * cheap (website#146). A failed read is not kept, so the next request tries again.
 */
function loadAssets(): Promise<Assets> {
  if (assets) return assets
  const loading = (async (): Promise<Assets> => {
    const root = process.cwd()
    const brands = Object.keys(LOCKUP) as OgBrand[]
    const [semibold, regular, ...icons] = await Promise.all([
      readFile(path.join(root, 'lib/og/fonts/Geist-SemiBold.ttf')),
      readFile(path.join(root, 'lib/og/fonts/Geist-Regular.ttf')),
      ...brands.map((b) => readFile(path.join(root, LOCKUP[b].file))),
    ])
    return {
      fonts: [
        { name: 'Geist', data: semibold, weight: 600, style: 'normal' },
        { name: 'Geist', data: regular, weight: 400, style: 'normal' },
      ],
      icons: Object.fromEntries(
        brands.map((b, i) => [b, { src: `data:${LOCKUP[b].type};base64,${icons[i].toString('base64')}`, width: (ICON_HEIGHT * LOCKUP[b].width) / LOCKUP[b].height }]),
      ) as Record<OgBrand, Icon>,
    }
  })()
  assets = loading
  loading.catch(() => {
    if (assets === loading) assets = null
  })
  return loading
}

/** The title as dots: the SVG, its box height (the mock's DotText box for that many lines), the line and dot counts. */
export async function titleDots(title: string): Promise<{ svg: string; height: number; lines: number; dots: number; layout: 'metrics' | 'renderer' }> {
  const { fonts } = await loadAssets()
  const draw = async (node: ReactElement, height: number) =>
    decodePngAlpha(new Uint8Array(await new ImageResponse(node, { width: DOT_WIDTH, height, fonts }).arrayBuffer()))

  if (TITLE.has(title)) {
    const lines = wrapTitle(title).map(TITLE.place)
    const box = dotBoxHeight(lines.length)
    const { width, alpha } = await draw(
      <div style={{ display: 'flex', position: 'relative', width: DOT_WIDTH, height: box }}>
        {lines.flatMap((line, i) =>
          line.glyphs.map((g, k) => (
            <div key={`${i}-${k}`} style={{ ...TITLE_GLYPH, position: 'absolute', left: g.x, top: DOT_BASELINE + i * DOT_LINE - SATORI_BASELINE }}>
              {g.char}
            </div>
          )),
        )}
      </div>,
      box,
    )
    const last = lines[lines.length - 1]
    const dots = [...sampleDots(alpha, width, box), ...fullStop(last.end, DOT_BASELINE + (lines.length - 1) * DOT_LINE)]
    return { svg: dotsSvg(dots, DOT_WIDTH, box), height: box, lines: lines.length, dots: dots.length, layout: 'metrics' }
  }

  // A character outside the metrics table (an emoji, a script the site does not write in): the renderer's own text
  // layout sets the title, with its uneven word spacing, rather than no card at all.
  const tall = dotBoxHeight(DOT_MAX_LINES)
  const { width, height, alpha } = await draw(
    <div style={{ display: 'flex', width: DOT_WIDTH, height: tall }}>
      <div style={{ ...TITLE_GLYPH, display: 'flex', marginTop: DOT_BASELINE - SATORI_BASELINE, width: DOT_WRAP_WIDTH, letterSpacing: TITLE.letterSpacing }}>
        {titleText(title)}
      </div>
    </div>,
    tall,
  )
  const lines = countLines(alpha, width, height)
  if (lines === 0) throw new Error(`og: the title rendered no ink (${JSON.stringify(title)})`)
  const box = dotBoxHeight(lines)
  const base = DOT_BASELINE + (lines - 1) * DOT_LINE
  const dots = [...sampleDots(alpha.subarray(0, width * box), width, box), ...fullStop(inkEnd(alpha, width, height, base), base)]
  return { svg: dotsSvg(dots, DOT_WIDTH, box), height: box, lines, dots: dots.length, layout: 'renderer' }
}

/** The lead, set glyph by glyph when the metrics cover it, else by the renderer. */
function Lead({ text }: { text: string }) {
  if (!LEAD.has(text)) {
    return <div style={{ ...LEAD_TEXT, display: 'flex', marginTop: 22, maxWidth: LEAD_WIDTH, letterSpacing: LEAD.letterSpacing }}>{text}</div>
  }
  const lines = wrapLead(text).map(LEAD.place)
  return (
    <div style={{ display: 'flex', position: 'relative', marginTop: 22, width: LEAD_WIDTH, height: lines.length * LEAD_LINE }}>
      {lines.flatMap((line, i) =>
        line.glyphs.map((g, k) => (
          <div key={`${i}-${k}`} style={{ ...LEAD_TEXT, position: 'absolute', left: g.x, top: i * LEAD_LINE }}>
            {g.char}
          </div>
        )),
      )}
    </div>
  )
}

/** The card, as the PNG the route serves. */
export async function renderCard(card: OgCard): Promise<ArrayBuffer> {
  const { fonts, icons } = await loadAssets()
  const brand = card.brand ?? 'ciphera'
  const icon = icons[brand]
  const title = await titleDots(card.title)
  const dotsUrl = `data:image/svg+xml;base64,${Buffer.from(title.svg).toString('base64')}`
  const res = new ImageResponse(
    (
      <div style={{ display: 'flex', position: 'relative', width: OG_WIDTH, height: OG_HEIGHT, background: BG, fontFamily: 'Geist' }}>
        {/* Line height 1.5, the page's own, which the mock's lockup and label inherited: it sets the rows' height and so
            where the icon and the square sit beside the words. */}
        <div style={{ position: 'absolute', left: 64, top: 52, display: 'flex', alignItems: 'center', gap: 12, lineHeight: 1.5 }}>
          <img src={icon.src} width={icon.width} height={ICON_HEIGHT} alt="" />
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.9, color: FG }}>{LOCKUP[brand].name}</div>
        </div>
        {card.label ? (
          <div style={{ position: 'absolute', right: 64, top: 60, display: 'flex', alignItems: 'center', gap: 12, fontSize: LABEL.size, fontWeight: 400, lineHeight: 1.5, letterSpacing: LABEL.letterSpacing, color: MUTED }}>
            <div style={{ width: 11, height: 11, background: ORANGE }} />
            {/* The kerned width, so the right-aligned word ends at the margin (the renderer's own box is unkerned). */}
            <div style={LABEL.has(card.label) ? { display: 'flex', width: LABEL.width(card.label) } : { display: 'flex' }}>{card.label}</div>
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: 60, right: 40, top: 120, bottom: 56, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <img src={dotsUrl} width={DOT_WIDTH} height={title.height} alt="" />
          {card.lead ? <Lead text={card.lead} /> : null}
        </div>
      </div>
    ),
    { width: OG_WIDTH, height: OG_HEIGHT, fonts },
  )
  return res.arrayBuffer()
}

/**
 * The card's cover (lib/og/spec.ts): the card's own PNG, drawn at its own size on the card's ground, so its pixels are
 * the card's (the render test compares them) and only the ground widens. Every edge of a card is that ground, so the
 * join cannot show.
 */
export async function renderCover(card: OgCard): Promise<ArrayBuffer> {
  const [{ fonts }, png] = await Promise.all([loadAssets(), renderCard(card)])
  const src = `data:image/png;base64,${Buffer.from(png).toString('base64')}`
  const res = new ImageResponse(
    (
      <div style={{ display: 'flex', position: 'relative', width: COVER_WIDTH, height: COVER_HEIGHT, background: BG }}>
        <img src={src} width={OG_WIDTH} height={OG_HEIGHT} alt="" style={{ position: 'absolute', left: (COVER_WIDTH - OG_WIDTH) / 2, top: (COVER_HEIGHT - OG_HEIGHT) / 2 }} />
      </div>
    ),
    { width: COVER_WIDTH, height: COVER_HEIGHT, fonts },
  )
  return res.arrayBuffer()
}
