/**
 * Round 2: Where your data lives. The company's jurisdiction and the servers' jurisdiction are two different facts
 * (audit §5.7: Ciphera is Belgian, not Swiss), so they get two blocks. The providers are the subprocessors that run the
 * service and its data (lib/subprocessors.ts); the full list, GitHub (US, source hosting) included, is one link away.
 * Copy is a DRAFT.
 */
import { ArrowRight, Buildings, HardDrives } from '@phosphor-icons/react/dist/ssr'
import { INFRA_MARKS } from '../brand-marks'
import { Section } from './Section'
import { Reveal } from './Reveal'

export function WhereDataLives() {
  return (
    <Section
      id="where"
      eyebrow="Where your data lives"
      title="A Belgian company, on Swiss servers."
      lead="Two places, two sets of law, both strict about personal data."
    >
      <div className="grid gap-px border border-border bg-border lg:grid-cols-2">
        <Reveal className="grid gap-px bg-border">
          {[
            { icon: Buildings, place: 'Diegem, Belgium', who: 'Ciphera BV', what: 'Our company, our contracts and our support. Belgian law and the GDPR apply.' },
            { icon: HardDrives, place: 'Zurich, Switzerland', who: 'Your data', what: 'Stored on servers in Zurich, with backups elsewhere in Switzerland. The Swiss data protection act applies.' },
          ].map((b) => (
            <div key={b.place} className="bg-background p-8">
              <b.icon className="h-6 w-6 text-foreground/80" aria-hidden="true" />
              <p className="mt-6 text-sm text-muted-foreground">{b.who}</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{b.place}</h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">{b.what}</p>
            </div>
          ))}
        </Reveal>
        <Reveal delay={90} className="flex flex-col bg-background p-8">
          <p className="text-sm text-muted-foreground">The providers it runs on</p>
          <ul className="mt-4 flex-1 divide-y divide-border">
            {INFRA_MARKS.map((m) => (
              <li key={m.key} className="flex items-center gap-4 py-5">
                <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 text-foreground/80" fill="currentColor" aria-hidden="true">
                  <path d={m.path} />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-foreground">{m.name}</p>
                  <p className="text-[13px] text-muted-foreground">{m.role}</p>
                </div>
                <span className="text-[13px] text-muted-foreground">{m.where}</span>
              </li>
            ))}
          </ul>
          <a href="/privacy" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary">
            Every provider we use <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </Section>
  )
}
