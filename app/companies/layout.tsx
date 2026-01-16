import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Companies - Ciphera | Privacy-First Solutions for Business',
  description: 'Transform your company into a privacy-first organization. Ciphera offers enterprise-grade privacy infrastructure, secure authentication, and encrypted file sharing solutions for businesses.',
  keywords: ['enterprise privacy', 'business security', 'company privacy solutions', 'enterprise encryption', 'privacy transformation', 'B2B privacy', 'corporate security'],
  openGraph: {
    title: 'For Companies - Ciphera | Privacy-First Solutions for Business',
    description: 'Transform your company into a privacy-first organization. Ciphera offers enterprise-grade privacy infrastructure and secure solutions for businesses.',
    url: 'https://ciphera.net/companies',
    siteName: 'Ciphera',
    images: [
      {
        url: '/ciphera_logo_no_margins.png',
        width: 1200,
        height: 630,
        alt: 'Ciphera For Companies',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Companies - Ciphera | Privacy-First Solutions for Business',
    description: 'Transform your company into a privacy-first organization with Ciphera\'s enterprise solutions.',
    images: ['/ciphera_logo_no_margins.png'],
  },
  alternates: {
    canonical: 'https://ciphera.net/companies',
  },
}

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
