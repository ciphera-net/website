/**
 * The blog's shared shape, across both sources.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.7
 *
 * 🔑 `lib/blog.ts` IS THE UNION POINT, NOT `lib/blog-posts.gen.ts`. Both are seams,
 * but they are not the same seam: `app/feed.xml/route.ts` and `app/blog/page.tsx` read
 * the generated summary file, while `app/sitemap.ts`, `scripts/generate-llms.ts` and
 * `RelatedPosts` read `lib/blog.ts` off the filesystem. Unioning here means those three
 * change by ZERO lines; unioning at the generated file would have left the sitemap and
 * llms.txt blind to every WordPress post.
 */

export interface BlogPostFaq {
  question: string
  answer: string
}

/** Optional per-post CTA override; when absent the template falls back to its category. */
export interface BlogPostCta {
  label: string
  href: string
}

/**
 * A post's body and where it came from.
 *
 * 🔴 A DISCRIMINATED UNION, NOT A `isWordPress` FLAG. The renderer picks MDXRemote or
 * the rehype pipeline on this, and the two are not interchangeable: MDX parses raw HTML
 * as JSX, so `class=` throws, HTML comments throw, and any `{` in prose becomes an
 * expression. A boolean would let a caller read `content` without knowing which it has.
 */
export type BlogPostBody =
  | { kind: 'mdx'; content: string }
  | { kind: 'html'; content: string }

/** What `generate-blog-posts.ts` writes for each WordPress-sourced post. */
export interface WpBlogPost {
  slug: string
  title: string
  description: string
  category: string
  date: string
  dateModified: string
  readTime: string
  image: string
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
