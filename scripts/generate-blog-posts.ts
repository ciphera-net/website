/**
 * generate-blog-posts.ts — the blog's summary list, and the bodies WordPress holds.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.12
 *
 * 🔴 CONTENT REACHES THIS SITE AT BUILD TIME, NOT AT REQUEST TIME (D1). Same
 * architecture as generate-seo.ts, same reason: ciphera.net runs as 42 independent
 * Magic Containers instances behind a 300s HTML TTL, so a request-time read would mean
 * 42 unsynchronised copies of the blog.
 *
 * 🔴 FAIL LOUDLY, NEVER EMIT A PARTIAL. Every check below exits non-zero. A blog that
 * silently ships fifteen of sixteen posts, or one post with no description, is worse
 * than a red pipeline — nothing anywhere would report it.
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { WP_POST_FIELDS, transformWpPost, type WpNode } from '../lib/blog-transform'
import type { WpBlogPost } from '../lib/blog-types'
import { checkRecoveryCopy } from '../lib/recovery-copy-rules.mjs'

const WP = process.env.WORDPRESS_GRAPHQL_URL ?? 'http://wordpress.apps.svc.cluster.local/graphql'
const SITE = 'ciphera-net'
const CDN = process.env.NEXT_PUBLIC_CDN_URL ?? 'https://cdn.ciphera.net/website'
/** The live site's own report of what it is serving — see the shrink guard below. */
const LIVE_STATE = process.env.LIVE_SEO_STATE_URL ?? 'https://ciphera.net/sys/seo-state'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')
const SUMMARY_OUT = path.join(process.cwd(), 'lib', 'blog-posts.gen.ts')
const BODIES_OUT = path.join(process.cwd(), 'lib', 'blog-wp.gen.ts')

const QUERY = `{
  blogPosts(first: 200, where: { status: PUBLISH }) {
    nodes { ${WP_POST_FIELDS} }
  }
}`

function fail(msg: string): never {
  console.error(`\n🔴 generate-blog-posts: ${msg}\n`)
  process.exit(1)
}

/** Tags stripped, for a check that reads PROSE rather than markup. */
function textOfBody(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
}

async function head(url: string): Promise<number> {
  try {
    const r = await fetch(url, { method: 'HEAD' })
    return r.status
  } catch {
    return 0
  }
}

async function main() {
  // ── The sixteen (or however many remain) still in git ──────────────────────
  const mdx: Record<string, unknown>[] = []
  if (fs.existsSync(CONTENT_DIR)) {
    for (const filename of fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))) {
      const slug = filename.replace(/\.mdx$/, '')
      const { data } = matter(fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8'))
      mdx.push({
        slug,
        title: data.title as string,
        description: data.description as string,
        category: data.category as string,
        date: data.date as string,
        dateModified: (data.dateModified || data.date) as string,
        readTime: data.readTime as string,
        image: (data.image || `/blog/og/${slug}.png`) as string,
      })
    }
  }

  // ── WordPress ─────────────────────────────────────────────────────────────
  const res = await fetch(WP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
  }).catch((e) => fail(`cannot reach WordPress at ${WP} — ${e.message}`))

  if (!res.ok) fail(`WordPress returned HTTP ${res.status} from ${WP}`)
  const body = await res.json()

  // 🔴 A PARTIAL RESPONSE IS WORSE THAN NO RESPONSE. WPGraphQL can return HTTP 200 with
  // a populated `errors` array and partial `data`; shipping half the blog is the one
  // outcome worse than not shipping.
  if (body.errors?.length) fail(`GraphQL errors: ${JSON.stringify(body.errors)}`)

  const nodes: WpNode[] = body?.data?.blogPosts?.nodes ?? []
  const wp: WpBlogPost[] = []
  const summaries: Record<string, unknown>[] = [...mdx]
  const mdxSlugs = new Set(mdx.map((p) => p.slug as string))
  const seen = new Set<string>()

  for (const n of nodes) {
    const sites = n.routeSites?.nodes?.map((t) => t.slug) ?? []
    if (!sites.includes(SITE)) continue // Pulse's posts (Phase 4) live in the same WordPress

    // 🔴 THE SAME TRANSFORM THE PREVIEW RUNS (lib/blog-transform.ts). Two copies would
    // eventually disagree, and a preview that disagrees with the published page is
    // worse than no preview — it is a preview nobody can trust and nobody knows to
    // distrust. The build turns a problem into a red pipeline; the preview turns the
    // same problem into a banner. Only that last step differs.
    const { post, problems } = transformWpPost(n, CDN)
    if (!post) fail(`${n.title ?? 'untitled post'}: ${problems.map((x) => x.message).join('; ')}`)
    if (problems.length > 0) {
      fail(
        `${post.slug}:\n` +
          problems.map((x) => `   • ${x.field}: ${x.message}`).join('\n') +
          `\n   Fix it at https://cms.ciphera.net → Blog, then this build will pass.`
      )
    }

    // 🔴 A SLUG IN BOTH SOURCES IS A BUILD FAILURE, NOT A PRECEDENCE RULE (design §8.0).
    // lib/blog.ts throws on this too; catching it here names the post and the fix.
    if (mdxSlugs.has(post.slug)) {
      fail(
        `slug "${post.slug}" exists in BOTH content/blog/${post.slug}.mdx and WordPress.\n` +
          `   Delete one. A precedence rule would silently retire the other, and the next\n` +
          `   person to edit it would see no effect at all.`
      )
    }
    if (seen.has(post.slug)) fail(`duplicate published post for slug "${post.slug}"`)
    seen.add(post.slug)

    // 🔴 THE OG GATE, AND IT IS NOT IN A TEST FILE ON PURPOSE.
    // __tests__/og-image-dimensions.test.mjs is deliberately network-free — its own
    // header says so — because a test that fails when the CDN is slow stops meaning
    // anything. Here the network is already a hard dependency and a failure is already
    // a legitimate red build. Without this, a new post unfurls broken in exactly the
    // place nobody checks: somebody else's Slack.
    // ⚠️ It lives HERE and not in the shared transform because it costs a network
    // round trip per post — which is right for a build and wrong for a preview an
    // editor is waiting on.
    // 🔴 EVERY IMAGE A POST REFERENCES MUST ACTUALLY BE ON THE CDN (design §29).
    // Images are uploaded at cms.ciphera.net/upload, which writes to the CDN and hands
    // back a finished URL — so a post referencing one that is not there means the URL
    // was typed or pasted rather than produced. That is a broken image on a published
    // page, and this is what makes it a red build naming the file instead.
    // ⚠️ Needs NO credential: the CDN is public, and that is the whole reason no CDN
    // write credential lives in this pipeline.
    for (const src of new Set([...post.html.matchAll(/src="([^"]+)"/g)].map((m) => m[1]))) {
      if (!src.startsWith(`${CDN}/blog/media/`)) continue
      const imgStatus = await head(src)
      if (imgStatus !== 200) {
        fail(
          `${post.slug}: image ${src} returned HTTP ${imgStatus}.\n` +
            `   The post references it but it is not on the CDN. Upload it at\n` +
            `   https://cms.ciphera.net/upload, or correct the address in the post.`
        )
      }
    }

    const status = await head(`${CDN}${post.image}`)
    if (status !== 200) {
      fail(
        `${post.slug}: OG card ${CDN}${post.image} returned HTTP ${status}.\n` +
          `   Cards are produced by hand — Public/docs/og-image-generation.md — and this post\n` +
          `   would unfurl broken everywhere it was shared. Generate and upload it, then rebuild.`
      )
    }

    // 🔴 THE RECOVERY-COPY GUARD, MOVED HERE BECAUSE THE CONTENT MOVED.
    // Two of that guard's six surfaces were blog posts. They are in WordPress now, so a
    // repository test cannot see them — and the guard's own header says a guard narrower
    // than its subject reads as coverage and is not. Same rules, run where the copy is.
    // ⚠️ It checks the FULL body INCLUDING the FAQ answers, which is where one of the
    // false claims lived.
    const copyProblems = checkRecoveryCopy(
      textOfBody(post.html) + ' ' + post.faqs.map((f) => `${f.question} ${f.answer}`).join(' '),
      post.slug
    )
    if (copyProblems.length > 0) {
      fail(
        `${post.slug} makes a false or unqualified claim about account recovery:\n` +
          copyProblems.map((x) => `   • ${x}`).join('\n') +
          `\n   Recovery has been live since 03-09-2026: the 24-word phrase opens an enrolled account,\n` +
          `   older accounts set it up from Security settings, and there is no backfill. Fix the\n` +
          `   copy at https://cms.ciphera.net → Blog.`
      )
    }

    const { html: _html, faqs: _faqs, wordCount: _wc, cta: _cta, ...summary } = post
    summaries.push(summary)
    wp.push(post)
  }

  // 🔴 THE SHRINK GUARD. After the migration WordPress holds the ONLY live copy of the
  // corpus, so a build that publishes fewer posts than production is currently serving
  // must not be able to go green. Desired and actual are both queryable — the same
  // level-triggered shape as the publish watcher (D9) — so this stores nothing.
  // ⚠️ The escape hatch is explicit and appears in the pipeline log. A deliberate
  // unpublish sets it once; nothing sets it by accident.
  if (process.env.ALLOW_POST_COUNT_DECREASE === '1') {
    console.log('⚠️  ALLOW_POST_COUNT_DECREASE=1 — the shrink guard is disabled for this build')
  } else {
    try {
      const live = await fetch(LIVE_STATE, { signal: AbortSignal.timeout(15_000) })
      if (live.ok) {
        const state = (await live.json()) as { posts?: number }
        const servingNow = typeof state.posts === 'number' ? state.posts : null

        // 🔴 A DROP WARNS; ONLY A COLLAPSE BLOCKS. THIS GUARD WAS WRONG TWICE.
        //
        // v1 blocked on ANY decrease and demanded ALLOW_POST_COUNT_DECREASE=1 — an env
        // var only a human can set, while the thing retrying every five minutes is the
        // publish watcher, which never can. Trashing one post therefore blocked every
        // UNRELATED deploy in a loop until somebody intervened by hand. That happened.
        //
        // v2 tried to tell a deliberate removal from a silent one by asking WordPress
        // which posts were parked. It cannot: WPGraphQL does not expose trashed or
        // private posts to an UNAUTHENTICATED caller, and this build deliberately holds
        // no credential. The query returned 16 of 16 published and nothing else — so
        // every trash read as "unaccounted for", which is precisely what v2 existed to
        // stop doing.
        //
        // 🔑 SO THE DISCRIMINATOR IS SIZE, WHICH IS THE ONE THING THIS BUILD CAN
        // ACTUALLY KNOW. Editors trash and unpublish posts; that is ordinary work and
        // must not stop the site deploying. Losing a QUARTER of the blog at once is not
        // ordinary, and is worth refusing to ship until a human looks.
        //
        // ⚠️ And detection was never this gate's job in the end:
        // `WordpressBlogPostsDropped` watches the count directly. The original
        // justification — "nothing else in the estate can see that" — stopped being
        // true the same day it was written.
        const liveCount = servingNow
        const shortfall = liveCount === null ? 0 : liveCount - summaries.length
        const collapse =
          liveCount !== null && shortfall > Math.max(2, Math.floor(liveCount * 0.25))

        if (liveCount === null || shortfall <= 0) {
          // Nothing to say: the live build predates the `posts` field, or the corpus
          // grew. Both are the normal case.
        } else if (!collapse) {
          console.log(
            `⚠️  publishing ${summaries.length} posts; the live site serves ${liveCount}. ` +
              `${shortfall} fewer.\n` +
              `   Shipping: unpublishing a post is ordinary editorial work, and a content ` +
              `decision must not\n   block an unrelated deploy. WordpressBlogPostsDropped is ` +
              `what watches this.`
          )
        } else {
          fail(
            `this build would publish ${summaries.length} posts; ${LIVE_STATE} reports ${liveCount} live.\n` +
              `   That is ${shortfall} gone at once — too many to be ordinary editing, and the\n` +
              `   shape of a real loss: a restore that dropped rows, or posts that silently lost\n` +
              `   their site term and fell out of the build's filter.\n` +
              `   If it really was intended, rebuild with ALLOW_POST_COUNT_DECREASE=1.`
          )
        }
      } else {
        // ⚠️ NOT FATAL, AND THAT IS A JUDGEMENT CALL. The live site being unreachable
        // must not be able to block every deploy — including the deploy that fixes it.
        console.log(`⚠️  shrink guard skipped: ${LIVE_STATE} returned HTTP ${live.status}`)
      }
    } catch (e) {
      console.log(`⚠️  shrink guard skipped: ${LIVE_STATE} unreachable (${(e as Error).name})`)
    }
  }

  // 🔴 A DATE ALONE IS NOT A TOTAL ORDER, AND THE CORPUS HAS THREE POSTS ON 2026-07-22.
  // Until the migration, ties were broken by `readdirSync` order — alphabetical by
  // accident, on this filesystem, on this machine. WordPress returns them in its own
  // order, and the sitemap and llms.txt shuffled. The slug is a stable, meaningful
  // tiebreak and it reproduces exactly what the filesystem was doing.
  summaries.sort(
    (a, b) =>
      new Date(b.date as string).getTime() - new Date(a.date as string).getTime() ||
      (a.slug as string).localeCompare(b.slug as string)
  )

  fs.writeFileSync(
    SUMMARY_OUT,
    `// Auto-generated from content/blog/*.mdx AND WordPress — do not edit manually
// Run: npm run generate:blog
//
// 🔴 BUILD OUTPUT, NOT SOURCE. Git-ignored, because a committed copy is a second
// source of truth for what the CMS says and the stale one wins an argument nobody
// knew was happening. To change a post, edit it at https://cms.ciphera.net.

export interface BlogPostSummary {
  slug: string
  title: string
  description: string
  category: string
  date: string
  dateModified: string
  readTime: string
  image: string
}

export const blogPosts: BlogPostSummary[] = ${JSON.stringify(summaries, null, 2)}
`,
    'utf-8'
  )

  fs.writeFileSync(
    BODIES_OUT,
    `// Auto-generated from WordPress at build time — do not edit manually.
// Run: npm run generate:blog
//
// ⚠️ THE SOURCE URL IS DELIBERATELY NOT WRITTEN HERE, unlike lib/seo.gen.ts.
// This file is COMMITTED as an empty stub so the module resolves on a fresh clone,
// and a developer generating against a port-forward would otherwise commit
// \`http://localhost:8088/graphql\` into the repository as the blog's stated source.
//
// 🔴 BUILD OUTPUT, NOT SOURCE. See lib/blog-posts.gen.ts.
// The HTML here is WordPress's rendered output with FAQ blocks lifted out. It is
// SANITISED AT RENDER TIME by components/blog/wp-body.tsx, not here — one allowlist,
// applied where the markup becomes elements.

import type { WpBlogPost } from './blog-types'

export const wpPosts: WpBlogPost[] = ${JSON.stringify(wp, null, 2)}
`,
    'utf-8'
  )

  console.log(`Generated ${summaries.length} blog posts → lib/blog-posts.gen.ts`)
  console.log(`  ${mdx.length} from content/blog/*.mdx, ${wp.length} from WordPress`)
  for (const p of wp) console.log(`  WP: ${p.slug} (${p.wordCount} words, ${p.faqs.length} faqs)`)
}

main()
