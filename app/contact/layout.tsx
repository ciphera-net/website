import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Ciphera | Get in Touch',
  description: 'Contact Ciphera for general inquiries, security reports, or business partnerships. We\'re here to help with privacy-first solutions and support.',
  keywords: ['contact ciphera', 'ciphera support', 'security report', 'business inquiry', 'privacy support'],
  openGraph: {
    title: 'Contact Us - Ciphera | Get in Touch',
    description: 'Contact Ciphera for general inquiries, security reports, or business partnerships. We\'re here to help with privacy-first solutions and support.',
    url: 'https://ciphera.net/contact',
    siteName: 'Ciphera',
    images: [
      {
        url: '/ciphera_logo_no_margins.png',
        width: 1200,
        height: 630,
        alt: 'Contact Ciphera',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Ciphera | Get in Touch',
    description: 'Contact Ciphera for general inquiries, security reports, or business partnerships.',
    images: ['/ciphera_logo_no_margins.png'],
  },
  alternates: {
    canonical: 'https://ciphera.net/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
