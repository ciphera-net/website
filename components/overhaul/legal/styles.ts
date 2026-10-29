/**
 * The folded legal pages' body text (D51, 18-10-2026; the approved mock's option C): Geist at 16 px, 17 from sm, on the
 * 680 px reading measure, near-white at 85 %; links underlined in the text's own colour, the line brightening on hover;
 * sub-headings at 18 px. Every block of a section's body takes one of these, so both pages read alike. Strong text inside
 * a section is set by LegalSection's body (medium weight, full white), so it needs no class of its own.
 */
import { cn } from '@/lib/utils'

export const P = 'mt-5 text-base leading-[1.75] text-foreground/85 sm:text-[17px]'

/** A paragraph the terms set in capitals as a legal notice: it keeps the weight it had, at the strong text's. */
export const P_NOTICE = cn(P, 'font-medium text-foreground')

export const UL =
  'mt-5 list-disc space-y-2.5 pl-5 text-base leading-[1.7] text-foreground/85 marker:text-muted-foreground sm:text-[17px] [&>li]:pl-1'

/** A numbered list the text refers to by number (the terms' 9.3 items): the list above, with figures for markers. */
export const OL =
  'mt-5 list-decimal space-y-2.5 pl-5 text-base leading-[1.7] text-foreground/85 marker:tabular-nums marker:text-muted-foreground sm:text-[17px] [&>li]:pl-1'

/** scroll-mt clears the fixed header if a sub-heading ever becomes a link target (OpenAll opens its section first). */
export const H3 = 'mt-10 scroll-mt-28 text-lg font-semibold text-foreground'

export const LINK =
  'text-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-foreground'
