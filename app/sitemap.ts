import { MetadataRoute } from 'next'
import { getLearnArticles } from '@/lib/learn'
import { getBlogPosts } from '@/lib/blog'
import { glossaryTerms } from '@/lib/glossary'

/**
 * Sitemap for ciphera.net
 *
 * Guidelines:
 * - Only include pages that return 200 and are indexable (no noindex, no redirect)
 * - Use real lastmod dates (file modification or content publish date), not build time
 * - Do not include priority or changeFrequency (ignored by Google and Bing)
 * - Do not include blog posts until they have substantive content (avoid thin-content indexing)
 * - Blog post dates are read from MDX frontmatter via getBlogPosts()
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ciphera.net'

  const staticPages: MetadataRoute.Sitemap = [
    // Core pages
    {
      url: baseUrl,
      lastModified: '2026-02-28',
    },
    {
      url: `${baseUrl}/about`,
      lastModified: '2026-03-02',
    },
    {
      url: `${baseUrl}/sustainability`,
      lastModified: '2026-04-11',
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: '2026-02-28',
    },
    // Product detail pages
    {
      url: `${baseUrl}/products/pulse`,
      lastModified: '2026-03-02',
    },
    {
      url: `${baseUrl}/products/id`,
      lastModified: '2026-04-17',
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
      lastModified: '2026-03-06',
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: '2026-03-06',
    },
    {
      url: `${baseUrl}/security`,
      lastModified: '2026-07-19',
    },

    // Blog index (include even if posts are drafts -- the index page itself is valid)
    {
      url: `${baseUrl}/blog`,
      lastModified: '2026-03-16',
    },

    // Learn index
    {
      url: `${baseUrl}/learn`,
      lastModified: '2026-03-27',
    },
  ]

  // Glossary index + every term page (all statically generated)
  const glossaryPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/glossary`, lastModified: '2026-07-10' },
    ...glossaryTerms.map((term) => ({
      url: `${baseUrl}/glossary/${term.slug}`,
      lastModified: '2026-07-10',
    })),
  ]

  // Dynamically add published blog posts
  const blogPages: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.dateModified,
  }))

  // Dynamically add published learn articles
  const learnPages: MetadataRoute.Sitemap = getLearnArticles().map((article) => ({
    url: `${baseUrl}/learn/${article.product}/${article.slug}`,
    lastModified: article.date,
  }))

  return [...staticPages, ...glossaryPages, ...blogPages, ...learnPages]
}
