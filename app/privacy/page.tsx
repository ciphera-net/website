import { Metadata } from 'next'
import Link from 'next/link'
import { cdnUrl } from '@/lib/cdn'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Ciphera privacy policy: zero-knowledge encryption, minimal data collection, Swiss infrastructure, GDPR compliance, and your rights. Last updated 21-06-2026.',
  alternates: {
    canonical: 'https://ciphera.net/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Ciphera',
    description: 'Ciphera privacy policy: zero-knowledge encryption, minimal data collection, Swiss infrastructure, and GDPR compliance.',
    url: 'https://ciphera.net/privacy',
    siteName: 'Ciphera',
    images: [{ url: cdnUrl('/ciphera_logo_no_margins.png'), width: 1200, height: 630, alt: 'Ciphera Privacy Policy' }],
    locale: 'en_US',
    type: 'website',
  },
}

const privacySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy',
  description: 'Ciphera privacy policy: zero-knowledge encryption, minimal data collection, Swiss infrastructure, and GDPR compliance.',
  url: 'https://ciphera.net/privacy',
  dateModified: '2026-06-21',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Privacy Policy' },
    ],
  },
}

const SECTIONS = [
  { id: 'our-commitment-to-privacy', title: '1. Our Commitment to Privacy' },
  { id: 'legal-framework', title: '2. Legal Framework' },
  { id: 'data-controller', title: '3. Data Controller' },
  { id: 'data-we-collect', title: '4. Data We Collect' },
  { id: 'data-we-do-not-collect', title: '5. Data We Do Not Collect' },
  { id: 'ip-address-policy', title: '6. IP Address Policy' },
  { id: 'cookies-and-local-storage', title: '7. Cookies & Local Storage' },
  { id: 'encryption-and-security-measures', title: '8. Encryption & Security Measures' },
  { id: 'data-storage-and-retention', title: '9. Data Storage & Retention' },
  { id: 'legal-bases-for-processing', title: '10. Legal Bases for Processing' },
  { id: 'third-party-services-and-data-processors', title: '11. Third-Party Services & Data Processors' },
  { id: 'international-data-transfers', title: '12. International Data Transfers' },
  { id: 'open-source-and-transparency', title: '13. Open Source & Transparency' },
  { id: 'data-disclosure-and-law-enforcement', title: '14. Data Disclosure & Law Enforcement' },
  { id: 'childrens-privacy', title: "15. Children's Privacy" },
  { id: 'automated-decision-making', title: '16. Automated Decision-Making' },
  { id: 'data-breach-notification', title: '17. Data Breach Notification' },
  { id: 'your-rights-under-gdpr-and-fadp', title: '18. Your Rights Under GDPR & FADP' },
  { id: 'social-media-and-external-links', title: '19. Social Media & External Links' },
  { id: 'changes-to-this-policy', title: '20. Changes to This Policy' },
  { id: 'contact-us', title: '21. Contact Us' },
] as const

function ContentsList() {
  return (
    <ol className="mt-4 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
      {SECTIONS.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="block py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />

      <section className="pt-32 pb-24 sm:pb-32">
        <div>
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-12">
              Last updated: 21-06-2026
            </p>

            <nav aria-label="Contents" className="mb-12 hidden md:block border border-border bg-card p-6">
              <p className="font-mono text-xs text-muted-foreground">Contents</p>
              <ContentsList />
            </nav>

            <nav aria-label="Contents" className="mb-12 md:hidden">
              <details className="group border border-border bg-card p-6">
                <summary className="cursor-pointer list-none font-mono text-xs text-muted-foreground">Contents</summary>
                <ContentsList />
              </details>
            </nav>

            <div className="prose prose-invert max-w-none space-y-10">

              {/* 1. Our Commitment to Privacy */}
              <section>
                <h2 id="our-commitment-to-privacy" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  1. Our Commitment to Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ciphera is built on the principle that privacy is a fundamental right, not a feature. Your account is protected by zero-knowledge encryption: your password and account vault are encrypted on your device under keys we never hold, so we cannot read that data even if compelled to. For services where zero-knowledge encryption does not apply — such as our privacy-first analytics, support, and billing — we minimize what we collect by design. We collect the absolute minimum data necessary to operate our services, we never sell or share your data with advertisers, and we give you full control over your information.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  This policy explains in detail what data we collect, why we collect it, how we protect it, and what rights you have. It should be read alongside our{' '}
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>,
                  which governs your use of our services. We encourage you to read both in full.
                </p>
              </section>

              {/* 2. Legal Framework */}
              <section>
                <h2 id="legal-framework" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  2. Legal Framework
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ciphera is operated by Ciphera B.V., a company incorporated under Belgian law (KBO/BCE: 1013.721.660), with registered offices at De Kleetlaan 2, 1831 Diegem, Belgium. Our operations are governed by:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li><strong>Belgian law</strong> — as our entity is incorporated in Belgium</li>
                  <li><strong>EU General Data Protection Regulation (GDPR)</strong> — Regulation (EU) 2016/679, as we process data of individuals in the European Economic Area</li>
                  <li><strong>Swiss Federal Act on Data Protection (FADP)</strong> — as our data infrastructure is located in Switzerland</li>
                  <li><strong>ePrivacy Directive</strong> — Directive 2002/58/EC, as applicable to our electronic communications</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Where these frameworks differ, we apply the standard that provides the strongest protection for your data. Belgian courts in Brussels hold exclusive jurisdiction for any disputes arising from this policy.
                </p>
              </section>

              {/* 3. Data Controller */}
              <section>
                <h2 id="data-controller" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  3. Data Controller
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The data controller for all Ciphera services is:
                </p>
                <div className="border border-border bg-card p-6 mt-3">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Ciphera B.V.</strong><br />
                    KBO/BCE: 1013.721.660<br />
                    De Kleetlaan 2<br />
                    1831 Diegem, Belgium<br />
                    Email: <a href="mailto:privacy@ciphera.net" className="text-primary hover:underline">privacy@ciphera.net</a><br />
                    Phone: <a href="tel:+3278480710" className="text-primary hover:underline">+32 78 48 07 10</a>
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  For privacy-specific inquiries, contact us at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-primary hover:underline">privacy@ciphera.net</a>.
                  For security concerns, contact{' '}
                  <a href="mailto:security@ciphera.net" className="text-primary hover:underline">security@ciphera.net</a>.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Given the nature and scale of our current operations, a Data Protection Officer (DPO) has not been appointed under GDPR Article 37. All privacy inquiries are handled directly by our team at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-primary hover:underline">privacy@ciphera.net</a>.
                </p>
              </section>

              {/* 4. Data We Collect */}
              <section>
                <h2 id="data-we-collect" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  4. Data We Collect
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We apply data minimization as a core design principle. Below is an exhaustive breakdown of every category of data we collect, organized by service.
                </p>

                {/* 4.1 Website */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  4.1. Website (ciphera.net)
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  When you visit our website, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Analytics data</strong> — Page views, referrer sources, UTM parameters, device type, browser, operating system, and country-level geographic data. Collected via our own Pulse analytics platform, which uses no cookies, no fingerprinting, and no personal identifiers. Data is aggregated and cannot be traced to individual visitors.</li>
                  <li><strong>Contact form submissions</strong> — Name, email address, subject, and message content, submitted voluntarily through our contact page.</li>
                  <li><strong>Newsletter subscriptions</strong> — Email address only, submitted voluntarily with explicit consent.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Legal basis:</strong> Legitimate interest (analytics), consent (contact form, newsletter).
                </p>

                {/* 4.2 Ciphera ID */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-8">
                  4.2. Ciphera ID (Identity Provider)
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  When you create a Ciphera account, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Email address</strong> — Used for account identification, verification, and security notifications. Your email is never stored on our servers in readable form: it is kept only inside your client-encrypted account vault, which we cannot decrypt. To sign you in, we match your account using a blind index — an irreversible keyed hash derived from your email on your device and hashed again on our servers — so we can find your account without ever holding your address.</li>
                  <li><strong>Display name</strong> — Chosen by you, used for display and identification purposes. Like your email, it is stored only inside your client-encrypted account vault and never held on our servers in readable form.</li>
                  <li><strong>Password</strong> — Your password never leaves your device. We use OPAQUE (RFC 9807), a password-authenticated key exchange: your password is strengthened on your device using Argon2id and proven to our servers without ever being sent. We store only an opaque credential record that cannot be reversed into your password — no password, no password hash, and no password-equivalent verifier. We cannot see, recover, or reset your password.</li>
                  <li><strong>Session metadata</strong> — Login timestamps, device type, and browser information for active session management.</li>
                  <li><strong>Account verification data</strong> — CAPTCHA responses during registration, processed by our privacy-first Ciphera Captcha service (not Google reCAPTCHA or any third-party provider).</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Legal basis:</strong> Contract performance (account management), legitimate interest (security).
                </p>

                {/* 4.4 Pulse */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-8">
                  4.3. Ciphera Pulse (Privacy-First Analytics)
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Pulse is our self-hosted analytics platform, designed as a privacy-first alternative to Google Analytics. For websites using Pulse, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Page views</strong> — Aggregated page view counts per URL, not tied to individual visitors.</li>
                  <li><strong>Unique visitor estimates</strong> — Calculated using a privacy-safe hashing method that rotates daily. No persistent identifiers are stored.</li>
                  <li><strong>Referrer sources</strong> — The website or search engine that directed visitors to the site.</li>
                  <li><strong>UTM parameters</strong> — Campaign tracking parameters from URLs (utm_source, utm_medium, etc.).</li>
                  <li><strong>Technical metadata</strong> — Device type (mobile, desktop, tablet), browser name, and operating system. Derived from the User-Agent string, which is not stored.</li>
                  <li><strong>Country-level location</strong> — Determined from the IP address, which is then immediately discarded. We do not store IP addresses.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  Pulse does not use cookies, does not use browser fingerprinting, does not track users across websites, and does not collect personally identifiable information by default. Custom event properties are defined by the website owner, who is responsible for ensuring they do not contain personal data. Pulse is designed to operate without cookies or persistent identifiers, so it does not set a cookie consent banner.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  When website owners use Pulse on their websites, Ciphera B.V. acts as a data processor under GDPR Article 28. A Data Processing Agreement (DPA) is available upon request at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-primary hover:underline">privacy@ciphera.net</a>.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Legal basis:</strong> Legitimate interest (anonymous website analytics).
                </p>

                {/* 4.5 Captcha */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-8">
                  4.4. Ciphera Captcha (Bot Protection)
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Our CAPTCHA service protects Ciphera services from automated abuse. We collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Challenge responses</strong> — Your interaction with the CAPTCHA challenge, used solely to verify you are human.</li>
                  <li><strong>Verification tokens</strong> — Short-lived tokens that confirm successful CAPTCHA completion, automatically expired after use.</li>
                  <li><strong>Behavioral insights</strong> — Mouse movement patterns, keystroke timing, scroll behavior, and touch input, collected solely to distinguish automated traffic from human visitors. This data is processed in-memory only, is never written to persistent storage, is automatically discarded within <span className="tabular-nums text-foreground">15 minutes</span>, and is not linked to user accounts.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  Unlike third-party CAPTCHA services, Ciphera Captcha does not track users across pages or websites, does not set persistent cookies, and does not share data with advertising networks.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Legal basis:</strong> Legitimate interest (abuse prevention, service security).
                </p>

                {/* 4.6 Relay */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 mt-8">
                  4.5. Ciphera Relay (Email Infrastructure)
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Relay handles transactional emails (account verification, security notifications, password resets) for Ciphera services. We collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Recipient email addresses</strong> — Required to deliver transactional emails.</li>
                  <li><strong>Delivery metadata</strong> — Delivery status, bounce information, and timestamps for operational monitoring.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  Relay does not send marketing emails, does not track email opens via tracking pixels, and does not share recipient data with third parties. Email content is transmitted over encrypted connections (TLS).
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Legal basis:</strong> Contract performance (transactional communications).
                </p>
              </section>

              {/* 5. Data We Do Not Collect */}
              <section>
                <h2 id="data-we-do-not-collect" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  5. Data We Do Not Collect
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We believe it is equally important to state what we do not do:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>We do <strong>not</strong> use tracking cookies of any kind</li>
                  <li>We do <strong>not</strong> use browser fingerprinting or cross-site device tracking</li>
                  <li>We do <strong>not</strong> engage in cross-site tracking or retargeting</li>
                  <li>We do <strong>not</strong> sell, trade, rent, or share your personal data with third parties for advertising or marketing purposes</li>
                  <li>We do <strong>not</strong> use third-party analytics services (Google Analytics, Meta Pixel, etc.)</li>
                  <li>We do <strong>not</strong> serve advertisements of any kind</li>
                  <li>We do <strong>not</strong> build user profiles or behavioral profiles</li>
                  <li>We do <strong>not</strong> use tracking pixels in emails</li>
                  <li>We do <strong>not</strong> collect location data beyond country-level (and that is derived, not stored)</li>
                  <li>We do <strong>not</strong> use any social media tracking widgets or embedded content that tracks visitors</li>
                </ul>
              </section>

              {/* 6. IP Address Policy */}
              <section>
                <h2 id="ip-address-policy" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  6. IP Address Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  IP addresses are inherently part of internet communications and are temporarily processed by our servers during request handling. Our policy regarding IP addresses is:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li><strong>No IP address storage</strong> — We do not store raw IP addresses in any database. All IP addresses are cryptographically hashed using HMAC-SHA256 before any persistence: for events tied to a signed-in account the hash is salted with a user-specific value, and for pre-authentication events (such as failed logins) it uses a server-side key. The original IP address is irreversibly discarded and cannot be recovered — not by us, not by anyone.</li>
                  <li><strong>Temporary processing</strong> — IP addresses may be temporarily held in server memory during active connections for rate limiting and abuse prevention. They are not written to persistent storage in their original form.</li>
                  <li><strong>Pulse analytics</strong> — IP addresses are used solely to derive country-level location data, then immediately discarded. The IP address itself is never stored.</li>
                  <li><strong>Security audit logs</strong> — Security events (logins, password changes, 2FA changes) are logged with a cryptographic hash of the IP address, not the IP itself. This allows detection of patterns (e.g., same device logging in repeatedly) without storing personally identifiable information. Audit logs are retained for up to <span className="tabular-nums text-foreground">180 days</span>, then permanently deleted.</li>
                  <li><strong>Server logs</strong> — Operational server logs that may contain IP addresses are access-controlled and retained only as long as necessary for security and operational purposes.</li>
                </ul>
              </section>

              {/* 7. Cookies */}
              <section>
                <h2 id="cookies-and-local-storage" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  7. Cookies &amp; Local Storage
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  The Ciphera marketing site (ciphera.net) sets no cookies or browser storage of its own. Our authenticated applications — Ciphera ID (id.ciphera.net) and Ciphera Pulse — use the minimum browser storage needed to keep you signed in, remember your interface preferences, and run features you ask for:
                </p>
                <p className="font-mono text-[10px] text-muted-foreground md:hidden" aria-hidden="true">scroll &rarr;</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-muted-foreground mt-2">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Name</th>
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Type</th>
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Purpose</th>
                        <th className="text-left py-2 font-semibold text-foreground">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={4} className="py-2 pt-4 font-semibold text-foreground">Authentication</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4 font-mono text-xs">access_token</td>
                        <td className="py-2 pr-4">HTTP-only cookie</td>
                        <td className="py-2 pr-4">Keeps you signed in</td>
                        <td className="py-2 tabular-nums text-foreground">15 minutes</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4 font-mono text-xs">refresh_token</td>
                        <td className="py-2 pr-4">HTTP-only cookie</td>
                        <td className="py-2 pr-4">Renews your session without re-entering your password</td>
                        <td className="py-2 tabular-nums text-foreground">30 days</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4 font-mono text-xs">csrf_token</td>
                        <td className="py-2 pr-4">Cookie (app-readable)</td>
                        <td className="py-2 pr-4">Protects against cross-site request forgery</td>
                        <td className="py-2 tabular-nums text-foreground">30 days</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4 font-mono text-xs">ciphera_pii</td>
                        <td className="py-2 pr-4">Cookie (across ciphera.net)</td>
                        <td className="py-2 pr-4">Carries your decrypted name and email between Ciphera apps after login, so they display without our servers storing them</td>
                        <td className="py-2">Cleared on logout</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="py-2 pt-4 font-semibold text-foreground">Your profile</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4 font-mono text-xs">user</td>
                        <td className="py-2 pr-4">Local / session storage</td>
                        <td className="py-2 pr-4">Holds your decrypted name and email so the app can display them (your account on our servers holds neither)</td>
                        <td className="py-2">Until logout / tab close</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="py-2 pt-4 font-semibold text-foreground">Interface &amp; login</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">Sidebar, dashboard &amp; dismissed-prompt settings</td>
                        <td className="py-2 pr-4">Local storage</td>
                        <td className="py-2 pr-4">Remember your layout and which prompts you have dismissed</td>
                        <td className="py-2">Persistent</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4 font-mono text-xs">oauth_state, oauth_code_verifier</td>
                        <td className="py-2 pr-4">Local storage</td>
                        <td className="py-2 pr-4">Secure the login redirect (PKCE)</td>
                        <td className="py-2">Cleared after login</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="py-2 pt-4 font-semibold text-foreground">Analytics (on websites that use Pulse)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4 font-mono text-xs">pulse_ignore</td>
                        <td className="py-2 pr-4">Local storage</td>
                        <td className="py-2 pr-4">Lets a site owner exclude their own visits</td>
                        <td className="py-2">Until turned off</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4 font-mono text-xs">ciphera_last_pv</td>
                        <td className="py-2 pr-4">Session storage</td>
                        <td className="py-2 pr-4">Prevents counting a page refresh twice</td>
                        <td className="py-2">Tab session</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="py-2 pt-4 font-semibold text-foreground">Support chat</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4 font-mono text-xs">cw_*</td>
                        <td className="py-2 pr-4">Local storage</td>
                        <td className="py-2 pr-4">Keeps your support-chat session and recent messages while you use our help widget</td>
                        <td className="py-2">Persistent</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We do not use advertising cookies or cross-site tracking cookies, and we do not share your data with advertisers. Because we use only storage that is strictly necessary to provide the services you request, no cookie consent banner is required under Article 5(3) of the ePrivacy Directive.
                </p>
              </section>

              {/* 8. Encryption & Security */}
              <section>
                <h2 id="encryption-and-security-measures" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  8. Encryption &amp; Security Measures
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Security is foundational to everything we build. Our technical measures include:
                </p>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Client-Side Encryption
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Algorithm:</strong> AES-256-GCM (authenticated encryption)</li>
                  <li><strong>Key generation:</strong> Encryption keys are generated in your browser using the Web Crypto API and are never transmitted to our servers</li>
                  <li><strong>Zero-knowledge architecture:</strong> Our servers store only encrypted data. We have no technical capability to decrypt, read, or access the content of your files</li>
                </ul>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-4">
                  Password Security
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Zero-knowledge authentication (OPAQUE):</strong> We use the OPAQUE protocol (RFC 9807), an asymmetric password-authenticated key exchange. Your password is stretched on your device with Argon2id and is never transmitted to our servers. Signing in proves knowledge of your password cryptographically, without sending it.</li>
                  <li><strong>What we store:</strong> Only an OPAQUE credential record that cannot be reversed into your password. We hold no password, no password hash, and no password-equivalent verifier.</li>
                  <li><strong>No password reset:</strong> Because we never hold your password, we cannot reset it. Account recovery requires the 24-word recovery phrase shown to you when you created your account. If you lose both your password and your recovery phrase, your account data cannot be recovered — by us or anyone else.</li>
                </ul>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-4">
                  Account Data Encryption
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Stored in your vault, not on our servers:</strong> Your email address and display name are never stored on our servers in readable form. They live only inside your account vault, which is encrypted on your device under a key we never hold. Two-factor authentication secrets, which our servers need in order to verify your codes, are encrypted at rest using AES-256-GCM.</li>
                  <li><strong>Blind-index lookups:</strong> To find your account at sign-in, we use a blind index — an irreversible keyed hash of your email, computed on your device and hashed again on our servers. Your email is never stored in readable form.</li>
                  <li><strong>What a database breach would expose:</strong> Only encrypted vaults, keyed hashes, and your OPAQUE credential record — no plaintext email or display name, no password, and nothing that can be reversed into them.</li>
                </ul>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-4">
                  Transport Security
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>TLS encryption:</strong> All connections to our services are encrypted in transit using TLS</li>
                  <li><strong>HSTS:</strong> HTTP Strict Transport Security is enforced with a minimum 1-year max-age</li>
                  <li><strong>Security headers:</strong> X-Content-Type-Options, X-Frame-Options (DENY), Referrer-Policy (strict-origin-when-cross-origin), and Content Security Policy are enforced on all pages</li>
                </ul>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-4">
                  Infrastructure Security
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Backups are encrypted at rest using AES-256 server-side encryption together with client-side encryption; your account data and files are protected by client-side encryption, so they remain unreadable to us regardless of the underlying storage</li>
                  <li>Access to production systems requires multi-factor authentication</li>
                  <li>We follow the principle of least privilege for all internal access</li>
                  <li>Regular security reviews and dependency audits are performed</li>
                </ul>
              </section>

              {/* 9. Data Storage & Retention */}
              <section>
                <h2 id="data-storage-and-retention" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  9. Data Storage &amp; Retention
                </h2>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Storage Location
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  All primary data is stored on servers located in <strong>Switzerland</strong>, subject to the Swiss Federal Act on Data Protection (FADP). Switzerland has been recognized by the European Commission as providing an adequate level of data protection (adequacy decision under GDPR Article 45).
                </p>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-4">
                  Retention Periods
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  We retain data only as long as necessary for the purpose it was collected:
                </p>
                <p className="font-mono text-[10px] text-muted-foreground md:hidden" aria-hidden="true">scroll &rarr;</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-muted-foreground mt-2">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Data Type</th>
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Retention Period</th>
                        <th className="text-left py-2 font-semibold text-foreground">Basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">Account data</td>
                        <td className="py-2 pr-4">While the account is active; deleted immediately and irreversibly on a verified deletion request</td>
                        <td className="py-2">Contract</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">Session data</td>
                        <td className="py-2 pr-4">Until logout or <span className="tabular-nums text-foreground">30 days</span> (refresh token expiry)</td>
                        <td className="py-2">Contract</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">Analytics data (Pulse)</td>
                        <td className="py-2 pr-4">Aggregated indefinitely (no personal data)</td>
                        <td className="py-2">Legitimate interest</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">Contact form messages</td>
                        <td className="py-2 pr-4">Not stored — forwarded to our team inbox</td>
                        <td className="py-2">Consent</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">Newsletter subscriptions</td>
                        <td className="py-2 pr-4">Until unsubscribe</td>
                        <td className="py-2">Consent</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">Security audit logs (hashed IPs only)</td>
                        <td className="py-2 pr-4">Up to <span className="tabular-nums text-foreground">180 days</span>, then permanently deleted</td>
                        <td className="py-2">Legitimate interest</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">Server logs</td>
                        <td className="py-2 pr-4">Retained only as long as necessary for security and operational purposes</td>
                        <td className="py-2">Legitimate interest</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4">CAPTCHA verification tokens</td>
                        <td className="py-2 pr-4">Expired immediately after use</td>
                        <td className="py-2">Legitimate interest</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Email delivery metadata (Relay)</td>
                        <td className="py-2 pr-4 tabular-nums text-foreground">30 days</td>
                        <td className="py-2">Contract</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 10. Legal Bases for Processing */}
              <section>
                <h2 id="legal-bases-for-processing" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  10. Legal Bases for Processing
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Under GDPR Article 6, we process personal data on the following legal bases:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                  <li>
                    <strong>Contract performance (Article 6(1)(b)):</strong> Processing necessary to provide the services you requested — account management, session management, and transactional emails.
                  </li>
                  <li>
                    <strong>Legitimate interest (Article 6(1)(f)):</strong> Processing necessary for our legitimate interests, where those interests are not overridden by your rights — anonymous website analytics, abuse prevention, rate limiting, and service security. We conduct balancing tests for each legitimate interest processing activity.
                  </li>
                  <li>
                    <strong>Consent (Article 6(1)(a)):</strong> Processing based on your freely given, specific, informed consent — newsletter subscriptions, contact form submissions, and optional communications. You may withdraw consent at any time.
                  </li>
                  <li>
                    <strong>Legal obligation (Article 6(1)(c)):</strong> Processing necessary to comply with legal requirements — responding to valid law enforcement requests (see Section 14).
                  </li>
                </ul>
              </section>

              {/* 11. Third-Party Processors */}
              <section>
                <h2 id="third-party-services-and-data-processors" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  11. Third-Party Services &amp; Data Processors
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We minimize our reliance on third-party services. The services we use, and the data they may process, are listed below:
                </p>
                <p className="font-mono text-[10px] text-muted-foreground md:hidden" aria-hidden="true">scroll &rarr;</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-muted-foreground mt-2">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Service</th>
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Purpose</th>
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Data Processed</th>
                        <th className="text-left py-2 font-semibold text-foreground">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4 font-medium">Exoscale</td>
                        <td className="py-2 pr-4">Compute and object storage</td>
                        <td className="py-2 pr-4">Encrypted data at rest</td>
                        <td className="py-2">Switzerland</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4 font-medium">Bunny</td>
                        <td className="py-2 pr-4">CDN, DNS, DDoS protection, edge routing</td>
                        <td className="py-2 pr-4">IP addresses (transient)</td>
                        <td className="py-2">Global (edge network)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 pr-4 font-medium">GitHub</td>
                        <td className="py-2 pr-4">Source code hosting</td>
                        <td className="py-2 pr-4">Source code</td>
                        <td className="py-2">United States</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Mollie</td>
                        <td className="py-2 pr-4">Payment processing</td>
                        <td className="py-2 pr-4">Billing and subscription data</td>
                        <td className="py-2">Netherlands</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  All third-party processors are bound by Data Processing Agreements (DPAs) and are contractually required to process data only for the specified purpose. A complete list of sub-processor identities, including specific company names and registered addresses, is available upon request at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-primary hover:underline">privacy@ciphera.net</a>. We do not use:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                  <li>Google Analytics, Google Tag Manager, or any Google tracking service</li>
                  <li>Meta Pixel, Facebook SDK, or any Meta tracking service</li>
                  <li>Third-party CAPTCHA services (we use our own Ciphera Captcha)</li>
                  <li>Third-party email tracking services</li>
                  <li>Advertising networks of any kind</li>
                  <li>Customer data platforms (CDPs) or data brokers</li>
                </ul>
              </section>

              {/* 12. International Data Transfers */}
              <section>
                <h2 id="international-data-transfers" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  12. International Data Transfers
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your data is primarily stored in Switzerland, which benefits from an EU adequacy decision. In limited cases, data may be processed in other jurisdictions:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li><strong>CDN/DNS services</strong> — Your requests may be routed through global edge servers for performance and DDoS protection. Only transient connection data (IP addresses) passes through these servers.</li>
                  <li><strong>GitHub</strong> — Public source code hosted in the United States. No personal user data is stored on GitHub.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Where personal data is transferred outside the EEA or Switzerland, we ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) as approved by the European Commission under GDPR Article 46(2)(c), or transfers to countries with an adequacy decision under GDPR Article 45.
                </p>
              </section>

              {/* 13. Open Source & Transparency */}
              <section>
                <h2 id="open-source-and-transparency" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  13. Open Source &amp; Transparency
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We believe transparency is essential to trust. The following are open source, allowing independent verification of our privacy claims:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li><strong>Pulse</strong> — Our privacy-first analytics platform is open source (AGPL-3.0), enabling independent audit of our analytics approach.</li>
                  <li><strong>This website</strong> — The source code for this website is publicly available.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Our open-source repositories are available at{' '}
                  <a href="https://github.com/ciphera-net" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">github.com/ciphera-net</a>.
                </p>
              </section>

              {/* 14. Data Disclosure & Law Enforcement */}
              <section>
                <h2 id="data-disclosure-and-law-enforcement" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  14. Data Disclosure &amp; Law Enforcement
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We will only disclose user data if legally compelled to do so by a valid and binding request from competent Belgian or Swiss authorities, in full compliance with applicable law.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Our disclosure policy:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Challenge first:</strong> We will challenge any request that we believe is overbroad, legally insufficient, or not in the public interest.</li>
                  <li><strong>Minimum disclosure:</strong> If legally required to comply, we will disclose only the minimum data necessary to satisfy the specific request.</li>
                  <li><strong>Encrypted data limitation:</strong> Due to our zero-knowledge architecture, we cannot decrypt or provide access to the contents of encrypted files, even under legal compulsion. We can only provide metadata and encrypted data.</li>
                  <li><strong>User notification:</strong> Where legally permitted, we will notify affected users of data requests.</li>
                  <li><strong>No voluntary disclosure:</strong> We do not voluntarily share user data with any government, intelligence agency, or law enforcement body.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  We do not comply with requests from foreign authorities unless they are processed through appropriate international legal assistance channels recognized by Belgian or Swiss law.
                </p>
              </section>

              {/* 15. Children's Privacy */}
              <section>
                <h2 id="childrens-privacy" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  15. Children&apos;s Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not directed at children under the age of 16. We do not knowingly collect personal data from children under 16. If you are a parent or guardian and believe your child has provided us with personal data, please contact us at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-primary hover:underline">privacy@ciphera.net</a>{' '}
                  and we will promptly delete the data.
                </p>
              </section>

              {/* 16. Automated Decision-Making */}
              <section>
                <h2 id="automated-decision-making" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  16. Automated Decision-Making
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not engage in automated decision-making or profiling that produces legal effects or similarly significantly affects you, as defined under GDPR Article 22. Our automated systems are limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li><strong>Rate limiting</strong> — Automated throttling of excessive requests to protect service availability.</li>
                  <li><strong>CAPTCHA challenges</strong> — Automated bot detection during registration and certain interactions.</li>
                  <li><strong>File expiration</strong> — Automated deletion of files after user-configured expiration periods.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  None of these automated processes result in decisions that produce legal effects or significantly affect any individual.
                </p>
              </section>

              {/* 17. Data Breach Notification */}
              <section>
                <h2 id="data-breach-notification" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  17. Data Breach Notification
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  In the event of a personal data breach, we will:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li>Notify the Belgian Data Protection Authority (Autorité de protection des données / Gegevensbeschermingsautoriteit) within <span className="tabular-nums text-foreground">72 hours</span> of becoming aware of the breach, as required by GDPR Article 33.</li>
                  <li>Notify affected users without undue delay if the breach is likely to result in a high risk to their rights and freedoms, as required by GDPR Article 34.</li>
                  <li>Document the breach, its effects, and the remedial actions taken.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Due to our zero-knowledge architecture, a breach of our servers would not expose the content of encrypted files, as we do not possess the decryption keys.
                </p>
              </section>

              {/* 18. Your Rights */}
              <section>
                <h2 id="your-rights-under-gdpr-and-fadp" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  18. Your Rights Under GDPR &amp; FADP
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Under the EU General Data Protection Regulation and the Swiss Federal Act on Data Protection, you have the following rights regarding your personal data:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                  <li>
                    <strong>Right of Access (Article 15):</strong> You have the right to obtain confirmation of whether we process your personal data, and to receive a copy of that data in a commonly used, machine-readable format.
                  </li>
                  <li>
                    <strong>Right to Rectification (Article 16):</strong> You have the right to request correction of inaccurate personal data and completion of incomplete data.
                  </li>
                  <li>
                    <strong>Right to Erasure (Article 17):</strong> You have the right to request deletion of your personal data. Account data is deleted immediately and irreversibly upon a verified request; because our authentication is zero-knowledge, deletion cannot be undone and your encrypted account data cannot be recovered afterwards.
                  </li>
                  <li>
                    <strong>Right to Restriction of Processing (Article 18):</strong> You have the right to request restriction of processing in certain circumstances, such as when you contest the accuracy of data.
                  </li>
                  <li>
                    <strong>Right to Data Portability (Article 20):</strong> You have the right to receive your personal data in a structured, commonly used, machine-readable format and to transmit it to another controller.
                  </li>
                  <li>
                    <strong>Right to Object (Article 21):</strong> You have the right to object to processing based on legitimate interest. We will cease processing unless we demonstrate compelling legitimate grounds that override your interests.
                  </li>
                  <li>
                    <strong>Right to Withdraw Consent (Article 7(3)):</strong> Where processing is based on consent, you may withdraw that consent at any time. Withdrawal does not affect the lawfulness of processing conducted before withdrawal.
                  </li>
                  <li>
                    <strong>Right to Lodge a Complaint:</strong> You have the right to lodge a complaint with a supervisory authority. The relevant authority for Ciphera is the Belgian Data Protection Authority (Autorité de protection des données / Gegevensbeschermingsautoriteit), Rue de la Presse 35, 1000 Brussels, Belgium —{' '}
                    <a href="https://www.dataprotectionauthority.be" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.dataprotectionauthority.be</a>.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise any of these rights, contact us at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-primary hover:underline">privacy@ciphera.net</a>.
                  We will respond to verified requests within <span className="tabular-nums text-foreground">30 days</span>, as required by law. We may ask you to verify your identity before processing your request.
                </p>
              </section>

              {/* 19. Social Media & External Links */}
              <section>
                <h2 id="social-media-and-external-links" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  19. Social Media &amp; External Links
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our website and blog may contain links to external websites, including our GitHub repositories and social media profiles. We do not embed social media tracking widgets on our website. When you follow a link to an external site, you leave our services, and the external site&apos;s privacy policy governs your interaction with that site. We are not responsible for the privacy practices of external websites.
                </p>
              </section>

              {/* 20. Changes to This Policy */}
              <section>
                <h2 id="changes-to-this-policy" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  20. Changes to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this privacy policy from time to time to reflect changes in our services, legal requirements, or best practices. When we make changes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li>The &ldquo;Last updated&rdquo; date at the top of this page will be revised.</li>
                  <li>For material changes that affect your rights, we will provide prominent notice (such as a banner on our website or an email notification to account holders).</li>
                  <li>Previous versions of this policy will be archived and available upon request.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  We encourage you to review this policy periodically. Your continued use of our services after changes are posted constitutes acceptance of the updated policy. The English version of this policy prevails in case of any discrepancy with translations.
                </p>
              </section>

              {/* 21. Contact Us */}
              <section>
                <h2 id="contact-us" className="font-display text-2xl font-bold text-foreground mb-4 scroll-mt-24">
                  21. Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  If you have any questions about this privacy policy, our data practices, or wish to exercise your rights, you can reach us through:
                </p>
                <div className="border border-border bg-card p-6">
                  <ul className="list-none space-y-3 text-muted-foreground">
                    <li>
                      <strong className="text-foreground">Privacy inquiries:</strong>{' '}
                      <a href="mailto:privacy@ciphera.net" className="text-primary hover:underline">privacy@ciphera.net</a>
                    </li>
                    <li>
                      <strong className="text-foreground">Security concerns:</strong>{' '}
                      <a href="mailto:security@ciphera.net" className="text-primary hover:underline">security@ciphera.net</a>
                    </li>
                    <li>
                      <strong className="text-foreground">General inquiries:</strong>{' '}
                      <a href="mailto:hello@ciphera.net" className="text-primary hover:underline">hello@ciphera.net</a>
                    </li>
                    <li>
                      <strong className="text-foreground">Phone:</strong>{' '}
                      <a href="tel:+3278480710" className="text-primary hover:underline">+32 78 48 07 10</a>
                    </li>
                    <li>
                      <strong className="text-foreground">Address:</strong>{' '}
                      Ciphera, De Kleetlaan 2, 1831 Diegem, Belgium
                    </li>
                  </ul>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We aim to respond to all inquiries within <span className="tabular-nums text-foreground">5 business days</span>, and to formal data rights requests within <span className="tabular-nums text-foreground">30 days</span>.
                </p>
              </section>

            </div>

            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
              <Link href="/" className="text-primary hover:underline font-medium">
                &larr; Back to Home
              </Link>
              <Link href="/terms" className="text-primary hover:underline font-medium">
                Terms of Service &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
