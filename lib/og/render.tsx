import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { COVER_HEIGHT, COVER_WIDTH, OG_HEIGHT, OG_WIDTH, TITLE_BOTTOM, TITLE_TOP, type OgBrand, type OgCard } from './spec'
import { decodePngAlpha } from './png'
import { DOT_BASELINE, DOT_LINE, DOT_LINE_HEIGHT, DOT_SIZE, DOT_WIDTH, dotBoxHeight, dotsSvg, fullStop, inkEnd, sampleDots } from './dots'
import { LABEL, LEAD, LEAD_LINE_HEIGHT, LEAD_WIDTH, TITLE, TITLE_ROOM, fitTitle, wrapLead } from './layout'

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
 *
 * Text with a character the font lacks (an emoji, a script it does not have) is wrapped and fitted by the same rules,
 * measured by its bound (lib/og/layout.ts), and each line is handed to next/og whole, so it can shape what it draws;
 * only the word spacing on those lines is next/og's own.
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
/** The space between the title and its lead (Lead's marginTop). */
const LEAD_GAP = 22

type Fonts = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>['fonts']
type Icon = { src: string; width: number }
let fonts: Promise<Fonts> | null = null
const icons = new Map<OgBrand, Promise<Icon>>()

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
 * The fonts (vendored, OFL; traced into the build by next.config.ts), read once per process on the first card, never at
 * import: a server's first request must stay cheap (website#146). A failed read is not kept, so the next request tries
 * again.
 */
function loadFonts(): Promise<Fonts> {
  if (fonts) return fonts
  const loading = (async (): Promise<Fonts> => {
    const root = process.cwd()
    const [semibold, regular] = await Promise.all([
      readFile(path.join(root, 'lib/og/fonts/Geist-SemiBold.ttf')),
      readFile(path.join(root, 'lib/og/fonts/Geist-Regular.ttf')),
    ])
    return [
      { name: 'Geist', data: semibold, weight: 600, style: 'normal' },
      { name: 'Geist', data: regular, weight: 400, style: 'normal' },
    ]
  })()
  fonts = loading
  loading.catch(() => {
    if (fonts === loading) fonts = null
  })
  return loading
}

/**
 * A brand's mark (public/ and lib/og/brand/, which the image ships), read the first time a card of that brand is drawn
 * and kept the same way. Per brand, so one brand's missing file fails only that brand's cards.
 */
function loadIcon(brand: OgBrand): Promise<Icon> {
  const kept = icons.get(brand)
  if (kept) return kept
  const { file, type, width, height } = LOCKUP[brand]
  const loading = readFile(path.join(process.cwd(), file)).then((data) => ({
    src: `data:${type};base64,${data.toString('base64')}`,
    width: (ICON_HEIGHT * width) / height,
  }))
  icons.set(brand, loading)
  loading.catch(() => {
    if (icons.get(brand) === loading) icons.delete(brand)
  })
  return loading
}

/**
 * The title as dots: the SVG, the height it is shown at on the card (the mock's DotText box for that many lines, times
 * the scale), the line and dot counts, how it was drawn, and the scale. `room` is the height the card leaves it
 * (lib/og/layout.ts fitTitle): a title that fits is drawn exactly as before; a longer one is drawn whole, at a smaller
 * size, on a canvas as much wider than the card's as it is smaller, and the card shows that canvas at the card's width.
 * `glyphs`: placed one glyph at a time (the font has every character); `lines`: each line set by next/og.
 */
export async function titleDots(title: string, room = TITLE_ROOM): Promise<{ svg: string; height: number; lines: number; dots: number; layout: 'glyphs' | 'lines'; scale: number }> {
  const fonts = await loadFonts()
  const fit = fitTitle(title, room)
  if (fit.lines.length === 0) throw new Error('og: the title is empty')
  const glyphs = TITLE.has(title)
  const canvas = Math.round(DOT_WIDTH / fit.scale)
  const box = dotBoxHeight(fit.lines.length)
  const top = (i: number) => DOT_BASELINE + i * DOT_LINE - SATORI_BASELINE
  const placed = glyphs ? fit.lines.map(TITLE.place) : []
  const node = (
    <div style={{ display: 'flex', position: 'relative', width: canvas, height: box }}>
      {glyphs
        ? placed.flatMap((line, i) =>
            line.glyphs.map((g, k) => (
              <div key={`${i}-${k}`} style={{ ...TITLE_GLYPH, position: 'absolute', left: g.x, top: top(i) }}>
                {g.char}
              </div>
            )),
          )
        : fit.lines.map((line, i) => (
            <div key={i} style={{ ...TITLE_GLYPH, position: 'absolute', left: 0, top: top(i), whiteSpace: 'pre', letterSpacing: TITLE.letterSpacing }}>
              {line}
            </div>
          ))}
    </div>
  )
  const { width, alpha } = decodePngAlpha(new Uint8Array(await new ImageResponse(node, { width: canvas, height: box, fonts }).arrayBuffer()))
  const base = DOT_BASELINE + (fit.lines.length - 1) * DOT_LINE
  // The orange block follows the last line: where its glyphs end, or, set by next/og, where its ink ends.
  const end = glyphs ? placed[placed.length - 1].end : inkEnd(alpha, width, box, base)
  const dots = [...sampleDots(alpha, width, box), ...fullStop(end, base)]
  return { svg: dotsSvg(dots, width, box), height: Math.round(box * fit.scale), lines: fit.lines.length, dots: dots.length, layout: glyphs ? 'glyphs' : 'lines', scale: fit.scale }
}

/** The lead, set glyph by glyph when the font has every character, else line by line by the renderer. */
function Lead({ text }: { text: string }) {
  const lines = wrapLead(text)
  return (
    <div style={{ display: 'flex', position: 'relative', marginTop: LEAD_GAP, width: LEAD_WIDTH, height: lines.length * LEAD_LINE }}>
      {LEAD.has(text)
        ? lines.map(LEAD.place).flatMap((line, i) =>
            line.glyphs.map((g, k) => (
              <div key={`${i}-${k}`} style={{ ...LEAD_TEXT, position: 'absolute', left: g.x, top: i * LEAD_LINE }}>
                {g.char}
              </div>
            )),
          )
        : lines.map((line, i) => (
            <div key={i} style={{ ...LEAD_TEXT, position: 'absolute', left: 0, top: i * LEAD_LINE, whiteSpace: 'pre', letterSpacing: LEAD.letterSpacing }}>
              {line}
            </div>
          ))}
    </div>
  )
}

/** The card, as the PNG the route serves. */
export async function renderCard(card: OgCard): Promise<ArrayBuffer> {
  const brand = card.brand ?? 'ciphera'
  const [fonts, icon] = await Promise.all([loadFonts(), loadIcon(brand)])
  // A lead below the title takes its own lines (and the gap above them) out of the title's room.
  const title = await titleDots(card.title, card.lead ? TITLE_ROOM - LEAD_GAP - wrapLead(card.lead).length * LEAD_LINE : TITLE_ROOM)
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
        <div style={{ position: 'absolute', left: 60, right: 40, top: TITLE_TOP, bottom: TITLE_BOTTOM, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
  const [fonts, png] = await Promise.all([loadFonts(), renderCard(card)])
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
