'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@ciphera-net/facet'
import { blogPosts } from '../../lib/blog-posts.gen'
import { track } from '../../lib/pulse'
import { cdnUrl } from '@/lib/cdn'

const blogSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog - Privacy & Security Insights',
    description: 'Learn about zero-knowledge encryption, privacy-first technologies, and secure development practices from the Ciphera team.',
    url: 'https://ciphera.net/blog',
    publisher: { '@id': 'https://ciphera.net/#organization' },
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

      {/* Hero */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24 pt-32">
          <div className="max-w-4xl">
            <p className="text-xs text-muted-foreground">Blog</p>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Privacy &amp; Security Insights
            </h1>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              Learn about zero-knowledge encryption, privacy-first technologies, and secure development practices.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="border-b border-border">
        <div className="px-6 py-10">
          <div className="space-y-5">
            {/* Search input */}
            <div className="relative max-w-md">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
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
                aria-label="Search articles"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value.length > 2) {
                    track('blog_search')
                  }
                }}
                className="w-full border border-border bg-background text-foreground pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Category tab buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category)
                    track('blog_filter_category')
                  }}
                  className={`inline-flex items-center min-h-9 border px-4 py-1.5 text-xs transition-colors ${
                    activeCategory === category
                      ? 'border-primary bg-transparent text-primary'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col border border-border bg-card overflow-hidden hover:border-primary transition-colors duration-200"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={cdnUrl(post.image)}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="border border-border px-2 py-0.5 text-xs text-muted-foreground">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>

                    <h2 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }).replace(/\//g, '-')}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-primary">
                        Read more
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-start py-20">
              <svg
                className="w-12 h-12 text-muted-foreground mb-4"
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
              <p className="font-display text-lg font-medium text-foreground mb-1">No articles found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
