import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'learn')

export interface LearnArticleMeta {
  slug: string
  product: string
  title: string
  description: string
  category: string
  auditId: string
  googleUrl: string
  date: string
}

export interface LearnArticle extends LearnArticleMeta {
  content: string
}

export function getLearnArticles(): LearnArticleMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const products = fs.readdirSync(CONTENT_DIR).filter((d) =>
    fs.statSync(path.join(CONTENT_DIR, d)).isDirectory()
  )

  const articles: LearnArticleMeta[] = []

  for (const product of products) {
    const productDir = path.join(CONTENT_DIR, product)
    const files = fs.readdirSync(productDir).filter((f) => f.endsWith('.mdx'))

    for (const filename of files) {
      const slug = filename.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(productDir, filename), 'utf-8')
      const { data } = matter(raw)

      articles.push({
        slug,
        product,
        title: data.title,
        description: data.description,
        category: data.category,
        auditId: data.auditId,
        googleUrl: data.googleUrl,
        date: data.date,
      })
    }
  }

  return articles.sort((a, b) => a.title.localeCompare(b.title))
}

export function getLearnArticle(product: string, slug: string): LearnArticle | null {
  const filePath = path.join(CONTENT_DIR, product, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    product,
    title: data.title,
    description: data.description,
    category: data.category,
    auditId: data.auditId,
    googleUrl: data.googleUrl,
    date: data.date,
    content,
  }
}
