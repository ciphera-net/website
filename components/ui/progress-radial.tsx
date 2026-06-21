'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

function ProgressRadial({
  className,
  value = 0,
  size = 120,
  strokeWidth = 8,
  startAngle = -90,
  endAngle = 270,
  showLabel = false,
  trackClassName,
  indicatorClassName,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  value?: number
  size?: number
  strokeWidth?: number
  startAngle?: number
  endAngle?: number
  showLabel?: boolean
  trackClassName?: string
  indicatorClassName?: string
  children?: React.ReactNode
}) {
  const radius = (size - strokeWidth) / 2
  const angleRange = endAngle - startAngle
  const progressAngle = (value / 100) * angleRange

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180

  const startX = size / 2 + radius * Math.cos(toRadians(startAngle))
  const startY = size / 2 + radius * Math.sin(toRadians(startAngle))
  const endX = size / 2 + radius * Math.cos(toRadians(startAngle + progressAngle))
  const endY = size / 2 + radius * Math.sin(toRadians(startAngle + progressAngle))

  const largeArc = progressAngle > 180 ? 1 : 0

  const pathData = ['M', startX, startY, 'A', radius, radius, 0, largeArc, 1, endX, endY].join(' ')

  return (
    <div
      data-slot="progress-radial"
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path
          d={[
            'M',
            size / 2 + radius * Math.cos(toRadians(startAngle)),
            size / 2 + radius * Math.sin(toRadians(startAngle)),
            'A',
            radius,
            radius,
            0,
            angleRange > 180 ? 1 : 0,
            1,
            size / 2 + radius * Math.cos(toRadians(endAngle === startAngle + 360 ? endAngle - 0.001 : endAngle)),
            size / 2 + radius * Math.sin(toRadians(endAngle === startAngle + 360 ? endAngle - 0.001 : endAngle)),
          ].join(' ')}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="butt"
          className={cn('text-foreground/10', trackClassName)}
        />
        <path
          d={pathData}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="butt"
          className={cn('text-primary transition-all duration-1000 ease-out', indicatorClassName)}
        />
      </svg>
      {(showLabel || children) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children || <span className="text-lg font-bold text-foreground">{value}%</span>}
        </div>
      )}
    </div>
  )
}

export { ProgressRadial }
