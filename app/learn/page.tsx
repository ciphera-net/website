'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { ArrowRightIcon } from '@ciphera-net/ui'
import { learnArticles } from '@/lib/learn-articles.gen'
import { pulseIcon, dropIcon, authIcon, captchaIcon, relayIcon } from '@/lib/images'

const PRODUCT_CONFIG: Record<string, { label: string; icon: StaticImageData }> = {
  pulse: { label: 'Pulse', icon: pulseIcon },
  drop: { label: 'Drop', icon: dropIcon },
  auth: { label: 'Auth', icon: authIcon },
  captcha: { label: 'Captcha', icon: captchaIcon },
  relay: { label: 'Relay', icon: relayIcon },
}

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeProduct, setActiveProduct] = useState('All')

  const productKeys = ['pulse', 'drop', 'auth', 'captcha', 'relay']

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
      {/* Hero */}
      <section className="py-16 md:py-24 pt-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-orange/20 bg-brand-orange/10 text-sm text-brand-orange mb-4">
              Learn
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
              Guides, References & Deep-Dives
            </h1>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
              Technical documentation and reference articles across Ciphera products.
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
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-orange/50 transition-colors"
            />
          </div>

          {/* Product pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveProduct('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeProduct === 'All'
                  ? 'bg-brand-orange-button text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
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
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeProduct === key
                      ? 'bg-brand-orange-button text-white'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {config && <Image src={config.icon} alt="" width={16} height={16} unoptimized />}
                  {config?.label || key}
                </button>
              )
            })}
          </div>

          {/* Results count */}
          <p className="text-sm text-neutral-500 mb-6">
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((article) => (
              <Link
                key={`${article.product}/${article.slug}`}
                href={`/learn/${article.product}/${article.slug}`}
                className="group flex flex-col p-5 rounded-2xl border border-neutral-800 bg-neutral-900 hover:border-brand-orange/50 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-brand-orange/20 bg-brand-orange/10 text-xs text-brand-orange">
                    {PRODUCT_CONFIG[article.product] && (
                      <Image src={PRODUCT_CONFIG[article.product].icon} alt="" width={14} height={14} unoptimized />
                    )}
                    {PRODUCT_CONFIG[article.product]?.label || article.product}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-neutral-700 bg-neutral-800 text-xs text-neutral-400">
                    {article.category}
                  </span>
                </div>
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
