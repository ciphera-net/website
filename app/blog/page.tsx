import { getBlogPosts } from '@/lib/blog'
import { jsonLdHtml } from '@/lib/json-ld'
import BlogPageClient from '@/components/blog/blog-page-client'

const blogSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog - Privacy & Security Insights',
    description: 'Learn about zero-knowledge encryption, privacy-first technologies, and secure development practices from the Ciphera team.',
    url: 'https://ciphera.net/blog',
    publisher: { '@id': 'https://ciphera.net/#organization' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Blog' },
    ],
  },
]

/**
 * A server component (WEB-26 round 2) — it is the one that can `await getBlogPosts()`,
 * which reads the CDN once 'blog' is a runtime kind. The interactive search/filter UI
 * stays a client component (components/blog/blog-page-client.tsx) and receives the
 * resolved posts as a plain prop; it never imports lib/blog-posts.gen.ts or lib/blog
 * itself.
 */
export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      {/* 🔑 blogSchema is hardcoded today (no CMS field reaches it), but every blog
        * ld+json block uses jsonLdHtml() for defense in depth — this page is under
        * app/blog/**, and a future field sourced from the CMS must not have to
        * remember to add escaping. Ported from pulse-website@fa3d590 (PULSE-243). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(blogSchema) }} />
      <BlogPageClient posts={posts} />
    </>
  )
}
