import { resolveCard } from '@/lib/og/cards'
import { renderCard } from '@/lib/og/render'
import { cardHash, cardPath, parseCardFile } from '@/lib/og/url'

/**
 * Every page's share card (D52; plan §5l), drawn on request and kept by the CDN for a year: the address carries a hash of
 * the card's words, so a changed title is a new URL and an old copy is never shown. Posts and glossary terms are runtime
 * CMS content, so the cards cannot be drawn at build time.
 *
 *   unknown key or kind  404 (the words come from the page's own loaders, never from the URL)
 *   stale hash           308 to the current card (an old share keeps working)
 *   current              200 image/png, immutable
 *
 * The Location is relative: behind the CDN this server sees the Magic Containers host, not ciphera.net.
 */
export const runtime = 'nodejs'

const NOT_FOUND = { status: 404, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' } }

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const parsed = parseCardFile(file)
  if (!parsed) return new Response('Not found', NOT_FOUND)
  const card = await resolveCard(parsed.kind, parsed.key)
  if (!card) return new Response('Not found', NOT_FOUND)
  if (cardHash(card) !== parsed.hash) {
    return new Response(null, {
      status: 308,
      headers: { Location: cardPath(parsed.kind, parsed.key, card), 'Cache-Control': 'public, max-age=300' },
    })
  }
  try {
    const png = await renderCard(card)
    return new Response(png, {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
    })
  } catch (err) {
    // Never cached: the next request draws it again.
    console.error(`og: rendering ${file} failed`, err)
    return new Response('Card unavailable', { status: 500, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' } })
  }
}
