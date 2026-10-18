import { inflateSync } from 'node:zlib'

/**
 * The alpha channel of a PNG, for the OG cards' dot titles (lib/og/dots.ts). The title is rendered to a PNG by the same
 * renderer as the card, then sampled like the mock sampled its canvas. Node's zlib is the only dependency: 8-bit,
 * non-interlaced PNGs (what the renderer writes) in greyscale, RGB, grey-alpha or RGBA. Anything else throws, so a
 * renderer change cannot silently produce a card without its title.
 */
export function decodePngAlpha(png: Uint8Array): { width: number; height: number; alpha: Uint8Array } {
  const sig = [137, 80, 78, 71, 13, 10, 26, 10]
  if (!sig.every((b, i) => png[i] === b)) throw new Error('og/png: not a PNG')
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength)
  let width = 0
  let height = 0
  let colorType = -1
  const idat: Uint8Array[] = []
  for (let off = 8; off < png.length; ) {
    const len = view.getUint32(off)
    const type = String.fromCharCode(png[off + 4], png[off + 5], png[off + 6], png[off + 7])
    const data = png.subarray(off + 8, off + 8 + len)
    if (type === 'IHDR') {
      width = view.getUint32(off + 8)
      height = view.getUint32(off + 12)
      const depth = data[8]
      colorType = data[9]
      if (depth !== 8 || data[12] !== 0) throw new Error(`og/png: unsupported depth ${depth} or interlace ${data[12]}`)
    } else if (type === 'IDAT') idat.push(data)
    else if (type === 'IEND') break
    off += 12 + len
  }
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType]
  if (!channels) throw new Error(`og/png: unsupported colour type ${colorType}`)
  const raw = inflateSync(Buffer.concat(idat))
  const stride = width * channels
  const prev = new Uint8Array(stride)
  const cur = new Uint8Array(stride)
  const alpha = new Uint8Array(width * height)
  for (let y = 0; y < height; y++) {
    const row = y * (stride + 1)
    const filter = raw[row]
    for (let x = 0; x < stride; x++) {
      const v = raw[row + 1 + x]
      const a = x >= channels ? cur[x - channels] : 0
      const b = prev[x]
      const c = x >= channels ? prev[x - channels] : 0
      let out: number
      switch (filter) {
        case 0: out = v; break
        case 1: out = v + a; break
        case 2: out = v + b; break
        case 3: out = v + ((a + b) >> 1); break
        case 4: {
          const p = a + b - c
          const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
          out = v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)
          break
        }
        default: throw new Error(`og/png: bad filter ${filter} on row ${y}`)
      }
      cur[x] = out & 0xff
    }
    for (let x = 0; x < width; x++) {
      // Greyscale and RGB carry no alpha: a lit pixel is ink. Grey-alpha and RGBA: the alpha channel.
      alpha[y * width + x] = channels === 4 ? cur[x * 4 + 3] : channels === 2 ? cur[x * 2 + 1] : cur[x * channels]
    }
    prev.set(cur)
  }
  return { width, height, alpha }
}
