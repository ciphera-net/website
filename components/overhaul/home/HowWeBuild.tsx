/**
 * Round 2: How we build. Four rules, each with the page that proves it, and the footprint receipt (D13) read live from
 * the same endpoint /sustainability uses. While the backend serves its computed path the figure is labelled
 * "approximated", exactly as /sustainability labels it. Copy is a DRAFT.
 */
import { ArrowRight, Eye, MapPin, LockKey, SignOut, Leaf } from '@phosphor-icons/react/dist/ssr'
import { fetchImpactReport } from '@/lib/api/sustainability'
import { Section } from './Section'
import { Reveal } from './Reveal'

const RULES = [
  { icon: Eye, title: 'We collect almost nothing', desc: 'No cookies, no fingerprinting, no profiles. There is nothing to leak or sell because we never build it.', proof: 'Read the privacy policy', href: '/privacy' },
  { icon: MapPin, title: 'Stored in Switzerland', desc: 'Our servers and backups run in Swiss data centres, under the Swiss data protection act.', proof: 'See where your data lives', href: '#where' },
  { icon: LockKey, title: 'Open where it counts', desc: 'Our sign-in protocol, the Pulse app and CLI, 14 platform integrations and this website are public code.', proof: 'Browse the code', href: '#open' },
  { icon: SignOut, title: 'You can walk away', desc: 'Export everything as CSV, Excel or JSON, or delete it, whenever you want. No lock-in.', proof: 'How export works', href: 'https://docs.ciphera.net' },
]

export async function HowWeBuild() {
  const report = await fetchImpactReport()
  const kg = report?.totals?.co2e?.amount ?? null
  return (
    <Section id="how" eyebrow="How we build" title="Four rules behind everything we ship." lead="Privacy-first is a set of decisions we have already made, so you do not have to trust us on each one.">
      <div className="grid border-l border-t border-border sm:grid-cols-2">
        {RULES.map((r, i) => (
          <Reveal key={r.title} delay={i * 70} className="border-b border-r border-border bg-card/40 p-8">
            <r.icon className="h-6 w-6 text-foreground/80" aria-hidden="true" />
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">{r.title}</h3>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">{r.desc}</p>
            <a href={r.href} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary">
              {r.proof} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Reveal>
        ))}
        {kg !== null && (
          <Reveal className="flex flex-col gap-6 border-b border-r border-border p-8 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <Leaf className="mt-1 h-6 w-6 shrink-0 text-foreground/80" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted-foreground">Our footprint, {report?.period.label}</p>
                <p className="mt-1 text-4xl font-semibold tabular-nums tracking-tight text-foreground">
                  {kg.toLocaleString('en-GB', { maximumFractionDigits: 2 })} kg CO₂e
                </p>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  Approximated with Boavizta life-cycle factors
                  {report?.totals?.renewableShare === 100 ? ' · 100% renewable energy' : ''}
                </p>
              </div>
            </div>
            <a href="/sustainability" className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary">
              How we measure it <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Reveal>
        )}
      </div>
    </Section>
  )
}
