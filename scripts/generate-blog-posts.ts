/**
 * generate-blog-posts.ts — the blog's summary list, and the bodies WordPress holds.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.12
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1 P1-a
 *
 * 🔴 CONTENT REACHES THIS SITE AT BUILD TIME, NOT AT REQUEST TIME (D1). Same
 * architecture as generate-seo.ts, same reason: ciphera.net runs as 42 independent
 * Magic Containers instances behind a 300s HTML TTL, so a request-time read would mean
 * 42 unsynchronised copies of the blog.
 *
 * 🔴 P1-a: NO CMS CONTENT STATE MAY FAIL THIS BUILD. A bad post is REPAIRED where a safe
 * substitute exists (lib/blog-transform.ts does most of that), SKIPPED when nothing safe
 * exists (no slug, no title, an empty body, a duplicate), or shipped unchanged and
 * FLAGGED when there is no clean field-level fix (a recovery-copy honesty violation).
 * Every one of those is recorded in lib/content-repairs.gen.ts and printed as a
 * `CONTENT-REPAIR` build-log line — see lib/content-repair-log.ts. What still fails this
 * build is INFRASTRUCTURE, not content: WordPress unreachable, a non-200 response, a
 * populated GraphQL `errors[]`, or the post-count collapse guard below (unchanged).
 *
 * 🔑 THE IMAGE/TOOL-LOGO HEAD CHECK AND THE STRICT NEXT_PUBLIC_CDN_URL CROSS-CHECK BELOW
 * ARE PORTED FROM pulse-website@edcb673 / 70a90da (PULSE-243): the old check regex-matched
 * only `${CDN}/blog/media/` images (never a tool-logo mark) and NEXT_PUBLIC_CDN_URL being
 * unset was never fatal, so a post could ship with a tool-logo mark or card image that
 * renders relative to this app's own origin instead of the CDN, with a green build. Both
 * were re-measured against the live corpus before being tightened — see lib/blog-html.ts's
 * TOOL_LOGO_SRC comment.
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { WP_POST_FIELDS, type WpNode } from '../lib/blog-transform'
import { buildBlogPosts } from '../lib/cms/blog-build'
import { renderableImageSources, rawMediaRefs, dropUnreachableMedia } from '../lib/blog-html'
import type { WpBlogPost } from '../lib/blog-types'
import { recordContentRepairs } from '../lib/content-repair-log'
import type { ContentRepairEntry } from '../lib/content-repair-types'

const WP = process.env.WORDPRESS_GRAPHQL_URL ?? 'http://wordpress.apps.svc.cluster.local/graphql'
const CDN = process.env.NEXT_PUBLIC_CDN_URL ?? 'https://cdn.ciphera.net/website'
/** The live site's own report of what it is serving — see the shrink guard below. */
const LIVE_STATE = process.env.LIVE_SEO_STATE_URL ?? 'https://ciphera.net/sys/seo-state'
/** The site's own sitewide default OG image (app/layout.tsx) — the P1-a fallback card. */
const DEFAULT_OG_IMAGE = '/og-homepage.png'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')
const SUMMARY_OUT = path.join(process.cwd(), 'lib', 'blog-posts.gen.ts')
const BODIES_OUT = path.join(process.cwd(), 'lib', 'blog-wp.gen.ts')

const QUERY = `{
  blogPosts(first: 200, where: { status: PUBLISH }) {
    nodes { ${WP_POST_FIELDS} }
  }
}`

/** Still fatal: this is an INFRASTRUCTURE failure, not a CMS content state (P1-a). */
function fail(msg: string): never {
  console.error(`\n🔴 generate-blog-posts: ${msg}\n`)
  process.exit(1)
}

const REPAIR_TYPE = 'blog-post'
const repairs: ContentRepairEntry[] = []
function repair(ref: string, field: string, action: ContentRepairEntry['action'], detail: string): void {
  repairs.push({ type: REPAIR_TYPE, ref, field, action, detail })
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
  // outcome worse than not shipping. This is WordPress being unreachable in substance —
  // infrastructure, not a content state — so it stays fatal (P1-a point 4).
  if (body.errors?.length) fail(`GraphQL errors: ${JSON.stringify(body.errors)}`)

  const nodes: WpNode[] = body?.data?.blogPosts?.nodes ?? [] // buildBlogPosts filters to this site's own routeSites

  // ── Pass 1 (transform/skip/repair) and duplicate-slug dedupe — shared with the
  // publisher via lib/cms/blog-build.ts; see that module's header for exactly what
  // this build-only script still does on top (MDX collision, network checks, below).
  const built = buildBlogPosts(nodes, CDN)
  for (const r of built.repairs) repairs.push(r)

  // ── A slug in both content/blog/*.mdx and WordPress: keep the git-tracked MDX one ──
  // 🔴 P1-a REPAIR: this used to fail the build ("exists in BOTH … Delete one"). There is
  // no field-level fix for two sources claiming one URL, so the WordPress side is
  // skipped and the pre-existing MDX post keeps serving — never a coin flip, and never
  // a post that silently disappears from both. BUILD-ONLY: needs the filesystem — see
  // lib/cms/blog-build.ts's header for why the runtime seam needs no equivalent.
  const mdxSlugs = new Set(mdx.map((p) => p.slug as string))
  const wpSurvivors = built.posts.filter((post) => {
    if (mdxSlugs.has(post.slug)) {
      repair(
        post.slug,
        'slug',
        'skipped',
        `slug "${post.slug}" exists in BOTH content/blog/${post.slug}.mdx and WordPress — ` +
          'kept the git-tracked MDX post, skipped the WordPress one'
      )
      console.log(`SKIP blog post ${post.slug}: exists in both content/blog/*.mdx and WordPress`)
      return false
    }
    return true
  })

  // ── Pass 2: the network-dependent checks, only for what actually survives ──
  const wp: WpBlogPost[] = []
  const summaries: Record<string, unknown>[] = [...mdx]

  for (const post of wpSurvivors) {
    // 🔑 The recovery-copy honesty check now runs inside lib/cms/blog-build.ts (shared
    // with the publisher) — `built.repairs` above already carries any flag for this post.

    // 🔴 EVERY IMAGE AND TOOL-LOGO MARK THE PAGE WILL ACTUALLY RENDER MUST BE ON THE CDN
    // (design §29), AND REACHABLE. `renderableImageSources` (lib/blog-html.ts) runs the
    // EXACT SAME parse → cipheraBlocks → sanitize → cdnImagesOnly → toolLogosValidated
    // chain the page renders with, so this checks exactly the set of `<img>` sources AND
    // tool-logo marks that will reach a reader's browser.
    // 🔴 P1-a REPAIR: an unreachable image or tool-logo mark no longer fails the build —
    // it is dropped from the body, the same contract `cdnImagesOnly`/`toolLogosValidated`
    // already apply to a malformed one.
    const survivingSources = renderableImageSources(post.html, { toolLogoBase: CDN })

    // 🔑 P1-a REPAIR, LEDGER GAP CLOSED (verifier finding, 07-10-2026): an off-CDN <img>
    // or a malformed tool-logo mark is silently stripped by cdnImagesOnly/
    // toolLogosValidated BEFORE renderableImageSources ever sees it, so the loop below —
    // which only iterates the surviving set — never recorded this drop at all.
    // `rawMediaRefs` reads the same body with neither of those two sanitizers applied;
    // anything it finds that renderableImageSources does NOT is exactly what was
    // removed for being off-CDN or wrong-shape, and is recorded here instead of
    // vanishing unseen.
    const survivedSet = new Set(survivingSources)
    const sanitizerDropped = new Set<string>()
    for (const ref of rawMediaRefs(post.html)) {
      if (ref.kind === 'img') {
        if (survivedSet.has(ref.value) || sanitizerDropped.has(`img:${ref.value}`)) continue
        sanitizerDropped.add(`img:${ref.value}`)
        repair(
          post.slug,
          'image',
          'repaired',
          `image ${ref.value} is not on the CDN (or is otherwise invalid) — dropped from the post body`
        )
      } else {
        const absolute = `${CDN}${ref.value}`
        if (survivedSet.has(absolute) || sanitizerDropped.has(`tool-logo:${ref.value}`)) continue
        sanitizerDropped.add(`tool-logo:${ref.value}`)
        repair(
          post.slug,
          'image',
          'repaired',
          `tool-logo mark "${ref.value}" does not match the required shape — dropped from the post body`
        )
      }
    }

    const badImgSrcs = new Set<string>()
    const badToolLogoDataSrcs = new Set<string>()
    for (const src of survivingSources) {
      const imgStatus = await head(src)
      if (imgStatus !== 200) {
        const isToolLogo = src.startsWith(CDN) && src.slice(CDN.length).includes('/blog/tools/')
        if (isToolLogo) badToolLogoDataSrcs.add(src.slice(CDN.length))
        else badImgSrcs.add(src)
        repair(
          post.slug,
          'image',
          'repaired',
          `image ${src} returned HTTP ${imgStatus} — not on the CDN; dropped from the post body`
        )
      }
    }
    if (badImgSrcs.size > 0 || badToolLogoDataSrcs.size > 0) {
      post.html = dropUnreachableMedia(post.html, badImgSrcs, badToolLogoDataSrcs)
    }

    // 🔑 P1-a REPAIR: the OG card gate. A per-post card that 404s no longer fails the
    // build — it falls back to the site's own default OG image (app/layout.tsx).
    const status = await head(`${CDN}${post.image}`)
    if (status !== 200) {
      repair(
        post.slug,
        'image',
        'repaired',
        `OG card ${CDN}${post.image} returned HTTP ${status} — repaired to the site default OG image`
      )
      post.image = DEFAULT_OG_IMAGE
    }

    const { html: _html, faqs: _faqs, wordCount: _wc, cta: _cta, ...summary } = post
    summaries.push(summary)
    wp.push(post)
  }

  // 🔴 THE STRICT NEXT_PUBLIC_CDN_URL CHECK, once there is at least one WordPress post to
  // publish. Ported from pulse-website@70a90da (PULSE-243). NOT a content check — this is
  // a missing deploy secret, which stays fatal (P1-a point 4 only covers CMS content).
  // ⚠️ DELIBERATELY READS THE RAW process.env VALUE, NOT THE `CDN` CONSTANT ABOVE — `CDN`
  // already falls back to the production default when NEXT_PUBLIC_CDN_URL is unset (so
  // this build's own HEAD checks keep passing against the real CDN), but lib/cdn.ts's
  // `cdnUrl()` has NO such fallback (`process.env.NEXT_PUBLIC_CDN_URL || ''`) — it resolves
  // every tool-logo mark and post card image RELATIVE TO THIS APP'S OWN ORIGIN whenever the
  // env var is actually unset at runtime. Before this check, that state was invisible: the
  // generator's own default silently masked it and the build stayed green while production
  // pages would have served broken images. Zero posts has nothing to resolve, so an unset
  // value is not fatal on its own — never fail a build that ships nothing.
  if (wp.length > 0 && !process.env.NEXT_PUBLIC_CDN_URL) {
    fail(
      `NEXT_PUBLIC_CDN_URL is unset but this build is publishing ${wp.length} WordPress post(s). ` +
        `Pages resolve tool-logo marks and post card images through cdnUrl() (NEXT_PUBLIC_CDN_URL); ` +
        `left unset, both would render relative to this app's own origin instead of the CDN. Fix the ` +
        `secret, not this file.`
    )
  }

  // 🔴 THE SHRINK GUARD. UNCHANGED BY P1-a (point 4: the one content-shaped check that
  // STAYS a hard failure). After the migration WordPress holds the ONLY live copy of the
  // corpus, so a build that publishes far fewer posts than production is currently
  // serving must not be able to go green — that is the shape of a real loss (a bad
  // restore, posts that silently lost their site term), not ordinary editing.
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

/**
 * 🔑 NEW (WEB-26 round 2): the max \`modifiedGmt\` this build consumed from WordPress's
 * blog posts for this site — the 'blog' kind's own watermark, reported at
 * /sys/seo-state under watermarks.blog. Computed from the surviving, deduped
 * candidate set (lib/cms/blog-build.ts), before the MDX-collision drop — the same
 * "surviving input" convention lib/seo.gen.ts's SEO_WATERMARK uses.
 */
export const BLOG_WATERMARK = ${JSON.stringify(built.watermark)}
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

  recordContentRepairs([REPAIR_TYPE], repairs)

  console.log(`Generated ${summaries.length} blog posts → lib/blog-posts.gen.ts`)
  console.log(`  ${mdx.length} from content/blog/*.mdx, ${wp.length} from WordPress`)
  for (const p of wp) console.log(`  WP: ${p.slug} (${p.wordCount} words, ${p.faqs.length} faqs)`)
  if (repairs.length > 0) console.log(`  ${repairs.length} content repair(s)/skip(s)/flag(s) — see lib/content-repairs.gen.ts`)
}

main()
