import { resolveCard } from '@/lib/og/cards'
import { renderCard, renderCover } from '@/lib/og/render'
import type { OgCard } from '@/lib/og/spec'
import { cardHash, cardPath, coverHash, coverPath, parseCardFile } from '@/lib/og/url'

/**
 * Every page's share card (D52; plan §5l), drawn on request and kept by the CDN for 30 days (the zone's static-files
 * rule; the response itself says a year, immutable): the address carries a hash of the card's words, so a changed title
 * is a new URL and an old copy is never shown. Posts and glossary terms are runtime CMS content, so the cards cannot be
 * drawn at build time. pulse.ciphera.net's posts get their cards here too
 * (`pulse-post`, 23-10-2026).
 *
 *   unknown key or kind  404 (the words come from the page's own loaders, never from the URL)
 *   words unreadable     503, never cached (a Pulse post's words are read from the content CDN)
 *   stale hash           308 to the current card (an old share keeps working)
 *   current              200 image/png, immutable
 *
 * A `--cover` address is the same card at DEV's cover shape (lib/og/spec.ts), with its own hash and the same rules.
 * The Location is relative: behind the CDN this server sees the Magic Containers host, not ciphera.net.
 */
export const runtime = 'nodejs'

const NOT_FOUND = { status: 404, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' } }
const UNAVAILABLE = { status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '60', 'Content-Type': 'text/plain; charset=utf-8' } }

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const parsed = parseCardFile(file)
  if (!parsed) return new Response('Not found', NOT_FOUND)
  let card: OgCard | null
  try {
    card = await resolveCard(parsed.kind, parsed.key)
  } catch (err) {
    // The words could not be read, which is not "this card does not exist": the next request asks again.
    console.error(`og: reading the words for ${file} failed`, err)
    return new Response('Card unavailable', UNAVAILABLE)
  }
  if (!card) return new Response('Not found', NOT_FOUND)
  const cover = parsed.variant === 'cover'
  if ((cover ? coverHash(card) : cardHash(card)) !== parsed.hash) {
    const current = cover ? coverPath(parsed.kind, parsed.key, card) : cardPath(parsed.kind, parsed.key, card)
    return new Response(null, {
      status: 308,
      headers: { Location: current, 'Cache-Control': 'public, max-age=300' },
    })
  }
  try {
    const png = await (cover ? renderCover(card) : renderCard(card))
    return new Response(png, {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
    })
  } catch (err) {
    // Never cached: the next request draws it again.
    console.error(`og: rendering ${file} failed`, err)
    return new Response('Card unavailable', { status: 500, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' } })
  }
}
