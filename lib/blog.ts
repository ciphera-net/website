import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { wpPosts } from './blog-wp.gen'
import type { BlogPostBody, BlogPostCta, BlogPostFaq, BlogPostMeta, WpBlogPost } from './blog-types'
import { getContentDocument, getContentIndex } from './cms/content-client'
import { isRuntimeKind, SITE_KEY } from './cms/runtime-config'

export type { BlogPostBody, BlogPostCta, BlogPostFaq, BlogPostMeta }

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')
const KIND = 'blog'
/** The only item shape this build knows how to read — bumped by the publisher side
 * whenever `WpBlogPost`'s shape changes incompatibly (see lib/cms/glossary-build.ts's
 * KNOWN_SCHEMA for the same convention). */
const KNOWN_SCHEMA = 1

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
 * 🔴 A SLUG IN BOTH SOURCES IS A BUILD FAILURE AT BUILD TIME, A SILENT MDX WIN AT
 * REQUEST TIME. Design §8.0 for the build-time half, unchanged: picking a winner at
 * build would mean one of two files silently stops being the page. That throw stays,
 * module-scope, against the SEED (`wpPosts`) — it must fire even if the colliding post
 * is never requested.
 *
 * ⚠️ WEB-26 round 2: once 'blog' is a runtime kind, a NEW collision becomes possible —
 * an editor publishes a WordPress post whose slug matches a git-tracked MDX file,
 * after the last build. There is no safe build-failure equivalent at request time (it
 * would take the whole site's blog down for an editorial mistake), so the async seam
 * below applies the SAME precedence the build already chose (MDX wins) silently,
 * rather than throwing — see resolvePosts()/resolvePost().
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

function metaFromWp(p: Pick<WpBlogPost, 'slug' | 'title' | 'description' | 'category' | 'date' | 'dateModified' | 'readTime' | 'image'>): BlogPostMeta {
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

function postFromWp(wp: WpBlogPost): BlogPost {
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

function mdxPostsMeta(): BlogPostMeta[] {
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
  return posts
}

function sortPosts<T extends { date: string; slug: string }>(posts: T[]): T[] {
  // 🔴 A DATE ALONE IS NOT A TOTAL ORDER, AND THE CORPUS HAS THREE POSTS ON 2026-07-22.
  // The slug is a stable, meaningful tiebreak — see the pre-WEB-26 history of this file.
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || a.slug.localeCompare(b.slug)
  )
}

/** The build-time seed, exactly as the pre-WEB-26 getBlogPosts() computed it — the
 * flag-off path, and the only path scripts/generate-llms.ts (a build CLI script with
 * no request to serve) ever takes. */
export function getBlogPostsSeed(): BlogPostMeta[] {
  return sortPosts([...mdxPostsMeta(), ...wpPosts.map(metaFromWp)])
}

/** The build-time seed for one post, exactly as the pre-WEB-26 getBlogPost() computed it. */
export function getBlogPostSeed(slug: string): BlogPost | null {
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
  return wp ? postFromWp(wp) : null
}

export type BlogSource = 'cdn' | 'seed'

export interface BlogRuntimeState {
  enabled: boolean
  source: BlogSource
  indexWatermark?: string
  publishedAt?: string
}

let lastState: BlogRuntimeState = { enabled: isRuntimeKind(KIND), source: 'seed' }

/** `/sys/seo-state`'s runtime block reads this — forces a fresh resolution first. */
export async function getBlogRuntimeState(): Promise<BlogRuntimeState> {
  await resolvePosts()
  return lastState
}

async function resolvePosts(): Promise<BlogPostMeta[]> {
  const mdx = mdxPostsMeta()
  const mdxSlugSet = new Set(mdx.map((p) => p.slug))

  if (!isRuntimeKind(KIND)) {
    lastState = { enabled: false, source: 'seed' }
    return sortPosts([...mdx, ...wpPosts.map(metaFromWp)])
  }

  try {
    const index = await getContentIndex(SITE_KEY)
    const kind = index?.kinds?.[KIND]
    if (!index || !kind || kind.schema !== KNOWN_SCHEMA) {
      lastState = { enabled: true, source: 'seed' }
      return sortPosts([...mdx, ...wpPosts.map(metaFromWp)])
    }

    const seedBySlug = new Map(wpPosts.map((p) => [p.slug, p]))
    const cdnPosts: BlogPostMeta[] = []
    for (const [slug, docPath] of Object.entries(kind.items)) {
      // MDX wins — see the module header. A CDN-published post whose slug collides
      // with a git-tracked MDX file is silently never served, matching the build.
      if (mdxSlugSet.has(slug)) continue
      try {
        cdnPosts.push(metaFromWp(await getContentDocument<WpBlogPost>(docPath)))
      } catch {
        const fallback = seedBySlug.get(slug)
        if (fallback) cdnPosts.push(metaFromWp(fallback))
      }
    }
    lastState = { enabled: true, source: 'cdn', indexWatermark: kind.watermark, publishedAt: index.published_at }
    return sortPosts([...mdx, ...cdnPosts])
  } catch {
    lastState = { enabled: true, source: 'seed' }
    return sortPosts([...mdx, ...wpPosts.map(metaFromWp)])
  }
}

async function resolvePost(slug: string): Promise<BlogPost | null> {
  // MDX always wins, and is never a network call — see the module header.
  const seedMdx = getBlogPostSeed(slug)
  if (seedMdx && seedMdx.body.kind === 'mdx') return seedMdx

  if (!isRuntimeKind(KIND)) return getBlogPostSeed(slug)

  try {
    const index = await getContentIndex(SITE_KEY)
    const kind = index?.kinds?.[KIND]
    const docPath = kind?.schema === KNOWN_SCHEMA ? kind.items[slug] : undefined
    if (!docPath) return getBlogPostSeed(slug)
    try {
      return postFromWp(await getContentDocument<WpBlogPost>(docPath))
    } catch {
      return getBlogPostSeed(slug)
    }
  } catch {
    return getBlogPostSeed(slug)
  }
}

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  return resolvePosts()
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return resolvePost(slug)
}
