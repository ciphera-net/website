/**
 * Round 5c (mock, 17-10-2026): the tiles the new Trust options share, so every lit moment on the page is one recipe.
 * LitTile is What we keep D's tile class for class (DataMore.tsx LitGroup, the option the owner picked): a 40px square,
 * a brand-orange hairline at 50 % over the card colour, the icon in brand orange. StruckTile is D's "never" tile: the
 * same box in grey with one hairline from corner to corner. QuietTile is the plain grey box (About's StackTile), for a
 * thing that is neither lit nor struck. The caller passes the icon at h-5 w-5. Every tile is decorative: the words
 * beside it say what it means, so the tile is hidden from screen readers.
 */
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const BOX = 'flex h-10 w-10 shrink-0 items-center justify-center'

export function LitTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={cn(BOX, 'border border-primary/50 bg-card text-primary', className)}>
      {children}
    </span>
  )
}

export function StruckTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={cn(BOX, 'relative overflow-hidden border border-border text-muted-foreground/70', className)}>
      {children}
      <span className="absolute left-1/2 top-1/2 h-px w-[140%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-muted-foreground/80" />
    </span>
  )
}

export function QuietTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={cn(BOX, 'border border-border bg-card text-foreground/80', className)}>
      {children}
    </span>
  )
}
