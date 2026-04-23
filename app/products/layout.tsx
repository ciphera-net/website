import type { Metadata } from 'next'
import { cdnUrl } from '@/lib/cdn'

export const metadata: Metadata = {
  title: 'Privacy-First Products & Applications',
  description: 'Explore Ciphera\'s privacy-first product suite: Pulse for cookie-free analytics, Auth, Captcha, and Relay infrastructure.',
  keywords: ['ciphera products', 'pulse analytics', 'privacy analytics', 'privacy tools', 'GDPR compliant tools', 'end-to-end encryption'],
  openGraph: {
    title: 'Privacy-First Products & Applications',
    description: 'Explore Ciphera\'s privacy-first product suite: Pulse for cookie-free analytics, Auth, Captcha, and Relay infrastructure.',
    url: 'https://ciphera.net',
    siteName: 'Ciphera',
    images: [
      {
        url: cdnUrl('/ciphera_logo_no_margins.png'),
        width: 1200,
        height: 630,
        alt: 'Ciphera Products - Privacy-First Applications',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy-First Products & Applications',
    description: 'Explore Ciphera\'s privacy-first product suite: Pulse, Auth, Captcha, and Relay.',
    images: [cdnUrl('/ciphera_logo_no_margins.png')],
  },
  alternates: {},
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
