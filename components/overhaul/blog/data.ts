/**
 * Round 7 (mock, 18-10-2026): what the blog options read, all on the server. Posts come from the same resolver the live
 * blog uses (CMS content zone first, build seed as fallback), so every option shows the 18 live posts.
 *
 * 🔴 Dates are formatted HERE, in UTC, never in the browser. A date-only string ('2026-10-13') parses as UTC midnight,
 * and the live index formats it in the visitor's zone inside a client component, so readers west of UTC see the day
 * before (plan §5i). Spelled-out dates, as Trust and About print them. Server-only by construction: lib/blog reads the
 * filesystem.
 */
import { getBlogPost, getBlogPosts, type BlogPost, type BlogPostMeta } from '@/lib/blog'
import { UNPUBLISHED } from './content'

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** '2026-10-07' → '7 October 2026'. Anything that is not an ISO date is returned as it came. */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  return DATE.format(new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])))
}

/** Revised after publication: the day differs. A same-day edit is not an update a reader needs to know about. */
export function updatedDate(post: Pick<BlogPostMeta, 'date' | 'dateModified'>): string | null {
  const d = post.date.slice(0, 10)
  const m = (post.dateModified || '').slice(0, 10)
  return m && m > d ? m : null
}

/** Always computed (200 words a minute, the house rate): the CMS's manual override drifts (plan §5i). */
export function readMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200))
}

/** The posts the site will list: the live set without the four D39 unpublishes. */
export async function loadPosts(): Promise<BlogPostMeta[]> {
  const gone = new Set<string>(UNPUBLISHED)
  return (await getBlogPosts()).filter((p) => !gone.has(p.slug))
}

export async function loadPost(slug: string): Promise<BlogPost | null> {
  return getBlogPost(slug)
}

/**
 * Whether /blog/<slug> has a post: the ONE answer, asked by the post route and by proxy.ts before anything renders
 * (lib/routing/not-found-routes.mjs says why the proxy must ask). The four D39 posts redirect before they get here
 * (lib/redirects.gen.ts); until the CMS unpublishes them, they count as missing.
 */
export async function postExists(slug: string): Promise<boolean> {
  if ((UNPUBLISHED as readonly string[]).includes(slug)) return false
  return (await loadPost(slug)) !== null
}

/** The neighbours in the index's order (newest first): previous = the older post, next = the newer one. */
export function neighbours(posts: BlogPostMeta[], slug: string): { previous: BlogPostMeta | null; next: BlogPostMeta | null } {
  const i = posts.findIndex((p) => p.slug === slug)
  if (i < 0) return { previous: null, next: null }
  return { previous: posts[i + 1] ?? null, next: posts[i - 1] ?? null }
}
