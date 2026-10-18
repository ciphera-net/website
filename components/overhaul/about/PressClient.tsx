'use client'

/**
 * Round 4 (mock, 17-10-2026): the Press block's one client piece. Copies PRESS.boilerplate to the clipboard and
 * shows "Copied" for 2s. If the Clipboard API is unavailable (no `navigator.clipboard`, an insecure context, or a
 * denied/failed write) it fails VISIBLY — "Select the text to copy" — rather than silently doing nothing. Shared
 * by all three Press options (A/B/C in Press.tsx); only the className each passes differs.
 */
import * as React from 'react'
import { Copy, Check } from '@phosphor-icons/react'

type CopyState = 'idle' | 'copied' | 'unavailable'

const DEFAULT_CLASS =
  'inline-flex h-9 shrink-0 items-center gap-1.5 border border-border px-3 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary'

// `label` names the button for screen readers when a page has several (review 17-10: four buttons were all "Copy").
export function CopyBoilerplate({ text, className, label }: { text: string; className?: string; label?: string }) {
  const [state, setState] = React.useState<CopyState>('idle')

  React.useEffect(() => {
    if (state === 'idle') return
    const t = setTimeout(() => setState('idle'), 2000)
    return () => clearTimeout(t)
  }, [state])

  async function onClick() {
    if (!navigator.clipboard?.writeText) {
      setState('unavailable')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('unavailable')
    }
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} className={className ?? DEFAULT_CLASS}>
      <span className="inline-flex items-center gap-1.5" aria-live="polite">
        {state === 'copied' ? (
          <>
            <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> Copied
          </>
        ) : state === 'unavailable' ? (
          'Select the text to copy'
        ) : (
          <>
            <Copy className="h-4 w-4 shrink-0" aria-hidden="true" /> Copy
          </>
        )}
      </span>
    </button>
  )
}
