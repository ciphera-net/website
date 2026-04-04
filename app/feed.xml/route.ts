import { blogPosts } from '../../lib/blog-posts.gen'

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

export function GET() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const items = sortedPosts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>https://ciphera.net/blog/${post.slug}</link>
      <guid isPermaLink="true">https://ciphera.net/blog/${post.slug}</guid>
      <pubDate>${toRFC822(post.date)}</pubDate>
      <category>${escapeXml(post.category)}</category>
    </item>`
    )
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ciphera Blog - Privacy &amp; Security Insights</title>
    <description>Privacy and security insights from the Ciphera team.</description>
    <link>https://ciphera.net/blog</link>
    <language>en</language>
    <atom:link href="https://ciphera.net/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${toRFC822(sortedPosts[0].date)}</lastBuildDate>
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
