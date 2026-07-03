import type { ComponentPropsWithoutRef } from 'react'

/**
 * Shared `table` renderer for MDX article bodies (blog + learn).
 *
 * Markdown tables have no intrinsic overflow handling: anything wider than a
 * 390px viewport either clips against the page edge or crushes its columns to
 * min-content. The scroll container keeps wide tables readable — they scroll
 * horizontally inside it — and the min-width keeps columns at a legible width
 * instead of wrapping word-by-word.
 */
export function MDXTable({ className, ...props }: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="overflow-x-auto">
      <table {...props} className={className ? `min-w-[40rem] ${className}` : 'min-w-[40rem]'} />
    </div>
  )
}
