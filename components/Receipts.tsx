import Link from 'next/link'
import { ArrowUpRightIcon } from '@ciphera-net/facet'
import { getCurrentCanary } from '@/lib/transparency'
import { fetchImpactReport } from '@/lib/api/sustainability'

interface Receipt {
  label: string
  value: string
  href: string
  external?: boolean
}

/**
 * Verifiable facts, not marketing claims. Every cell links to its proof.
 * Live values degrade to already-published static claims — never to
 * invented numbers.
 */
export default async function Receipts() {
  let canaryDate: string | null = null
  try {
    canaryDate = (await getCurrentCanary()).publishedEuropean
  } catch {
    // canary content missing at build time — render the link without a date
  }

  const report = await fetchImpactReport()
  const renewable = report?.totals?.renewableShare ?? null

  const receipts: Receipt[] = [
    {
      label: 'Open source',
      value: 'github.com/ciphera-net',
      href: 'https://github.com/ciphera-net',
      external: true,
    },
    {
      label: 'Warrant canary',
      value: canaryDate ? `GPG-signed · ${canaryDate}` : 'GPG-signed · monthly',
      href: '/trust/canary',
    },
    {
      label: 'Renewable hosting',
      value: renewable !== null ? `${renewable}% renewable energy` : 'See the real numbers',
      href: '/sustainability',
    },
    {
      label: 'Client-side crypto',
      value: 'AES-256-GCM · OPAQUE (RFC 9807) · Argon2id',
      href: '/learn',
    },
  ]

  return (
    <section className="border-b border-border" aria-label="Verifiable facts">
      <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
        {receipts.map((receipt) => {
          const inner = (
            <>
              <span className="flex items-center justify-between text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                {receipt.label}
                <ArrowUpRightIcon
                  aria-hidden="true"
                  className="h-3 w-3 opacity-0 transition-opacity duration-fast group-hover:opacity-100"
                />
              </span>
              <span className="mt-2 block font-mono text-xs text-foreground [overflow-wrap:anywhere] sm:text-sm">
                {receipt.value}
              </span>
            </>
          )
          const className =
            'group block bg-background p-5 transition-colors duration-base hover:bg-accent'
          return receipt.external ? (
            <a
              key={receipt.label}
              href={receipt.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {inner}
            </a>
          ) : (
            <Link key={receipt.label} href={receipt.href} className={className}>
              {inner}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
