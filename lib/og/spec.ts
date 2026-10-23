/**
 * The OG card system (R10, D52, 19-10-2026; plan §5l): one template for every page's share card. A card is the page's
 * own words (a label, its title, the first sentence of its lead) drawn by lib/og/render.tsx. This module holds only the
 * shared shape, so the renderer and the address helpers import nothing that reads the CMS.
 */
/**
 * Whose card it is: the lockup in its top-left corner. Pulse's blog posts get the same card as ciphera.net's, with
 * Pulse's mark and name (23-10-2026: one card for both blogs). Absent means Ciphera.
 */
export type OgBrand = 'ciphera' | 'pulse'
export type OgCard = { label: string; title: string; lead?: string; brand?: OgBrand }
/** `pulse-post`: a pulse.ciphera.net blog post, keyed by its slug (lib/cms/pulse-posts.ts); its page declares the card. */
export type OgKind = 'page' | 'post' | 'term' | 'learn' | 'pulse-post'

/**
 * Bump when the drawing changes: every card's address moves with it, so no cached copy is ever stale. The edge and
 * browsers keep a card 30 days (the zone's static-files rule answers `max-age=2592000`; the route itself says a year).
 * A change that redraws only cards the old drawing broke may keep it and purge each affected card's address instead.
 * The long-title fit (23-10-2026) drew 210 of the 211 live cards byte for byte as before and fixed one (`term--pake`,
 * a word that ran off the card), so it kept `dots-1` rather than moving all 211 addresses. Done that way:
 * - the live set comes from every index, not the sitemap alone: its 71 pages, the 139 Learn pages it leaves out
 *   (noindex), and pulse.ciphera.net's posts;
 * - purge the exact card and cover addresses, never `/og/*`, and only once the deploy is `active` on Magic Containers
 *   and has held 30 minutes: a purge before then can let an old instance draw the old card into the edge for another
 *   30 days. Then fetch each one and compare it with the new drawing. Copies other sites fetched are not reachable.
 */
export const OG_TEMPLATE = 'dots-1'
export const OG_WIDTH = 1200
export const OG_HEIGHT = 630
/** The title's area on a card (renderCard): from 120 px below the top edge to 56 px above the bottom one. */
export const TITLE_TOP = 120
export const TITLE_BOTTOM = 56

/**
 * A card's cover (23-10-2026): the same card, untouched, centred on its own ground at DEV's cover shape. DEV shows every
 * cover at 1000 x 420 and crops anything else to that shape, which cut the lockup and the label off the top of a card;
 * 1500 x 630 is exactly 1000:420, so DEV only scales it. Bump COVER_TEMPLATE when the cover's drawing changes.
 */
export const COVER_TEMPLATE = 'pad-1'
export const COVER_WIDTH = 1500
export const COVER_HEIGHT = 630
