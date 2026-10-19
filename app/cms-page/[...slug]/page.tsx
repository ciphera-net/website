import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { resolvePage } from '@/lib/cms/page-runtime'
import { CmsPage } from '@/components/cms/CmsPage'
import { CMS_PAGE_HEADER } from '@/lib/routing/not-found-routes.mjs'

/**
 * A NEW CMS page — an address no coded route owns at all (WEB-28, §4.2.1 "Rendering
 * rule": "a path no coded route owns is served by a catch-all route when a published
 * document exists, else 404").
 *
 * 🔑 REACHED ONLY THROUGH A REWRITE (R11, 20-10-2026). This was `app/[...slug]`, a
 * catch-all at the root: every unknown address matched it, rendered on demand, and
 * called `notFound()`, which Next 16 answers with an EMPTY `<html id="__next_error__">`
 * shell (lib/routing/not-found-routes.mjs has the reason). Now proxy.ts looks the path
 * up in the content index first and sets `CMS_PAGE_HEADER` when a page is there, and
 * next.config.ts's FALLBACK rewrite sends only those requests here, at their own
 * address (`/new-page` renders as `/new-page`; this folder's name never shows). An
 * address without a page matches no route at all, and Next serves its own not-found
 * page, rendered in full.
 *
 * 🔴 NEVER SHADOWS AN EXISTING ROUTE. A fallback rewrite runs only after every static
 * and dynamic route has failed to match — `/blog/x` resolves through
 * `app/blog/[slug]/page.tsx` before the rewrite is even considered, with no code here
 * making that true. `lib/cms/page-build.ts` is the publish-time half of the same rule:
 * it skips a page whose path a coded route owns unless that path is in
 * `MIGRATABLE_PAGE_PATHS` (empty since the product pages became Tier-1 redirects), so
 * this route is reached only for an address nothing in `app/` claims.
 *
 * 🔴 NO generateStaticParams, NOT EVEN `[]`. Returning an empty array would still
 * tell Next this segment is statically generated with a fallback, which ISR-caches
 * whatever an unlisted path resolves to (including a 404) for a year — the design's
 * own warning. Omitting the function entirely keeps every request here dynamically
 * rendered on demand, exactly like `app/glossary/[slug]/page.tsx` already does for
 * the same reason. `dynamicParams` stays its default `true`.
 */

interface Props {
  params: Promise<{ slug: string[] }>
}

function pathFromSlug(slug: string[]): string {
  return '/' + slug.join('/')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await resolvePage(pathFromSlug(slug))
  if (!page) return {}

  const { seo } = page
  const canonical = seo.canonical || `https://ciphera.net${page.path}`
  const title = seo.ogTitle || seo.title
  const description = seo.ogDescription || seo.description

  return {
    ...(seo.title ? { title: { absolute: seo.title } } : {}),
    ...(seo.description ? { description: seo.description } : {}),
    alternates: { canonical },
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url: canonical,
      siteName: 'Ciphera',
      locale: 'en_US',
      type: 'website',
      ...(seo.ogImage ? { images: [{ url: seo.ogImage, width: 1200, height: 630, alt: title || 'Ciphera' }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@CipheraNET',
      ...(seo.twitterTitle || seo.title ? { title: seo.twitterTitle || seo.title } : {}),
      ...(seo.twitterDescription || seo.description ? { description: seo.twitterDescription || seo.description } : {}),
      ...(seo.ogImage ? { images: [seo.ogImage] } : {}),
    },
  }
}

export default async function CmsPageRoute({ params }: Props) {
  // The second lock on the same door: proxy.ts answers a direct /cms-page/... request with the not-found page, and a
  // request that reaches this file without the header did not come through the rewrite.
  if ((await headers()).get(CMS_PAGE_HEADER) !== '1') notFound()
  const { slug } = await params
  const page = await resolvePage(pathFromSlug(slug))
  if (!page) notFound()
  return <CmsPage page={page} />
}
