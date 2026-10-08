import { SEO_WATERMARK, SEO_ROUTE_COUNT, SEO_POST_COUNT, getRouteSeoRuntimeState } from '@/lib/seo'
import { REDIRECT_COUNT, REDIRECT_WATERMARK } from '@/lib/redirects.gen'
import { GLOSSARY_COUNT, GLOSSARY_WATERMARK } from '@/lib/glossary.gen'
import { BLOG_WATERMARK } from '@/lib/blog-posts.gen'
import { CONTENT_REPAIRS } from '@/lib/content-repairs.gen'
import { CMS_RUNTIME_KINDS } from '@/lib/cms/runtime-config'
import { getGlossaryRuntimeState } from '@/lib/glossary'
import { getBlogRuntimeState } from '@/lib/blog'
import { getRedirectRuntimeState } from '@/lib/cms/redirect-runtime'
import { getPageRuntimeState } from '@/lib/cms/page-runtime'

/**
 * The ACTUAL half of the level-triggered deploy check (design D9).
 *
 * 🔑 The `wordpress-publish-watcher` CronJob reads this and compares it against
 * WordPress's current newest `modifiedGmt`. Both sides are queryable, so the watcher
 * stores no state at all — and it therefore detects a missed deploy for ANY reason:
 * a failed pipeline, a reverted commit, an image rolled back by hand. A webhook can
 * only ever know about publishes it happened to witness.
 *
 * ⚠️ THE TOP-LEVEL FIELDS BELOW ARE STILL BAKED AT BUILD TIME, unchanged (§3.1.3a's
 * "R16 is staged per kind" — a watcher keeps comparing the BUILD watermark against
 * WordPress for every kind not yet in `CMS_RUNTIME_KINDS`). `watermarks` and `runtime`
 * are new (WEB-26): the former is those same build-time numbers broken out per kind
 * instead of pre-collapsed into one maximum; the latter is what THIS INSTANCE is
 * actually serving right now, which is why this route can no longer be
 * `force-static` — a static response would report the seed forever, for every kind
 * that has since moved to runtime, which is exactly the kind of report that is worse
 * than no report at all.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const glossaryRuntime = await getGlossaryRuntimeState()
  const blogRuntime = await getBlogRuntimeState()
  const routeRuntime = await getRouteSeoRuntimeState()
  const redirectRuntime = await getRedirectRuntimeState()
  const pageRuntime = await getPageRuntimeState()

  // 🔴 `posts` IS NOT COSMETIC. A watermark is a maximum and maxima only move
  // forward, so unpublishing the newest entry makes WordPress's max fall BELOW this
  // one and `desired > actual` goes false — the site would serve deleted content for
  // ever, with the watcher reporting healthy. The counts are what make a deletion
  // detectable at all, and generate-blog-posts.ts's shrink guard reads `posts` too.
  return Response.json(
    {
      // 🔴 THE WATERMARK SPANS ALL THREE TYPES. A redirect created in the CMS has to
      // trigger a rebuild like anything else, or the agency publishes one and watches
      // nothing happen — so its newest modification joins the maximum here.
      watermark:
        [SEO_WATERMARK, REDIRECT_WATERMARK, GLOSSARY_WATERMARK].filter(Boolean).sort().at(-1) ?? '',
      routes: SEO_ROUTE_COUNT,
      posts: SEO_POST_COUNT,
      // 🔴 `redirects` IS WHAT CATCHES A SHIPPED STUB. lib/redirects.gen.ts is
      // committed EMPTY so next.config.ts resolves on a fresh clone; if a build ever
      // shipped that stub, 18 retired URLs would go back to 404 with everything green.
      // The publish watcher compares this against what WordPress holds.
      redirects: REDIRECT_COUNT,
      // 🔴 THE FOURTH CONTENT TYPE, AND THE WATCHER IS BLIND WITHOUT IT.
      // The glossary is 54 of the sitemap's 88 URLs. Its watermark joins the maximum
      // above so a published term triggers a rebuild at all; this count is what makes an
      // UNPUBLISHED one detectable, since a maximum only moves forward.
      // ⚠️ Three-part change (§23.4): this key, the watcher's query, and
      // generate-glossary.ts's EXPECTED_TERMS move together.
      glossary: GLOSSARY_COUNT,
      // 🔑 WHICH COMMIT IS RENDERING THIS. The content fields above answer "is the
      // site up to date with the CMS"; this answers "is this instance up to date with
      // the CODE" — a different question, and the only way to catch the in-cluster
      // preview Deployment drifting behind production, since it is pinned by hand and
      // nothing patches it.
      build: process.env.CIPHERA_BUILD_SHA ?? 'unknown',
      // 🔑 P1-a ("repair, don't refuse"): every content-state repair, skip and flag
      // this build recorded instead of failing — lib/content-repair-log.ts writes
      // lib/content-repairs.gen.ts, one CONTENT-REPAIR build-log line per entry.
      // `repairs_detail` is capped at 50 so this endpoint stays small on a bad day;
      // `repairs` is the full count regardless.
      repairs: CONTENT_REPAIRS.length,
      repairs_detail: CONTENT_REPAIRS.slice(0, 50),
      // 🔑 NEW (WEB-26): the same build-time numbers above, broken out per kind rather
      // than pre-collapsed into the single `watermark` maximum — "posts" becomes "seo"
      // here to match the kind name §4.1.3a's index uses, not SEO_POST_COUNT's name.
      // 🔑 ROUND 2: `blog` joins the map — the watchers map kinds to these site keys
      // exactly (route -> "seo", redirect -> "redirect", blog -> "blog", glossary ->
      // "glossary"), so this key is named "blog", not "posts".
      watermarks: {
        seo: SEO_WATERMARK,
        blog: BLOG_WATERMARK,
        redirect: REDIRECT_WATERMARK,
        glossary: GLOSSARY_WATERMARK,
      },
      // 🔑 NEW (WEB-26): what THIS INSTANCE is serving right now, per kind — distinct
      // from the build-time fields above, which describe what the image was built
      // from. `source` can be 'seed'/'off' even when `enabled` is true: the kind is
      // turned on, but this resolution fell back (an unreachable CDN, an unknown
      // schema). Round 2 adds blog, seo (route) and redirect alongside glossary.
      runtime: {
        kinds: [...CMS_RUNTIME_KINDS],
        glossary: {
          enabled: glossaryRuntime.enabled,
          source: glossaryRuntime.source,
          index_watermark: glossaryRuntime.indexWatermark ?? null,
          published_at: glossaryRuntime.publishedAt ?? null,
        },
        blog: {
          enabled: blogRuntime.enabled,
          source: blogRuntime.source,
          index_watermark: blogRuntime.indexWatermark ?? null,
          published_at: blogRuntime.publishedAt ?? null,
        },
        seo: {
          enabled: routeRuntime.enabled,
          source: routeRuntime.source,
          index_watermark: routeRuntime.indexWatermark ?? null,
          published_at: routeRuntime.publishedAt ?? null,
        },
        redirect: {
          enabled: redirectRuntime.enabled,
          source: redirectRuntime.source,
          index_watermark: redirectRuntime.indexWatermark ?? null,
          published_at: redirectRuntime.publishedAt ?? null,
          count: redirectRuntime.count ?? null,
        },
        // 🔑 WEB-28: 'page' has NO build-time seed (no generate-pages.ts exists this
        // round), so unlike every kind above, `source` is only ever 'cdn' or 'off' —
        // there is no 'seed' to fall back to. `count` is the index's own item count,
        // not a build-time constant, since none exists to compare it against.
        page: {
          enabled: pageRuntime.enabled,
          source: pageRuntime.source,
          index_watermark: pageRuntime.indexWatermark ?? null,
          published_at: pageRuntime.publishedAt ?? null,
          count: pageRuntime.count ?? null,
        },
      },
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
