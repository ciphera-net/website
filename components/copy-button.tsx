'use client'

import { useState } from 'react'
import { CopyIcon, CheckIcon } from '@ciphera-net/facet'

/**
 * Small copy-to-clipboard affordance for verification data (fingerprints,
 * verify commands) that users are told to check character-for-character.
 * Modeled on the copy button in app/contact/page.tsx.
 */
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      className="inline-flex size-9 items-center justify-center border border-border bg-card transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <CheckIcon aria-hidden="true" className="size-3.5 text-pos" />
      ) : (
        <CopyIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
      )}
    </button>
  )
}
