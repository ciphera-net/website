import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'learn')
const OUTPUT_PATH = path.join(process.cwd(), 'lib', 'learn-articles.gen.ts')

const files = fs.existsSync(CONTENT_DIR)
  ? fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))
  : []

const articles = files
  .map((filename) => {
    const slug = filename.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8')
    const { data } = matter(raw)
    return {
      slug,
      title: data.title as string,
      description: data.description as string,
      category: data.category as string,
    }
  })
  .sort((a, b) => a.title.localeCompare(b.title))

const output = `// Auto-generated from content/learn/*.mdx — do not edit manually
// Run: npm run generate:learn

export interface LearnArticleSummary {
  slug: string
  title: string
  description: string
  category: string
}

export const learnArticles: LearnArticleSummary[] = ${JSON.stringify(articles, null, 2)}
`

fs.writeFileSync(OUTPUT_PATH, output, 'utf-8')
console.log(`Generated ${articles.length} learn articles → lib/learn-articles.gen.ts`)
