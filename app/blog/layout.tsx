import { Metadata } from 'next'
import { cdnUrl } from '@/lib/cdn'

export const metadata: Metadata = {
  title: 'Blog - Privacy & Security Insights',
  description: 'Privacy and security insights from the Ciphera team. Data breach analysis, encryption guides, tool comparisons, and privacy statistics backed by sourced data.',
  alternates: {
    canonical: 'https://ciphera.net/blog',
  },
  openGraph: {
    title: 'Blog - Privacy & Security Insights | Ciphera',
    description: 'Privacy and security insights from the Ciphera team. Data breach analysis, encryption guides, tool comparisons, and privacy statistics backed by sourced data.',
    url: 'https://ciphera.net/blog',
    siteName: 'Ciphera',
    images: [{ url: cdnUrl('/blog/og/_index.png'), width: 1200, height: 630, alt: 'Ciphera Blog' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Privacy & Security Insights | Ciphera',
    description: 'Privacy and security insights from the Ciphera team. Data breach analysis, encryption guides, and privacy statistics.',
    images: [cdnUrl('/blog/og/_index.png')],
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
