/**
 * The content-CDN read client every runtime kind shares.
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1.3, §4.1.3a
 *
 * 🔑 CONTENT ADDRESSING IS WHAT MAKES THE TWO CACHES SAFE. The index
 * (`content/<site>/index.json`) is the only mutable object — cached 15s, matching its
 * own edge `max-age=15` (§4.1.3a "Zone"). Every item document lives at
 * `content/<site>/<kind>/<key>.<sha8>.json`: a new edit is a new URL, so caching a
 * document FOREVER, with no eviction, is correct — the object this process already
 * holds can never become stale, because staleness would mean a different URL exists.
 *
 * 🔴 ONE Node PROCESS PER INSTANCE is the assumption these in-memory caches rest on
 * (§4.1.3 Phase 0 measurement note). They are intentionally NOT shared across
 * instances — ciphera.net runs as 42 independent Magic Containers instances, and the
 * design's whole "42 instances agree within 15s" argument is about the INDEX's TTL,
 * never about a shared cache existing.
 */
import { CONTENT_BASE, FETCH_TIMEOUT_MS, INDEX_CACHE_MS } from './runtime-config'

export interface ContentIndexKind {
  schema: number
  watermark: string
  count: number
  items: Record<string, string>
}

export interface ContentIndex {
  version: number
  site: string
  published_at: string
  watermark: string
  kinds: Record<string, ContentIndexKind>
  repairs?: unknown[]
  publisher?: { build: string }
}

interface IndexCacheEntry {
  index: ContentIndex | null
  fetchedAt: number
}

let indexCache: IndexCacheEntry | null = null
const documentCache = new Map<string, unknown>()

/** Test-only: both caches are module-level and must not leak between test cases. */
export function __resetContentCacheForTests(): void {
  indexCache = null
  documentCache.clear()
}

/**
 * This site's content index, or `null` when the site has never published anything
 * (§4.1.3a "Pass = read index from CONTENT_BASE (404 = empty)" — a 404 is a real,
 * cacheable answer, not a failure). Any OTHER failure (timeout, 5xx, a malformed body)
 * throws, and the caller decides whether that means "fall back to the seed".
 */
export async function getContentIndex(site: string): Promise<ContentIndex | null> {
  const now = Date.now()
  if (indexCache && now - indexCache.fetchedAt < INDEX_CACHE_MS) return indexCache.index

  const res = await fetch(`${CONTENT_BASE}/content/${site}/index.json`, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: 'no-store',
  })
  if (res.status === 404) {
    indexCache = { index: null, fetchedAt: now }
    return null
  }
  if (!res.ok) throw new Error(`content index: CDN returned HTTP ${res.status} for site "${site}"`)
  const index = (await res.json()) as ContentIndex
  indexCache = { index, fetchedAt: now }
  return index
}

/**
 * One content-addressed document, by its path exactly as the index names it
 * (`content/<site>/<kind>/<key>.<sha8>.json`). Cached forever once fetched — see the
 * module comment for why that is safe.
 */
export async function getContentDocument<T>(path: string): Promise<T> {
  const cached = documentCache.get(path)
  if (cached !== undefined) return cached as T

  const res = await fetch(`${CONTENT_BASE}/${path}`, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`content document: CDN returned HTTP ${res.status} for "${path}"`)
  const doc = (await res.json()) as T
  documentCache.set(path, doc)
  return doc
}
