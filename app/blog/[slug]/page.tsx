import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowRightIcon, Button } from '@ciphera-net/facet'
import { notFound } from 'next/navigation'
import remarkGfm from 'remark-gfm'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import { BlogMDXRenderer } from '@/components/blog/blog-mdx-renderer'
import TableOfContents from '../../../components/TableOfContents'
import RelatedPosts from '../../../components/RelatedPosts'
import ReadingProgress from '../../../components/ReadingProgress'
import { cdnUrl } from '@/lib/cdn'

/** Primary CTA target by post category — falls back to the products section for anything unmapped. */
const CATEGORY_CTA: Record<string, { label: string; href: string }> = {
  Security: { label: 'Explore Ciphera ID', href: '/products/id' },
  Privacy: { label: 'Explore Pulse', href: '/products/pulse' },
  Comparison: { label: 'Explore Pulse', href: '/products/pulse' },
}
const DEFAULT_CTA = { label: 'Explore products', href: '/#products' }

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
      title: post.title,
      description: post.description,
      url: `https://ciphera.net/blog/${slug}`,
      siteName: 'Ciphera',
      type: 'article',
      locale: 'en_US',
      images: [{ url: cdnUrl(post.image), width: 1376, height: 768, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [cdnUrl(post.image)],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const allPosts = getBlogPosts()
  const { serialize } = await import('next-mdx-remote/serialize')
  const mdxSource = await serialize(post.content, {
    mdxOptions: { remarkPlugins: [remarkGfm] },
  })

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: cdnUrl('/ciphera_logo_no_margins.png'),
    datePublished: post.date,
    dateModified: post.dateModified,
    wordCount: post.content.split(/\s+/).length,
    articleSection: post.category,
    author: {
      '@type': 'Organization',
      '@id': 'https://ciphera.net/#organization',
      name: 'Ciphera',
      url: 'https://ciphera.net',
      logo: {
        '@type': 'ImageObject',
        url: cdnUrl('/ciphera_logo_no_margins.png'),
      },
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://ciphera.net/#organization',
      name: 'Ciphera',
      url: 'https://ciphera.net',
      logo: {
        '@type': 'ImageObject',
        url: cdnUrl('/ciphera_logo_no_margins.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ciphera.net/blog/${slug}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://ciphera.net/blog' },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, breadcrumbSchema, ...(post.faqs.length > 0 ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: post.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) }] : [])]) }} />
      <ReadingProgress />
      {/* * Hero */}
      <section className="px-6 pt-32 pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline mb-8"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-6 text-sm flex-wrap">
            <span className="badge-neutral">{post.category}</span>
            <span className="text-muted-foreground">By Ciphera Team</span>
            <span className="text-foreground tabular-nums">{post.readTime}</span>
            <span className="text-foreground tabular-nums">
              {new Date(post.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }).replace(/\//g, '-')}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-display text-foreground mb-12">
            {post.title}
          </h1>

          <TableOfContents content={post.content} />

          <BlogMDXRenderer compiledSource={mdxSource.compiledSource} scope={mdxSource.scope ?? {}} frontmatter={mdxSource.frontmatter ?? {}} />

          <RelatedPosts currentSlug={slug} currentCategory={post.category} allPosts={allPosts} />

          {/* * Closing CTA */}
          <section className="border-t border-border">
            <div className="px-6 py-16 sm:py-20">
              <p className="font-mono text-xs text-muted-foreground">Get started</p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">
                Put this into practice.
              </h2>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground">
                Ciphera builds privacy-first infrastructure — analytics, identity, bot protection, and
                email that don&rsquo;t surveil. The tools this article describes are the ones we run.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href={(CATEGORY_CTA[post.category] ?? DEFAULT_CTA).href}>
                    {(CATEGORY_CTA[post.category] ?? DEFAULT_CTA).label}
                    <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Talk to us</Link>
                </Button>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-12 border-t border-border">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to all posts
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }))
}
