/** Render-harness-only shim (WEB-28 parity) — the real `seoForAsync` (`lib/seo.ts`)
 * imports `./seo.gen` (a gitignored, WordPress-generated file that does not exist
 * outside a real `npm run prebuild`) and, with the 'route' runtime kind on by
 * default, reads the content CDN — neither of which this harness can or should do.
 * This always returns `fallback` unchanged, exactly what the real function does
 * when nothing is published for the path (true in this harness, and true in
 * production for every path this round's seeds don't publish) — the one thing
 * under test is `mergePageSeo`'s own merge, not the unrelated 'route' SEO-stub
 * feature. */
import type { Metadata } from 'next'

export async function seoForAsync(_path: string, fallback: Metadata): Promise<Metadata> {
  return fallback
}
