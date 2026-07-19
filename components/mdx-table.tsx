import type { ComponentPropsWithoutRef } from 'react'

/**
 * Shared `table` renderer for MDX article bodies (blog + learn).
 *
 * Markdown tables have no intrinsic overflow handling: anything wider than a
 * 390px viewport either clips against the page edge or crushes its columns to
 * min-content. The scroll container keeps wide tables readable — they scroll
 * horizontally inside it — and the min-width keeps columns at a legible width
 * instead of wrapping word-by-word.
 *
 * Header cells never wrap: the container scrolls, so a two-line "Google
 * Analytics" header buys nothing except a ragged header row. Body cells keep
 * wrapping — notes columns carry full sentences.
 */
export function MDXTable({ className, ...props }: ComponentPropsWithoutRef<'table'>) {
  const base = 'min-w-[40rem] [&_th]:whitespace-nowrap [&_td:first-child]:whitespace-nowrap'
  return (
    // * tabIndex makes the scroll container focusable so keyboard-only users
    // * can arrow-scroll content that overflows on narrow viewports.
    <div className="table-scroll overflow-x-auto" tabIndex={0} role="region" aria-label="Table, scrollable">
      <table {...props} className={className ? `${base} ${className}` : base} />
    </div>
  )
}
