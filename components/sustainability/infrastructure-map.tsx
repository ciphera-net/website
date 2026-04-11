'use client'

import { motion } from 'motion/react'
import type { InventoryItem } from './types'

interface InfrastructureMapProps {
  inventory: InventoryItem[]
}

/**
 * Animated SVG node graph showing the 7 instances. Deliberately NOT a
 * geographic map — an abstract cluster keeps focus on "7 machines total"
 * rather than "look how small Switzerland is". The 6 Zurich instances
 * form a ring cluster on the left; envoy-ops sits alone on the right as
 * a visual hint at its CH-GVA-2 exception.
 *
 * Client component because motion's animate() runs in the browser.
 */
export function InfrastructureMap({ inventory }: InfrastructureMapProps) {
  const zurich = inventory.filter((i) => i.zone === 'CH-DK-2')
  const geneva = inventory.filter((i) => i.zone === 'CH-GVA-2')

  // * Ring positions for the 6 Zurich nodes around a centre point
  const centreX = 300
  const centreY = 250
  const radius = 150
  const zurichPositions = zurich.map((_, i) => {
    const angle = (2 * Math.PI * i) / Math.max(zurich.length, 1) - Math.PI / 2
    return {
      x: centreX + radius * Math.cos(angle),
      y: centreY + radius * Math.sin(angle),
    }
  })

  // * envoy-ops sits alone on the right
  const genevaPosition = { x: 700, y: 250 }

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 900 500"
        className="w-full h-auto"
        role="img"
        aria-label={`Infrastructure diagram showing ${inventory.length} instances`}
      >
        {/* Faint connecting lines between Zurich nodes */}
        {zurichPositions.map((pos, i) =>
          zurichPositions.slice(i + 1).map((otherPos, j) => (
            <line
              key={`${i}-${j}`}
              x1={pos.x}
              y1={pos.y}
              x2={otherPos.x}
              y2={otherPos.y}
              stroke="white"
              strokeOpacity={0.06}
              strokeWidth={1}
            />
          ))
        )}

        {/* Zone label: Zurich */}
        <text
          x={centreX}
          y={90}
          textAnchor="middle"
          className="fill-neutral-500"
          style={{ fontSize: 14, fontFamily: 'inherit' }}
        >
          CH-DK-2 · Zurich
        </text>

        {/* Zurich nodes */}
        {zurich.map((inst, i) => {
          const pos = zurichPositions[i]
          return (
            <motion.g
              key={inst.instance}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={24}
                fill="#171717"
                stroke="#fd5e0f"
                strokeOpacity={0.4}
                strokeWidth={2}
              />
              <text
                x={pos.x}
                y={pos.y + 48}
                textAnchor="middle"
                className="fill-neutral-300"
                style={{ fontSize: 12, fontFamily: 'inherit', fontWeight: 500 }}
              >
                {inst.instance}
              </text>
            </motion.g>
          )
        })}

        {/* Zone label: Geneva */}
        <text
          x={genevaPosition.x}
          y={90}
          textAnchor="middle"
          className="fill-neutral-500"
          style={{ fontSize: 14, fontFamily: 'inherit' }}
        >
          CH-GVA-2 · Geneva
        </text>

        {/* Geneva node */}
        {geneva.map((inst) => (
          <motion.g
            key={inst.instance}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.4, ease: 'easeOut' }}
          >
            <circle
              cx={genevaPosition.x}
              cy={genevaPosition.y}
              r={24}
              fill="#171717"
              stroke="#fd5e0f"
              strokeOpacity={0.4}
              strokeWidth={2}
            />
            <text
              x={genevaPosition.x}
              y={genevaPosition.y + 48}
              textAnchor="middle"
              className="fill-neutral-300"
              style={{ fontSize: 12, fontFamily: 'inherit', fontWeight: 500 }}
            >
              {inst.instance}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  )
}
