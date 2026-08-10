import { Metadata } from 'next'
import Link from 'next/link'
import { cdnUrl } from '@/lib/cdn'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Ciphera products and services. Covers eligibility, acceptable use, encryption, liability, indemnification, and governing law under Belgian jurisdiction.',
  alternates: {
    canonical: 'https://ciphera.net/terms',
  },
  openGraph: {
    title: 'Terms of Service | Ciphera',
    description: 'Terms of Service for Ciphera products and services.',
    url: 'https://ciphera.net/terms',
    siteName: 'Ciphera',
    images: [{ url: cdnUrl('/ciphera_logo_no_margins.png'), width: 1200, height: 630, alt: 'Ciphera Terms of Service' }],
    locale: 'en_US',
    type: 'website',
  },
}

const termsSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms of Service',
  description: 'Terms of Service for Ciphera products and services. Covers eligibility, acceptable use, encryption, liability, indemnification, and governing law under Belgian jurisdiction.',
  url: 'https://ciphera.net/terms',
  dateModified: '2026-07-19',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Terms of Service' },
    ],
  },
}

const SECTIONS = [
  { id: 'acceptance-of-terms', title: '1. Acceptance of Terms' },
  { id: 'eligibility', title: '2. Eligibility' },
  { id: 'description-of-services', title: '3. Description of Services' },
  { id: 'user-accounts', title: '4. User Accounts' },
  { id: 'acceptable-use', title: '5. Acceptable Use' },
  { id: 'encryption-and-zero-knowledge-architecture', title: '6. Encryption & Zero-Knowledge Architecture' },
  { id: 'service-specific-terms', title: '7. Service-Specific Terms' },
  { id: 'intellectual-property', title: '8. Intellectual Property' },
  { id: 'privacy', title: '9. Privacy' },
  { id: 'service-availability', title: '10. Service Availability' },
  { id: 'disclaimer-of-warranties', title: '11. Disclaimer of Warranties' },
  { id: 'limitation-of-liability', title: '12. Limitation of Liability' },
  { id: 'indemnification', title: '13. Indemnification' },
  { id: 'termination', title: '14. Termination' },
  { id: 'modifications-to-these-terms', title: '15. Modifications to These Terms' },
  { id: 'force-majeure', title: '16. Force Majeure' },
  { id: 'governing-law-and-jurisdiction', title: '17. Governing Law & Jurisdiction' },
  { id: 'severability', title: '18. Severability' },
  { id: 'assignment', title: '19. Assignment' },
  { id: 'entire-agreement', title: '20. Entire Agreement' },
  { id: 'contact', title: '21. Contact' },
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

export default function TermsOfServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />

      <section className="pt-32 pb-24 sm:pb-32">
        <div>
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground mb-12">
              Last updated: 19-07-2026
            </p>

            <nav aria-label="Contents" className="mb-12 hidden md:block border border-border bg-card p-6">
              <p className="text-xs text-muted-foreground">Contents</p>
              <ContentsList />
            </nav>

            <nav aria-label="Contents" className="mb-12 md:hidden">
              <details className="group border border-border bg-card p-6">
                <summary className="cursor-pointer list-none text-xs text-muted-foreground">Contents</summary>
                <ContentsList />
              </details>
            </nav>

            <div className="prose prose-invert max-w-none space-y-10">

              {/* 1. Acceptance of Terms */}
              <section>
                <h2 id="acceptance-of-terms" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using any Ciphera service — including Pulse, Ciphera ID, Ciphera Captcha, Ciphera Relay, and the ciphera.net website (collectively, the &quot;Services&quot;) — you agree to be bound by these Terms of Service (the &quot;Terms&quot;). These Terms constitute a legally binding agreement between you and Ciphera BV, a company incorporated under Belgian law (KBO/BCE: 1013.721.660), with registered offices at De Kleetlaan 2, 1831 Diegem, Belgium (&quot;Ciphera,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  If you do not agree to these Terms, you must not access or use the Services. If you are accepting these Terms on behalf of an organization, you represent and warrant that you have the authority to bind that organization.
                </p>
              </section>

              {/* 2. Eligibility */}
              <section>
                <h2 id="eligibility" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  2. Eligibility
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Services are available to individuals who are at least <span className="tabular-nums text-foreground">16 years</span> of age. If you are between <span className="tabular-nums text-foreground">16</span> and <span className="tabular-nums text-foreground">18</span> years of age, you may only use the Services with the consent and supervision of a parent or legal guardian who agrees to be bound by these Terms.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Accounts registered by automated methods (&quot;bots&quot;) are not authorized and will be terminated. Each individual may maintain one account. Creating multiple accounts to circumvent restrictions or abuse the Services is prohibited.
                </p>
              </section>

              {/* 3. Description of Services */}
              <section>
                <h2 id="description-of-services" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  3. Description of Services
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ciphera provides privacy-first infrastructure and applications designed with zero-knowledge architecture:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li><strong>Pulse:</strong> Privacy-respecting website analytics that operates without cookies, without fingerprinting techniques, and without personal data collection.</li>
                  <li><strong>Ciphera ID:</strong> Secure identity and authentication provider with zero-knowledge password handling.</li>
                  <li><strong>Ciphera Captcha:</strong> Privacy-first bot protection with ephemeral behavioral analysis. No cookies, no cross-site tracking, no third-party data collection.</li>
                  <li><strong>Ciphera Relay:</strong> Secure transactional email infrastructure for delivering encrypted communications.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Service features, capabilities, and availability may change over time. We will provide reasonable notice of material changes where possible.
                </p>
              </section>

              {/* 4. User Accounts */}
              <section>
                <h2 id="user-accounts" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  4. User Accounts
                </h2>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  4.1. Account Creation
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Some Services require a Ciphera account. When creating an account, you must provide a working email address for verification and account recovery. We recommend using a privacy-focused email provider. Display names are optional and may be pseudonymous.
                </p>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-4">
                  4.2. Account Security
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately at{' '}
                  <a href="mailto:security@ciphera.net" className="text-primary hover:underline">security@ciphera.net</a>{' '}
                  if you suspect unauthorized access to your account. Ciphera is not liable for any loss resulting from unauthorized use of your account credentials.
                </p>
              </section>

              {/* 5. Acceptable Use */}
              <section>
                <h2 id="acceptable-use" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  5. Acceptable Use
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree not to use the Services to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Upload, share, store, or distribute any content that is unlawful under applicable law, including but not limited to child sexual abuse material (CSAM)</li>
                  <li>Distribute malware, viruses, ransomware, or any other harmful or malicious code</li>
                  <li>Attempt to circumvent, disable, or interfere with security measures, access controls, or authentication mechanisms</li>
                  <li>Access or attempt to access other users&apos; accounts, data, or systems without authorization</li>
                  <li>Use the Services for sending spam, phishing, or bulk unsolicited communications</li>
                  <li>Engage in harassment, threats, defamation, or activities that violate the rights of others, including intellectual property rights</li>
                  <li>Resell, sublicense, or redistribute the Services or any part thereof without prior written authorization</li>
                  <li>Interfere with or disrupt the Services, servers, or networks connected to the Services</li>
                  <li>Use the Services in any manner that could overload, impair, or compromise the infrastructure or performance of the Services for other users</li>
                  <li>Use the Services to engage in or promote any illegal activity under applicable local, national, or international law</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We reserve the right to act on reported violations and to suspend or terminate accounts that violate these Terms, with or without notice. Due to our zero-knowledge architecture, we cannot inspect encrypted file contents — but we can disable access to reported links and suspend accounts. In cases involving illegal activity, we may report violations to the appropriate authorities as required by law.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  If you believe your account was suspended in error, you may contact us at{' '}
                  <a href="mailto:hello@ciphera.net" className="text-primary hover:underline">hello@ciphera.net</a>{' '}
                  to request a review.
                </p>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-6">
                  5.1. Reporting Illegal Content (EU Digital Services Act)
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  In accordance with the EU Digital Services Act (Regulation 2022/2065), we provide a mechanism for reporting illegal content hosted on or shared through our Services. If you become aware of content that you believe is illegal under applicable EU or national law, you may submit a report to{' '}
                  <a href="mailto:abuse@ciphera.net" className="text-primary hover:underline">abuse@ciphera.net</a>.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Reports should include, where possible: a description of the content, the URL or file link, an explanation of why you consider the content illegal, and your contact information. We will review reports promptly and take appropriate action, which may include disabling access to the reported content. Due to our zero-knowledge encryption, we cannot inspect file contents — but we can disable access to specific file links identified in reports.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Our designated single point of contact for authorities under the DSA is reachable at{' '}
                  <a href="mailto:abuse@ciphera.net" className="text-primary hover:underline">abuse@ciphera.net</a>.
                </p>
              </section>

              {/* 6. Encryption & Zero-Knowledge Architecture */}
              <section>
                <h2 id="encryption-and-zero-knowledge-architecture" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  6. Encryption &amp; Zero-Knowledge Architecture
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Our Services use client-side encryption and zero-knowledge architecture. This has important implications that you must understand:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>No data recovery:</strong> Your account is protected by zero-knowledge encryption: encryption keys are derived on your device and never transmitted to our servers. If you lose your account password and your recovery phrase, your encrypted account data <strong>cannot be recovered</strong> by Ciphera or anyone else.</li>
                  <li><strong>No content inspection:</strong> We cannot view, read, or analyze the contents of encrypted files stored on our servers. Content moderation of encrypted data is technically impossible in a zero-knowledge system.</li>
                  <li><strong>Your responsibility:</strong> You are solely responsible for maintaining access to your account credentials and recovery phrase. We strongly recommend keeping your recovery phrase and password in a secure location.</li>
                  <li><strong>Password limitations:</strong> Because we use the OPAQUE protocol, your password never reaches our servers, and we store no password, password hash, or verifier. We therefore cannot reset or recover your password. Account recovery requires the 24-word recovery phrase shown to you when you created your account. If you lose both your password and your recovery phrase, your account cannot be recovered. Email-based password reset is not available by design.</li>
                </ul>
              </section>

              {/* 7. Service-Specific Terms */}
              <section>
                <h2 id="service-specific-terms" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  7. Service-Specific Terms
                </h2>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  7.1. Pulse (Analytics)
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Pulse collects only aggregated, anonymous data. No personally identifiable information is collected from website visitors.</li>
                  <li>Pulse does not use cookies, does not use browser fingerprinting techniques (no canvas, WebGL, audio, font, or hardware probing), and does not track visitors across websites. It does not require cookie consent banners.</li>
                  <li><strong>Automated traffic.</strong> Pulse identifies traffic that appears to be automated and excludes it from your statistics. Excluded traffic is listed in your site&rsquo;s Bot &amp; Spam settings and can be restored by you at any time. Classification is automated and is not warranted to be free of error; if a real visitor is excluded, restoring the traffic returns it to your reports.</li>
                  <li>Analytics data belongs to the website owner who installed Pulse. Ciphera does not access, share, or sell analytics data collected by Pulse.</li>
                  <li>You are responsible for ensuring that your use of Pulse on your website complies with applicable privacy laws and your own privacy policy.</li>
                </ul>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-6">
                  7.2. Ciphera ID (Identity Provider)
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Ciphera ID provides centralized authentication across Ciphera services using JWT-based sessions.</li>
                  <li>Access tokens expire after a short period and refresh tokens after a reasonable period, as specified in our technical documentation. You may be required to re-authenticate after token expiry.</li>
                  <li>We implement bot protection during account creation using our own Ciphera Captcha — not third-party services like Google reCAPTCHA.</li>
                </ul>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-6">
                  7.3. Ciphera Captcha (Bot Protection)
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Captcha verifies that interactions originate from humans, not automated systems.</li>
                  <li>Captcha collects behavioral insights (mouse movement patterns, keystroke timing, scroll behavior, touch input) solely for bot detection. This data is processed in-memory only, never written to persistent storage, automatically discarded within <span className="tabular-nums text-foreground">15 minutes</span>, and not linked to user accounts.</li>
                  <li>Captcha does not track users across pages or websites and does not use persistent cookies.</li>
                  <li>Verification tokens are short-lived and automatically expired after use.</li>
                </ul>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-6">
                  7.4. Ciphera Relay (Email Infrastructure)
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Relay handles transactional emails (account verification, security alerts, password resets) for Ciphera services.</li>
                  <li>Relay does not send marketing or promotional emails.</li>
                  <li>All emails are transmitted over encrypted connections (TLS). We do not use tracking pixels in any emails.</li>
                </ul>
              </section>

              {/* 8. Intellectual Property */}
              <section>
                <h2 id="intellectual-property" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  8. Intellectual Property
                </h2>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  8.1. Ciphera&apos;s Intellectual Property
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Ciphera name, logos, trademarks, service marks, trade dress, and branding are the exclusive property of Ciphera. Nothing in these Terms grants you any right or license to use Ciphera trademarks without our prior written permission. All goodwill arising from the use of our trademarks inures exclusively to Ciphera.
                </p>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-4">
                  8.2. Open-Source Software
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Certain components of the Services are released as open-source software and are governed by the specific open-source license specified in each repository (available at{' '}
                  <a href="https://github.com/ciphera-net" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">github.com/ciphera-net</a>
                  ). In the event of a conflict between these Terms and an applicable open-source license, the open-source license shall prevail with respect to the specific software component.
                </p>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-4">
                  8.3. Your Content
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  You retain all rights to the content you upload, share, or transmit through our Services. Ciphera does not claim ownership of your content. Due to our zero-knowledge architecture, we cannot access or use your encrypted content for any purpose.
                </p>
              </section>

              {/* 9. Privacy */}
              <section>
                <h2 id="privacy" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  9. Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is governed by our{' '}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>,
                  which describes how we collect, use, and protect your personal data. By using the Services, you acknowledge that you have read and understood our Privacy Policy.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Where you use the Services to process personal data of third parties (for example, by using Pulse on your website to collect visitor analytics), you act as the data controller for that data under GDPR, and Ciphera BV acts as your data processor under GDPR Article 28. A Data Processing Agreement (DPA) is available upon request at{' '}
                  <a href="mailto:privacy@ciphera.net" className="text-primary hover:underline">privacy@ciphera.net</a>.
                  You are responsible for ensuring your use complies with applicable data protection laws, including maintaining an appropriate privacy policy for your own users.
                </p>
              </section>

              {/* 10. Service Availability */}
              <section>
                <h2 id="service-availability" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  10. Service Availability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to maintain high availability of the Services but do not guarantee uninterrupted, timely, or error-free access. The Services may be temporarily unavailable due to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li>Scheduled maintenance (we will provide advance notice when possible)</li>
                  <li>Unscheduled emergency maintenance to address security vulnerabilities or critical issues</li>
                  <li>Circumstances beyond our reasonable control (see Section 16, Force Majeure)</li>
                  <li>Third-party service disruptions (DNS providers, hosting infrastructure, internet backbone)</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  We are not liable for any interruption of the Services, whether planned or unplanned, or for any loss of data or functionality resulting from such interruptions.
                </p>
              </section>

              {/* 11. Disclaimer of Warranties */}
              <section>
                <h2 id="disclaimer-of-warranties" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  11. Disclaimer of Warranties
                </h2>
                <p className="text-muted-foreground leading-relaxed font-semibold">
                  THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  To the maximum extent permitted by applicable law, Ciphera disclaims all warranties, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                  <li>Any warranty that the Services will be uninterrupted, error-free, secure, or free of viruses or harmful components</li>
                  <li>Any warranty regarding the accuracy, reliability, or completeness of any content or information provided through the Services</li>
                  <li>Any warranty regarding the preservation or security of data (beyond the encryption measures described in our technical documentation)</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Due to our zero-knowledge architecture, Ciphera has no obligation or ability to recover data from terminated accounts, expired files, or situations where encryption keys have been lost. You use the Services at your own risk.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  This disclaimer does not affect any mandatory statutory rights that cannot be waived under applicable consumer protection law.
                </p>
              </section>

              {/* 12. Limitation of Liability */}
              <section>
                <h2 id="limitation-of-liability" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  12. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed font-semibold">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground mt-3">
                  <li>
                    <strong>Exclusion of consequential damages:</strong> Ciphera shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including but not limited to loss of profits, data, use, goodwill, business interruption, or any other intangible losses, arising out of or in connection with your use of or inability to use the Services.
                  </li>
                  <li>
                    <strong>Liability cap:</strong> Ciphera&apos;s total aggregate liability for all claims arising from or related to these Terms or the Services shall not exceed the greater of: (a) the total amount you paid to Ciphera in the <span className="tabular-nums text-foreground">twelve (12) months</span> immediately preceding the event giving rise to the claim, or (b) <span className="tabular-nums text-foreground">one hundred euros (€100)</span>.
                  </li>
                  <li>
                    <strong>Encryption limitation:</strong> You acknowledge that Ciphera cannot be held liable for data loss resulting from a lost account password, a lost recovery phrase, or the inability to decrypt data due to the inherent nature of zero-knowledge encryption.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  The above limitations apply regardless of the legal theory of the claim (contract, tort, negligence, strict liability, or otherwise) and regardless of whether Ciphera has been advised of the possibility of such damages. These limitations do not apply to liability that cannot be excluded under applicable law, including liability for fraud, willful misconduct, or personal injury.
                </p>
              </section>

              {/* 13. Indemnification */}
              <section>
                <h2 id="indemnification" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  13. Indemnification
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify, defend, and hold harmless Ciphera, its officers, directors, employees, agents, and contractors from and against any third-party claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or related to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li>Your use of the Services</li>
                  <li>Content you upload, share, or transmit through the Services</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any applicable law or regulation</li>
                  <li>Your infringement of any third-party rights, including intellectual property rights</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  This section applies to the extent permitted by applicable law. It does not apply to consumers where prohibited by mandatory consumer protection legislation in their country of residence. This indemnification obligation survives termination of your account and these Terms.
                </p>
              </section>

              {/* 14. Termination */}
              <section>
                <h2 id="termination" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  14. Termination
                </h2>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  14.1. Termination by You
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  You may stop using our Services at any time. You may delete your account through your account settings or by contacting us at{' '}
                  <a href="mailto:hello@ciphera.net" className="text-primary hover:underline">hello@ciphera.net</a>.
                  Upon account deletion, your personal data will be removed in accordance with our{' '}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                  Account deletion is immediate and irreversible.
                </p>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-4">
                  14.2. Termination by Ciphera
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may suspend or terminate your access to the Services if:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                  <li>You violate these Terms or our Acceptable Use policy</li>
                  <li>We are required to do so by law or a valid legal order</li>
                  <li>Continuing to provide the Services to you would pose a security risk to other users or our infrastructure</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Except in cases of serious violation of these Terms, legal compulsion, or immediate security risk, we will provide reasonable advance notice before terminating your account.
                </p>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-4">
                  14.3. Effect of Termination
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upon termination, your right to use the Services ceases immediately. The following provisions survive termination: Sections 6 (Encryption), 8 (Intellectual Property), 11 (Disclaimer of Warranties), 12 (Limitation of Liability), 13 (Indemnification), 17 (Governing Law), and any other provisions that by their nature should survive.
                </p>
              </section>

              {/* 15. Modifications to These Terms */}
              <section>
                <h2 id="modifications-to-these-terms" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  15. Modifications to These Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update these Terms from time to time. When we make changes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  <li>The &ldquo;Last updated&rdquo; date at the top of this page will be revised.</li>
                  <li>For material changes that affect your rights or obligations, we will provide at least <span className="tabular-nums text-foreground">30 days</span>&apos; advance notice via email to your registered address or through a prominent notice on our website.</li>
                  <li>Your continued use of the Services after the updated Terms take effect constitutes your acceptance of the changes.</li>
                  <li>If you do not agree with the updated Terms, you must stop using the Services before the changes take effect.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Previous versions of these Terms will be archived and made available upon request.
                </p>
              </section>

              {/* 16. Force Majeure */}
              <section>
                <h2 id="force-majeure" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  16. Force Majeure
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ciphera shall not be liable for any failure or delay in performance resulting from causes beyond our reasonable control, including but not limited to: acts of God, natural disasters, pandemics, war, terrorism, government actions, power failures, internet or telecommunications outages, cyberattacks, fire, flood, or labor disputes. In such events, Ciphera&apos;s obligations will be suspended for the duration of the force majeure event.
                </p>
              </section>

              {/* 17. Governing Law & Jurisdiction */}
              <section>
                <h2 id="governing-law-and-jurisdiction" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  17. Governing Law &amp; Jurisdiction
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of Belgium, without regard to conflict of law principles. Any disputes arising out of or in connection with these Terms or the Services shall be subject to the exclusive jurisdiction of the competent courts of Brussels, Belgium.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  If you are a consumer residing in the European Union, you also have the right to bring proceedings in the courts of your country of residence. Nothing in these Terms affects your rights as a consumer under mandatory consumer protection legislation in your country of residence.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  For EU consumers, the European Commission provides an online dispute resolution platform at{' '}
                  <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
                  We encourage you to contact us directly before initiating any formal dispute resolution process.
                </p>
              </section>

              {/* 18. Severability */}
              <section>
                <h2 id="severability" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  18. Severability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, that provision shall be severed to the minimum extent necessary, and the remaining provisions shall continue in full force and effect. The invalid provision shall be replaced with a valid provision that most closely reflects the original intent.
                </p>
              </section>

              {/* 19. Assignment */}
              <section>
                <h2 id="assignment" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  19. Assignment
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You may not assign or transfer these Terms, or any rights or obligations hereunder, without our prior written consent. Ciphera may assign these Terms, in whole or in part, to any successor entity or in connection with a merger, acquisition, reorganization, or sale of substantially all of its assets, provided that the assignee agrees to be bound by these Terms. Any attempted assignment in violation of this section shall be void.
                </p>
              </section>

              {/* 20. Entire Agreement */}
              <section>
                <h2 id="entire-agreement" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  20. Entire Agreement
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms, together with our{' '}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>,
                  constitute the entire agreement between you and Ciphera regarding the Services and supersede all prior or contemporaneous communications, proposals, and agreements, whether oral or written. Section headings are for convenience only and do not affect the interpretation of these Terms.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  No waiver of any provision of these Terms shall be deemed a further or continuing waiver of that provision or any other provision. Ciphera&apos;s failure to enforce any right or provision shall not constitute a waiver of that right or provision.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  The English version of these Terms prevails in the event of any discrepancy with translations into other languages.
                </p>
              </section>

              {/* 21. Contact */}
              <section>
                <h2 id="contact" className="font-display text-2xl font-semibold text-foreground mb-4 scroll-mt-24">
                  21. Contact
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  For questions about these Terms of Service, contact us:
                </p>
                <div className="border border-border bg-card p-6">
                  <dl className="grid gap-x-12 gap-y-4 sm:grid-cols-2">
                    {[
                      { term: 'General inquiries', email: 'hello@ciphera.net' },
                      { term: 'Abuse reports', email: 'abuse@ciphera.net' },
                      { term: 'Security concerns', email: 'security@ciphera.net' },
                      { term: 'Privacy inquiries', email: 'privacy@ciphera.net' },
                    ].map((c) => (
                      <div key={c.term} className="border-t border-border pt-3">
                        <dt className="text-xs text-muted-foreground">{c.term}</dt>
                        <dd className="mt-1.5"><a href={`mailto:${c.email}`} className="text-sm text-primary hover:underline">{c.email}</a></dd>
                      </div>
                    ))}
                    <div className="border-t border-border pt-3">
                      <dt className="text-xs text-muted-foreground">Phone</dt>
                      <dd className="mt-1.5"><a href="tel:+3278480710" className="text-sm text-primary hover:underline">+32 78 48 07 10</a></dd>
                    </div>
                    <div className="border-t border-border pt-3">
                      <dt className="text-xs text-muted-foreground">Address</dt>
                      <dd className="mt-1.5 text-sm text-foreground">Ciphera BV (KBO/BCE: 1013.721.660), De Kleetlaan 2, 1831 Diegem, Belgium</dd>
                    </div>
                  </dl>
                </div>
              </section>

            </div>

            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
              <Link href="/" className="text-primary hover:underline font-medium">
                &larr; Back to Home
              </Link>
              <Link href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
