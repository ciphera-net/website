import Header from '../components/Header'
import Footer from '../components/Footer'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Geist, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import '@ciphera-net/facet/styles'
import '../styles/globals.css'
import { env } from '@/lib/env'
import { cdnUrl } from '@/lib/cdn'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' })
const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'Ciphera - Privacy-First Zero-Knowledge Encryption',
    template: '%s | Ciphera',
  },
  description: 'Privacy-first infrastructure with zero-knowledge encryption. Secure file sharing, analytics, and authentication. Built for privacy.',
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
    description: 'Privacy-first infrastructure with zero-knowledge encryption. Secure file sharing, analytics, and authentication. Built for privacy.',
    images: [
      {
        url: cdnUrl('/og-homepage.png'),
        width: 1200,
        height: 630,
        alt: 'Ciphera - Built for privacy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@CipheraNET',
    title: 'Ciphera - Privacy-First Zero-Knowledge Encryption',
    description: 'Privacy-first infrastructure with zero-knowledge encryption. Secure file sharing, analytics, and authentication. Built for privacy.',
    images: [cdnUrl('/og-homepage.png')],
  },
  alternates: {
    canonical: 'https://ciphera.net',
  },
  metadataBase: new URL('https://ciphera.net'),
}

export const viewport: Viewport = {
  themeColor: '#FD5E0F',
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistSans.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/* DNS prefetch for analytics — sourced from the Zod-validated env schema,
            which provides a prod default so this never renders an invalid URL. */}
        <link rel="dns-prefetch" href={new URL(env.NEXT_PUBLIC_PULSE_SCRIPT_URL).origin} />
        <link rel="dns-prefetch" href={env.NEXT_PUBLIC_PULSE_API_URL} />
        <link rel="alternate" type="application/rss+xml" title="Ciphera Blog" href="/feed.xml" />
      </head>
      <body className="relative antialiased min-h-screen flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-foreground"
        >
          Skip to content
        </a>
        <Script
          defer
          data-domain="ciphera.net"
          src="https://js.ciphera.net/script.js"
        />
        <Script
          defer
          src="https://js.ciphera.net/script.frustration.js"
        />
        <Header />
        <main id="main-content" className="flex flex-1 flex-col">
          {/* Continuous vertical rails frame every page: the header nav, this
              content column, and the footer all share max-w-6xl + border-x, so
              two hairlines run unbroken from header to footer. flex-1 keeps the
              column (and its borders) reaching the footer even on short pages. */}
          <div className="mx-auto w-full max-w-6xl flex-1 sm:border-x sm:border-border">
            {children}
          </div>
        </main>
        <Footer />
        {/*
          * Honeypot link — invisible to real users (positioned off-screen,
          * aria-hidden, untabbable, no pointer events). Link-walking crawlers
          * that follow every anchor in the DOM will hit /sys/ping, which fires
          * a pageview through the Pulse tracking script and triggers a
          * Cerberus honeypot_path rule that instant-quarantines the session.
          * Real users cannot see this, tab onto it, or accidentally click it.
        */}
        <a
          href="/sys/ping"
          aria-hidden="true"
          tabIndex={-1}
          rel="nofollow"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          .
        </a>
      </body>
    </html>
  )
}
