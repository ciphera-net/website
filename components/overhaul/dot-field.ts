/**
 * The homepage's dot fields (the hero's globe, desktop and phone, and the Europe map under *Where your data lives*),
 * drawn ONCE as static SVG files on the CDN instead of as inline circles. Inline, they were ~17,800 <circle> elements,
 * and the App Router sends a server component's markup twice (the HTML and the RSC payload), so they made the homepage
 * ~4.3 MB of HTML (plan §8). The routes, the two places, their labels and every animation stay inline.
 *
 * `scripts/draw-dot-fields.ts` draws the files from the same geometry the components compute and prints their names;
 * the names carry a hash of their bytes, so a changed field is a new URL (the CDN caches these paths immutably).
 * 🔴 After any change to the geometry (GlobeEurope, WhereDataLivesB) or to dotFieldSvg(): redraw, upload, and update
 * DOT_FIELDS in the same change, or the page shows the old dots under the new routes.
 */

export type Dot = { x: number; y: number; r: number; o: number }

/**
 * Many dots as one SVG document. Dots that share a radius and an opacity become one path of round-capped, near-zero
 * length strokes (about 16 bytes a dot instead of about 90 for a <circle>). Coordinates keep one decimal, as the inline
 * circles did; radius and opacity are rounded by the caller into a few dozen groups.
 */
export function dotFieldSvg(w: number, h: number, dots: Dot[], colour = '#f4f4f4'): string {
  const groups = new Map<string, string[]>()
  for (const d of dots) {
    const key = `${(2 * d.r).toFixed(2)}|${d.o.toFixed(3)}`
    const list = groups.get(key) ?? []
    list.push(`M${d.x.toFixed(1)} ${d.y.toFixed(1)}h.01`)
    groups.set(key, list)
  }
  const paths = [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, segs]) => {
      const [width, opacity] = key.split('|')
      return `<path stroke-width="${width}" stroke-opacity="${opacity}" d="${segs.join('')}"/>`
    })
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
    `<g fill="none" stroke="${colour}" stroke-linecap="round">${paths.join('')}</g></svg>\n`
  )
}

/** The drawn files, relative to the website's CDN prefix (cdnUrl). Printed by scripts/draw-dot-fields.ts. */
export const DOT_FIELDS = {
  globeDesktop: '/overhaul/dots/globe-desktop-b5a47fae34a9.svg', // 11,647 dots, 190,857 bytes (62 KB compressed)
  globeMobile: '/overhaul/dots/globe-mobile-e6b0b4da35d3.svg', // 2,274 dots, 37,156 bytes
  europe: '/overhaul/dots/europe-a97a71340d11.svg', // 3,861 dots, 61,058 bytes
} as const
