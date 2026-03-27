import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ArrowLeftIcon } from '@ciphera-net/ui'
import { getLearnArticle, getLearnArticles } from '@/lib/learn'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getLearnArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getLearnArticle(slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `https://ciphera.net/learn/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://ciphera.net/learn/${article.slug}`,
      siteName: 'Ciphera',
      images: [{ url: `/learn/og/${article.category}.png`, width: 1200, height: 630, alt: article.title }],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [`/learn/og/${article.category}.png`],
    },
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  performance: 'Performance',
  accessibility: 'Accessibility',
  'best-practices': 'Best Practices',
  seo: 'SEO',
}

export default async function LearnArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getLearnArticle(slug)
  if (!article) notFound()

  const allArticles = getLearnArticles()
  const related = allArticles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 5)

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
      url: `https://ciphera.net/learn/${article.slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
        { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://ciphera.net/learn' },
        { '@type': 'ListItem', position: 3, name: article.title },
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

          {/* Category badge */}
          <span className="inline-flex items-center px-3 py-1 rounded-full border border-brand-orange/20 bg-brand-orange/10 text-xs text-brand-orange mb-4">
            {CATEGORY_LABELS[article.category] || article.category}
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8">
            {article.title}
          </h1>

          {/* MDX content */}
          <div className="prose prose-invert prose-neutral max-w-none prose-headings:text-white prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-brand-orange prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
            <MDXRemote source={article.content} />
          </div>

          {/* Related Audits */}
          {related.length > 0 && (
            <section className="mt-16 pt-12 border-t border-neutral-800">
              <h2 className="text-xl font-bold text-white mb-6">Related Audits</h2>
              <ul className="space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/learn/${r.slug}`}
                      className="text-neutral-400 hover:text-brand-orange transition-colors"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </>
  )
}
