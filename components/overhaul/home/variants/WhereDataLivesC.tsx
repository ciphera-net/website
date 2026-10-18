/**
 * Option C: the data-flow idea. A step row shows the path a visit actually takes (you → the edge → Zurich →
 * the backup site) instead of stating the two places as equal cards (option A) or finding them on a map (option
 * B). Underneath, a plain spec sheet pairs each fact with the law that governs it. Copy is a DRAFT; facts per the
 * design round brief (company: Diegem, Belgium; data: Zurich + a Swiss backup site; providers from brand-marks).
 */
import { Fragment } from 'react'
import { ArrowRight, Globe, Lightning, HardDrives, CloudArrowUp } from '@phosphor-icons/react/dist/ssr'
import { INFRA_MARKS } from '../../brand-marks'
import { Section } from '../Section'
import { Reveal } from '../Reveal'

const bunny = INFRA_MARKS.find((m) => m.key === 'bunnydotnet')!
const exoscale = INFRA_MARKS.find((m) => m.key === 'exoscale')!
const infomaniak = INFRA_MARKS.find((m) => m.key === 'infomaniak')!

const STEPS = [
  { key: 'you', icon: Globe, name: 'Your visit', detail: 'Starts in your browser' },
  { key: 'bunny', icon: Lightning, name: bunny.name, detail: `${bunny.role}, ${bunny.where}` },
  { key: 'exoscale', icon: HardDrives, name: exoscale.name, detail: 'Compute and storage, Zurich, Switzerland' },
  { key: 'infomaniak', icon: CloudArrowUp, name: infomaniak.name, detail: `${infomaniak.role}, ${infomaniak.where}` },
]

const LEDGER = [
  { label: 'Company', value: 'Ciphera BV, Diegem, Belgium' },
  { label: 'Governing law', value: 'Belgian law and the GDPR' },
  { label: 'Your data', value: 'Zurich, with a backup elsewhere in Switzerland' },
  { label: 'Governing law', value: 'The Swiss data protection act' },
]

export function WhereDataLivesC() {
  return (
    <Section
      id="where"
      eyebrow="Where your data lives"
      title="A Belgian company, on Swiss servers."
      lead="Follow a visit from your browser to where it is stored."
    >
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-stretch">
          {STEPS.map((s, i) => (
            <Fragment key={s.key}>
              {i > 0 && (
                <div className="flex items-center justify-center py-1 sm:px-1 sm:py-0" aria-hidden="true">
                  <span className="h-6 w-px bg-border sm:h-px sm:w-6" />
                </div>
              )}
              <div className="flex-1 border border-border bg-background p-6">
                <s.icon className="h-5 w-5 text-foreground/80" aria-hidden="true" />
                <p className="mt-5 text-base font-semibold tracking-tight text-foreground">{s.name}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{s.detail}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </Reveal>

      <Reveal delay={90}>
        <div className="mt-14 border-t border-border pt-10 sm:mt-16">
          <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {LEDGER.map((row) => (
              <div key={row.label + row.value} className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
                <p className="text-sm text-muted-foreground sm:shrink-0">{row.label}</p>
                <span className="hidden h-px flex-1 border-t border-dashed border-border sm:block" aria-hidden="true" />
                <p className="text-[15px] text-foreground sm:shrink-0 sm:text-right">{row.value}</p>
              </div>
            ))}
          </div>
          <a
            href="/privacy"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary"
          >
            Every provider we use <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </Section>
  )
}
