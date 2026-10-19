'use client'

import Link from 'next/link'
import { PageOpeningC } from '@/components/overhaul/system/PageOpening'
import { PRIMARY, SECONDARY } from './actions'
import { ERROR } from './content'

/**
 * The error page (R11, W11), in the 404's vocabulary. The reference is the server's error digest, the code the server
 * log carries, shown only when there is one. A browser-side error's own message is never printed: it shows a reader
 * internals and helps no one (the old page printed it).
 */
export function ErrorView({ digest, onRetry }: { digest?: string; onRetry: () => void }) {
  return (
    <PageOpeningC title={ERROR.title} lead={ERROR.lead}>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={onRetry} className={PRIMARY}>
          {ERROR.retry}
        </button>
        <Link href="/contact" className={SECONDARY}>
          {ERROR.contact}
        </Link>
      </div>
      {digest && (
        <p className="mt-6 text-sm text-muted-foreground">
          {ERROR.reference}: <span className="font-mono">{digest}</span>
        </p>
      )}
    </PageOpeningC>
  )
}
