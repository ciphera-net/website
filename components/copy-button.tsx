'use client'

import { useState } from 'react'
import { CopyIcon, CheckIcon } from '@ciphera-net/facet'

/**
 * Small copy-to-clipboard affordance for verification data (fingerprints,
 * verify commands) that users are told to check character-for-character.
 * Modeled on the copy button in app/contact/page.tsx.
 */
export function CopyButton({ value }: { value: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setState('copied')
    } catch {
      setState('failed')
    }
    setTimeout(() => setState('idle'), 2000)
  }

  const label =
    state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy to clipboard'

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      className="inline-flex size-9 items-center justify-center border border-border bg-card transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={label}
    >
      {state === 'copied' ? (
        <CheckIcon aria-hidden="true" className="size-3.5 text-pos" />
      ) : state === 'failed' ? (
        <CopyIcon aria-hidden="true" className="size-3.5 text-destructive" />
      ) : (
        <CopyIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
      )}
      <span role="status" className="sr-only">
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : ''}
      </span>
    </button>
  )
}
