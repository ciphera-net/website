/**
 * Variant B (options round for HomeFaq): a two-column FAQ with a sticky intro — eyebrow, title,
 * short lead and a contact card (hello@ciphera.net + /contact) — standing beside the question
 * list instead of stacked above it. Visual idea: the contact prompt travels with the reader as
 * they work down a long list, so the "still stuck? email us" exit is never scrolled out of view.
 */
import { ArrowUpRight, Plus } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '../Reveal'

const FAQ = [
  { q: 'What is Ciphera?', a: 'Ciphera BV is a Belgian software company in Diegem, near Brussels. We build privacy-first software for the web. Our product is Pulse Analytics.' },
  { q: 'What is Pulse Analytics?', a: 'Web analytics that shows how your site is doing without cookies and without following anyone. It is hosted in Switzerland and the Personal plan is free forever. See pulse.ciphera.net.' },
  { q: 'Where is my data stored?', a: 'On servers in Zurich, with backups elsewhere in Switzerland, under the Swiss data protection act. Ciphera itself is a Belgian company, so Belgian law and the GDPR apply to us as well.' },
  { q: 'Do you use cookies or fingerprinting?', a: 'No. This site sets no cookies, and Pulse counts visits without cookies and without building a fingerprint of anyone.' },
  { q: 'Is your software open source?', a: 'Much of it. The Pulse app and CLI, our sign-in protocol Tessera, 14 platform integrations and this website are public on GitHub.' },
  { q: 'Can I export or delete my data?', a: 'Yes. Pulse exports your data as CSV, Excel or JSON, and you can delete it whenever you want.' },
  { q: 'How do I get in touch?', a: 'Email hello@ciphera.net or use the contact page. We usually reply within one or two working days.' },
]

export function HomeFaqB() {
  return (
    <section
      id="faq"
      data-mock-section="faq"
      className="scroll-mt-24 border-t border-border px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm text-muted-foreground">Questions</p>
          <h2 className="mt-4 max-w-sm font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl">
            Frequently asked.
          </h2>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-muted-foreground">
            Short answers about the company and Pulse. Anything missing, ask us directly.
          </p>
          <div className="mt-8 border border-border bg-card p-6">
            <p className="text-sm font-medium text-foreground">Still have a question?</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
              We usually reply within one or two working days.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href="mailto:hello@ciphera.net"
                className="inline-flex h-11 items-center justify-between gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[#E54E00]"
              >
                hello@ciphera.net
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/contact"
                className="inline-flex h-11 items-center justify-between gap-2 border border-border px-5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-accent"
              >
                Contact page
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={60} className="divide-y divide-border border-y border-border">
          {FAQ.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-apple group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-xl pb-6 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
