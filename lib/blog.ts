import { wpPosts } from './blog-wp.gen'
import type { BlogPostCta, BlogPostFaq, BlogPostMeta, WpBlogPost } from './blog-types'
import { getContentDocument, getContentIndex } from './cms/content-client'
import { isRuntimeKind, SITE_KEY } from './cms/runtime-config'

export type { BlogPostCta, BlogPostFaq, BlogPostMeta }

/**
 * The blog, from WordPress only (23-10-2026: the git-tracked MDX source is retired; content/blog/ held no post since the
 * move into the CMS on 10-09-2026, and the post template never rendered an MDX body). The CDN's published documents
 * answer at request time when 'blog' is a runtime kind, and the build's seed (lib/blog-wp.gen.ts) otherwise or when
 * they cannot be read.
 */
const KIND = 'blog'
/** The only item shape this build knows how to read — bumped by the publisher side
 * whenever `WpBlogPost`'s shape changes incompatibly (see lib/cms/glossary-build.ts's
 * KNOWN_SCHEMA for the same convention). */
const KNOWN_SCHEMA = 1

export interface BlogPost extends BlogPostMeta {
  /** WordPress's rendered body, sanitised where it becomes elements (components/overhaul/blog/PostBody.tsx). */
  html: string
  faqs: BlogPostFaq[]
  cta?: BlogPostCta
  /** Words of prose, tags excluded. Feeds the BlogPosting JSON-LD. */
  wordCount: number
}

function metaFromWp(p: Pick<WpBlogPost, 'slug' | 'title' | 'description' | 'category' | 'date' | 'dateModified' | 'readTime'>): BlogPostMeta {
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    date: p.date,
    dateModified: p.dateModified,
    readTime: p.readTime,
  }
}

function postFromWp(wp: WpBlogPost): BlogPost {
  return {
    ...metaFromWp(wp),
    html: wp.html,
    faqs: wp.faqs,
    cta: wp.cta,
    wordCount: wp.wordCount,
  }
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
  return sortPosts(wpPosts.map(metaFromWp))
}

/** The build-time seed for one post, exactly as the pre-WEB-26 getBlogPost() computed it. */
export function getBlogPostSeed(slug: string): BlogPost | null {
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
  if (!isRuntimeKind(KIND)) {
    lastState = { enabled: false, source: 'seed' }
    return sortPosts(wpPosts.map(metaFromWp))
  }

  try {
    const index = await getContentIndex(SITE_KEY)
    const kind = index?.kinds?.[KIND]
    if (!index || !kind || kind.schema !== KNOWN_SCHEMA) {
      lastState = { enabled: true, source: 'seed' }
      return sortPosts(wpPosts.map(metaFromWp))
    }

    const seedBySlug = new Map(wpPosts.map((p) => [p.slug, p]))
    const cdnPosts: BlogPostMeta[] = []
    for (const [slug, docPath] of Object.entries(kind.items)) {
      try {
        cdnPosts.push(metaFromWp(await getContentDocument<WpBlogPost>(docPath)))
      } catch {
        const fallback = seedBySlug.get(slug)
        if (fallback) cdnPosts.push(metaFromWp(fallback))
      }
    }
    lastState = { enabled: true, source: 'cdn', indexWatermark: kind.watermark, publishedAt: index.published_at }
    return sortPosts(cdnPosts)
  } catch {
    lastState = { enabled: true, source: 'seed' }
    return sortPosts(wpPosts.map(metaFromWp))
  }
}

async function resolvePost(slug: string): Promise<BlogPost | null> {
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
