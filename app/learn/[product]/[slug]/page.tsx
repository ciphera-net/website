import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import { ArrowLeftIcon } from '@ciphera-net/facet'
import { cdnUrl } from '@/lib/cdn'
import { getLearnArticle, getLearnArticles } from '@/lib/learn'
import { pulseIcon, authIcon, captchaIcon, relayIcon } from '@/lib/images'
import { MDXTable } from '@/components/mdx-table'

const PRODUCT_ICONS: Record<string, typeof pulseIcon> = {
  pulse: pulseIcon,
  id: authIcon,
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
      images: [{ url: cdnUrl('/og-homepage.png'), width: 1200, height: 630, alt: article.title }],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [cdnUrl('/og-homepage.png')],
    },
  }
}

const PRODUCT_LABELS: Record<string, string> = {
  pulse: 'Pulse',
  id: 'ID',
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

      <section className="border-b border-border">
        <article className="px-6 py-16 sm:py-24 pt-32">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline mb-8"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Learn
            </Link>

            {/* Product + Category badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 border border-border px-2 py-0.5 font-mono text-xs text-primary">
                {PRODUCT_ICONS[product] && (
                  <Image src={PRODUCT_ICONS[product]} alt="" width={14} height={14} unoptimized />
                )}
                {PRODUCT_LABELS[product] || product}
              </span>
              <span className="border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {article.category}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-8">
              {article.title}
            </h1>

            {article.description && (
              <p className="mb-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{article.description}</p>
            )}
            {article.date && (
              <time dateTime={article.date} className="mb-8 block font-mono text-xs tabular-nums text-muted-foreground">
                {new Date(article.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
              </time>
            )}

            {/* MDX content */}
            <div className="prose prose-invert prose-neutral max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none">
              <MDXRemote source={article.content} components={{ table: MDXTable }} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </div>
          </div>
        </article>
      </section>
    </>
  )
}
