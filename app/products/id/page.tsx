import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { AuthMockup } from '@/components/ui/auth-mockup'
import { authIcon, authShowcaseBg, zurichPhoto } from '@/lib/images'
import { cdnUrl } from '@/lib/cdn'
import {
  ArrowRightIcon,
  CheckIcon,
  GlobeIcon,
  LockIcon,
  XIcon,
} from '@ciphera-net/facet'
import { ShieldCheck, Fingerprint, Key, Timer } from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: 'Ciphera ID - Secure Identity Provider',
  description:
    'Enterprise-grade authentication with zero-knowledge password authentication (OPAQUE), passkeys, 2FA, and OAuth 2.0 with PKCE. The identity layer behind Ciphera.',
  alternates: {
    canonical: 'https://ciphera.net/products/id',
  },
  openGraph: {
    title: 'Ciphera ID - Secure Identity Provider',
    description:
      'Enterprise-grade authentication with zero-knowledge password authentication (OPAQUE), passkeys, 2FA, and OAuth 2.0 with PKCE.',
    url: 'https://ciphera.net/products/id',
    siteName: 'Ciphera',
    images: [
      {
        url: cdnUrl('/id_icon_no_margins.png'),
        width: 512,
        height: 512,
        alt: 'Ciphera ID - Secure Identity Provider',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ciphera ID - Secure Identity Provider',
    description:
      'Enterprise-grade authentication with zero-knowledge password authentication (OPAQUE), passkeys, and OAuth 2.0 with PKCE.',
    images: [cdnUrl('/id_icon_no_margins.png')],
  },
}

const idSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ciphera ID',
    description:
      'Enterprise-grade authentication with OAuth2, JWT, and zero-knowledge principles. Secure identity management with zero-knowledge OPAQUE password authentication and two-factor authentication.',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    url: 'https://ciphera.net/products/id',
    provider: {
      '@type': 'Organization',
      name: 'Ciphera',
      url: 'https://ciphera.net',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ciphera.net',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://ciphera.net/products',
      },
      { '@type': 'ListItem', position: 3, name: 'Ciphera ID' },
    ],
  },
]

const ID_FEATURES = [
  {
    icon: Key,
    title: 'One account, all services',
    body: 'Log in once and reach every Ciphera service via OAuth 2.0 with mandatory PKCE (S256), short-lived access tokens with refresh rotation, and revoked-token reuse detection.',
  },
  {
    icon: ShieldCheck,
    title: 'Security visibility',
    body: 'A full audit log of every login, password change, and 2FA event. Revoke any session remotely, get new-device alerts, and keep IPs HMAC-hashed — never stored raw.',
  },
] as const

export default function CipheraIDPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(idSchema) }}
      />

      {/* ─── Hero — A7 full-bleed ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src={authShowcaseBg}
          alt=""
          fill
          unoptimized
          priority
          sizes="100vw"
          className="object-cover grayscale brightness-[0.4]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45"
        />
        <div className="relative px-6 py-24 sm:py-32">
          <p className="font-mono text-xs text-muted-foreground">01 · Authentication</p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            One identity.<br />Complete privacy.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The identity layer behind every Ciphera service. Zero-knowledge
            password authentication, passkeys, two-factor authentication,
            and OAuth 2.0 — all on Swiss infrastructure.
          </p>
          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-2 text-foreground">
              <LockIcon aria-hidden="true" className="h-3.5 w-3.5" />
              Zero-knowledge
            </span>
            <span aria-hidden="true" className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2">
              <Fingerprint aria-hidden="true" className="h-3.5 w-3.5" />
              Passkeys
            </span>
            <span aria-hidden="true" className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
              2FA + recovery codes
            </span>
            <span aria-hidden="true" className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2">
              <Key aria-hidden="true" className="h-3.5 w-3.5" />
              OAuth 2.0 + PKCE
            </span>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href="/contact" className="btn-primary">
              Contact Sales
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 01 · Authentication — Zero-knowledge auth ───────────────── */}
      <section id="zero-knowledge-auth" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Copy cell */}
          <div className="min-w-0 flex flex-col justify-center px-6 py-16 sm:py-24 lg:pr-14">
            <p className="font-mono text-xs text-muted-foreground">01 · Authentication</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Your password never leaves your device.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              With OPAQUE (RFC 9807), your password is stretched on your
              device with Argon2id and proven to our servers without ever
              being sent. We store only an opaque credential record that
              can&apos;t be reversed into your password — so even a full
              database breach gives attackers nothing usable.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'OPAQUE (RFC 9807) — your password is never sent to our servers',
                'On-device Argon2id key stretching',
                'We store only an opaque credential record — no password, hash, or verifier',
                'No password reset: recovery uses your 24-word phrase, which we never hold',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual cell — flat, fluid, no fixed width */}
          <div className="relative min-h-[400px] min-w-0 overflow-hidden border-t border-border lg:border-l lg:border-t-0 flex items-center justify-center px-6 py-12 bg-card">
            <div className="w-full max-w-md min-w-0">
              <div className="border border-border bg-background p-6 space-y-4">
                {/* Step 1: Your device */}
                <div className="border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="font-mono text-xs text-muted-foreground">Your device</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border border-border bg-background px-3 py-2">
                      <p className="font-mono text-[10px] text-muted-foreground mb-0.5">Your password</p>
                      <p className="text-sm text-foreground tracking-widest">••••••••••</p>
                    </div>
                    <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 border border-primary/30 bg-primary/5 px-3 py-2">
                      <p className="font-mono text-[10px] text-primary/70 mb-0.5">Scrambled</p>
                      <p className="font-mono text-[11px] text-primary truncate">a7f3c8e1b9d2...</p>
                    </div>
                  </div>
                </div>

                {/* Transit indicator */}
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <div className="flex items-center gap-1.5 border border-border bg-background px-3 py-1">
                    <svg className="w-3 h-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span className="font-mono text-[10px] text-muted-foreground">Encrypted in transit</span>
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Step 2: Our server */}
                <div className="border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" /></svg>
                    <span className="font-mono text-xs text-muted-foreground">Our server</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border border-primary/30 bg-primary/5 px-3 py-2">
                      <p className="font-mono text-[10px] text-primary/70 mb-0.5">Received</p>
                      <p className="font-mono text-[11px] text-primary truncate">a7f3c8e1b9d2...</p>
                    </div>
                    <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 border border-border bg-background px-3 py-2">
                      <p className="font-mono text-[10px] text-muted-foreground mb-0.5">Opaque record</p>
                      <p className="font-mono text-[11px] text-muted-foreground truncate">9f2c4e8a…b1d7</p>
                    </div>
                  </div>
                </div>

                {/* Storage row */}
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <div className="flex items-center gap-1.5 border border-border bg-background px-3 py-1">
                    <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    <span className="font-mono text-[10px] text-muted-foreground">Stored in database</span>
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Database */}
                <div className="border border-border bg-background px-4 py-3 text-center">
                  <p className="font-mono text-[11px] text-muted-foreground truncate">opaque credential · 9f2c4e8a…b1d7</p>
                  <p className="font-mono text-[9px] text-muted-foreground/60 mt-1">Unreadable — even to us</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 02 · SSO — Passkeys & 2FA ───────────────────────────────── */}
      <section id="passkeys" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Visual cell — left on desktop */}
          <div className="relative min-h-[400px] order-last border-t border-border lg:order-first lg:border-r lg:border-t-0 flex items-center justify-center px-6 py-12 bg-card mockup-cell">
            <div className="w-full max-w-md">
              <AuthMockup />
            </div>
          </div>

          {/* Copy cell */}
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pl-14">
            <p className="font-mono text-xs text-muted-foreground">02 · SSO</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Passwords optional. Security mandatory.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Sign in with passkeys (FIDO2/WebAuthn) using your
              fingerprint, face, or hardware security key — no password
              needed. For password-based logins, add TOTP two-factor
              authentication with recovery codes as a safety net.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Passkeys via WebAuthn — phishing-resistant by design',
                'TOTP 2FA with any authenticator app',
                '8 single-use recovery codes for account access',
                'Escalating lockout (15 min → 1 hour → 24 hours)',
                'CAPTCHA after 3 failed attempts',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── 03 · Features — everything in Ciphera ID ────────────────── */}
      <section id="features" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="font-mono text-xs text-muted-foreground">03 · Features</p>
          <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Everything in Ciphera ID.
          </h2>
          <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2">
            {ID_FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col bg-background p-8">
                <Icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 04 · Swiss privacy — photo left, copy right ─────────────── */}
      <section id="privacy" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Photo cell */}
          <div className="relative min-h-[400px] border-b border-border lg:border-b-0 lg:border-r">
            <Image
              src={zurichPhoto}
              alt="Zurich, Switzerland — where Ciphera data is hosted"
              fill
              unoptimized
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover grayscale"
            />
            {/* Flat info items overlaid at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              {[
                { icon: GlobeIcon, title: 'Data residency', desc: 'Switzerland (FADP protected)' },
                { icon: Timer, title: 'Token lifetime', desc: '15 min access, 30 day refresh' },
                { icon: ShieldCheck, title: 'Compliance', desc: 'GDPR, FADP, privacy by design' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 border border-border bg-card px-4 py-3"
                >
                  <item.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{item.title}</p>
                    <p className="mt-1 font-mono text-sm tabular-nums text-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Copy cell */}
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pl-14">
            <p className="font-mono text-xs text-muted-foreground">04 · Swiss privacy</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Swiss infrastructure. Swiss privacy laws.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              All identity data is stored on Swiss infrastructure,
              protected by the Swiss Federal Act on Data Protection (FADP).
              Passwords use zero-knowledge OPAQUE auth, IPs are HMAC-hashed,
              and audit logs are batched asynchronously — privacy at every layer.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Self-hosted — no third-party vendor has your user data',
                'IP addresses HMAC-hashed before storage',
                'Minimal metadata: no behavioral tracking',
                'Automatic token cleanup and session expiration',
                'Security alerts rate-limited to 1 per hour per user',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── 05 · Compare ────────────────────────────────────────────── */}
      <section id="comparison" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="font-mono text-xs text-muted-foreground">05 · Compare</p>
          <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            How Ciphera ID compares.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Most auth providers are SaaS platforms that store your users&apos;
            credentials on their infrastructure. Ciphera ID is different.
          </p>

          <div className="mt-14 grid gap-px bg-border md:grid-cols-2 max-w-4xl">
            {/* Ciphera ID card */}
            <div className="bg-background p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
                  <Image
                    src={authIcon}
                    alt="Ciphera ID"
                    width={24}
                    height={24}
                    unoptimized
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground">Ciphera ID</h3>
                  <p className="font-mono text-xs text-primary">Self-hosted identity provider</p>
                </div>
              </div>
              <ul className="space-y-1">
                {[
                  'Zero-knowledge password auth (OPAQUE, RFC 9807)',
                  'Self-hosted on Swiss infrastructure',
                  'Passkeys (FIDO2/WebAuthn)',
                  'Mandatory PKCE (S256 only)',
                  'Stateless token verification',
                  'HMAC-hashed device fingerprints',
                  'Escalating account lockout',
                  'Argon2id key stretching (client-side)',
                  'Built-in organization management',
                ].map((item) => (
                  <li key={item} className="group -mx-4 flex items-center gap-3 px-4 py-2 text-foreground transition-colors hover:bg-card">
                    <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-foreground" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SaaS providers card */}
            <div className="bg-background p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
                  <Key aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground">SaaS Auth Providers</h3>
                  <p className="font-mono text-xs text-muted-foreground">Auth0, Clerk, Firebase Auth</p>
                </div>
              </div>
              <ul className="space-y-1">
                {[
                  { feature: 'Single-hashed passwords (bcrypt/scrypt)', has: false },
                  { feature: 'Cloud-hosted (US infrastructure)', has: false },
                  { feature: 'Passkeys support', has: true },
                  { feature: 'PKCE optional', has: false },
                  { feature: 'Network call for token validation', has: false },
                  { feature: 'Raw IP logging', has: false },
                  { feature: 'Fixed-duration lockout', has: false },
                  { feature: 'Unbounded hash concurrency', has: false },
                  { feature: 'Organization management via extensions', has: false },
                ].map((item) => (
                  <li
                    key={item.feature}
                    className={`group -mx-4 flex items-center gap-3 px-4 py-2 transition-colors hover:bg-card ${item.has ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {item.has ? (
                      <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <XIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="text-sm">{item.feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 06 · Get started — A7 full-bleed CTA ────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src={authShowcaseBg}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover grayscale brightness-[0.4]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45"
        />
        <div className="relative px-6 py-24 sm:py-32">
          <p className="font-mono text-xs text-muted-foreground">06 · Get started</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Interested in Ciphera ID?
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Ciphera ID is currently an internal service powering the
            Ciphera ecosystem. Reach out if you&apos;re interested in
            the technology for your platform.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/contact" className="btn-primary">
              Contact Us
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/about" className="btn-secondary">
              About Ciphera
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
