import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'learn')

export interface LearnArticleMeta {
  slug: string
  title: string
  description: string
  category: 'performance' | 'accessibility' | 'best-practices' | 'seo'
  auditId: string
  googleUrl: string
  date: string
}

export interface LearnArticle extends LearnArticleMeta {
  content: string
}

export function getLearnArticles(): LearnArticleMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8')
      const { data } = matter(raw)

      return {
        slug,
        title: data.title,
        description: data.description,
        category: data.category,
        auditId: data.auditId,
        googleUrl: data.googleUrl,
        date: data.date,
      } as LearnArticleMeta
    })
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function getLearnArticle(slug: string): LearnArticle | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title,
    description: data.description,
    category: data.category,
    auditId: data.auditId,
    googleUrl: data.googleUrl,
    date: data.date,
    content,
  } as LearnArticle
}
