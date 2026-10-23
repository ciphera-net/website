// The OG card system's render proof (D52, 19-10-2026): bundled by esbuild and run by __tests__/og-render.render.mjs,
// which asserts on the JSON this prints. It draws with next/og itself, so it measures what the route will serve.
import type { ReactElement } from 'react'
import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { decodePng, decodePngAlpha } from '../../lib/og/png'
import { DOT_BASELINE, DOT_LINE_HEIGHT, DOT_SIZE, DOT_WIDTH } from '../../lib/og/dots'
import { TITLE, TITLE_ROOM, fitTitle, wrapLead, wrapTitle } from '../../lib/og/layout'
import { SATORI_BASELINE, renderCard, renderCover, titleDots } from '../../lib/og/render'
import { cardHash, cardPath, coverHash, coverPath, hasSystemCard, parseCardFile } from '../../lib/og/url'
import { __resetContentCacheForTests, getContentIndex } from '../../lib/cms/content-client'
import { getPulsePostTitle } from '../../lib/cms/pulse-posts'

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

/**
 * The Pulse blog's loader (lib/cms/pulse-posts.ts) and the content client under it, against a fake content CDN: the
 * answers the card route turns into 200, 404 and 503, and the index cache kept per site.
 */
async function pulseLoader() {
  const realFetch = globalThis.fetch
  const asked: string[] = []
  const live = { slug: 'google-analytics-alternative', title: 'Google Analytics Alternative: Free, Cookieless, No Banner' }
  const items = { [live.slug]: `content/pulse/blog/${live.slug}.cc351e52.json`, untitled: 'content/pulse/blog/untitled.00000000.json' }
  let pulse: { status: number; body?: unknown } = { status: 200, body: { version: 1, site: 'pulse', kinds: { blog: { schema: 1, items } } } }
  const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input)
    asked.push(url)
    if (url.endsWith('/content/ciphera-net/index.json')) return json(200, { version: 1, site: 'ciphera-net', kinds: {} })
    if (url.endsWith('/content/pulse/index.json')) return pulse.body ? json(pulse.status, pulse.body) : new Response('', { status: pulse.status })
    if (url.endsWith(items[live.slug])) return json(200, live)
    if (url.endsWith(items.untitled)) return json(200, { slug: 'untitled' })
    return new Response('', { status: 404 })
  }) as typeof fetch
  const settle = (p: Promise<string | null>) => p.then((value) => ({ value }), (e: Error) => ({ error: e.message }))
  const fresh = (next: typeof pulse) => {
    __resetContentCacheForTests()
    pulse = next
  }
  try {
    __resetContentCacheForTests()
    // Both sites' indexes inside one 15 s window: each answers for its own site, and the third read is the cached one.
    const sites = [(await getContentIndex('ciphera-net'))?.site, (await getContentIndex('pulse'))?.site, (await getContentIndex('ciphera-net'))?.site]
    const indexReads = asked.filter((a) => a.endsWith('/index.json')).length
    const found = await settle(getPulsePostTitle(live.slug))
    const absent = await settle(getPulsePostTitle('no-such-post'))
    const prototype = await settle(getPulsePostTitle('constructor'))
    const untitled = await settle(getPulsePostTitle('untitled'))
    fresh({ status: 200, body: { version: 1, site: 'pulse', kinds: { blog: { schema: 2, items } } } })
    const schema = await settle(getPulsePostTitle(live.slug))
    fresh({ status: 200, body: { version: 1, site: 'pulse', kinds: {} } })
    const noBlog = await settle(getPulsePostTitle(live.slug))
    fresh({ status: 404 })
    const neverPublished = await settle(getPulsePostTitle(live.slug))
    fresh({ status: 500 })
    const down = await settle(getPulsePostTitle(live.slug))
    return { sites, indexReads, found, absent, prototype, untitled, schema, noBlog, neverPublished, down }
  } finally {
    globalThis.fetch = realFetch
    __resetContentCacheForTests()
  }
}

/**
 * Long titles (23-10-2026): a title that fits is drawn exactly as before; a longer one is drawn whole at a smaller size;
 * a word wider than a line breaks after its hyphen or slash. The titles of up to four lines are the site's own.
 */
const UP_TO_FOUR = [
  "The EU-US Data Privacy Framework Is Built on an Executive Order \u2014 and That's the Problem",
  'Do You Need a Cookie Banner for Analytics? What EU Law Actually Requires (2026)',
  'Is Your Website Analytics GDPR-Compliant? A 2026 Checklist',
  'Privacy Tools: What They Are and How to Choose',
  'How to Migrate Off Google Analytics: A 2026 Guide',
  'Google Analytics Alternative: Free, Cookieless, No Banner',
  'Privacy policy',
]
const LONG = {
  five: 'How to Migrate Off Google Analytics: A 2026 Guide for Privacy-Conscious Teams',
  six: 'Is Your Website Analytics GDPR-Compliant? A 2026 Checklist for Marketing and Legal Teams',
  pulse: 'How to Replace Google Analytics with a Cookieless Alternative Without Losing Your Reports',
  pake: 'PAKE (password-authenticated key exchange)',
  token: 'Cookie-less/GDPR-compliant analytics, explained for small teams',
  huge: 'How to Replace Google Analytics with a Cookieless, Privacy-First Alternative Without Losing Your Reports, Your Funnels, Your Goals or Your Sanity: A Complete Field Guide for 2026 and Beyond',
  cut: 'How to Replace Google Analytics with a Cookieless, Privacy-First Alternative Without Losing Your Reports, Your Funnels, Your Goals or Your Sanity: A Complete Field Guide for Teams of Every Size and Every Budget, Across Europe and Beyond, This Year and Next Year Too, Written for Busy People',
}

async function longTitles() {
  const fit = Object.fromEntries(Object.entries(LONG).map(([k, t]) => [k, fitTitle(t)]))
  const unchanged = UP_TO_FOUR.map((t) => {
    const f = fitTitle(t)
    return f.scale === 1 && !f.cut && JSON.stringify(f.lines) === JSON.stringify(wrapTitle(t))
  })
  // Every line of every fit within the width it is drawn at (the last keeps room for the orange block).
  const widths = Object.values(fit).every((f) => f.lines.every((l) => TITLE.width(l) <= DOT_WIDTH / f.scale))
  const shown = await titleDots(LONG.six)
  // The six-line card's lockup corner, against the same card with a one-word title: the title must not reach it.
  const corner = async (title: string) => {
    const { width, pixels, channels } = decodePng(new Uint8Array(await renderCard({ label: 'Blog', title })))
    const out: number[] = []
    for (let y = 40; y < TITLE_TOP_EDGE; y++) for (let x = 40; x < 600; x++) out.push(pixels[(y * width + x) * channels])
    return out
  }
  const [long, short] = await Promise.all([corner(LONG.six), corner('Privacy')])
  return {
    fit: Object.fromEntries(Object.entries(fit).map(([k, f]) => [k, { scale: f.scale, lines: f.lines, cut: f.cut }])),
    unchanged,
    widths,
    six: { height: shown.height, scale: shown.scale, room: TITLE_ROOM },
    cornerClear: long.every((v, i) => v === short[i]),
  }
}
/** The top of the title's area (lib/og/spec.ts TITLE_TOP): above it are only the lockup and the label. */
const TITLE_TOP_EDGE = 120

/**
 * Run with `--isolation` from a folder that has the fonts and Ciphera's mark but not Pulse's: a brand's missing file
 * must fail only that brand's cards.
 */
async function isolation() {
  const words = { label: 'Blog', title: 'Privacy Tools' }
  const attempt = (brand?: 'pulse') => renderCard({ ...words, brand }).then((b) => ({ bytes: b.byteLength }), (e: NodeJS.ErrnoException) => ({ error: e.code ?? e.message }))
  console.log(JSON.stringify({ ciphera: await attempt(), pulse: await attempt('pulse'), cipheraAfter: await attempt() }))
}

async function main() {
  if (process.argv.includes('--isolation')) return isolation()
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

  // 5. Brands (23-10-2026): a Pulse card is Ciphera's card with Pulse's lockup. The same words drawn for both brands
  //    differ only inside the lockup; Ciphera named explicitly is the card drawn with no brand, byte for byte.
  const words = { label: 'Blog', title: 'Google Analytics Alternative: Free, Cookieless, No Banner' }
  const plainPng = new Uint8Array(await renderCard(words))
  const namedPng = new Uint8Array(await renderCard({ ...words, brand: 'ciphera' }))
  const pulsePng = new Uint8Array(await renderCard({ ...words, brand: 'pulse' }))
  const p0 = decodePng(plainPng)
  const p1 = decodePng(pulsePng)
  let diffBox: { left: number; top: number; right: number; bottom: number } | null = null
  for (let y = 0; y < p0.height; y++) {
    for (let x = 0; x < p0.width; x++) {
      const at = (y * p0.width + x) * p0.channels
      let differs = false
      for (let ch = 0; ch < Math.min(p0.channels, 3); ch++) if (p0.pixels[at + ch] !== p1.pixels[at + ch]) differs = true
      if (!differs) continue
      diffBox = diffBox
        ? { left: Math.min(diffBox.left, x), top: Math.min(diffBox.top, y), right: Math.max(diffBox.right, x), bottom: Math.max(diffBox.bottom, y) }
        : { left: x, top: y, right: x, bottom: y }
    }
  }
  const pc = decodePng(new Uint8Array(await renderCover({ ...words, brand: 'pulse' })))
  const pLeft = (pc.width - p1.width) / 2
  let pulseCoverMiddleDiff = 0
  for (let y = 0; y < p1.height; y++) {
    for (let x = 0; x < p1.width; x++) {
      for (let ch = 0; ch < Math.min(pc.channels, 3); ch++) {
        pulseCoverMiddleDiff = Math.max(pulseCoverMiddleDiff, Math.abs(pc.pixels[(y * pc.width + x + pLeft) * pc.channels + ch] - p1.pixels[(y * p1.width + x) * p1.channels + ch]))
      }
    }
  }
  const live = { label: 'Blog', title: 'Privacy Tools: What They Are and How to Choose' }
  const loader = await pulseLoader()
  const long = await longTitles()

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
      pulse: [
        parseCardFile('pulse-post--google-analytics-alternative--5afc158210f8.png'),
        parseCardFile('pulse-post--google-analytics-alternative--bf9874e6e44e--cover.png'),
        parseCardFile('pulse--google-analytics-alternative--5afc158210f8.png'),
        parseCardFile('pulse-posts--google-analytics-alternative--5afc158210f8.png'),
      ],
    },
    loader,
    long,
    brands: {
      namedIsPlain: plainPng.length === namedPng.length && plainPng.every((v, i) => v === namedPng[i]),
      pulseSize: [p1.width, p1.height],
      diffBox,
      pulseCover: { width: pc.width, height: pc.height, middleDiff: pulseCoverMiddleDiff },
      hashes: {
        // ciphera.net/blog/privacy-tools's card and cover, as the site served them before brands existed.
        cipheraLive: [cardHash(live), coverHash(live)],
        cipheraNamed: [cardHash({ ...live, brand: 'ciphera' }), coverHash({ ...live, brand: 'ciphera' })],
        pulse: [cardHash({ ...words, brand: 'pulse' }), coverHash({ ...words, brand: 'pulse' })],
        cipheraSameWords: [cardHash(words), coverHash(words)],
      },
    },
  }))
}
main()
