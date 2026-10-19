/**
 * Code 128, character set B, for the receipt's barcode (D64): the bars encode the text printed under them, so a
 * scanner reads what the reader reads. Set B covers ASCII 32 to 127, which is enough for "CO2E 2026 10".
 *
 * Each symbol is six alternating widths (bar, space, bar, space, bar, space) adding up to 11 modules; the stop symbol is
 * seven widths, 13 modules. A barcode is Start B (104), one symbol per character (its code minus 32), a check symbol
 * ((104 + the sum of position x value) mod 103, positions counted from 1) and Stop. Proven by decoding the output with
 * ZXing's Code128Reader (Public/docs/data/19-10-2026-sustainability-r12/r12-build/), not with this file's own logic.
 */

/** The symbol table, indexed by value: 0-102 data, 103 Start A, 104 Start B, 105 Start C, 106 Stop. */
const PATTERNS = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112',
] as const

const START_B = 104
const STOP = 106

/** The symbol values for `text`: Start B, the characters, the check symbol, Stop. */
export function code128BValues(text: string): number[] {
  const values = [START_B]
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0
    if (code < 32 || code > 127) throw new Error(`Code 128 set B cannot encode ${JSON.stringify(ch)}`)
    values.push(code - 32)
  }
  let sum = START_B
  for (let i = 1; i < values.length; i++) sum += i * values[i]
  values.push(sum % 103, STOP)
  return values
}

/** The barcode as module widths, alternating bar and space, starting with a bar (no quiet zones). */
export function code128B(text: string): number[] {
  const widths: number[] = []
  for (const v of code128BValues(text)) for (const d of PATTERNS[v]) widths.push(Number(d))
  return widths
}

/** The bars to draw: each one's start and width in modules, and the barcode's total width in modules. */
export function code128BBars(text: string): { bars: { x: number; w: number }[]; modules: number } {
  const bars: { x: number; w: number }[] = []
  let x = 0
  code128B(text).forEach((w, i) => {
    if (i % 2 === 0) bars.push({ x, w })
    x += w
  })
  return { bars, modules: x }
}
