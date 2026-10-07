import fs from 'fs'
import path from 'path'
import type { ContentRepairEntry } from './content-repair-types'

/**
 * Accumulates CONTENT_REPAIRS across the four generate-*.ts scripts, which run as
 * separate `tsx` processes in `npm run prebuild` (seo → redirects → … → blog →
 * glossary → …), and writes the committed lib/content-repairs.gen.ts after every call.
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1 P1-a
 *
 * 🔑 EACH CALLER OWNS ITS OWN `type` VALUES. There is no shared memory between the
 * four processes, so a small JSON scratch file plays that role across the chain —
 * but a stale scratch file from a PREVIOUS build must never leak a prior run's
 * repairs forward forever. Ownership-by-type solves both: a script only ever
 * replaces entries whose `type` it itself owns, so re-running it (standalone, in
 * dev, out of chain order) always reflects THIS run for those types, while leaving
 * whatever the other three scripts last recorded alone.
 */

const SCRATCH = path.join(process.cwd(), 'lib', '.content-repairs.scratch.json')
const OUT = path.join(process.cwd(), 'lib', 'content-repairs.gen.ts')

function readScratch(): ContentRepairEntry[] {
  try {
    const raw = fs.readFileSync(SCRATCH, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ContentRepairEntry[]) : []
  } catch {
    return []
  }
}

function writeGenFile(all: ContentRepairEntry[]): void {
  const banner = `// Auto-generated during the generate-*.ts scripts (npm run prebuild) — content
// repairs, skips and flags recorded this build (P1-a, "repair, don't refuse": no CMS
// content state may fail the build). Do not edit manually. See lib/content-repair-log.ts.
//
// 🔴 COMMITTED AS A STUB (like lib/redirects.gen.ts and lib/blog-wp.gen.ts), so a fresh
// clone and app/sys/seo-state/route.ts both resolve before the first generate runs.

import type { ContentRepairEntry } from './content-repair-types'

export const CONTENT_REPAIRS: ContentRepairEntry[] = ${JSON.stringify(all, null, 2)}
`
  fs.writeFileSync(OUT, banner, 'utf-8')
}

/**
 * Record this generator's content repairs/skips/flags for the current build, replacing
 * only the entries of the `type`s it owns, and print one `CONTENT-REPAIR`-prefixed
 * build-log line per entry.
 */
export function recordContentRepairs(ownedTypes: string[], entries: ContentRepairEntry[]): void {
  const prior = readScratch().filter((e) => !ownedTypes.includes(e.type))
  const all = [...prior, ...entries]
  fs.writeFileSync(SCRATCH, JSON.stringify(all), 'utf-8')
  writeGenFile(all)
  for (const e of entries) {
    console.log(`CONTENT-REPAIR ${e.action} ${e.type}:${e.ref} field=${e.field} — ${e.detail}`)
  }
}
