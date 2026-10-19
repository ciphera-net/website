/**
 * /sustainability (the overhaul, R12; plan §5n): the sunrise opening (D23: the page's one lit moment), the estimate as a
 * receipt printer with notes in the margin (D60, D61), what the estimate counts, where our servers are, what we don't do,
 * and a closing of words and buttons. No stock photo, no bento, no numbered kicker, no count-up, no legacy button class.
 * The production header and footer come from the app layout.
 */
import { PageOpeningC } from '@/components/overhaul/system/PageOpening'
import { Commitments, Counts, SustainabilityClosing, WhereItRuns } from './Blocks'
import { Estimate } from './Printer'
import { OPENING } from './content'
import type { ReceiptView } from './receipt'

export function SustainabilityPage({ view }: { view: ReceiptView }) {
  return (
    <div data-r12-page data-r12-state={view.state}>
      <PageOpeningC title={OPENING.title} lead={OPENING.lead} />
      <Estimate view={view} />
      <Counts />
      <WhereItRuns />
      <Commitments />
      <SustainabilityClosing />
    </div>
  )
}
