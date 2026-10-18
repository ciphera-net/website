/**
 * Closing, option B (mock): a split band. No art — the device is a bordered two-cell grid, the same
 * language as "Where your data lives": a statement on the left, a plain list of next steps on the right.
 * Reuses the divided-list pattern from WhereDataLives rather than inventing a new one. Copy is a DRAFT.
 */
import { ArrowRight, RocketLaunch, BookOpen, ChatCircleText, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '../Reveal'

const STEPS = [
  {
    icon: RocketLaunch,
    title: 'Try Pulse Analytics free',
    desc: 'No card required.',
    href: 'https://pulse.ciphera.net/signup',
    primary: true,
  },
  {
    icon: BookOpen,
    title: 'Read the docs',
    desc: 'docs.ciphera.net',
    href: 'https://docs.ciphera.net',
    primary: false,
  },
  {
    icon: ChatCircleText,
    title: 'Contact us',
    desc: 'Tell us what you are building.',
    href: '/contact',
    primary: false,
  },
  {
    icon: EnvelopeSimple,
    title: 'Email us',
    desc: 'hello@ciphera.net',
    href: 'mailto:hello@ciphera.net',
    primary: false,
  },
]

export function ClosingB() {
  return (
    <section id="closing" data-mock-section="closing" className="border-t border-border px-6 py-24 sm:px-10 lg:py-32">
      <Reveal>
        <div className="grid gap-px border border-border bg-border lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col justify-center bg-background p-8 sm:p-10 lg:p-14">
            <p className="text-sm text-muted-foreground">Get started</p>
            <h2 className="mt-4 max-w-md font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl">
              Software that respects the people who use it.
            </h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-muted-foreground">
              Try Pulse Analytics free, or tell us what you are building.
            </p>
          </div>
          <div className="bg-background p-8 sm:p-10 lg:p-14">
            <p className="text-sm text-muted-foreground">Next steps</p>
            <ul className="mt-5 divide-y divide-border">
              {STEPS.map((s) => (
                <li key={s.title}>
                  <a href={s.href} className="group flex items-center gap-4 py-5 first:pt-0 last:pb-0">
                    <s.icon className={`h-5 w-5 shrink-0 ${s.primary ? 'text-primary' : 'text-foreground/70'}`} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium text-foreground transition-colors duration-150 group-hover:text-primary">
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-muted-foreground">{s.desc}</span>
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
