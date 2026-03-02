import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Ciphera protects your privacy. Our privacy policy covers data collection, encryption practices, GDPR compliance, and your rights.',
  alternates: {
    canonical: 'https://ciphera.net/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Ciphera',
    description: 'Learn how Ciphera protects your privacy with zero-knowledge encryption and minimal data collection.',
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
  description: 'Learn how Ciphera protects your privacy with zero-knowledge encryption and minimal data collection.',
  url: 'https://ciphera.net/privacy',
  dateModified: '2026-03-02',
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
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-12">
              Last updated: March 2, 2026
            </p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  Our Commitment to Privacy
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Ciphera is built on the principle that privacy is a fundamental right. We design every product with zero-knowledge architecture, meaning we cannot access your data even if we wanted to. This privacy policy explains what minimal data we collect and how we handle it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  Data We Collect
                </h2>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                  Ciphera Drop (File Sharing)
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
                  <li>Encrypted file data (we cannot decrypt your files)</li>
                  <li>File metadata: size, upload timestamp, expiration settings</li>
                  <li>No account data is required for basic file sharing</li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 mt-6">
                  Ciphera Auth (Identity Provider)
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
                  <li>Email address (for account identification and verification)</li>
                  <li>Username (chosen by you)</li>
                  <li>Double-hashed password (hashed client-side with PBKDF2, then server-side with Argon2id)</li>
                  <li>Session metadata: login timestamps, device type</li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 mt-6">
                  Pulse (Analytics)
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
                  <li>Page views and unique visitor counts (aggregated, not individual)</li>
                  <li>Referrer sources and UTM parameters</li>
                  <li>Device type, browser, and operating system</li>
                  <li>Country-level geographic data only</li>
                  <li>No cookies, no fingerprinting, no personal identification</li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 mt-6">
                  Website (ciphera.net)
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
                  <li>Contact form submissions: name, email, subject, and message</li>
                  <li>Newsletter subscriptions: email address only</li>
                  <li>We use our own Pulse analytics (privacy-first, no cookies)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  Data We Do Not Collect
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
                  <li>We do not use cookies for tracking</li>
                  <li>We do not use browser fingerprinting</li>
                  <li>We do not engage in cross-site tracking</li>
                  <li>We do not sell, trade, or rent your personal data to third parties</li>
                  <li>We do not share data with advertisers</li>
                  <li>We do not use third-party analytics (Google Analytics, etc.)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  Encryption & Security
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  All file encryption happens client-side using AES-256-GCM before any data leaves your device. Encryption keys are generated in your browser and are never transmitted to or stored on our servers. We use TLS 1.3 for all connections. Passwords are double-hashed: first with PBKDF2 in the browser, then with Argon2id on our servers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  Data Storage & Retention
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
                  <li>All data is stored on servers located in Switzerland, protected by Swiss data protection laws (FADP)</li>
                  <li>Uploaded files are automatically deleted based on your chosen expiration settings</li>
                  <li>Account data is retained while your account is active</li>
                  <li>Contact form messages are retained for up to 12 months</li>
                  <li>Server logs are automatically purged after 30 days</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  Your Rights (GDPR & FADP)
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  Under the EU General Data Protection Regulation (GDPR) and the Swiss Federal Act on Data Protection (FADP), you have the following rights:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
                  <li><strong>Right of Access:</strong> Request a copy of the data we hold about you</li>
                  <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
                  <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Right to Object:</strong> Object to the processing of your data</li>
                  <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
                </ul>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
                  To exercise any of these rights, contact us at{' '}
                  <a href="mailto:hello@ciphera.net" className="text-brand-orange hover:underline">hello@ciphera.net</a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  Third-Party Services
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  We minimize the use of third-party services. The services we use are:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mt-3">
                  <li><strong>Hosting:</strong> Swiss-based infrastructure providers for data storage</li>
                  <li><strong>DNS & CDN:</strong> For content delivery and DDoS protection</li>
                  <li><strong>GitHub:</strong> For open-source code hosting</li>
                </ul>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
                  We do not use advertising networks, social media trackers, or third-party analytics platforms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  Changes to This Policy
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  Contact Us
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  If you have any questions about this privacy policy or our data practices, please contact us:
                </p>
                <ul className="list-none space-y-2 text-neutral-600 dark:text-neutral-400 mt-3">
                  <li>Email: <a href="mailto:hello@ciphera.net" className="text-brand-orange hover:underline">hello@ciphera.net</a></li>
                  <li>Address: De Kleetlaan 2, 1831 Diegem, Belgium</li>
                  <li>Phone: <a href="tel:+32078480710" className="text-brand-orange hover:underline">+32 078 480 710</a></li>
                </ul>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <Link href="/" className="text-brand-orange hover:underline font-medium">
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
