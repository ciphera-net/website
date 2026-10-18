/**
 * Round 4 (mock, 17-10-2026): the About page's "Questions" block — options for R4 (plan §5, outline A). Copy is the
 * QUESTIONS export of content.ts (eyebrow, title, the six items); no JSON-LD here, the page already carries it.
 *
 * A = the homepage FAQ's own device (native <details>, as HomeFaq does) so the two pages match.
 * B = nothing collapsed: every answer visible, two columns on lg, a hairline above each question.
 * C = an index on the left (sticky on lg) and every answer on the right, each an anchor target the index links to.
 * All three keep every answer's text in the DOM.
 */
import { ArrowRight, Plus } from '@phosphor-icons/react/dist/ssr'
import { Section } from '../home/Section'
import { QUESTIONS } from './content'

function questionId(q: string) {
  return `q-${q
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`
}

export function QuestionsA() {
  return (
    <Section id="questions" eyebrow={QUESTIONS.eyebrow} title={QUESTIONS.title}>
      <div className="divide-y divide-border border-y border-border">
        {QUESTIONS.items.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus
                className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-apple group-open:rotate-45"
                aria-hidden="true"
              />
            </summary>
            <p className="max-w-3xl pb-6 text-[15px] leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

export function QuestionsB() {
  return (
    <Section id="questions" eyebrow={QUESTIONS.eyebrow} title={QUESTIONS.title}>
      <div className="grid grid-cols-1 gap-x-12 gap-y-9 lg:grid-cols-2 lg:gap-y-11">
        {QUESTIONS.items.map((item) => (
          <div key={item.q} className="border-t border-border pt-7">
            <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">{item.q}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{item.a}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

export function QuestionsC() {
  return (
    <Section id="questions" eyebrow={QUESTIONS.eyebrow} title={QUESTIONS.title}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-16">
        <nav aria-label="Jump to a question" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="border-t border-border">
            {QUESTIONS.items.map((item) => (
              <li key={item.q} className="border-b border-border">
                <a
                  href={`#${questionId(item.q)}`}
                  className="group flex items-center justify-between gap-4 py-3 text-[15px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  <span>{item.q}</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:text-primary group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="divide-y divide-border border-t border-border">
          {QUESTIONS.items.map((item) => (
            <div key={item.q} id={questionId(item.q)} className="scroll-mt-24 py-7">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">{item.q}</h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
