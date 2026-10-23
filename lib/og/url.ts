import { createHash } from 'node:crypto'
import { COVER_TEMPLATE, OG_HEIGHT, OG_TEMPLATE, OG_WIDTH, type OgCard, type OgKind } from './spec'

/**
 * A card's address: `/og/<kind>--<key>--<hash>.png`, the hash being the first 12 hex of SHA-256 over the template and
 * the card's words. A changed title is a new URL, so the CDN, which keeps /og/* for a year, never shows an old card; the
 * route (app/og/[file]/route.ts) resolves the words again from the key, so nothing in a URL can make it draw text the
 * site does not say.
 */
export function cardHash(card: OgCard): string {
  return createHash('sha256')
    .update(JSON.stringify([OG_TEMPLATE, card.label, card.title, card.lead ?? '']))
    .digest('hex')
    .slice(0, 12)
}

/** A Learn article's key joins its product and slug with `~`, a character no slug contains. */
export const learnKey = (product: string, slug: string) => `${product}~${slug}`

export function cardPath(kind: OgKind, key: string, card: OgCard): string {
  return `/og/${kind}--${key}--${cardHash(card)}.png`
}

/**
 * A card's cover (lib/og/spec.ts): `/og/<kind>--<key>--<hash>--cover.png`, its hash also over COVER_TEMPLATE, so a
 * change to the cover alone moves its address too. No page declares a cover (every declared OG image is the 1200 x 630
 * card, __tests__/og-image-dimensions.test.mjs); the DEV sync asks for `<card address minus .png>--cover.png` and
 * follows the route's 308 to the current cover.
 */
export function coverHash(card: OgCard): string {
  return createHash('sha256')
    .update(JSON.stringify([OG_TEMPLATE, COVER_TEMPLATE, card.label, card.title, card.lead ?? '']))
    .digest('hex')
    .slice(0, 12)
}

export function coverPath(kind: OgKind, key: string, card: OgCard): string {
  return `/og/${kind}--${key}--${coverHash(card)}--cover.png`
}

export type OgVariant = 'card' | 'cover'

const FILE = /^(page|post|term|learn)--([a-z0-9][a-z0-9-]*(?:~[a-z0-9][a-z0-9-]*)?)--([0-9a-f]{12})(--cover)?\.png$/

export function parseCardFile(file: string): { kind: OgKind; key: string; hash: string; variant: OgVariant } | null {
  const m = FILE.exec(file)
  return m ? { kind: m[1] as OgKind, key: m[2], hash: m[3], variant: m[4] ? 'cover' : 'card' } : null
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
