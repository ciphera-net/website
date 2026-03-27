import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'learn')
const OUTPUT_PATH = path.join(process.cwd(), 'lib', 'learn-articles.gen.ts')

const products = fs.existsSync(CONTENT_DIR)
  ? fs.readdirSync(CONTENT_DIR).filter((d) =>
      fs.statSync(path.join(CONTENT_DIR, d)).isDirectory()
    )
  : []

const articles: { slug: string; product: string; title: string; description: string; category: string }[] = []

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
      title: data.title as string,
      description: data.description as string,
      category: data.category as string,
    })
  }
}

articles.sort((a, b) => a.title.localeCompare(b.title))

const output = `// Auto-generated from content/learn/**/*.mdx — do not edit manually
// Run: npm run generate:learn

export interface LearnArticleSummary {
  slug: string
  product: string
  title: string
  description: string
  category: string
}

export const learnArticles: LearnArticleSummary[] = ${JSON.stringify(articles, null, 2)}
`

fs.writeFileSync(OUTPUT_PATH, output, 'utf-8')
console.log(`Generated ${articles.length} learn articles → lib/learn-articles.gen.ts`)
