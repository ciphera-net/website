import Header from '../components/Header'
import Footer from '../components/Footer'
import { ThemeProviders } from '@ciphera-net/ui'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import '../styles/globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Ciphera - Secure File Sharing with Zero-Knowledge Encryption',
    template: '%s | Ciphera',
  },
  description: 'Secure file sharing with zero-knowledge encryption. End-to-end encrypted file transfer, privacy-first infrastructure, and GDPR-compliant solutions. Where privacy still exists.',
  keywords: ['secure file sharing', 'zero-knowledge encryption', 'end-to-end encryption', 'encrypted file transfer', 'privacy-first', 'GDPR compliant file sharing', 'anonymous file upload', 'encrypted cloud storage', 'private file sharing', 'secure file transfer'],
  authors: [{ name: 'Ciphera' }],
  creator: 'Ciphera',
  publisher: 'Ciphera',
  icons: {
    icon: '/ciphera_icon_no_margins.png',
    shortcut: '/ciphera_icon_no_margins.png',
    apple: '/ciphera_icon_no_margins.png',
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
  themeColor: '#FD5E0F',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ciphera.net',
    siteName: 'Ciphera',
    title: 'Ciphera - Secure File Sharing with Zero-Knowledge Encryption',
    description: 'Secure file sharing with zero-knowledge encryption. End-to-end encrypted file transfer, privacy-first infrastructure, and GDPR-compliant solutions.',
    images: [
      {
        url: '/ciphera_logo_no_margins.png',
        width: 1200,
        height: 630,
        alt: 'Ciphera - Where Privacy Still Exists',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ciphera - Secure File Sharing with Zero-Knowledge Encryption',
    description: 'Secure file sharing with zero-knowledge encryption. End-to-end encrypted file transfer and privacy-first infrastructure.',
    images: ['/ciphera_logo_no_margins.png'],
  },
  alternates: {
    canonical: 'https://ciphera.net',
  },
  metadataBase: new URL('https://ciphera.net'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
        <Script
          defer
          data-domain="ciphera.net"
          data-api={process.env.NEXT_PUBLIC_PULSE_API_URL || 'https://pulse-api.ciphera.net'}
          data-storage="local"
          data-storage-ttl="24"
          src={process.env.NEXT_PUBLIC_PULSE_SCRIPT_URL || 'https://pulse.ciphera.net/script.js?v=3.0'}
        />
        <ThemeProviders>
          <Header />
          <main className="flex-1 pt-24 pb-6 sm:pb-8">
            {children}
          </main>
          <Footer />
        </ThemeProviders>
      </body>
    </html>
  )
}
