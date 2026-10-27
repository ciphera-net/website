import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The OG card system drawn for real (D52, 19-10-2026; plan §5l): `og-harness-entry.tsx` is bundled by esbuild and run
 * with next/og, the renderer the route serves cards from, and prints what it measured.
 *
 * 🔑 The defect this exists for: next/og's own text layout places each word by its letters' unkerned widths and draws it
 * kerned, so every word left a gap as wide as its kerning ("Migrate  Off"). lib/og/layout.ts places every glyph the way
 * the approved mock's browser did. The gaps below were measured in Chrome's canvas (Geist SemiBold 100 px, -4 px
 * tracking: 22, 27 and 24 px); the control is the same line set by next/og itself, which must still miss them, or this
 * test could not see the defect.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, '__tests__', 'render', '.out')
const outFile = join(outDir, 'og-harness.mjs')
const CHROME_GAPS = [22, 27, 24]

let r
let iso

before(() => {
  mkdirSync(outDir, { recursive: true })
  execFileSync(
    'npx',
    [
      '--yes', 'esbuild',
      join(root, '__tests__', 'render', 'og-harness-entry.tsx'),
      '--bundle', '--platform=node', '--format=esm', '--target=node20',
      `--tsconfig=${join(root, 'tsconfig.json')}`,
      '--packages=external',
      // Next ships `og` as a CommonJS file with no exports map, so Node's ESM resolver needs the extension.
      '--alias:next/og=next/og.js',
      `--outfile=${outFile}`,
    ],
    { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] },
  )
  r = JSON.parse(execFileSync('node', [outFile], { cwd: root, encoding: 'utf-8' }))
  // The same harness from a folder holding the fonts and Ciphera's mark, without Pulse's.
  const bare = mkdtempSync(join(tmpdir(), 'og-isolation-'))
  try {
    cpSync(join(root, 'lib', 'og', 'fonts'), join(bare, 'lib', 'og', 'fonts'), { recursive: true })
    cpSync(join(root, 'public', 'ciphera_icon.png'), join(bare, 'public', 'ciphera_icon.png'))
    iso = JSON.parse(execFileSync('node', [outFile, '--isolation'], { cwd: bare, encoding: 'utf-8' }))
  } finally {
    rmSync(bare, { recursive: true, force: true })
  }
})

test('the title is lifted by where next/og really puts a 100 px Geist SemiBold baseline', () => {
  // The H's bottom edge sits on the baseline: its last inked row is the one above it.
  assert.equal(r.baselineBottomRow + 1, r.satoriBaseline)
})

test('word gaps are the ones Chrome drew, and next/og’s own layout is not (the control)', () => {
  assert.equal(r.gaps.ours.length, 3)
  r.gaps.ours.forEach((g, i) => assert.ok(Math.abs(g - CHROME_GAPS[i]) <= 1, `gap ${i}: ${g} px, Chrome ${CHROME_GAPS[i]} px (${r.gaps.ours})`))
  assert.ok(r.gaps.theirs.some((g, i) => Math.abs(g - CHROME_GAPS[i]) > 3), `the control no longer shows the defect (${r.gaps.theirs})`)
})

test('titles wrap as the approved mock wrapped them', () => {
  assert.deepEqual(r.wrap.post, ['How to Migrate Off', 'Google Analytics:', 'A 2026 Guide'])
  // A one- or two-letter word never ends a line.
  for (const line of r.wrap.shortWord.slice(0, -1)) assert.doesNotMatch(line, /\s\S{1,2}$/, `"${line}" ends in a short word`)
  // The orange block is the full stop.
  assert.deepEqual(r.wrap.period, ['About Ciphera'])
  assert.deepEqual(r.wrap.lead, ['We are a small software company in Belgium.'])
})

test('a card is a 1200 x 630 PNG', () => {
  assert.deepEqual(r.card.signature, [137, 80, 78, 71, 13, 10, 26, 10])
  assert.equal(r.card.width, 1200)
  assert.equal(r.card.height, 630)
  assert.ok(r.card.bytes > 10000, `a ${r.card.bytes}-byte card has no title`)
})

test('a title with a character the font lacks still gets a card, set line by line by the renderer', () => {
  assert.deepEqual(r.titleDots.metrics.layout, 'glyphs')
  assert.equal(r.titleDots.metrics.lines, 1)
  // The approved card of the same title has 730 dots; the 1 px stroke keeps the system within a few per cent of it.
  assert.ok(Math.abs(r.titleDots.metrics.dots - 730) / 730 < 0.05, `${r.titleDots.metrics.dots} dots`)
  assert.equal(r.titleDots.fallback.layout, 'lines')
  assert.ok(r.titleDots.fallback.dots > 200)
})

test('card addresses parse back, and nothing else parses', () => {
  assert.match(r.url.page, /^\/og\/page--_61626f7574--[0-9a-f]{12}\.png$/)
  assert.match(r.url.learn, /^\/og\/learn--_70756c73657e636f72652d7765622d766974616c73--[0-9a-f]{12}\.png$/)
  const [page, learn, upper, dots, jpg, kind] = r.url.parsed
  assert.equal(page.kind, 'page')
  assert.equal(page.key, 'about')
  assert.equal(page.legacy, false)
  // An address from before keys were hex still reads back, flagged, so the route can send it to the hex one.
  assert.deepEqual(learn, { kind: 'learn', key: 'pulse~core-web-vitals', hash: '0123456789ab', variant: 'card', legacy: true })
  assert.equal(upper, null)
  assert.equal(dots, null)
  assert.equal(jpg, null)
  assert.equal(kind, null)
  assert.ok(r.url.hashChangesWithWords, 'a changed title must be a new address')
  assert.deepEqual(r.url.systemCard, [true, true, false, false])
})

test('a cover is the card, pixel for pixel, on the card’s ground at DEV’s 1000:420 shape', () => {
  assert.equal(r.cover.width, 1500)
  assert.equal(r.cover.height, 630)
  assert.equal(r.cover.width * 420, r.cover.height * 1000, 'not DEV’s cover shape: DEV would crop it')
  assert.equal(r.cover.left, 150)
  // The card's own pixels, unscaled and unfiltered: a resampled card would differ here.
  assert.equal(r.cover.middleDiff, 0, `the cover's middle differs from the card by up to ${r.cover.middleDiff}`)
  assert.equal(r.cover.groundDiff, 0, `the cover's ground differs from #0a0a0a by up to ${r.cover.groundDiff}`)
})

test('cover addresses parse back with their own hash, and nothing else parses', () => {
  assert.match(r.url.cover, /^\/og\/post--_707269766163792d746f6f6c73--[0-9a-f]{12}--cover\.png$/)
  const [cover, jpg, covers] = r.url.coverParsed
  assert.deepEqual(
    { kind: cover.kind, key: cover.key, variant: cover.variant, legacy: cover.legacy },
    { kind: 'post', key: 'privacy-tools', variant: 'cover', legacy: false },
  )
  assert.equal(jpg, null)
  assert.equal(covers, null)
  assert.ok(r.url.coverHashIsItsOwn, 'a cover must not share its card’s hash, or a change to the cover alone would keep its address')
  assert.ok(r.url.coverHashChangesWithWords, 'a changed title must be a new cover address')
})

test('a Pulse card is the same card with Pulse’s lockup, and Ciphera’s cards keep their addresses', () => {
  const b = r.brands
  assert.ok(b.namedIsPlain, 'a card naming Ciphera must be the card drawn with no brand, byte for byte')
  assert.deepEqual(b.pulseSize, [1200, 630])
  // Only the lockup changes (left 64, top 52, one 45 px row): the title, the label and the ground are the same pixels.
  assert.ok(b.diffBox, 'the Pulse card is pixel for pixel the Ciphera card: its lockup was not drawn')
  const { left, top, right, bottom } = b.diffBox
  assert.ok(left >= 64 && top >= 52 && right < 300 && bottom < 97, `pixels outside the lockup differ: ${JSON.stringify(b.diffBox)}`)
  assert.deepEqual([b.pulseCover.width, b.pulseCover.height, b.pulseCover.middleDiff], [1500, 630, 0])
  // ciphera.net/blog/privacy-tools's card and cover as served before brands existed: every Ciphera card keeps its
  // hashes (the key's form in the address changed on 27-10-2026; the hashes did not).
  assert.deepEqual(b.hashes.cipheraLive, ['fc1e0c3f9679', '74400c4cce69'])
  assert.deepEqual(b.hashes.cipheraNamed, b.hashes.cipheraLive)
  // A brand is part of the address, so the same words for Pulse are another card. pulse.ciphera.net computes these
  // addresses itself; its own test pins the same two hashes, so the two sites cannot drift apart unseen.
  assert.notEqual(b.hashes.pulse[0], b.hashes.cipheraSameWords[0])
  assert.notEqual(b.hashes.pulse[1], b.hashes.cipheraSameWords[1])
  assert.deepEqual(b.hashes.pulse, ['5afc158210f8', 'bf9874e6e44e'])
})

test('pulse-post addresses parse, cards and covers, and nothing near them does', () => {
  const [card, cover, shortKind, longKind] = r.url.pulse
  assert.deepEqual(card, { kind: 'pulse-post', key: 'google-analytics-alternative', hash: '5afc158210f8', variant: 'card', legacy: true })
  assert.deepEqual(cover, { kind: 'pulse-post', key: 'google-analytics-alternative', hash: 'bf9874e6e44e', variant: 'cover', legacy: true })
  assert.equal(shortKind, null)
  assert.equal(longKind, null)
  const [hexLearn, hexCard, hexCover] = r.url.hex.parsed
  assert.deepEqual(hexLearn, { kind: 'learn', key: 'pulse~core-web-vitals', hash: '0123456789ab', variant: 'card', legacy: false })
  assert.deepEqual(hexCard, { kind: 'pulse-post', key: 'google-analytics-alternative', hash: '5afc158210f8', variant: 'card', legacy: false })
  assert.deepEqual(hexCover, { kind: 'pulse-post', key: 'google-analytics-alternative', hash: 'bf9874e6e44e', variant: 'cover', legacy: false })
})

test('a key is written in hex, so an address never carries the words of its slug', () => {
  // EasyList Cookie's `-cookie-consent-$~script` hid the Pulse post cookie-consent's card on its blog index (27-10-2026).
  assert.equal(r.url.hex.keys.about, '_61626f7574')
  assert.equal(r.url.hex.keys.learn, '_70756c73657e636f72652d7765622d766974616c73')
  // pulse.ciphera.net builds this address itself (lib/blog-card.ts); its own test pins the same string.
  assert.equal(r.url.hex.pulseCard, 'pulse-post--_676f6f676c652d616e616c79746963732d616c7465726e6174697665--5afc158210f8.png')
  for (const address of r.url.hex.words) {
    assert.match(address, /^\/og\/post--_[0-9a-f]+--[0-9a-f]{12}\.png$/)
    assert.doesNotMatch(address.slice('/og/post--'.length), /cookie|consent|banner|google|analytics|track|pixel|ad-/)
  }
  // Odd length, upper-case hex, `..`, an upper-case key, no key, longer than a key may be, a non-ASCII key: none parse.
  assert.deepEqual(r.url.hex.rejected, [null, null, null, null, null, null, null])
  assert.equal(r.url.hex.longest, 256)
})

test('a Pulse post’s words come from Pulse’s published index: found, absent, or unreadable, never confused', () => {
  const l = r.loader
  // The index cache is per site: reading Pulse's never answers for ciphera.net, and a cached read is not asked again.
  assert.deepEqual(l.sites, ['ciphera-net', 'pulse', 'ciphera-net'])
  assert.equal(l.indexReads, 2)
  assert.deepEqual(l.found, { value: 'Google Analytics Alternative: Free, Cookieless, No Banner' })
  // Not published: the route answers 404.
  assert.deepEqual(l.absent, { value: null })
  assert.deepEqual(l.prototype, { value: null }, 'a slug naming an Object.prototype property must not read it')
  assert.deepEqual(l.noBlog, { value: null })
  assert.deepEqual(l.neverPublished, { value: null }, 'an index 404 means Pulse never published')
  // Cannot tell: the route answers 503, never a cached 404.
  assert.match(l.untitled.error ?? '', /has no title/)
  assert.match(l.schema.error ?? '', /schema 2/)
  assert.match(l.down.error ?? '', /HTTP 500/)
})

test('a brand’s missing mark fails only that brand’s cards', () => {
  assert.ok(iso.ciphera.bytes > 10000, `Ciphera's card failed without Pulse's mark: ${JSON.stringify(iso.ciphera)}`)
  assert.equal(iso.pulse.error, 'ENOENT')
  assert.ok(iso.cipheraAfter.bytes > 10000, 'a failed Pulse card left Ciphera’s cards broken')
})

test('a title that fits keeps its size and lines; a longer one is drawn whole, smaller, inside its area', () => {
  const { fit, unchanged, widths, six, cornerClear } = r.long
  // Every title of up to four lines, the site's longest among them, is set exactly as before at full size.
  assert.deepEqual(unchanged, unchanged.map(() => true), 'a title that fits changed')
  // Five or six lines at full size: the whole title at 90 %, in four lines. Pulse's 89 characters: 80 %.
  assert.deepEqual([fit.five.scale, fit.five.lines.length, fit.five.cut], [0.9, 4, false])
  assert.deepEqual([fit.six.scale, fit.six.lines.length, fit.six.cut], [0.9, 4, false])
  assert.deepEqual([fit.pulse.scale, fit.pulse.cut], [0.8, false])
  assert.equal(fit.six.lines.join(' '), 'Is Your Website Analytics GDPR-Compliant? A 2026 Checklist for Marketing and Legal Teams')
  // The six-line title is shown no taller than its area, so its first line stays clear of the lockup.
  assert.equal(six.scale, 0.9)
  assert.ok(six.height <= six.room, `${six.height} px shown in a ${six.room} px area`)
  assert.ok(cornerClear, 'the long title reached the lockup corner')
})

test('a word wider than a line breaks after its hyphen or slash, and only a title past the smallest size is cut', () => {
  const { fit, widths } = r.long
  assert.ok(widths, 'a line runs past the width it is drawn at')
  // ciphera.net/glossary/pake's term, whose "(password-authenticated" ran off the card's right edge.
  assert.deepEqual(fit.pake.lines, ['PAKE (password-', 'authenticated key', 'exchange)'])
  assert.equal(fit.pake.scale, 1)
  assert.ok(fit.token.lines.some((l) => /[-/]$/.test(l)), `no break after a hyphen or a slash: ${JSON.stringify(fit.token.lines)}`)
  // 189 characters still fit whole (at 70 %); only a title past the smallest size is cut, ending in an ellipsis
  // rather than leaving the card.
  assert.deepEqual([fit.huge.scale, fit.huge.cut], [0.7, false])
  assert.deepEqual([fit.cut.scale, fit.cut.cut], [0.6, true])
  assert.match(fit.cut.lines.at(-1), /\u2026$/)
})

// What the long-title rules promise, measured on what is drawn (23-10-2026, from the change's review: every assertion
// below failed on at least one one-line mutation that the tests above let through).
test('titles that fit keep the lines and the drawing they had', () => {
  const h = r.hard
  // The site's titles of up to four lines, as origin/main set them before the long-title change.
  assert.deepEqual(h.golden, [
    ['The EU-US Data Privacy', 'Framework Is Built', 'on an Executive Order \u2014', "and That's the Problem"],
    ['Do You Need a Cookie', 'Banner for Analytics?', 'What EU Law Actually', 'Requires (2026)'],
    ['Is Your Website', 'Analytics', 'GDPR-Compliant?', 'A 2026 Checklist'],
    ['Privacy Tools: What', 'They Are and How', 'to Choose'],
    ['How to Migrate Off', 'Google Analytics:', 'A 2026 Guide'],
    ['Google Analytics', 'Alternative: Free,', 'Cookieless, No Banner'],
    ['Privacy policy'],
  ])
  // Drawn at full size: a 1080 px canvas, the mock's box for that many lines, glyph by glyph.
  for (const f of h.fitting) assert.deepEqual([f.w, f.h, f.layout], [1080, f.box, 'glyphs'])
})

test('a smaller title is drawn on a canvas as much wider as it is smaller, and shown at the card width', () => {
  for (const [k, g] of Object.entries(r.hard.geometry)) {
    assert.equal(g.w, Math.round(1080 / g.scale), `${k}: a ${g.w} px canvas at ${g.scale}`)
    assert.equal(g.shown, Math.round(g.h * g.scale), `${k}: shown ${g.shown} px for a ${g.h} px box at ${g.scale}`)
  }
  assert.deepEqual([r.hard.geometry.huge.scale, r.hard.geometry.huge.lines, r.hard.geometry.cut.lines], [0.7, 6, 7])
})

test('no ink of any card leaves the title’s area: not above it, below it or past its right edge', () => {
  // 17 cards: the long titles, the cut ones, titles with one- and two-line leads, an arrow, and three with a character
  // the font lacks (an emoji), drawn line by line.
  assert.equal(Object.keys(r.hard.ink).length, 17)
  for (const [k, v] of Object.entries(r.hard.ink)) assert.deepEqual(v, { top: 0, bottom: 0, right: 0 }, `${k}: ink outside the area ${JSON.stringify(v)}`)
})

test('words break where the rules say, and a broken word stays whole', () => {
  const h = r.hard
  assert.deepEqual(h.exact.token, ['Cookie-less/GDPR-', 'compliant analytics,', 'explained for small', 'teams'])
  assert.deepEqual(h.exact.slash, ['Plausible/Matomo/', 'Umami/Fathom/Pirsch/', 'Simple-Analytics/', 'Alternatives/Compared'])
  // A word with neither breaks between two characters: every character kept, no line wider than its canvas.
  assert.ok(h.longword.kept, `characters lost: ${JSON.stringify(h.longword.lines)}`)
  assert.ok(h.longword.widest <= h.longword.canvas, `a ${h.longword.widest} px line on a ${h.longword.canvas} px canvas`)
  // A one- or two-letter piece of a broken word moves down WITHOUT a space ("A/ B-testing" before the fix).
  assert.deepEqual(h.joins, [
    ['Switching Shops for', 'A/B-testing-and-', 'multivariate-', 'experimentation Setup'],
    ['Your Google', 'e-commerce/B2B-', 'marketplace-analytics', 'and'],
  ])
  // A full stop split off a long word is not a line of its own (the orange block alone on a new line before the fix).
  assert.deepEqual(h.stops, [['abdominohysterectomy'], ['Why we love', 'abdominohysterectomy']])
})

test('a cut keeps as many lines as fit, ends in one ellipsis, and only a cut title is marked cut', () => {
  const h = r.hard
  assert.deepEqual(h.exact.cut, [
    'How to Replace Google Analytics with',
    'a Cookieless, Privacy-First Alternative',
    'Without Losing Your Reports, Your',
    'Funnels, Your Goals or Your Sanity:',
    'A Complete Field Guide for Teams',
    'of Every Size and Every Budget, Across',
    'Europe and Beyond, This Year and Next\u2026',
  ])
  assert.equal(h.ellipsis, 'Europe and Beyond, This Year and\u2026', 'two ellipses where the cut lands after a typed one')
  assert.deepEqual(h.tiny, { lines: ['Privacy policy'], scale: 0.6, cut: false })
  // The orange block stays on the canvas the title is drawn on, for 3,000 seeded titles.
  assert.equal(h.overshoot, 0)
  assert.equal(h.empty, 'og: the title is empty')
})

test('a title with a character the font lacks is fitted like any other, and its full stop follows its last line', () => {
  const h = r.hard
  // An emoji in the six-line title: drawn line by line, whole, smaller, inside its area (it was cut at five lines,
  // over the lockup, before 23-10-2026).
  assert.equal(h.lacks.layout, 'lines')
  assert.ok(h.lacks.scale < 1 && h.lacks.height <= h.lacks.room, JSON.stringify(h.lacks))
  assert.equal(h.lacksCut.cut, true)
  assert.match(h.lacksCut.lines.at(-1), /\u2026$/)
  // The block starts one gap after the last line's ink, never at a descender of the line above.
  assert.equal(h.block.layout, 'lines')
  assert.ok(h.block.gap > 0 && h.block.gap <= 4 * h.block.pitch, `the block is ${h.block.gap} px from the last line's ink`)
  // An arrow is in the font: glyph by glyph, fitted.
  assert.equal(h.arrow.layout, 'glyphs')
  assert.deepEqual([h.arrow.fit.scale, h.arrow.fit.lines.length, h.arrow.fit.cut], [0.9, 4, false])
  // A lead with an emoji is counted by its bound, never as one line.
  assert.ok(h.lead.lines >= h.lead.plain, `${h.lead.lines} lines counted, ${h.lead.plain} without the emoji`)
})

test('a line next/og sets is wrapped by a bound that is never short of what it draws', () => {
  const h = r.hard
  // 1,000 seeded titles and leads with an emoji: every line within its width by the bound (the last one short of it by
  // the orange block's room).
  assert.equal(h.lineOver, 0, `${h.lineOver} titles have a line past its width`)
  assert.equal(h.leadOver, 0, `${h.leadOver} leads have a line past the lead's width`)
  // The bound against next/og itself: the rightmost dot of a line it set stays within the bound (one pitch for the
  // dot's own radius and its cell).
  for (const c of h.calibration) {
    assert.deepEqual([c.layout, c.lines], ['lines', 1], c.title)
    assert.ok(c.right <= c.bound + 6, `"${c.title}" drawn to ${c.right} px, bound ${c.bound} px`)
  }
})
