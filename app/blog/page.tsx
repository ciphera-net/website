import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRightIcon } from '@ciphera-net/ui'

export const metadata: Metadata = {
  title: 'Blog - Privacy & Security Insights',
  description: 'Privacy and security insights from the Ciphera team. Data breach analysis, encryption guides, tool comparisons, and privacy statistics backed by sourced data.',
  alternates: {
    canonical: 'https://ciphera.net/blog',
  },
  openGraph: {
    title: 'Blog - Privacy & Security Insights',
    description: 'Privacy and security insights from the Ciphera team. Data breach analysis, encryption guides, tool comparisons, and privacy statistics backed by sourced data.',
    url: 'https://ciphera.net/blog',
    siteName: 'Ciphera',
    images: [{ url: '/ciphera_logo_no_margins.png', width: 1200, height: 630, alt: 'Ciphera Blog' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Privacy & Security Insights',
    description: 'Privacy and security insights from the Ciphera team. Data breach analysis, encryption guides, and privacy statistics.',
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
      { '@type': 'ListItem', position: 2, name: 'Blog' },
    ],
  },
]

const blogPosts = [
  {
    slug: 'why-privacy-cant-be-an-afterthought',
    title: 'Why Privacy Can\'t Be an Afterthought: Privacy Washing vs. Real Privacy Engineering',
    description: '82% of consumers abandoned a brand over data concerns in 2025. Google, Apple, and Meta paid $2B+ in privacy fines. Here\'s what real privacy architecture looks like.',
    category: 'Privacy',
    date: '2026-01-15',
    readTime: '10 min read',
  },
  {
    slug: 'why-swiss-infrastructure-matters-for-data-privacy',
    title: 'Why Swiss Infrastructure Matters for Data Privacy',
    description: 'Switzerland hosts 75 data centers outside CLOUD Act reach. Learn why Swiss FADP, neutrality, and encryption protections make it the top choice for privacy infrastructure.',
    category: 'Privacy',
    date: '2026-01-27',
    readTime: '11 min read',
  },
  {
    slug: 'biggest-data-breaches-2025-2026',
    title: 'The Biggest Data Breaches of 2025-2026: What Went Wrong and How to Protect Your Data',
    description: 'Analysis of the largest data breaches of 2025-2026 affecting 280M+ people. IBM reports the average breach costs $4.44M globally, $10.22M in the U.S.',
    category: 'Security',
    date: '2026-02-05',
    readTime: '12 min read',
  },
  {
    slug: 'pulse-vs-google-analytics-plausible-fathom',
    title: 'Pulse vs Google Analytics vs Plausible vs Fathom: Which Analytics Tool Wins in 2026?',
    description: 'Side-by-side comparison of 4 analytics tools on privacy, performance, accuracy, and cost. Cookie-based analytics loses 80-90% of EU visitor data.',
    category: 'Analytics',
    date: '2026-02-14',
    readTime: '14 min read',
  },
  {
    slug: 'drop-vs-wetransfer-google-drive-dropbox-encrypted-file-sharing',
    title: 'Drop vs WeTransfer vs Google Drive vs Dropbox: Encrypted File Sharing Compared (2026)',
    description: '82% of breaches involve cloud data. We compare 7 file sharing services on encryption, privacy, jurisdiction, and cost — only 3 use zero-knowledge encryption.',
    category: 'Comparison',
    date: '2026-02-21',
    readTime: '12 min read',
  },
  {
    slug: 'privacy-statistics-2026',
    title: '25 Privacy Statistics That Define 2026: Breaches, Fines, and the Trust Crisis',
    description: '25 sourced privacy statistics for 2026 — from $4.44M average breach costs to \u20AC7.1B in GDPR fines. The numbers every business needs to see.',
    category: 'Privacy',
    date: '2026-02-28',
    readTime: '12 min read',
  },
  {
    slug: 'open-source-privacy-tools-2026',
    title: 'Open Source Privacy Tools: The Complete List (2026)',
    description: '30 open source privacy tools across 10 categories. 96% of orgs increased OSS use in 2025. Every tool here has auditable code and no hidden data collection.',
    category: 'Privacy',
    date: '2026-03-02',
    readTime: '15 min read',
  },
  {
    slug: 'passkeys-vs-passwords-2026',
    title: 'Passkeys vs Passwords: Why 2026 Is the Tipping Point',
    description: 'Passkeys succeed 93% of the time vs 63% for passwords (FIDO Alliance, 2025). With 87% of enterprises deploying, 2026 marks the end of the password era.',
    category: 'Security',
    date: '2026-03-06',
    readTime: '12 min read',
  },
  {
    slug: 'recaptcha-privacy-liability-alternatives-2026',
    title: 'Why reCAPTCHA Is a Privacy Liability in 2026 (and What to Use Instead)',
    description: 'reCAPTCHA holds 85% market share but collects fingerprints, behavioral data, and cross-site cookies. With €7.1B in GDPR fines, here are 3 alternatives.',
    category: 'Privacy',
    date: '2026-03-09',
    readTime: '13 min read',
  },
  {
    slug: 'eu-ai-act-compliance-guide-2026',
    title: 'EU AI Act Compliance Guide: What Every Business Needs to Know in 2026',
    description: 'Only 18% of EU employers feel ready for the AI Act. Fines reach EUR 35M or 7% of turnover. Here\'s what every business must do before the August 2026 deadline.',
    category: 'Privacy',
    date: '2026-03-07',
    readTime: '12 min read',
  },
  {
    slug: 'zero-knowledge-encryption-guide',
    title: 'Zero-Knowledge Encryption: A Plain-English Guide for Non-Technical Founders (2026)',
    description: '47% of sensitive cloud data is still unencrypted (Thales, 2026). Zero-knowledge encryption means the provider can never read your data. Here\'s how it works.',
    category: 'Security',
    date: '2026-03-10',
    readTime: '11 min read',
  },
  {
    slug: 'data-privacy-audit-guide-startups',
    title: 'How to Run a Data Privacy Audit for Your Startup (2026 Step-by-Step Guide)',
    description: 'GDPR fines hit EUR 7.1B cumulatively and breaches cost $4.44M on average (IBM, 2025). Here\'s a 6-step data privacy audit you can run without a legal team.',
    category: 'Privacy',
    date: '2026-03-12',
    readTime: '12 min read',
  },
]

export default function BlogPage() {
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

      {/* * Blog Posts Grid */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
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
        </div>
      </section>
    </>
  )
}
