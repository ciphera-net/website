import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')
const OUTPUT_PATH = path.join(process.cwd(), 'lib', 'blog-posts.gen.ts')

const files = fs.existsSync(CONTENT_DIR)
  ? fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))
  : []

const posts: {
  slug: string
  title: string
  description: string
  category: string
  date: string
  dateModified: string
  readTime: string
  image: string
}[] = []

for (const filename of files) {
  const slug = filename.replace(/\.mdx$/, '')
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8')
  const { data } = matter(raw)
  posts.push({
    slug,
    title: data.title as string,
    description: data.description as string,
    category: data.category as string,
    date: data.date as string,
    dateModified: (data.dateModified || data.date) as string,
    readTime: data.readTime as string,
    image: (data.image || `/blog/og/${slug}.png`) as string,
  })
}

posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const output = `// Auto-generated from content/blog/*.mdx — do not edit manually
// Run: npm run generate:blog

export interface BlogPostSummary {
  slug: string
  title: string
  description: string
  category: string
  date: string
  dateModified: string
  readTime: string
  image: string
}

export const blogPosts: BlogPostSummary[] = ${JSON.stringify(posts, null, 2)}
`

fs.writeFileSync(OUTPUT_PATH, output, 'utf-8')
console.log(`Generated ${posts.length} blog posts → lib/blog-posts.gen.ts`)
