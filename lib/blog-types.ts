/**
 * The blog's shared shape. WordPress is the only source (the git-tracked MDX posts were retired 23-10-2026).
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.7
 *
 * 🔑 EVERY READER OF A PUBLISHED POST GOES THROUGH `lib/blog.ts`: the index, the posts, the homepage block, the feed,
 * the sitemap and the cards ask it, and `scripts/generate-llms.ts` takes its build seed. It answers from the CMS's
 * published documents at request time and from the build's seed (`lib/blog-wp.gen.ts`) otherwise. A draft is not
 * published: the preview (app/preview/[slug]) reads it from WordPress through `lib/blog-transform.ts`.
 */

export interface BlogPostFaq {
  question: string
  answer: string
}

/**
 * A post's list-view fields — what the blog index and feed render without needing the
 * body. Lives here, not in `lib/blog.ts`, so a client component (which must never
 * import that module: it carries every post's body, __tests__/client-boundary.test.mjs)
 * can still type the prop it receives from its server parent (WEB-26 round 2; first for
 * components/blog/blog-page-client.tsx, removed 23-10-2026).
 */
export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  category: string
  date: string
  dateModified: string
  readTime: string
}

/** Optional per-post CTA override; when absent the template falls back to its category. */
export interface BlogPostCta {
  label: string
  href: string
}

/** What `generate-blog-posts.ts` writes for each WordPress-sourced post. */
export interface WpBlogPost {
  slug: string
  title: string
  description: string
  category: string
  date: string
  dateModified: string
  readTime: string
  /** Sanitised, CDN-rewritten HTML. Never raw WordPress output. */
  html: string
  faqs: BlogPostFaq[]
  cta?: BlogPostCta
  /**
   * 🔴 COMPUTED FROM TEXT AT BUILD TIME, NOT FROM THE MARKUP.
   * The BlogPosting JSON-LD used `content.split(/\s+/).length`, which on HTML counts
   * tags. Wrong `wordCount` is invisible on the page and visible to every crawler.
   */
  wordCount: number
}
