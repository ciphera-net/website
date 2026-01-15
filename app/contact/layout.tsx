import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Ciphera. For general inquiries, security reports, or business partnerships. We\'re here to help.',
  openGraph: {
    title: 'Contact Ciphera',
    description: 'Get in touch with Ciphera. For general inquiries, security reports, or business partnerships.',
    url: '/contact',
  },
  twitter: {
    title: 'Contact Ciphera',
    description: 'Get in touch with Ciphera. For general inquiries, security reports, or business partnerships.',
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
