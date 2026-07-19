import { promises as fs } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'transparency')
const CANARY_DIR = path.join(CONTENT_ROOT, 'canaries')
const REPORT_DIR = path.join(CONTENT_ROOT, 'reports')

// * Base path where the canary/report static files are served. Must match the
// * DEST of scripts/sync-transparency.ts (public/trust/) — change both together
// * or every download link on the site 404s. The old /transparency/* paths are
// * covered by a permanent redirect in next.config.ts that can never be removed
// * (the 2026-04..07 signed canaries cite /transparency URLs in signed bytes).
export const TRUST_FILES_BASE = '/trust'

export interface Canary {
  period: string
  periodLabel: string
  text: string
  publishedEuropean: string
  publishedISO: string
  nextUpdateEuropean: string
  isOverdue: boolean
  plaintextUrl: string
  signatureUrl: string
  pubkeyUrl: string
}

export interface TransparencyReport {
  slug: string
  title: string
  period: string
  periodEnd: string
  publishedEuropean: string
  publishedISO: string
  nextDue: string
  status: 'interim' | 'final'
  bodyMarkdown: string
}

function europeanToISO(dmy: string): string {
  const [d, m, y] = dmy.split('-')
  return `${y}-${m}-${d}`
}

// * "Today" at UTC midnight, compared against the canary's next-update date
// * (also UTC midnight) so overdue status flips exactly on the calendar day,
// * independent of server timezone/time-of-day.
function isPastEuropeanDate(dmy: string): boolean {
  const deadline = new Date(`${europeanToISO(dmy)}T00:00:00Z`)
  const todayISO = new Date().toISOString().slice(0, 10)
  const today = new Date(`${todayISO}T00:00:00Z`)
  return today > deadline
}

function parseCanaryField(text: string, label: 'Published' | 'Next update'): string {
  const re = new RegExp(`^${label}:\\s*(?:on or before\\s+)?(\\d{2}-\\d{2}-\\d{4})`, 'im')
  const m = text.match(re)
  if (!m) throw new Error(`Canary missing "${label}" line in DD-MM-YYYY format`)
  return m[1]
}

async function parseCanaryFile(name: string): Promise<Canary> {
  const period = name.replace(/\.txt$/, '')
  const text = await fs.readFile(path.join(CANARY_DIR, name), 'utf8')

  const publishedEuropean = parseCanaryField(text, 'Published')
  const nextUpdateEuropean = parseCanaryField(text, 'Next update')
  const periodMatch = text.match(/^Period:\s*(.+)/im)
  const periodLabel = periodMatch ? periodMatch[1].trim() : period

  return {
    period,
    periodLabel,
    text,
    publishedEuropean,
    publishedISO: europeanToISO(publishedEuropean),
    nextUpdateEuropean,
    isOverdue: isPastEuropeanDate(nextUpdateEuropean),
    plaintextUrl: `${TRUST_FILES_BASE}/canary-${period}.txt`,
    signatureUrl: `${TRUST_FILES_BASE}/canary-${period}.txt.asc`,
    pubkeyUrl: `${TRUST_FILES_BASE}/canary-pubkey.asc`,
  }
}

// * Every canary text file on disk, newest period first. Prior months are
// * served statically from public/trust/ (mirrored 1:1 with
// * content/transparency/canaries/ at build time), so linking to them here
// * requires no new routes.
export async function listCanaries(): Promise<Canary[]> {
  const entries = await fs.readdir(CANARY_DIR)
  const textFiles = entries
    .filter((n) => /^\d{4}-\d{2}\.txt$/.test(n))
    .sort()
    .reverse()
  return Promise.all(textFiles.map(parseCanaryFile))
}

export async function getCurrentCanary(): Promise<Canary> {
  const entries = await fs.readdir(CANARY_DIR)
  const textFiles = entries
    .filter((n) => /^\d{4}-\d{2}\.txt$/.test(n))
    .sort()
    .reverse()
  if (textFiles.length === 0) {
    throw new Error('No canary text file found in content/transparency/canaries/')
  }
  return parseCanaryFile(textFiles[0])
}

export async function listReports(): Promise<TransparencyReport[]> {
  const entries = await fs.readdir(REPORT_DIR)
  const mds = entries.filter((n) => n.endsWith('.md')).sort().reverse()
  const reports: TransparencyReport[] = []
  for (const name of mds) {
    const raw = await fs.readFile(path.join(REPORT_DIR, name), 'utf8')
    const parsed = matter(raw)
    const slug = name.replace(/\.md$/, '')
    const publishedEuropean = String(parsed.data.published ?? '')
    const publishedISO =
      typeof parsed.data.publishedISO === 'string' && parsed.data.publishedISO
        ? parsed.data.publishedISO
        : europeanToISO(publishedEuropean)
    reports.push({
      slug,
      title: String(parsed.data.title ?? slug),
      period: String(parsed.data.period ?? slug),
      periodEnd: String(parsed.data.periodEnd ?? ''),
      publishedEuropean,
      publishedISO,
      nextDue: String(parsed.data.nextDue ?? ''),
      status: parsed.data.status === 'final' ? 'final' : 'interim',
      bodyMarkdown: parsed.content,
    })
  }
  return reports
}

export async function getCurrentReport(): Promise<TransparencyReport> {
  const reports = await listReports()
  if (reports.length === 0) {
    throw new Error('No transparency reports found')
  }
  return reports[0]
}
