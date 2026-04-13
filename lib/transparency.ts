import { promises as fs } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'transparency')
const CANARY_DIR = path.join(CONTENT_ROOT, 'canaries')
const REPORT_DIR = path.join(CONTENT_ROOT, 'reports')

export interface Canary {
  period: string
  text: string
  publishedEuropean: string
  publishedISO: string
  nextUpdateEuropean: string
  plaintextUrl: string
  signatureUrl: string
  pubkeyUrl: string
}

export interface TransparencyReport {
  slug: string
  title: string
  period: string
  publishedEuropean: string
  publishedISO: string
  status: 'interim' | 'final'
  bodyMarkdown: string
}

function europeanToISO(dmy: string): string {
  const [d, m, y] = dmy.split('-')
  return `${y}-${m}-${d}`
}

function parseCanaryField(text: string, label: 'Published' | 'Next update'): string {
  const re = new RegExp(`^${label}:\\s*(?:on or before\\s+)?(\\d{2}-\\d{2}-\\d{4})`, 'im')
  const m = text.match(re)
  if (!m) throw new Error(`Canary missing "${label}" line in DD-MM-YYYY format`)
  return m[1]
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
  const name = textFiles[0]
  const period = name.replace(/\.txt$/, '')
  const text = await fs.readFile(path.join(CANARY_DIR, name), 'utf8')

  const publishedEuropean = parseCanaryField(text, 'Published')
  const nextUpdateEuropean = parseCanaryField(text, 'Next update')

  return {
    period,
    text,
    publishedEuropean,
    publishedISO: europeanToISO(publishedEuropean),
    nextUpdateEuropean,
    plaintextUrl: `/transparency/canary-${period}.txt`,
    signatureUrl: `/transparency/canary-${period}.txt.asc`,
    pubkeyUrl: `/transparency/canary-pubkey.asc`,
  }
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
      publishedEuropean,
      publishedISO,
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
