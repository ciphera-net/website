import { MetadataRoute } from 'next'

/**
 * Sitemap for ciphera.net
 *
 * Guidelines:
 * - Only include pages that return 200 and are indexable (no noindex, no redirect)
 * - Use real lastmod dates (file modification or content publish date), not build time
 * - Do not include priority or changeFrequency (ignored by Google and Bing)
 * - Do not include blog posts until they have substantive content (avoid thin-content indexing)
 * - Keep blog post dates in sync with the blogPosts data in app/blog/page.tsx
 */

// Blog posts with real content ready for indexing.
// Only add a post here once it has substantive body content (not placeholder text).
// The date should reflect the actual publication or last-edit date.
const publishedBlogPosts: { slug: string; lastModified: string }[] = [
  // Uncomment and update dates as posts are completed:
  // { slug: 'understanding-zero-knowledge-encryption', lastModified: '2026-02-01' },
  // { slug: 'why-swiss-infrastructure', lastModified: '2026-01-28' },
  // { slug: 'building-privacy-first-analytics', lastModified: '2026-01-20' },
  // { slug: 'secure-file-sharing-best-practices', lastModified: '2026-01-15' },
  // { slug: 'gdpr-compliance-guide', lastModified: '2026-01-10' },
  // { slug: 'open-source-security', lastModified: '2026-01-05' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ciphera.net'

  const staticPages: MetadataRoute.Sitemap = [
    // Core pages
    {
      url: baseUrl,
      lastModified: '2026-02-28',
    },
    {
      url: `${baseUrl}/products`,
      lastModified: '2026-03-02',
    },
    {
      url: `${baseUrl}/about`,
      lastModified: '2026-03-02',
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: '2026-03-02',
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: '2026-02-28',
    },
    {
      url: `${baseUrl}/comparison`,
      lastModified: '2026-03-02',
    },

    // Product detail pages
    {
      url: `${baseUrl}/products/drop`,
      lastModified: '2026-03-02',
    },
    {
      url: `${baseUrl}/products/pulse`,
      lastModified: '2026-03-02',
    },
    {
      url: `${baseUrl}/products/auth`,
      lastModified: '2026-03-02',
    },
    {
      url: `${baseUrl}/products/captcha`,
      lastModified: '2026-02-28',
    },
    {
      url: `${baseUrl}/products/relay`,
      lastModified: '2026-03-02',
    },

    // Legal pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: '2026-03-02',
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: '2026-03-02',
    },

    // Blog index (include even if posts are drafts -- the index page itself is valid)
    {
      url: `${baseUrl}/blog`,
      lastModified: '2026-02-28',
    },
  ]

  // Dynamically add published blog posts
  const blogPages: MetadataRoute.Sitemap = publishedBlogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.lastModified,
  }))

  return [...staticPages, ...blogPages]
}
