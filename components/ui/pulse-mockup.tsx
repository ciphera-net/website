import Image from 'next/image'
import { cdnUrl } from '@/lib/cdn'
import { MacWindow } from '@/components/ui/mac-window'

// A retina screenshot of the live Pulse dashboard (real data, last 30 days —
// same as /demo) inside a macOS window, matching the Pulse frontend hero.
// Replaces the former hand-built CSS mockup.
export function PulseMockup() {
  return (
    <MacWindow>
      <Image
        src={cdnUrl('/mockups/pulse-dashboard-2x.png')}
        alt="The Pulse dashboard — 30 days of real visitor, pageview and engagement data"
        width={2304}
        height={2004}
        className="block w-full"
        unoptimized
      />
    </MacWindow>
  )
}
