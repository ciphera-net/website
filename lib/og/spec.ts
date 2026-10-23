/**
 * The OG card system (R10, D52, 19-10-2026; plan §5l): one template for every page's share card. A card is the page's
 * own words (a label, its title, the first sentence of its lead) drawn by lib/og/render.tsx. This module holds only the
 * shared shape, so the renderer and the address helpers import nothing that reads the CMS.
 */
export type OgCard = { label: string; title: string; lead?: string }
export type OgKind = 'page' | 'post' | 'term' | 'learn'

/** Bump when the drawing changes: every card's address moves with it, so the CDN's year-long copies are never stale. */
export const OG_TEMPLATE = 'dots-1'
export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

/**
 * A card's cover (23-10-2026): the same card, untouched, centred on its own ground at DEV's cover shape. DEV shows every
 * cover at 1000 x 420 and crops anything else to that shape, which cut the lockup and the label off the top of a card;
 * 1500 x 630 is exactly 1000:420, so DEV only scales it. Bump COVER_TEMPLATE when the cover's drawing changes.
 */
export const COVER_TEMPLATE = 'pad-1'
export const COVER_WIDTH = 1500
export const COVER_HEIGHT = 630
