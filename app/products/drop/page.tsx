import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckIcon, LockIcon, ArrowRightIcon } from '@ciphera-net/ui'

// * Icon aliases for consistent display
const ShieldIcon = LockIcon
const KeyIcon = LockIcon
const ZapIcon = LockIcon

export const metadata: Metadata = {
  title: 'Drop - Secure File Sharing | Ciphera',
  description: 'End-to-end encrypted file sharing with zero-knowledge architecture. Share files securely with automatic expiration and password protection.',
  alternates: {
    canonical: 'https://ciphera.net/products/drop',
  },
  openGraph: {
    title: 'Drop - Secure File Sharing | Ciphera',
    description: 'End-to-end encrypted file sharing with zero-knowledge architecture. Share files securely with automatic expiration and password protection.',
    url: 'https://ciphera.net/products/drop',
    siteName: 'Ciphera',
    images: [{ url: '/drop_icon_no_margins.png', width: 512, height: 512, alt: 'Drop - Secure File Sharing' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drop - Secure File Sharing | Ciphera',
    description: 'End-to-end encrypted file sharing with zero-knowledge architecture.',
    images: ['/ciphera_logo_no_margins.png'],
  },
}

const dropSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Drop',
    description: 'End-to-end encrypted file sharing with zero-knowledge architecture. Share files securely with automatic expiration and password protection.',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    url: 'https://drop.ciphera.net',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'Ciphera', url: 'https://ciphera.net' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://ciphera.net/products' },
      { '@type': 'ListItem', position: 3, name: 'Drop' },
    ],
  },
]

export default function DropPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dropSchema) }} />
      {/* * Hero */}
      <section className="section-padding pt-32 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40 flex items-center justify-center mx-auto mb-6 shadow-2xl p-3">
              <Image
                src="/drop_icon_no_margins.png"
                alt="Drop"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="badge-primary mb-4 inline-flex">Secure File Sharing</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
              Drop
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              Share files securely with end-to-end encryption and zero-knowledge architecture. 
              Your files, your control, complete privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://drop.ciphera.net" className="btn-primary">
                Try Drop
                <ArrowRightIcon className="w-4 h-4" />
              </a>
              <Link href="/contact" className="btn-secondary">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* * What is Drop */}
      <section className="section-padding">
        <div className="section-container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
            What Is Drop?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            Ciphera Drop is an end-to-end encrypted file sharing service that uses AES-256-GCM client-side encryption to ensure files are encrypted in your browser before upload. Unlike traditional file sharing services such as Dropbox or Google Drive, Drop operates on a zero-knowledge architecture where the server never possesses decryption keys. The encryption key is embedded in the URL fragment (the part after the #), which browsers never send to servers in HTTP requests.
          </p>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            Drop is designed for anyone who needs to share files without trusting a third party with the contents. Whether you are sending sensitive legal documents, sharing medical records with a healthcare provider, transferring financial data to an accountant, or simply sending personal files you want to keep private, Drop ensures that only the intended recipient can access the file contents.
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Drop is completely free to use with no account required. Files up to 5GB are supported, with optional password protection and configurable expiration times. All data is stored on Swiss infrastructure protected by the Swiss Federal Act on Data Protection (FADP). The service is fully open source — both the client and server code are available on <a href="https://github.com/ciphera-net/drop" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">GitHub</a> for independent security verification.
          </p>
        </div>
      </section>

      {/* * Features */}
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
            Enterprise-Grade File Security
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: LockIcon, title: 'End-to-End Encryption', description: 'Files are encrypted on your device before upload. Only recipients with the link can decrypt them.' },
              { icon: KeyIcon, title: 'Zero-Knowledge Architecture', description: 'Encryption keys never touch our servers. We cannot access your files, ever.' },
              { icon: ShieldIcon, title: 'Password Protection', description: 'Add an additional layer of security with optional password protection for shared files.' },
              { icon: ZapIcon, title: 'Auto-Expiration', description: 'Set files to automatically expire after a time period or number of downloads.' },
              { icon: CheckIcon, title: 'No Account Required', description: 'Share files instantly without creating an account. Just upload and share.' },
              { icon: LockIcon, title: 'Swiss Data Protection', description: 'All data is stored in Switzerland under strict Swiss privacy laws.' },
            ].map((feature) => (
              <div key={feature.title} className="card p-6">
                <feature.icon className="w-12 h-12 text-brand-orange mb-4" />
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* * How It Works */}
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
            How Drop Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Upload Your File',
                description: 'Select or drag & drop your file. Encryption happens automatically in your browser before upload.',
              },
              {
                step: '2',
                title: 'Get Secure Link',
                description: 'Receive a unique link containing the encryption key. This link is the only way to access the file.',
              },
              {
                step: '3',
                title: 'Share Safely',
                description: 'Share the link with your recipient. They can download and decrypt the file using the link.',
              },
            ].map((step) => (
              <div key={step.step} className="card p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-brand-orange text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* * Use Cases */}
      <section className="section-padding">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
            Perfect For Any Sharing Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                For Individuals
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Share sensitive documents securely
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Send large files without email limits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Temporary file sharing with auto-deletion
                  </span>
                </li>
              </ul>
            </div>
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                For Businesses
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Comply with data protection regulations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Share confidential documents with clients
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Control access with passwords and expiration
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* * Technical Specifications */}
      <section className="section-padding">
        <div className="section-container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
            Technical Specifications
          </h2>
          <div className="card p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {[
                    ['Encryption Algorithm', 'AES-256-GCM (Galois/Counter Mode)'],
                    ['Key Generation', 'Web Crypto API — crypto.getRandomValues()'],
                    ['Key Length', '256-bit (32 bytes)'],
                    ['Encryption Location', 'Client-side only (browser)'],
                    ['Maximum File Size', '5 GB per file'],
                    ['Supported File Types', 'All file types (documents, images, videos, archives, etc.)'],
                    ['Password Protection', 'Optional — PBKDF2 key derivation from password'],
                    ['Link Expiration', 'Configurable (1 hour to 30 days, or manual deletion)'],
                    ['Infrastructure', 'Swiss-hosted servers (FADP protected)'],
                    ['Transport Security', 'TLS 1.3'],
                    ['Source Code', 'Open source (AGPL-3.0) — client and server'],
                    ['Account Required', 'No — anonymous file sharing by default'],
                  ].map(([spec, value]) => (
                    <tr key={spec}>
                      <td className="py-3 pr-4 font-semibold text-neutral-900 dark:text-white whitespace-nowrap">{spec}</td>
                      <td className="py-3 text-neutral-600 dark:text-neutral-400">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* * Security Details */}
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
              Security You Can Trust
            </h2>
            <div className="card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                    Encryption Standards
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                      AES-256-GCM encryption
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                      Client-side encryption only
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                      Cryptographically secure key generation
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                    Infrastructure
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                      Swiss-hosted servers
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                      Automatic secure deletion
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                      Minimal metadata (file size, expiration only)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* * CTA */}
      <section className="section-padding">
        <div className="section-container">
          <div className="card p-12 text-center max-w-3xl mx-auto bg-gradient-to-br from-brand-orange to-brand-orange-hover text-white">
            <h2 className="text-3xl font-bold mb-4">
              Start Sharing Securely Today
            </h2>
            <p className="text-lg text-white/90 mb-8">
              No account needed. Just upload, encrypt, and share with complete privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://drop.ciphera.net" className="btn bg-white text-brand-orange hover:bg-white/90">
                Start Using Drop
              </a>
              <Link href="/contact" className="btn bg-white/10 text-white hover:bg-white/20 border-white/20">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
