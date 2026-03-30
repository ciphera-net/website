import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Ciphera privacy policy: zero-knowledge encryption, minimal data collection, Swiss infrastructure, GDPR compliance, and your rights. Last updated March 6, 2026.',
  alternates: {
    canonical: 'https://ciphera.net/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Ciphera',
    description: 'Ciphera privacy policy: zero-knowledge encryption, minimal data collection, Swiss infrastructure, and GDPR compliance.',
    url: 'https://ciphera.net/privacy',
    siteName: 'Ciphera',
    images: [{ url: '/ciphera_logo_no_margins.png', width: 1200, height: 630, alt: 'Ciphera Privacy Policy' }],
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
  dateModified: '2026-03-06',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Privacy Policy' },
    ],
  },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />

      <section className="section-padding pt-32">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-neutral-400 mb-12">
              Last updated: March 6, 2026
            </p>

            <div className="prose prose-invert max-w-none space-y-10">

              {/* 1. Our Commitment to Privacy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. Our Commitment to Privacy
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  Ciphera is built on the principle that privacy is a fundamental right, not a feature. Every product we build uses zero-knowledge architecture: we cannot access your data even if we wanted to. We collect the absolute minimum data necessary to operate our services, we never sell or share your data with advertisers, and we give you full control over your information.
                </p>
                <p className="text-neutral-400 leading-relaxed mt-3">
                  This policy explains in detail what data we collect, why we collect it, how we protect it, and what rights you have. It should be read alongside our{' '}
                  <Link href="/terms" className="text-brand-orange hover:underline">Terms of Service</Link>,
                  which governs your use of our services. We encourage you to read both in full.
                </p>
              </section>

              {/* 2. Legal Framework */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. Legal Framework
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  Ciphera is operated by Ciphera B.V., a company incorporated under Belgian law (KBO/BCE: 1013.721.660), with registered offices at De Kleetlaan 2, 1831 Diegem, Belgium. Our operations are governed by:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-3">
                  <li><strong>Belgian law</strong> — as our entity is incorporated in Belgium</li>
                  <li><strong>EU General Data Protection Regulation (GDPR)</strong> — Regulation (EU) 2016/679, as we process data of individuals in the European Economic Area</li>
                  <li><strong>Swiss Federal Act on Data Protection (FADP)</strong> — as our data infrastructure is located in Switzerland</li>
                  <li><strong>ePrivacy Directive</strong> — Directive 2002/58/EC, as applicable to our electronic communications</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-3">
                  Where these frameworks differ, we apply the standard that provides the strongest protection for your data. Belgian courts in Brussels hold exclusive jurisdiction for any disputes arising from this policy.
                </p>
              </section>

              {/* 3. Data Controller */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. Data Controller
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  The data controller for all Ciphera services is:
                </p>
                <div className="bg-neutral-900 rounded-xl p-6 mt-3">
                  <p className="text-neutral-400">
                    <strong className="text-white">Ciphera B.V.</strong><br />
                    KBO/BCE: 1013.721.660<br />
                    De Kleetlaan 2<br />
                    1831 Diegem, Belgium<br />
                    Email: <a href="mailto:privacy@ciphera.net" className="text-brand-orange hover:underline">privacy@ciphera.net</a><br />
                    Phone: <a href="tel:+32078480710" className="text-brand-orange hover:underline">+32 078 480 710</a>
                  </p>
                </div>
                <p className="text-neutral-400 leading-relaxed mt-3">
                  For privacy-specific inquiries, contact us at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-brand-orange hover:underline">privacy@ciphera.net</a>.
                  For security concerns, contact{' '}
                  <a href="mailto:security@ciphera.net" className="text-brand-orange hover:underline">security@ciphera.net</a>.
                </p>
                <p className="text-neutral-400 leading-relaxed mt-3">
                  Given the nature and scale of our current operations, a Data Protection Officer (DPO) has not been appointed under GDPR Article 37. All privacy inquiries are handled directly by our team at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-brand-orange hover:underline">privacy@ciphera.net</a>.
                </p>
              </section>

              {/* 4. Data We Collect */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. Data We Collect
                </h2>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  We apply data minimization as a core design principle. Below is an exhaustive breakdown of every category of data we collect, organized by service.
                </p>

                {/* 4.1 Website */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  4.1. Website (ciphera.net)
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-2">
                  When you visit our website, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
                  <li><strong>Analytics data</strong> — Page views, referrer sources, UTM parameters, device type, browser, operating system, and country-level geographic data. Collected via our own Pulse analytics platform, which uses no cookies, no fingerprinting, and no personal identifiers. Data is aggregated and cannot be traced to individual visitors.</li>
                  <li><strong>Contact form submissions</strong> — Name, email address, subject, and message content, submitted voluntarily through our contact page.</li>
                  <li><strong>Newsletter subscriptions</strong> — Email address only, submitted voluntarily with explicit consent.</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-2">
                  <strong>Legal basis:</strong> Legitimate interest (analytics), consent (contact form, newsletter).
                </p>

                {/* 4.2 Drop */}
                <h3 className="text-xl font-semibold text-white mb-3 mt-8">
                  4.2. Ciphera Drop (Encrypted File Sharing)
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-2">
                  Drop uses client-side encryption. All files are encrypted in your browser before upload. We collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
                  <li><strong>Encrypted file data</strong> — Stored on our servers in encrypted form. We have no technical ability to decrypt, view, or access the contents of your files.</li>
                  <li><strong>File metadata</strong> — File size, upload timestamp, and expiration settings. File names are encrypted and not visible to us.</li>
                  <li><strong>Download counts</strong> — Number of times a file has been accessed, if download limits are configured by the uploader.</li>
                  <li><strong>Password protection status</strong> — Whether a file is password-protected (the password itself is never stored in plaintext).</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-2">
                  No account is required to use Drop. No personal information is collected from uploaders or recipients unless they choose to create an account.
                </p>
                <p className="text-neutral-400 leading-relaxed mt-2">
                  <strong>Legal basis:</strong> Contract performance (providing the file sharing service).
                </p>

                {/* 4.3 Auth */}
                <h3 className="text-xl font-semibold text-white mb-3 mt-8">
                  4.3. Ciphera Auth (Identity Provider)
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-2">
                  When you create a Ciphera account, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
                  <li><strong>Email address</strong> — Used for account identification, verification, security notifications, and password recovery. Encrypted at rest using AES-256-GCM. Lookups use an irreversible cryptographic hash — your email address is never stored in readable form.</li>
                  <li><strong>Display name</strong> — Chosen by you, used for display and identification purposes. Encrypted at rest using AES-256-GCM.</li>
                  <li><strong>Password</strong> — Double-hashed for maximum security. Your password is first hashed client-side using PBKDF2 (with 600,000 iterations) before transmission, then hashed again server-side using Argon2id. We never receive, transmit, or store your plaintext password.</li>
                  <li><strong>Session metadata</strong> — Login timestamps, device type, and browser information for active session management.</li>
                  <li><strong>Account verification data</strong> — CAPTCHA responses during registration, processed by our privacy-first Ciphera Captcha service (not Google reCAPTCHA or any third-party provider).</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-2">
                  <strong>Legal basis:</strong> Contract performance (account management), legitimate interest (security).
                </p>

                {/* 4.4 Pulse */}
                <h3 className="text-xl font-semibold text-white mb-3 mt-8">
                  4.4. Ciphera Pulse (Privacy-First Analytics)
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-2">
                  Pulse is our self-hosted analytics platform, designed as a privacy-first alternative to Google Analytics. For websites using Pulse, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
                  <li><strong>Page views</strong> — Aggregated page view counts per URL, not tied to individual visitors.</li>
                  <li><strong>Unique visitor estimates</strong> — Calculated using a privacy-safe hashing method that rotates daily. No persistent identifiers are stored.</li>
                  <li><strong>Referrer sources</strong> — The website or search engine that directed visitors to the site.</li>
                  <li><strong>UTM parameters</strong> — Campaign tracking parameters from URLs (utm_source, utm_medium, etc.).</li>
                  <li><strong>Technical metadata</strong> — Device type (mobile, desktop, tablet), browser name, and operating system. Derived from the User-Agent string, which is not stored.</li>
                  <li><strong>Country-level location</strong> — Determined from the IP address, which is then immediately discarded. We do not store IP addresses.</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-2">
                  Pulse does not use cookies, does not use browser fingerprinting, does not track users across websites, and does not collect personally identifiable information by default. Custom event properties are defined by the website owner, who is responsible for ensuring they do not contain personal data. Pulse is fully GDPR-compliant and does not require a cookie consent banner.
                </p>
                <p className="text-neutral-400 leading-relaxed mt-2">
                  When website owners use Pulse on their websites, Ciphera B.V. acts as a data processor under GDPR Article 28. A Data Processing Agreement (DPA) is available upon request at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-brand-orange hover:underline">privacy@ciphera.net</a>.
                </p>
                <p className="text-neutral-400 leading-relaxed mt-2">
                  <strong>Legal basis:</strong> Legitimate interest (anonymous website analytics).
                </p>

                {/* 4.5 Captcha */}
                <h3 className="text-xl font-semibold text-white mb-3 mt-8">
                  4.5. Ciphera Captcha (Bot Protection)
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-2">
                  Our CAPTCHA service protects Ciphera services from automated abuse. We collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
                  <li><strong>Challenge responses</strong> — Your interaction with the CAPTCHA challenge, used solely to verify you are human.</li>
                  <li><strong>Verification tokens</strong> — Short-lived tokens that confirm successful CAPTCHA completion, automatically expired after use.</li>
                  <li><strong>Behavioral insights</strong> — Mouse movement patterns, keystroke timing, scroll behavior, and touch input, collected solely to distinguish automated traffic from human visitors. This data is processed in-memory only, is never written to persistent storage, is automatically discarded within 15 minutes, and is not linked to user accounts.</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-2">
                  Unlike third-party CAPTCHA services, Ciphera Captcha does not track users across pages or websites, does not set persistent cookies, and does not share data with advertising networks.
                </p>
                <p className="text-neutral-400 leading-relaxed mt-2">
                  <strong>Legal basis:</strong> Legitimate interest (abuse prevention, service security).
                </p>

                {/* 4.6 Relay */}
                <h3 className="text-xl font-semibold text-white mb-3 mt-8">
                  4.6. Ciphera Relay (Email Infrastructure)
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-2">
                  Relay handles transactional emails (account verification, security notifications, password resets) for Ciphera services. We collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
                  <li><strong>Recipient email addresses</strong> — Required to deliver transactional emails.</li>
                  <li><strong>Delivery metadata</strong> — Delivery status, bounce information, and timestamps for operational monitoring.</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-2">
                  Relay does not send marketing emails, does not track email opens via tracking pixels, and does not share recipient data with third parties. Email content is transmitted over encrypted connections (TLS).
                </p>
                <p className="text-neutral-400 leading-relaxed mt-2">
                  <strong>Legal basis:</strong> Contract performance (transactional communications).
                </p>
              </section>

              {/* 5. Data We Do Not Collect */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. Data We Do Not Collect
                </h2>
                <p className="text-neutral-400 leading-relaxed mb-3">
                  We believe it is equally important to state what we do not do:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
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
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. IP Address Policy
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  IP addresses are inherently part of internet communications and are temporarily processed by our servers during request handling. Our policy regarding IP addresses is:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-3">
                  <li><strong>No IP address storage</strong> — We do not store raw IP addresses in any database. All IP addresses are cryptographically hashed using HMAC-SHA256 with user-specific salts before any persistence. The original IP address is irreversibly discarded and cannot be recovered — not by us, not by anyone.</li>
                  <li><strong>Temporary processing</strong> — IP addresses may be temporarily held in server memory during active connections for rate limiting and abuse prevention. They are not written to persistent storage in their original form.</li>
                  <li><strong>Pulse analytics</strong> — IP addresses are used solely to derive country-level location data, then immediately discarded. The IP address itself is never stored.</li>
                  <li><strong>Security audit logs</strong> — Security events (logins, password changes, 2FA changes) are logged with a cryptographic hash of the IP address, not the IP itself. This allows detection of patterns (e.g., same device logging in repeatedly) without storing personally identifiable information. Audit logs are retained for 90 days, then archived for up to 1 year before permanent deletion.</li>
                  <li><strong>Server logs</strong> — Operational server logs that may contain IP addresses are automatically purged after 30 days.</li>
                </ul>
              </section>

              {/* 7. Cookies */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. Cookies &amp; Local Storage
                </h2>
                <p className="text-neutral-400 leading-relaxed mb-3">
                  We use the absolute minimum of browser storage necessary to operate our services:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-neutral-400 mt-2">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        <th className="text-left py-2 pr-4 font-semibold text-white">Name</th>
                        <th className="text-left py-2 pr-4 font-semibold text-white">Type</th>
                        <th className="text-left py-2 pr-4 font-semibold text-white">Purpose</th>
                        <th className="text-left py-2 font-semibold text-white">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4 font-mono text-xs">theme</td>
                        <td className="py-2 pr-4">Local storage</td>
                        <td className="py-2 pr-4">Stores your light/dark mode preference</td>
                        <td className="py-2">Persistent</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4 font-mono text-xs">session</td>
                        <td className="py-2 pr-4">HTTP-only cookie</td>
                        <td className="py-2 pr-4">Maintains your login session (authenticated services only)</td>
                        <td className="py-2">Session / 30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-neutral-400 leading-relaxed mt-4">
                  We do not use advertising cookies, tracking cookies, or third-party cookies. No cookie consent banner is required under GDPR because we only use strictly necessary cookies (Article 5(3) of the ePrivacy Directive).
                </p>
              </section>

              {/* 8. Encryption & Security */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  8. Encryption &amp; Security Measures
                </h2>
                <p className="text-neutral-400 leading-relaxed mb-3">
                  Security is foundational to everything we build. Our technical measures include:
                </p>

                <h3 className="text-lg font-semibold text-white mb-2">
                  Client-Side Encryption
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
                  <li><strong>Algorithm:</strong> AES-256-GCM (authenticated encryption)</li>
                  <li><strong>Key generation:</strong> Encryption keys are generated in your browser using the Web Crypto API and are never transmitted to our servers</li>
                  <li><strong>Zero-knowledge architecture:</strong> Our servers store only encrypted data. We have no technical capability to decrypt, read, or access the content of your files</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-2 mt-4">
                  Password Security
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
                  <li><strong>Double hashing:</strong> Passwords are hashed client-side with PBKDF2 (600,000 iterations) before transmission, then hashed again server-side with Argon2id</li>
                  <li><strong>No plaintext transmission:</strong> Your actual password never leaves your device</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-2 mt-4">
                  Account Data Encryption
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
                  <li><strong>At-rest encryption:</strong> Email addresses, display names, and two-factor authentication secrets are encrypted using AES-256-GCM before storage. A database breach cannot expose personal information.</li>
                  <li><strong>Hash-based lookups:</strong> Email lookups use an irreversible HMAC-SHA256 hash. Your email is never stored in readable form — only an encrypted version and a keyed hash exist in the database.</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-2 mt-4">
                  Transport Security
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
                  <li><strong>TLS 1.3:</strong> All connections to our services use TLS 1.3 encryption</li>
                  <li><strong>HSTS:</strong> HTTP Strict Transport Security is enforced with a minimum 1-year max-age</li>
                  <li><strong>Security headers:</strong> X-Content-Type-Options, X-Frame-Options (DENY), Referrer-Policy (strict-origin-when-cross-origin), and Content Security Policy are enforced on all pages</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-2 mt-4">
                  Infrastructure Security
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
                  <li>Data at rest is stored on encrypted volumes</li>
                  <li>Access to production systems requires multi-factor authentication</li>
                  <li>We follow the principle of least privilege for all internal access</li>
                  <li>Regular security reviews and dependency audits are performed</li>
                </ul>
              </section>

              {/* 9. Data Storage & Retention */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  9. Data Storage &amp; Retention
                </h2>

                <h3 className="text-lg font-semibold text-white mb-2">
                  Storage Location
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  All primary data is stored on servers located in <strong>Switzerland</strong>, subject to the Swiss Federal Act on Data Protection (FADP). Switzerland has been recognized by the European Commission as providing an adequate level of data protection (adequacy decision under GDPR Article 45).
                </p>

                <h3 className="text-lg font-semibold text-white mb-2 mt-4">
                  Retention Periods
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-2">
                  We retain data only as long as necessary for the purpose it was collected:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-neutral-400 mt-2">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        <th className="text-left py-2 pr-4 font-semibold text-white">Data Type</th>
                        <th className="text-left py-2 pr-4 font-semibold text-white">Retention Period</th>
                        <th className="text-left py-2 font-semibold text-white">Basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4">Encrypted files (Drop)</td>
                        <td className="py-2 pr-4">Until expiration (user-configured, 1 hour to 30 days)</td>
                        <td className="py-2">User choice</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4">Account data</td>
                        <td className="py-2 pr-4">While account is active + 30 days after deletion request</td>
                        <td className="py-2">Contract</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4">Session data</td>
                        <td className="py-2 pr-4">Until logout or 30 days (refresh token expiry)</td>
                        <td className="py-2">Contract</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4">Analytics data (Pulse)</td>
                        <td className="py-2 pr-4">Aggregated indefinitely (no personal data)</td>
                        <td className="py-2">Legitimate interest</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4">Contact form messages</td>
                        <td className="py-2 pr-4">12 months</td>
                        <td className="py-2">Consent</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4">Newsletter subscriptions</td>
                        <td className="py-2 pr-4">Until unsubscribe</td>
                        <td className="py-2">Consent</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4">Security audit logs (hashed IPs only)</td>
                        <td className="py-2 pr-4">90 days active + 1 year archive</td>
                        <td className="py-2">Legitimate interest</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4">Server logs</td>
                        <td className="py-2 pr-4">30 days (automatic purge)</td>
                        <td className="py-2">Legitimate interest</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4">CAPTCHA verification tokens</td>
                        <td className="py-2 pr-4">Expired immediately after use</td>
                        <td className="py-2">Legitimate interest</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Email delivery metadata (Relay)</td>
                        <td className="py-2 pr-4">30 days</td>
                        <td className="py-2">Contract</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 10. Legal Bases for Processing */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  10. Legal Bases for Processing
                </h2>
                <p className="text-neutral-400 leading-relaxed mb-3">
                  Under GDPR Article 6, we process personal data on the following legal bases:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-neutral-400">
                  <li>
                    <strong>Contract performance (Article 6(1)(b)):</strong> Processing necessary to provide the services you requested — account management, file sharing, session management, and transactional emails.
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
                <h2 className="text-2xl font-bold text-white mb-4">
                  11. Third-Party Services &amp; Data Processors
                </h2>
                <p className="text-neutral-400 leading-relaxed mb-3">
                  We minimize our reliance on third-party services. The services we use, and the data they may process, are listed below:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-neutral-400 mt-2">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        <th className="text-left py-2 pr-4 font-semibold text-white">Service</th>
                        <th className="text-left py-2 pr-4 font-semibold text-white">Purpose</th>
                        <th className="text-left py-2 pr-4 font-semibold text-white">Data Processed</th>
                        <th className="text-left py-2 font-semibold text-white">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4 font-medium">Exoscale</td>
                        <td className="py-2 pr-4">Compute and object storage</td>
                        <td className="py-2 pr-4">Encrypted data at rest</td>
                        <td className="py-2">Switzerland</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
                        <td className="py-2 pr-4 font-medium">Bunny</td>
                        <td className="py-2 pr-4">CDN, DNS, DDoS protection, edge routing</td>
                        <td className="py-2 pr-4">IP addresses (transient)</td>
                        <td className="py-2">Global (edge network)</td>
                      </tr>
                      <tr className="border-b border-neutral-800">
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
                <p className="text-neutral-400 leading-relaxed mt-4">
                  All third-party processors are bound by Data Processing Agreements (DPAs) and are contractually required to process data only for the specified purpose. A complete list of sub-processor identities, including specific company names and registered addresses, is available upon request at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-brand-orange hover:underline">privacy@ciphera.net</a>. We do not use:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-2">
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
                <h2 className="text-2xl font-bold text-white mb-4">
                  12. International Data Transfers
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  Your data is primarily stored in Switzerland, which benefits from an EU adequacy decision. In limited cases, data may be processed in other jurisdictions:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-3">
                  <li><strong>CDN/DNS services</strong> — Your requests may be routed through global edge servers for performance and DDoS protection. Only transient connection data (IP addresses) passes through these servers.</li>
                  <li><strong>GitHub</strong> — Public source code hosted in the United States. No personal user data is stored on GitHub.</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-3">
                  Where personal data is transferred outside the EEA or Switzerland, we ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) as approved by the European Commission under GDPR Article 46(2)(c), or transfers to countries with an adequacy decision under GDPR Article 45.
                </p>
              </section>

              {/* 13. Open Source & Transparency */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  13. Open Source &amp; Transparency
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  We believe transparency is essential to trust. Several of our products are open source, allowing independent verification of our privacy claims:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-3">
                  <li><strong>Drop</strong> — The frontend application is open source, so anyone can verify that encryption happens client-side before data leaves your device.</li>
                  <li><strong>Pulse</strong> — The frontend is open source, enabling independent audit of our analytics approach.</li>
                  <li><strong>Ciphera UI</strong> — Our shared component library is open source.</li>
                  <li><strong>This website</strong> — The marketing website source code is publicly available.</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-3">
                  Our open-source repositories are available at{' '}
                  <a href="https://github.com/ciphera-net" className="text-brand-orange hover:underline" target="_blank" rel="noopener noreferrer">github.com/ciphera-net</a>.
                </p>
              </section>

              {/* 14. Data Disclosure & Law Enforcement */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  14. Data Disclosure &amp; Law Enforcement
                </h2>
                <p className="text-neutral-400 leading-relaxed mb-3">
                  We will only disclose user data if legally compelled to do so by a valid and binding request from competent Belgian or Swiss authorities, in full compliance with applicable law.
                </p>
                <p className="text-neutral-400 leading-relaxed mb-3">
                  Our disclosure policy:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400">
                  <li><strong>Challenge first:</strong> We will challenge any request that we believe is overbroad, legally insufficient, or not in the public interest.</li>
                  <li><strong>Minimum disclosure:</strong> If legally required to comply, we will disclose only the minimum data necessary to satisfy the specific request.</li>
                  <li><strong>Encrypted data limitation:</strong> Due to our zero-knowledge architecture, we cannot decrypt or provide access to the contents of encrypted files, even under legal compulsion. We can only provide metadata and encrypted data.</li>
                  <li><strong>User notification:</strong> Where legally permitted, we will notify affected users of data requests.</li>
                  <li><strong>No voluntary disclosure:</strong> We do not voluntarily share user data with any government, intelligence agency, or law enforcement body.</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-3">
                  We do not comply with requests from foreign authorities unless they are processed through appropriate international legal assistance channels recognized by Belgian or Swiss law.
                </p>
              </section>

              {/* 15. Children's Privacy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  15. Children&apos;s Privacy
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  Our services are not directed at children under the age of 16. We do not knowingly collect personal data from children under 16. If you are a parent or guardian and believe your child has provided us with personal data, please contact us at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-brand-orange hover:underline">privacy@ciphera.net</a>{' '}
                  and we will promptly delete the data.
                </p>
              </section>

              {/* 16. Automated Decision-Making */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  16. Automated Decision-Making
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  We do not engage in automated decision-making or profiling that produces legal effects or similarly significantly affects you, as defined under GDPR Article 22. Our automated systems are limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-3">
                  <li><strong>Rate limiting</strong> — Automated throttling of excessive requests to protect service availability.</li>
                  <li><strong>CAPTCHA challenges</strong> — Automated bot detection during registration and certain interactions.</li>
                  <li><strong>File expiration</strong> — Automated deletion of files after user-configured expiration periods.</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-3">
                  None of these automated processes result in decisions that produce legal effects or significantly affect any individual.
                </p>
              </section>

              {/* 17. Data Breach Notification */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  17. Data Breach Notification
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  In the event of a personal data breach, we will:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-3">
                  <li>Notify the Belgian Data Protection Authority (Autorité de protection des données / Gegevensbeschermingsautoriteit) within 72 hours of becoming aware of the breach, as required by GDPR Article 33.</li>
                  <li>Notify affected users without undue delay if the breach is likely to result in a high risk to their rights and freedoms, as required by GDPR Article 34.</li>
                  <li>Document the breach, its effects, and the remedial actions taken.</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-3">
                  Due to our zero-knowledge architecture, a breach of our servers would not expose the content of encrypted files, as we do not possess the decryption keys.
                </p>
              </section>

              {/* 18. Your Rights */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  18. Your Rights Under GDPR &amp; FADP
                </h2>
                <p className="text-neutral-400 leading-relaxed mb-4">
                  Under the EU General Data Protection Regulation and the Swiss Federal Act on Data Protection, you have the following rights regarding your personal data:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-neutral-400">
                  <li>
                    <strong>Right of Access (Article 15):</strong> You have the right to obtain confirmation of whether we process your personal data, and to receive a copy of that data in a commonly used, machine-readable format.
                  </li>
                  <li>
                    <strong>Right to Rectification (Article 16):</strong> You have the right to request correction of inaccurate personal data and completion of incomplete data.
                  </li>
                  <li>
                    <strong>Right to Erasure (Article 17):</strong> You have the right to request deletion of your personal data. Account data will be deleted within 30 days of a verified request. Note that encrypted files cannot be individually identified as belonging to a specific user.
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
                    <a href="https://www.dataprotectionauthority.be" className="text-brand-orange hover:underline" target="_blank" rel="noopener noreferrer">www.dataprotectionauthority.be</a>.
                  </li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-4">
                  To exercise any of these rights, contact us at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-brand-orange hover:underline">privacy@ciphera.net</a>.
                  We will respond to verified requests within 30 days, as required by law. We may ask you to verify your identity before processing your request.
                </p>
              </section>

              {/* 19. Social Media & External Links */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  19. Social Media &amp; External Links
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  Our website and blog may contain links to external websites, including our GitHub repositories and social media profiles. We do not embed social media tracking widgets on our website. When you follow a link to an external site, you leave our services, and the external site&apos;s privacy policy governs your interaction with that site. We are not responsible for the privacy practices of external websites.
                </p>
              </section>

              {/* 20. Changes to This Policy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  20. Changes to This Policy
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  We may update this privacy policy from time to time to reflect changes in our services, legal requirements, or best practices. When we make changes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-3">
                  <li>The &ldquo;Last updated&rdquo; date at the top of this page will be revised.</li>
                  <li>For material changes that affect your rights, we will provide prominent notice (such as a banner on our website or an email notification to account holders).</li>
                  <li>Previous versions of this policy will be archived and available upon request.</li>
                </ul>
                <p className="text-neutral-400 leading-relaxed mt-3">
                  We encourage you to review this policy periodically. Your continued use of our services after changes are posted constitutes acceptance of the updated policy. The English version of this policy prevails in case of any discrepancy with translations.
                </p>
              </section>

              {/* 21. Contact Us */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  21. Contact Us
                </h2>
                <p className="text-neutral-400 leading-relaxed mb-3">
                  If you have any questions about this privacy policy, our data practices, or wish to exercise your rights, you can reach us through:
                </p>
                <div className="bg-neutral-900 rounded-xl p-6">
                  <ul className="list-none space-y-3 text-neutral-400">
                    <li>
                      <strong className="text-white">Privacy inquiries:</strong>{' '}
                      <a href="mailto:privacy@ciphera.net" className="text-brand-orange hover:underline">privacy@ciphera.net</a>
                    </li>
                    <li>
                      <strong className="text-white">Security concerns:</strong>{' '}
                      <a href="mailto:security@ciphera.net" className="text-brand-orange hover:underline">security@ciphera.net</a>
                    </li>
                    <li>
                      <strong className="text-white">General inquiries:</strong>{' '}
                      <a href="mailto:hello@ciphera.net" className="text-brand-orange hover:underline">hello@ciphera.net</a>
                    </li>
                    <li>
                      <strong className="text-white">Phone:</strong>{' '}
                      <a href="tel:+32078480710" className="text-brand-orange hover:underline">+32 078 480 710</a>
                    </li>
                    <li>
                      <strong className="text-white">Address:</strong>{' '}
                      Ciphera, De Kleetlaan 2, 1831 Diegem, Belgium
                    </li>
                  </ul>
                </div>
                <p className="text-neutral-400 leading-relaxed mt-4">
                  We aim to respond to all inquiries within 5 business days, and to formal data rights requests within 30 days.
                </p>
              </section>

            </div>

            <div className="mt-12 pt-8 border-t border-neutral-800 flex items-center justify-between">
              <Link href="/" className="text-brand-orange hover:underline font-medium">
                &larr; Back to Home
              </Link>
              <Link href="/terms" className="text-brand-orange hover:underline font-medium">
                Terms of Service &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
