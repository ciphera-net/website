import type { InventoryItem } from './types'
import { InfrastructureMap } from './infrastructure-map'

interface InfrastructureTableProps {
  inventory: InventoryItem[]
}

/**
 * Section 4 — Every server we run. Animated node graph above a table
 * listing all 7 instances with their specs, zones, and purposes.
 */
export function InfrastructureTable({ inventory }: InfrastructureTableProps) {
  return (
    <section id="infrastructure" className="py-20 lg:py-32 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <InfrastructureMap inventory={inventory} />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Every server we run. All seven of them.
            </h2>
            <p className="text-lg text-neutral-400">
              Our entire fleet, in full, with the role each machine plays.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/80 overflow-hidden backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] border-b border-white/[0.06]">
                <tr className="text-left text-neutral-400">
                  <th className="py-4 px-4 font-medium">Instance</th>
                  <th className="py-4 px-4 font-medium">Type</th>
                  <th className="py-4 px-4 font-medium">vCPU</th>
                  <th className="py-4 px-4 font-medium">RAM</th>
                  <th className="py-4 px-4 font-medium">Zone</th>
                  <th className="py-4 px-4 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((inst, i) => (
                  <tr
                    key={inst.instance}
                    className={
                      'border-t border-white/[0.04] ' +
                      (i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]')
                    }
                  >
                    <td className="py-4 px-4 text-white font-medium">{inst.instance}</td>
                    <td className="py-4 px-4 text-neutral-300">{inst.type}</td>
                    <td className="py-4 px-4 text-neutral-300 tabular-nums">{inst.vcpu}</td>
                    <td className="py-4 px-4 text-neutral-300 tabular-nums">
                      {inst.ramGb} GB
                    </td>
                    <td className="py-4 px-4 text-neutral-300">{inst.zone}</td>
                    <td className="py-4 px-4 text-neutral-400">{inst.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
