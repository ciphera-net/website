/**
 * Round 5 (mock, 17-10-2026): every word on the Trust page, shared by all block options so only pixels differ.
 * Ruled: outline A (D27), the track record as one linked line (D29), the provider list covering every outside service
 * (D30). Everything else is a DRAFT for the wording round after the pixels, written from the content review's verified
 * facts (plan §5g; raw results in Public/docs/data/17-10-2026-trust-content-review/) and passed through the humanizer.
 * The comment beside a claim names the review item that backs it. A claim the review found untrue is never restated.
 * Straight apostrophes, as the rest of the overhaul copy. No hooks and no server-only imports: server and client
 * options can both read it.
 */
import { cdnUrl } from '@/lib/cdn'


/** One revision date for the visible "Last updated" line, the JSON-LD dateModified and (when built) the sitemap. */
export const UPDATED = { iso: '2026-10-27', label: '27 October 2026' }

// The page's title and meta description (/trust has no CMS SEO row: its metadata lives only in code). Draft.
export const META = {
  title: 'Trust & security',
  description:
    'How Ciphera protects your data: what we keep, every company we work with, how sign-in works, which code is public, and how to report a security problem.',
}

export const OPENING = {
  // R3b draft (humanized 17-10), the header menu's line for this page.
  title: 'Trust & security',
  lead: 'How we protect your data, and who we work with.',
}

export const DATA = {
  id: 'data',
  eyebrow: 'Your data',
  title: "What we keep, and what we don't.",
  lead: 'Each product keeps what it needs to work. The privacy policy lists every item and how long we keep it.',
  // Pulse, re-read against the live privacy policy §4.3 on 17-10 (round 5b): referrers AND UTM campaigns; location is
  // country, region AND city unless the site owner narrows it; device type, browser and OS (the user agent itself is
  // not stored); a one-day identifier per visitor (since 27-10-2026; the monthly hash kept from 26-08 to 26-10 was deleted); a coarse bot-detection code, per site,
  // deleted after 14 days. "No cookies" holds on the tracker (T-B05); "no browser storage" holds from tracker 1.7.0 (27-10) except the opt-out flag, and is still never
  // claimed. Never: IP addresses (discarded after the hash and the location lookup), anything typed (the interaction
  // script records no keystrokes or field values), cross-site linking (T-B07). "Names or email addresses" was DROPPED
  // from never: Pulse collects none by default, but a site owner can put them in a custom event, so "never" was untrue.
  groups: [
    {
      key: 'pulse',
      label: 'On websites that use Pulse',
      kept: [
        'Which pages were viewed, and the site or campaign a visitor came from',
        'Country, region and city, unless the site owner narrows it',
        'Device type, browser and operating system',
        'A one-day identifier for each visitor, so a returning reader counts once for each day they visit',
        'A short code for spotting bots, deleted after 14 days',
      ],
      never: ['Cookies', 'IP addresses', 'Anything you type', 'Anything that follows a person to other sites'],
      // Phosphor icon names, one per item, for an option that draws icon tiles (round 5b, option D).
      keptIcons: ['FileText', 'MapPin', 'Devices', 'Hash', 'Robot'],
      neverIcons: ['Cookie', 'Network', 'Keyboard', 'Footprints'],
    },
    {
      key: 'account',
      label: 'For your Ciphera account',
      // Vault, record, mail copy: §5g items 1 and 15. Audit log: HMAC-hashed IPs, purged after 180 days (T-A16).
      kept: [
        'A sign-in record that is not your password',
        'A vault with your name and email address, which only your browser can open',
        'A copy of your email address that our mail service can read, so it can write to you',
        'A log of sign-ins and security changes, with IP addresses hashed, kept for 180 days',
      ],
      never: ['Your password, or a hash of it'],
      keptIcons: ['Key', 'Vault', 'EnvelopeSimple', 'ClockCounterClockwise'],
      neverIcons: ['Password'],
    },
  ],
  // Round 5b, option E: one pageview as Pulse keeps it. EXAMPLE values, labelled as such on the page (the review's rule:
  // never an unlabelled invented value). Labels are words, not column names: this claims no schema. `place`/`mark`:
  // a flag or a brand mark an option may draw beside the value.
  record: {
    title: 'One pageview, as Pulse keeps it',
    note: 'Example values',
    fields: [
      { label: 'Page', value: '/blog/privacy-first', code: true },
      { label: 'Came from', value: 'duckduckgo.com' },
      { label: 'Campaign', value: 'newsletter' },
      { label: 'Country', value: 'Belgium', place: 'be' },
      { label: 'Region and city', value: 'Flanders, Ghent' },
      { label: 'Device', value: 'Desktop' },
      { label: 'Browser', value: 'Firefox', mark: 'firefox' },
      { label: 'Operating system', value: 'macOS' },
      { label: 'One-day identifier', value: '3f9a1c…e27b', code: true, note: 'Changes every day' },
    ],
    absentTitle: 'Not in the record',
    absent: ['IP address', 'Cookie', 'Browser details (the user agent)', 'Anything you type'],
  },
  accountRecord: {
    title: 'Your account, as we keep it',
  },
  // Round 5b, option F: the real Pulse dashboard (ciphera.net's own site, captured 16-10-2026; no customer data,
  // checked then). Pins at % of the capture (2880 x 2120), each on a panel that shows something Pulse keeps.
  dashboard: {
    src: cdnUrl('/overhaul/pulse-dashboard-trust-16-10-2026.png'),
    w: 2880,
    h: 2120,
    alt: "Ciphera's own Pulse dashboard: visitors, pageviews, a daily chart, referrers and countries",
    // Not "what Pulse keeps is what you see": the visitor hash and the bot code are kept and never shown.
    caption: "The pins mark what Pulse keeps, where it shows up in your own dashboard. This one is ciphera.net's.",
    // Each pin sits on the EDGE of its panel (never on the text it names) and its label rides above it, so labels
    // cannot run into a neighbouring pin (the first version's referrers label ran into the countries pin).
    pins: [
      { x: 9.4, y: 14.1, label: 'Unique visitors, counted one day at a time' },
      { x: 10.6, y: 69.0, label: 'Referrers and campaigns' },
      { x: 57.2, y: 69.0, label: 'Country, region and city' },
    ],
  },
  // lib/subprocessors.ts `weDoNotUse`, as one sentence (T-F14, T-F15, T-F16: true). When built, this stays one source
  // for /trust and /privacy, so the sentence form ships with the legal round (R9).
  keptLabel: 'We keep',
  neverLabel: 'Never',
  notUsed:
    "We don't use Google or Meta tracking, ad networks, data brokers or outside CAPTCHA services, and our emails carry no tracking pixels.",
  policyLabel: 'Read the privacy policy',
  policyHref: '/privacy',
}

/**
 * D30 (owner 17-10): every outside service, Let's Encrypt and Linear included. Corrected from lib/subprocessors.ts
 * (§5g items 7 to 9): Bunny's purpose names its hosting, and what it sees is the requests themselves (TLS ends at its
 * edge). Since the move to Infomaniak (28-10-2026) Infomaniak's row comes first and names our servers, databases, file
 * storage and backups, and Exoscale's names our email server and backup storage. Neither row here has encryption
 * words. The privacy policy's own table (lib/subprocessors.ts, which only /privacy renders) names Infomaniak's
 * encryption at rest, because its contract states it, and makes no such claim for Exoscale.
 * 🔴 This list and that table are two lists: edit them together.
 * `place`: the country flag an option may draw. `mark`: the brand mark an option may draw (brand-marks.ts INFRA_MARKS,
 * Phosphor's GitHub mark, Simple Icons CC0 where the icon exists, or the company's own drawing from its own site, as
 * Mollie's "m"; never a made-up logo).
 */
export const PROVIDERS = {
  id: 'providers',
  legacyId: 'subprocessors',
  eyebrow: 'Where it runs',
  title: 'Every company we work with.',
  // §5g item 2: data and off-site backups in Switzerland (true); the website and the edge are not (Magic Containers).
  lead: [
    'The servers that store your data are in Geneva, with off-site backups elsewhere in Switzerland.',
    "Every request reaches them through bunny.net, which also hosts this website. Connections are decrypted on bunny.net's servers on the way in, so bunny.net handles the full requests, IP addresses included.",
  ],
  columns: { name: 'Company', role: 'What we use it for', sees: 'What it sees', where: 'Where' },
  rows: [
    { name: 'Infomaniak', mark: 'infomaniak', role: 'Our servers, databases, file storage and backups, and our domain name', sees: 'Everything we store', where: 'Switzerland', place: 'ch' },
    { name: 'Exoscale', mark: 'exoscale', role: 'Our email server and backup storage', sees: 'Our email and copies of our backups', where: 'Switzerland', place: 'ch' },
    { name: 'bunny.net', mark: 'bunnydotnet', role: 'Content delivery, DNS, DDoS protection, and hosting for this website', sees: 'Every request, including IP addresses', where: 'Slovenia, servers worldwide', place: 'si' },
    { name: 'Mollie', mark: 'mollie', role: 'Payments', sees: 'Billing and subscription details', where: 'Netherlands', place: 'nl' },
    { name: 'GitHub', mark: 'github', role: 'Our source code', sees: 'Code, no personal data about you', where: 'United States', place: 'us' },
    { name: "Let's Encrypt", mark: 'letsencrypt', role: 'Security certificates', sees: 'Our domain names, no personal data', where: 'United States', place: 'us' },
    { name: 'Linear', mark: 'linear', role: 'Our internal work tracker', sees: 'Technical notes, no personal data about you', where: 'United States', place: 'us' },
  ],
  // Headings for an option that groups the rows by country (review F12: the mixed group had no words, only flags).
  groupLabels: { ch: 'Switzerland', europe: 'Elsewhere in Europe', us: 'United States' },
  // "The whole list" is true in the broad sense after D30. The DPA sentence is the privacy policy's own (§11).
  scope: 'That is the whole list. We have a data processing agreement with each company that handles personal data.',
  // Scope notes (drafts, cut in the wording round if they read as too much): customer-initiated recipients and the
  // public package registries are neither processors nor services we run on.
  // W5-5 ruled 17-10 (repeats only): the package-registry note went.
  scopeNotes: ['Services you connect yourself, such as Google Search Console, are not on it.'],
}

export const SIGN_IN = {
  id: 'sign-in',
  eyebrow: 'How sign-in works',
  // products/id s2-h2: true (passkey sign-in involves no password at all).
  title: 'Your password never leaves your device.',
  // OPAQUE (RFC 9807): the browser proves the password without sending it (T-A01, T-A02); the CLIENT builds the record
  // at sign-up (Tessera SPEC §5). The OPRF key is a separate secret mounted only into the sidecar, so a stolen
  // database alone gives nothing to test guesses against (§5g item 15). NOT claimed: that a compromised server learns
  // nothing (RFC 9807 §10.11), that a breach yields "nothing usable" (2FA recovery codes, §5g Also found).
  body: [
    'Signing in to Ciphera uses a protocol called OPAQUE. Your browser proves that it knows your password without sending it to us.',
    'When you sign up, your browser creates a record that we store. It contains neither your password nor a hash of it. The key needed to test password guesses against that record is kept apart from the database, so a stolen copy of the database is not enough to start guessing.',
  ],
  // §5g item 1: the address told straight (sealForRelay → Iris). "Verification codes and security alerts": the Iris
  // templates id_verify_otp and the id_* alerts.
  email:
    'Your name and email address are sealed in a vault that only your browser can open. Our mail service keeps its own encrypted copy of your email address, so it can send you verification codes and security alerts. The sign-in server can read neither.',
  // __tests__/recovery-copy-honesty: a surface that mentions the phrase must state all three REQUIRED claims. The
  // passkey condition keeps the third one true (products/id s2-gone, s2-only-other-way).
  // W5-2 ruled 17-10: version B (48 words; "new accounts get one at sign-up" is implied and went).
  recovery:
    "We can't reset your password, because we never have it. Your 24-word recovery phrase gets you back in. Accounts from before 7 September 2026 set one up from Security settings. If you lose your password with no recovery phrase enrolled and no passkey, the account cannot be recovered.",
  // products/id s4-15min, s4-rotate, s4-lockout: true (5, 10 and 20 failures lock 15 minutes, 1 hour, 24 hours).
  sessions:
    'Once you are in, apps get an access token that lasts 15 minutes, and the refresh token behind it changes every time it is used. Repeated wrong passwords lock the account for 15 minutes, then an hour, then a day.',
  // What the server stores: users table columns (migrations 039, 058, 059). Column names are machine data, so an option
  // may set them in mono; the descriptions are words. NO invented hex values (§5g item 14).
  stored: [
    // W5-5 ruled 17-10 (repeats only): the second sentence went; body[1] says it.
    { column: 'opaque_record', what: 'The sign-in record your browser created.' },
    { column: 'opaque_wrapped_key', what: 'The key to your vault, locked with a key your browser derives from your password.' },
    { column: 'encrypted_vault', what: 'Your name and email address, sealed on your device.' },
    { column: 'email_blind_index', what: 'A keyed fingerprint of your email address, used to find your account.' },
  ],
  storedLabel: 'What our sign-in server stores about you',
  // For an option that draws the exchange. Correct for OPAQUE: the password stays put; what travels changes every time;
  // the server holds a record built in the browser.
  flow: [
    { place: 'Your device', line: 'Your password stays here.' },
    { place: 'On the way', line: 'A one-time value that is different every time you sign in.' },
    { place: 'Our server', line: 'A record that is not your password.' },
  ],
  tesseraLabel: 'The library behind it is open source',
  tesseraHref: '#open-source',
  // Row labels for an option that sets the block as one ledger.
  topics: {
    password: 'Your password',
    stored: 'What we store',
    email: 'Your email address',
    recovery: 'If you forget your password',
    sessions: 'Once you are in',
  },
  // Round 5c (owner 17-10: "provide me more options"), option E, the exchange drawn large: where the server is
  // (PROVIDERS: Infomaniak, Geneva), and the label of the drawn password field (masking dots only, never a value).
  serverPlace: 'Geneva, Switzerland',
  fieldLabel: 'Password',
  // Option F, one sign-in step by step. Each line restates a claim above: the password stays in the browser and what
  // travels is different every time (body, flow; RFC 9807); the server checks the browser's proof against the record
  // built at sign-up (body[1]); the 15-minute access token (sessions).
  steps: [
    { title: 'You type your password', line: 'It stays in your browser.' },
    { title: 'Your browser proves you know it', line: 'It sends a one-time value that changes every time you sign in.' },
    { title: 'Our server checks the proof', line: 'It uses your sign-in record, which contains neither your password nor a hash of it.' },
    { title: "You're in", line: 'Apps get an access token that lasts 15 minutes.' },
  ],
  // Option G, who can read what. Only your browser opens the vault (name and address, `email` above); the mail service
  // gets the address alone, sealed for it at sign-up (id-frontend app/(public)/signup/page.tsx `sealForRelay(email, …)`;
  // the name rides inside the vault: read on main 17-10); the sign-in server can read neither (§5g item 1); nobody but
  // you has the password (OPAQUE). Column order is the `can` order.
  access: {
    caption: 'Who can read what',
    columns: ['Your password', 'Your name', 'Your email address'],
    rows: [
      { who: 'You, in your browser', can: [true, true, true] },
      { who: 'Our mail service', can: [false, false, true] },
      { who: 'Our sign-in server', can: [false, false, false] },
    ],
    yes: 'Can read',
    no: "Can't read",
  },
}

export const OPEN_SOURCE = {
  id: 'open-source',
  eyebrow: 'Open source',
  // Owner 17-10 (open source = A without the "not public" list, with B's check): the title loses its second half,
  // which nothing on the ruled block answers any more. Was "What is public, and what is not." Wording round W5.
  title: 'What is public.',
  // The sign-in pages (id-frontend) are private, so never "the code that runs in your browser".
  lead: 'You can read the script Pulse runs on websites, the Pulse dashboard, and the cryptography behind our sign-in.',
  // gh repo list ciphera-net --visibility public, 17-10: 25 repositories without .github; licences measured. Never stars.
  public: [
    { name: 'Tessera', repo: 'tessera', what: "The library behind our sign-in, with SDKs for Go and the browser. It builds on opaque-ke, Meta's OPAQUE library.", licence: 'Apache-2.0' },
    { name: 'Pulse dashboard and tracker', repo: 'pulse', what: 'The app our customers use, and the script that runs on their websites.', licence: 'AGPL-3.0' },
    { name: 'Pulse CLI', repo: 'pulse-cli', what: 'Your analytics from the terminal, with the API client and types it uses.', licence: 'Apache-2.0' },
    { name: '14 integrations', repo: '?q=pulse-&type=public', what: 'Pulse for Astro, Nuxt, Framer, Drupal, Joomla, TYPO3 and more.', licence: 'Mostly Apache-2.0' },
    { name: 'This website', repo: 'website', what: 'The code behind ciphera.net, this page included.', licence: 'AGPL-3.0' },
  ],
  publicCount: '25 public repositories',
  // §5g item 4: the engine is private; the sign-in service and the mail service too (GitHub API: 404).
  notPublic: {
    label: 'Not public',
    items: ['The Pulse engine, which receives and counts visits', 'Our sign-in service', 'Our mail service'],
  },
  // T-C07: js.ciphera.net/script.js is byte-identical to public/script.js on ciphera-net/pulse main (SHA-256 measured
  // 17-10). The hash is machine data (mono allowed); the build reads it at build time, never hard-coded.
  receipt: {
    label: 'Check it yourself',
    line: 'The tracker your visitors load is byte for byte the file in our public repository.',
    served: 'js.ciphera.net/script.js',
    repo: 'github.com/ciphera-net/pulse/public/script.js',
    // Re-measured 27-10 20:39 UTC: both URLs hash to this value (7,081 bytes served). An option may show the two
    // commands below as a runnable check: they are literal shell, so mono is right for them.
    servedUrl: 'https://js.ciphera.net/script.js',
    rawUrl: 'https://raw.githubusercontent.com/ciphera-net/pulse/main/public/script.js',
    sha256: '09104a61d7793d7eff4b3b9d6677647b97371a9ce36dd183f68b9a3435450840',
  },
  // §5g item 17, T-C01, T-C08: a self-audit (04-06-2026: 13 findings, 0 critical, 0 high) and a threat model; no
  // independent audit (not "planned": no engagement exists); no SOC 2 or ISO 27001.
  audit: [
    'Tessera has a published self-audit and threat model. No independent firm has audited it.',
    'We hold no SOC 2 or ISO 27001 certification.',
  ],
  auditLinks: [
    { label: 'Self-audit', href: 'https://github.com/ciphera-net/tessera/blob/main/docs/SELF-AUDIT.md' },
    { label: 'Threat model', href: 'https://github.com/ciphera-net/tessera/blob/main/docs/THREAT-MODEL.md' },
  ],
  githubLabel: 'github.com/ciphera-net',
  githubHref: 'https://github.com/ciphera-net',
}

export const DISCLOSURE = {
  // security.txt's Policy: field points at /trust (§5g item 10), so this block must stay on this page.
  id: 'disclosure',
  eyebrow: 'Security reports',
  title: 'Found a security problem? Tell us.',
  email: 'security@ciphera.net',
  how: "Email security@ciphera.net. Tell us what is affected, how to reproduce it and what you think the impact is, and whether you'd like to be credited.",
  // One set of timelines (§5g item 11): today's /trust numbers, pending the owner's choice in the wording round.
  timelines: [
    { term: 'We reply', detail: 'Within 3 business days' },
    { term: 'First assessment', detail: 'Within 7 days' },
    { term: 'Fixes', detail: 'In order of severity, with updates as we go' },
    { term: 'Credit', detail: 'Public, after the fix ships, if you want it' },
  ],
  // T-I05 (true): no bounty. T-G04 (true): no PGP key.
  bounty: "We don't run a paid bug bounty.",
  pgp: "We don't publish a PGP key. If your report is too sensitive for plain email, say so, and we'll set up a secure channel.",
  scope: {
    inLabel: 'In scope',
    in: ['Every site under *.ciphera.net', 'Our public repositories on GitHub'],
    outLabel: 'Out of scope',
    out: ['Denial of service', 'Social engineering', "Problems in other companies' services (please report those to them)"],
  },
  safeHarbour:
    "We won't take legal action against anyone who reports in good faith and follows this policy: don't access more data than you need to show the problem, don't disrupt the service, and give us reasonable time to fix it before you publish.",
  // D29 (owner 17-10): one linked line. GHSA-543h-3j64-gm5q, published 06-09-2026, fixed in besticon v3.23.0 (T-J03).
  record: {
    text: "We report what we find in other people's software too. In July 2026 we reported a server-side request forgery in besticon, an open-source favicon service, which was fixed in September.",
    linkLabel: 'Read the advisory',
    href: 'https://github.com/mat/besticon/security/advisories/GHSA-543h-3j64-gm5q',
  },
  // Row labels for an option that sets the block as one ledger (the timelines carry their own terms).
  labels: {
    contact: 'Where to write',
    bounty: 'Bug bounty',
    pgp: 'Encryption',
    scope: 'Scope',
    safeHarbour: 'Safe harbour',
    record: 'Our own reports',
  },
  securityTxt: {
    label: 'Our security.txt points to this page',
    href: '/.well-known/security.txt',
    // The live file, fetched 17-10-2026 18:15 UTC (6 lines). Literal file content: an option may show it as code.
    lines: [
      '# Ciphera security contact. Full policy: https://ciphera.net/trust',
      'Contact: mailto:security@ciphera.net',
      'Expires: 2027-07-01T00:00:00.000Z',
      'Canonical: https://ciphera.net/.well-known/security.txt',
      'Policy: https://ciphera.net/trust',
      'Preferred-Languages: en',
    ],
  },
  // Round 5c, option E, the email drafted: the four things to include are the `how` sentence's own list. The mailto
  // fills the subject and puts the four as headings in the body, for the reader to fill in.
  draft: {
    toLabel: 'To',
    subjectLabel: 'Subject',
    subject: 'Security report',
    includeLabel: 'What to include',
    include: ['What is affected', 'How to reproduce it', 'What you think the impact is', "Whether you'd like to be credited"],
    button: 'Write the email',
  },
  // Option F: the copy button beside the address.
  copy: { label: 'Copy the address', done: 'Copied', failed: "Couldn't copy" },
  // Option G, the policy as two sides. "What we promise" is the four timelines plus the safe harbour's promise; "What we
  // ask of you" is the `how` sentence's ask and the safe harbour's three conditions. The safe harbour sentence itself
  // stays on the page as written.
  sides: {
    ours: 'What we promise',
    yours: 'What we ask of you',
    legal: { term: 'Legal action', detail: 'None, if you report in good faith and follow this policy' },
    ask: [
      'Tell us what is affected and how to reproduce it',
      "Don't access more data than you need to show the problem",
      "Don't disrupt the service",
      'Give us reasonable time to fix it before you publish',
    ],
  },
}

export const CLOSING = {
  title: 'Running a vendor review?',
  lead: 'Send security questionnaires to security@ciphera.net. For our data processing agreement, write to privacy@ciphera.net.',
  primary: { label: 'Email security@ciphera.net', href: 'mailto:security@ciphera.net' },
  secondary: { label: 'Read the privacy policy', href: '/privacy' },
  contacts: [
    { term: 'Security', detail: 'security@ciphera.net' },
    { term: 'Privacy and data processing', detail: 'privacy@ciphera.net' },
    { term: 'Everything else', detail: 'hello@ciphera.net' },
  ],
  updated: `Last updated ${UPDATED.label}.`,
  // Round 5c, option E: what a vendor review can ask for. The agreement and the questionnaires are the lead's two
  // sentences; the provider list is this page's #providers (the block above); the privacy policy is /privacy.
  kit: [
    { key: 'dpa', title: 'Our data processing agreement', action: 'Write to privacy@ciphera.net', href: 'mailto:privacy@ciphera.net' },
    { key: 'questionnaire', title: 'Your security questionnaire', action: 'Send it to security@ciphera.net', href: 'mailto:security@ciphera.net' },
    { key: 'providers', title: 'Every company we work with', action: 'See the list above', href: '#providers' },
    { key: 'privacy', title: 'Our privacy policy', action: 'Read it', href: '/privacy' },
  ],
  // Option F: the company, as About's record has it (the legal name; Diegem is the seat's postal name).
  company: { name: 'Ciphera BV', place: 'Diegem, Belgium' },
  // Options F and G: the copy button beside an address (its accessible name adds the address).
  copy: { label: 'Copy', done: 'Copied', failed: "Couldn't copy" },
}
