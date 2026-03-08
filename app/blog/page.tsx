'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@ciphera-net/ui'
import { blogPosts } from '../../lib/blog-posts'
import { track } from '../../lib/pulse'

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

const categories = ['All', ...Array.from(new Set(blogPosts.map((post) => post.category)))]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query || post.title.toLowerCase().includes(query) || post.description.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [searchQuery, activeCategory])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      {/* * Hero */}
      <section className="section-padding pt-32">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="badge-primary mb-4 inline-flex">Blog</span>
            <h1 className="heading-1 mb-6">
              Privacy & Security Insights
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              Learn about zero-knowledge encryption, privacy-first technologies, and secure development practices.
            </p>
          </div>
        </div>
      </section>

      {/* * Search & Filter */}
      <section className="section-padding !pt-0">
        <div className="section-container">
          <div className="max-w-6xl mx-auto space-y-5">
            {/* Search input */}
            <div className="relative max-w-md mx-auto">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx={11} cy={11} r={8} />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value.length > 2) {
                    track('blog_search')
                  }
                }}
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange transition-colors duration-200"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category)
                    track('blog_filter_category')
                  }}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    activeCategory === category
                      ? 'bg-brand-orange text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* * Blog Posts Grid */}
      <section className="section-padding">
        <div className="section-container">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:border-brand-orange/50 dark:hover:border-brand-orange/50 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={`/blog/og/${post.slug}.png`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
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
                        {new Date(post.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }).replace(/\//g, '-')}
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
          ) : (
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center py-20 text-center">
              <svg
                className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <p className="text-lg font-medium text-neutral-900 dark:text-white mb-1">No articles found</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
