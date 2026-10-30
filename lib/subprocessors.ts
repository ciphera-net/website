// * The published subprocessor disclosure of the privacy policy (§11). Only app/privacy/page.tsx renders this file.
// * 🔴 The /trust hub (#providers) does NOT: it keeps its own, longer list in
// * components/overhaul/trust/content.ts (PROVIDERS, which also names Let's Encrypt and Linear). The two must be edited
// * together, or the two surfaces drift apart; __tests__/hosting-geneva.test.mjs pins the hosting rows of both.
// * Neither row claims encryption at rest (28-10-2026). Infomaniak's contract covers its block and object storage (Public
// * Cloud Specific Terms, art. 8.4: LUKS, AES-256) but says nothing of the Kubernetes control plane, and not every backup
// * is encrypted by us yet. A claim comes back only once it holds for everything its row covers.
// * Since 29-10-2026 every backup copy is at Infomaniak (both regions), so Exoscale's row names only the email server it
// * still runs. DPA Annex IV renders the same rows (lib/dpa/agreement.ts).

export interface Subprocessor {
  service: string
  purpose: string
  dataProcessed: string
  location: string
}

export const subprocessors: Subprocessor[] = [
  {
    service: 'Infomaniak',
    purpose: 'Servers, databases, object storage, off-site backups and domain registration',
    dataProcessed: 'All data we store',
    location: 'Switzerland',
  },
  {
    service: 'Exoscale',
    purpose: 'Email server',
    dataProcessed: 'Email',
    location: 'Switzerland',
  },
  {
    service: 'Bunny',
    purpose: 'CDN, DNS, DDoS protection, edge routing',
    dataProcessed: 'IP addresses (transient)',
    location: 'Global (edge network)',
  },
  {
    service: 'GitHub',
    purpose: 'Source code hosting',
    dataProcessed: 'Source code',
    location: 'United States',
  },
  {
    service: 'Mollie',
    purpose: 'Payment processing',
    dataProcessed: 'Billing and subscription data',
    location: 'Netherlands',
  },
]

export const weDoNotUse = [
  'Google Analytics, Google Tag Manager, or any Google tracking service',
  'Meta Pixel, Facebook SDK, or any Meta tracking service',
  'Third-party CAPTCHA services (we use our own Ciphera Captcha)',
  'Third-party email tracking services',
  'Advertising networks of any kind',
  'Customer data platforms (CDPs) or data brokers',
] as const
