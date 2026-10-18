/**
 * The horizon: a planet's edge lit from behind, drawn in SVG rather than shipped as
 * a photograph. It is resolution-independent, a few KB, animatable, and ours outright
 * (the reference image's source and licence are unknown).
 *
 * Geometry is per breakpoint. On a landscape screen the rim crosses ~17% down the
 * centre column and exits bottom-right, so the headline sits on the dark disc; on a
 * portrait screen the same arc would cut diagonally through the copy, so the phone
 * scene is a shallow arc across the top instead.
 */

export type Scene = {
  id: string
  w: number
  h: number
  cx: number
  cy: number
  r: number
  /** Arc start / end, degrees, SVG convention (y down, clockwise positive). */
  t0: number
  t1: number
  /** Haze spread beyond the rim, in viewBox units. */
  spread: number
  flare: { x: number; y: number; rx: number; ry: number }
  /** Light direction for the haze mask: dark at (x1,y1), full at (x2,y2). */
  light: [number, number, number, number]
  className: string
  align: string
}

export const DESKTOP: Scene = {
  id: 'hzd',
  w: 1600,
  h: 1000,
  cx: -174,
  cy: 1780,
  r: 1900,
  t0: -86.3,
  t1: -8,
  spread: 720,
  flare: { x: 1540, y: 990, rx: 420, ry: 300 },
  light: [200, 0, 1600, 1000],
  className: 'hidden md:block',
  align: 'xMidYMin slice',
}

export const MOBILE: Scene = {
  id: 'hzm',
  w: 400,
  h: 860,
  cx: 520,
  cy: 1500,
  r: 1350,
  t0: -114,
  t1: -93.8,
  spread: 420,
  flare: { x: 420, y: 150, rx: 200, ry: 150 },
  light: [0, 300, 400, 100],
  className: 'md:hidden',
  align: 'xMidYMin slice',
}

function pt(s: Scene, deg: number) {
  const t = (deg * Math.PI) / 180
  return [s.cx + s.r * Math.cos(t), s.cy + s.r * Math.sin(t)] as const
}

function HorizonScene({ s }: { s: Scene }) {
  const [x0, y0] = pt(s, s.t0)
  const [x1, y1] = pt(s, s.t1)
  const arc = `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${s.r} ${s.r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
  const k = s.r / (s.r + s.spread)
  const id = (n: string) => `${s.id}-${n}`

  return (
    <svg
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${s.className}`}
      viewBox={`0 0 ${s.w} ${s.h}`}
      preserveAspectRatio={s.align}
    >
      <defs>
        <radialGradient id={id('haze')} gradientUnits="userSpaceOnUse" cx={s.cx} cy={s.cy} r={s.r + s.spread}>
          <stop offset={k} stopColor="#FD5E0F" stopOpacity="0.62" />
          <stop offset={k + (1 - k) * 0.12} stopColor="#E54E00" stopOpacity="0.34" />
          <stop offset={k + (1 - k) * 0.45} stopColor="#7A2300" stopOpacity="0.1" />
          <stop offset="1" stopColor="#3A1000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('light')} gradientUnits="userSpaceOnUse" x1={s.light[0]} y1={s.light[1]} x2={s.light[2]} y2={s.light[3]}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.75" stopColor="#fff" stopOpacity="0.72" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        {/* User-space region: the default (path bbox ±10%) clips a short arc's blurred glow into a hard band. */}
        <mask id={id('mask')} maskUnits="userSpaceOnUse" x={-200} y={-200} width={s.w + 400} height={s.h + 400}>
          <rect width={s.w} height={s.h} fill={`url(#${id('light')})`} />
        </mask>
        <linearGradient id={id('rim')} gradientUnits="userSpaceOnUse" x1={x0} y1={y0} x2={x1} y2={y1}>
          <stop offset="0" stopColor="#8A2A00" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#C2410C" stopOpacity="0.5" />
          <stop offset="0.72" stopColor="#FD5E0F" stopOpacity="0.9" />
          <stop offset="0.88" stopColor="#FFB36B" />
          <stop offset="1" stopColor="#FFF1E0" />
        </linearGradient>
        <radialGradient id={id('disc')} gradientUnits="userSpaceOnUse" cx={s.cx} cy={s.cy} r={s.r}>
          <stop offset="0" stopColor="#040404" />
          <stop offset="0.9" stopColor="#060606" />
          <stop offset="0.975" stopColor="#0B0806" />
          <stop offset="1" stopColor="#1C0D05" />
        </radialGradient>
        <radialGradient id={id('flare')} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFC58F" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#FD5E0F" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FD5E0F" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id('inside')}>
          <circle cx={s.cx} cy={s.cy} r={s.r} />
        </clipPath>
        <filter id={id('b1')} filterUnits="userSpaceOnUse" x={-200} y={-200} width={s.w + 400} height={s.h + 400}>
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={id('b2')} filterUnits="userSpaceOnUse" x={-200} y={-200} width={s.w + 400} height={s.h + 400}>
          <feGaussianBlur stdDeviation="36" />
        </filter>
        <filter id={id('grain')}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0" />
        </filter>
      </defs>

      <rect width={s.w} height={s.h} fill="#0a0a0a" />

      <g className="hz-glow">
        <circle cx={s.cx} cy={s.cy} r={s.r + s.spread} fill={`url(#${id('haze')})`} mask={`url(#${id('mask')})`} />
        <ellipse cx={s.flare.x} cy={s.flare.y} rx={s.flare.rx} ry={s.flare.ry} fill={`url(#${id('flare')})`} />
      </g>

      <circle cx={s.cx} cy={s.cy} r={s.r} fill={`url(#${id('disc')})`} />

      <g className="hz-glow">
        <path d={arc} fill="none" stroke="#FD7A2F" strokeOpacity="0.32" strokeWidth="70" filter={`url(#${id('b2')})`} mask={`url(#${id('mask')})`} />
        <path d={arc} fill="none" stroke="#FD7A2F" strokeOpacity="0.55" strokeWidth="14" filter={`url(#${id('b1')})`} mask={`url(#${id('mask')})`} />
        <g clipPath={`url(#${id('inside')})`}>
          <path d={arc} fill="none" stroke="#FD5E0F" strokeOpacity="0.2" strokeWidth="46" filter={`url(#${id('b1')})`} mask={`url(#${id('mask')})`} />
        </g>
      </g>

      <path className="hz-rim" d={arc} pathLength={1} fill="none" stroke={`url(#${id('rim')})`} strokeWidth="2.2" strokeLinecap="round" />

      <rect width={s.w} height={s.h} filter={`url(#${id('grain')})`} opacity="0.045" />
    </svg>
  )
}

export function Horizon() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <HorizonScene s={DESKTOP} />
      <HorizonScene s={MOBILE} />
    </div>
  )
}
