import { CloudLightning, Lightning, HardDrives, Leaf } from '@phosphor-icons/react/dist/ssr'
import type { ImpactReport } from './types'
import { MetricTile } from './metric-tile'

interface MetricsStripProps {
  report: ImpactReport
}

/**
 * Section 2 — 4 headline metric tiles under the hero. Server component.
 * Staggered fade-in animation is deferred (adding motion/react here
 * would turn this into a client component and forfeit the bundle size
 * benefit of keeping it server-rendered).
 */
export function MetricsStrip({ report }: MetricsStripProps) {
  // * Format CO2e with the same magnitude logic as the hero so the tile
  // * and the hero agree on the display unit
  const co2eKg = report.totals.co2e.amount
  let co2eValue: string
  if (co2eKg < 1) {
    co2eValue = `${Math.round(co2eKg * 1000)} g`
  } else if (co2eKg >= 1000) {
    co2eValue = `${(co2eKg / 1000).toFixed(2)} t`
  } else {
    co2eValue = `${co2eKg.toFixed(2)} kg`
  }

  const energyValue = `${report.totals.energy.amount.toFixed(1)} ${report.totals.energy.unit}`

  const zurichCount = report.inventory.filter((i) => i.zone === 'CH-DK-2').length
  const genevaCount = report.inventory.filter((i) => i.zone === 'CH-GVA-2').length

  return (
    <section className="py-20 lg:py-32 bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <MetricTile
            icon={CloudLightning}
            label="CO₂ equivalent"
            value={co2eValue}
            caption="GWP · life-cycle assessment"
          />
          <MetricTile
            icon={Lightning}
            label="Energy used"
            value={energyValue}
            caption={`Swiss hydro grid (~${report.methodology.gridIntensity.amount} g/kWh)`}
          />
          <MetricTile
            icon={HardDrives}
            label="Instances"
            value={`${report.totals.instances} VMs`}
            caption={`${zurichCount} in Zurich, ${genevaCount} in Geneva`}
          />
          <MetricTile
            icon={Leaf}
            label="Renewable share"
            value={`${report.totals.renewableShare}%`}
            caption="Exoscale Swiss datacenters"
          />
        </div>
      </div>
    </section>
  )
}
