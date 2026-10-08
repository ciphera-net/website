import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CmsPage } from '@/components/cms/CmsPage'
import { buildPageDocument, type WpPageNode } from '@/lib/cms/page-build'

/**
 * Draft preview for a `ciphera_page` — `cms.ciphera.net/preview/page/<databaseId>`
 * (WEB-28, §4.2.1). Mirrors `app/preview/[slug]/page.tsx` exactly: same gate (this
 * route ships in the production image and is inert there — `WORDPRESS_GRAPHQL_URL`
 * is only set on the in-cluster `blog-preview` Deployment), same Basic-Auth service
 * account, same 10s ceiling, same "a GraphQL error is shown, not swallowed" rule.
 *
 * 🔴 NO SLUG SEGMENT AT ALL — unlike the blog's `[slug]?id=`, a page has no slug
 * concept; it is addressed by PATH, which a draft may not have settled on yet. The
 * link WordPress emits therefore carries only the id (§4.2.1's own URL), so there is
 * no slug-fallback branch to port from the blog route.
 *
 * 🔑 RUNS THROUGH THE SAME TRANSFORM AS PUBLISHING. `buildPages()` is the one
 * function deciding what a page's sections and SEO fields resolve to — a preview
 * that skipped it could show a draft looking different from what publishing will
 * actually produce, which is exactly the disagreement a preview exists to prevent.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const WP = process.env.WORDPRESS_GRAPHQL_URL
const WP_AUTH = process.env.WORDPRESS_PREVIEW_AUTH

/** Same shape as app/preview/[slug]/page.tsx's own `DATABASE_ID` / `GRAPHQL_INT32_MAX`. */
const DATABASE_ID = /^[1-9][0-9]{0,9}$/
const GRAPHQL_INT32_MAX = 2147483647

const PREVIEW_QUERY = `query Preview($id: Int!) {
  cipheraPages(first: 1, where: { id: $id }) {
    nodes {
      databaseId cipheraPath cipheraSections modifiedGmt
      cipheraTitle cipheraDescription cipheraCanonical
      cipheraOgTitle cipheraOgDescription cipheraOgImage
      cipheraTwitterTitle cipheraTwitterDescription
      routeSites { nodes { slug } }
    }
  }
}`

async function fetchDraft(id: number): Promise<{ node: WpPageNode | null; error: string | null }> {
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
    return { node: body?.data?.cipheraPages?.nodes?.[0] ?? null, error: null }
  } catch (e) {
    return { node: null, error: (e as Error).message }
  }
}

// Same banner as app/preview/[slug]/page.tsx (R20: under the header; R22: no problem list).
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

export default async function PagePreview({ params }: { params: Promise<{ id: string }> }) {
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
          <p className="mt-2 text-sm text-muted-foreground">
            The page itself is fine — this is the preview service failing to read it. Tell Ciphera.
          </p>
        </div>
      </section>
    )
  }
  if (!node) notFound()

  // Site first, same ordering PULSE-157 proved matters (both sites' pages live in
  // one WordPress) — a Pulse draft must never render inside ciphera.net's chrome.
  const site = (node.routeSites?.nodes ?? []).some((t) => t.slug === 'ciphera-net')
  if (!site) notFound()

  // buildPageDocument() — never buildPages() — on purpose: a draft's path may be
  // empty, malformed, or collide with a coded route, and none of that is a reason
  // to show the editor nothing. Path validity is the publisher's and the review
  // queue's concern; this route renders the sections regardless.
  const page = buildPageDocument(node, () => {})

  return (
    <>
      <Banner />
      <CmsPage page={page} />
    </>
  )
}
