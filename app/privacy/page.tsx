import { Metadata } from 'next'
import Link from 'next/link'
import { subprocessors, weDoNotUse } from '@/lib/subprocessors'
import { DPA_IN_FORCE } from '@/lib/dpa/agreement'
import { pageCardImages } from '@/lib/og/cards'
import { PageOpeningC } from '@/components/overhaul/system/PageOpening'
import { LegalSections, type LegalSectionData } from '@/components/overhaul/legal/LegalSections'
import { LegalTable } from '@/components/overhaul/legal/LegalTable'
import { PRIVACY, type PrivacySectionId } from '@/components/overhaul/legal/legal-words'
import { H3, LINK, P, UL } from '@/components/overhaul/legal/styles'

const CARD = pageCardImages('privacy')

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Ciphera privacy policy: zero-knowledge encryption, minimal data collection, Swiss infrastructure, GDPR compliance, and your rights. Last updated 28-10-2026.',
  alternates: {
    canonical: 'https://ciphera.net/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Ciphera',
    description: 'Ciphera privacy policy: zero-knowledge encryption, minimal data collection, Swiss infrastructure, and GDPR compliance.',
    url: 'https://ciphera.net/privacy',
    siteName: 'Ciphera',
    images: CARD.openGraph,
    locale: 'en_US',
    type: 'website',
  },
  // Its own card on X too: without a twitter block the page inherited the homepage's.
  twitter: { card: 'summary_large_image', images: CARD.twitter },
}

const privacySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy',
  description: 'Ciphera privacy policy: zero-knowledge encryption, minimal data collection, Swiss infrastructure, and GDPR compliance.',
  url: 'https://ciphera.net/privacy',
  dateModified: '2026-10-28',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Privacy Policy' },
    ],
  },
}

/** A cookie's or a storage entry's name is a machine key, so it alone is set in mono (Design & Typography). */
const storageName = (name: string) => <span className="font-mono text-[0.9em]">{name}</span>

// The policy's 21 sections, folded (D51): each body is the published text, in order; the number is the position.
const SECTIONS: LegalSectionData<PrivacySectionId>[] = [
  {
    id: 'our-commitment-to-privacy',
    title: 'Our Commitment to Privacy',
    body: (
      <>
        <p className={P}>
          Ciphera is built on the principle that privacy is a fundamental right, not a feature. Your account is protected by zero-knowledge encryption: your password and account vault are encrypted on your device under keys we never hold, so we cannot read that data even if compelled to. For services where zero-knowledge encryption does not apply — such as our privacy-first analytics, support, and billing — we minimize what we collect by design. We collect the absolute minimum data necessary to operate our services, we never sell or share your data with advertisers, and we give you full control over your information.
        </p>
        <p className={P}>
          This policy explains in detail what data we collect, why we collect it, how we protect it, and what rights you have. It should be read alongside our{' '}
          <Link href="/terms" className={LINK}>Terms of Service</Link>,
          which governs your use of our services. We encourage you to read both in full.
        </p>
      </>
    ),
  },
  {
    id: 'legal-framework',
    title: 'Legal Framework',
    body: (
      <>
        <p className={P}>
          Ciphera is operated by Ciphera BV, a company incorporated under Belgian law (KBO/BCE: 1013.721.660), with registered offices at De Kleetlaan 2, 1831 Diegem, Belgium. Our operations are governed by:
        </p>
        <ul className={UL}>
          <li><strong>Belgian law</strong> — as our entity is incorporated in Belgium</li>
          <li><strong>EU General Data Protection Regulation (GDPR)</strong> — Regulation (EU) 2016/679, as we process data of individuals in the European Economic Area</li>
          <li><strong>Swiss Federal Act on Data Protection (FADP)</strong> — as our data infrastructure is located in Switzerland</li>
          <li><strong>ePrivacy Directive</strong> — Directive 2002/58/EC, as applicable to our electronic communications</li>
        </ul>
        <p className={P}>
          Where these frameworks differ, we apply the standard that provides the strongest protection for your data. Belgian courts in Brussels hold exclusive jurisdiction for any disputes arising from this policy.
        </p>
      </>
    ),
  },
  {
    id: 'data-controller',
    title: 'Data Controller',
    body: (
      <>
        <p className={P}>
          The data controller for all Ciphera services is:
        </p>
        <p className={P}>
          <strong>Ciphera BV</strong><br />
          KBO/BCE: 1013.721.660<br />
          De Kleetlaan 2<br />
          1831 Diegem, Belgium<br />
          Email: <a href="mailto:privacy@ciphera.net" className={LINK}>privacy@ciphera.net</a><br />
          Phone: <a href="tel:+3278480710" className={LINK}>+32 78 48 07 10</a>
        </p>
        <p className={P}>
          For privacy-specific inquiries, contact us at{' '}
          <a href="mailto:privacy@ciphera.net" className={LINK}>privacy@ciphera.net</a>.
          For security concerns, contact{' '}
          <a href="mailto:security@ciphera.net" className={LINK}>security@ciphera.net</a>.
        </p>
        <p className={P}>
          Given the nature and scale of our current operations, a Data Protection Officer (DPO) has not been appointed under GDPR Article 37. All privacy inquiries are handled directly by our team at{' '}
          <a href="mailto:privacy@ciphera.net" className={LINK}>privacy@ciphera.net</a>.
        </p>
      </>
    ),
  },
  {
    id: 'data-we-collect',
    title: 'Data We Collect',
    body: (
      <>
        <p className={P}>
          We apply data minimization as a core design principle. Below is an exhaustive breakdown of every category of data we collect, organized by service.
        </p>

        {/* 4.1 Website */}
        <h3 className={H3}>
          4.1. Website (ciphera.net)
        </h3>
        <p className={P}>
          When you visit our website, we collect:
        </p>
        <ul className={UL}>
          <li><strong>Analytics data</strong> — Page views, referrer sources, UTM parameters, device type, browser, operating system, and approximate location (country, region, and city). Collected via our own Pulse Analytics platform, which uses no cookies, no fingerprinting, and no personal identifiers. It cannot be traced to you as a person: there is no name, no email, no account and no identifier that recognises a visitor for more than one day or reaches another website.</li>
          <li><strong>Contact form submissions</strong> — Name, email address, subject, and message content, submitted voluntarily through our contact page.</li>
          <li><strong>Newsletter subscriptions</strong> — Email address only, submitted voluntarily with explicit consent.</li>
        </ul>
        <p className={P}>
          <strong>Legal basis:</strong> Legitimate interest (analytics), consent (contact form, newsletter).
        </p>

        {/* 4.2 Ciphera ID */}
        <h3 className={H3}>
          4.2. Ciphera ID (Identity Provider)
        </h3>
        <p className={P}>
          When you create a Ciphera account, we collect:
        </p>
        <ul className={UL}>
          <li><strong>Email address</strong> — Used for account identification, verification, and security notifications. Your email is never stored on our servers in readable form: it is kept only inside your client-encrypted account vault, which we cannot decrypt. To sign you in, we match your account using a blind index — an irreversible keyed hash derived from your email on your device and hashed again on our servers — so we can find your account without ever holding your address.</li>
          <li><strong>Display name</strong> — Chosen by you, used for display and identification purposes. Like your email, it is stored only inside your client-encrypted account vault and never held on our servers in readable form.</li>
          <li><strong>Password</strong> — Your password never leaves your device. We use OPAQUE (RFC 9807), a password-authenticated key exchange: your password is strengthened on your device using Argon2id and proven to our servers without ever being sent. We store only an opaque credential record that cannot be reversed into your password — no password, no password hash, and no password-equivalent verifier. We cannot see, recover, or reset your password.</li>
          <li><strong>Session metadata</strong> — Login timestamps, device type, and browser information for active session management.</li>
          <li><strong>Account verification data</strong> — CAPTCHA responses during registration, processed by our privacy-first Ciphera Captcha service (not Google reCAPTCHA or any third-party provider).</li>
        </ul>
        <p className={P}>
          <strong>Legal basis:</strong> Contract performance (account management), legitimate interest (security).
        </p>

        {/* 4.4 Pulse */}
        <h3 className={H3}>
          4.3. Pulse Analytics
        </h3>
        <p className={P}>
          Pulse is our self-hosted analytics platform, designed as a privacy-first alternative to Google Analytics. For websites using Pulse, we collect:
        </p>
        <ul className={UL}>
          <li><strong>Page views</strong> — Aggregated page view counts per URL, not tied to individual visitors.</li>
          <li><strong>Unique visitor estimates</strong> — To count visitors, Pulse makes a one-day identifier on its servers from each request&rsquo;s IP address and the browser&rsquo;s user-agent string, using a random key that is deleted shortly after the site&rsquo;s day ends. A visitor who returns on a later day is counted again. The IP address is discarded immediately and never stored, the identifier cannot be reversed, and no persistent identifier is kept. A site owner may switch on visitor-level views, which show profiles that each cover one IP address and browser on one day; it is off by default.</li>
          <li><strong>Referrer sources</strong> — The website or search engine that directed visitors to the site.</li>
          <li><strong>UTM parameters</strong> — Campaign tracking parameters from URLs (utm_source, utm_medium, etc.).</li>
          <li><strong>Technical metadata</strong> — Device type (mobile, desktop, tablet), browser name, and operating system. Derived from the User-Agent string, which is not stored.</li>
          <li><strong>Interactions, only if the site owner adds a second script</strong> — Pulse ships an optional companion script that a site owner must add to their pages deliberately; it is not part of the standard tag and is absent unless they paste it. Where it is used, it records: the visible label of a button or link that was clicked, shortened to 60 characters and with email addresses and long digit sequences removed <em>in your browser</em> before anything is sent; how many characters were copied and the kind of element they came from, <strong>never the copied text itself</strong>; and, for a submitted form, its name and how many fields it had — <strong>never a field&rsquo;s value and never a field&rsquo;s name</strong>. It records nothing you type, no keystrokes, and nothing about where an element sits on the screen. A site owner can switch off each of the three kinds separately, and can mark any part of a page so that nothing in it is ever recorded.</li>
          <li><strong>Approximate location</strong> — Country, region and city, unless the site owner has narrowed it. All three are determined from the IP address, which is then immediately discarded. We do not store IP addresses. A new Pulse site collects all three; a site owner can cap the detail at country only, or switch geographic collection off altogether.</li>
        </ul>
        <p className={P}>
          Pulse does not use cookies, does not use browser fingerprinting techniques (no canvas, WebGL, audio, font, or hardware probing), does not track users across websites, and does not collect personally identifiable information by default. To recognise automated traffic, Pulse derives a coarse code from the settings your browser reports on every request &mdash; browser family, operating system, device type, language, timezone and window size. That code is scoped to a single website, is never compared across websites, and is deleted after 14 days. Custom event properties are defined by the website owner, who is responsible for ensuring they do not contain personal data. The same applies to the interaction companion described above: a button&rsquo;s label is text the website owner wrote, so where that script is used it is the owner&rsquo;s responsibility to ensure their own interface labels do not contain personal data — Pulse shortens and redacts what it sends, but it cannot know that a label is a person&rsquo;s name. Pulse is designed to operate without cookies or persistent identifiers, so it does not set a cookie consent banner.
        </p>
        <p className={P}>
          When website owners use Pulse on their websites, Ciphera BV acts as a data processor under GDPR Article 28. Our{' '}
          <Link href="/dpa" className={LINK}>Data Processing Agreement</Link>{' '}
          sets out that role. It takes effect on {DPA_IN_FORCE}; until then, it applies to any customer who asks for it at{' '}
          <a href="mailto:privacy@ciphera.net" className={LINK}>privacy@ciphera.net</a>.
        </p>
        <p className={P}>
          Website owners can connect tools of their choice &mdash; such as an AI assistant &mdash; to their own Pulse analytics. When they do, Pulse provides aggregated statistics about their website to that tool on their instruction. The tool&rsquo;s provider receives the data as the website owner&rsquo;s recipient, not as Ciphera&rsquo;s sub-processor, and it may be located outside the European Union. Ciphera does not connect any such tool itself, and never sends analytics to an AI provider on its own initiative.
        </p>
        <p className={P}>
          <strong>Data you connect to or import into Pulse.</strong> Pulse can connect to Google Search Console, and can import a website&rsquo;s history from Google Analytics and from other analytics tools the website owner chooses. We process this data as the website owner&rsquo;s processor, like the rest of their Pulse analytics.
        </p>
        <ul className={UL}>
          <li><strong>What we access</strong> &mdash; Read-only access to the sites or properties the website owner selects. We keep only aggregated statistics, such as daily visitors, pages, referrers, countries and devices. Where a tool exports individual page views, we turn them into daily totals as we read the file and discard the rest. We never receive the names, email addresses or IP addresses of the website&rsquo;s visitors.</li>
          <li><strong>How long we keep access</strong> &mdash; For an import, the access the website owner grants, or the API key they give us, is used only while the import runs; it is then revoked where the service allows it, and deleted. A file they upload is read once and deleted. For Search Console, we keep an encrypted token until they disconnect it.</li>
          <li><strong>What we do with it</strong> &mdash; We show it in the website owner&rsquo;s Pulse dashboard, their Pulse API and the tools they connect, and nowhere else. We do not sell or share it or use it for advertising, and our staff do not read it except where security or the law requires it. Deleting an import, a site or an account deletes the imported data.</li>
          <li><strong>Google</strong> &mdash; Pulse&rsquo;s use and transfer of information received from Google APIs adheres to the{' '}
            <a href="https://developers.google.com/terms/api-services-user-data-policy" className={LINK} target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.</li>
        </ul>
        <p className={P}>
          <strong>Legal basis:</strong> Legitimate interest (anonymous website analytics).
        </p>

        {/* 4.5 Captcha */}
        <h3 className={H3}>
          4.4. Ciphera Captcha (Bot Protection)
        </h3>
        <p className={P}>
          Our CAPTCHA service protects Ciphera services from automated abuse. We collect:
        </p>
        <ul className={UL}>
          <li><strong>Challenge responses</strong> — Your interaction with the CAPTCHA challenge, used solely to verify you are human.</li>
          <li><strong>Verification tokens</strong> — Short-lived tokens that confirm successful CAPTCHA completion, automatically expired after use.</li>
          <li><strong>Behavioral insights</strong> — Mouse movement patterns, keystroke timing, scroll behavior, and touch input, collected solely to distinguish automated traffic from human visitors. This data is processed in-memory only, is never written to persistent storage, is automatically discarded within <span className="tabular-nums text-foreground">15 minutes</span>, and is not linked to user accounts.</li>
        </ul>
        <p className={P}>
          Unlike third-party CAPTCHA services, Ciphera Captcha does not track users across pages or websites, does not set persistent cookies, and does not share data with advertising networks.
        </p>
        <p className={P}>
          <strong>Legal basis:</strong> Legitimate interest (abuse prevention, service security).
        </p>

        {/* 4.6 Relay */}
        <h3 className={H3}>
          4.5. Ciphera Relay (Email Infrastructure)
        </h3>
        <p className={P}>
          Relay handles transactional emails (account verification, security notifications, password resets) for Ciphera services. We collect:
        </p>
        <ul className={UL}>
          <li><strong>Recipient email addresses</strong> — Required to deliver transactional emails.</li>
          <li><strong>Delivery metadata</strong> — Delivery status, bounce information, and timestamps for operational monitoring.</li>
        </ul>
        <p className={P}>
          Relay does not send marketing emails, does not track email opens via tracking pixels, and does not share recipient data with third parties. Email content is transmitted over encrypted connections (TLS).
        </p>
        <p className={P}>
          <strong>Legal basis:</strong> Contract performance (transactional communications).
        </p>
      </>
    ),
  },
  {
    id: 'data-we-do-not-collect',
    title: 'Data We Do Not Collect',
    body: (
      <>
        <p className={P}>
          We believe it is equally important to state what we do not do:
        </p>
        <ul className={UL}>
          <li>We do <strong>not</strong> use tracking cookies of any kind</li>
          <li>We do <strong>not</strong> use browser fingerprinting techniques &mdash; no canvas, WebGL, audio, font, or hardware probing, and nothing is stored on your device</li>
          <li>We do <strong>not</strong> track individuals across websites, build cross-site profiles, or retarget</li>
          <li>We do <strong>not</strong> sell, trade, rent, or share your personal data with third parties for advertising or marketing purposes</li>
          <li>We do <strong>not</strong> use third-party analytics services (Google Analytics, Meta Pixel, etc.)</li>
          <li>We do <strong>not</strong> serve advertisements of any kind</li>
          <li>We do <strong>not</strong> build persistent or cross-site profiles &mdash; nothing we hold recognises a visitor for more than one day or follows them to another website</li>
          <li>We do <strong>not</strong> use tracking pixels in emails</li>
          <li>We do <strong>not</strong> collect location data more precise than a city, and we do <strong>not</strong> store the IP address it is derived from</li>
          <li>We do <strong>not</strong> use any social media tracking widgets or embedded content that tracks visitors</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ip-address-policy',
    title: 'IP Address Policy',
    body: (
      <>
        <p className={P}>
          IP addresses are inherently part of internet communications and are temporarily processed by our servers during request handling. Our policy regarding IP addresses is:
        </p>
        <ul className={UL}>
          <li><strong>No IP address storage</strong> — We do not store raw IP addresses in any database. All IP addresses are cryptographically hashed using HMAC-SHA256 before any persistence: for events tied to a signed-in account the hash is salted with a user-specific value, and for pre-authentication events (such as failed logins) it uses a server-side key. The original IP address is irreversibly discarded and cannot be recovered — not by us, not by anyone.</li>
          <li><strong>Temporary processing</strong> — IP addresses may be temporarily held in server memory during active connections for rate limiting and abuse prevention. They are not written to persistent storage in their original form.</li>
          <li><strong>Pulse analytics</strong> — IP addresses are used to make a visitor&rsquo;s one-day identifier and to derive approximate location — country, region and city, unless the site owner has capped the detail or switched it off — then immediately discarded. The IP address itself is never stored.</li>
          <li><strong>Security audit logs</strong> — Security events (logins, password changes, 2FA changes) are logged with a cryptographic hash of the IP address, not the IP itself. This allows detection of patterns (e.g., same device logging in repeatedly) without storing personally identifiable information. Audit logs are retained for up to <span className="tabular-nums text-foreground">180 days</span>, then permanently deleted.</li>
          <li><strong>Server logs</strong> — Operational server logs that may contain IP addresses are access-controlled and retained only as long as necessary for security and operational purposes.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies-and-local-storage',
    title: 'Cookies & Local Storage',
    body: (
      <>
        <p className={P}>
          The Ciphera marketing site (ciphera.net) sets no cookies or browser storage of its own. Our authenticated applications — Ciphera ID (id.ciphera.net), Pulse Analytics (pulse.ciphera.net) and the Discord account link (link.ciphera.net) — use the minimum browser storage needed to keep you signed in, remember your interface preferences, and run features you ask for. Each application now holds its own separate session, so signing out of one does not sign you out of the others:
        </p>
        <LegalTable
          head={['Name', 'Type', 'Purpose', 'Duration']}
          rows={[
            { group: 'Signing in to Ciphera ID (id.ciphera.net)' },
            [storageName('id_access'), 'HTTP-only cookie, id.ciphera.net only', 'Keeps you signed in to the account pages', '15 minutes'],
            [storageName('id_refresh'), 'HTTP-only cookie, id.ciphera.net only', 'Renews that session without re-entering your password', '30 days'],
            [storageName('id_csrf'), 'Cookie (app-readable), id.ciphera.net only', 'Protects against cross-site request forgery', '30 days'],
            [storageName('__Host-ciphera_device'), 'HTTP-only cookie, the sign-in service only (api.id.ciphera.net)', 'Recognises this browser when you sign in, so we email you only when a browser that has not signed in before does, and so you can see and sign out each browser under Devices. A random value, stored only as a keyed hash; it identifies the browser to your own account and nothing else, and is never used for analytics', '400 days, renewed each time it is used'],
            { group: 'Signing in to Pulse Analytics (pulse.ciphera.net)' },
            [storageName('pulse_access'), 'HTTP-only cookie, this site only', 'Keeps you signed in to Pulse', '15 minutes'],
            [storageName('pulse_refresh'), 'HTTP-only cookie, this site only', 'Renews your Pulse session without re-entering your password', '30 days'],
            [storageName('pulse_csrf'), 'HTTP-only cookie, this site only', 'Lets Pulse end your session properly when you sign out', '30 days'],
            [storageName('pulse_team'), 'HTTP-only cookie, this site only', 'Remembers which team you were working in, so Pulse opens it again. It grants nothing: your membership is checked on every request', '400 days'],
            [storageName('pulse_signed_in'), 'Cookie (app-readable), this site only', <>Holds only &ldquo;1&rdquo; while you are signed in, so the pages on this site outside the dashboard can link you to it instead of offering a sign-in</>, '30 days'],
            [storageName('pulse_had_session'), 'Cookie (app-readable), this site only', <>Holds only &ldquo;1&rdquo; once this browser has signed in, and stays after you sign out, so Pulse can tell a signed-out browser from one that never signed in</>, '1 year'],
            [storageName('pulse_theme'), 'Cookie (app-readable), this site only', 'Remembers your colour theme on this device, so the page opens in it before it has loaded. Your account holds the choice', '1 year'],
            { group: 'Linking a Discord account (link.ciphera.net)' },
            [storageName('clink_session'), 'HTTP-only cookie, this site only', 'Holds the short session that carries you through linking your Discord account. Contains an account reference and an expiry, never a Ciphera token', '15 minutes'],
            { group: 'Your profile' },
            [storageName('user'), 'Local / session storage', 'Holds your decrypted name and email so the app can display them (your account on our servers holds neither)', 'Until logout / tab close'],
            { group: <>Interface &amp; login</> },
            [<>Sidebar, dashboard &amp; dismissed-prompt settings</>, 'Local storage', 'Remember your layout and which prompts you have dismissed', 'Persistent'],
            [storageName('oauth_pending:<attempt>'), 'Local storage', 'Secures the login redirect (PKCE), one entry per sign-in attempt', 'Cleared after login, or 10 minutes after an abandoned attempt'],
            [storageName('ciphera_token_refreshed_at'), 'Local storage', 'The time this browser last renewed its session, so your other open tabs pick up the renewal instead of each renewing on their own', 'Until logout'],
            { group: 'Password-protected shared dashboards' },
            [storageName('pulse_share_session'), 'HTTP-only cookie, one dashboard only', 'Remembers that you entered the password for one shared dashboard, so you are not asked again on every page', '1 hour'],
            { group: 'Analytics (on websites that use Pulse)' },
            [storageName('pulse_ignore'), 'Local storage', 'Lets a site owner exclude their own visits', 'Until turned off'],
          ]}
        />
        <p className={P}>
          We do not use advertising cookies or cross-site tracking cookies, and we do not share your data with advertisers. Because we use only storage that is strictly necessary to provide the services you request, no cookie consent banner is required under Article 5(3) of the ePrivacy Directive.
        </p>
      </>
    ),
  },
  {
    id: 'encryption-and-security-measures',
    title: 'Encryption & Security Measures',
    body: (
      <>
        <p className={P}>
          Security is foundational to everything we build. Our technical measures include:
        </p>

        <h3 className={H3}>
          Client-Side Encryption
        </h3>
        <ul className={UL}>
          <li><strong>Algorithm:</strong> AES-256-GCM (authenticated encryption)</li>
          <li><strong>Key generation:</strong> Encryption keys are generated in your browser using the Web Crypto API and are never transmitted to our servers</li>
          <li><strong>Zero-knowledge architecture:</strong> Our servers store only encrypted data. We have no technical capability to decrypt, read, or access the content of your files</li>
        </ul>

        <h3 className={H3}>
          Password Security
        </h3>
        <ul className={UL}>
          <li><strong>Zero-knowledge authentication (OPAQUE):</strong> We use the OPAQUE protocol (RFC 9807), an asymmetric password-authenticated key exchange. Your password is stretched on your device with Argon2id and is never transmitted to our servers. Signing in proves knowledge of your password cryptographically, without sending it.</li>
          <li><strong>What we store:</strong> Only an OPAQUE credential record that cannot be reversed into your password. We hold no password, no password hash, and no password-equivalent verifier.</li>
          <li><strong>No password reset:</strong> Because we never hold your password, we cannot reset it. Account recovery uses the 24-word recovery phrase shown when you create your account; it enrols a second identity that we cannot read, so the phrase can open your account and nothing else can — not an email link, and not us. Accounts created before 7 September 2026 set up recovery from Security settings, which needs the current password. If you lose your password and have no recovery phrase enrolled, your account data cannot be recovered — by us or anyone else.</li>
        </ul>

        <h3 className={H3}>
          Account Data Encryption
        </h3>
        <ul className={UL}>
          <li><strong>Stored in your vault, not on our servers:</strong> Your email address and display name are never stored on our servers in readable form. They live only inside your account vault, which is encrypted on your device under a key we never hold. Two-factor authentication secrets, which our servers need in order to verify your codes, are encrypted at rest using AES-256-GCM.</li>
          <li><strong>Blind-index lookups:</strong> To find your account at sign-in, we use a blind index — an irreversible keyed hash of your email, computed on your device and hashed again on our servers. Your email is never stored in readable form.</li>
          <li><strong>What a database breach would expose:</strong> Only encrypted vaults, keyed hashes, and your OPAQUE credential record — no plaintext email or display name, no password, and nothing that can be reversed into them.</li>
        </ul>

        <h3 className={H3}>
          Transport Security
        </h3>
        <ul className={UL}>
          <li><strong>TLS encryption:</strong> All connections to our services are encrypted in transit using TLS</li>
          <li><strong>HSTS:</strong> HTTP Strict Transport Security is enforced with a minimum 1-year max-age</li>
          <li><strong>Security headers:</strong> X-Content-Type-Options, X-Frame-Options (DENY), Referrer-Policy (strict-origin-when-cross-origin), and Content Security Policy are enforced on all pages</li>
        </ul>

        <h3 className={H3}>
          Infrastructure Security
        </h3>
        <ul className={UL}>
          <li>Your account data and files are protected by client-side encryption, so they remain unreadable to us regardless of the underlying storage</li>
          <li>Access to production systems requires multi-factor authentication</li>
          <li>We follow the principle of least privilege for all internal access</li>
          <li>Regular security reviews and dependency audits are performed</li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-storage-and-retention',
    title: 'Data Storage & Retention',
    body: (
      <>
        <h3 className={H3}>
          Storage Location
        </h3>
        <p className={P}>
          All primary data is stored on servers located in <strong>Switzerland</strong>, subject to the Swiss Federal Act on Data Protection (FADP). Switzerland has been recognized by the European Commission as providing an adequate level of data protection (adequacy decision under GDPR Article 45).
        </p>

        <h3 className={H3}>
          Retention Periods
        </h3>
        <p className={P}>
          We retain data only as long as necessary for the purpose it was collected:
        </p>
        <LegalTable
          head={['Data Type', 'Retention Period', 'Basis']}
          rows={[
            ['Account data', 'While the account is active; deleted immediately and irreversibly on a verified deletion request', 'Contract'],
            ['Session data', <>Until logout or <span className="tabular-nums text-foreground">30 days</span> (refresh token expiry)</>, 'Contract'],
            ['Analytics data (Pulse)', 'Aggregated indefinitely (no personal data)', 'Legitimate interest'],
            ['Contact form messages', 'Not stored — forwarded to our team inbox', 'Consent'],
            ['Newsletter subscriptions', 'Until unsubscribe', 'Consent'],
            ['Security audit logs (hashed IPs only)', <>Up to <span className="tabular-nums text-foreground">180 days</span>, then permanently deleted</>, 'Legitimate interest'],
            ['Server logs', 'Retained only as long as necessary for security and operational purposes', 'Legitimate interest'],
            ['CAPTCHA verification tokens', 'Expired immediately after use', 'Legitimate interest'],
            ['Email delivery metadata (Relay)', '30 days', 'Contract'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'legal-bases-for-processing',
    title: 'Legal Bases for Processing',
    body: (
      <>
        <p className={P}>
          Under GDPR Article 6, we process personal data on the following legal bases:
        </p>
        <ul className={UL}>
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
      </>
    ),
  },
  {
    id: 'third-party-services-and-data-processors',
    title: 'Third-Party Services & Data Processors',
    body: (
      <>
        <p className={P}>
          We minimize our reliance on third-party services. The services we use, and the data they may process, are listed below:
        </p>
        <LegalTable
          caption="Subprocessors — service, purpose, data processed, and location"
          head={['Service', 'Purpose', 'Data Processed', 'Location']}
          rows={subprocessors.map((s) => [s.service, s.purpose, s.dataProcessed, s.location])}
        />
        <p className={P}>
          All third-party processors are bound by Data Processing Agreements (DPAs) and are contractually required to process data only for the specified purpose. A complete list of sub-processor identities, including specific company names and registered addresses, is available upon request at{' '}
          <a href="mailto:privacy@ciphera.net" className={LINK}>privacy@ciphera.net</a>. We do not use:
        </p>
        <ul className={UL}>
          {weDoNotUse.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'international-data-transfers',
    title: 'International Data Transfers',
    body: (
      <>
        <p className={P}>
          Your data is primarily stored in Switzerland, which benefits from an EU adequacy decision. In limited cases, data may be processed in other jurisdictions:
        </p>
        <ul className={UL}>
          <li><strong>CDN/DNS services</strong> — Your requests may be routed through global edge servers for performance and DDoS protection. Only transient connection data (IP addresses) passes through these servers.</li>
          <li><strong>GitHub</strong> — Public source code hosted in the United States. No personal user data is stored on GitHub.</li>
        </ul>
        <p className={P}>
          Where personal data is transferred outside the EEA or Switzerland, we ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) as approved by the European Commission under GDPR Article 46(2)(c), or transfers to countries with an adequacy decision under GDPR Article 45.
        </p>
      </>
    ),
  },
  {
    id: 'open-source-and-transparency',
    title: 'Open Source & Transparency',
    body: (
      <>
        <p className={P}>
          We believe transparency is essential to trust. The following are open source, allowing independent verification of our privacy claims:
        </p>
        <ul className={UL}>
          <li><strong>Pulse Analytics</strong> — Our privacy-first analytics platform is open source (AGPL-3.0), enabling independent audit of our analytics approach.</li>
          <li><strong>This website</strong> — The source code for this website is publicly available.</li>
        </ul>
        <p className={P}>
          Our open-source repositories are available at{' '}
          <a href="https://github.com/ciphera-net" className={LINK} target="_blank" rel="noopener noreferrer">github.com/ciphera-net</a>.
        </p>
      </>
    ),
  },
  {
    id: 'data-disclosure-and-law-enforcement',
    title: 'Data Disclosure & Law Enforcement',
    body: (
      <>
        <p className={P}>
          We will only disclose user data if legally compelled to do so by a valid and binding request from competent Belgian or Swiss authorities, in full compliance with applicable law.
        </p>
        <p className={P}>
          Our disclosure policy:
        </p>
        <ul className={UL}>
          <li><strong>Challenge first:</strong> We will challenge any request that we believe is overbroad, legally insufficient, or not in the public interest.</li>
          <li><strong>Minimum disclosure:</strong> If legally required to comply, we will disclose only the minimum data necessary to satisfy the specific request.</li>
          <li><strong>Encrypted data limitation:</strong> Due to our zero-knowledge architecture, we cannot decrypt or provide access to the contents of encrypted files, even under legal compulsion. We can only provide metadata and encrypted data.</li>
          <li><strong>User notification:</strong> Where legally permitted, we will notify affected users of data requests.</li>
          <li><strong>No voluntary disclosure:</strong> We do not voluntarily share user data with any government, intelligence agency, or law enforcement body.</li>
        </ul>
        <p className={P}>
          We do not comply with requests from foreign authorities unless they are processed through appropriate international legal assistance channels recognized by Belgian or Swiss law.
        </p>
      </>
    ),
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    body: (
      <>
        <p className={P}>
          Our services are not directed at children under the age of 16. We do not knowingly collect personal data from children under 16. If you are a parent or guardian and believe your child has provided us with personal data, please contact us at{' '}
          <a href="mailto:privacy@ciphera.net" className={LINK}>privacy@ciphera.net</a>{' '}
          and we will promptly delete the data.
        </p>
      </>
    ),
  },
  {
    id: 'automated-decision-making',
    title: 'Automated Decision-Making',
    body: (
      <>
        <p className={P}>
          We do not engage in automated decision-making or profiling that produces legal effects or similarly significantly affects you, as defined under GDPR Article 22. Our automated systems are limited to:
        </p>
        <ul className={UL}>
          <li><strong>Rate limiting</strong> — Automated throttling of excessive requests to protect service availability.</li>
          <li><strong>CAPTCHA challenges</strong> — Automated bot detection during registration and certain interactions.</li>
          <li><strong>File expiration</strong> — Automated deletion of files after user-configured expiration periods.</li>
        </ul>
        <p className={P}>
          None of these automated processes result in decisions that produce legal effects or significantly affect any individual.
        </p>
      </>
    ),
  },
  {
    id: 'data-breach-notification',
    title: 'Data Breach Notification',
    body: (
      <>
        <p className={P}>
          In the event of a personal data breach, we will:
        </p>
        <ul className={UL}>
          <li>Notify the Belgian Data Protection Authority (Autorité de protection des données / Gegevensbeschermingsautoriteit) within <span className="tabular-nums text-foreground">72 hours</span> of becoming aware of the breach, as required by GDPR Article 33.</li>
          <li>Notify affected users without undue delay if the breach is likely to result in a high risk to their rights and freedoms, as required by GDPR Article 34.</li>
          <li>Document the breach, its effects, and the remedial actions taken.</li>
        </ul>
        <p className={P}>
          Due to our zero-knowledge architecture, a breach of our servers would not expose the content of encrypted files, as we do not possess the decryption keys.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights-under-gdpr-and-fadp',
    title: 'Your Rights Under GDPR & FADP',
    body: (
      <>
        <p className={P}>
          Under the EU General Data Protection Regulation and the Swiss Federal Act on Data Protection, you have the following rights regarding your personal data:
        </p>
        <ul className={UL}>
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
            <a href="https://www.dataprotectionauthority.be" className={LINK} target="_blank" rel="noopener noreferrer">www.dataprotectionauthority.be</a>.
          </li>
        </ul>
        <p className={P}>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:privacy@ciphera.net" className={LINK}>privacy@ciphera.net</a>.
          We will respond to verified requests within <span className="tabular-nums text-foreground">30 days</span>, as required by law. We may ask you to verify your identity before processing your request.
        </p>
      </>
    ),
  },
  {
    id: 'social-media-and-external-links',
    title: 'Social Media & External Links',
    body: (
      <>
        <p className={P}>
          Our website and blog may contain links to external websites, including our GitHub repositories and social media profiles. We do not embed social media tracking widgets on our website. When you follow a link to an external site, you leave our services, and the external site&apos;s privacy policy governs your interaction with that site. We are not responsible for the privacy practices of external websites.
        </p>
      </>
    ),
  },
  {
    id: 'changes-to-this-policy',
    title: 'Changes to This Policy',
    body: (
      <>
        <p className={P}>
          We may update this privacy policy from time to time to reflect changes in our services, legal requirements, or best practices. When we make changes:
        </p>
        <ul className={UL}>
          <li>The &ldquo;Last updated&rdquo; date at the top of this page will be revised.</li>
          <li>For material changes that affect your rights, we will provide prominent notice (such as a banner on our website or an email notification to account holders).</li>
          <li>Previous versions of this policy will be archived and available upon request.</li>
        </ul>
        <p className={P}>
          We encourage you to review this policy periodically. Your continued use of our services after changes are posted constitutes acceptance of the updated policy. The English version of this policy prevails in case of any discrepancy with translations.
        </p>
      </>
    ),
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    body: (
      <>
        <p className={P}>
          If you have any questions about this privacy policy, our data practices, or wish to exercise your rights, you can reach us through:
        </p>
        <ul className={UL}>
          <li>
            <strong>Privacy inquiries:</strong>{' '}
            <a href="mailto:privacy@ciphera.net" className={LINK}>privacy@ciphera.net</a>
          </li>
          <li>
            <strong>Security concerns:</strong>{' '}
            <a href="mailto:security@ciphera.net" className={LINK}>security@ciphera.net</a>
          </li>
          <li>
            <strong>General inquiries:</strong>{' '}
            <a href="mailto:hello@ciphera.net" className={LINK}>hello@ciphera.net</a>
          </li>
          <li>
            <strong>Phone:</strong>{' '}
            <a href="tel:+3278480710" className={LINK}>+32 78 48 07 10</a>
          </li>
          <li>
            <strong>Address:</strong>{' '}
            Ciphera, De Kleetlaan 2, 1831 Diegem, Belgium
          </li>
        </ul>
        <p className={P}>
          We aim to respond to all inquiries within <span className="tabular-nums text-foreground">5 business days</span>, and to formal data rights requests within <span className="tabular-nums text-foreground">30 days</span>.
        </p>
      </>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      <PageOpeningC title="Privacy Policy" lead={PRIVACY.LEAD}>
        <p className="mt-8 text-sm tabular-nums text-muted-foreground">
          Last updated: <time dateTime="2026-10-28">28-10-2026</time>
        </p>
      </PageOpeningC>
      <LegalSections sections={SECTIONS} summaries={PRIVACY.SUMMARIES} next={{ href: '/terms', label: 'Terms of Service' }} />
    </>
  )
}
