import semibold from './geist-semibold-metrics.json'
import regular from './geist-regular-metrics.json'
import { DOT_PITCH, DOT_SIZE, DOT_WIDTH, dotBoxHeight } from './dots'
import { OG_HEIGHT, TITLE_BOTTOM, TITLE_TOP } from './spec'

/**
 * Sets an OG card's words the way the approved mock's browser did (D52), so the card looks like what the owner approved:
 * letter-spacing after every character, GPOS pair kerning, no ligatures (Chrome turns them off under letter-spacing).
 * The metrics come from the vendored fonts (scripts/og-font-metrics.py); the renderer draws each glyph at the position
 * this module gives it, because next/og's own text layout places each word by its letters' UNKERNED widths but draws it
 * kerned, which leaves a gap after every word as wide as its kerning ("Migrate  Off", "software  company").
 */
type Metrics = { unitsPerEm: number; advance: Record<string, number>; kern: Record<string, Record<string, number>> }

export type Placed = { glyphs: { char: string; x: number }[]; end: number }

function setter(metrics: Metrics, size: number, letterSpacing: number) {
  const scale = size / metrics.unitsPerEm
  const step = (chars: string[], i: number) =>
    metrics.advance[chars[i]] * scale + letterSpacing + (i < chars.length - 1 ? (metrics.kern[chars[i]]?.[chars[i + 1]] ?? 0) * scale : 0)
  return {
    size,
    letterSpacing,
    /** True when every character has metrics; otherwise the renderer sets the text with its own layout. */
    has: (text: string) => Array.from(text).every((c) => c in metrics.advance),
    /** The width canvas measureText gives: advances, kerning, and the letter-spacing after each character. */
    width(text: string): number {
      const chars = Array.from(text)
      let w = 0
      for (let i = 0; i < chars.length; i++) w += step(chars, i)
      return w
    },
    /** Where each visible character of a line starts (spaces only advance the pen), and where the line ends. */
    place(line: string): Placed {
      const chars = Array.from(line)
      const glyphs: Placed['glyphs'] = []
      let x = 0
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] !== ' ') glyphs.push({ char: chars[i], x })
        x += step(chars, i)
      }
      return { glyphs, end: x }
    },
  }
}

/** The title: Geist SemiBold at the dot size, tracked -0.04 em, as the mock's DotText canvas. */
export const TITLE = setter(semibold, DOT_SIZE, -0.04 * DOT_SIZE)
/** The lead: Geist Regular 28 px, tracked -0.01 em, as the mock's paragraph. */
export const LEAD = setter(regular, 28, -0.28)
/** The label: Geist Regular 22 px, tracked -0.01 em. Right-aligned, so its box must be its kerned width. */
export const LABEL = setter(regular, 22, -0.22)
export const LEAD_LINE_HEIGHT = 1.3
export const LEAD_WIDTH = 900

/** Every title line keeps room for the orange block (one gap and three dots), as the mock's wrap did. */
const BLOCK = DOT_PITCH * 4

/** The title's lines, as the mock's DotText wrapped them (the orange block replaces a trailing full stop). */
export function wrapTitle(title: string, width = DOT_WIDTH): string[] {
  const lines = greedy(title, width - BLOCK, TITLE.width)
  // A one- or two-letter word never ends a line ("Analytics: A / 2026 Guide"): it moves down to the next line when that
  // line still fits with it.
  for (let i = 0; i < lines.length - 1; i++) {
    const words = lines[i].split(' ')
    const last = words[words.length - 1]
    if (words.length < 2 || last.length > 2) continue
    const moved = `${last} ${lines[i + 1]}`
    const room = i + 1 === lines.length - 1 ? width - BLOCK : width
    if (TITLE.width(moved) <= room) {
      lines[i] = words.slice(0, -1).join(' ')
      lines[i + 1] = moved
    }
  }
  return lines.map((l, i) => (i === lines.length - 1 ? l.replace(/\.$/, '') : l))
}

/** The lead's lines, as the mock's paragraph broke them at its maximum width. */
export const wrapLead = (lead: string) => greedy(lead, LEAD_WIDTH, LEAD.width)

/** The sizes a title may be drawn at: full size, then a tenth smaller at a time (23-10-2026). */
export const TITLE_SCALES = [1, 0.9, 0.8, 0.7, 0.6] as const
/** The height a card gives its title when it has no lead: the area between TITLE_TOP and TITLE_BOTTOM. */
export const TITLE_ROOM = OG_HEIGHT - TITLE_TOP - TITLE_BOTTOM

export type TitleFit = { lines: string[]; scale: number; cut: boolean }

/**
 * How a title fits its card: at full size when it does, as every title on the site does today (four lines fill the
 * title's area), and otherwise the whole title at the largest of TITLE_SCALES at which it fits `room`. D52 drew every
 * title at one size, so a fifth line crowded the lockup and a sixth printed over it and lost its last line; this was
 * chosen over cutting a long title at four lines (23-10-2026). Measured on ordinary words: full size holds about 75
 * characters, 90 % about 95, 80 % about 140, 70 % about 200, 60 % about 270. Past the smallest size, as many lines
 * as fit, the last one ending in an ellipsis: the card never overflows. The lines are wrapped at the card's width divided by the scale, so a smaller title still fills the width.
 */
export function fitTitle(title: string, room = TITLE_ROOM): TitleFit {
  for (const scale of TITLE_SCALES) {
    const lines = wrapTitle(title, DOT_WIDTH / scale)
    if (dotBoxHeight(lines.length) * scale <= room) return { lines, scale, cut: false }
  }
  const scale = TITLE_SCALES[TITLE_SCALES.length - 1]
  const width = DOT_WIDTH / scale
  const lines = wrapTitle(title, width)
  let keep = lines.length
  while (keep > 1 && dotBoxHeight(keep) * scale > room) keep--
  let last = lines[keep - 1]
  while (TITLE.width(`${last}\u2026`) > width - BLOCK && last.length > 1) {
    last = last.includes(' ') ? last.slice(0, last.lastIndexOf(' ')) : last.slice(0, -1)
  }
  return { lines: [...lines.slice(0, keep - 1), `${last.replace(/[\s,;:.\u2014-]+$/, '')}\u2026`], scale, cut: true }
}

/**
 * Lines at most `max` wide, broken at spaces. A word wider than a whole line (a long compound, a run like
 * "Cookie-less/GDPR-compliant") breaks after a hyphen or a slash, and a part still too wide between two characters, so
 * no line runs off the card (23-10-2026). Every other text breaks exactly where it did before.
 */
function greedy(text: string, max: number, width: (s: string) => number): string[] {
  const lines: string[] = []
  let cur = ''
  for (const word of text.replace(/\s+/g, ' ').trim().split(' ')) {
    pieces(word, max, width).forEach((part, k) => {
      // A word's first piece follows a space; the pieces of one broken word join without one.
      const next = cur ? (k === 0 ? `${cur} ${part}` : `${cur}${part}`) : part
      if (cur && width(next) > max) {
        lines.push(cur)
        cur = part
      } else cur = next
    })
  }
  if (cur) lines.push(cur)
  return lines
}

/** A word as the pieces a line may end between: the word itself when it fits a line. */
function pieces(word: string, max: number, width: (s: string) => number): string[] {
  if (width(word) <= max) return [word]
  return word.split(/(?<=[-/])/).flatMap((part) => {
    if (width(part) <= max) return [part]
    const out: string[] = []
    let cur = ''
    for (const c of Array.from(part)) {
      if (cur && width(cur + c) > max) {
        out.push(cur)
        cur = c
      } else cur += c
    }
    return cur ? [...out, cur] : out
  })
}
