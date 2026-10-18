import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPost } from '@/lib/blog'
import { BlogPostPage as OverhaulPost } from '@/components/overhaul/blog/BlogPost'
import { UNPUBLISHED } from '@/components/overhaul/blog/content'
import { postCardImages } from '@/lib/og/cards'

// 'blog' is a runtime kind (lib/cms/runtime-config.ts): every post renders per request from the
// content zone. 🔴 This must be the literal: with no `dynamic` export, an unlisted slug renders once
// and is then ISR-cached for a year (measured: `x-nextjs-cache: HIT`, `s-maxage=31536000`), which
// would freeze a post at its first render. There is deliberately no generateStaticParams.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return {}
  const card = postCardImages(slug, post.title)

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://ciphera.net/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} | Ciphera`,
      description: post.description,
      url: `https://ciphera.net/blog/${slug}`,
      siteName: 'Ciphera',
      type: 'article',
      locale: 'en_US',
      publishedTime: post.date.slice(0, 10),
      ...(post.dateModified ? { modifiedTime: post.dateModified.slice(0, 10) } : {}),
      // The post's card from the OG system (D52), not its cover art: the cover stays on the blog index (D38). The
      // declared size is the card's real one (lib/og/url.ts); a scraper lays the card out from it before the image
      // arrives, so a wrong pair letterboxes or crops the unfurl.
      images: card.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Ciphera`,
      description: post.description,
      images: card.twitter,
    },
  }
}

/** The post page as ruled (D37, plan §5i): option A, opening with the sunrise. */
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // The four D39 posts redirect before they reach here (lib/redirects.gen.ts); until the CMS unpublishes them, a request
  // that gets past the redirect must not render a post the site no longer lists.
  if ((UNPUBLISHED as readonly string[]).includes(slug)) notFound()
  return <OverhaulPost variant="a" slug={slug} />
}
