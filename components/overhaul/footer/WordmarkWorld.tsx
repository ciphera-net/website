/**
 * Round 3b, C3 (mock, 16-10): "Europe inside the letters". The wordmark is a window (an SVG clipPath of the word) onto
 * the hero's world: the dotted map of Europe, Diegem and Zurich, and the hero's warm route lights flying into Zurich
 * from the west, the east and the south. The lights only show where they pass through a letter. Server-rendered SVG,
 * no client JavaScript; motion is the hero's own `eo-pulse` / `eo-ring` CSS, which reduced motion already stops.
 */
import { createMap } from 'svg-dotted-map'
import { lazy } from '../dotted-map-projection'
import { WM } from './wordmark-geom'

// The same Europe crop as the hero's flat map and Where your data lives, scaled to the rail's width.
const MAP_H = 472

// Lazy: the footer imports this module on every page for its other wordmark options, and sampling the land at module
// scope ran on every new server's first request, whichever wordmark rendered (dotted-map-projection.ts).
const world = lazy(() => {
  const { points, addMarkers } = createMap({
    width: WM.w,
    height: MAP_H,
    mapSamples: 9000,
    region: { lat: { min: 42, max: 58.5 }, lng: { min: -14, max: 44 } },
  })
  const [diegemRaw, zurichRaw] = addMarkers([
    { lat: 50.8907, lng: 4.4614, key: 'diegem' },
    { lat: 47.3769, lng: 8.5417, key: 'zurich' },
  ])
  // Shift the map so Zurich sits mid-height in the part of the letters the crop leaves visible (cap top ~33, edge 200).
  const DY = 128 - zurichRaw.y
  const zurich = { x: zurichRaw.x, y: zurichRaw.y + DY }
  const diegem = { x: diegemRaw.x, y: diegemRaw.y + DY }
  const LAND = points.map((p) => ({ x: p.x, y: p.y + DY })).filter((p) => p.y > 0 && p.y < WM.h)

  // Routes into Zurich: from beyond the left edge (the Americas), the right edge (Asia), the bottom right (the Gulf),
  // and Diegem. Generic directions, not customer locations. Quadratic arcs that bow upward, like the hero's.
  const arc = (from: { x: number; y: number }, lift: number) => {
    const mx = (from.x + zurich.x) / 2
    const my = Math.min(from.y, zurich.y) - lift
    return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${zurich.x.toFixed(1)} ${zurich.y.toFixed(1)}`
  }
  const ROUTES = [
    { d: arc({ x: -60, y: 150 }, 70), delay: '0s' },
    { d: arc({ x: WM.w + 60, y: 120 }, 80), delay: '1.1s' },
    { d: arc({ x: WM.w - 120, y: 230 }, 40), delay: '2.2s' },
    { d: arc(diegem, 26), delay: '0.6s' },
  ]
  return { zurich, diegem, LAND, ROUTES }
})

export function WordmarkWorld() {
  const { zurich, diegem, LAND, ROUTES } = world()
  return (
    <svg viewBox={`0 0 ${WM.w} ${WM.h}`} className="-mb-px block h-auto w-full select-none" aria-hidden="true">
      <defs>
        <clipPath id="wm-world-clip">
          <text x={WM.x} y={WM.y} fontSize={WM.size} fontWeight={600} letterSpacing={WM.spacing} className="font-display">
            {WM.word}
          </text>
        </clipPath>
        <radialGradient id="wm-world-glow">
          <stop offset="0" stopColor="#FD5E0F" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FD5E0F" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g clipPath="url(#wm-world-clip)">
        {/* the letters themselves, faint, so the word reads where the map is sea */}
        <rect width={WM.w} height={WM.h} fill="#f4f4f4" fillOpacity="0.045" />
        {LAND.map((p, i) => (
          <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="1.7" fill="#f4f4f4" fillOpacity="0.32" />
        ))}
        {ROUTES.map((r, i) => (
          <g key={i}>
            <path d={r.d} fill="none" stroke="#f4f4f4" strokeOpacity="0.14" strokeWidth="1.4" />
            <path className="eo-pulse" d={r.d} pathLength={1} fill="none" stroke="#FFB36B" strokeWidth="2.6" strokeLinecap="round" style={{ animationDelay: r.delay }} />
          </g>
        ))}
        <circle cx={diegem.x} cy={diegem.y} r="4" fill="#f4f4f4" fillOpacity="0.7" />
        <circle cx={zurich.x} cy={zurich.y} r="30" fill="url(#wm-world-glow)" />
        <circle className="eo-ring" cx={zurich.x} cy={zurich.y} r="7" fill="none" stroke="#FD5E0F" strokeOpacity="0.7" />
        <circle cx={zurich.x} cy={zurich.y} r="5" fill="#FD5E0F" />
      </g>
    </svg>
  )
}
