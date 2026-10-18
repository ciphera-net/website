/**
 * The OG card's title in the footer wordmark's dots (D52, "D, at one size"): the same algorithm as the approved mock's
 * DotText, run on the server. The title is rendered once in Geist SemiBold at ONE size for every card, its alpha channel
 * is sampled on a grid, and each lit cell becomes a dot sized by how much of it is covered. The title's own full stop
 * gives way to a block of orange dots, the wordmark's tittle as the full stop.
 *
 * Pure functions over an alpha channel, so they are tested without a renderer (__tests__/og-cards.test.mjs).
 */
export const DOT_SIZE = 100
export const DOT_PITCH = 6
export const DOT_LINE_HEIGHT = 1.02
/** The width the title is drawn on, and the width it wraps to: every line keeps room for the orange block, as in the mock. */
export const DOT_WIDTH = 1080
export const DOT_WRAP_WIDTH = DOT_WIDTH - DOT_PITCH * 4
/** The mock's canvas set the first baseline at 0.8 × size and the next ones a line height apart. */
export const DOT_BASELINE = DOT_SIZE * 0.8
export const DOT_LINE = DOT_SIZE * DOT_LINE_HEIGHT
/** Longer than any title the site has; the renderer draws this many lines' worth and counts what it used. */
export const DOT_MAX_LINES = 5
/** The mock's DotText box for a title of this many lines. */
export const dotBoxHeight = (lines: number) => Math.ceil(DOT_SIZE * (1.04 + DOT_LINE_HEIGHT * (lines - 1)))

export type Dot = { x: number; y: number; r: number; orange?: boolean }

const INK = 96

/**
 * For a title set by the renderer's own text layout (characters outside the metrics table; lib/og/layout.ts sets every
 * other title): no trailing full stop (the orange block is it), and a no-break space after every one- or two-letter
 * word, so such a word never ends a line. A lookbehind, so two short words in a row are both held ("A to B").
 */
export function titleText(title: string): string {
  return title
    .trim()
    .replace(/\.$/, '')
    .replace(/(?<=^|\s)(\S{1,2}) (?=\S)/g, '$1 ')
}

/** Dots for every lit cell, sized by its 3 x 3 sub-sample coverage, as DotText does on a canvas. */
export function sampleDots(alpha: Uint8Array, width: number, height: number, pitch = DOT_PITCH): Dot[] {
  const dots: Dot[] = []
  const rMax = pitch * 0.4
  for (let y = pitch / 2; y < height; y += pitch) {
    for (let x = pitch / 2; x < width; x += pitch) {
      let a = 0
      let n = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const px = Math.round(x + (dx * pitch) / 3)
          const py = Math.round(y + (dy * pitch) / 3)
          if (px < 0 || py < 0 || px >= width || py >= height) continue
          a += alpha[py * width + px]
          n++
        }
      }
      const cover = a / (n * 255)
      if (cover > 0.18) dots.push({ x, y, r: rMax * Math.min(1, 0.45 + cover * 0.7) })
    }
  }
  return dots
}

/** How many lines the title took: a line has ink in its x-height band, which every letter and digit reaches. */
export function countLines(alpha: Uint8Array, width: number, height: number): number {
  let lines = 0
  for (let i = 0; i < DOT_MAX_LINES; i++) {
    const base = DOT_BASELINE + i * DOT_LINE
    let ink = false
    for (let y = Math.max(0, Math.round(base - 40)); y < Math.min(height, Math.round(base - 5)) && !ink; y++) {
      for (let x = 0; x < width; x++) {
        if (alpha[y * width + x] > INK) {
          ink = true
          break
        }
      }
    }
    if (ink) lines = i + 1
  }
  return lines
}

/**
 * The orange full stop: a 3 x 3 block one gap after the last line's end (the pen position after its last letter, as the
 * mock measured it), its bottom row on that line's baseline. The mock's own arithmetic.
 */
export function fullStop(end: number, base: number, pitch = DOT_PITCH): Dot[] {
  const rMax = pitch * 0.4
  const x0 = Math.ceil((end + pitch * 0.9) / pitch) * pitch + pitch / 2
  const y0 = Math.floor(base / pitch) * pitch - pitch * 2 + pitch / 2
  const out: Dot[] = []
  for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) out.push({ x: x0 + k * pitch, y: y0 + j * pitch, r: rMax, orange: true })
  return out
}

/**
 * For a title set by the renderer's own text layout (characters outside the metrics table): the last line's end, read
 * from the ink. The rightmost ink, plus about 2 px for the side bearing a measured width includes at this size, net of
 * the tracking.
 */
export function inkEnd(alpha: Uint8Array, width: number, height: number, base: number): number {
  let right = 0
  for (let y = Math.max(0, Math.round(base - DOT_SIZE)); y < Math.min(height, Math.round(base + DOT_SIZE * 0.3)); y++) {
    for (let x = width - 1; x > right; x--) {
      if (alpha[y * width + x] > INK) {
        right = x
        break
      }
    }
  }
  return right + 2
}

/** The dots as one SVG of the given box (the card lays the title out by that box, as the mock's DotText). */
export function dotsSvg(dots: Dot[], width: number, height: number, color = '#e8e8e8'): string {
  const circles = dots
    .map((d) => `<circle cx="${d.x}" cy="${d.y}" r="${d.r.toFixed(2)}" fill="${d.orange ? '#FD5E0F' : color}"/>`)
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${circles}</svg>`
}
