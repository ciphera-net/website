/**
 * Round 1d, "the planet IS the globe": Europe drawn ON the hero's planet, in an orthographic projection fitted to the
 * horizon's own circle, so the dots curve and thin toward the lit rim. Two looks:
 *   land   — dotted land, Diegem and Geneva lit
 *   lights — the night-side lights of Europe's cities, Diegem and Geneva brightest, land a faint hint
 * Everything is computed at build time on the server; the page receives plain SVG.
 */
import { createMap } from 'svg-dotted-map'
import { cdnUrl } from '@/lib/cdn'
import { DESKTOP, MOBILE, type Scene } from './Horizon'
import { DOT_FIELDS, type Dot } from './dot-field'
import { lazy } from './dotted-map-projection'

const RAD = Math.PI / 180
const DIEGEM = { lat: 50.8907, lng: 4.4614 }
const GENEVA = { lat: 46.2044, lng: 6.1432 }
const ANCHOR = { lat: 48.55, lng: 5.3 } // the midpoint of the two places (Diegem and Geneva), placed under the buttons

// The library projects a region crop linearly in longitude and in MERCATOR latitude (measured 16-10-2026: lat 45 in a
// 20..70 crop lands at y 370/600, Mercator predicts 372, linear-latitude would be 300). Invert that exactly.
// Only the part of the globe the hero shows, sampled densely enough for coastlines to read.
const REGION = { lat: { min: 30, max: 72 }, lng: { min: -25, max: 45 } }
const GRID_W = 700
const GRID_H = 560
const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2))
const M_MAX = merc(REGION.lat.max)
const M_MIN = merc(REGION.lat.min)
// 🔴 LAZY: sampling 30,000 cells against the world's polygons is seconds of CPU on a shared container, and at module
// scope it ran on every new server's first request (dotted-map-projection.ts). The page draws the land from a static
// file (dot-field.ts); only the dot-field script and the mock-only land look ask for it.
const landLatLng = lazy(() =>
  createMap({ width: GRID_W, height: GRID_H, mapSamples: 30000, region: REGION }).points.map((p) => ({
    lng: REGION.lng.min + (p.x / GRID_W) * (REGION.lng.max - REGION.lng.min),
    lat: (2 * Math.atan(Math.exp(M_MAX - (p.y / GRID_H) * (M_MAX - M_MIN))) - Math.PI / 2) / RAD,
  })),
)

// Night lights: major cities, approximate coordinates; size 1 = large city or capital.
const CITIES: [number, number, number][] = [
  [51.51, -0.13, 1], [48.86, 2.35, 1], [50.85, 4.35, 1], [52.37, 4.9, 1], [51.92, 4.48, 0.7], [51.22, 4.4, 0.6], [51.05, 3.72, 0.5],
  [50.63, 5.57, 0.5], [49.61, 6.13, 0.5], [50.94, 6.96, 0.8], [51.23, 6.78, 0.6], [50.11, 8.68, 0.8], [48.78, 9.18, 0.6], [48.14, 11.58, 0.9],
  [52.52, 13.4, 1], [53.55, 9.99, 0.9], [53.08, 8.8, 0.5], [52.37, 9.73, 0.5], [51.34, 12.37, 0.5], [49.45, 11.08, 0.5], [48.57, 7.75, 0.5],
  [47.56, 7.59, 0.5], [46.95, 7.45, 0.5], [46.2, 6.14, 0.6], [45.46, 9.19, 1], [45.07, 7.69, 0.7], [44.41, 8.93, 0.5], [44.49, 11.34, 0.6],
  [43.77, 11.26, 0.5], [45.44, 12.32, 0.5], [41.9, 12.5, 1], [40.85, 14.27, 0.8], [38.12, 13.36, 0.6], [48.21, 16.37, 1], [50.08, 14.44, 0.9],
  [52.23, 21.01, 1], [50.06, 19.94, 0.6], [47.5, 19.04, 0.9], [48.15, 17.11, 0.5], [46.06, 14.51, 0.5], [45.81, 15.98, 0.6], [44.79, 20.45, 0.7],
  [44.43, 26.1, 0.9], [42.7, 23.32, 0.7], [37.98, 23.73, 0.9], [40.64, 22.94, 0.6], [41.01, 28.98, 1], [55.68, 12.57, 0.9], [56.16, 10.2, 0.5],
  [57.71, 11.97, 0.6], [59.33, 18.07, 0.9], [59.91, 10.75, 0.8], [60.17, 24.94, 0.8], [59.44, 24.75, 0.5], [56.95, 24.11, 0.6], [54.69, 25.28, 0.6],
  [53.9, 27.56, 0.8], [50.45, 30.52, 1], [53.35, -6.26, 0.8], [53.48, -2.24, 0.8], [52.49, -1.89, 0.7], [55.86, -4.25, 0.6], [55.95, -3.19, 0.5],
  [50.63, 3.06, 0.6], [45.76, 4.84, 0.8], [43.3, 5.37, 0.8], [43.7, 7.27, 0.5], [43.6, 1.44, 0.6], [44.84, -0.58, 0.6], [47.22, -1.55, 0.5],
  [40.42, -3.7, 1], [41.39, 2.17, 1], [39.47, -0.38, 0.6], [37.39, -5.98, 0.6], [43.26, -2.93, 0.5], [38.72, -9.14, 0.8], [41.15, -8.61, 0.6],
  [36.75, 3.06, 0.8], [36.81, 10.18, 0.6], [33.57, -7.59, 0.8], [34.02, -6.84, 0.5],
]

// World routes: generic cities on every continent, NOT customer locations. Each draws a great-circle arc to Geneva.
const ORIGINS: [number, number][] = [
  [40.71, -74.01], [37.77, -122.42], [43.65, -79.38], [-23.55, -46.63], [6.52, 3.38], [-33.92, 18.42],
  [25.2, 55.27], [19.08, 72.88], [1.35, 103.82], [35.68, 139.69], [-33.87, 151.21], [51.51, -0.13],
]

type V3 = [number, number, number]
const vec = (lat: number, lng: number): V3 => [Math.cos(lat * RAD) * Math.cos(lng * RAD), Math.cos(lat * RAD) * Math.sin(lng * RAD), Math.sin(lat * RAD)]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function slerp(a: V3, b: V3, t: number): V3 {
  const w = Math.acos(Math.min(1, Math.max(-1, dot(a, b))))
  if (w < 1e-6) return a
  const sa = Math.sin((1 - t) * w) / Math.sin(w), sb = Math.sin(t * w) / Math.sin(w)
  return [a[0] * sa + b[0] * sb, a[1] * sa + b[1] * sb, a[2] * sa + b[2] * sb]
}

/** Orthographic projection centred on (lat0, lng0): unit-disc coordinates (y up) and cos of the angular distance. */
function ortho(lat: number, lng: number, lat0: number, lng0: number) {
  const p = lat * RAD, l = lng * RAD, p0 = lat0 * RAD, l0 = lng0 * RAD
  const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0)
  return {
    x: Math.cos(p) * Math.sin(l - l0),
    y: Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0),
    cosc,
  }
}

/** Find the view centre that puts ANCHOR at a chosen point on the scene's planet (grid search, then refine). */
function fitCentre(s: Scene, target: { x: number; y: number }) {
  const tx = (target.x - s.cx) / s.r
  const ty = (s.cy - target.y) / s.r
  const err = (a: number, b: number) => {
    const q = ortho(ANCHOR.lat, ANCHOR.lng, a, b)
    return q.cosc <= 0 ? 1e9 : (q.x - tx) ** 2 + (q.y - ty) ** 2
  }
  let best = { a: 0, b: 0, e: Infinity }
  for (let a = -70; a <= 70; a += 1) for (let b = -180; b <= 180; b += 1) {
    const e = err(a, b)
    if (e < best.e) best = { a, b, e }
  }
  for (let a = best.a - 1; a <= best.a + 1; a += 0.05) for (let b = best.b - 1; b <= best.b + 1; b += 0.05) {
    const e = err(a, b)
    if (e < best.e) best = { a, b, e }
  }
  return best
}

/**
 * A route as seen from orbit: the great circle from `from` to Geneva, lifted off the surface by an altitude that grows
 * with distance. Only the part in front of the planet, or outside its silhouette, is visible; the drawn run is the
 * visible stretch that ends at Geneva, so routes from the far side emerge over the horizon.
 */
function route(s: Scene, c: { a: number; b: number }, from: [number, number]) {
  const l0 = c.b * RAD, p0 = c.a * RAD
  const e: V3 = [-Math.sin(l0), Math.cos(l0), 0]
  const n: V3 = [-Math.sin(p0) * Math.cos(l0), -Math.sin(p0) * Math.sin(l0), Math.cos(p0)]
  const k: V3 = vec(c.a, c.b)
  const A = vec(from[0], from[1]), B = vec(GENEVA.lat, GENEVA.lng)
  const w = Math.acos(Math.min(1, Math.max(-1, dot(A, B))))
  const lift = 0.015 + 0.06 * (w / Math.PI)
  const N = 90
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N
    const v = slerp(A, B, t)
    const r = 1 + lift * Math.sin(Math.PI * t)
    const X = r * dot(v, e), Y = r * dot(v, n), Z = r * dot(v, k)
    return { x: s.cx + X * s.r, y: s.cy - Y * s.r, ok: Z >= 0 || X * X + Y * Y > 1 }
  })
  // Draw only the arrival: the visible stretch within `reach` of Geneva, so lines come IN rather than cross the screen.
  const reach = s.w * 0.36
  const end = pts[N]
  let i = N
  while (i > 0 && pts[i - 1].ok && Math.hypot(pts[i - 1].x - end.x, pts[i - 1].y - end.y) < reach) i--
  const run = pts.slice(i)
  if (run.length < 8) return null
  const d = run.map((p, j) => `${j ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const origin = i === 0 && run[0].x > 0 && run[0].x < s.w && run[0].y > 0 && run[0].y < s.h ? run[0] : null
  return { d, origin }
}

function scene(s: Scene, target: { x: number; y: number }) {
  const c = fitCentre(s, target)
  const put = (lat: number, lng: number) => {
    const q = ortho(lat, lng, c.a, c.b)
    return { x: s.cx + q.x * s.r, y: s.cy - q.y * s.r, k: q.cosc }
  }
  const inView = (p: { x: number; y: number; k: number }) => p.k > 0.02 && p.x > -10 && p.x < s.w + 10 && p.y > -10 && p.y < s.h + 10
  return {
    land: lazy(() => landLatLng().map((g) => put(g.lat, g.lng)).filter(inView)),
    cities: CITIES.map(([lat, lng, size]) => ({ ...put(lat, lng), size })).filter(inView),
    diegem: put(DIEGEM.lat, DIEGEM.lng),
    geneva: put(GENEVA.lat, GENEVA.lng),
    routes: ORIGINS.map((o) => route(s, c, o)).filter((r): r is NonNullable<typeof r> => r !== null),
  }
}

const D = scene(DESKTOP, { x: 820, y: 800 })
const M = scene(MOBILE, { x: 200, y: 900 })

/** How a land dot is drawn: its radius and opacity follow its distance from the rim (k), dimmer on the phone. */
const landRadius = (k: number, quiet: boolean) => (quiet ? 1.1 : 1.6) * (0.45 + 0.55 * k)
const landOpacity = (k: number, look: 'land' | 'lights', quiet: boolean) => (quiet ? 0.4 : 1) * (look === 'land' ? 0.1 + 0.36 * k : 0.05 + 0.11 * k)

/**
 * The lights look's land dots for one layer, for scripts/draw-dot-fields.ts (the shipped look: D26, `globe-routes`).
 * k is rounded to 1/50 so the file holds a few dozen groups; a step moves a dot's radius by 0.02 px and its opacity
 * by 0.002, which nothing can see.
 */
export function globeLandDots(layer: 'desktop' | 'mobile'): { w: number; h: number; dots: Dot[] } {
  const quiet = layer === 'mobile'
  const s = quiet ? MOBILE : DESKTOP
  const g = quiet ? M : D
  const dots = g.land().map((p) => {
    const k = Math.round(p.k * 50) / 50
    return { x: p.x, y: p.y, r: landRadius(k, quiet), o: landOpacity(k, 'lights', quiet) }
  })
  return { w: s.w, h: s.h, dots }
}

// Phone: the copy covers most of the planet, so the globe is a quiet texture there (dimmer, finer, no markers;
// GlobeLegend names the two places instead).
/**
 * Subtraction switches (17-10, owner on the hero: "i feel like its too much"): `cities` drops the ~85 glowing city
 * lights, `half` keeps every other city light and every other route, dimmer. Defaults keep the approved look.
 */
type Less = { cities?: boolean; half?: boolean }

function Layer({ s, g, look, labels, id, quiet = false, world = false, cities = true, half = false }: { s: Scene; g: ReturnType<typeof scene>; look: 'land' | 'lights'; labels: boolean; id: string; quiet?: boolean; world?: boolean } & Less) {
  const arc = `M ${g.diegem.x.toFixed(1)} ${g.diegem.y.toFixed(1)} Q ${((g.diegem.x + g.geneva.x) / 2 + 30).toFixed(1)} ${(Math.min(g.diegem.y, g.geneva.y) - 40).toFixed(1)} ${g.geneva.x.toFixed(1)} ${g.geneva.y.toFixed(1)}`
  const dim = quiet ? 0.4 : 1
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${s.w} ${s.h}`} preserveAspectRatio={s.align} className={`absolute inset-0 h-full w-full ${s.className}`}>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#FD5E0F" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FD5E0F" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-light`}>
          <stop offset="0" stopColor="#FFD9A8" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#FFB36B" stopOpacity="0.45" />
          <stop offset="1" stopColor="#FD5E0F" stopOpacity="0" />
        </radialGradient>
        {/* Routes fade in below the buttons, so they never cross the copy. */}
        <linearGradient id={`${id}-routes-fade`} gradientUnits="userSpaceOnUse" x1="0" y1={g.geneva.y - 300} x2="0" y2={g.geneva.y - 170}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <mask id={`${id}-routes`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={s.w + 400} height={s.h + 400}>
          <rect x={-200} y={-200} width={s.w + 400} height={s.h + 400} fill={`url(#${id}-routes-fade)`} />
        </mask>
        <clipPath id={`${id}-disc`}>
          <circle cx={s.cx} cy={s.cy} r={s.r} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-disc)`}>
        {/* The lights look's land is a static file (dot-field.ts): thousands of inline circles weighed megabytes. The
            mock-only land look still draws them inline. */}
        {look === 'lights' ? (
          <image href={cdnUrl(quiet ? DOT_FIELDS.globeMobile : DOT_FIELDS.globeDesktop)} x="0" y="0" width={s.w} height={s.h} />
        ) : (
          g.land().map((p, i) => (
            <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={landRadius(p.k, quiet).toFixed(2)} fill="#f4f4f4" fillOpacity={landOpacity(p.k, look, quiet).toFixed(3)} />
          ))
        )}
        {look === 'lights' && cities &&
          g.cities.filter((_, i) => !half || i % 2 === 0).map((p, i) => (
            <g key={i}>
              <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={(15 * p.size * (0.4 + 0.6 * p.k)).toFixed(1)} fill={`url(#${id}-light)`} opacity={dim * (half ? 0.55 : 1)} />
              <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={(1.4 * (0.5 + 0.5 * p.size)).toFixed(2)} fill="#FFE7C8" fillOpacity="0.9" />
            </g>
          ))}
        {!quiet && !world && <>
        <path d={arc} fill="none" stroke="#f4f4f4" strokeOpacity="0.2" strokeWidth="1.2" />
        <path className="eo-pulse" d={arc} pathLength={1} fill="none" stroke="#FFB36B" strokeWidth="2" strokeLinecap="round" />
        </>}
        {!quiet && <>
        {[g.diegem, g.geneva].map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="24" fill={`url(#${id}-glow)`} />
            {(!world || i === 1) && <circle className="eo-ring" cx={p.x} cy={p.y} r="6" fill="none" stroke="#FD5E0F" strokeOpacity="0.7" />}
            <circle cx={p.x} cy={p.y} r="4" fill="#FD5E0F" />
          </g>
        ))}
        </>}
      </g>
      {world && (
        <g mask={`url(#${id}-routes)`}>
          {g.routes.filter((_, i) => !half || i % 2 === 0).map((r, i) => (
            <g key={i}>
              <path d={r.d} fill="none" stroke="#f4f4f4" strokeOpacity={quiet ? 0.08 : 0.14} strokeWidth="1" />
              <path className="eo-pulse" d={r.d} pathLength={1} fill="none" stroke="#FFB36B" strokeOpacity={quiet ? 0.6 : 1} strokeWidth="1.8" strokeLinecap="round" style={{ animationDelay: `${(1.4 + ((i * 0.37) % 3.2)).toFixed(2)}s` }} />
              {r.origin && <circle cx={r.origin.x} cy={r.origin.y} r="2.2" fill="#FFE7C8" fillOpacity={quiet ? 0.5 : 0.85} />}
            </g>
          ))}
          {quiet && <circle cx={g.geneva.x} cy={g.geneva.y} r="3.5" fill="#FD5E0F" />}
        </g>
      )}
      {labels && (
        <g fontFamily="inherit">
          <text x={g.diegem.x - 18} y={g.diegem.y - 4} textAnchor="end" fill="#f4f4f4" fontSize="15" fontWeight="500" stroke="#0a0a0a" strokeWidth="5" paintOrder="stroke" strokeLinejoin="round">Diegem, Belgium</text>
          <text x={g.diegem.x - 18} y={g.diegem.y + 16} textAnchor="end" fill="#a3a3a3" fontSize="13" stroke="#0a0a0a" strokeWidth="5" paintOrder="stroke" strokeLinejoin="round">Where Ciphera works</text>
          <text x={g.geneva.x + 18} y={g.geneva.y - 4} fill="#f4f4f4" fontSize="15" fontWeight="500" stroke="#0a0a0a" strokeWidth="5" paintOrder="stroke" strokeLinejoin="round">Geneva, Switzerland</text>
          <text x={g.geneva.x + 18} y={g.geneva.y + 16} fill="#a3a3a3" fontSize="13" stroke="#0a0a0a" strokeWidth="5" paintOrder="stroke" strokeLinejoin="round">Where your data is stored</text>
        </g>
      )}
    </svg>
  )
}

export function GlobeEurope({ look, world = false, cities = true, half = false }: { look: 'land' | 'lights'; world?: boolean } & Less) {
  return (
    <div data-mock="globe" aria-hidden="true" className="hz-glow pointer-events-none absolute inset-0 -z-10">
      <Layer s={DESKTOP} g={D} look={look} labels id={`ge-d-${look}`} world={world} cities={cities} half={half} />
      <Layer s={MOBILE} g={M} look={look} labels={false} id={`ge-m-${look}`} quiet world={world} cities={cities} half={half} />
    </div>
  )
}

/** The two places, for the phone layout and for screen readers. */
export function GlobeLegend() {
  return (
    // A list, not a <dl>: the dot beside each place cannot sit inside a description list's term groups. relative: the
    // hero's scrim must not paint over it when reduced motion removes the hz-in animation (OverhaulHero).
    <ul className="hz-in hz-in-5 relative mx-auto mt-12 grid max-w-sm grid-cols-2 gap-4 text-left text-sm md:hidden">
      {[
        ['Diegem, Belgium', 'Where Ciphera works'],
        ['Geneva, Switzerland', 'Where your data is stored'],
      ].map(([name, role]) => (
        <li key={name} className="flex items-start gap-2">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <div>
            <p className="font-medium text-foreground">{name}</p>
            <p className="text-muted-foreground">{role}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
