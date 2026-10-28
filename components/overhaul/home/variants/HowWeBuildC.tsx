/**
 * Option C (mock): How we build, as a single statement. One centred line opens the section; the four rules follow as
 * a plain divided index (no icons, no cards) rather than a grid; the footprint receipt closes it as one large,
 * standalone number, not a stat row. Custom section markup (not the Section component) so the header can run full
 * width and centred instead of Section's two-column grid — data-mock-section and id are set by hand to match. Copy
 * and the receipt logic are identical to Option A.
 */
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { fetchImpactReport } from '@/lib/api/sustainability'
import { Reveal } from '../Reveal'

const RULES = [
  { title: 'We collect almost nothing', desc: 'No cookies, no fingerprinting, no profiles. There is nothing to leak or sell because we never build it.', proof: 'Read the privacy policy', href: '/privacy' },
  { title: 'Stored in Switzerland', desc: 'Our servers and backups run in Swiss data centres, under the Swiss data protection act.', proof: 'See where your data lives', href: '#where' },
  { title: 'Open where it counts', desc: 'Our sign-in protocol, the Pulse app and CLI, 14 platform integrations and this website are public code.', proof: 'Browse the code', href: '#open' },
  { title: 'You can walk away', desc: 'Export everything as CSV, Excel or JSON, or delete it, whenever you want. No lock-in.', proof: 'How export works', href: 'https://docs.ciphera.net' },
]

export async function HowWeBuildC() {
  const report = await fetchImpactReport()
  const kg = report?.totals?.co2e?.amount ?? null
  return (
    <section id="how" data-mock-section="how" className="scroll-mt-24 border-t border-border px-6 py-24 sm:px-10 lg:py-32">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">How we build</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl">
            Four rules behind everything we ship.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Privacy-first is a set of decisions we have already made, so you do not have to trust us on each one.
          </p>
        </div>
      </Reveal>
      <Reveal delay={80} className="mx-auto mt-16 max-w-3xl divide-y divide-border border-y border-border lg:mt-20">
        {RULES.map((r) => (
          <div key={r.title} className="flex flex-col gap-1.5 py-7 sm:flex-row sm:items-baseline sm:gap-10">
            <h3 className="shrink-0 text-xl font-semibold tracking-tight text-foreground sm:w-72">{r.title}</h3>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {r.desc}{' '}
              <a href={r.href} className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-foreground transition-colors duration-150 hover:text-primary">
                {r.proof} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </p>
          </div>
        ))}
      </Reveal>
      {kg !== null && (
        <Reveal delay={140} className="relative mx-auto mt-20 flex max-w-xl flex-col items-center text-center lg:mt-24">
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          <p className="text-sm text-muted-foreground">Our footprint, {report?.period.label}</p>
          <p className="mt-3 text-7xl font-semibold tabular-nums tracking-tight text-foreground sm:text-8xl">
            {kg.toLocaleString('en-GB', { maximumFractionDigits: 2 })}
          </p>
          <p className="mt-2 text-lg text-muted-foreground">kg CO₂e</p>
          <p className="mt-4 text-[13px] text-muted-foreground">
            Approximated with Boavizta life-cycle factors
            {report?.totals?.renewableShare === 100 ? ' · 100% renewable energy' : ''}
          </p>
          <a href="/sustainability" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary">
            How we measure it <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </Reveal>
      )}
    </section>
  )
}
