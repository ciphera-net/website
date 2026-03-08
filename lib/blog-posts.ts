export interface BlogPost {
  slug: string
  title: string
  description: string
  category: string
  date: string
  readTime: string
}

export const blogPosts: BlogPost[] = [
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
    category: 'Comparison',
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
    description: 'reCAPTCHA holds 85% market share but collects fingerprints, behavioral data, and cross-site cookies. With \u20AC7.1B in GDPR fines, here are 3 alternatives.',
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
