/**
 * The Pulse blog's posts as pulse.ciphera.net publishes them, read for one thing: their share cards. ciphera.net draws
 * every card for both blogs (23-10-2026, lib/og), and a card's words must be the ones the post's page shows.
 * pulse.ciphera.net's own publisher (cms-publisher-pulse, SITE=pulse) writes `content/pulse/...` to the same content
 * zone as ours, and its post page renders the document's `title` and hashes that same string into the card's address
 * (Pulse/pulse-website lib/blog-card.ts), so the title is taken from the document as it is, untrimmed.
 *
 *   a title    the post is published
 *   null       Pulse has published nothing, no blog kind, or not this slug: an unpublished post leaves the index on the
 *              publisher's next pass, so the index is the list of what exists (no UNPUBLISHED list here)
 *   throws     the CDN timed out or failed, or the documents changed shape: never answered as "does not exist"
 */
import { getContentDocument, getContentIndex } from './content-client'

export const PULSE_SITE = 'pulse'
const KIND = 'blog'
/** The blog documents' shape this code reads (WpBlogPost); a publisher that changes it bumps the index's schema. */
const KNOWN_SCHEMA = 1

export async function getPulsePostTitle(slug: string): Promise<string | null> {
  const index = await getContentIndex(PULSE_SITE)
  const kind = index?.kinds?.[KIND]
  if (!kind) return null
  if (kind.schema !== KNOWN_SCHEMA) throw new Error(`pulse blog: the index says schema ${kind.schema}, this build reads ${KNOWN_SCHEMA}`)
  // Own keys only: a slug such as `constructor` must not read Object.prototype.
  const path = Object.hasOwn(kind.items, slug) ? kind.items[slug] : undefined
  if (!path) return null
  const doc = await getContentDocument<{ title?: unknown }>(path)
  if (typeof doc.title !== 'string' || doc.title.trim() === '') throw new Error(`pulse blog: ${path} has no title`)
  return doc.title
}
