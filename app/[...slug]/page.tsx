import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { resolvePage } from '@/lib/cms/page-runtime'
import { CmsPage } from '@/components/cms/CmsPage'

/**
 * The catch-all for a NEW CMS page — an address no coded route owns at all
 * (WEB-28, §4.2.1 "Rendering rule": "a path no coded route owns is served by a
 * catch-all route when a published document exists, else 404").
 *
 * 🔴 NEVER SHADOWS AN EXISTING ROUTE. Next's own router gives every static and
 * dynamic segment precedence over a catch-all — `/blog/x` resolves through
 * `app/blog/[slug]/page.tsx` long before this file is even considered, with no code
 * here making that true. `MIGRATABLE_PAGE_PATHS` (empty for ciphera.net this round)
 * is the publish-time half of the same rule: `lib/cms/page-build.ts` already skips a
 * page whose path a coded route owns, so this route is reached only for an address
 * nothing in `app/` claims.
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

export default async function CmsCatchAllPage({ params }: Props) {
  const { slug } = await params
  const page = await resolvePage(pathFromSlug(slug))
  if (!page) notFound()
  return <CmsPage page={page} />
}
