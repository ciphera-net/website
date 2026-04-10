import type { Metadata } from 'next'

// * Honeypot page — reachable only via hidden links in the site's footer layout.
// * Real users never see or tab into those links, so anything that lands here is
// * either a link-walking crawler or an automated scraper. The Pulse tracking
// * script (loaded by the root layout) fires a pageview for this path like any
// * other page, and a Cerberus rule in pulse-backend instant-quarantines any
// * session that hits a honeypot path. The resulting quarantined_events row
// * captures the bot's full fingerprint for analysis and tuning.
// *
// * We intentionally return a plausible 200 response rather than a 404 so the
// * bot does not learn it was detected and pivot to a different evasion.
// * Noindex metadata + an empty body minimize the risk of this page ever being
// * surfaced to a legitimate user via a misconfigured search engine.

export const metadata: Metadata = {
  title: 'Ciphera',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function SysPingPage() {
  return (
    <div style={{ display: 'none' }} aria-hidden="true">
      ok
    </div>
  )
}
