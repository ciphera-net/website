import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRightIcon } from '@ciphera-net/ui'

export const metadata: Metadata = {
  title: 'Blog - Privacy & Security Insights',
  description: 'Learn about zero-knowledge encryption, privacy-first technologies, and secure development practices from the Ciphera team.',
  alternates: {
    canonical: 'https://ciphera.net/blog',
  },
  openGraph: {
    title: 'Blog - Privacy & Security Insights | Ciphera',
    description: 'Learn about zero-knowledge encryption, privacy-first technologies, and secure development practices.',
    url: 'https://ciphera.net/blog',
    siteName: 'Ciphera',
    images: [{ url: '/ciphera_logo_no_margins.png', width: 1200, height: 630, alt: 'Ciphera Blog' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Privacy & Security Insights | Ciphera',
    description: 'Learn about zero-knowledge encryption, privacy-first technologies, and secure development practices.',
    images: ['/ciphera_logo_no_margins.png'],
  },
}

const blogSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog - Privacy & Security Insights',
    description: 'Learn about zero-knowledge encryption, privacy-first technologies, and secure development practices from the Ciphera team.',
    url: 'https://ciphera.net/blog',
    publisher: { '@type': 'Organization', name: 'Ciphera', url: 'https://ciphera.net' },
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

const blogPosts = [
  {
    slug: 'why-swiss-infrastructure-matters-for-data-privacy',
    title: 'Why Swiss Infrastructure Matters for Data Privacy',
    description: 'Switzerland hosts 75 data centers outside CLOUD Act reach. Learn why Swiss FADP, neutrality, and encryption protections make it the top choice for privacy infrastructure.',
    category: 'Privacy',
    date: '2026-03-02',
    readTime: '11 min read',
  },
  {
    slug: 'biggest-data-breaches-2025-2026',
    title: 'The Biggest Data Breaches of 2025-2026: What Went Wrong and How to Protect Your Data',
    description: 'Analysis of the largest data breaches of 2025-2026 affecting 280M+ people. IBM reports the average breach costs $4.44M globally, $10.22M in the U.S.',
    category: 'Security',
    date: '2026-03-02',
    readTime: '12 min read',
  },
  {
    slug: 'pulse-vs-google-analytics-plausible-fathom',
    title: 'Pulse vs Google Analytics vs Plausible vs Fathom: Which Analytics Tool Wins in 2026?',
    description: 'Side-by-side comparison of 4 analytics tools on privacy, performance, accuracy, and cost. Cookie-based analytics loses 80-90% of EU visitor data.',
    category: 'Analytics',
    date: '2026-03-02',
    readTime: '14 min read',
  },
]

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
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

      {/* * Blog Posts Grid */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:border-brand-orange/50 dark:hover:border-brand-orange/50 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="badge-neutral text-xs">{post.category}</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{post.readTime}</span>
                  </div>

                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 group-hover:text-brand-orange transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 flex-1">
                    {post.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-orange group-hover:gap-2 transition-all">
                      Read more
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
