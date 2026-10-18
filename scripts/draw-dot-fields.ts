/**
 * Draws the homepage's dot fields as static SVG files (components/overhaul/dot-field.ts), from the same geometry the
 * components compute, into <out-dir>/overhaul/dots/, each named after a hash of its bytes. Prints the DOT_FIELDS values.
 * Upload from the workspace root with `./scripts/cdn-upload.sh <out-dir> website`, then paste the names into DOT_FIELDS.
 *
 * Usage: npx tsx scripts/draw-dot-fields.ts <out-dir>
 */
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { dotFieldSvg } from '../components/overhaul/dot-field'
import { globeLandDots } from '../components/overhaul/GlobeEurope'
import { europeDots } from '../components/overhaul/home/variants/WhereDataLivesB'

const out = process.argv[2]
if (!out) {
  console.error('usage: npx tsx scripts/draw-dot-fields.ts <out-dir>')
  process.exit(2)
}
const dir = path.join(out, 'overhaul', 'dots')
fs.mkdirSync(dir, { recursive: true })

const fields = {
  globeDesktop: { stem: 'globe-desktop', ...globeLandDots('desktop') },
  globeMobile: { stem: 'globe-mobile', ...globeLandDots('mobile') },
  europe: { stem: 'europe', ...europeDots() },
}
for (const [key, f] of Object.entries(fields)) {
  const svg = dotFieldSvg(f.w, f.h, f.dots)
  const hash = crypto.createHash('sha256').update(svg).digest('hex').slice(0, 12)
  const name = `${f.stem}-${hash}.svg`
  fs.writeFileSync(path.join(dir, name), svg)
  console.log(`${key}: '/overhaul/dots/${name}',  // ${f.dots.length} dots, ${svg.length} bytes`)
}
