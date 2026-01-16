import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products - Ciphera | Privacy-First Applications',
  description: 'Explore Ciphera\'s suite of privacy-first applications: Drop for secure file sharing, Ciphera Auth for identity management, Ciphera Captcha for bot protection, and Ciphera Relay for email infrastructure.',
  keywords: ['ciphera products', 'drop file sharing', 'ciphera auth', 'ciphera captcha', 'ciphera relay', 'privacy tools', 'encrypted file sharing'],
  openGraph: {
    title: 'Products - Ciphera | Privacy-First Applications',
    description: 'Explore Ciphera\'s suite of privacy-first applications: Drop for secure file sharing, Ciphera Auth for identity management, Ciphera Captcha for bot protection, and Ciphera Relay for email infrastructure.',
    url: 'https://ciphera.net/products',
    siteName: 'Ciphera',
    images: [
      {
        url: '/ciphera_logo_no_margins.png',
        width: 1200,
        height: 630,
        alt: 'Ciphera Products',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products - Ciphera | Privacy-First Applications',
    description: 'Explore Ciphera\'s suite of privacy-first applications for secure, encrypted services.',
    images: ['/ciphera_logo_no_margins.png'],
  },
  alternates: {
    canonical: 'https://ciphera.net/products',
  },
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
