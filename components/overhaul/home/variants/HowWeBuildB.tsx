/**
 * Option B (mock): How we build, as a horizontal sequence. The four rules sit on one rail left to right, each marked
 * by a large icon tile rather than a card — a line of things that are already true, not a grid to scan. The
 * footprint receipt reads as a ledger line underneath: one big figure, one line of context, no icon. Copy and the
 * receipt logic are identical to Option A.
 */
import { ArrowRight, Eye, MapPin, LockKey, SignOut } from '@phosphor-icons/react/dist/ssr'
import { fetchImpactReport } from '@/lib/api/sustainability'
import { Section } from '../Section'
import { Reveal } from '../Reveal'

const RULES = [
  { icon: Eye, title: 'We collect almost nothing', desc: 'No cookies, no fingerprinting, no profiles. There is nothing to leak or sell because we never build it.', proof: 'Read the privacy policy', href: '/privacy' },
  { icon: MapPin, title: 'Stored in Switzerland', desc: 'Our servers and backups run in Swiss data centres, under the Swiss data protection act.', proof: 'See where your data lives', href: '#where' },
  { icon: LockKey, title: 'Open where it counts', desc: 'Our sign-in protocol, the Pulse app and CLI, 14 platform integrations and this website are public code.', proof: 'Browse the code', href: '#open' },
  { icon: SignOut, title: 'You can walk away', desc: 'Export everything as CSV, Excel or JSON, or delete it, whenever you want. No lock-in.', proof: 'How export works', href: 'https://docs.ciphera.net' },
]

export async function HowWeBuildB() {
  const report = await fetchImpactReport()
  const kg = report?.totals?.co2e?.amount ?? null
  const measured = report?.source === 'exoscale-api'
  return (
    <Section
      id="how"
      eyebrow="How we build"
      title="Four rules behind everything we ship."
      lead="Privacy-first is a set of decisions we have already made, so you do not have to trust us on each one."
    >
      <Reveal>
        <div className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-8 hidden h-px bg-border lg:block" />
          {RULES.map((r) => (
            <div key={r.title} className="relative flex flex-col">
              <span className="relative z-10 inline-flex h-16 w-16 items-center justify-center border border-border bg-background">
                <r.icon className="h-7 w-7 text-foreground" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">{r.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{r.desc}</p>
              <a href={r.href} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary">
                {r.proof} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
      </Reveal>
      {kg !== null && (
        <Reveal delay={80} className="mt-16 flex flex-col gap-6 border-t border-border pt-10 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-4xl font-semibold tabular-nums tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {kg.toLocaleString('en-GB', { maximumFractionDigits: 2 })}
            {' '}
            <span className="ml-1 text-lg font-medium text-muted-foreground sm:text-xl">kg CO₂e</span>
          </p>
          <div className="flex flex-col gap-1 sm:items-end">
            <p className="text-sm text-muted-foreground">
              Our footprint, {report?.period.label}
              {' · '}
              {measured ? 'Measured' : 'Approximated with Boavizta life-cycle factors'}
              {report?.totals?.renewableShare === 100 ? ' · 100% renewable energy' : ''}
            </p>
            <a href="/sustainability" className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary">
              How we measure it <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      )}
    </Section>
  )
}
