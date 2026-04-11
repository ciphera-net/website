'use client'

import Link from 'next/link'
import { ArrowRight, GithubLogo } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { track } from '@/lib/pulse'

/**
 * Section 8 — Closing CTA. Two buttons: explore products (primary) and
 * view the source of this page on GitHub (ghost, brand-aligned "don't
 * trust us, read the code" gesture).
 */
export function SustainabilityCTA() {
  return (
    <section className="py-20 lg:py-32 bg-neutral-950">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
          See what it looks like to pick a provider that measures itself.
        </h2>
        <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
          Ciphera builds privacy-first infrastructure that takes transparency
          seriously — from zero-knowledge encryption to the carbon footprint
          of the servers running the whole thing.
        </p>

        <div className="flex flex-row gap-3 flex-wrap justify-center">
          <Button
            size="lg"
            className="gap-2 bg-brand-orange-button hover:bg-brand-orange-button-hover text-white"
            asChild
          >
            <Link
              href="/products"
              onClick={() => track('sustainability_cta_products_click')}
            >
              Explore Ciphera Products <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-neutral-600 text-white hover:bg-neutral-800 hover:border-neutral-500"
            asChild
          >
            <Link
              href="https://github.com/ciphera-net/website/blob/main/app/sustainability/page.tsx"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('sustainability_cta_source_click')}
            >
              <GithubLogo className="w-4 h-4" /> View this page&apos;s source
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
