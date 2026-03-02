import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon } from '@ciphera-net/ui'
import { notFound } from 'next/navigation'

const blogPosts: Record<string, { title: string; content: string; date: string; category: string; readTime: string }> = {
  // * Posts will be added as content is created
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug]

  if (!post) {
    return {
      title: 'Post Not Found | Ciphera Blog',
    }
  }

  return {
    title: `${post.title} | Ciphera Blog`,
    description: post.title,
    alternates: {
      canonical: `https://ciphera.net/blog/${params.slug}`,
    },
    openGraph: {
      title: `${post.title} | Ciphera Blog`,
      description: post.title,
      url: `https://ciphera.net/blog/${params.slug}`,
      siteName: 'Ciphera',
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Ciphera Blog`,
      description: post.title,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

  return (
    <>
      {/* * Hero */}
      <section className="section-padding pt-32">
        <div className="section-container max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-brand-orange transition-colors mb-8"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-6 text-sm">
            <span className="badge-neutral">{post.category}</span>
            <span className="text-neutral-500 dark:text-neutral-400">{post.readTime}</span>
            <span className="text-neutral-500 dark:text-neutral-400">
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-12">
            {post.title}
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {post.content}
            </p>
          </div>

          <div className="mt-12 pt-12 border-t border-neutral-200 dark:border-neutral-800">
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
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}
