import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { AuthMockup } from '@/components/ui/auth-mockup'
import { authShowcaseBg, zurichPhoto } from '@/lib/images'
import { cdnUrl } from '@/lib/cdn'
import {
  ArrowRightIcon,
  CheckIcon,
  GlobeIcon,
  LockIcon,
} from '@ciphera-net/facet'
import { ShieldCheck, Key, Timer, Vault } from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: 'Ciphera ID - How Signing In to Ciphera Works',
  description:
    'Ciphera ID is the sign-in behind Ciphera’s own applications — not a product you buy. Zero-knowledge OPAQUE authentication (RFC 9807), an encrypted profile vault the server cannot read, and Swiss-hosted infrastructure.',
  alternates: {
    canonical: 'https://ciphera.net/products/id',
  },
  openGraph: {
    title: 'Ciphera ID - How Signing In to Ciphera Works | Ciphera',
    description:
      'The sign-in behind Ciphera’s own applications: zero-knowledge OPAQUE authentication (RFC 9807), an encrypted profile vault the server cannot read, and Swiss-hosted infrastructure.',
    url: 'https://ciphera.net/products/id',
    siteName: 'Ciphera',
    images: [
      {
        url: cdnUrl('/id_icon_no_margins.png'),
        width: 512,
        height: 512,
        alt: 'Ciphera ID - the sign-in behind Ciphera',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ciphera ID - How Signing In to Ciphera Works | Ciphera',
    description:
      'The sign-in behind Ciphera’s own applications: zero-knowledge OPAQUE authentication (RFC 9807) and an encrypted profile vault the server cannot read.',
    images: [cdnUrl('/id_icon_no_margins.png')],
  },
}

// * Ciphera ID is internal infrastructure, not something on the shelf: there is
// * no self-serve client registration, no OIDC discovery document and no
// * relying-party SDK. This page therefore carries no SoftwareApplication /
// * Product / Offer markup — only the breadcrumb that describes where the URL
// * sits. The URL itself is permanent: it is referenced from the sitemap,
// * llms.txt, the press kit, the glossary and a blog post.
const idSchema = [
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
        item: 'https://ciphera.net/#products',
      },
      { '@type': 'ListItem', position: 3, name: 'Ciphera ID' },
    ],
  },
]

const NOT_BUILT_FOR = [
  'No self-serve client registration — adding an application takes a database migration by us',
  'No OpenID Connect discovery document and no JWKS endpoint for third-party token verification',
  'No “Sign in with Ciphera” SDK, no social-login connectors, no SAML',
  'No plan, no price and no checkout — the billing tables were removed rather than left dormant',
]

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
          <p className="text-xs text-muted-foreground">Ciphera ID</p>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            The sign-in{' '}<br className="hidden sm:inline" />behind Ciphera.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Ciphera ID is infrastructure, not a product. It is how you sign in
            to Ciphera&apos;s own applications — with a password that never
            reaches our servers and a profile we cannot read.
          </p>
          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2 text-foreground">
              <LockIcon aria-hidden="true" className="h-3.5 w-3.5" />
              Zero-knowledge
            </span>
            <span aria-hidden="true" className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2">
              <Key aria-hidden="true" className="h-3.5 w-3.5" />
              OPAQUE (RFC 9807)
            </span>
            <span aria-hidden="true" className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2">
              <Vault aria-hidden="true" className="h-3.5 w-3.5" />
              Encrypted profile vault
            </span>
            <span aria-hidden="true" className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2">
              <GlobeIcon aria-hidden="true" className="h-3.5 w-3.5" />
              Swiss-hosted
            </span>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href="/products/tessera" className="btn-primary">
              Read the open implementation
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/trust" className="btn-secondary">
              Trust &amp; Security
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 01 · What it is ─────────────────────────────────────────── */}
      <section id="what-it-is" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Copy cell */}
          <div className="min-w-0 flex flex-col justify-center px-6 py-16 sm:py-24 lg:pr-14">
            <p className="text-xs text-muted-foreground">01 · What it is</p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              One account for our applications.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Every Ciphera application shares one account. You sign in once at{' '}
              <a
                href="https://id.ciphera.net/login"
                className="text-primary hover:underline"
              >
                id.ciphera.net
              </a>{' '}
              and arrive back at the application you came from over OAuth 2.0
              with mandatory PKCE. Today that means{' '}
              <Link href="/products/pulse" className="text-primary hover:underline">
                Pulse
              </Link>
              , with more of our own services to follow. Ciphera ID does the
              authentication ceremonies — sign in, sign up, recovery — and
              nothing else; your settings live in the application you are using.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              It is not a general-purpose identity platform, and we would rather
              say so on this page than let you find out after a procurement call:
            </p>
            <ul className="mt-8 space-y-3">
              {NOT_BUILT_FOR.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className="mt-[0.6rem] h-px w-4 shrink-0 bg-border"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              If you want to build on this model, the part you can actually use
              is{' '}
              <Link href="/products/tessera" className="text-primary hover:underline">
                Tessera
              </Link>{' '}
              — the OPAQUE implementation underneath Ciphera ID, published
              open-source under Apache-2.0.
            </p>
          </div>

          {/* Visual cell — the real sign-in screen */}
          <div className="relative min-h-[400px] min-w-0 overflow-hidden border-t border-border lg:border-l lg:border-t-0 flex items-center justify-center px-6 py-12 bg-card mockup-cell">
            <div className="w-full max-w-md min-w-0">
              <AuthMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 02 · Authentication — Zero-knowledge auth ───────────────── */}
      <section id="zero-knowledge-auth" className="overflow-hidden border-b border-border scroll-mt-20">
        <div className="grid lg:grid-cols-2">
          {/* Visual cell — left on desktop */}
          <div className="relative min-h-[400px] order-last min-w-0 overflow-hidden border-t border-border lg:order-first lg:border-r lg:border-t-0 flex items-center justify-center px-6 py-12 bg-card">
            <div className="w-full max-w-md min-w-0">
              <div className="border border-border bg-background p-6 space-y-4">
                {/* Step 1: Your device */}
                <div className="border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="text-xs text-muted-foreground">Your device</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border border-border bg-background px-3 py-2">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Your password</p>
                      <p className="text-sm text-foreground tracking-widest">••••••••••</p>
                    </div>
                    <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 border border-primary/30 bg-primary/5 px-3 py-2">
                      <p className="text-[10px] text-primary/70 mb-0.5">Scrambled</p>
                      <p className="font-mono text-[11px] text-primary truncate">a7f3c8e1b9d2...</p>
                    </div>
                  </div>
                </div>

                {/* Transit indicator */}
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <div className="flex items-center gap-1.5 border border-border bg-background px-3 py-1">
                    <svg className="w-3 h-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span className="text-[10px] text-muted-foreground">Encrypted in transit</span>
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Step 2: Our server */}
                <div className="border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" /></svg>
                    <span className="text-xs text-muted-foreground">Our server</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border border-primary/30 bg-primary/5 px-3 py-2">
                      <p className="text-[10px] text-primary/70 mb-0.5">Received</p>
                      <p className="font-mono text-[11px] text-primary truncate">a7f3c8e1b9d2...</p>
                    </div>
                    <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 border border-border bg-background px-3 py-2">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Opaque record</p>
                      <p className="font-mono text-[11px] text-muted-foreground truncate">9f2c4e8a…b1d7</p>
                    </div>
                  </div>
                </div>

                {/* Storage row */}
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <div className="flex items-center gap-1.5 border border-border bg-background px-3 py-1">
                    <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    <span className="text-[10px] text-muted-foreground">Stored in database</span>
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Database */}
                <div className="border border-border bg-background px-4 py-3 text-center">
                  <p className="font-mono text-[11px] text-muted-foreground truncate">opaque credential · 9f2c4e8a…b1d7</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Unreadable — even to us</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy cell */}
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pl-14">
            <p className="text-xs text-muted-foreground">02 · Authentication</p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Your password never leaves your device.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              With <Link href="/glossary/opaque" className="text-primary hover:underline">OPAQUE</Link> (RFC 9807), your password is stretched on your
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
        </div>
      </section>

      {/* ─── 03 · The vault — what we cannot read ────────────────────── */}
      <section id="vault" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">03 · The vault</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            We do not know your name or your email address.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            This is the part that surprises people, so it is worth being
            literal about it. The account table has no email column and no name
            column. Your name and email are sealed in a vault encrypted on your
            own device, under a key derived during the OPAQUE exchange that our
            servers never hold in usable form. To find your account at sign-in
            we use a blind index — a keyed hash of your email that identifies
            the row without revealing the address.
          </p>

          {/* What an operator with full database access actually sees */}
          <div className="mt-14 max-w-3xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <p className="text-sm text-foreground">
                What an operator with full database access sees
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                One account row, in its entirety
              </p>
            </div>
            <dl className="divide-y divide-border">
              {[
                { k: 'id', v: 'b7c1e0f4-2a58-4d19-9f3e-0c8a41d6b2ee', note: 'A UUID' },
                { k: 'email_blind_index', v: '4f9a2c81…e3d0', note: 'Keyed hash — not reversible to an address' },
                { k: 'opaque_record', v: '9f2c4e8a…b1d7', note: 'Credential record — no password inside it' },
                { k: 'opaque_wrapped_key', v: 'c04b7e13…8a26', note: 'Inert without a key only your device derives' },
                { k: 'encrypted_vault', v: 'a1d8…2f60', note: 'Ciphertext — your name and email, sealed' },
              ].map((row) => (
                <div key={row.k} className="grid gap-1 px-6 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
                  <dt className="font-mono text-[13px] text-foreground">{row.k}</dt>
                  <dd className="min-w-0">
                    <p className="font-mono text-[13px] text-muted-foreground truncate">{row.v}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{row.note}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            The trade-off is real and we take it deliberately: because we cannot
            read your address, we cannot reset your password for you, and a
            lawful order served on us returns ciphertext. The full account of
            what we can and cannot see is in{' '}
            <Link href="/blog/what-we-see-about-you-what-we-dont" className="text-primary hover:underline">
              what we see about you
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ─── 04 · Sessions — what happens after sign-in ──────────────── */}
      <section id="sessions" className="border-b border-border scroll-mt-20">
        <div className="px-6 py-16 sm:py-24">
          <p className="text-xs text-muted-foreground">04 · Sessions</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            What happens after you sign in.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Applications never see your credentials. They receive a short-lived
            token over an OAuth 2.0 authorization-code flow, and they verify it
            without calling back to us on every request.
          </p>
          <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2">
            {[
              {
                icon: Key,
                title: 'OAuth 2.0, PKCE mandatory',
                body: 'Every authorization-code flow requires PKCE with S256 — there is no downgrade path and no implicit flow. Access tokens live 15 minutes; refresh tokens rotate on use, and a reused token revokes the family.',
              },
              {
                icon: ShieldCheck,
                title: 'A log you can read, on data we hash',
                body: 'Every sign-in, password change and second-factor event is recorded, and you can end any session from your account settings. Client IP addresses are HMAC-hashed before they are written — which is why the log shows a mask, not an address.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col bg-background p-8">
                <Icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
          <ul className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
            {[
              'TOTP two-factor authentication with any authenticator app',
              'Escalating lockout on repeated failures (15 min → 1 hour → 24 hours)',
              'A captcha challenge after three failed attempts',
              'Expired tokens and stale sessions cleaned up automatically',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-muted-foreground">
                <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── 05 · Data residency — photo left, copy right ─────────────── */}
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
                    <p className="text-xs text-muted-foreground">{item.title}</p>
                    <p className="mt-1 text-sm tabular-nums text-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Copy cell */}
          <div className="flex flex-col justify-center px-6 py-16 sm:py-24 lg:pl-14">
            <p className="text-xs text-muted-foreground">05 · Data residency</p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Hosted in Switzerland. Blind by design.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              All identity data is stored under the <Link href="/glossary/fadp" className="text-primary hover:underline">Federal Act on Data Protection (FADP)</Link>.
              Passwords use zero-knowledge OPAQUE auth, IPs are HMAC-hashed,
              and audit logs are batched asynchronously — privacy at every layer.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Run on our own infrastructure — no third-party identity vendor holds your account',
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

      {/* ─── 06 · The code — A7 full-bleed close ─────────────────────── */}
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
          <p className="text-xs text-muted-foreground">06 · The code</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            You cannot buy this. You can read it.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Ciphera ID is an internal service, and it is staying that way. The
            cryptography underneath it is not: Tessera is the same OPAQUE code
            that verifies real Ciphera sign-ins, published under Apache-2.0 for
            anyone who wants to hold no passwords either.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/products/tessera" className="btn-primary">
              Tessera, the open implementation
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/products/pulse" className="btn-secondary">
              See Pulse
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Already have a Ciphera account?{' '}
            <a href="https://id.ciphera.net/login" className="text-primary hover:underline">
              Sign in
            </a>
            .
          </p>
        </div>
      </section>
    </>
  )
}
