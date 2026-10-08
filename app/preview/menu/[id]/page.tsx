import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import TrustStrip from '@/components/TrustStrip'
import FeatureSection from '@/components/feature-section'
import ProductShowcase from '@/components/ProductShowcase'
import SwissPrivacy from '@/components/SwissPrivacy'
import FAQ from '@/components/FAQ'
import ClosingCta from '@/components/ClosingCta'
import { HeaderClient } from '@/components/ui/header-3'
import { FooterView } from '@/components/Footer'
import { buildMenuDocument, isMenuLocation, type WpMenuNode } from '@/lib/cms/menu-build'
import { buildHeaderMenuDocument, buildFooterMenuDocument, HEADER_MEDIA_KEYS, FOOTER_MEDIA_KEYS } from '@/lib/cms/menu-seed'
import { ownedByCodedRoute } from '@/lib/cms/page-build'

/**
 * Draft preview for a `ciphera_menu` — `cms.ciphera.net/preview/menu/<databaseId>`
 * (M2, §4.2.2). Mirrors `app/preview/page/[id]/page.tsx`'s gate exactly.
 *
 * 🔴 THE HOME PAGE IS RENDERED WITH ONLY THE PREVIEWED LOCATION SWAPPED. The OTHER
 * location (footer on a header draft, header on a footer draft) renders its own live
 * seed — same as a real page always does — so an editor previewing a header draft is
 * not also looking at a stale/unrelated footer draft.
 *
 * ⚠️ KNOWN LIMITATION (logged, not silently covered): this route still renders inside
 * the root layout's own `<Header/>`/`<Footer/>` (the live site chrome), because moving
 * Header/Footer out of the root layout to suppress them here would touch every route in
 * the app. The draft renders as this page's OWN content, directly below the real site
 * header and above the real site footer — an editor sees the draft, just not with the
 * surrounding chrome fully substituted.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const WP = process.env.WORDPRESS_GRAPHQL_URL
const WP_AUTH = process.env.WORDPRESS_PREVIEW_AUTH

const DATABASE_ID = /^[1-9][0-9]{0,9}$/
const GRAPHQL_INT32_MAX = 2147483647

const PREVIEW_QUERY = `query Preview($id: Int!) {
  cipheraMenus(first: 1, where: { id: $id }) {
    nodes {
      databaseId cipheraMenuLocation cipheraMenu modifiedGmt
      routeSites { nodes { slug } }
    }
  }
}`

async function fetchDraft(id: number): Promise<{ node: WpMenuNode | null; error: string | null }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (WP_AUTH) headers.Authorization = `Basic ${Buffer.from(WP_AUTH).toString('base64')}`

  try {
    const res = await fetch(WP as string, {
      method: 'POST',
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({ query: PREVIEW_QUERY, variables: { id } }),
    })
    if (!res.ok) return { node: null, error: `WordPress returned HTTP ${res.status}` }
    const body = await res.json()
    if (body.errors?.length) return { node: null, error: body.errors[0]?.message ?? 'GraphQL error' }
    return { node: body?.data?.cipheraMenus?.nodes?.[0] ?? null, error: null }
  } catch (e) {
    return { node: null, error: (e as Error).message }
  }
}

function Banner() {
  return (
    <div className="relative border-b border-border bg-card px-6 py-3">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="text-foreground">
          <span className="mr-2 text-primary">●</span>
          Preview — draft. This is not the live page.
        </span>
      </div>
    </div>
  )
}

function HomeBody() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeatureSection />
      <ProductShowcase />
      <SwissPrivacy />
      <FAQ />
      <ClosingCta />
    </>
  )
}

export default async function MenuPreview({ params }: { params: Promise<{ id: string }> }) {
  if (!WP) notFound()

  const { id: rawId } = await params
  if (!DATABASE_ID.test(rawId)) notFound()
  const id = Number(rawId)
  if (id > GRAPHQL_INT32_MAX) notFound()

  const { node, error } = await fetchDraft(id)

  if (error) {
    return (
      <section className="px-6 pt-32">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-2xl font-semibold text-foreground">Preview unavailable</h1>
          <p className="mt-4 text-muted-foreground">{error}</p>
        </div>
      </section>
    )
  }
  if (!node) notFound()

  const site = (node.routeSites?.nodes ?? []).some((t) => t.slug === 'ciphera-net')
  if (!site) notFound()

  const location = isMenuLocation(node.cipheraMenuLocation) ? node.cipheraMenuLocation : 'header'
  const draft = buildMenuDocument(
    node,
    { isKnownPath: (p) => ownedByCodedRoute(p), allowedMedia: location === 'header' ? HEADER_MEDIA_KEYS : FOOTER_MEDIA_KEYS },
    () => {}
  )

  const headerDoc = location === 'header' ? draft : buildHeaderMenuDocument()
  const footerDoc = location === 'footer' ? draft : buildFooterMenuDocument()

  return (
    <>
      <Banner />
      <HeaderClient menuDocument={headerDoc} />
      <HomeBody />
      <FooterView doc={footerDoc} />
    </>
  )
}
