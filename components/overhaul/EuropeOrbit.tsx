/**
 * Round 1c, idea 1: the hero's planet becomes Earth. A dotted Europe on the night side, receding in perspective,
 * with Diegem (where Ciphera is) and Geneva (where the data is stored) lit and joined by an arc a light travels along.
 * Server-rendered SVG: no JavaScript ships for it.
 */
import { createMap } from 'svg-dotted-map'
import { lazy } from './dotted-map-projection'

const W = 1200
const H = 440
const TOP = 30 // far edge of the plane
const MAP_W = 220
const MAP_H = 150

// Western and central Europe: wide enough to keep the shapes people recognise (Britain, Ireland, Denmark, Italy),
// tight enough that Belgium and Switzerland read as two places.
// Lazy: the hero imports this module for its mock options, and sampling at module scope ran on every request path that
// imports the hero (dotted-map-projection.ts).
const orbitMap = lazy(() =>
  createMap({
    width: MAP_W,
    height: MAP_H,
    mapSamples: 6500,
    region: { lat: { min: 38, max: 59 }, lng: { min: -11, max: 24 } },
  }),
)

// Flat variant: a band centred on Europe. The crop's width:height in Mercator units is 2.34 (58° of longitude over
// lat 42–58.5), and the grid is drawn at exactly that ratio, so the map keeps its true shape.
const FLAT_W = 351
const FLAT_H = 150
const FLAT_DRAW_W = 1000
const flatMap = lazy(() =>
  createMap({
    width: FLAT_W,
    height: FLAT_H,
    mapSamples: 9000,
    region: { lat: { min: 42, max: 58.5 }, lng: { min: -14, max: 44 } },
  }),
)

const PLACE_LIST = [
  { lat: 50.8907, lng: 4.4614, key: 'diegem', name: 'Diegem, Belgium', role: 'Where Ciphera works', side: 'left' as const },
  { lat: 46.2044, lng: 6.1432, key: 'geneva', name: 'Geneva, Switzerland', role: 'Where your data is stored', side: 'right' as const },
]
const flatPlaces = lazy(() => flatMap().addMarkers(PLACE_LIST))
const orbitPlaces = lazy(() => orbitMap().addMarkers(PLACE_LIST))

/** Flat map coordinates → a plane tilted away from the viewer (far rows narrower, closer together, fainter). */
function project(x: number, y: number) {
  const u = x / MAP_W
  const v = y / MAP_H
  const depth = 0.62 + 0.38 * v
  return {
    x: W / 2 + (u - 0.5) * 1050 * depth,
    y: TOP + (H - TOP) * (v * (0.6 + 0.4 * v)),
    depth,
  }
}

function projectFlat(x: number, y: number) {
  return { x: (W - FLAT_DRAW_W) / 2 + (x / FLAT_W) * FLAT_DRAW_W, y: TOP + (y / FLAT_H) * (FLAT_DRAW_W / 2.34), depth: 0.72 }
}

export function EuropeOrbit({ flat = false }: { flat?: boolean }) {
  const dots = flat
    ? flatMap().points.map((p) => projectFlat(p.x, p.y))
    : orbitMap().points.map((p) => project(p.x, p.y)).filter((p) => p.x > -20 && p.x < W + 20)
  const places = flat ? flatPlaces().map((m) => ({ ...m, ...projectFlat(m.x, m.y) })) : orbitPlaces().map((m) => ({ ...m, ...project(m.x, m.y) }))
  const [a, b] = places
  const arc = `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${((a.x + b.x) / 2 + 40).toFixed(1)} ${(Math.min(a.y, b.y) - 50).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`

  return (
    <div data-mock="europe" className="hz-in hz-in-5 relative mx-auto mt-10 w-full max-w-6xl">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="A dotted map of Europe with Diegem in Belgium and Geneva in Switzerland highlighted">
        <defs>
          <radialGradient id="eo-fade" cx="50%" cy="100%" r="75%">
            <stop offset="0.35" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="eo-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <rect width={W} height={H} fill="url(#eo-fade)" />
          </mask>
          <radialGradient id="eo-glow">
            <stop offset="0" stopColor="#FD5E0F" stopOpacity="0.7" />
            <stop offset="1" stopColor="#FD5E0F" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g mask="url(#eo-mask)">
          {dots.map((p, i) => (
            <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={(1.0 + 1.5 * p.depth).toFixed(2)} fill="#f4f4f4" fillOpacity={(0.14 + 0.3 * p.depth).toFixed(3)} />
          ))}
        </g>

        <path d={arc} fill="none" stroke="#f4f4f4" strokeOpacity="0.18" strokeWidth="1.2" />
        <path className="eo-pulse" d={arc} pathLength={1} fill="none" stroke="#FFB36B" strokeWidth="2" strokeLinecap="round" />

        {places.map((m) => (
          <g key={m.key}>
            <circle cx={m.x} cy={m.y} r="26" fill="url(#eo-glow)" />
            <circle className="eo-ring" cx={m.x} cy={m.y} r="6" fill="none" stroke="#FD5E0F" strokeOpacity="0.7" />
            <circle cx={m.x} cy={m.y} r="4" fill="#FD5E0F" />
            <g className="max-md:hidden" textAnchor={m.side === 'left' ? 'end' : 'start'}>
              <text x={m.side === 'left' ? m.x - 18 : m.x + 18} y={m.y - 4} fill="#f4f4f4" fontSize="15" fontWeight="500" stroke="#0a0a0a" strokeWidth="5" paintOrder="stroke" strokeLinejoin="round">{m.name}</text>
              <text x={m.side === 'left' ? m.x - 18 : m.x + 18} y={m.y + 16} fill="#a3a3a3" fontSize="13" stroke="#0a0a0a" strokeWidth="5" paintOrder="stroke" strokeLinejoin="round">{m.role}</text>
            </g>
          </g>
        ))}
      </svg>
      {/* Phone: the labels would be ~4 px inside the scaled SVG, so they move under it. */}
      <dl className="mt-2 grid grid-cols-2 gap-4 text-left text-sm md:hidden">
        {places.map((m) => (
          <div key={m.key} className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <div>
              <dt className="font-medium text-foreground">{m.name}</dt>
              <dd className="text-muted-foreground">{m.role}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}
