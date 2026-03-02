import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Ciphera products and services. Covers acceptable use, intellectual property, liability, and governing law.',
  alternates: {
    canonical: 'https://ciphera.net/terms',
  },
  openGraph: {
    title: 'Terms of Service | Ciphera',
    description: 'Terms of Service for Ciphera products and services.',
    url: 'https://ciphera.net/terms',
    siteName: 'Ciphera',
    images: [{ url: '/ciphera_logo_no_margins.png', width: 1200, height: 630, alt: 'Ciphera Terms of Service' }],
    locale: 'en_US',
    type: 'website',
  },
}

const termsSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms of Service',
  description: 'Terms of Service for Ciphera products and services. Covers acceptable use, intellectual property, liability, and governing law.',
  url: 'https://ciphera.net/terms',
  dateModified: '2026-03-02',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Terms of Service' },
    ],
  },
}

export default function TermsOfServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />

      <section className="section-padding pt-32">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-12">
              Last updated: March 2, 2026
            </p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  By accessing or using any Ciphera service—including Drop, Pulse, Ciphera Auth, Ciphera Captcha, Ciphera Relay, and the ciphera.net website (collectively, the &quot;Services&quot;)—you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  2. Description of Services
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Ciphera provides privacy-first infrastructure and applications, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 mt-3">
                  <li><strong>Drop:</strong> End-to-end encrypted file sharing with zero-knowledge architecture</li>
                  <li><strong>Pulse:</strong> Privacy-respecting website analytics without cookies or tracking</li>
                  <li><strong>Ciphera Auth:</strong> Secure identity and authentication provider</li>
                  <li><strong>Ciphera Captcha:</strong> Privacy-first bot protection</li>
                  <li><strong>Ciphera Relay:</strong> Secure transactional email infrastructure</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  3. User Accounts
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Some Services require an account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must provide accurate information and promptly update it if it changes. You must notify us immediately at{' '}
                  <a href="mailto:security@ciphera.net" className="text-brand-orange hover:underline">security@ciphera.net</a>{' '}
                  if you suspect unauthorized access to your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  4. Acceptable Use
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  You agree not to use the Services to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
                  <li>Upload, share, or distribute illegal content</li>
                  <li>Distribute malware, viruses, or harmful code</li>
                  <li>Attempt to circumvent security measures or access unauthorized systems</li>
                  <li>Engage in activities that violate the rights of others</li>
                  <li>Use the Services for spam, phishing, or automated abuse</li>
                  <li>Resell or redistribute the Services without authorization</li>
                  <li>Interfere with or disrupt the Services or associated infrastructure</li>
                </ul>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
                  We reserve the right to suspend or terminate accounts that violate these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  5. Encryption & Zero-Knowledge Architecture
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Our Services use client-side encryption. You are solely responsible for maintaining access to your encryption keys and links. Ciphera cannot recover files, decrypt data, or reset encryption keys. If you lose access to a shared link or encryption key, the associated data cannot be recovered.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  6. Intellectual Property
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  The Ciphera name, logo, and branding are trademarks of Ciphera. Our open-source code is licensed under the respective licenses specified in each repository. You retain all rights to the content you upload or share through our Services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  7. Service Availability
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  We strive to maintain high availability but do not guarantee uninterrupted access to the Services. We may perform maintenance, updates, or modifications that temporarily affect availability. We will provide reasonable notice for planned maintenance when possible.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  To the maximum extent permitted by applicable law, Ciphera shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising out of or in connection with your use of the Services. Our total liability for any claims arising from the use of the Services shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  9. Disclaimer of Warranties
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  The Services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied. We do not warrant that the Services will be error-free, secure, or available at all times. You use the Services at your own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  10. Termination
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  You may stop using our Services at any time. We may suspend or terminate your access if you violate these terms or if required by law. Upon termination, your right to use the Services ceases immediately. Provisions that by their nature should survive termination will remain in effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  11. Changes to These Terms
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  We may update these Terms of Service from time to time. Material changes will be communicated through the Services or by email. Your continued use of the Services after changes take effect constitutes acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  12. Governing Law
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  These terms shall be governed by and construed in accordance with the laws of Belgium, without regard to conflict of law principles. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Brussels, Belgium.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  13. Contact
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  For questions about these Terms of Service, contact us:
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
