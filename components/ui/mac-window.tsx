import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// A macOS window (dark appearance) around a real product screenshot — the
// same device the Pulse frontend uses for its hero. Sanctioned exception to
// the flat/no-rounded rule: this chrome DEPICTS macOS rather than theming our
// UI, so it uses literal macOS values — 10px window radius (Big Sur+), 12px
// traffic lights at #FF5F57/#FEBC2E/#28C840, titlebar gradient #39393b→#2c2c2e
// over a hard hairline, hairline outer border for dark-mode edge definition.
export function MacWindow({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[10px] border border-white/10 bg-[#161616] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="flex h-10 items-center gap-2 border-b border-black/60 bg-gradient-to-b from-[#39393b] to-[#2c2c2e] px-4"
      >
        <span className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-inset ring-black/20" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-inset ring-black/20" />
        <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-inset ring-black/20" />
      </div>
      {children}
    </div>
  )
}
