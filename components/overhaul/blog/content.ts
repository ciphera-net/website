/**
 * Round 7 (mock, 18-10-2026, plan §5i): every word the blog's chrome says. The posts' own words come from the CMS
 * and are W7's job; nothing here restates them. All DRAFTS for W7, humanized.
 */

// The cookie post moves to do-you-need-consent-for-analytics (24-10-2026): a cookie-notice filter list blocks every
// address holding "-cookie-banner-" (Public/docs/audits/24-10-2026-blog-card-blocked-by-cookie-notice-lists.md). Both
// slugs are listed while the CMS rename goes live, so the post never leaves its lists; the old one goes next.
export const INDEX = {
  title: 'Blog',
  // The homepage's "From the blog" lead, ruled with the homepage copy (D24), so the two read the same.
  lead: 'Notes on privacy and the web.',
  rss: { label: 'RSS feed', href: '/feed.xml' },
  // Option C: three short hand-picked lists above the rows (Plausible's "Browse by topic").
  startHere: 'Start here',
  topics: [
    {
      title: 'Leaving Google Analytics',
      slugs: ['how-to-migrate-off-google-analytics', 'pulse-vs-google-analytics-plausible-fathom', 'cookieless-analytics'],
    },
    {
      title: 'Cookies and the law',
      slugs: ['do-you-need-a-cookie-banner-for-analytics', 'do-you-need-consent-for-analytics', 'is-your-analytics-gdpr-compliant', 'eu-us-data-privacy-framework-executive-order'],
    },
    {
      title: 'How we build',
      slugs: ['why-swiss-infrastructure-matters-for-data-privacy', 'why-we-chose-bunnycdn', 'zero-knowledge-encryption-guide'],
    },
  ],
} as const

/**
 * Round 7b (18-10, plan §5i and D37): categories to sort by, and the covers visible. A PROPOSED set of four categories. Today's WordPress categories are Privacy 13,
 * Comparison 3 and Security 2, too lopsided to sort by. Every live post has a place; the names and leads are drafts for
 * W7, and the set itself is the owner's call (a WordPress taxonomy change at build time).
 */
export const CATEGORIES = [
  {
    key: 'analytics',
    title: 'Analytics',
    lead: 'Measuring a website without cookies, and moving off Google Analytics.',
    slugs: ['cookieless-analytics', 'how-to-migrate-off-google-analytics', 'pulse-vs-google-analytics-plausible-fathom', 'free-analytics-for-open-source'],
  },
  {
    key: 'privacy-law',
    title: 'Privacy law',
    lead: 'Cookies, consent and data transfers under EU law.',
    slugs: ['do-you-need-a-cookie-banner-for-analytics', 'do-you-need-consent-for-analytics', 'is-your-analytics-gdpr-compliant', 'eu-us-data-privacy-framework-executive-order', 'eu-ai-act-compliance-guide-2026'],
  },
  {
    key: 'privacy-tools',
    title: 'Privacy tools',
    lead: 'Tools that collect less, and how to choose them.',
    slugs: ['privacy-tools', 'open-source-privacy-tools-2026', 'ciphera-captcha-vs-recaptcha-vs-turnstile'],
  },
  {
    key: 'how-we-build',
    title: 'How we build',
    lead: 'Where Ciphera runs, and why we built it that way.',
    slugs: [
      'why-swiss-infrastructure-matters-for-data-privacy', 'why-we-chose-bunnycdn', 'bunny-hopstart-second-place', 'zero-knowledge-encryption-guide',
      'what-we-see-about-you-what-we-dont', 'ciphera-id-vs-auth0-vs-clerk', 'why-privacy-cant-be-an-afterthought',
    ],
  },
] as const

export type CategoryKey = (typeof CATEGORIES)[number]['key']

export const CATEGORY_UI = {
  all: 'All',
  nav: 'Categories',
  latest: 'Latest',
  seeAll: (n: number) => `All ${n} posts`,
} as const

export const POST = {
  back: { label: 'Blog', href: '/blog' },
  updated: 'Updated',
  readTime: (minutes: number) => `${minutes} min read`,
  contents: 'On this page',
  // The TL;DR callout, quieter: a label and a hairline instead of an orange panel with a side stripe.
  summary: 'In short',
  questions: 'Questions',
  previous: 'Previous post',
  next: 'Next post',
  readNext: 'Read next',
  // Every post ends on the same line and the same link (outline A and C); the category CTAs and "Explore Tessera" go.
  closing: { line: 'We make Pulse, web analytics without cookies.', link: { label: 'Try Pulse free', href: 'https://pulse.ciphera.net/signup' } },
  // Option B: the homepage's closing band, without its arc (an arc never sits at both ends of a page: D23).
  band: {
    title: 'Try Pulse on your own site.',
    lead: 'It is free for one site. Or tell us what you are building.',
    primary: { label: 'Try Pulse free', href: 'https://pulse.ciphera.net/signup' },
    secondary: { label: 'Contact us', href: '/contact' },
  },
  // Option B: three related posts picked by hand per post. A post without a pick shows none.
  related: {
    'how-to-migrate-off-google-analytics': ['cookieless-analytics', 'do-you-need-a-cookie-banner-for-analytics', 'do-you-need-consent-for-analytics', 'pulse-vs-google-analytics-plausible-fathom'],
    'cookieless-analytics': ['do-you-need-a-cookie-banner-for-analytics', 'do-you-need-consent-for-analytics', 'how-to-migrate-off-google-analytics', 'is-your-analytics-gdpr-compliant'],
  } as Record<string, readonly string[]>,
} as const

/**
 * D39 (W7-1): unpublished at build time, each with a permanent redirect (Captcha → /blog, ID → /trust#sign-in, the
 * transparency post → /trust, the manifesto → /about). The mock leaves them out of every list, as the site will.
 */
export const UNPUBLISHED = [
  'ciphera-captcha-vs-recaptcha-vs-turnstile',
  'ciphera-id-vs-auth0-vs-clerk',
  'what-we-see-about-you-what-we-dont',
  'why-privacy-cant-be-an-afterthought',
] as const

/** The post every option shows by default: it has a summary, six sections, a table, a code block and questions. */
export const SHOWCASE = 'how-to-migrate-off-google-analytics'
