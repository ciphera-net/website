/**
 * migrate-glossary-to-wp.ts — convert lib/glossary/terms-*.ts to Gutenberg markup.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §38 (D29), §38.10
 *
 * 🔴 RUN BY A HUMAN, ONCE, NEVER BY CI. It writes a JSON file; a separate PHP importer
 * in the WordPress pod creates the terms. Two steps on purpose — the conversion is
 * reviewable as a diff before anything is written, and no API user needs write
 * capabilities. Same shape as migrate-blog-to-wp.ts, for the same reasons.
 *
 * 🔑 THE SOURCE IS TYPED DATA, NOT MDX, SO THERE IS NO MARKDOWN PARSER HERE.
 * types.ts says `paragraphs` is "Plain text — no markdown", and that was VERIFIED
 * rather than trusted: across all 53 terms there are zero HTML tags, zero markdown
 * links, zero `**`, zero backticks. The blog converter needed 200 lines of inline
 * parsing with code-span and raw-HTML placeholders; this needs none of it. If a future
 * term ever does contain markup, the assertion below fails the run rather than shipping
 * escaped angle brackets into the middle of a sentence.
 *
 * 🔴 THE SEO BASELINE COMES FROM THE SERVED HTML (§21.2), captured to
 * glossary-served.json by the sibling capture step. Two of the three fields are being
 * deliberately CHANGED — that is the point of the migration — so the baseline exists to
 * make the change reviewable, not to be copied forward.
 */
import fs from 'fs'
import path from 'path'
import { glossaryTerms } from '../lib/glossary'

const OUT = path.join(process.cwd(), 'glossary-migration.json')
const SERVED = process.env.SERVED_JSON ?? path.join(process.cwd(), 'glossary-served.json')

/** Measured on all 53 served pages, 10-09-2026: one uniform suffix, no exceptions. */
const TITLE_SUFFIX = ' - Glossary | Ciphera'
const DESC_LIMIT = 155

function fail(msg: string): never {
  console.error(`\n🔴 migrate-glossary: ${msg}\n`)
  process.exit(1)
}
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function escAttr(s: string): string {
  return esc(s).replace(/"/g, '&quot;')
}

/**
 * 🔴 THE SEO TITLE FOR EVERY TERM, WRITTEN OUT, NOT DERIVED.
 *
 * The live defect: the template was `What is ${term.term}?` against data that types.ts
 * defines as "sentence case except proper nouns/acronyms", so Google was served
 * `What is Blind index?`, `What is Bounce rate?`, `What is Data controller?` — 29 of 53.
 *
 * ⚠️ A MECHANICAL RULE CANNOT FIX THIS, which is why every one is spelled out.
 * Lower-casing the first letter yields `What is blind index?`, which is not English.
 * The correct form varies per term and cannot be inferred from the string:
 *   - a countable noun takes an article   — "What is **a** blind index?"
 *   - an uncountable one takes none       — "What is bounce rate?"
 *   - a plural takes "are"                — "What **are** third-party cookies?"
 *   - an acronym or proper noun is unchanged — "What is GDPR?", "What is Argon2id?"
 * That last class is why the bug survived: the entries anyone would think to spot-check
 * are exactly the ones that read correctly.
 *
 * 🔑 THE <h1> IS NOT CHANGED AND IS NOT PART OF THIS DEFECT. It renders the term itself
 * ("Blind index"), which is correct for a glossary heading — sentence case is what a
 * heading wants. Only the title tag embeds the term mid-sentence, and only the title tag
 * is wrong. Changing both would have altered 53 visible page headings to fix 29 invisible
 * title tags.
 */
const TITLE: Record<string, string> = {
  'cookieless-analytics': 'What is cookieless analytics?',
  'third-party-cookies': 'What are third-party cookies?',
  'fingerprinting': 'What is browser fingerprinting?',
  'tracking-pixel': 'What is a tracking pixel?',
  'bounce-rate': 'What is bounce rate?',
  'unique-visitors': 'What are unique visitors?',
  'session': 'What is a session in analytics?',
  'referrer': 'What is a referrer?',
  'utm-parameters': 'What are UTM parameters?',
  'do-not-track': 'What is Do Not Track (DNT)?',
  'global-privacy-control': 'What is Global Privacy Control (GPC)?',
  'opaque': 'What is OPAQUE?',
  'pake': 'What is a PAKE?',
  'oprf': 'What is an OPRF?',
  'zero-knowledge': 'What is zero-knowledge?',
  'zero-knowledge-authentication': 'What is zero-knowledge authentication?',
  'blind-index': 'What is a blind index?',
  'key-stretching': 'What is key stretching?',
  'argon2id': 'What is Argon2id?',
  'hkdf': 'What is HKDF?',
  'end-to-end-encryption': 'What is end-to-end encryption (E2EE)?',
  'aes-256-gcm': 'What is AES-256-GCM?',
  'passkeys': 'What are passkeys?',
  'pkce': 'What is PKCE?',
  'jwt': 'What is a JWT (JSON Web Token)?',
  'totp': 'What is TOTP?',
  'srp': 'What is SRP (Secure Remote Password)?',
  'transactional-email': 'What is transactional email?',
  'dkim': 'What is DKIM?',
  'spf': 'What is SPF?',
  'dmarc': 'What is DMARC?',
  'mta-sts': 'What is MTA-STS?',
  'open-tracking': 'What is email open tracking?',
  'proof-of-work': 'What is a proof-of-work challenge?',
  'bot-detection': 'What is bot detection?',
  'honeypot': 'What is a honeypot?',
  // ⚠️ "What is GDPR?" is left article-less DELIBERATELY. "the GDPR" is more correct
  // English, but the article-less form is how the question is actually searched, and
  // this one was never part of the defect.
  'gdpr': 'What is GDPR?',
  'fadp': 'What is the FADP (nFADP)?',
  'eprivacy-directive': 'What is the ePrivacy Directive?',
  'consent-banner': 'What is a consent banner?',
  'data-processing-agreement': 'What is a DPA (data processing agreement)?',
  'sub-processor': 'What is a sub-processor?',
  'standard-contractual-clauses': 'What are SCCs (standard contractual clauses)?',
  'eu-us-data-privacy-framework': 'What is the EU-US Data Privacy Framework?',
  'data-residency': 'What is data residency?',
  'data-sovereignty': 'What is data sovereignty?',
  'privacy-by-design': 'What is privacy by design?',
  'data-controller': 'What is a data controller?',
  'data-processor': 'What is a data processor?',
  'personal-data': 'What is personal data?',
  'pseudonymization': 'What is pseudonymization?',
  'anonymization': 'What is anonymization?',
  'warrant-canary': 'What is a warrant canary?',
}

/**
 * 🔴 THE 15 DESCRIPTIONS THAT HAD TO BE WRITTEN, AND WHY THE OTHER 38 DID NOT.
 *
 * Every one of the 53 `short` values is 186–262 characters, so every one is truncated in
 * search results today. The seeding rule was going to be "take the first sentence" —
 * MEASURED, and it fails: **50 of 53 first sentences are themselves over 155 characters**,
 * because these definitions are single long sentences with an em-dash clause.
 *
 * 🔑 So the rule became "cut at the natural break the copy already has" — the first em
 * dash, semicolon or colon that leaves a complete thought between 60 and 155 characters.
 * That is the house sentence shape ("X is Y — nuance"), and it yields a clean, readable
 * description for **38 of 53**. The remaining 15 have no such break and are written here.
 *
 * ⚠️ Truncating those 15 at a word boundary was rejected: it replaces a description
 * Google cuts off with a description WE cut off, which is the same defect wearing a
 * different hat.
 */
const DESCRIPTION: Record<string, string> = {
  // ⚠️ 16, not 15. aes-256-gcm's em-dash clause is EXACTLY 155 characters, so it fitted
  // while the budget ignored the full stop and stopped fitting the moment it did not.
  // The gate caught it and refused the run rather than shipping a 156-char description.
  'aes-256-gcm': 'AES-256-GCM is authenticated encryption: the AES block cipher with 256-bit keys in Galois/Counter Mode, giving confidentiality and integrity at once.',
  'tracking-pixel': 'A tracking pixel is a tiny, invisible image in a page or email whose load tells the sending server that the content was opened.',
  'session': 'In web analytics, a session groups one visitor’s pageviews and events into a single visit, closed out after a period of inactivity.',
  'referrer': 'The referrer is the URL of the page a visitor was on immediately before arriving at the current one, sent by the browser in the Referer header.',
  'utm-parameters': 'UTM parameters are query-string tags appended to a URL so analytics tools can attribute a visit to a specific campaign, channel or link.',
  'opaque': 'OPAQUE is an asymmetric PAKE protocol (RFC 9807) that lets a server verify a password without ever seeing it — not even during registration.',
  'blind-index': 'A blind index is a keyed hash stored in place of a plaintext field, so a database can find records by exact match without holding the value.',
  'totp': 'TOTP (RFC 6238) turns a shared secret and the current time into six-digit codes, giving accounts a second factor that works fully offline.',
  'srp': 'SRP is a password-authenticated key exchange that logs a client in without sending the password. Superseded by OPAQUE (RFC 9807).',
  'open-tracking': 'Email open tracking records when a recipient views a message, usually via an embedded pixel that reports back when remote images load.',
  'gdpr': 'The GDPR (EU 2016/679) is the European Union’s data protection law, in force since 25 May 2018, governing how personal data is handled.',
  'consent-banner': 'A consent banner asks a visitor to accept or decline non-essential cookies and tracking, as the EU ePrivacy Directive requires.',
  'data-processing-agreement': 'A DPA is the contract GDPR Article 28 requires between a controller and a processor, setting the scope, purpose and security obligations.',
  'standard-contractual-clauses': 'SCCs are European Commission-approved contract templates that legalize personal-data transfers to countries without an adequacy decision.',
  'privacy-by-design': 'Privacy by design is the GDPR Article 25 obligation to build data protection into a system’s architecture from the outset, not add it later.',
  'pseudonymization': 'Pseudonymization processes personal data so it cannot be attributed to a person without separately-kept extra information. It stays personal data.',
}

/**
 * The natural break the house copy already has. Returns null when there isn't one.
 *
 * ⚠️ CUTTING AT AN EM DASH LEAVES NO FULL STOP, and the first run shipped 38
 * descriptions ending mid-air — "…without any further interaction or navigation" — each
 * a complete, grammatical clause with no terminator. Every one would have gone to Google
 * looking like it had been chopped, which is the defect this migration exists to fix,
 * arriving from the other direction.
 * 🔑 So the budget reserves the terminator: derive to DESC_LIMIT - 1, then add it. Doing
 * it the other way round pushed the longest (aes-256-gcm, exactly 155) over the limit.
 */
function deriveDescription(short: string): string | null {
  const t = short.replace(/\s+/g, ' ').trim()
  const budget = DESC_LIMIT - 1 // room for the '.'
  for (const mark of ['—', ';', ':']) {
    const i = t.indexOf(mark)
    if (i > 0 && i <= budget + 1) {
      const cand = t.slice(0, i).trim().replace(/[,;:]$/, '')
      if (cand.length >= 60 && cand.length <= budget) return cand + '.'
    }
  }
  // A whole sentence that fits is just as good, and it already has its terminator.
  const m = t.match(/^(.{60,}?[.!?])(\s|$)/)
  if (m && m[1].length <= DESC_LIMIT) return m[1].trim()
  return null
}

function main() {
  const served = fs.existsSync(SERVED)
    ? (JSON.parse(fs.readFileSync(SERVED, 'utf-8')) as Record<string, { title?: string; description?: string }>)
    : fail(`no ${SERVED} — capture the served baseline first (§21.2: never seed from a metadata object)`)

  const out: Record<string, unknown>[] = []
  const changedTitles: string[] = []

  for (const t of glossaryTerms) {
    // ── the plain-text assertion, rather than a parser ────────────────────────
    const prose = [t.short, ...t.paragraphs, ...(t.faq ?? []).flatMap((f) => [f.q, f.a])].join('\n')
    if (/<[a-zA-Z/]|\[[^\]]+\]\([^)]+\)|\*\*|`/.test(prose)) {
      fail(
        `${t.slug} contains markup or markdown, which this converter deliberately does not parse.\n` +
          `   types.ts declares paragraphs as plain text. Either keep it plain, or port the\n` +
          `   inline() parser from migrate-blog-to-wp.ts — do NOT let esc() ship visible tags.`
      )
    }

    const title = TITLE[t.slug]
    if (!title) fail(`${t.slug} has no SEO title in TITLE. Every term needs one written out — see the header.`)

    const description = DESCRIPTION[t.slug] ?? deriveDescription(t.short)
    if (!description) {
      fail(
        `${t.slug} has no usable meta description.\n` +
          `   Its definition has no em dash, semicolon or colon inside ${DESC_LIMIT} characters, so\n` +
          `   nothing can be derived. Write one in DESCRIPTION — do not truncate mid-sentence.`
      )
    }
    if (description.length > DESC_LIMIT) {
      fail(`${t.slug}: description is ${description.length} chars, over the ${DESC_LIMIT} limit.`)
    }
    // 🔴 A description that stops without a terminator reads as truncated, which is
    // exactly what this migration is fixing. Asserted for the hand-written ones too.
    if (!/[.!?]$/.test(description)) {
      fail(`${t.slug}: description does not end in a full stop — it will read as cut off.\n   "${description}"`)
    }

    const fullTitle = title + TITLE_SUFFIX
    const before = served[t.slug]?.title
    if (before && before !== fullTitle) changedTitles.push(`   ${t.slug}\n     was: ${before}\n     now: ${fullTitle}`)

    const blocks: string[] = t.paragraphs.map(
      (p) => `<!-- wp:paragraph -->\n<p>${esc(p)}</p>\n<!-- /wp:paragraph -->`
    )
    for (const f of t.faq ?? []) {
      blocks.push(`<!-- wp:ciphera/faq {"question":"${escAttr(f.q)}","answer":"${escAttr(f.a)}"} /-->`)
    }

    out.push({
      slug: t.slug,
      // 🔑 The H1, unchanged from the repository. See the TITLE header.
      title: t.term,
      category: t.category,
      definition: t.short,
      content: blocks.join('\n\n'),
      related: t.related,
      see: t.see ?? [],
      seo: { title: fullTitle, description },
    })
  }

  if (out.length !== 53) fail(`expected 53 terms, converted ${out.length}`)
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf-8')

  const derived = out.filter((o) => !DESCRIPTION[(o as { slug: string }).slug]).length
  console.log(`\n✅ ${out.length} terms → ${OUT}`)
  console.log(`   descriptions: ${derived} derived at a natural break, ${Object.keys(DESCRIPTION).length} written by hand`)
  console.log(`   titles changed vs the SERVED baseline: ${changedTitles.length} of ${out.length}\n`)
  if (changedTitles.length) console.log(changedTitles.join('\n'))
}

main()
