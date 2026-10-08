/**
 * The redirect kind's runtime resolution — shared by middleware.ts (which only cares
 * about the match) and /sys/seo-state (which only cares about the state), so neither
 * duplicates the index-read/schema/fallback logic (WEB-26 round 2, §4.1.3a R13).
 */
import { getContentDocument, getContentIndex } from './content-client'
import { isRuntimeKind, SITE_KEY } from './runtime-config'

const KIND = 'redirect'
const KNOWN_SCHEMA = 1
/** §4.1.3a "redirects are ONE document per site, key 'all'". */
const DOC_KEY = 'all'

export interface RedirectDoc {
  redirects: Array<{ source: string; destination: string; permanent: true }>
}

export type RedirectSource = 'cdn' | 'off'

export interface RedirectRuntimeState {
  enabled: boolean
  source: RedirectSource
  indexWatermark?: string
  publishedAt?: string
  count?: number
}

let lastState: RedirectRuntimeState = { enabled: isRuntimeKind(KIND), source: 'off' }

/** middleware.ts's only call — returns the document (or undefined on anything short
 * of a healthy, schema-matching index), never throwing past this module. */
export async function resolveRedirectDoc(): Promise<RedirectDoc | undefined> {
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
    const docPath = kind.items[DOC_KEY]
    if (!docPath) {
      lastState = { enabled: true, source: 'cdn', indexWatermark: kind.watermark, publishedAt: index.published_at, count: 0 }
      return undefined
    }
    const doc = await getContentDocument<RedirectDoc>(docPath)
    lastState = {
      enabled: true,
      source: 'cdn',
      indexWatermark: kind.watermark,
      publishedAt: index.published_at,
      count: doc.redirects.length,
    }
    return doc
  } catch {
    // A CDN failure must never 500 a request — see middleware.ts's own comment.
    lastState = { enabled: true, source: 'off' }
    return undefined
  }
}

/** `/sys/seo-state`'s runtime block reads this — forces a fresh resolution first. */
export async function getRedirectRuntimeState(): Promise<RedirectRuntimeState> {
  await resolveRedirectDoc()
  return lastState
}
