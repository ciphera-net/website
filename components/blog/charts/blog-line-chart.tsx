'use client'

import { useEffect, useState } from 'react'
import { scaleLinear, scalePoint } from '@visx/scale'
import { GridRows } from '@visx/grid'
import { LinePath } from '@visx/shape'
import { curveMonotoneX } from '@visx/curve'
import { ParentSize } from '@visx/responsive'
import { chartCssVars, chartColors } from './chart-css-vars'

interface BlogLineChartProps {
  title: string
  source?: string
  data: Record<string, string | number>[]
  xKey: string
  lines: { key: string; label: string; color?: string }[]
  yFormat?: string
  aspectRatio?: string
}

function formatValue(format: string | undefined, value: number): string {
  if (!format) return String(value)
  return format.replace('{value}', String(value))
}

function LineChartInner({
  width,
  height,
  data,
  xKey,
  lines,
  yFormat,
  title,
  animated,
}: {
  width: number
  height: number
  data: Record<string, string | number>[]
  xKey: string
  lines: BlogLineChartProps['lines']
  yFormat?: string
  title: string
  animated: boolean
}) {
  const margin = { top: 40, right: 20, bottom: 40, left: 55 }
  const innerWidth = Math.max(width - margin.left - margin.right, 0)
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0)

  const xLabels = data.map((d) => String(d[xKey]))

  const allValues = lines.flatMap((line) =>
    data.map((d) => Number(d[line.key]))
  )
  const yMax = Math.max(...allValues, 0)

  const xScale = scalePoint<string>({
    domain: xLabels,
    range: [0, innerWidth],
    padding: 0.5,
  })

  const yScale = scaleLinear<number>({
    domain: [0, yMax * 1.15],
    range: [innerHeight, 0],
    nice: true,
  })

  const yTicks = yScale.ticks(5)
  const clipId = 'line-clip'

  return (
    <svg width={width} height={height}>
      <defs>
        <clipPath id={clipId}>
          <rect
            x={0}
            y={0}
            width={animated ? innerWidth : 0}
            height={innerHeight}
            style={{ transition: 'width 1s ease-out' }}
          />
        </clipPath>
      </defs>
      <text
        x={width / 2}
        y={24}
        textAnchor="middle"
        fill={chartCssVars.markerForeground}
        fontSize={14}
        fontWeight={600}
      >
        {title}
      </text>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <GridRows
          scale={yScale}
          width={innerWidth}
          stroke={chartCssVars.grid}
          strokeDasharray="4,4"
          numTicks={5}
        />
        {/* Y-axis labels */}
        {yTicks.map((tick) => (
          <text
            key={tick}
            x={-10}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            fill={chartCssVars.label}
            fontSize={11}
          >
            {formatValue(yFormat, tick)}
          </text>
        ))}
        {/* X-axis labels */}
        {xLabels.map((label) => (
          <text
            key={label}
            x={xScale(label) ?? 0}
            y={innerHeight + 20}
            textAnchor="middle"
            fill={chartCssVars.label}
            fontSize={11}
          >
            {label}
          </text>
        ))}
        <g clipPath={`url(#${clipId})`}>
          {lines.map((line, lineIndex) => {
            const color =
              line.color ?? chartColors[lineIndex % chartColors.length]
            return (
              <g key={line.key}>
                <LinePath
                  data={data}
                  x={(d) => xScale(String(d[xKey])) ?? 0}
                  y={(d) => yScale(Number(d[line.key]))}
                  curve={curveMonotoneX}
                  stroke={color}
                  strokeWidth={2.5}
                />
                {data.map((d, i) => (
                  <circle
                    key={i}
                    cx={xScale(String(d[xKey])) ?? 0}
                    cy={yScale(Number(d[line.key]))}
                    r={4}
                    fill={color}
                  />
                ))}
              </g>
            )
          })}
        </g>
      </g>
    </svg>
  )
}

export function BlogLineChart({
  title,
  source,
  data,
  xKey,
  lines,
  yFormat,
  aspectRatio = '3 / 2',
}: BlogLineChartProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!data || data.length === 0 || !lines || lines.length === 0) return null

  return (
    <figure className="my-10">
      <div style={{ aspectRatio, width: '100%' }}>
        <ParentSize>
          {({ width, height }) =>
            width > 0 && height > 0 ? (
              <LineChartInner
                width={width}
                height={height}
                data={data}
                xKey={xKey}
                lines={lines}
                yFormat={yFormat}
                title={title}
                animated={animated}
              />
            ) : null
          }
        </ParentSize>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
        {lines.map((line, i) => (
          <span key={line.key} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  line.color ?? chartColors[i % chartColors.length],
              }}
            />
            <span className="text-neutral-400">{line.label}</span>
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
