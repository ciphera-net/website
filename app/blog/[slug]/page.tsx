import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import { isRuntimeKind } from '@/lib/cms/runtime-config'
import { BlogPostView } from '@/components/blog/post-view'
import { cdnUrl } from '@/lib/cdn'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
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
  const post = await getBlogPost(slug)
  if (!post) notFound()

  return <BlogPostView post={post} allPosts={await getBlogPosts()} />
}

export async function generateStaticParams() {
  // 🔴 WEB-26: a runtime kind's params are NOT enumerated at build time — building the
  // full param list would mean an async CDN read during `next build` for a kind whose
  // entire point is to be resolved per-request. Every slug then renders on demand
  // (`dynamicParams` defaults to true). Flag-off keeps today's full static list.
  //
  // ⚠️ MEASURED LIMITATION (round 2, against a real CMS_RUNTIME_KINDS=…,blog,… build):
  // returning `[]` here does NOT by itself make a request-time slug render dynamically
  // per request — Next still treats an unlisted param as "dynamicParams" ISR: render
  // once on demand, then CACHE the result (measured: `x-nextjs-cache: HIT`,
  // `Cache-Control: s-maxage=31536000` on the second hit), which would silently defeat
  // the "live in about a minute" goal for every slug after its first render. Next
  // requires `export const dynamic`/`revalidate` to be a literal, read statically at
  // build time (confirmed: a computed `isRuntimeKind('blog') ? … : …` value fails the
  // build outright — "Next.js can't recognize the exported `dynamic` field … It needs
  // to be a static string"), so it cannot be flipped by this same env-driven constant.
  // `app/glossary/[slug]/page.tsx` never has this problem because it has NO
  // `generateStaticParams` at all (glossary has no flag-off static-list to preserve).
  // The kind that actually CUTS OVER to runtime (editing DEFAULT_RUNTIME_KINDS, a
  // real source commit — see lib/cms/runtime-config.ts) must, in that SAME commit,
  // delete this function entirely and add a literal `export const dynamic =
  // 'force-dynamic'`, the same shape glossary's own cutover (website#127/#128) took.
  // Left as a dual-mode function here on purpose: CMS_RUNTIME_KINDS is an env-only
  // override for proving the runtime path works (this round's task), not a production
  // toggle — see runtime-config.ts's own header for why Magic Containers' env can't
  // gain a variable through the deploy pipeline anyway.
  if (isRuntimeKind('blog')) return []
  return (await getBlogPosts()).map((post) => ({ slug: post.slug }))
}
