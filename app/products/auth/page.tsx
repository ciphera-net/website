import { Metadata } from 'next'
import Link from 'next/link'
import { AuthMockup } from '@/components/ui/auth-mockup'
import { OAuthAppsMockup } from '@/components/ui/oauth-apps-mockup'
import { SecurityDashboardMockup } from '@/components/ui/security-dashboard-mockup'
import { authIcon, authShowcaseBg, zurichPhoto } from '@/lib/images'
import {
  Lock,
  ShieldCheck,
  Fingerprint,
  Key,
  Globe,
  ArrowRight,
  Check,
  X,
  Timer,
} from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Ciphera Auth - Secure Identity Provider',
  description:
    'Enterprise-grade authentication with double-hashed passwords (PBKDF2 + Argon2id), passkeys, 2FA, and OAuth 2.0 with PKCE. The identity layer behind Ciphera.',
  alternates: {
    canonical: 'https://ciphera.net/products/auth',
  },
  openGraph: {
    title: 'Ciphera Auth - Secure Identity Provider',
    description:
      'Enterprise-grade authentication with double-hashed passwords (PBKDF2 + Argon2id), passkeys, 2FA, and OAuth 2.0 with PKCE.',
    url: 'https://ciphera.net/products/auth',
    siteName: 'Ciphera',
    images: [
      {
        url: '/auth_icon_no_margins.png',
        width: 512,
        height: 512,
        alt: 'Ciphera Auth - Secure Identity Provider',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ciphera Auth - Secure Identity Provider',
    description:
      'Enterprise-grade authentication with double-hashed passwords, passkeys, and OAuth 2.0 with PKCE.',
    images: ['/auth_icon_no_margins.png'],
  },
}

const authSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ciphera Auth',
    description:
      'Enterprise-grade authentication with OAuth2, JWT, and zero-knowledge principles. Secure identity management with double-hashed passwords and two-factor authentication.',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    url: 'https://ciphera.net/products/auth',
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
      { '@type': 'ListItem', position: 3, name: 'Ciphera Auth' },
    ],
  },
]

export default function CipheraAuthPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authSchema) }}
      />

      {/* Hero */}
      <section className="relative -mt-[88px] min-h-screen flex items-center pt-[88px] pb-20 lg:pb-32 bg-neutral-950 overflow-hidden">
        <img
          src={authShowcaseBg.src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-neutral-950 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
              One identity. Complete privacy.
            </h1>

            <p className="text-xl text-neutral-300 mb-10 leading-relaxed max-w-xl">
              The identity layer behind every Ciphera service. Double-hashed
              passwords, passkeys, two-factor authentication, and OAuth 2.0
              — all on Swiss infrastructure.
            </p>

            <div className="flex flex-row gap-3 flex-wrap mb-12">
              <Button
                size="lg"
                className="gap-2 bg-brand-orange-button hover:bg-brand-orange-button-hover text-white"
                asChild
              >
                <Link href="/contact">
                  Contact Sales <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="gap-2 text-neutral-300 hover:text-white"
                asChild
              >
                <Link href="/about">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-400">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-orange" />
                Double-hashed
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-brand-orange" />
                Passkeys
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                2FA + recovery codes
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <Key className="w-4 h-4 text-brand-orange" />
                OAuth 2.0 + PKCE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature blocks */}
      <section className="py-20 lg:py-32 bg-neutral-950 space-y-28">
        {/* Double Hashing — text left, diagram right */}
        <div id="double-hashing" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Your password never leaves your device.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Your raw password is transformed in your browser before
                it&apos;s sent anywhere. Even if someone intercepts the
                connection, they don&apos;t get your actual password. On
                our end, we hash it again — so even a full database breach
                gives attackers nothing usable.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Client-side PBKDF2-SHA256 with email as salt',
                  'Server-side Argon2id (64 MiB memory, 3 iterations)',
                  'Constant-time comparison prevents timing attacks',
                  'Hash pool limits concurrent operations to prevent DoS',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-neutral-400"
                  >
                    <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={authShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-6 w-full shadow-2xl space-y-4">
                      {/* Step 1: Your device */}
                      <div className="rounded-lg border border-white/[0.08] bg-neutral-900 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-4 h-4 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <span className="text-xs font-medium text-white">Your device</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-lg bg-neutral-800 px-3 py-2">
                            <p className="text-[10px] text-neutral-500 mb-0.5">Your password</p>
                            <p className="text-sm text-white tracking-widest">••••••••••</p>
                          </div>
                          <svg className="w-4 h-4 text-brand-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                          <div className="flex-1 rounded-lg bg-brand-orange/10 border border-brand-orange/20 px-3 py-2">
                            <p className="text-[10px] text-brand-orange/70 mb-0.5">Scrambled</p>
                            <p className="text-[11px] text-brand-orange font-mono truncate">a7f3c8e1b9d2...</p>
                          </div>
                        </div>
                      </div>

                      {/* Arrow down */}
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-px flex-1 bg-neutral-800" />
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700">
                          <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          <span className="text-[10px] text-neutral-400">Encrypted in transit</span>
                        </div>
                        <div className="h-px flex-1 bg-neutral-800" />
                      </div>

                      {/* Step 2: Our server */}
                      <div className="rounded-lg border border-white/[0.08] bg-neutral-900 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" /></svg>
                          <span className="text-xs font-medium text-white">Our server</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-lg bg-brand-orange/10 border border-brand-orange/20 px-3 py-2">
                            <p className="text-[10px] text-brand-orange/70 mb-0.5">Received</p>
                            <p className="text-[11px] text-brand-orange font-mono truncate">a7f3c8e1b9d2...</p>
                          </div>
                          <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                          <div className="flex-1 rounded-lg bg-neutral-800 px-3 py-2">
                            <p className="text-[10px] text-neutral-500 mb-0.5">Scrambled again</p>
                            <p className="text-[11px] text-neutral-400 font-mono truncate">$argon2id$v=19...</p>
                          </div>
                        </div>
                      </div>

                      {/* Arrow down */}
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-px flex-1 bg-neutral-800" />
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700">
                          <svg className="w-3 h-3 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                          <span className="text-[10px] text-neutral-400">Stored in database</span>
                        </div>
                        <div className="h-px flex-1 bg-neutral-800" />
                      </div>

                      {/* Database */}
                      <div className="rounded-lg bg-neutral-800/50 border border-neutral-700/50 px-4 py-3 text-center">
                        <p className="text-[11px] text-neutral-500 font-mono truncate">$argon2id$v=19$m=65536,t=3,p=2$kR7x...</p>
                        <p className="text-[9px] text-neutral-600 mt-1">Unreadable — even to us</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Passkeys & 2FA — mockup left, text right */}
        <div id="passkeys" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={authShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <AuthMockup />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Passwords optional. Security mandatory.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Sign in with passkeys (FIDO2/WebAuthn) using your
                fingerprint, face, or hardware security key — no password
                needed. For password-based logins, add TOTP two-factor
                authentication with recovery codes as a safety net.
              </p>
              <ul className="space-y-3">
                {[
                  'Passkeys via WebAuthn — phishing-resistant by design',
                  'TOTP 2FA with any authenticator app',
                  '8 single-use recovery codes for account access',
                  'Escalating lockout (15 min → 1 hour → 24 hours)',
                  'CAPTCHA after 3 failed attempts',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-neutral-400"
                  >
                    <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* One Account — text left, mockup right */}
        <div id="oauth" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                One account, all services.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Log in once and access every Ciphera service — Drop, Pulse,
                and more. Built on OAuth 2.0 with mandatory PKCE, so
                authorization codes can&apos;t be intercepted. Tokens are
                verified locally by each service using a shared secret — no
                network roundtrip needed.
              </p>
              <ul className="space-y-3">
                {[
                  'OAuth 2.0 Authorization Code flow with PKCE',
                  'S256 challenge method enforced (no plaintext)',
                  'Short-lived access tokens (15 min) + refresh rotation',
                  'Reuse detection: if a revoked token is reused, all sessions are invalidated',
                  'CSRF protection via double submit cookie pattern',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-neutral-400"
                  >
                    <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={authShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <OAuthAppsMockup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Dashboard — mockup left, text right */}
        <div id="security" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={authShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <SecurityDashboardMockup />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Full visibility into your account.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Every login, every password change, every 2FA event — logged
                and visible. See which devices have access, revoke sessions
                you don&apos;t recognize, and get alerts when a new device
                signs in. Device fingerprints are HMAC-hashed — we track
                activity without storing raw IPs.
              </p>
              <ul className="space-y-3">
                {[
                  'Comprehensive audit log with event details',
                  'Trusted device management with browser/OS detection',
                  'New device alerts via email',
                  'Session revocation — sign out any device remotely',
                  'Privacy-respecting: IPs hashed with HMAC-SHA256',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-neutral-400"
                  >
                    <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison — side by side cards */}
      <section id="comparison" className="py-20 lg:py-32 bg-neutral-950 border-t border-white/[0.04] scroll-mt-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              How Ciphera Auth compares.
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Most auth providers are SaaS platforms that store your users&apos;
              credentials on their infrastructure. Ciphera Auth is different.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Auth card — highlighted */}
            <div className="rounded-xl border border-brand-orange/20 bg-neutral-900/80 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-orange" />
              <div className="flex items-center gap-3 mb-8">
                <img
                  src={authIcon.src}
                  alt="Ciphera Auth"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">Ciphera Auth</h3>
                  <p className="text-xs text-brand-orange">Self-hosted identity provider</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  'Double-hashed passwords (PBKDF2 + Argon2id)',
                  'Self-hosted on Swiss infrastructure',
                  'Passkeys (FIDO2/WebAuthn)',
                  'Mandatory PKCE (S256 only)',
                  'Stateless token verification',
                  'HMAC-hashed device fingerprints',
                  'Escalating account lockout',
                  'Hash pool concurrency limits',
                  'Built-in organization management',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-neutral-300"
                  >
                    <Check className="w-5 h-5 text-brand-orange shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SaaS providers card — muted */}
            <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                  <Key className="w-5 h-5 text-neutral-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">SaaS Auth Providers</h3>
                  <p className="text-xs text-neutral-500">Auth0, Clerk, Firebase Auth</p>
                </div>
              </div>
              <ul className="space-y-4">
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
                    className={`flex items-center gap-3 ${item.has ? 'text-neutral-400' : 'text-neutral-500'}`}
                  >
                    {item.has ? (
                      <Check className="w-5 h-5 text-neutral-500 shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-neutral-600 shrink-0" />
                    )}
                    <span className="text-sm">{item.feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Swiss Privacy — photo left, text right */}
      <section id="privacy" className="py-20 lg:py-32 bg-neutral-950 scroll-mt-28">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08]">
                  <img
                    src={zurichPhoto.src}
                    alt="Zurich, Switzerland"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2.5">
                    {[
                      { icon: Globe, title: 'Data residency', desc: 'Switzerland (FADP protected)' },
                      { icon: Timer, title: 'Token lifetime', desc: '15 min access, 30 day refresh' },
                      { icon: ShieldCheck, title: 'Compliance', desc: 'GDPR, FADP, privacy by design' },
                    ].map((item) => (
                      <div key={item.title} className="flex items-center gap-3 rounded-xl bg-neutral-900/80 border border-white/[0.08] px-4 py-3 backdrop-blur-sm">
                        <item.icon className="w-5 h-5 text-brand-orange shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-white">{item.title}</p>
                          <p className="text-[11px] text-neutral-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Swiss infrastructure. Swiss privacy laws.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                All identity data is stored on Swiss infrastructure,
                protected by the Swiss Federal Act on Data Protection (FADP).
                Passwords are double-hashed, IPs are HMAC-hashed, and audit
                logs are batched asynchronously — privacy at every layer.
              </p>
              <ul className="space-y-3">
                {[
                  'Self-hosted — no third-party vendor has your user data',
                  'IP addresses HMAC-hashed before storage',
                  'Minimal metadata: no behavioral tracking',
                  'Automatic token cleanup and session expiration',
                  'Security alerts rate-limited to 1 per hour per user',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-neutral-400"
                  >
                    <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-neutral-950">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-neutral-900/80 px-6 py-20 sm:px-10 sm:py-24 max-w-6xl mx-auto">
            <img
              src={authShowcaseBg.src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Interested in Ciphera Auth?
              </h2>
              <p className="text-lg text-neutral-300 mb-10">
                Ciphera Auth is currently an internal service powering the
                Ciphera ecosystem. Reach out if you&apos;re interested in
                the technology for your platform.
              </p>
              <div className="flex flex-row gap-3 justify-center flex-wrap">
                <Button
                  size="lg"
                  className="gap-2 bg-brand-orange-button hover:bg-brand-orange-button-hover text-white"
                  asChild
                >
                  <Link href="/contact">
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="gap-2 text-neutral-300 hover:text-white border border-white/10"
                  asChild
                >
                  <Link href="/about">About Ciphera</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
