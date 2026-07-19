// * Single source of truth for the published subprocessor disclosure.
// * Rendered by BOTH the privacy policy (§11) and the /trust hub — edit here,
// * never inline in a page, so the two surfaces cannot drift apart.

export interface Subprocessor {
  service: string
  purpose: string
  dataProcessed: string
  location: string
}

export const subprocessors: Subprocessor[] = [
  {
    service: 'Exoscale',
    purpose: 'Compute and object storage',
    dataProcessed: 'Encrypted data at rest',
    location: 'Switzerland',
  },
  {
    service: 'Infomaniak',
    purpose: 'Off-site backup storage and domain registration',
    dataProcessed: 'Encrypted backups',
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
