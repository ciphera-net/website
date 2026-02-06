import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRightIcon } from '@ciphera-net/ui'

export const metadata: Metadata = {
  title: 'Blog - Privacy & Security Insights | Ciphera',
  description: 'Learn about zero-knowledge encryption, privacy-first technologies, and secure development practices from the Ciphera team.',
}

const blogPosts = [
  {
    slug: 'understanding-zero-knowledge-encryption',
    title: 'Understanding Zero-Knowledge Encryption',
    excerpt: 'A deep dive into how zero-knowledge encryption works and why it matters for your privacy.',
    date: '2026-02-01',
    category: 'Security',
    readTime: '8 min read',
  },
  {
    slug: 'why-swiss-infrastructure',
    title: 'Why We Chose Swiss Infrastructure',
    excerpt: 'Exploring Swiss data protection laws and why Switzerland is the ideal location for privacy-first services.',
    date: '2026-01-28',
    category: 'Privacy',
    readTime: '6 min read',
  },
  {
    slug: 'building-privacy-first-analytics',
    title: 'Building Privacy-First Analytics with Pulse',
    excerpt: 'How we built Pulse to provide powerful analytics while respecting user privacy.',
    date: '2026-01-20',
    category: 'Product',
    readTime: '10 min read',
  },
  {
    slug: 'secure-file-sharing-best-practices',
    title: 'Secure File Sharing: Best Practices',
    excerpt: 'Essential security practices for sharing sensitive files in personal and business contexts.',
    date: '2026-01-15',
    category: 'Security',
    readTime: '7 min read',
  },
  {
    slug: 'gdpr-compliance-guide',
    title: 'GDPR Compliance for Developers',
    excerpt: 'A practical guide to building GDPR-compliant applications with privacy by design.',
    date: '2026-01-10',
    category: 'Compliance',
    readTime: '12 min read',
  },
  {
    slug: 'open-source-security',
    title: 'The Benefits of Open Source Security',
    excerpt: 'Why open-sourcing our security implementation strengthens trust and improves our products.',
    date: '2026-01-05',
    category: 'Open Source',
    readTime: '5 min read',
  },
]

const categories = ['All', 'Security', 'Privacy', 'Product', 'Compliance', 'Open Source']

export default function BlogPage() {
  return (
    <>
      {/* * Hero */}
      <section className="section-padding pt-32 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="badge-primary mb-4 inline-flex">Blog</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
              Privacy & Security Insights
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              Learn about zero-knowledge encryption, privacy-first technologies, and secure development practices.
            </p>
          </div>
        </div>
      </section>

      {/* * Categories */}
      <section className="section-padding">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          {/* * Blog posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group card p-6 card-hover"
              >
                <div className="flex items-center gap-3 mb-4 text-sm">
                  <span className="badge-neutral text-xs">{post.category}</span>
                  <span className="text-neutral-500 dark:text-neutral-400">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-brand-orange transition-colors">
                  {post.title}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <ArrowRightIcon className="w-5 h-5 text-brand-orange group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* * CTA */}
          <div className="text-center mt-12">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Want to stay updated with our latest posts?
            </p>
            <Link href="/#newsletter" className="btn-primary">
              Subscribe to Newsletter
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
