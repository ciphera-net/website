import type { GlossaryTerm } from './types'

/** Email & infrastructure terms. */
export const emailTerms: GlossaryTerm[] = [
  {
    slug: 'transactional-email',
    term: 'Transactional email',
    category: 'Email & infrastructure',
    short:
      'Transactional email is a message triggered by a specific user action or system event — password resets, receipts, verification codes, shipping notices — as opposed to marketing email sent to a list on a schedule.',
    paragraphs: [
      'The distinction matters legally and technically. Marketing email requires opt-in consent, unsubscribe mechanisms, and list-hygiene discipline under laws like CAN-SPAM and GDPR’s ePrivacy rules; transactional email, sent as the direct result of an action the recipient just took, generally does not — a password-reset email does not need an unsubscribe link, because opting out of it means the account stops functioning.',
      'Deliverability infrastructure for transactional email is typically judged on speed and reliability rather than open rates: a verification code that arrives two minutes late is a support ticket, not a missed marketing metric. That shifts the engineering priorities toward low-latency sending, strict authentication (DKIM, SPF, DMARC) to avoid spam-folder placement, and minimal data retention, since transactional messages carry no analytics purpose once delivered.',
      'Ciphera Relay is built for transactional email specifically — password resets, verification codes, receipts — with no marketing-sending capability, no tracking pixels, and delivery metadata retained for 30 days before deletion.',
    ],
    related: ['dkim', 'spf', 'dmarc', 'open-tracking', 'tracking-pixel'],
    see: [{ label: 'Ciphera Relay', href: '/products/relay' }],
  },
  {
    slug: 'dkim',
    term: 'DKIM',
    category: 'Email & infrastructure',
    short:
      'DKIM (DomainKeys Identified Mail, RFC 6376) lets a sending domain cryptographically sign outgoing email — a public key published in DNS verifies the signature, proving headers and body were not altered in transit.',
    paragraphs: [
      'A sending server computes a hash over selected headers and the message body, signs it with a private key, and attaches the signature as a DKIM-Signature header. The receiving server looks up the corresponding public key at a DNS TXT record — under a selector-specific subdomain of the sending domain — and verifies the signature. A match proves the message genuinely originated from a system holding that domain’s private key and was not modified after signing.',
      'DKIM alone answers "was this message tampered with and does it belong to this domain," not "is this domain allowed to send as this address" — that second question is SPF’s job, and DMARC ties the two together into an enforceable policy. Rotating DKIM keys per domain, rather than sharing one key across many customers on a platform, limits the blast radius if a key is ever compromised.',
      'Ciphera Relay signs every message with a per-domain DKIM key — customers get their own key rather than shared signing infrastructure, which keeps sender reputation isolated per domain.',
    ],
    related: ['spf', 'dmarc', 'mta-sts', 'transactional-email'],
    see: [
      { label: 'RFC 6376 — DKIM', href: 'https://www.rfc-editor.org/rfc/rfc6376' },
      { label: 'Ciphera Relay', href: '/products/relay' },
    ],
  },
  {
    slug: 'spf',
    term: 'SPF',
    category: 'Email & infrastructure',
    short:
      'SPF (Sender Policy Framework, RFC 7208) is a DNS TXT record listing which mail servers may send email for a domain — receiving servers check the connecting IP against it to catch spoofed sender addresses.',
    paragraphs: [
      'A domain publishes a single TXT record naming its authorized sending IPs or including other domains’ SPF records by reference (for services sending on its behalf). When mail arrives, the receiving server checks the IP that delivered it against the sending domain’s published record and returns a pass, fail, or soft-fail result depending on the record’s policy.',
      'SPF has two structural weaknesses on its own: it evaluates the envelope sender (the SMTP MAIL FROM), which recipients rarely see, not the From header they actually read — and it breaks under simple forwarding, since the forwarding server’s IP is not in the original domain’s SPF record. Both are why SPF is deployed alongside DKIM and rolled up into DMARC rather than relied on alone.',
      'Ciphera Relay maintains strict SPF records for every sending domain as one layer of its authentication stack, alongside per-domain DKIM signing and a DMARC reject policy.',
    ],
    related: ['dkim', 'dmarc', 'mta-sts', 'transactional-email'],
    see: [
      { label: 'RFC 7208 — SPF', href: 'https://www.rfc-editor.org/rfc/rfc7208' },
      { label: 'Ciphera Relay', href: '/products/relay' },
    ],
  },
  {
    slug: 'dmarc',
    term: 'DMARC',
    category: 'Email & infrastructure',
    short:
      'DMARC (RFC 7489) is a DNS policy record tying SPF and DKIM together: it requires one to align with the visible From address, tells receivers what to do on failure, and requests reporting on the results.',
    paragraphs: [
      'SPF and DKIM can each pass while still allowing spoofing, because neither is required to match the domain a human actually sees in their inbox. DMARC closes that gap with alignment: it demands that the domain in SPF or DKIM correspond to the visible From header, not just some technically valid but unrelated domain. A message that fails alignment on both checks fails DMARC, regardless of whether SPF or DKIM individually passed.',
      'DMARC’s policy tag (p=none, p=quarantine, or p=reject) tells receiving mail servers what to do with messages that fail — none just monitors, quarantine sends them to spam, and reject refuses delivery outright. Most domains start at p=none while reviewing DMARC aggregate reports, then tighten to reject once they have confirmed every legitimate sending source passes.',
      'Ciphera Relay enforces a DMARC reject policy — mail claiming to be from a Relay-protected domain that fails both SPF and DKIM alignment is refused, not quarantined for a human to second-guess.',
    ],
    related: ['spf', 'dkim', 'mta-sts', 'transactional-email'],
    see: [
      { label: 'RFC 7489 — DMARC', href: 'https://www.rfc-editor.org/rfc/rfc7489' },
      { label: 'Ciphera Relay', href: '/products/relay' },
    ],
  },
  {
    slug: 'mta-sts',
    term: 'MTA-STS',
    category: 'Email & infrastructure',
    short:
      'MTA-STS (RFC 8461) lets a domain require TLS for all inbound email delivery, published and fetched over HTTPS rather than trusted opportunistically — closing the downgrade attack that plain SMTP TLS leaves open.',
    paragraphs: [
      'Standard SMTP transport encryption (STARTTLS) is opportunistic: a sending server offers TLS, but if the connection is intercepted and the offer is stripped, most servers silently fall back to sending the message in plaintext rather than refusing delivery. MTA-STS removes that fallback. A domain publishes a policy — enforced over HTTPS, not DNS alone, since DNS itself can be spoofed without DNSSEC — declaring that mail to it must use TLS with a valid certificate, and sending servers that support MTA-STS will refuse to deliver over a downgraded connection.',
      'The policy is discovered via a well-known HTTPS URL plus a DNS TXT record that signals the policy exists and should be checked; the HTTPS fetch, not the DNS record itself, carries the enforceable policy content. This two-step design means an attacker who can only forge DNS cannot silently loosen the domain’s TLS requirement.',
      'Ciphera Relay publishes MTA-STS alongside DKIM, SPF, and DMARC, so mail to a Relay-protected domain is both authenticated and required to travel encrypted end-to-end between mail servers.',
    ],
    related: ['dkim', 'spf', 'dmarc', 'transactional-email'],
    see: [
      { label: 'RFC 8461 — MTA-STS', href: 'https://www.rfc-editor.org/rfc/rfc8461' },
      { label: 'Ciphera Relay', href: '/products/relay' },
    ],
  },
  {
    slug: 'open-tracking',
    term: 'Email open tracking',
    category: 'Email & infrastructure',
    short:
      'Email open tracking records when a recipient views a message, typically via an embedded tracking pixel that silently reports back to the sender the moment the email client loads remote images.',
    paragraphs: [
      'The mechanism is a tracking pixel: a tiny invisible image with a per-recipient URL, inserted into the message body. When the recipient’s email client renders the message and fetches remote images, that request tells the sender the exact time the message was opened, along with the recipient’s approximate location and client software — all without the recipient clicking anything or being asked.',
      'Open tracking is unreliable by nature — many clients block remote images by default, which undercounts opens — but it is also a persistent surveillance mechanism layered onto what recipients generally expect to be a private exchange. For transactional email specifically (password resets, receipts, verification codes), there is no legitimate product need to know whether or when the recipient opened it; the message either reaches the inbox or it doesn’t.',
      'Ciphera Relay includes no tracking pixels and no open or click monitoring of any kind — a message sent through Relay is not instrumented, by design, not just by default configuration.',
    ],
    related: ['tracking-pixel', 'transactional-email', 'bot-detection'],
    see: [{ label: 'Ciphera Relay', href: '/products/relay' }],
  },
  {
    slug: 'proof-of-work',
    term: 'Proof-of-work challenge',
    category: 'Email & infrastructure',
    short:
      'A proof-of-work challenge requires a client to perform a small, verifiable computation before a request is accepted — cheap for one user, expensive enough at scale to make bulk automated abuse uneconomical.',
    paragraphs: [
      'The term is most widely known from cryptocurrency mining, where proof-of-work secures a blockchain by making block creation computationally costly — that context is unrelated here. In bot protection, the same core idea is repurposed defensively: the server issues a cryptographic puzzle (commonly, find an input that hashes below some target), the client’s browser solves it, and the server verifies the answer in near-zero time. One human clicking a login form barely notices the delay; a bot farm submitting thousands of requests per second has to pay that computational cost thousands of times over.',
      'Proof-of-work’s advantage over behavioral or fingerprint-based bot detection is that it requires no tracking data at all — no cookies, no device profile, no history of the visitor. It only requires the current request to prove it did the work, which makes it verifiable statelessly: no database of past behavior is needed to check the answer, only the cryptographic proof attached to this one request.',
      'Ciphera Captcha runs proof-of-work invisibly in a background Web Worker, with difficulty that adapts per-IP to request volume, so legitimate visitors see nothing while bulk automated traffic hits a rising computational cost.',
    ],
    related: ['bot-detection', 'honeypot', 'fingerprinting'],
    see: [{ label: 'Ciphera Captcha', href: '/products/captcha' }],
  },
  {
    slug: 'bot-detection',
    term: 'Bot detection',
    category: 'Email & infrastructure',
    short:
      'Bot detection distinguishes automated traffic from genuine human visitors before allowing an action — form submission, login, checkout — to prevent spam, credential stuffing, and scraping at scale.',
    paragraphs: [
      'Detection approaches sit on a spectrum by how much data they need about the visitor. On one end, behavioral and device-fingerprinting systems build a profile from mouse movement, keystroke timing, browser and hardware attributes, and cross-site history — effective, but privacy-invasive, and legally exposed under GDPR’s data-minimization requirements when deployed without clear necessity. On the other end, proof-of-work and honeypot techniques verify a request is well-behaved without building any profile of who sent it.',
      'The classic tradeoff is friction versus accuracy: a visible image-grid CAPTCHA is highly disruptive to real users and, per published research, increasingly solvable by automated systems anyway — so the friction is paid disproportionately by legitimate visitors while sophisticated bots pass through. Invisible, verification-based approaches (proof-of-work, HMAC-signed stateless tokens, honeypots) aim to impose cost on automated traffic without interrupting humans at all.',
      'Ciphera Captcha combines invisible adaptive proof-of-work with stateless HMAC-signed tokens and no third-party telemetry — verification happens without building a behavioral profile of the visitor or sharing data with an outside vendor.',
    ],
    related: ['proof-of-work', 'honeypot', 'fingerprinting'],
    see: [{ label: 'Ciphera Captcha', href: '/products/captcha' }],
  },
  {
    slug: 'honeypot',
    term: 'Honeypot',
    category: 'Email & infrastructure',
    short:
      'A honeypot, in bot detection, is a form field hidden from human view but present in the page’s HTML — automated submitters that fill in every field reveal themselves, while real visitors never see it to fill in.',
    paragraphs: [
      'The technique relies on a simple gap between how humans and simple bots interact with a form: a field hidden via CSS (rather than a hidden input type, which unsophisticated scrapers skip) is invisible to a person using a browser normally, but a bot parsing raw HTML and filling every input it finds will populate it anyway. A submission arriving with that field non-empty is discarded or flagged as automated.',
      'Honeypots are cheap to implement and impose zero friction on legitimate users — there is nothing for a human to solve or wait on — but they only catch unsophisticated bots that do not render or evaluate CSS. More capable automated traffic, using a real headless browser, will see the field is hidden and skip it, same as a human would. For that reason honeypots function best as one low-cost layer in a stack, not a standalone defense.',
      'Ciphera Captcha layers honeypot fields alongside proof-of-work and stateless token verification, catching unsophisticated bots for free while the harder cases are handled by the adaptive computational challenge.',
    ],
    related: ['bot-detection', 'proof-of-work'],
    see: [{ label: 'Ciphera Captcha', href: '/products/captcha' }],
  },
]
