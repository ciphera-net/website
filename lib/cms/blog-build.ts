/**
 * The blog transform, extracted pure (WEB-26 round 2).
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1.3, §4.1.3a
 *
 * 🔑 ONE TRANSFORM, TWO CALLERS, SAME SHAPE OF REASON AS lib/cms/glossary-build.ts.
 * `scripts/generate-blog-posts.ts` calls this at build time to produce the seed
 * (`lib/blog-posts.gen.ts` / `lib/blog-wp.gen.ts`); `scripts/cms-publisher.ts` calls it
 * at publish time to produce the CDN documents. Both get the same skip/repair/dedupe
 * decisions, because there is only one function making them.
 *
 * 🔴 WHAT STAYS OUTSIDE THIS MODULE ON PURPOSE, AND WHY (the same split
 * lib/cms/glossary-build.ts documents for the repo-link scan):
 *   - the content/blog/*.mdx collision check — needs the filesystem, which only
 *     exists at build time. It does not need a runtime analogue: `lib/blog.ts`'s
 *     async seam always resolves an MDX slug from the repo FIRST and never even asks
 *     the CDN for it, so a CDN-published document for a colliding slug is harmless —
 *     it is uploaded (content addressing makes that nearly free) but never served.
 *   - the CDN image/tool-logo HEAD checks and the OG-card HEAD check — network calls
 *     against the ASSET cdn (cdn.ciphera.net), one per image, on every pass. A build
 *     runs once; this publisher sweeps every 120s. Not replicated here: a post
 *     published through cms.ciphera.net/upload already has its images on the CDN by
 *     construction (the uploader hands back a working CDN URL), so the failure mode
 *     this check exists for — a STALE migrated path — does not recur for new,
 *     CMS-authored content. A post with a broken image published this way ships with
 *     the broken `<img>` until the next full `next build` repairs it; documented, not
 *     silently covered.
 *   - the live-site shrink guard — `cms-publisher.ts`'s own publishBlog() has a
 *     narrower analogue: it refuses the kind's publish (keeping the previous index
 *     entry, via the SAME catch-and-keep-previous path `runPass()` already uses for
 *     any kind failure) when the new count collapses against the PREVIOUS INDEX's
 *     count, not against a separate `/sys/seo-state` fetch — see cms-publisher.ts.
 */
import { nodeSites, BLOG_SITE, transformWpPost, type WpNode } from '../blog-transform'
import { checkRecoveryCopy } from '../recovery-copy-rules.mjs'
import type { ContentRepairEntry } from '../content-repair-types'
import type { WpBlogPost } from '../blog-types'

export const BLOG_REPAIR_TYPE = 'blog-post'

/** A stable, always-present ref for a node that may not even have a usable slug yet. */
function refOf(n: WpNode): string {
  return (n.slug ?? '').trim() || (n.databaseId != null ? `wp-db-${n.databaseId}` : '(unknown)')
}

function textOfBody(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
}

export interface BlogBuildResult {
  posts: WpBlogPost[]
  repairs: ContentRepairEntry[]
  /** Max `modifiedGmt` across every surviving post — folded into the kind's watermark. */
  watermark: string
}

/**
 * Published, site-filtered `blogPosts` GraphQL nodes → the posts this site renders,
 * every repair/skip/flag recorded (P1-a), and the watermark the caller folds into its
 * own. Does NOT do the network/filesystem-dependent checks — see the module header.
 *
 * `cdn` is the ASSET cdn (NEXT_PUBLIC_CDN_URL), used only for rewriting
 * `wp-content/uploads/...` references in the body — see `transformWpPost`.
 */
export function buildBlogPosts(nodes: WpNode[], cdn: string): BlogBuildResult {
  const repairs: ContentRepairEntry[] = []
  const repair = (ref: string, field: string, action: ContentRepairEntry['action'], detail: string): void => {
    repairs.push({ type: BLOG_REPAIR_TYPE, ref, field, action, detail })
  }

  const siteNodes = nodes.filter((n) => nodeSites(n).includes(BLOG_SITE))

  type Candidate = { n: WpNode; post: WpBlogPost }
  const candidates: Candidate[] = []

  for (const n of siteNodes) {
    const ref = refOf(n)

    // Reuse the SAME transform the build and the preview run — see blog-transform.ts.
    // It already skips an unusable slug (empty, or a shape WordPress could not have
    // produced — see WP_SLUG) by returning `post: null`.
    const { post, problems, repairs: fieldRepairs } = transformWpPost(n, cdn)

    if (!post) {
      for (const p of problems) repair(ref, p.field, 'skipped', p.message)
      continue
    }
    const blocking = problems.filter((p) => p.field === 'title' || p.field === 'body')
    if (blocking.length > 0) {
      for (const p of blocking) repair(post.slug, p.field, 'skipped', p.message)
      continue
    }
    for (const r of fieldRepairs) repair(post.slug, r.field, 'repaired', r.detail)
    candidates.push({ n, post })
  }

  // ── Duplicate slug: keep the lowest WordPress databaseId, skip the rest (P1-a) ──
  const bySlug = new Map<string, Candidate[]>()
  for (const c of candidates) {
    const list = bySlug.get(c.post.slug) ?? []
    list.push(c)
    bySlug.set(c.post.slug, list)
  }
  const survivors: Candidate[] = []
  for (const [slug, group] of bySlug) {
    const sorted = [...group].sort((a, b) => (a.n.databaseId ?? Infinity) - (b.n.databaseId ?? Infinity))
    survivors.push(sorted[0])
    for (const loser of sorted.slice(1)) {
      repair(
        slug,
        'slug',
        'skipped',
        `duplicate published post for slug "${slug}" (databaseId ${loser.n.databaseId ?? 'unknown'}) — kept the lowest databaseId (${sorted[0].n.databaseId ?? 'unknown'})`
      )
    }
  }

  const posts: WpBlogPost[] = []
  for (const { post } of survivors) {
    const copyProblems = checkRecoveryCopy(
      textOfBody(post.html) + ' ' + post.faqs.map((f) => `${f.question} ${f.answer}`).join(' '),
      post.slug
    )
    if (copyProblems.length > 0) {
      repair(
        post.slug,
        'recovery-copy',
        'flagged',
        `severity=high — makes a false or unqualified claim about account recovery (shipped unchanged): ${copyProblems.join('; ')}`
      )
    }
    posts.push(post)
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || a.slug.localeCompare(b.slug))

  const watermark = survivors.map((c) => c.n.modifiedGmt ?? '').filter(Boolean).sort().at(-1) ?? ''

  return { posts, repairs, watermark }
}
