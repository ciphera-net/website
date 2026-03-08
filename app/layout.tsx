import Header from '../components/Header'
import Footer from '../components/Footer'
import { ThemeProviders } from '@ciphera-net/ui'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import '../styles/globals.css'
import HeroBackground from '../components/HeroBackground'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Ciphera - Privacy-First Zero-Knowledge Encryption',
    template: '%s | Ciphera',
  },
  description: 'Privacy-first infrastructure with zero-knowledge encryption. Secure file sharing, analytics, and authentication. Where privacy still exists.',
  keywords: ['secure file sharing', 'zero-knowledge encryption', 'end-to-end encryption', 'encrypted file transfer', 'privacy-first', 'GDPR compliant file sharing', 'anonymous file upload', 'encrypted cloud storage', 'private file sharing', 'secure file transfer'],
  authors: [{ name: 'Ciphera' }],
  creator: 'Ciphera',
  publisher: 'Ciphera',
  icons: {
    icon: '/ciphera_icon.png',
    shortcut: '/ciphera_icon.png',
    apple: '/ciphera_icon.png',
  },
  // * Privacy-first: No tracking
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ciphera.net',
    siteName: 'Ciphera',
    title: 'Ciphera - Privacy-First Zero-Knowledge Encryption',
    description: 'Privacy-first infrastructure with zero-knowledge encryption. Secure file sharing, analytics, and authentication. Where privacy still exists.',
    images: [
      {
        url: '/og-homepage.png',
        width: 1200,
        height: 630,
        alt: 'Ciphera - Where Privacy Still Exists',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@CipheraNET',
    title: 'Ciphera - Privacy-First Zero-Knowledge Encryption',
    description: 'Privacy-first infrastructure with zero-knowledge encryption. Secure file sharing, analytics, and authentication. Where privacy still exists.',
    images: ['/og-homepage.png'],
  },
  alternates: {
    canonical: 'https://ciphera.net',
  },
  metadataBase: new URL('https://ciphera.net'),
}

export const viewport: Viewport = {
  themeColor: '#FD5E0F',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        {/* DNS prefetch for analytics - uses env vars at build time, falls back to production */}
        <link rel="dns-prefetch" href={new URL(process.env.NEXT_PUBLIC_PULSE_SCRIPT_URL || 'https://pulse.ciphera.net/script.js').origin} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_PULSE_API_URL || 'https://pulse-api.ciphera.net'} />
        <link rel="alternate" type="application/rss+xml" title="Ciphera Blog" href="/feed.xml" />
      </head>
      <body className="relative antialiased min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <HeroBackground />
        </div>
        <Script
          strategy="lazyOnload"
          data-domain="ciphera.net"
          data-api={process.env.NEXT_PUBLIC_PULSE_API_URL || 'https://pulse-api.ciphera.net'}
          src={process.env.NEXT_PUBLIC_PULSE_SCRIPT_URL || 'https://pulse.ciphera.net/script.js?v=3.0'}
        />
        <ThemeProviders>
          <Header />
          <main className="flex-1 pt-24 overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </ThemeProviders>
      </body>
    </html>
  )
}
