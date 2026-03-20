'use client'

import { Lock, Heart, Globe, Flag, Code } from '@phosphor-icons/react'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'

const features = [
  {
    Icon: Lock,
    name: 'Cryptography First',
    description:
      "We don't rely on promises or policies. Our architecture uses zero-knowledge cryptography, meaning we mathematically cannot access your data.",
    href: '/products',
    cta: 'Explore products',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    ),
    className: 'lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3',
  },
  {
    Icon: Heart,
    name: 'Accessible Security',
    description:
      "Strong encryption shouldn't require technical expertise. We build tools that protect your data by default, making privacy accessible to everyone.",
    href: '/about',
    cta: 'Our mission',
    background: (
      <div className="absolute inset-0 bg-gradient-to-bl from-brand-orange/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    ),
    className: 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3',
  },
  {
    Icon: Code,
    name: 'Open Source',
    description:
      'Our code is public. Anyone can audit our security claims, and we welcome the scrutiny.',
    href: 'https://github.com/ciphera-net',
    cta: 'View on GitHub',
    background: (
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    ),
    className: 'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4',
  },
  {
    Icon: Globe,
    name: 'Verified, Not Vouched',
    description:
      'Verification beats marketing. Every claim we make can be independently confirmed through our public codebase and architecture.',
    href: '/about',
    cta: 'Learn more',
    background: (
      <div className="absolute inset-0 bg-gradient-to-tl from-brand-orange/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    ),
    className: 'lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2',
  },
  {
    Icon: Flag,
    name: 'Swiss Infrastructure',
    description:
      'All services run on Swiss infrastructure. Your data benefits from Swiss data protection laws and stays in a privacy-respecting jurisdiction.',
    href: '/about',
    cta: 'Learn more',
    background: (
      <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    ),
    className: 'lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4',
  },
]

export default function Philosophy() {
  return (
    <section className="py-20 lg:py-32 bg-neutral-950 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="badge bg-white/10 text-white/80 border-white/10 mb-6 inline-flex">
            Our Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Encryption you can{' '}
            <span className="gradient-text">verify</span>, not just trust
          </h2>
        </div>

        <BentoGrid className="lg:grid-rows-3">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
