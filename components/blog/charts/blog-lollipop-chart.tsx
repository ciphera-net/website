'use client'

import { useEffect, useState } from 'react'
import { scaleBand, scaleLinear } from '@visx/scale'
import { GridColumns } from '@visx/grid'
import { chartCssVars, chartColors } from './chart-css-vars'
import { useChartSize } from './use-chart-size'

interface BlogLollipopChartProps {
  title: string
  source?: string
  data: { label: string; value: number; color?: string }[]
  valueFormat?: string
  aspectRatio?: string
}

function formatValue(format: string | undefined, value: number): string {
  if (!format) return String(value)
  return format.replace('{value}', String(value))
}

function LollipopInner({
  width,
  height,
  data,
  title,
  valueFormat,
  animated,
}: {
  width: number
  height: number
  data: BlogLollipopChartProps['data']
  title: string
  valueFormat?: string
  animated: boolean
}) {
  const margin = { top: 40, right: 50, bottom: 30, left: 140 }
  const innerWidth = Math.max(width - margin.left - margin.right, 0)
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0)

  const yScale = scaleBand<string>({
    domain: data.map((d) => d.label),
    range: [0, innerHeight],
    padding: 0.4,
  })

  const maxVal = Math.max(...data.map((d) => d.value), 0)
  const xScale = scaleLinear<number>({
    domain: [0, maxVal * 1.2],
    range: [0, innerWidth],
  })

  return (
    <svg width={width} height={height}>
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
        <GridColumns
          scale={xScale}
          height={innerHeight}
          stroke={chartCssVars.grid}
          strokeDasharray="4,4"
          numTicks={5}
        />
        {data.map((d, i) => {
          const y = (yScale(d.label) ?? 0) + yScale.bandwidth() / 2
          const xEnd = animated ? xScale(d.value) : 0
          const color =
            d.color ?? chartColors[i % chartColors.length] ?? chartColors[0]

          return (
            <g key={d.label}>
              {/* Category label */}
              <text
                x={-8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fill={chartCssVars.label}
                fontSize={12}
              >
                {d.label}
              </text>
              {/* Stem line */}
              <line
                x1={0}
                y1={y}
                x2={xEnd}
                y2={y}
                stroke={chartCssVars.foreground}
                strokeWidth={2}
                style={{
                  transition: `x2 0.6s ease-out ${i * 0.08}s`,
                }}
              />
              {/* Circle */}
              <circle
                cx={xEnd}
                cy={y}
                r={6}
                fill={color}
                style={{
                  transition: `cx 0.6s ease-out ${i * 0.08}s`,
                  opacity: animated ? 1 : 0,
                  transitionProperty: 'cx, opacity',
                }}
              />
              {/* Value label */}
              <text
                x={xEnd + 12}
                y={y}
                dominantBaseline="middle"
                fill={chartCssVars.markerForeground}
                fontSize={12}
                fontWeight={500}
                style={{
                  transition: `x 0.6s ease-out ${i * 0.08}s`,
                  opacity: animated ? 1 : 0,
                  transitionProperty: 'x, opacity',
                }}
              >
                {formatValue(valueFormat, d.value)}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function BlogLollipopChart({
  title,
  source,
  data,
  valueFormat,
  aspectRatio = '3 / 2',
}: BlogLollipopChartProps) {
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
          <LollipopInner
            width={width}
            height={height}
            data={data}
            title={title}
            valueFormat={valueFormat}
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
