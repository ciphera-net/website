import Image from 'next/image'
import { cdnUrl } from '@/lib/cdn'
import { MacWindow } from '@/components/ui/mac-window'

// Retina captures of the live Pulse dashboard (real ciphera.net data) inside a
// macOS window, matching the Pulse frontend's own hero.
//
// 🔑 THE FILENAME CARRIES THE CAPTURE DATE, and that is not decoration. These
// are served from a path-keyed immutable CDN, so re-uploading over an existing
// name means the edge keeps the old bytes until a purge lands — and the purge
// races a 14-region replication. A new dated path makes the URL move with the
// pixels, which is the same reasoning as the content-addressed asset paths on
// status.ciphera.net. It also makes staleness greppable: the previous capture
// was `pulse-dashboard-2x.png`, taken 12-07-2026, and it sat on the homepage
// for 69 days across a full dashboard rewrite with nothing failing.
//
// ⚠️ RE-CAPTURE WHEN THE DASHBOARD CHANGES. The harness that took these, with
// its framing and its truncation guards, is kept alongside the mocks in
// Public/docs/data/19-09-2026-marketing-screenshot-refresh-mocks/.
const CAPTURED = '19-09-2026'

/**
 * The overview frame: the metric rail, the visitors chart, and the acquisition
 * row. Cut on measured element boundaries — the top edge is the toolbar's own
 * top, the bottom is the acquisition cards' bottom border — so nothing is
 * sliced mid-element at either end.
 */
export function PulseMockup() {
  return (
    <MacWindow>
      <Image
        src={cdnUrl(`/mockups/pulse-dashboard-${CAPTURED}-2x.png`)}
        alt="The Pulse dashboard for ciphera.net — unique visitors, pageviews, pages per visit, bounce rate and visit duration beside a daily visitors chart, with referrers and visitor countries below"
        width={2560}
        height={2120}
        className="block w-full"
        unoptimized
      />
    </MacWindow>
  )
}

/**
 * The deeper frame: everything above plus the audience and outbound cards.
 * Used where a section is about the dashboard itself and has the height for it.
 */
export function PulseMockupTall() {
  return (
    <MacWindow>
      <Image
        src={cdnUrl(`/mockups/pulse-dashboard-audience-${CAPTURED}-2x.png`)}
        alt="The Pulse dashboard for ciphera.net — the metric rail and daily visitors chart, the acquisition row of referrers and countries, and below it browsers, operating systems and outbound link clicks"
        width={2560}
        height={3156}
        className="block w-full"
        unoptimized
      />
    </MacWindow>
  )
}
