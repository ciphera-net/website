import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Explore Ciphera\'s privacy-first applications and infrastructure services. Drop, Ciphera Auth, Ciphera Captcha, and Ciphera Relay—all built on zero-knowledge principles.',
  openGraph: {
    title: 'Ciphera Products',
    description: 'Explore Ciphera\'s privacy-first applications and infrastructure services built on zero-knowledge principles.',
    url: '/products',
  },
  twitter: {
    title: 'Ciphera Products',
    description: 'Explore Ciphera\'s privacy-first applications and infrastructure services built on zero-knowledge principles.',
  },
  alternates: {
    canonical: '/products',
  },
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
