import fs from 'fs'
import path from 'path'
import { glossaryTerms } from '../lib/glossary'
import { getBlogPosts } from '../lib/blog'
import { getLearnArticles } from '../lib/learn'

const ROOT = process.cwd()
const SITE = 'https://ciphera.net'
const LLMS_TXT_PATH = path.join(ROOT, 'public', 'llms.txt')
const LLMS_FULL_TXT_PATH = path.join(ROOT, 'public', 'llms-full.txt')

const AI_POLICY =
  "AI training on this site's content is not permitted. Search indexing is allowed."

interface ProductFact {
  slug: string
  name: string
  oneLiner: string
  paragraph: string
  bullets: string[]
}

// * Facts below are sourced from each product page's metadata/schema blocks
// * (app/products/*/page.tsx, first ~60 lines) as of the last manual review.
// * Update this list if a product page's positioning changes materially.
const PRODUCTS: ProductFact[] = [
  {
    slug: 'pulse',
    name: 'Pulse',
    oneLiner:
      'Privacy-first website analytics with no cookies, no fingerprinting, and no personal data collection. GDPR compliant by design.',
    paragraph:
      'Pulse is cookie-free website analytics: real-time dashboards and geographic insights without tracking individual visitors. The tracking script is under 2KB and the product is open source.',
    bullets: [
      'No cookies, no fingerprinting, no personal data collection',
      'GDPR compliant by architecture, not policy',
      'Tracking script under 2KB',
      'Open source',
    ],
  },
  {
    slug: 'id',
    name: 'Ciphera ID',
    oneLiner:
      'Zero-knowledge identity and authentication provider using OPAQUE (RFC 9807) — passwords never reach the server.',
    paragraph:
      'Ciphera ID is the identity layer behind Ciphera. It authenticates every account with OPAQUE, an asymmetric password-authenticated key exchange standardized in RFC 9807, so the password never leaves the client in any form — not even during registration. Ciphera ID also supports passkeys (WebAuthn/FIDO2), TOTP two-factor authentication, and OAuth 2.0 with mandatory PKCE.',
    bullets: [
      'Zero-knowledge password authentication via OPAQUE (RFC 9807), not password hashing',
      'The OPAQUE implementation is open-sourced as Tessera (Rust core, Go and TypeScript SDKs, Apache-2.0)',
      'Passkeys (WebAuthn/FIDO2) and TOTP two-factor authentication supported',
      'OAuth 2.0 with mandatory PKCE (S256) on all authorization-code flows',
      'JWT sessions: 15-minute access tokens, 30-day rotating refresh tokens',
    ],
  },
  {
    slug: 'captcha',
    name: 'Ciphera Captcha',
    oneLiner:
      'Privacy-first bot protection using adaptive proof-of-work and behavioral analysis — no cookies, no cross-site tracking.',
    paragraph:
      'Ciphera Captcha protects applications from bots with adaptive proof-of-work, puzzle challenges, audio verification, and behavioral risk scoring. It is fully stateless and does not track users across sites.',
    bullets: [
      'Adaptive proof-of-work and puzzle challenges',
      '5-signal behavioral risk scoring',
      'No cookies, no cross-site tracking',
      'Fully stateless, self-hosted',
    ],
  },
  {
    slug: 'relay',
    name: 'Ciphera Relay',
    oneLiner:
      'Privacy-first transactional email infrastructure with TLS 1.3, DKIM, SPF, and DMARC — no tracking pixels.',
    paragraph:
      'Ciphera Relay delivers transactional email (verification, notifications, alerts) with TLS 1.3 encryption in transit and DKIM/SPF/DMARC authentication. It carries no tracking pixels and no open tracking, and is Swiss hosted.',
    bullets: [
      'TLS 1.3, DKIM, SPF, and DMARC',
      'No tracking pixels, no open tracking',
      'Swiss hosted',
      '99.8% deliverability',
    ],
  },
]

function esc(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

// ---------------------------------------------------------------------------
// public/llms.txt — curated, ~80-120 lines
// ---------------------------------------------------------------------------

function buildLlmsTxt(): string {
  const blogPosts = getBlogPosts().slice(0, 10)

  const lines: string[] = []

  lines.push('# Ciphera')
  lines.push('')
  lines.push(
    '> Privacy-first infrastructure: cookieless analytics, zero-knowledge authentication, private bot protection, and tracking-free transactional email. Belgian company with Swiss-hosted infrastructure.'
  )
  lines.push('')
  lines.push(
    'Ciphera builds privacy-first infrastructure and applications on zero-knowledge principles: cookieless website analytics (Pulse), zero-knowledge authentication using OPAQUE (Ciphera ID — passwords never reach the server), private bot protection (Ciphera Captcha), and tracking-free transactional email (Ciphera Relay). Ciphera BV is based in Diegem, Belgium, and hosts its infrastructure in Switzerland (Exoscale, Zurich CH-DK-2), under Swiss FADP protection.'
  )
  lines.push('')

  lines.push('## Products')
  for (const p of PRODUCTS) {
    lines.push(`- [${p.name}](${SITE}/products/${p.slug}): ${esc(p.oneLiner)}`)
  }
  lines.push('')

  lines.push('## Key facts')
  lines.push('- Founded: 2024, Diegem, Belgium (Ciphera BV)')
  lines.push('- Infrastructure: Swiss-hosted (Exoscale, Zurich CH-DK-2), Swiss FADP protected')
  lines.push(
    '- Authentication: zero-knowledge, OPAQUE (RFC 9807) — passwords never reach the server'
  )
  lines.push(
    '- Open source: OPAQUE implementation released as Tessera (github.com/ciphera-net/tessera, Apache-2.0)'
  )
  lines.push('- Compliance: GDPR and Swiss FADP')
  lines.push('- No cookies, no fingerprinting, no third-party trackers')
  lines.push('- Warrant canary: monthly, GPG-signed')
  lines.push('- Carbon footprint: published with a full life-cycle assessment')
  lines.push('')

  lines.push('## Reference')
  lines.push(`- [Glossary](${SITE}/glossary): definitions of privacy and cryptography terms`)
  lines.push(`- [Learn](${SITE}/learn): in-depth articles per product`)
  lines.push(`- [Blog](${SITE}/blog): articles on privacy, security, and infrastructure`)
  lines.push(`- [Trust & Security](${SITE}/trust): architecture proofs, audit status, legal process reports, and disclosure policy`)
  lines.push(`- [Warrant canary](${SITE}/trust/canary): monthly GPG-signed canary`)
  lines.push(`- [Sustainability](${SITE}/sustainability): measured carbon footprint and methodology`)
  lines.push('')

  lines.push('## Blog')
  for (const post of blogPosts) {
    lines.push(`- [${post.title}](${SITE}/blog/${post.slug}): ${esc(post.description)}`)
  }
  lines.push('')

  lines.push('## Policies')
  lines.push(`- Privacy policy: ${SITE}/privacy`)
  lines.push(`- Terms of service: ${SITE}/terms`)
  lines.push(`- ${AI_POLICY}`)
  lines.push('')

  lines.push('## Contact')
  lines.push('- Email: hello@ciphera.net')
  lines.push('- Address: De Kleetlaan 2, 1831 Diegem, Belgium')
  lines.push('')

  lines.push(`Full corpus (products, glossary, blog, and learn articles in full): ${SITE}/llms-full.txt`)
  lines.push('')

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// public/llms-full.txt — comprehensive
// ---------------------------------------------------------------------------

function buildLlmsFullTxt(): string {
  const blogPosts = getBlogPosts()
  const learnArticles = getLearnArticles()

  const lines: string[] = []

  lines.push('# Ciphera')
  lines.push('')
  lines.push(
    '> Privacy-first infrastructure: cookieless analytics, zero-knowledge authentication, private bot protection, and tracking-free transactional email. Belgian company with Swiss-hosted infrastructure.'
  )
  lines.push('')
  lines.push(
    'Ciphera builds privacy-first infrastructure and applications on zero-knowledge principles: cookieless website analytics (Pulse), zero-knowledge authentication using OPAQUE (Ciphera ID — passwords never reach the server), private bot protection (Ciphera Captcha), and tracking-free transactional email (Ciphera Relay). Ciphera BV is based in Diegem, Belgium, and hosts its infrastructure in Switzerland (Exoscale, Zurich CH-DK-2), under Swiss FADP protection. This file is the comprehensive companion to llms.txt: full product fact sheets, the complete glossary, and every blog and learn article.'
  )
  lines.push('')

  lines.push('## Products')
  lines.push('')
  for (const p of PRODUCTS) {
    lines.push(`### ${p.name}`)
    lines.push(`URL: ${SITE}/products/${p.slug}`)
    lines.push('')
    lines.push(esc(p.paragraph))
    lines.push('')
    for (const b of p.bullets) {
      lines.push(`- ${b}`)
    }
    lines.push('')
  }

  lines.push('## Glossary')
  lines.push('')
  if (glossaryTerms.length === 0) {
    lines.push('No glossary terms are published yet.')
    lines.push('')
  } else {
    for (const t of glossaryTerms) {
      lines.push(`### ${t.term}`)
      lines.push(esc(t.short))
      for (const para of t.paragraphs) {
        lines.push(esc(para))
      }
      lines.push(`URL: ${SITE}/glossary/${t.slug}`)
      lines.push('')
    }
  }

  lines.push('## Learn articles')
  lines.push('')
  if (learnArticles.length === 0) {
    lines.push('No learn articles are published yet.')
  } else {
    for (const a of learnArticles) {
      lines.push(
        `- [${a.title}](${SITE}/learn/${a.product}/${a.slug}): ${esc(a.description)}`
      )
    }
  }
  lines.push('')

  lines.push('## Blog')
  lines.push('')
  if (blogPosts.length === 0) {
    lines.push('No blog posts are published yet.')
  } else {
    for (const post of blogPosts) {
      lines.push(`- [${post.title}](${SITE}/blog/${post.slug}): ${esc(post.description)}`)
    }
  }
  lines.push('')

  lines.push('## Transparency')
  lines.push('')
  lines.push(
    'Ciphera publishes a monthly GPG-signed warrant canary, signed with an offline key, stating that no secret government compulsion has been received; a lapsed canary is itself the disclosure. Past canaries are archived, and periodic transparency reports summarize legal process received. Everything is independently verifiable: pull the plaintext and signature directly from the site and verify with gpg.'
  )
  lines.push(`URL: ${SITE}/trust`)
  lines.push(`URL: ${SITE}/trust/canary`)
  lines.push(`URL: ${SITE}/trust/report`)
  lines.push('')

  lines.push('## Sustainability')
  lines.push('')
  lines.push(
    "Ciphera measures its infrastructure's carbon footprint with a life-cycle assessment covering all four lifecycle phases — manufacturing, transport, use, and end-of-life — rather than reporting operational energy use alone. Infrastructure runs on Swiss grid electricity, which the Swiss Federal Office of Energy rates at roughly 12 gCO2e/kWh, predominantly hydro and nuclear. Methodology and current figures are published and updated regularly."
  )
  lines.push(`URL: ${SITE}/sustainability`)
  lines.push('')

  lines.push('## Policies')
  lines.push(`- Privacy policy: ${SITE}/privacy`)
  lines.push(`- Terms of service: ${SITE}/terms`)
  lines.push(`- ${AI_POLICY}`)
  lines.push('')

  return lines.join('\n')
}

function main() {
  const llmsTxt = buildLlmsTxt()
  const llmsFullTxt = buildLlmsFullTxt()

  fs.writeFileSync(LLMS_TXT_PATH, llmsTxt, 'utf-8')
  fs.writeFileSync(LLMS_FULL_TXT_PATH, llmsFullTxt, 'utf-8')

  console.log(`Generated public/llms.txt (${llmsTxt.length} bytes)`)
  console.log(`Generated public/llms-full.txt (${llmsFullTxt.length} bytes)`)
}

main()
