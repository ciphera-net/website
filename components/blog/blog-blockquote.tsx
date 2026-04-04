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
      className={`my-8 rounded-r-lg border-l-4 px-6 py-4 ${
        variant === 'tldr'
          ? 'border-brand-orange bg-brand-orange/5'
          : 'border-neutral-700 bg-neutral-900/50'
      }`}
    >
      {variant === 'tldr' && (
        <strong className="mb-2 block text-white">TL;DR:</strong>
      )}
      <div className="text-neutral-300 [&>p]:mb-0">{children}</div>
    </blockquote>
  )
}
