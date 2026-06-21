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

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeProduct, setActiveProduct] = useState('All')

  const productKeys = ['pulse', 'id', 'captcha', 'relay']

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

  return (
    <>
      <Breadcrumbs items={[{ label: 'Learn' }]} />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="px-6 py-16 sm:py-24">
          <p className="font-mono text-xs text-muted-foreground">Learn</p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
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
                  ? 'border-border bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              All
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
                      ? 'border-border bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {config && <Image src={config.icon} alt="" width={16} height={16} unoptimized />}
                  {config?.label || key}
                </button>
              )
            })}
          </div>

          {/* Results count */}
          <p className="font-mono text-xs text-muted-foreground mb-6">
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((article) => (
              <Link
                key={`${article.product}/${article.slug}`}
                href={`/learn/${article.product}/${article.slug}`}
                className="group flex flex-col p-5 border border-border bg-card hover:border-primary hover:bg-accent transition-colors duration-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {PRODUCT_CONFIG[article.product] && (
                      <Image src={PRODUCT_CONFIG[article.product].icon} alt="" width={14} height={14} unoptimized />
                    )}
                    {PRODUCT_CONFIG[article.product]?.label || article.product}
                  </span>
                  <span className="border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {article.category}
                  </span>
                </div>
                <h2 className="font-display text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {article.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  Read
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="font-mono text-xs text-muted-foreground py-12">No articles match your search.</p>
          )}
        </div>
      </section>
    </>
  )
}
