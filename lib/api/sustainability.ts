import type { ImpactReport } from '@/components/sustainability/types'
import { env } from '@/lib/env'

/**
 * Server-side fetch of the environmental-impact report from website-backend.
 * Called from the /sustainability page's server component during ISR
 * revalidation — never runs in the browser.
 *
 * Next.js caches the fetch response according to the ISR revalidate
 * setting on the caller (currently 86400s = 24h). Setting `next.revalidate`
 * here explicitly is redundant with the page-level export but doesn't
 * hurt — it documents the intent locally.
 *
 * Error handling: if the backend is unreachable or returns a non-2xx,
 * this function returns null. The caller is expected to render a graceful
 * degraded state (the page never 500s because of this).
 */
export async function fetchImpactReport(): Promise<ImpactReport | null> {
  const url = `${env.NEXT_PUBLIC_WEBSITE_API_URL}/api/v1/environmental-impact`

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) {
      console.error('sustainability: backend returned', res.status)
      return null
    }
    const data = (await res.json()) as ImpactReport
    return data
  } catch (err) {
    console.error('sustainability: fetch failed:', err)
    return null
  }
}
