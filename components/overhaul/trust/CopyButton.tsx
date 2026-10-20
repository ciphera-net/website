'use client'

/**
 * Round 5c (mock, 17-10-2026): a square button that copies one email address. On success the icon turns into a check in
 * brand orange for two seconds (an action's feedback, where orange is allowed); on failure (no Clipboard API, or the
 * browser refuses) it shows a cross and says so, never a copy that did not happen. A polite live region speaks the
 * result; the button's name carries the address, so "Copy" alone is never ambiguous. Words come from content.ts.
 *
 * R11 (D69, 20-10-2026): the same word is also shown, muted, to the button's left for the two seconds (outside its box,
 * so the button keeps its square; hidden from assistive technology, which hears the live region), and on a failure the
 * address is selected where it is shown, so it can be copied by hand.
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

  async function copy(e: React.MouseEvent<HTMLButtonElement>) {
    // Read before the await: React clears currentTarget once the handler has returned.
    const button = e.currentTarget
    try {
      await navigator.clipboard.writeText(text)
      setState('done')
    } catch {
      setState('failed')
      // Leave a way round: select the text the button copies where it is shown next to it (the address link in the same
      // card or row), so the visitor can copy it themselves.
      const scope = button.closest('li, dd, div')
      const shown = scope && Array.from(scope.querySelectorAll('a')).find((a) => a.textContent?.trim() === text)
      if (shown) window.getSelection()?.selectAllChildren(shown)
    }
  }

  const word = state === 'done' ? done : state === 'failed' ? failed : null

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label} ${text}`}
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors duration-150 hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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
      {word && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap text-sm text-muted-foreground"
        >
          {word}
        </span>
      )}
      <span className="sr-only" aria-live="polite">
        {word ?? ''}
      </span>
    </button>
  )
}
