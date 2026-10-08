/**
 * The 'page' kind's runtime resolution (WEB-28, §4.2.1) — shared by the catch-all
 * route, any coded route checking for a CMS override, and `/sys/seo-state`, so none
 * of them duplicates the index-read/schema/fallback logic (same split as
 * `redirect-runtime.ts`).
 *
 * 🔴 THERE IS NO BUILD-TIME SEED FOR THIS KIND (§4.2.1: "the seed is empty" — no
 * `scripts/generate-pages.ts` exists this round). Every other runtime kind
 * (`lib/glossary`, `lib/blog.ts`, `lib/seo.ts`) falls back to a baked-in copy when the
 * CDN is unreachable; this one cannot, so a failure here resolves to `undefined` —
 * exactly what "no CMS page at this path" already means to every caller (render the
 * coded route, or 404 on the catch-all), never a stale page nor a thrown error.
 */
import { getContentDocument, getContentIndex } from './content-client'
import { isRuntimeKind, SITE_KEY } from './runtime-config'
import { routeKey } from './route-build'
import type { PageDocument } from './page-build'

const KIND = 'page'
const KNOWN_SCHEMA = 1

export type PageSource = 'cdn' | 'off'

export interface PageRuntimeState {
  enabled: boolean
  source: PageSource
  indexWatermark?: string
  publishedAt?: string
  count?: number
}

let lastState: PageRuntimeState = { enabled: isRuntimeKind(KIND), source: 'off' }

/**
 * The published CMS page at this path, or `undefined` when 'page' is off, the index
 * is unreachable/empty/on an unknown schema, or nothing is published at this path.
 * `path` is matched by the SAME slugification every other kind that keys on a path
 * uses (`routeKey` — §4.1.3a "Paths": "key = the path slugified exactly as the
 * existing route kind slugifies it").
 */
export async function resolvePage(path: string): Promise<PageDocument | undefined> {
  if (!isRuntimeKind(KIND)) {
    lastState = { enabled: false, source: 'off' }
    return undefined
  }
  try {
    const index = await getContentIndex(SITE_KEY)
    const kind = index?.kinds?.[KIND]
    if (!index || !kind || kind.schema !== KNOWN_SCHEMA) {
      lastState = { enabled: true, source: 'off' }
      return undefined
    }
    const docPath = kind.items[routeKey(path)]
    if (!docPath) {
      lastState = { enabled: true, source: 'cdn', indexWatermark: kind.watermark, publishedAt: index.published_at, count: kind.count }
      return undefined
    }
    const doc = await getContentDocument<PageDocument>(docPath)
    lastState = { enabled: true, source: 'cdn', indexWatermark: kind.watermark, publishedAt: index.published_at, count: kind.count }
    return doc
  } catch {
    // The index or the document itself was unreachable — never 500 a request over it.
    lastState = { enabled: true, source: 'off' }
    return undefined
  }
}

/** `/sys/seo-state`'s runtime block reads this — forces a fresh resolution first. */
export async function getPageRuntimeState(): Promise<PageRuntimeState> {
  await resolvePage('/__sys_page_runtime_state_probe__')
  return lastState
}

/**
 * Every published CMS page, for `app/sitemap.ts` (§4.2.1: "the sitemap reads the
 * same CDN index"). `[]` when 'page' is off, the index is unreachable, or nothing is
 * published — a sitemap entry that disappeared is simply not listed, never an error.
 * One item's own document failing to fetch drops just that item (no seed to fall
 * back to, same as `resolvePage`), not the whole sitemap.
 */
export async function getAllPages(): Promise<PageDocument[]> {
  if (!isRuntimeKind(KIND)) return []
  try {
    const index = await getContentIndex(SITE_KEY)
    const kind = index?.kinds?.[KIND]
    if (!index || !kind || kind.schema !== KNOWN_SCHEMA) return []
    const docs = await Promise.all(
      Object.values(kind.items).map(async (docPath) => {
        try {
          return await getContentDocument<PageDocument>(docPath)
        } catch {
          return null
        }
      })
    )
    return docs.filter((d): d is PageDocument => d !== null)
  } catch {
    return []
  }
}
