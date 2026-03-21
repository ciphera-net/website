import { Metadata } from 'next'
import Link from 'next/link'
import { DropMockup } from '@/components/ui/drop-mockup'
import { ShareLinkMockup } from '@/components/ui/share-link-mockup'
import { FileRequestMockup } from '@/components/ui/file-request-mockup'
import { dropIcon, dropShowcaseBg, zurichPhoto } from '@/lib/images'
import {
  Lock,
  ShieldCheck,
  Eye,
  EyeSlash,
  Globe,
  ArrowRight,
  Check,
  X,
  GithubLogo,
  Fire,
  Key,
  FileArrowUp,
  Timer,
} from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Drop - End-to-End Encrypted File Sharing',
  description:
    'Share files securely with client-side AES-256-GCM encryption. Zero-knowledge architecture means servers never see your data. Free, up to 5 GB per file.',
  alternates: {
    canonical: 'https://ciphera.net/products/drop',
  },
  openGraph: {
    title: 'Drop - End-to-End Encrypted File Sharing',
    description:
      'Share files securely with client-side AES-256-GCM encryption. Zero-knowledge architecture means servers never see your data. Free, up to 5 GB per file.',
    url: 'https://ciphera.net/products/drop',
    siteName: 'Ciphera',
    images: [
      {
        url: '/drop_icon_no_margins.png',
        width: 512,
        height: 512,
        alt: 'Drop - End-to-End Encrypted File Sharing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drop - End-to-End Encrypted File Sharing',
    description:
      'Share files securely with client-side AES-256-GCM encryption. Zero-knowledge architecture means servers never see your data.',
    images: ['/drop_icon_no_margins.png'],
  },
}

const dropSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Drop',
    description:
      'End-to-end encrypted file sharing with zero-knowledge architecture. Share files securely with automatic expiration and password protection.',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    url: 'https://drop.ciphera.net',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
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
      { '@type': 'ListItem', position: 3, name: 'Drop' },
    ],
  },
]

export default function DropPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dropSchema) }}
      />

      {/* Hero */}
      <section className="relative -mt-[88px] min-h-screen flex items-center pt-[88px] pb-20 lg:pb-32 bg-neutral-950 overflow-hidden">
        <img
          src={dropShowcaseBg.src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-neutral-950 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
              Share files without giving up your privacy.
            </h1>

            <p className="text-xl text-neutral-300 mb-10 leading-relaxed max-w-xl">
              End-to-end encrypted file sharing with zero-knowledge
              architecture. Your files are encrypted on your device before
              upload — we never see the contents.
            </p>

            <div className="flex flex-row gap-3 flex-wrap mb-12">
              <Button
                size="lg"
                className="gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white"
                asChild
              >
                <a href="https://drop.ciphera.net">
                  Try Drop Free <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="gap-2 text-neutral-300 hover:text-white"
                asChild
              >
                <a
                  href="https://github.com/ciphera-net/drop"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubLogo className="w-4 h-4" /> View on GitHub
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-400">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-orange" />
                AES-256-GCM
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <EyeSlash className="w-4 h-4 text-brand-orange" />
                Zero-knowledge
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                No account required
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-2">
                <FileArrowUp className="w-4 h-4 text-brand-orange" />
                Up to 5 GB
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature blocks */}
      <section className="py-20 lg:py-32 bg-neutral-950 space-y-28">
        {/* E2E Encryption — text left, mockup right */}
        <div id="encryption" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Encrypted before it leaves your device.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Drop uses AES-256-GCM encryption directly in your browser.
                Files are encrypted before they ever leave your device, and
                the encryption key is embedded in the URL fragment — the part
                browsers never send to servers. Not even we can read your
                files.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Client-side AES-256-GCM via Web Crypto API',
                  'Encryption keys never touch our servers',
                  'Automatic EXIF metadata stripping from images',
                  'Optional password protection with PBKDF2',
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
              <Button
                size="lg"
                className="gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white"
                asChild
              >
                <a href="https://drop.ciphera.net">
                  Try it now <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={dropShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <DropMockup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Link — mockup left, text right */}
        <div id="sharing" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={dropShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <ShareLinkMockup />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                One link. Full control.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Upload a file and get a secure link with the decryption key
                baked in. Set expiration times, download limits, and
                burn-after-download — all enforced server-side. Share via
                link, QR code, or your device&apos;s native share menu.
              </p>
              <ul className="space-y-3">
                {[
                  'Configurable expiration (1 hour to 30 days)',
                  'Download limits (10, 50, or unlimited)',
                  'Burn after download — auto-deletes after first access',
                  'QR code generation for easy mobile sharing',
                  'Human-readable share links (e.g. correct-horse-battery)',
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

        {/* File Requests — text left, mockup right */}
        <div id="requests" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Receive files securely.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Need someone to send you a file? Create a request link and
                share it. Files uploaded through the link are encrypted
                client-side before transmission — the sender doesn&apos;t need
                an account, and the data is protected end-to-end.
              </p>
              <ul className="space-y-3">
                {[
                  'Create secure upload links for others',
                  'Encrypted title and description (zero-knowledge)',
                  'Set max uploads and expiration per request',
                  'No account required for uploaders',
                  'Perfect for collecting sensitive documents',
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
                    src={dropShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
                    <FileRequestMockup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zero-Knowledge — diagram left, text right */}
        <div id="zero-knowledge" className="container mx-auto px-6 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
                <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                  <img
                    src={dropShowcaseBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative">
              <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-6 w-full shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="text-[10px] text-neutral-500 ml-2 font-mono">
                    How Drop works
                  </span>
                </div>
                <div className="space-y-3 font-mono text-[11px]">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="text-white font-medium">Your browser</p>
                      <p className="text-neutral-500">key = crypto.getRandomValues(32)</p>
                      <p className="text-neutral-500">encrypted = AES-256-GCM(file, key)</p>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="flex items-center gap-3 pl-2">
                    <div className="w-px h-4 bg-brand-orange/30 ml-2.5" />
                    <span className="text-neutral-600 text-[10px]">encrypted blob uploaded via TLS 1.3</span>
                  </div>
                  {/* Step 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                    <div>
                      <p className="text-white font-medium">Drop server</p>
                      <p className="text-neutral-500">stores: encrypted_blob, iv, metadata</p>
                      <p className="text-red-400/80">never receives: key, plaintext</p>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="flex items-center gap-3 pl-2">
                    <div className="w-px h-4 bg-brand-orange/30 ml-2.5" />
                    <span className="text-neutral-600 text-[10px]">share link with key in URL fragment (#)</span>
                  </div>
                  {/* Step 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                    <div>
                      <p className="text-white font-medium">Recipient&apos;s browser</p>
                      <p className="text-neutral-500">key = URL.hash.split(&apos;#k=&apos;)[1]</p>
                      <p className="text-neutral-500">file = AES-256-GCM.decrypt(blob, key)</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-800 pt-3">
                  <span>Keys never sent to server</span>
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Zero-knowledge
                  </span>
                </div>
              </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                We can&apos;t read your files. By design.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                Drop&apos;s zero-knowledge architecture means the server only
                ever sees encrypted blobs. The decryption key lives in the
                URL fragment — the part after the # that browsers never send
                to servers in HTTP requests. Even if our servers were
                compromised, your files would remain unreadable.
              </p>
              <ul className="space-y-3">
                {[
                  'Encryption key stays in the URL fragment (client-only)',
                  'Server stores encrypted blobs — never plaintext',
                  'Open source client and server for independent audits',
                  'No server-side key escrow or recovery',
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
              How Drop compares.
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Most file sharing services can read your files. Drop is
              fundamentally different.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Drop card — highlighted */}
            <div className="rounded-xl border border-brand-orange/20 bg-neutral-900/80 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-orange" />
              <div className="flex items-center gap-3 mb-8">
                <img
                  src={dropIcon.src}
                  alt="Drop"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">Drop</h3>
                  <p className="text-xs text-brand-orange">Zero-knowledge file sharing</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  'End-to-end encrypted',
                  'Zero-knowledge — server can\'t read files',
                  'No account required',
                  'Open source (client + server)',
                  'Burn after download',
                  'Swiss infrastructure',
                  'EXIF metadata stripping',
                  'Free up to 5 GB',
                  'Password protection',
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

            {/* Traditional services card — muted */}
            <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-neutral-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Traditional Services</h3>
                  <p className="text-xs text-neutral-500">Dropbox, WeTransfer, Google Drive</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  { feature: 'Server-side encryption only', has: false },
                  { feature: 'Provider can read your files', has: false },
                  { feature: 'Account required', has: false },
                  { feature: 'Closed source', has: false },
                  { feature: 'No burn after download', has: false },
                  { feature: 'US infrastructure (CLOUD Act)', has: false },
                  { feature: 'Metadata retained', has: false },
                  { feature: 'Free tiers available', has: true },
                  { feature: 'Password protection', has: true },
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
                      { icon: Timer, title: 'Data retention', desc: 'Auto-deleted on expiration' },
                      { icon: ShieldCheck, title: 'Compliance', desc: 'GDPR, FADP, zero-knowledge' },
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
                All encrypted files are stored on Swiss infrastructure,
                protected by the Swiss Federal Act on Data Protection (FADP).
                Combined with zero-knowledge encryption, your files are
                protected by both mathematics and law.
              </p>
              <ul className="space-y-3">
                {[
                  'Encrypted data stored in Swiss jurisdiction',
                  'Automatic deletion when files expire',
                  'Hourly cleanup of expired files from storage',
                  'Minimal metadata — only file size and expiration',
                  'No Data Processing Agreement required',
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
              src={dropShowcaseBg.src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Start sharing securely.
              </h2>
              <p className="text-lg text-neutral-300 mb-10">
                No account needed. Upload, encrypt, and share with complete
                privacy in under 30 seconds.
              </p>
              <div className="flex flex-row gap-3 justify-center flex-wrap">
                <Button
                  size="lg"
                  className="gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white"
                  asChild
                >
                  <a href="https://drop.ciphera.net">
                    Try Drop Free <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="gap-2 text-neutral-300 hover:text-white border border-white/10"
                  asChild
                >
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
