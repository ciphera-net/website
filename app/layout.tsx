import Header from '../components/Header'
import Footer from '../components/Footer'
import { ThemeProviders } from '../components/ThemeProviders'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import '../styles/globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Ciphera - Where Privacy Still Exists',
    template: '%s | Ciphera',
  },
  description: 'Where Privacy Still Exists. Ciphera provides privacy-first infrastructure and applications built on zero-knowledge principles. Your data is encrypted before it leaves your device.',
  keywords: ['privacy', 'encryption', 'zero-knowledge', 'security', 'ciphera', 'secure file sharing', 'end-to-end encryption', 'AES-256', 'client-side encryption'],
  authors: [{ name: 'Ciphera' }],
  creator: 'Ciphera',
  publisher: 'Ciphera',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ciphera.net'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Ciphera',
    title: 'Ciphera - Where Privacy Still Exists',
    description: 'Privacy-first infrastructure and applications built on zero-knowledge principles. Your data is encrypted before it leaves your device.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ciphera - Where Privacy Still Exists',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ciphera - Where Privacy Still Exists',
    description: 'Privacy-first infrastructure and applications built on zero-knowledge principles.',
    images: ['/og-image.png'],
    creator: '@ciphera_net',
  },
  icons: {
    icon: '/ciphera_icon_no_margins.png',
    shortcut: '/ciphera_icon_no_margins.png',
    apple: '/ciphera_icon_no_margins.png',
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
        {/* * Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Ciphera',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ciphera.net',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ciphera.net'}/ciphera_icon_no_margins.png`,
              description: 'Privacy-first infrastructure and applications built on zero-knowledge principles.',
              sameAs: [
                'https://github.com/ciphera-net',
                'https://twitter.com/ciphera_net',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'hello@ciphera.net',
                contactType: 'Customer Service',
              },
            }),
          }}
        />
        <ThemeProviders>
          <Header />
          <main className="flex-1 pt-24 pb-8">
            {children}
          </main>
          <Footer />
        </ThemeProviders>
      </body>
    </html>
  )
}
