/**
 * Round 2c (mock, 16-10): How we build as the owner's scroll-drawn timeline, three Facet takes (see RuleTimeline).
 * D = track (pinned, closest to the reference) · E = tiles (pinned, Option B's tiles) · F = in place (not pinned).
 * The footprint receipt (D13) is read here, on the server, exactly as Option B reads it.
 */
import { fetchImpactReport } from '@/lib/api/sustainability'
import { Section } from '../Section'
import { Reveal } from '../Reveal'
import { HEADING, ReceiptLedger, type Receipt } from '../rules'
import { RuleTimeline } from './RuleTimeline'

export async function readReceipt(): Promise<Receipt> {
  const report = await fetchImpactReport()
  const kg = report?.totals?.co2e?.amount ?? null
  if (!report || kg === null) return null
  return {
    kg: kg.toLocaleString('en-GB', { maximumFractionDigits: 2 }),
    period: report.period.label,
    measured: report.source === 'exoscale-api',
    renewable: report.totals?.renewableShare === 100,
  }
}

export async function HowWeBuildD() {
  return <RuleTimeline variant="track" receipt={await readReceipt()} />
}

export async function HowWeBuildE() {
  return <RuleTimeline variant="tiles" receipt={await readReceipt()} />
}

export async function HowWeBuildF() {
  const receipt = await readReceipt()
  return (
    <Section id="how" eyebrow={HEADING.eyebrow} title={HEADING.title} lead={HEADING.lead}>
      <RuleTimeline variant="inplace" receipt={receipt} />
      {receipt && (
        <Reveal delay={80} className="mt-16">
          <ReceiptLedger r={receipt} />
        </Reveal>
      )}
    </Section>
  )
}
