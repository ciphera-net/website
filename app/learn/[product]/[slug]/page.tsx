import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import { ArrowLeftIcon } from '@ciphera-net/ui'
import { getLearnArticle, getLearnArticles } from '@/lib/learn'
import { pulseIcon, dropIcon, authIcon, captchaIcon, relayIcon } from '@/lib/images'

const PRODUCT_ICONS: Record<string, typeof pulseIcon> = {
  pulse: pulseIcon,
  drop: dropIcon,
  auth: authIcon,
  captcha: captchaIcon,
  relay: relayIcon,
}

interface Props {
  params: Promise<{ product: string; slug: string }>
}

export async function generateStaticParams() {
  return getLearnArticles().map((a) => ({ product: a.product, slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product, slug } = await params
  const article = getLearnArticle(product, slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `https://ciphera.net/learn/${product}/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://ciphera.net/learn/${product}/${article.slug}`,
      siteName: 'Ciphera',
      images: [{ url: `/learn/og/${product}.png`, width: 1200, height: 630, alt: article.title }],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [`/learn/og/${product}.png`],
    },
  }
}

const PRODUCT_LABELS: Record<string, string> = {
  pulse: 'Pulse',
  drop: 'Drop',
  auth: 'Auth',
  captcha: 'Captcha',
  relay: 'Relay',
}

export default async function LearnArticlePage({ params }: Props) {
  const { product, slug } = await params
  const article = getLearnArticle(product, slug)
  if (!article) notFound()

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      dateModified: article.date,
      author: { '@type': 'Organization', name: 'Ciphera', url: 'https://ciphera.net' },
      publisher: { '@type': 'Organization', name: 'Ciphera', url: 'https://ciphera.net' },
      url: `https://ciphera.net/learn/${product}/${article.slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
        { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://ciphera.net/learn' },
        { '@type': 'ListItem', position: 3, name: PRODUCT_LABELS[product] || product, item: `https://ciphera.net/learn?product=${product}` },
        { '@type': 'ListItem', position: 4, name: article.title },
      ],
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="py-16 pt-32">
        <div className="max-w-3xl mx-auto px-6">
          {/* Back link */}
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-brand-orange transition-colors mb-8"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Learn
          </Link>

          {/* Product + Category badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-orange/20 bg-brand-orange/10 text-xs text-brand-orange">
              {PRODUCT_ICONS[product] && (
                <Image src={PRODUCT_ICONS[product]} alt="" width={14} height={14} unoptimized />
              )}
              {PRODUCT_LABELS[product] || product}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-neutral-700 bg-neutral-800 text-xs text-neutral-400">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8">
            {article.title}
          </h1>

          {/* MDX content */}
          <div className="prose prose-invert prose-neutral max-w-none prose-headings:text-white prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-brand-orange prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
            <MDXRemote source={article.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
          </div>
        </div>
      </article>
    </>
  )
}
