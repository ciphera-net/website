/**
 * Round 2: FAQ, rewritten from 18 questions to 7 about the company and Pulse (§5b). Native <details>: accessible and
 * works without JavaScript. The build keeps the FAQPage JSON-LD in step with these. Every answer is a DRAFT checked
 * against today's facts (audit §5.7; no cookies measured on ciphera.net 16-10-2026).
 */
import { Plus } from '@phosphor-icons/react/dist/ssr'
import { Section } from './Section'

export const FAQ = [
  { q: 'What is Ciphera?', a: 'Ciphera BV is a Belgian software company in Diegem, near Brussels. We build privacy-first software for the web. Our product is Pulse Analytics.' },
  { q: 'What is Pulse Analytics?', a: 'Web analytics that shows how your site is doing without cookies and without following anyone. It is hosted in Switzerland and the Personal plan is free forever. See pulse.ciphera.net.' },
  { q: 'Where is my data stored?', a: 'On servers in Zurich, with backups elsewhere in Switzerland, under the Swiss data protection act. Ciphera itself is a Belgian company, so Belgian law and the GDPR apply to us as well.' },
  { q: 'Do you use cookies or fingerprinting?', a: 'No. This site sets no cookies, and Pulse counts visits without cookies and without building a fingerprint of anyone.' },
  { q: 'Is your software open source?', a: 'Much of it. The Pulse app and CLI, Tessera (the library behind our sign-in), 14 platform integrations and this website are public on GitHub.' },
  { q: 'Can I export or delete my data?', a: 'Yes. Pulse exports your data as CSV, Excel or JSON, and you can delete it whenever you want.' },
  { q: 'How do I get in touch?', a: 'Email hello@ciphera.net or use the contact page.' },
]

export function HomeFaq() {
  return (
    <Section id="faq" eyebrow="Questions" title="Frequently asked.">
      <div className="divide-y divide-border border-y border-border">
        {FAQ.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
              {f.q}
              <Plus className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-apple group-open:rotate-45" aria-hidden="true" />
            </summary>
            <p className="max-w-3xl pb-6 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
