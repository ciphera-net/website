import { cn } from '@/lib/utils'
import { DecorIcon } from '@/components/decor-icon'

type FullWidthDividerProps = {
  position?: 'top' | 'bottom'
  className?: string
}

/**
 * Horizontal hairline that spans the full width of its (relative) parent and
 * pins a "+" decor mark to each end — the Efferd grid-intersection motif.
 * Sharp, muted, decorative only (aria-hidden). Facet-compliant.
 */
export function FullWidthDivider({
  position = 'top',
  className,
}: FullWidthDividerProps) {
  const isTop = position === 'top'
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 z-0 h-px bg-border',
        isTop ? 'top-0' : 'bottom-0',
        className,
      )}
    >
      <DecorIcon position={isTop ? 'top-left' : 'bottom-left'} />
      <DecorIcon position={isTop ? 'top-right' : 'bottom-right'} />
    </div>
  )
}
