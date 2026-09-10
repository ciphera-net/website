import { SEO_WATERMARK, SEO_ROUTE_COUNT, SEO_POST_COUNT } from '@/lib/seo'

/**
 * The ACTUAL half of the level-triggered deploy check (design D9).
 *
 * 🔑 The `wordpress-publish-watcher` CronJob reads this and compares it against
 * WordPress's current newest `modifiedGmt`. Both sides are queryable, so the watcher
 * stores no state at all — and it therefore detects a missed deploy for ANY reason:
 * a failed pipeline, a reverted commit, an image rolled back by hand. A webhook can
 * only ever know about publishes it happened to witness.
 *
 * ⚠️ These values are BAKED AT BUILD TIME. That is the point — this endpoint reports
 * what this image was built from, never what WordPress currently holds.
 */
export const dynamic = 'force-static'

export function GET() {
  // 🔴 `posts` IS NOT COSMETIC. A watermark is a maximum and maxima only move
  // forward, so unpublishing the newest entry makes WordPress's max fall BELOW this
  // one and `desired > actual` goes false — the site would serve deleted content for
  // ever, with the watcher reporting healthy. The counts are what make a deletion
  // detectable at all, and generate-blog-posts.ts's shrink guard reads `posts` too.
  return Response.json(
    {
      watermark: SEO_WATERMARK,
      routes: SEO_ROUTE_COUNT,
      posts: SEO_POST_COUNT,
      // 🔑 WHICH COMMIT IS RENDERING THIS. The content fields above answer "is the
      // site up to date with the CMS"; this answers "is this instance up to date with
      // the CODE" — a different question, and the only way to catch the in-cluster
      // preview Deployment drifting behind production, since it is pinned by hand and
      // nothing patches it.
      build: process.env.CIPHERA_BUILD_SHA ?? 'unknown',
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
