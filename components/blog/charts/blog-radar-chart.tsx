'use client'

import { chartCssVars, chartColors } from './chart-css-vars'
import { useChartSize } from './use-chart-size'

interface BlogRadarChartProps {
  title: string
  source?: string
  axes: string[]
  series: { label: string; values: number[]; color?: string }[]
  maxValue?: number
  aspectRatio?: string
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleIndex: number,
  totalAxes: number
): { x: number; y: number } {
  const angle = (2 * Math.PI * angleIndex) / totalAxes - Math.PI / 2
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  }
}

function RadarInner({
  width,
  height,
  axes,
  series,
  maxValue,
  title,
}: {
  width: number
  height: number
  axes: string[]
  series: BlogRadarChartProps['series']
  maxValue: number
  title: string
}) {
  const padding = 50
  const titleHeight = 30
  const cx = width / 2
  const cy = titleHeight + (height - titleHeight) / 2
  const radius = Math.min(width - padding * 2, height - titleHeight - padding * 2) / 2
  const numAxes = axes.length
  const rings = [0.25, 0.5, 0.75, 1]

  return (
    <svg width={width} height={height}>
      <text
        x={width / 2}
        y={20}
        textAnchor="middle"
        fill={chartCssVars.markerForeground}
        fontSize={14}
        fontWeight={600}
      >
        {title}
      </text>

      {/* Concentric rings */}
      {rings.map((fraction) => {
        const r = radius * fraction
        const points = Array.from({ length: numAxes }, (_, i) =>
          polarToCartesian(cx, cy, r, i, numAxes)
        )
        const d =
          points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
        return (
          <path
            key={fraction}
            d={d}
            fill="none"
            stroke={chartCssVars.grid}
            strokeDasharray="4,4"
            strokeWidth={1}
          />
        )
      })}

      {/* Axis lines */}
      {axes.map((_, i) => {
        const end = polarToCartesian(cx, cy, radius, i, numAxes)
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke={chartCssVars.grid}
            strokeWidth={1}
          />
        )
      })}

      {/* Series polygons */}
      {series.map((s, si) => {
        const color = s.color ?? chartColors[si % chartColors.length]
        const points = s.values.map((v, i) => {
          const r = (Math.min(v, maxValue) / maxValue) * radius
          return polarToCartesian(cx, cy, r, i, numAxes)
        })
        const d =
          points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
        return (
          <g key={s.label}>
            <path d={d} fill={color} fillOpacity={0.15} />
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeOpacity={0.8}
              strokeWidth={2}
            />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
            ))}
          </g>
        )
      })}

      {/* Axis labels */}
      {axes.map((label, i) => {
        const labelOffset = radius + 18
        const pos = polarToCartesian(cx, cy, labelOffset, i, numAxes)
        const angle = (2 * Math.PI * i) / numAxes - Math.PI / 2
        const isRight = Math.cos(angle) > 0.1
        const isLeft = Math.cos(angle) < -0.1
        const anchor = isRight ? 'start' : isLeft ? 'end' : 'middle'

        return (
          <text
            key={label}
            x={pos.x}
            y={pos.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fill={chartCssVars.label}
            fontSize={11}
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}

export function BlogRadarChart({
  title,
  source,
  axes,
  series,
  maxValue = 10,
  aspectRatio = '1 / 1',
}: BlogRadarChartProps) {
  const { containerRef, width, height } = useChartSize(aspectRatio)

  if (!axes || axes.length < 3 || !series || series.length === 0) return null

  return (
    <figure className="my-10">
      <div ref={containerRef} style={{ width: '100%' }}>
        {width > 0 && height > 0 && (
          <RadarInner
            width={width}
            height={height}
            axes={axes}
            series={series}
            maxValue={maxValue}
            title={title}
          />
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
        {series.map((s, i) => (
          <span key={s.label} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  s.color ?? chartColors[i % chartColors.length],
              }}
            />
            <span className="text-neutral-400">{s.label}</span>
          </span>
        ))}
      </div>
      {source && (
        <figcaption className="mt-2 text-center text-xs text-neutral-500">
          {source}
        </figcaption>
      )}
    </figure>
  )
}
