import fs from 'fs'
import path from 'path'
// 🔴 THE SEED, NOT THE SEAM (WEB-26). lib/glossary's accessors are async now (a
// request-time CDN read behind CMS_RUNTIME_KINDS) and this is a build-time CLI script
// with no request to serve — it reads the same build-time generated file
// scripts/generate-glossary.ts just wrote, exactly as it did before the runtime seam
// existed. public/llms.txt / llms-full.txt therefore stay a build-time snapshot: they
// can lag a live CMS edit by up to a deploy cycle even after a kind moves to runtime.
import { generatedGlossaryTerms as glossaryTerms } from '../lib/glossary.gen'
import { getBlogPostsSeed } from '../lib/blog'
import { getLearnArticles } from '../lib/learn'
import { UNPUBLISHED } from '../components/overhaul/blog/content'

const ROOT = process.cwd()
const SITE = 'https://ciphera.net'
const LLMS_TXT_PATH = path.join(ROOT, 'public', 'llms.txt')
const LLMS_FULL_TXT_PATH = path.join(ROOT, 'public', 'llms-full.txt')

const AI_POLICY =
  "AI training on this site's content is not permitted. Search indexing is allowed."

// * The overhaul (18-10-2026, plan D1, D5): Ciphera is a privacy-first software company whose one product is Pulse
// * Analytics. Every sentence below is one the rebuilt pages already say (the homepage FAQ and rules, About, Trust),
// * so the machine-readable summary cannot drift from the site. Change them together.
// * The four posts the overhaul retires (D39) and the retired glossary terms (the warrant canary, D6; five
// * email-authentication terms, D43) redirect, and the CMS keeps them as drafts, so they are left out here as they are
// * from the sitemap and the glossary's own lists (components/overhaul/glossary/content.ts REMOVED).
const RETIRED_POSTS = new Set<string>(UNPUBLISHED)
const RETIRED_TERMS = new Set<string>(['warrant-canary', 'dkim', 'dmarc', 'mta-sts', 'spf', 'transactional-email'])

const SUMMARY =
  'Ciphera is a Belgian software company. We build privacy-first tools for the web and run them on Swiss infrastructure.'

const INTRO =
  'Ciphera BV is a software company in Diegem, near Brussels, founded on 18 September 2024. Its product is Pulse Analytics, web analytics without cookies (pulse.ciphera.net). Customer data and its backups are stored in Switzerland, at Exoscale in Zurich with backups at Infomaniak, under the Swiss data protection act. Ciphera itself is a Belgian company, so Belgian law and the GDPR apply to it as well.'

const DISAMBIGUATION =
  'Ciphera BV (ciphera.net) is not affiliated with ciphera.co, ciphera.org, Ciphera Ltd (ciphera.uk) or the Ciphera apps.'

const PULSE = {
  name: 'Pulse Analytics',
  url: 'https://pulse.ciphera.net',
  oneLiner:
    'Web analytics that shows how your site is doing without cookies and without following anyone. It is hosted in Switzerland and the Personal plan is free forever.',
  bullets: [
    'No cookies, and no fingerprint of anyone',
    'Data stored in Switzerland, backups included',
    'Exports your data as CSV, Excel or JSON, and you can delete it whenever you want',
    'The dashboard and the tracking script are open source (AGPL-3.0)',
  ],
}

const OPEN_SOURCE = [
  {
    name: 'Tessera',
    url: 'https://github.com/ciphera-net/tessera',
    what: "The library behind Ciphera's sign-in, an implementation of OPAQUE (RFC 9807) with SDKs for Go and the browser. Apache-2.0.",
  },
  {
    name: 'Pulse dashboard and tracker',
    url: 'https://github.com/ciphera-net/pulse',
    what: 'The app Pulse customers use, and the script that runs on their websites. AGPL-3.0.',
  },
  { name: 'Pulse CLI', url: 'https://github.com/ciphera-net/pulse-cli', what: 'Pulse analytics from the terminal. Apache-2.0.' },
  { name: 'This website', url: 'https://github.com/ciphera-net/website', what: 'The code behind ciphera.net. AGPL-3.0.' },
]

const SIGN_IN = [
  'Signing in to Ciphera uses a protocol called OPAQUE (RFC 9807). The browser proves that it knows the password without sending it.',
  'At sign-up the browser creates a record that Ciphera stores. It contains neither the password nor a hash of it. The key needed to test password guesses against that record is kept apart from the database, so a stolen copy of the database is not enough to start guessing.',
  'Apps get an access token that lasts 15 minutes, and the refresh token behind it changes every time it is used.',
]

const AUDIT = 'Tessera has a published self-audit and threat model. No independent firm has audited it. Ciphera holds no SOC 2 or ISO 27001 certification.'

function esc(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function header(lines: string[]) {
  lines.push('# Ciphera')
  lines.push('')
  lines.push(`> ${SUMMARY}`)
  lines.push('')
  lines.push(INTRO)
  lines.push('')
  lines.push(DISAMBIGUATION)
  lines.push('')
}

// ---------------------------------------------------------------------------
// public/llms.txt — curated, ~80-120 lines
// ---------------------------------------------------------------------------

function buildLlmsTxt(): string {
  const blogPosts = getBlogPostsSeed().filter((p) => !RETIRED_POSTS.has(p.slug)).slice(0, 10)

  const lines: string[] = []
  header(lines)

  lines.push('## Product')
  lines.push(`- [${PULSE.name}](${PULSE.url}): ${esc(PULSE.oneLiner)}`)
  lines.push('')

  lines.push('## Open source')
  for (const r of OPEN_SOURCE) {
    lines.push(`- [${r.name}](${r.url}): ${esc(r.what)}`)
  }
  lines.push('')

  lines.push('## Key facts')
  lines.push('- Company: Ciphera BV, enterprise number (KBO/BCE) 1013.721.660, De Kleetlaan 2, 1831 Diegem, Belgium')
  lines.push('- Founded: 18 September 2024')
  lines.push('- Data: stored in Switzerland (Exoscale, Zurich; backups at Infomaniak), under the Swiss data protection act')
  lines.push("- Sign-in: Ciphera's own, built on OPAQUE (RFC 9807); the password never leaves the user's device")
  lines.push('- ciphera.net sets no cookies, and Pulse counts visits without cookies and without building a fingerprint of anyone')
  lines.push('- Carbon footprint: estimated with life-cycle assessment, method published')
  lines.push('')

  lines.push('## Reference')
  lines.push(`- [About](${SITE}/about): the company, who runs it, its registered details and press assets`)
  lines.push(`- [Trust & security](${SITE}/trust): what we keep, every company we work with, how sign-in works, what is public, and how to report a security problem`)
  lines.push(`- [Blog](${SITE}/blog): notes on privacy and the web`)
  lines.push(`- [Glossary](${SITE}/glossary): definitions of privacy and cryptography terms`)
  lines.push(`- [Sustainability](${SITE}/sustainability): estimated carbon footprint and its method`)
  lines.push(`- [Contact](${SITE}/contact): email addresses and the office`)
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

  lines.push(`Full corpus (the company facts, the glossary, and every blog and learn article): ${SITE}/llms-full.txt`)
  lines.push('')

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// public/llms-full.txt — comprehensive
// ---------------------------------------------------------------------------

function buildLlmsFullTxt(): string {
  const blogPosts = getBlogPostsSeed().filter((p) => !RETIRED_POSTS.has(p.slug))
  const learnArticles = getLearnArticles()
  const terms = glossaryTerms.filter((t) => !RETIRED_TERMS.has(t.slug))

  const lines: string[] = []
  header(lines)
  lines.push('This file is the companion to llms.txt: the company facts, the complete glossary, and every blog and learn article.')
  lines.push('')

  lines.push(`## ${PULSE.name}`)
  lines.push(`URL: ${PULSE.url}`)
  lines.push('')
  lines.push(esc(PULSE.oneLiner))
  lines.push('')
  for (const b of PULSE.bullets) {
    lines.push(`- ${b}`)
  }
  lines.push('')

  lines.push('## How sign-in works')
  lines.push(`URL: ${SITE}/trust#sign-in`)
  lines.push('')
  for (const para of SIGN_IN) {
    lines.push(esc(para))
    lines.push('')
  }

  lines.push('## Open source')
  lines.push(`URL: ${SITE}/trust#open-source`)
  lines.push('')
  lines.push("Much of Ciphera's code is public on GitHub (github.com/ciphera-net).")
  lines.push('')
  for (const r of OPEN_SOURCE) {
    lines.push(`- [${r.name}](${r.url}): ${esc(r.what)}`)
  }
  lines.push('')
  lines.push(AUDIT)
  lines.push('')

  lines.push('## Glossary')
  lines.push('')
  if (terms.length === 0) {
    lines.push('No glossary terms are published yet.')
    lines.push('')
  } else {
    for (const t of terms) {
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

  lines.push('## Trust & Security')
  lines.push('')
  lines.push(
    'The trust page sets out what Ciphera keeps and what it does not, every company it works with, how sign-in works, what is public, and how to report a security problem (security@ciphera.net, with a machine-readable RFC 9116 security.txt).'
  )
  lines.push(`URL: ${SITE}/trust`)
  lines.push('')

  lines.push('## Sustainability')
  lines.push('')
  lines.push(
    "Ciphera measures its infrastructure's carbon footprint with a life-cycle assessment covering all four lifecycle phases — manufacturing, transport, use, and end-of-life — rather than reporting operational energy use alone. Our servers run on Swiss grid electricity. Methodology and current figures are published and updated regularly."
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
