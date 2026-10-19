import { fetchImpactReport } from '@/lib/api/sustainability'
import { SustainabilityPage } from '@/components/overhaul/sustainability/SustainabilityPage'
import { receiptFrom } from '@/components/overhaul/sustainability/receipt'

/**
 * /sustainability (the overhaul, R12; plan §5n). The figures are website-backend's (its own 24 h cache; fetched here
 * with a 24 h data cache), formatted by receipt.ts. Without a report the page can read, the printer says the estimate is
 * unavailable and prints nothing: no invented figure stands in for a missing one.
 */
export const revalidate = 86400

export default async function Page() {
  return <SustainabilityPage view={receiptFrom(await fetchImpactReport())} />
}
