'use client'

import { useEffect, useState } from 'react'
import { scaleBand, scaleLinear } from '@visx/scale'
import { GridRows, GridColumns } from '@visx/grid'
import { ParentSize } from '@visx/responsive'
import { chartCssVars, chartColors } from './chart-css-vars'

interface BlogBarChartProps {
  title: string
  source?: string
  data: { label: string; value: number; color?: string }[]
  orientation?: 'horizontal' | 'vertical'
  valueFormat?: string
  aspectRatio?: string
}

function formatValue(format: string | undefined, value: number): string {
  if (!format) return String(value)
  return format.replace('{value}', String(value))
}

function HorizontalBarChart({
  width,
  height,
  data,
  title,
  valueFormat,
  animated,
}: {
  width: number
  height: number
  data: BlogBarChartProps['data']
  title: string
  valueFormat?: string
  animated: boolean
}) {
  const margin = { top: 40, right: 40, bottom: 30, left: 140 }
  const innerWidth = Math.max(width - margin.left - margin.right, 0)
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0)

  const yScale = scaleBand<string>({
    domain: data.map((d) => d.label),
    range: [0, innerHeight],
    padding: 0.3,
  })

  const maxVal = Math.max(...data.map((d) => d.value), 0)
  const xScale = scaleLinear<number>({
    domain: [0, maxVal * 1.15],
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
        <GridRows
          scale={yScale}
          width={innerWidth}
          stroke={chartCssVars.grid}
          numTicks={data.length}
        />
        {data.map((d, i) => {
          const barY = yScale(d.label) ?? 0
          const barHeight = yScale.bandwidth()
          const barWidth = xScale(d.value)

          return (
            <g key={d.label}>
              <text
                x={-8}
                y={barY + barHeight / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fill={chartCssVars.label}
                fontSize={12}
              >
                {d.label}
              </text>
              <rect
                x={0}
                y={barY}
                width={animated ? barWidth : 0}
                height={barHeight}
                rx={4}
                fill={d.color ?? chartColors[i % chartColors.length] ?? chartColors[0]}
                style={{
                  transition: `width 0.6s ease-out ${i * 0.08}s`,
                }}
              />
              <text
                x={(animated ? barWidth : 0) + 6}
                y={barY + barHeight / 2}
                dominantBaseline="middle"
                fill={chartCssVars.markerForeground}
                fontSize={12}
                fontWeight={500}
                style={{
                  transition: `x 0.6s ease-out ${i * 0.08}s`,
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

function VerticalBarChart({
  width,
  height,
  data,
  title,
  valueFormat,
  animated,
}: {
  width: number
  height: number
  data: BlogBarChartProps['data']
  title: string
  valueFormat?: string
  animated: boolean
}) {
  const margin = { top: 40, right: 20, bottom: 60, left: 50 }
  const innerWidth = Math.max(width - margin.left - margin.right, 0)
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0)

  const xScale = scaleBand<string>({
    domain: data.map((d) => d.label),
    range: [0, innerWidth],
    padding: 0.3,
  })

  const maxVal = Math.max(...data.map((d) => d.value), 0)
  const yScale = scaleLinear<number>({
    domain: [0, maxVal * 1.15],
    range: [innerHeight, 0],
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
          numTicks={data.length}
        />
        {data.map((d, i) => {
          const barX = xScale(d.label) ?? 0
          const barWidth = xScale.bandwidth()
          const barHeight = innerHeight - yScale(d.value)

          return (
            <g key={d.label}>
              <rect
                x={barX}
                y={animated ? yScale(d.value) : innerHeight}
                width={barWidth}
                height={animated ? barHeight : 0}
                rx={4}
                fill={d.color ?? chartColors[i % chartColors.length] ?? chartColors[0]}
                style={{
                  transition: `y 0.6s ease-out ${i * 0.08}s, height 0.6s ease-out ${i * 0.08}s`,
                }}
              />
              <text
                x={barX + barWidth / 2}
                y={(animated ? yScale(d.value) : innerHeight) - 6}
                textAnchor="middle"
                fill={chartCssVars.markerForeground}
                fontSize={12}
                fontWeight={500}
                style={{
                  transition: `y 0.6s ease-out ${i * 0.08}s`,
                }}
              >
                {formatValue(valueFormat, d.value)}
              </text>
              <text
                x={barX + barWidth / 2}
                y={innerHeight + 20}
                textAnchor="middle"
                fill={chartCssVars.label}
                fontSize={12}
              >
                {d.label}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function BlogBarChart({
  title,
  source,
  data,
  orientation = 'horizontal',
  valueFormat,
  aspectRatio = '3 / 2',
}: BlogBarChartProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!data || data.length === 0) return null

  return (
    <figure className="my-10">
      <div style={{ aspectRatio, width: '100%' }}>
        <ParentSize>
          {({ width, height }) =>
            width > 0 && height > 0 ? (
              orientation === 'horizontal' ? (
                <HorizontalBarChart
                  width={width}
                  height={height}
                  data={data}
                  title={title}
                  valueFormat={valueFormat}
                  animated={animated}
                />
              ) : (
                <VerticalBarChart
                  width={width}
                  height={height}
                  data={data}
                  title={title}
                  valueFormat={valueFormat}
                  animated={animated}
                />
              )
            ) : null
          }
        </ParentSize>
      </div>
      {source && (
        <figcaption className="mt-2 text-center text-xs text-neutral-500">
          {source}
        </figcaption>
      )}
    </figure>
  )
}
