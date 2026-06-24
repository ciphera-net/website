import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  category: string
  date: string
  dateModified: string
  readTime: string
  /** Relative path (e.g. /blog/og/<slug>.png); resolve with cdnUrl() at the point of use. */
  image: string
}

export interface BlogPostFaq {
  question: string
  answer: string
}

export interface BlogPost extends BlogPostMeta {
  content: string
  faqs: BlogPostFaq[]
}

export function getBlogPosts(): BlogPostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))
  const posts: BlogPostMeta[] = []

  for (const filename of files) {
    const slug = filename.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8')
    const { data } = matter(raw)

    posts.push({
      slug,
      title: data.title,
      description: data.description,
      category: data.category,
      date: data.date,
      dateModified: data.dateModified || data.date,
      readTime: data.readTime,
      image: data.image || `/blog/og/${slug}.png`,
    })
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title,
    description: data.description,
    category: data.category,
    date: data.date,
    dateModified: data.dateModified || data.date,
    readTime: data.readTime,
    image: data.image || `/blog/og/${slug}.png`,
    content,
    faqs: data.faqs || [],
  }
}
