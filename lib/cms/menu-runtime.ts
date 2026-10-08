/**
 * The 'menu' kind's runtime resolution (M2, WEB-28 §4.2.2) — shared by the Header/Footer
 * request-time seam and `/sys/seo-state`, same split as `page-runtime.ts` /
 * `redirect-runtime.ts`.
 *
 * 🔑 UNLIKE 'page', 'menu' HAS A SEED. A menu is on every page, so a cold instance with an
 * unreachable CDN must still render a navigation, not nothing — `menu-seed.ts`'s
 * `buildHeaderMenuDocument()` / `buildFooterMenuDocument()` express today's coded arrays
 * in the SAME document shape, mechanically, and are the fallback here exactly as
 * `lib/glossary.gen.ts` is `lib/glossary.ts`'s.
 *
 * 🔴 'menu' STAYS OFF `DEFAULT_RUNTIME_KINDS` THIS ROUND (§runtime-config.ts). With the
 * kind off, every caller here resolves straight to the seed — a real exercise of the CDN
 * path only happens once a future round flips it on.
 */
import { getContentDocument, getContentIndex } from './content-client'
import { isRuntimeKind, SITE_KEY } from './runtime-config'
import { buildHeaderMenuDocument, buildFooterMenuDocument } from './menu-seed'
import type { MenuDocument, MenuLocation } from './menu-build'

const KIND = 'menu'
const KNOWN_SCHEMA = 1

export type MenuSource = 'cdn' | 'seed' | 'off'

export interface MenuRuntimeState {
  enabled: boolean
  source: MenuSource
  indexWatermark?: string
  publishedAt?: string
  count?: number
}

const lastState: Record<MenuLocation, MenuRuntimeState> = {
  header: { enabled: isRuntimeKind(KIND), source: 'off' },
  footer: { enabled: isRuntimeKind(KIND), source: 'off' },
}

function seedFor(location: MenuLocation): MenuDocument {
  return location === 'header' ? buildHeaderMenuDocument() : buildFooterMenuDocument()
}

/**
 * This site's menu document for `location` — the published CDN document when 'menu' is a
 * runtime kind and one exists on a known schema, else the seed (today's coded navigation,
 * expressed as a document). Never `undefined`: a menu is on every page, so there is always
 * something to render, same guarantee §4.1.3's "seed/fallback" gives every other kind that
 * has one.
 */
export async function resolveMenu(location: MenuLocation): Promise<MenuDocument> {
  if (!isRuntimeKind(KIND)) {
    lastState[location] = { enabled: false, source: 'off' }
    return seedFor(location)
  }
  try {
    const index = await getContentIndex(SITE_KEY)
    const kind = index?.kinds?.[KIND]
    if (!index || !kind || kind.schema !== KNOWN_SCHEMA) {
      lastState[location] = { enabled: true, source: 'seed' }
      return seedFor(location)
    }
    const docPath = kind.items[location]
    if (!docPath) {
      lastState[location] = { enabled: true, source: 'seed', indexWatermark: kind.watermark, publishedAt: index.published_at, count: kind.count }
      return seedFor(location)
    }
    const doc = await getContentDocument<MenuDocument>(docPath)
    lastState[location] = { enabled: true, source: 'cdn', indexWatermark: kind.watermark, publishedAt: index.published_at, count: kind.count }
    return doc
  } catch {
    // The index or the document itself was unreachable — the seed, never a 500.
    lastState[location] = { enabled: true, source: 'seed' }
    return seedFor(location)
  }
}

/** `/sys/seo-state`'s runtime block reads this — forces a fresh resolution of both
 * locations first, same device as `page-runtime.ts`'s probe. */
export async function getMenuRuntimeState(): Promise<Record<MenuLocation, MenuRuntimeState>> {
  await resolveMenu('header')
  await resolveMenu('footer')
  return { header: { ...lastState.header }, footer: { ...lastState.footer } }
}
