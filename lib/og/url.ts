import { createHash } from 'node:crypto'
import { COVER_TEMPLATE, OG_HEIGHT, OG_TEMPLATE, OG_WIDTH, type OgCard, type OgKind } from './spec'

/**
 * A card's address: `/og/<kind>--<key in hex>--<hash>.png`, the hash being the first 12 hex of SHA-256 over the template
 * and the card's words. A changed title is a new URL, so the CDN and browsers, which keep a card 30 days, never show an
 * old one; the route (app/og/[file]/route.ts) resolves the words again from the key, so nothing in a URL can make it draw
 * text the site does not say.
 *
 * 🔴 THE KEY IS WRITTEN IN HEX, NEVER AS THE SLUG (27-10-2026). Blockers hide any image whose address contains a word
 * their lists target: EasyList Cookie's `-cookie-consent-$~script` hid the card of the Pulse post `cookie-consent` on its
 * blog index, and a slug is words an editor chose (Public/docs/audits/27-10-2026-share-card-hidden-by-cookie-notice-filters.md).
 * Hex has only 0-9 and a-f, which cannot spell what those lists look for. The `_` in front marks the form: no slug starts
 * with one.
 */
export function cardHash(card: OgCard): string {
  return createHash('sha256')
    .update(JSON.stringify([OG_TEMPLATE, ...brandPart(card), card.label, card.title, card.lead ?? '']))
    .digest('hex')
    .slice(0, 12)
}

/** A brand other than Ciphera is part of the hash; Ciphera's cards keep the addresses they had before brands existed. */
const brandPart = (card: OgCard) => (card.brand && card.brand !== 'ciphera' ? [card.brand] : [])

/** A Learn article's key joins its product and slug with `~`, a character no slug contains. */
export const learnKey = (product: string, slug: string) => `${product}~${slug}`

/** A key as an address writes it: `_` and the key's bytes in lowercase hex (`about` is `_61626f7574`). */
export const addressKey = (key: string) => `_${Buffer.from(key, 'utf8').toString('hex')}`

export function cardPath(kind: OgKind, key: string, card: OgCard): string {
  return `/og/${kind}--${addressKey(key)}--${cardHash(card)}.png`
}

/**
 * A card's cover (lib/og/spec.ts): `/og/<kind>--<key in hex>--<hash>--cover.png`, its hash also over COVER_TEMPLATE, so a
 * change to the cover alone moves its address too. No page declares a cover (every declared OG image is the 1200 x 630
 * card, __tests__/og-image-dimensions.test.mjs); the DEV sync asks for `<card address minus .png>--cover.png` and
 * follows the route's 308 to the current cover.
 */
export function coverHash(card: OgCard): string {
  return createHash('sha256')
    .update(JSON.stringify([OG_TEMPLATE, COVER_TEMPLATE, ...brandPart(card), card.label, card.title, card.lead ?? '']))
    .digest('hex')
    .slice(0, 12)
}

export function coverPath(kind: OgKind, key: string, card: OgCard): string {
  return `/og/${kind}--${addressKey(key)}--${coverHash(card)}--cover.png`
}

export type OgVariant = 'card' | 'cover'

const KEY = /^[a-z0-9][a-z0-9-]*(?:~[a-z0-9][a-z0-9-]*)?$/
/** The longest key an address carries, in bytes (a WordPress slug is at most 200). */
const MAX_KEY_BYTES = 256
const FILE = /^(page|post|term|learn|pulse-post)--(_[0-9a-f]+|[a-z0-9][a-z0-9-]*(?:~[a-z0-9][a-z0-9-]*)?)--([0-9a-f]{12})(--cover)?\.png$/

/**
 * A card or cover address read back. `legacy` is an address from before keys were hex (`post--privacy-tools--…`, until
 * 27-10-2026): it still resolves, and the route answers it with a 308 to the hex address, so an earlier share keeps its
 * picture.
 */
export function parseCardFile(
  file: string,
): { kind: OgKind; key: string; hash: string; variant: OgVariant; legacy: boolean } | null {
  const m = FILE.exec(file)
  if (!m) return null
  const legacy = !m[2].startsWith('_')
  const key = legacy ? m[2] : keyFromHex(m[2].slice(1))
  if (key === null) return null
  return { kind: m[1] as OgKind, key, hash: m[3], variant: m[4] ? 'cover' : 'card', legacy }
}

/** The key a hex address names, or null unless the hex is exactly how addressKey writes a valid key. */
function keyFromHex(hex: string): string | null {
  if (hex.length % 2 !== 0 || hex.length > MAX_KEY_BYTES * 2) return null
  const key = Buffer.from(hex, 'hex').toString('utf8')
  return KEY.test(key) && addressKey(key) === `_${hex}` ? key : null
}

/** A page's `openGraph.images` and `twitter.images`: its own card, at the size the card is. */
export function ogCardImages(kind: OgKind, key: string, card: OgCard) {
  const url = cardPath(kind, key, card)
  return {
    openGraph: [{ url, width: OG_WIDTH, height: OG_HEIGHT, alt: card.title }],
    twitter: [url],
  }
}

/**
 * True when a page's metadata already carries a system card. The CMS route stubs and page SEO can set an image too
 * (lib/seo.ts); a page with a card keeps it, so a stub's older image never replaces it.
 */
export function hasSystemCard(images: unknown): boolean {
  const list = Array.isArray(images) ? images : images ? [images] : []
  return list.some((i) => {
    const url = typeof i === 'string' ? i : i instanceof URL ? i.href : i && typeof i === 'object' && 'url' in i ? String((i as { url: unknown }).url) : ''
    return url.startsWith('/og/') || url.startsWith('https://ciphera.net/og/')
  })
}
