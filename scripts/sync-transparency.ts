import { promises as fs } from 'node:fs'
import path from 'node:path'
import { getCurrentReport } from '../lib/transparency'

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'content', 'transparency', 'canaries')
const DEST = path.join(ROOT, 'public', 'trust')

async function syncCanaries() {
  await fs.mkdir(DEST, { recursive: true })

  const entries = await fs.readdir(SRC, { withFileTypes: true })
  const files = entries.filter((e) => e.isFile() && !e.name.startsWith('.'))

  if (files.length === 0) {
    console.warn('sync-transparency: no canary files found in', SRC)
    return
  }

  for (const file of files) {
    const srcPath = path.join(SRC, file.name)
    const destName = /^\d{4}-\d{2}\.txt(\.asc)?$/.test(file.name)
      ? `canary-${file.name}`
      : file.name
    const destPath = path.join(DEST, destName)
    await fs.copyFile(srcPath, destPath)
    console.log(`sync-transparency: ${file.name} -> public/trust/${destName}`)
  }
}

// * Machine-readable status file for the current transparency report, mirroring
// * the warrant canary's plaintext field convention ("Published:", "Next update:
// * on or before") so a freshness watcher can parse it with the same regex it
// * already uses for the canary — no hardcoded due dates baked into ops scripts.
// * Generated at build time from content/transparency/reports/*.md, the single
// * source of truth also used to render the live /trust pages, so this
// * file can never drift from what's published.
async function generateReportStatus() {
  await fs.mkdir(DEST, { recursive: true })

  const report = await getCurrentReport()
  const destPath = path.join(DEST, 'report-status.txt')

  const lines = [
    'CIPHERA TRANSPARENCY REPORT STATUS',
    '===================================',
    '',
    `Report: ${report.period}`,
    `Status: ${report.status}`,
    `Period end: ${report.periodEnd} (DD-MM-YYYY)`,
    `Published: ${report.publishedEuropean} (DD-MM-YYYY)`,
    `Next update: on or before ${report.nextDue}`,
    '',
  ].join('\n')

  await fs.writeFile(destPath, lines, 'utf8')
  console.log('sync-transparency: generated public/trust/report-status.txt')
}

async function main() {
  await syncCanaries()
  await generateReportStatus()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
