'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon } from '@ciphera-net/facet'
import { learnArticles } from '@/lib/learn-articles.gen'
import { pulseIcon, authIcon, captchaIcon, relayIcon } from '@/lib/images'
import Breadcrumbs from '@/components/Breadcrumbs'

const PRODUCT_CONFIG: Record<string, { label: string; icon: string }> = {
  pulse: { label: 'Pulse', icon: pulseIcon },
  id: { label: 'ID', icon: authIcon },
  captcha: { label: 'Captcha', icon: captchaIcon },
  relay: { label: 'Relay', icon: relayIcon },
}

const CATEGORY_ORDER = ['accessibility', 'performance', 'best-practices', 'seo']
const CATEGORY_LABELS: Record<string, string> = {
  accessibility: 'Accessibility',
  performance: 'Performance',
  'best-practices': 'Best practices',
  seo: 'SEO',
}

const PRODUCT_COUNTS = learnArticles.reduce<Record<string, number>>((acc, article) => {
  acc[article.product] = (acc[article.product] ?? 0) + 1
  return acc
}, {})

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeProduct, setActiveProduct] = useState('All')

  // Products without published articles are hidden until content exists —
  // a filter that can only return an empty grid is a dead end, not a feature.
  const productKeys = ['pulse', 'id', 'captcha', 'relay'].filter(
    (key) => (PRODUCT_COUNTS[key] ?? 0) > 0
  )

  const filtered = useMemo(() => {
    return learnArticles.filter((article) => {
      const matchesProduct =
        activeProduct === 'All' || article.product === activeProduct
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query || article.title.toLowerCase().includes(query) || article.description.toLowerCase().includes(query)
      return matchesProduct && matchesSearch
    })
  }, [searchQuery, activeProduct])

  // Group the filtered list by category, known categories first in fixed order,
  // any future category appended rather than dropped.
  const grouped = useMemo(() => {
    const present = Array.from(new Set(filtered.map((a) => a.category)))
    const order = [
      ...CATEGORY_ORDER.filter((c) => present.includes(c)),
      ...present.filter((c) => !CATEGORY_ORDER.includes(c)),
    ]
    return order.map((category) => ({
      category,
      articles: filtered.filter((a) => a.category === category),
    }))
  }, [filtered])

  return (
    <>
      <Breadcrumbs items={[{ label: 'Learn' }]} />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">Learn</p>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Guides, References &amp; Deep-Dives
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Technical documentation and reference articles across Ciphera products.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          {/* Search */}
          <div className="max-w-md mb-8">
            <input
              type="text"
              placeholder="Search articles..."
              aria-label="Search articles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            />
          </div>

          {/* Product filter tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            <button
              onClick={() => setActiveProduct('All')}
              data-active={activeProduct === 'All' ? '' : undefined}
              className={`px-4 py-2 text-sm font-medium border transition-colors ${
                activeProduct === 'All'
                  ? 'border-primary bg-transparent text-primary'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              All
              <span className="ml-2 text-xs tabular-nums opacity-70">{learnArticles.length}</span>
            </button>
            {productKeys.map((key) => {
              const config = PRODUCT_CONFIG[key]
              return (
                <button
                  key={key}
                  onClick={() => setActiveProduct(key)}
                  data-active={activeProduct === key ? '' : undefined}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border transition-colors ${
                    activeProduct === key
                      ? 'border-primary bg-transparent text-primary'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {config && <Image src={config.icon} alt="" width={16} height={16} unoptimized />}
                  {config?.label || key}
                  <span className="text-xs tabular-nums opacity-70">{PRODUCT_COUNTS[key]}</span>
                </button>
              )
            })}
          </div>

          {/* Results count + category jump links */}
          <div className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <p className="text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
            </p>
            {grouped.length > 1 && (
              <nav aria-label="Categories" className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                {grouped.map((group) => (
                  <a
                    key={group.category}
                    href={`#cat-${group.category}`}
                    className="flex items-baseline gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {CATEGORY_LABELS[group.category] ?? group.category}
                    <span className="tabular-nums">{group.articles.length}</span>
                  </a>
                ))}
              </nav>
            )}
          </div>

          {/* Category sections — anchored so the jump links above can target them */}
          <div className="space-y-14">
            {grouped.map((group) => (
              <section key={group.category} id={`cat-${group.category}`}>
                <div className="mb-6 flex items-baseline justify-between border-t border-border pt-4">
                  <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
                    {CATEGORY_LABELS[group.category] ?? group.category}
                  </h2>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {group.articles.length} {group.articles.length === 1 ? 'article' : 'articles'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.articles.map((article) => (
                    <Link
                      key={`${article.product}/${article.slug}`}
                      href={`/learn/${article.product}/${article.slug}`}
                      className="group flex flex-col p-5 border border-border bg-card hover:border-primary hover:bg-accent transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 border border-border px-2 py-0.5 text-xs text-muted-foreground">
                          {PRODUCT_CONFIG[article.product] && (
                            <Image src={PRODUCT_CONFIG[article.product].icon} alt="" width={14} height={14} unoptimized />
                          )}
                          {PRODUCT_CONFIG[article.product]?.label || article.product}
                        </span>
                        <span className="border border-border px-2 py-0.5 text-xs text-muted-foreground">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {article.description}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        Read
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground py-12">No articles match your search.</p>
          )}
        </div>
      </section>
    </>
  )
}
