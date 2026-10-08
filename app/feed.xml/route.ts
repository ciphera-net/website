import { getBlogPosts } from '../../lib/blog'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRFC822(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00Z')
  return date.toUTCString()
}

export async function GET() {
  const blogPosts = await getBlogPosts()
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // 🔑 P1-a GUARD: `blogPosts` can legitimately be empty now — every post individually
  // unshippable in the same build, or the generator's one live-site escape hatch
  // (/sys/seo-state) itself unreachable. Before P1-a a single bad post failed the whole
  // build, which made `sortedPosts[0]` always safe; it no longer is.
  const lastBuildDate = sortedPosts.length > 0 ? toRFC822(sortedPosts[0].date) : new Date().toUTCString()

  const items = sortedPosts
    .map((post) => {
      // 🔴 THE SLUG IS ESCAPED HERE TOO, IN ADDITION TO lib/blog-transform.ts's WP_SLUG
      // shape check. That check keeps a malformed slug out of the build entirely, but
      // this route reads whatever lib/blog-posts.gen.ts hands it — defence in depth,
      // same reasoning as title/description/category already getting escapeXml below.
      // Ported from pulse-website@1c08fa7 (PULSE-243).
      const url = escapeXml(`https://ciphera.net/blog/${post.slug}`)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRFC822(post.date)}</pubDate>
      <category>${escapeXml(post.category)}</category>
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ciphera Blog - Privacy &amp; Security Insights</title>
    <description>Privacy and security insights from the Ciphera team.</description>
    <link>https://ciphera.net/blog</link>
    <language>en</language>
    <atom:link href="https://ciphera.net/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
