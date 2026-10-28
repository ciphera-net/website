/**
 * Variant C (options round for HomeFaq): the same seven questions split under two headings, The
 * company and Pulse, as a grid of cards whose answers are always visible — no expand/collapse.
 * Visual idea: a two-group card grid (the hairline grid device from OpenByDefault) instead of one
 * long single-column accordion.
 */
import { Section } from '../Section'

const GROUPS = [
  {
    heading: 'The company',
    items: [
      { q: 'What is Ciphera?', a: 'Ciphera BV is a Belgian software company in Diegem, near Brussels. We build privacy-first software for the web. Our product is Pulse Analytics.' },
      { q: 'Is your software open source?', a: 'Much of it. The Pulse app and CLI, our sign-in protocol Tessera, 14 platform integrations and this website are public on GitHub.' },
      { q: 'How do I get in touch?', a: 'Email hello@ciphera.net or use the contact page. We usually reply within one or two working days.' },
    ],
  },
  {
    heading: 'Pulse',
    items: [
      { q: 'What is Pulse Analytics?', a: 'Web analytics that shows how your site is doing without cookies and without following anyone. It is hosted in Switzerland and the Personal plan is free forever. See pulse.ciphera.net.' },
      { q: 'Where is my data stored?', a: 'On servers in Geneva, with backups elsewhere in Switzerland, under the Swiss data protection act. Ciphera itself is a Belgian company, so Belgian law and the GDPR apply to us as well.' },
      { q: 'Do you use cookies or fingerprinting?', a: 'No. This site sets no cookies, and Pulse counts visits without cookies and without building a fingerprint of anyone.' },
      { q: 'Can I export or delete my data?', a: 'Yes. Pulse exports your data as CSV, Excel or JSON, and you can delete it whenever you want.' },
    ],
  },
]

export function HomeFaqC() {
  return (
    <Section id="faq" eyebrow="Questions" title="Frequently asked.">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {GROUPS.map((g) => (
          <div key={g.heading}>
            <h3 className="text-sm font-medium text-foreground">{g.heading}</h3>
            <div className="mt-6 grid gap-px border border-border bg-border">
              {g.items.map((f) => (
                <div key={f.q} className="bg-background p-6">
                  <p className="text-[15px] font-medium text-foreground">{f.q}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
