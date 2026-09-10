import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import { BlogPostView } from '@/components/blog/post-view'
import { cdnUrl } from '@/lib/cdn'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

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
      // 🔴 1200×630, which is what the cards ACTUALLY are. This route declared
      // 1376×768 until 03-09-2026 — the only route on the site that did; every
      // other page already said 1200×630, and the OG generation recipe
      // (Public/docs/og-image-generation.md) mandates 1200×630 as the spec the
      // compositor screenshots at.
      //
      // The dimensions are not decoration: a scraper lays the card out from the
      // DECLARED size before the image arrives, so a wrong pair reserves the
      // wrong box and the unfurl letterboxes or crops. It is invisible in
      // review — the HTML is well-formed and the image loads — and only shows
      // up in somebody else's Slack.
      images: [{ url: cdnUrl(post.image), width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Ciphera`,
      description: post.description,
      images: [cdnUrl(post.image)],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  return <BlogPostView post={post} allPosts={getBlogPosts()} />
}

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }))
}
