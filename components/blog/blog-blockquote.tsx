import { type ReactNode } from 'react'

export function BlogBlockquote({
  children,
  variant = 'default',
}: {
  children: ReactNode
  variant?: 'default' | 'tldr'
}) {
  return (
    <blockquote
      className={`my-8 border-l-4 px-6 py-4 ${
        variant === 'tldr'
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card'
      }`}
    >
      {variant === 'tldr' && (
        <strong className="mb-2 block text-foreground">TL;DR:</strong>
      )}
      <div className="text-muted-foreground [&>p]:mb-0">{children}</div>
    </blockquote>
  )
}
