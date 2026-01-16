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
  description: 'Where Privacy Still Exists. Ciphera provides privacy-first infrastructure and applications built on zero-knowledge principles. Your data, your control.',
  keywords: ['privacy', 'encryption', 'zero-knowledge', 'security', 'ciphera', 'secure file sharing', 'privacy-first', 'end-to-end encryption'],
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
    title: 'Ciphera - Where Privacy Still Exists',
    description: 'Where Privacy Still Exists. Ciphera provides privacy-first infrastructure and applications built on zero-knowledge principles. Your data, your control.',
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
    title: 'Ciphera - Where Privacy Still Exists',
    description: 'Where Privacy Still Exists. Ciphera provides privacy-first infrastructure and applications built on zero-knowledge principles.',
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
        <ThemeProviders>
          <Header />
          <main className="flex-1 pt-20 sm:pt-24 pb-6 sm:pb-8">
            {children}
          </main>
          <Footer />
        </ThemeProviders>
      </body>
    </html>
  )
}
