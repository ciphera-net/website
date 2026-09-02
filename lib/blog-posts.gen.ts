// Auto-generated from content/blog/*.mdx — do not edit manually
// Run: npm run generate:blog

export interface BlogPostSummary {
  slug: string
  title: string
  description: string
  category: string
  date: string
  dateModified: string
  readTime: string
  image: string
}

export const blogPosts: BlogPostSummary[] = [
  {
    "slug": "free-analytics-for-open-source",
    "title": "Pulse Is Free for Open-Source Projects and Nonprofits",
    "description": "Pulse's Team tier at €0 for OSI-licensed projects and registered nonprofits — five sites, 100,000 pageviews a month, every feature. The deal is printed on the page: we get to say you use Pulse.",
    "category": "Privacy",
    "date": "2026-09-02",
    "dateModified": "2026-09-02",
    "readTime": "7 min read",
    "image": "/blog/og/free-analytics-for-open-source.png"
  },
  {
    "slug": "bunny-hopstart-second-place",
    "title": "Ciphera × Bunny: A Fully European Stack, Front to Back",
    "description": "Every public Ciphera surface runs on Bunny, the Slovenia-based European CDN — because infrastructure jurisdiction is a privacy decision. Bunny's HopStart Cohort #3 just put $25,000 in credits behind that choice. Here's why the two fit.",
    "category": "Privacy",
    "date": "2026-07-23",
    "dateModified": "2026-07-23",
    "readTime": "5 min read",
    "image": "/blog/og/bunny-hopstart-second-place.png"
  },
  {
    "slug": "do-you-need-a-cookie-banner-for-analytics",
    "title": "Do You Need a Cookie Banner for Analytics? What EU Law Actually Requires (2026)",
    "description": "The rule behind cookie banners isn't about cookies — it's about storing and reading information on a visitor's device. Here's what EU law actually requires for web analytics in 2026, why 'first-party' doesn't exempt you, and how a genuinely cookieless tool changes the question.",
    "category": "Privacy",
    "date": "2026-07-22",
    "dateModified": "2026-07-22",
    "readTime": "14 min read",
    "image": "/blog/og/do-you-need-a-cookie-banner-for-analytics.png"
  },
  {
    "slug": "how-to-migrate-off-google-analytics",
    "title": "How to Migrate Off Google Analytics: A 2026 Guide",
    "description": "A practical, honest guide to leaving Google Analytics for a privacy-first tool in 2026 — the timeline you need to know, why teams are switching, what you genuinely gain and lose, and the step-by-step migration (including the historical-data trap nobody warns you about).",
    "category": "Comparison",
    "date": "2026-07-22",
    "dateModified": "2026-07-22",
    "readTime": "11 min read",
    "image": "/blog/og/how-to-migrate-off-google-analytics.png"
  },
  {
    "slug": "is-your-analytics-gdpr-compliant",
    "title": "Is Your Website Analytics GDPR-Compliant? A 2026 Checklist",
    "description": "GDPR applies to your analytics the moment it processes personal data — and an IP address usually counts. A practical, source-backed 2026 checklist: lawful basis, data minimisation, retention, international transfers, and the one design choice that collapses most of it.",
    "category": "Privacy",
    "date": "2026-07-22",
    "dateModified": "2026-07-22",
    "readTime": "12 min read",
    "image": "/blog/og/is-your-analytics-gdpr-compliant.png"
  },
  {
    "slug": "ciphera-captcha-vs-recaptcha-vs-turnstile",
    "title": "Ciphera Captcha vs reCAPTCHA, Turnstile & hCaptcha (2026)",
    "description": "The bot-protection widget you add to a form often watches your visitors more than it protects them. A privacy- and jurisdiction-first comparison of reCAPTCHA, Turnstile, hCaptcha, and Ciphera Captcha's proof-of-work, cookieless approach.",
    "category": "Comparison",
    "date": "2026-07-19",
    "dateModified": "2026-07-19",
    "readTime": "11 min read",
    "image": "/blog/og/ciphera-captcha-vs-recaptcha-vs-turnstile.png?v=2"
  },
  {
    "slug": "ciphera-id-vs-auth0-vs-clerk",
    "title": "Ciphera ID vs Auth0 vs Clerk (2026)",
    "description": "An honest architectural comparison of three approaches to authentication: Auth0 and Clerk as developer platforms, and Ciphera ID's zero-knowledge model built on the open-source Tessera stack — where your users' passwords and data actually live, and who can read them.",
    "category": "Comparison",
    "date": "2026-07-19",
    "dateModified": "2026-07-19",
    "readTime": "12 min read",
    "image": "/blog/og/ciphera-id-vs-auth0-vs-clerk.png?v=2"
  },
  {
    "slug": "what-we-see-about-you-what-we-dont",
    "title": "What We See About You, What We Don't, and Why It Matters",
    "description": "Your password never touches our servers. Your email lives in a vault we can't decrypt. Here's the honest accounting of what Ciphera sees — and doesn't.",
    "category": "Privacy",
    "date": "2026-04-12",
    "dateModified": "2026-07-22",
    "readTime": "10 min read",
    "image": "/blog/og/what-we-see-about-you-what-we-dont.png"
  },
  {
    "slug": "eu-us-data-privacy-framework-executive-order",
    "title": "The EU-US Data Privacy Framework Is Built on an Executive Order — and That's the Problem",
    "description": "The DPF relies on an executive order, not legislation. With PCLOB gutted and FISA 702 sunsetting April 20, 2,800+ companies face transfer uncertainty.",
    "category": "Privacy",
    "date": "2026-04-04",
    "dateModified": "2026-07-22",
    "readTime": "10 min read",
    "image": "/blog/og/eu-us-data-privacy-framework-executive-order.png"
  },
  {
    "slug": "why-we-chose-bunnycdn",
    "title": "Why We Chose BunnyCDN as Ciphera's CDN",
    "description": "A CDN terminates TLS and sees every request. For a privacy company, choosing one is a trust decision. Here's the checklist we used, our actual setup, and what running it taught us.",
    "category": "Privacy",
    "date": "2026-03-16",
    "dateModified": "2026-07-19",
    "readTime": "8 min read",
    "image": "/blog/og/why-we-chose-bunnycdn.png"
  },
  {
    "slug": "zero-knowledge-encryption-guide",
    "title": "Zero-Knowledge Encryption Guide (2026)",
    "description": "What zero-knowledge encryption actually means — explained through the system we run in production: OPAQUE authentication, blind indexes, and a vault key that never leaves your browser.",
    "category": "Security",
    "date": "2026-03-10",
    "dateModified": "2026-07-19",
    "readTime": "9 min read",
    "image": "/blog/og/zero-knowledge-encryption-guide.png"
  },
  {
    "slug": "eu-ai-act-compliance-guide-2026",
    "title": "EU AI Act Compliance Guide for 2026",
    "description": "The AI Act's high-risk deadline just moved to December 2027 — but transparency rules and EUR 35M fines still land August 2, 2026. Here's what changed and what to do with the extra runway.",
    "category": "Privacy",
    "date": "2026-03-07",
    "dateModified": "2026-07-19",
    "readTime": "17 min read",
    "image": "/blog/og/eu-ai-act-compliance-guide-2026.png"
  },
  {
    "slug": "open-source-privacy-tools-2026",
    "title": "Open Source Privacy Tools: Complete List 2026",
    "description": "34 open source privacy tools across 11 categories — every one re-verified in July 2026: licenses, maintenance status, and governance changes. Plus the open-source stack we run ourselves.",
    "category": "Privacy",
    "date": "2026-03-02",
    "dateModified": "2026-07-19",
    "readTime": "14 min read",
    "image": "/blog/og/open-source-privacy-tools-2026.png"
  },
  {
    "slug": "pulse-vs-google-analytics-plausible-fathom",
    "title": "Pulse vs GA vs Plausible vs Fathom (2026)",
    "description": "Side-by-side comparison of Pulse, Google Analytics, Plausible, and Fathom on privacy, performance, accuracy, and cost. Cookie-based analytics loses 80-90% of EU visitor data.",
    "category": "Comparison",
    "date": "2026-02-14",
    "dateModified": "2026-07-22",
    "readTime": "14 min read",
    "image": "/blog/og/pulse-vs-google-analytics-plausible-fathom.png"
  },
  {
    "slug": "why-swiss-infrastructure-matters-for-data-privacy",
    "title": "Why Swiss Infrastructure Matters for Privacy",
    "description": "Switzerland hosts 75 data centers outside CLOUD Act reach. Swiss FADP and neutrality make it the top choice for privacy infrastructure.",
    "category": "Privacy",
    "date": "2026-01-27",
    "dateModified": "2026-03-07",
    "readTime": "11 min read",
    "image": "/blog/og/why-swiss-infrastructure-matters-for-data-privacy.png"
  },
  {
    "slug": "why-privacy-cant-be-an-afterthought",
    "title": "Why Privacy Can't Be an Afterthought",
    "description": "82% of consumers abandoned a brand over data concerns in 2025. Google, Apple, and Meta have been hit with $2B+ in fines and verdicts — several still contested. Here's what real privacy architecture looks like.",
    "category": "Privacy",
    "date": "2026-01-15",
    "dateModified": "2026-07-19",
    "readTime": "11 min read",
    "image": "/blog/og/why-privacy-cant-be-an-afterthought.png"
  }
]
