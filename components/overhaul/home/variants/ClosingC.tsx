/**
 * Closing, option C (mock): one huge typographic statement filling the column width, no art, no card, no
 * list — the headline IS the visual, the buttons are a small, quiet pair beneath it. Copy is a DRAFT.
 */
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '../Reveal'

export function ClosingC() {
  return (
    <section id="closing" data-mock-section="closing" className="border-t border-border px-6 py-24 text-center sm:px-10 lg:py-32">
      <Reveal>
        <p className="text-sm text-muted-foreground">Get started</p>
        <h2 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
          Software that respects the people who use it.
        </h2>
        <p className="mx-auto mt-8 max-w-sm text-base leading-relaxed text-muted-foreground">
          Try Pulse Analytics free, or tell us what you are building.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://pulse.ciphera.net/signup"
            className="inline-flex h-10 items-center gap-1.5 bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[#E54E00]"
          >
            Try Pulse free <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a
            href="/contact"
            className="inline-flex h-10 items-center px-5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            Contact us
          </a>
        </div>
      </Reveal>
    </section>
  )
}
