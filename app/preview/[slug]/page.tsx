import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BlogPostView } from '@/components/blog/post-view'
import { getBlogPosts } from '@/lib/blog'
import { WP_POST_FIELDS, transformWpPost, nodeSites, BLOG_SITE, type WpNode, type TransformProblem } from '@/lib/blog-transform'

/**
 * Draft preview for the CMS.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.9, D14
 *
 * 🔴 THIS ROUTE SHIPS IN THE PRODUCTION IMAGE AND IS INERT THERE.
 * `WORDPRESS_GRAPHQL_URL` is unset on Magic Containers, so every request 404s. It is
 * set only on the single-replica in-cluster `blog-preview` Deployment, which sits
 * behind cms.ciphera.net's existing basicAuth gate and can reach WordPress. Shipping
 * one image and switching on an environment variable is what avoids a second build,
 * a second registry tag and a second thing to keep in step.
 *
 * ⚠️ THE GUARD IS THE ENV VAR, NOT AN `if (production)`. A build-time flag would be
 * baked in, and the whole point is that the same artefact behaves differently
 * depending on where it runs.
 *
 * 🔴 REQUEST-TIME RENDERING HERE DOES NOT CONTRADICT D1. Content still reaches
 * ciphera.net at BUILD time; this is a separate, gated, single-replica surface whose
 * entire job is to be current. One region, one cache, coherent by construction — the
 * exact property 42 Magic Containers instances cannot have.
 */
export const dynamic = 'force-dynamic'

/** Nothing here may ever be indexed, and nothing here is in the sitemap. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const WP = process.env.WORDPRESS_GRAPHQL_URL
const CDN = process.env.NEXT_PUBLIC_CDN_URL ?? 'https://cdn.ciphera.net/website'
/**
 * ⚠️ A WordPress Application Password for ONE service account. Without it WPGraphQL
 * returns published posts only — and a preview that cannot show a draft is a preview
 * of nothing.
 */
const WP_AUTH = process.env.WORDPRESS_PREVIEW_AUTH

/**
 * A WordPress `databaseId`, exactly as the Ready-to-publish box's "Preview this draft"
 * link carries it (`?id=<databaseId>`, plan §10.3). No leading zero, 1-10 digits —
 * `databaseId` is a Postgres-free MySQL `bigint`, never negative, never zero.
 * Rejected BEFORE any fetch: an invalid `id` must not reach WordPress as a GraphQL
 * variable at all.
 */
const DATABASE_ID = /^[1-9][0-9]{0,9}$/

async function fetchDraft(slug: string, id: number | null): Promise<{ node: WpNode | null; error: string | null }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (WP_AUTH) headers.Authorization = `Basic ${Buffer.from(WP_AUTH).toString('base64')}`

  // 🔴 THE CONNECTION, NOT `blogPost(idType: SLUG)`. Measured: the single-node SLUG
  // resolver returns **null** for a draft — not because WPGraphQL restricts that
  // lookup, but because the `WP_Query` built for `idType: SLUG` never sets
  // `post_status` at all (WordPress's own public-status default), upstream of
  // WPGraphQL's visibility layer entirely. The same credential, on the same
  // request, gets the draft from `blogPosts(where: { name: … })` and nothing from
  // `blogPost`. A block-editor draft also carries `post_name ""` until publish
  // (WEB-17), so a name lookup alone can never find one regardless of this
  // mechanism — which is what the `id` lookup below exists for.
  // ⚠️ It fails by returning null, not by erroring — so it reads exactly like "that
  // post does not exist", which is the wrong diagnosis and the reason this took a
  // live query to find rather than a careful read.
  const query =
    id !== null
      ? `query Preview($id: Int!) {
          blogPosts(first: 1, where: { id: $id }) { nodes { ${WP_POST_FIELDS} } }
        }`
      : `query Preview($slug: String!) {
          blogPosts(first: 1, where: { name: $slug }) { nodes { ${WP_POST_FIELDS} } }
        }`
  const variables = id !== null ? { id } : { slug }

  try {
    const res = await fetch(WP as string, {
      method: 'POST',
      headers,
      cache: 'no-store',
      // 🔴 10s CEILING. An editor is sitting in front of this waiting for a page to
      // load — a hung WordPress connection must end in the "Preview unavailable"
      // state below, not hang the request forever.
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({ query, variables }),
    })
    if (!res.ok) return { node: null, error: `WordPress returned HTTP ${res.status}` }
    const body = await res.json()
    // 🔑 A GraphQL error here is shown, not swallowed. The commonest cause is the
    // service account's password having been rotated, and "the post is missing" is a
    // very misleading way to report that.
    if (body.errors?.length) return { node: null, error: body.errors[0]?.message ?? 'GraphQL error' }
    return { node: body?.data?.blogPosts?.nodes?.[0] ?? null, error: null }
  } catch (e) {
    return { node: null, error: (e as Error).message }
  }
}

function Banner({ status, problems }: { status: string; problems: TransformProblem[] }) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card px-6 py-3">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="text-foreground">
          <span className="mr-2 text-primary">●</span>
          Preview — <span className="tabular-nums">{status}</span>. This is not the live page.
        </span>
        {problems.length > 0 && (
          <span className="text-muted-foreground">
            {problems.length} thing{problems.length > 1 ? 's' : ''} would stop this publishing:{' '}
            {problems.map((p) => p.message).join('; ')}
          </span>
        )}
      </div>
    </div>
  )
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ id?: string | string[] }>
}) {
  // 🔴 NOT AN ERROR PAGE — A 404. On ciphera.net this route must be indistinguishable
  // from a path that does not exist. An error page would advertise that a preview
  // surface exists and invite somebody to go looking for it.
  if (!WP) notFound()

  const { slug } = await params
  const { id: idParam } = await searchParams
  const rawId = Array.isArray(idParam) ? idParam[0] : idParam

  // 🔴 REJECTED BEFORE ANY FETCH. A present-but-malformed `id` 404s here, without
  // ever reaching `fetchDraft` — the shape pulse-website's own route follows too
  // (plan §10.2, "exactly as pulse-website will").
  let id: number | null = null
  if (rawId !== undefined) {
    if (!DATABASE_ID.test(rawId)) notFound()
    id = Number(rawId)
  }

  const { node, error } = await fetchDraft(slug, id)

  if (error) {
    return (
      <section className="px-6 pt-32">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-2xl font-semibold text-foreground">Preview unavailable</h1>
          <p className="mt-4 text-muted-foreground">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The post itself is fine — this is the preview service failing to read it. Tell Ciphera.
          </p>
        </div>
      </section>
    )
  }
  if (!node) notFound()

  // 🔴 SITE FIRST, before the transform — exactly the order PULSE-157 proved matters
  // (scripts/generate-seo.ts). Pulse's blog posts (Phase 4,
  // Pulse/docs/plans/30-09-2026-pulse-headless-cms-phase-4-design.md §7) live in the
  // same WordPress. Without this, a Pulse draft would render inside ciphera.net's own
  // chrome — a 404 here is correct, not a bug: this preview serves ciphera.net only.
  if (!nodeSites(node).includes(BLOG_SITE)) notFound()

  const { post, problems } = transformWpPost(node, CDN)
  if (!post) notFound()

  // ⚠️ The transform reports problems rather than throwing them, so the preview can
  // render the post AND say what would stop it publishing. The build turns the same
  // list into a red pipeline. One transform, two consequences (lib/blog-transform.ts).
  const status = node.slug && post.date ? `draft or published, last saved ${post.dateModified}` : 'draft'

  return (
    <>
      <Banner status={status} problems={problems} />
      <BlogPostView
        post={{ ...post, content: post.html, body: { kind: 'html', content: post.html } }}
        allPosts={getBlogPosts()}
      />
    </>
  )
}
