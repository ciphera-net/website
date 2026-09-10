import { SEO_WATERMARK, SEO_ROUTE_COUNT } from '@/lib/seo'

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
  return Response.json(
    { watermark: SEO_WATERMARK, routes: SEO_ROUTE_COUNT },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
