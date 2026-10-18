/**
 * Option B: the map is the argument. One flat, dotted Europe with two lit points joined by an arc — the two
 * jurisdictions read off their position on the map, not off a pair of equal-weight cards (that's option A).
 * Captions sit left/right beneath the map, mirroring where each place actually sits. Copy is a DRAFT; facts per
 * the design round brief (company: Diegem, Belgium; data: Zurich + a Swiss backup site).
 */
import { createMap } from 'svg-dotted-map'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { cdnUrl } from '@/lib/cdn'
import { DOT_FIELDS, type Dot } from '../../dot-field'
import { lazy, markerProjector } from '../../dotted-map-projection'
import { INFRA_MARKS } from '../../brand-marks'
import { Section } from '../Section'
import { Reveal } from '../Reveal'

// Same crop as the hero's flat Europe (lat 42–58.5, lng -14–44): wide enough to keep Britain, Denmark and Italy
// recognisable, tight enough that Belgium and Switzerland read as two distinct places. 2:1-ish box so the true
// shape survives scaling.
const MAP_W = 702
const MAP_H = 300
const MAP = { width: MAP_W, height: MAP_H, mapSamples: 6000, region: { lat: { min: 42, max: 58.5 }, lng: { min: -14, max: 44 } } }
// The dots are a static file (dot-field.ts); sampling the land is seconds of CPU on a shared container, so only the
// dot-field script asks for it. The two places come from the same projection without sampling (dotted-map-projection.ts).
const landPoints = lazy(() => createMap(MAP).points)

const [diegem, zurich] = [
  { lat: 50.8907, lng: 4.4614, key: 'diegem' },
  { lat: 47.3769, lng: 8.5417, key: 'zurich' },
].map(markerProjector(MAP))

/** The map's dots for scripts/draw-dot-fields.ts: one radius, seven opacities (the page draws them from a static file). */
export function europeDots(): { w: number; h: number; dots: Dot[] } {
  return { w: MAP_W, h: MAP_H, dots: landPoints().map((p, i) => ({ x: p.x, y: p.y, r: 1.3, o: 0.14 + (i % 7) * 0.02 })) }
}

const midX = (diegem.x + zurich.x) / 2
const bendY = Math.min(diegem.y, zurich.y) - 36
const arc = `M ${diegem.x.toFixed(1)} ${diegem.y.toFixed(1)} Q ${midX.toFixed(1)} ${bendY.toFixed(1)} ${zurich.x.toFixed(1)} ${zurich.y.toFixed(1)}`

export function WhereDataLivesB() {
  return (
    <Section
      id="where"
      eyebrow="Where your data lives"
      title="A Belgian company, on Swiss servers."
      lead="Two places on the map below, each under its own law."
    >
      <Reveal>
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="block h-auto w-full"
          role="img"
          aria-label="A dotted map of Europe marking Diegem, Belgium and Zurich, Switzerland"
        >
          <defs>
            <radialGradient id="wdlb-fade" cx="50%" cy="46%" r="72%">
              <stop offset="0.4" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="wdlb-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={MAP_W} height={MAP_H}>
              <rect width={MAP_W} height={MAP_H} fill="url(#wdlb-fade)" />
            </mask>
            <radialGradient id="wdlb-glow">
              <stop offset="0" stopColor="#FD5E0F" stopOpacity="0.65" />
              <stop offset="1" stopColor="#FD5E0F" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g mask="url(#wdlb-mask)">
            {/* ~3,900 dots, drawn once as a static file (dot-field.ts). */}
            <image href={cdnUrl(DOT_FIELDS.europe)} x="0" y="0" width={MAP_W} height={MAP_H} />
          </g>

          <path d={arc} pathLength={1} fill="none" stroke="#f4f4f4" strokeOpacity="0.16" strokeWidth="1.2" />
          <path className="eo-pulse" d={arc} pathLength={1} fill="none" stroke="#FFB36B" strokeWidth="1.8" strokeLinecap="round" />

          {[diegem, zurich].map((m) => (
            <g key={m.key}>
              <circle cx={m.x} cy={m.y} r="22" fill="url(#wdlb-glow)" />
              <circle className="eo-ring" cx={m.x} cy={m.y} r="5" fill="none" stroke="#FD5E0F" strokeOpacity="0.7" />
              <circle cx={m.x} cy={m.y} r="3.5" fill="#FD5E0F" />
            </g>
          ))}
        </svg>
      </Reveal>

      <Reveal delay={90}>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
          <div>
            <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Diegem, Belgium</h3>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Ciphera BV is registered here, and our contracts and support come from here. Belgian law and the GDPR apply.
            </p>
          </div>
          <div className="sm:text-right">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Zurich, Switzerland</h3>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:ml-auto">
              Your data is stored on servers here, with backups elsewhere in Switzerland. The Swiss data protection
              act applies.
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">Runs on</p>
          <div className="mt-5 flex flex-wrap items-start gap-x-10 gap-y-5">
            {INFRA_MARKS.map((m) => (
              <div key={m.key} className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-foreground/80" fill="currentColor" aria-hidden="true">
                  <path d={m.path} />
                </svg>
                <div>
                  <p className="text-[14px] font-medium text-foreground">{m.name}</p>
                  <p className="text-[13px] text-muted-foreground">
                    {m.role} · {m.where}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="/privacy"
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary"
          >
            Every provider we use <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </Section>
  )
}
