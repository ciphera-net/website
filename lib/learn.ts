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

/** How every article file and product folder is named. A `..`, a slash or any other character can never name one. */
const SEGMENT = /^[a-z0-9-]+$/

/** The file an article would live in, or null when the pair cannot name one (the URL's own text never reaches path.join). */
function articleFile(product: string, slug: string): string | null {
  if (!SEGMENT.test(product) || !SEGMENT.test(slug)) return null
  return path.join(CONTENT_DIR, product, `${slug}.mdx`)
}

/**
 * Whether /learn/<product>/<slug> has an article: the ONE answer, used by getLearnArticle and asked by proxy.ts before
 * anything renders (lib/routing/not-found-routes.mjs says why the proxy must ask).
 */
export function learnArticleExists(product: string, slug: string): boolean {
  const filePath = articleFile(product, slug)
  return filePath !== null && fs.existsSync(filePath)
}

export function getLearnArticle(product: string, slug: string): LearnArticle | null {
  if (!learnArticleExists(product, slug)) return null
  const filePath = articleFile(product, slug) as string

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
