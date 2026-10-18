'use client'

/**
 * Round 5c (mock, 17-10-2026): a square button that copies one email address. On success the icon turns into a check in
 * brand orange for two seconds (an action's feedback, where orange is allowed); on failure (no Clipboard API, or the
 * browser refuses) it shows a cross and says so, never a copy that did not happen. A polite live region speaks the
 * result; the button's name carries the address, so "Copy" alone is never ambiguous. Words come from content.ts.
 */
import * as React from 'react'
import { Check, Copy, X } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'

type State = 'idle' | 'done' | 'failed'

export function CopyButton({
  text,
  label,
  done,
  failed,
  className,
}: {
  text: string
  label: string
  done: string
  failed: string
  className?: string
}) {
  const [state, setState] = React.useState<State>('idle')

  React.useEffect(() => {
    if (state === 'idle') return
    const t = window.setTimeout(() => setState('idle'), 2000)
    return () => window.clearTimeout(t)
  }, [state])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setState('done')
    } catch {
      setState('failed')
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label} ${text}`}
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors duration-150 hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      {state === 'done' ? (
        <Check className="h-4 w-4 text-primary" aria-hidden="true" />
      ) : state === 'failed' ? (
        <X className="h-4 w-4 text-foreground" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {state === 'done' ? done : state === 'failed' ? failed : ''}
      </span>
    </button>
  )
}
