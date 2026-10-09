/** Render-harness-only shim (WEB-28 parity) — same reasoning as the next/navigation
 * shim: `resolvePage()` really reads a CDN index/document (`lib/cms/content-client.ts`),
 * which this harness must never do (hermetic, no network). `__setPage`/`__clearPages`
 * let the harness drive both branches of every migratable page (`if (cms) {…} else {…}`)
 * through the SAME shim. `mergePageSeo` is pure — re-exported from the REAL module via
 * a relative path (not the `@/lib/cms/page-runtime` specifier, which esbuild's
 * `--alias` would redirect back to this very file). */
import type { PageDocument } from '../../lib/cms/page-build'

export { mergePageSeo } from '../../lib/cms/page-runtime'

const pages = new Map<string, PageDocument>()

export function __setPage(path: string, doc: PageDocument): void {
  pages.set(path, doc)
}
export function __clearPages(): void {
  pages.clear()
}

export async function resolvePage(path: string): Promise<PageDocument | undefined> {
  return pages.get(path)
}
