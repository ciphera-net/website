import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BlogPostView } from '@/components/blog/post-view'
import { getBlogPosts } from '@/lib/blog'
import { WP_POST_FIELDS, transformWpPost, type WpNode, type TransformProblem } from '@/lib/blog-transform'

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

async function fetchDraft(slug: string): Promise<{ node: WpNode | null; error: string | null }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (WP_AUTH) headers.Authorization = `Basic ${Buffer.from(WP_AUTH).toString('base64')}`

  try {
    const res = await fetch(WP as string, {
      method: 'POST',
      headers,
      cache: 'no-store',
      body: JSON.stringify({
        // 🔴 THE CONNECTION, NOT `blogPost(idType: SLUG)`. Measured 10-09-2026 with a
        // fully authorised reader: the single-node SLUG resolver returns **null** for a
        // draft, because WPGraphQL restricts that lookup to published posts and the
        // `graphql_post_object_connection_query_args` filter that widens the statuses
        // only reaches CONNECTIONS. The same credential, on the same request, gets the
        // draft from `blogPosts(where: { name: … })` and nothing from `blogPost`.
        // ⚠️ It fails by returning null, not by erroring — so it reads exactly like
        // "that post does not exist", which is the wrong diagnosis and the reason this
        // took a live query to find rather than a careful read.
        query: `query Preview($slug: String!) {
          blogPosts(first: 1, where: { name: $slug }) { nodes { ${WP_POST_FIELDS} } }
        }`,
        variables: { slug },
      }),
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

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  // 🔴 NOT AN ERROR PAGE — A 404. On ciphera.net this route must be indistinguishable
  // from a path that does not exist. An error page would advertise that a preview
  // surface exists and invite somebody to go looking for it.
  if (!WP) notFound()

  const { slug } = await params
  const { node, error } = await fetchDraft(slug)

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
