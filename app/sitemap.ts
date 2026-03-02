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
  { slug: 'why-privacy-cant-be-an-afterthought', lastModified: '2026-03-02' },
  { slug: 'why-swiss-infrastructure-matters-for-data-privacy', lastModified: '2026-03-02' },
  { slug: 'biggest-data-breaches-2025-2026', lastModified: '2026-03-02' },
  { slug: 'pulse-vs-google-analytics-plausible-fathom', lastModified: '2026-03-02' },
  { slug: 'drop-vs-wetransfer-google-drive-dropbox-encrypted-file-sharing', lastModified: '2026-03-02' },
  { slug: 'privacy-statistics-2026', lastModified: '2026-03-02' },
  { slug: 'open-source-privacy-tools-2026', lastModified: '2026-03-02' },
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
