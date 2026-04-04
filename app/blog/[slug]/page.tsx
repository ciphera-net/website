import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon } from '@ciphera-net/ui'
import { notFound } from 'next/navigation'
import remarkGfm from 'remark-gfm'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import { BlogMDXRenderer } from '@/components/blog/blog-mdx-renderer'
import TableOfContents from '../../../components/TableOfContents'
import RelatedPosts from '../../../components/RelatedPosts'
import ReadingProgress from '../../../components/ReadingProgress'

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
      images: [{ url: post.image, width: 1376, height: 768, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
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
    image: 'https://ciphera.net/ciphera_logo_no_margins.png',
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
        url: 'https://ciphera.net/ciphera_logo_no_margins.png',
      },
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://ciphera.net/#organization',
      name: 'Ciphera',
      url: 'https://ciphera.net',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ciphera.net/ciphera_logo_no_margins.png',
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
      <section className="section-padding pt-32">
        <div className="section-container max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-brand-orange transition-colors mb-8"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-6 text-sm flex-wrap">
            <span className="badge-neutral">{post.category}</span>
            <span className="text-neutral-400">By Ciphera Team</span>
            <span className="text-neutral-400">{post.readTime}</span>
            <span className="text-neutral-400">
              {new Date(post.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }).replace(/\//g, '-')}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-12">
            {post.title}
          </h1>

          <TableOfContents content={post.content} />

          <BlogMDXRenderer compiledSource={mdxSource.compiledSource} scope={mdxSource.scope ?? {}} frontmatter={mdxSource.frontmatter ?? {}} />

          <RelatedPosts currentSlug={slug} currentCategory={post.category} allPosts={allPosts} />

          <div className="mt-12 pt-12 border-t border-neutral-800">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-brand-orange hover:underline"
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
