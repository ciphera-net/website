'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react'
import { track } from '@/lib/pulse'
import { sustainabilityHeroBg } from '@/lib/images'

/**
 * Section 07 — Closing CTA. About-page pattern: full-bleed grayscale photo +
 * gradient-to-background + a single primary link (bookends the hero). The
 * former "view this page's source" link was removed — the website repo is
 * private, so it 404'd for every visitor.
 */
export function SustainabilityCTA() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <Image
        src={sustainabilityHeroBg}
        alt=""
        aria-hidden="true"
        fill
        unoptimized
        sizes="100vw"
        className="object-cover grayscale brightness-[0.4]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45"
      />
      <div className="relative px-6 py-24 sm:py-32">
        <p className="font-mono text-xs text-muted-foreground">06 · Get started</p>
        <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          See what it looks like to pick a provider that measures itself.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Ciphera builds privacy-first infrastructure that takes transparency seriously — from
          zero-knowledge encryption to the carbon footprint of the servers running the whole thing.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link
            href="/#products"
            onClick={() => track('sustainability_cta_products_click')}
            className="btn-primary"
          >
            Explore products
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
