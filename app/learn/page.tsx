'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@ciphera-net/ui'
import { learnArticles } from '@/lib/learn-articles.gen'

const CATEGORY_LABELS: Record<string, string> = {
  performance: 'Performance',
  accessibility: 'Accessibility',
  'best-practices': 'Best Practices',
  seo: 'SEO',
}

const categories = ['All', 'Performance', 'Accessibility', 'Best Practices', 'SEO']

const categoryKeyMap: Record<string, string> = {
  Performance: 'performance',
  Accessibility: 'accessibility',
  'Best Practices': 'best-practices',
  SEO: 'seo',
}

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = useMemo(() => {
    return learnArticles.filter((article) => {
      const matchesCategory =
        activeCategory === 'All' || article.category === categoryKeyMap[activeCategory]
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query || article.title.toLowerCase().includes(query) || article.description.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [searchQuery, activeCategory])

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Learn - Web Performance & SEO Reference',
      description: 'Reference guides for Lighthouse audits, web performance metrics, accessibility standards, and SEO best practices.',
      url: 'https://ciphera.net/learn',
      publisher: { '@type': 'Organization', name: 'Ciphera', url: 'https://ciphera.net' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
        { '@type': 'ListItem', position: 2, name: 'Learn' },
      ],
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="py-16 md:py-24 pt-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-orange/20 bg-brand-orange/10 text-sm text-brand-orange mb-4">
              Learn
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
              Web Performance & SEO Reference
            </h1>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
              Understand what Lighthouse measures, why it matters, and how to improve your scores.
            </p>
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search audits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-orange/50 transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-orange text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-neutral-500 mb-6">
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((article) => (
              <Link
                key={article.slug}
                href={`/learn/${article.slug}`}
                className="group flex flex-col p-5 rounded-2xl border border-neutral-800 bg-neutral-900 hover:border-brand-orange/50 transition-all duration-200"
              >
                <span className="inline-flex self-start items-center px-2.5 py-0.5 rounded-full border border-neutral-700 bg-neutral-800 text-xs text-neutral-400 mb-3">
                  {CATEGORY_LABELS[article.category] || article.category}
                </span>
                <h2 className="text-base font-semibold text-white mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
                  {article.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-brand-orange group-hover:gap-2 transition-all">
                  Read
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-neutral-500 py-12">No articles match your search.</p>
          )}
        </div>
      </section>
    </>
  )
}
