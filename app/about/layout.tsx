import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Ciphera\'s mission, values, and commitment to privacy-first technology. Built by privacy advocates, for privacy advocates.',
  openGraph: {
    title: 'About Ciphera',
    description: 'Learn about Ciphera\'s mission, values, and commitment to privacy-first technology.',
    url: '/about',
  },
  twitter: {
    title: 'About Ciphera',
    description: 'Learn about Ciphera\'s mission, values, and commitment to privacy-first technology.',
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
