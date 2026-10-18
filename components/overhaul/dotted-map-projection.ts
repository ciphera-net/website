/**
 * svg-dotted-map without its land sampling, for the server's request path.
 *
 * 🔴 WHY THIS EXISTS (18-10-2026, the release's rollback). `createMap()` tests every cell of its grid against every
 * country polygon of the world, and does it TWICE per call (once uncached, once to fill its cache): with 30,000 samples
 * that is the bulk of the first homepage render after a server starts (16.9 s of a 22.7 s profiled cold request).
 * Called at module scope it ran on the first request of every new container, and on Magic Containers' shared CPU that
 * request outlasted the 7 s health probe on `/` three times in a row in the slower regions (Jakarta, Tokyo, Sydney): the
 * pods restarted in a loop and the platform rolled the release back to the previous image.
 *
 * The dots are static files now (dot-field.ts), so the request path needs only where a place lands on the grid, which
 * `addMarkers()` computes from the grid size and the Mercator projection alone, never from the sampled land.
 * `markerProjector()` is that computation, copied from svg-dotted-map 2.0.1 (dist/index.mjs, `r1` and `U`), so the
 * markers land exactly where the library puts them. `lazy()` defers any real `createMap()` (the dot-field script, the
 * mock-only variants) to the first call that needs it.
 */

type Region = { lat: { min: number; max: number }; lng: { min: number; max: number } }

const EXTENT = 20037508.34

/** The library's `C`: longitude/latitude to Web Mercator metres. */
function mercator(lng: number, lat: number): [number, number] {
  const x = (lng * EXTENT) / 180
  const y = ((Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180)) * EXTENT) / 180
  return [x, y]
}

/**
 * The grid position svg-dotted-map's `addMarkers()` gives a place, for a map made with the same width, height, region,
 * sample count and dot radius. Pure arithmetic: no polygon is read.
 */
export function markerProjector({
  width,
  height,
  region,
  mapSamples = 6000,
  radius = 0.3,
}: {
  width: number
  height: number
  region: Region
  mapSamples?: number
  radius?: number
}) {
  const ratio = width / height
  const rows = Math.round(Math.sqrt(mapSamples / ratio))
  const columns = Math.round(rows * ratio)
  const lat = { min: Math.max(region.lat.min, -85), max: Math.min(region.lat.max, 85) }
  const [xMin, yMin] = mercator(region.lng.min, lat.min)
  const [xMax, yMax] = mercator(region.lng.max, lat.max)
  const xRange = xMax - xMin
  const yRange = yMax - yMin
  const pad = radius * 1.25
  const innerW = width - 2 * pad
  const innerH = height - 2 * pad
  return <T extends { lat: number; lng: number }>(place: T): Omit<T, 'lat' | 'lng'> & { x: number; y: number } => {
    const { lat: plat, lng: plng, ...rest } = place
    const [x, y] = mercator(plng, plat)
    const column = Math.round(((x - xMin) / xRange) * (columns - 1))
    const row = Math.round(((yMax - y) / yRange) * (rows - 1))
    return { x: pad + (column / (columns - 1)) * innerW, y: pad + (row / (rows - 1)) * innerH, ...rest }
  }
}

/** A value computed on first use and kept: module scope without the module-load cost. */
export function lazy<T>(make: () => T): () => T {
  let value: T | undefined
  let made = false
  return () => {
    if (!made) {
      value = make()
      made = true
    }
    return value as T
  }
}
