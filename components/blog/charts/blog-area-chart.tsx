'use client'

import { useEffect, useState } from 'react'
import { scaleLinear, scalePoint } from '@visx/scale'
import { GridRows } from '@visx/grid'
import { AreaClosed, LinePath } from '@visx/shape'
import { LinearGradient } from '@visx/gradient'
import { curveMonotoneX } from '@visx/curve'
import { chartCssVars } from './chart-css-vars'
import { useChartSize } from './use-chart-size'

interface BlogAreaChartProps {
  title: string
  source?: string
  data: Record<string, string | number>[]
  xKey: string
  yKey: string
  yFormat?: string
  aspectRatio?: string
}

function formatValue(format: string | undefined, value: number): string {
  if (!format) return String(value)
  return format.replace('{value}', String(value))
}

function AreaChartInner({
  width,
  height,
  data,
  xKey,
  yKey,
  yFormat,
  title,
  animated,
}: {
  width: number
  height: number
  data: Record<string, string | number>[]
  xKey: string
  yKey: string
  yFormat?: string
  title: string
  animated: boolean
}) {
  const margin = { top: 40, right: 20, bottom: 40, left: 55 }
  const innerWidth = Math.max(width - margin.left - margin.right, 0)
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0)

  const xLabels = data.map((d) => String(d[xKey]))
  const yValues = data.map((d) => Number(d[yKey]))
  const yMax = Math.max(...yValues, 0)

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
  const gradientId = 'area-gradient'
  const clipId = 'area-clip'

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
      <LinearGradient
        id={gradientId}
        from={chartCssVars.linePrimary}
        to={chartCssVars.linePrimary}
        fromOpacity={0.4}
        toOpacity={0.05}
      />
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
          <AreaClosed
            data={data}
            x={(d) => xScale(String(d[xKey])) ?? 0}
            y={(d) => yScale(Number(d[yKey]))}
            yScale={yScale}
            curve={curveMonotoneX}
            fill={`url(#${gradientId})`}
          />
          <LinePath
            data={data}
            x={(d) => xScale(String(d[xKey])) ?? 0}
            y={(d) => yScale(Number(d[yKey]))}
            curve={curveMonotoneX}
            stroke={chartCssVars.linePrimary}
            strokeWidth={3}
          />
          {data.map((d, i) => {
            const cx = xScale(String(d[xKey])) ?? 0
            const cy = yScale(Number(d[yKey]))
            const isLast = i === data.length - 1
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={isLast ? 6 : 4}
                fill={chartCssVars.linePrimary}
              />
            )
          })}
        </g>
      </g>
    </svg>
  )
}

export function BlogAreaChart({
  title,
  source,
  data,
  xKey,
  yKey,
  yFormat,
  aspectRatio = '3 / 2',
}: BlogAreaChartProps) {
  const [animated, setAnimated] = useState(false)
  const { containerRef, width, height } = useChartSize(aspectRatio)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!data || data.length === 0) return null

  return (
    <figure className="my-10">
      <div ref={containerRef} style={{ width: '100%' }}>
        {width > 0 && height > 0 && (
          <AreaChartInner
            width={width}
            height={height}
            data={data}
            xKey={xKey}
            yKey={yKey}
            yFormat={yFormat}
            title={title}
            animated={animated}
          />
        )}
      </div>
      {source && (
        <figcaption className="mt-2 text-center text-xs text-neutral-500">
          {source}
        </figcaption>
      )}
    </figure>
  )
}
