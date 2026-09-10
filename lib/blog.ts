import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { wpPosts } from './blog-wp.gen'
import type { BlogPostBody, BlogPostCta, BlogPostFaq } from './blog-types'

export type { BlogPostBody, BlogPostCta, BlogPostFaq }

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

export interface BlogPost extends BlogPostMeta {
  content: string
  faqs: BlogPostFaq[]
  cta?: BlogPostCta
  /** Which renderer the body needs. See lib/blog-types.ts for why this is a union. */
  body: BlogPostBody
  /** Words of prose, tags excluded. Feeds the BlogPosting JSON-LD. */
  wordCount: number
}

/**
 * 🔴 A SLUG IN BOTH SOURCES IS A BUILD FAILURE, NOT A PRECEDENCE RULE.
 * Design §8.0. Picking a winner would mean one of two files silently stops being the
 * page — and whichever rule we chose, somebody would eventually edit the wrong one and
 * see no effect, with the site serving content from a file they are not looking at.
 * Throwing here fails `next build`, which is loud, immediate and attributable.
 *
 * ⚠️ This runs at module scope on purpose: it must fire even if the colliding post is
 * never requested by generateStaticParams.
 */
function mdxSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, ''))
}

const collisions = mdxSlugs().filter((s) => wpPosts.some((p) => p.slug === s))
if (collisions.length > 0) {
  throw new Error(
    `Blog slug collision — the same post exists in BOTH content/blog/*.mdx and WordPress: ` +
      `${collisions.join(', ')}.\n` +
      `Resolve it by deleting one. Do not add a precedence rule: whichever source lost would ` +
      `silently stop being the page, and the next person to edit it would see no effect.`
  )
}

/** Words of prose in a Markdown body — the pre-existing calculation, kept verbatim. */
function mdxWordCount(content: string): number {
  return content.split(/\s+/).length
}

function metaFromWp(p: (typeof wpPosts)[number]): BlogPostMeta {
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    date: p.date,
    dateModified: p.dateModified,
    readTime: p.readTime,
    image: p.image,
  }
}

export function getBlogPosts(): BlogPostMeta[] {
  const posts: BlogPostMeta[] = []

  if (fs.existsSync(CONTENT_DIR)) {
    const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))
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
  }

  for (const p of wpPosts) posts.push(metaFromWp(p))

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (fs.existsSync(filePath)) {
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
      cta:
        data.cta && typeof data.cta.label === 'string' && typeof data.cta.href === 'string'
          ? { label: data.cta.label, href: data.cta.href }
          : undefined,
      body: { kind: 'mdx', content },
      wordCount: mdxWordCount(content),
    }
  }

  const wp = wpPosts.find((p) => p.slug === slug)
  if (!wp) return null

  return {
    ...metaFromWp(wp),
    // `content` stays the raw body because TableOfContents reads it — and it already
    // handles both, trying `/^##\s+/gm` first and falling back to DOMParser on HTML.
    content: wp.html,
    faqs: wp.faqs,
    cta: wp.cta,
    body: { kind: 'html', content: wp.html },
    wordCount: wp.wordCount,
  }
}
