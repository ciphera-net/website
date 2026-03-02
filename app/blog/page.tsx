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
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://ciphera.net/blog' },
    ],
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

      {/* * Coming Soon */}
      <section className="section-padding">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              We&apos;re working on in-depth articles about zero-knowledge encryption, privacy-first development, and secure infrastructure. Stay tuned for our first posts.
            </p>
            <Link href="/#newsletter" className="btn-primary">
              Get Notified
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
