/**
 * Round 4 (mock, 17-10-2026): the composed About page. The approved header (R1, glass bar) and footer (D17), the six
 * blocks of outline A (D18) in order, each at the option `picks` names. The FAQPage JSON-LD mirrors the visible
 * questions, so the schema `/what-is-ciphera` carries today survives the merge.
 */
import { BLOCKS, ORDER, type BlockKey, type Variant } from './blocks'
import { QUESTIONS, FOUNDER } from './content'
import { AboutClosing } from './AboutClosing'
import { jsonLdHtml } from '@/lib/json-ld'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: QUESTIONS.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}
const founderSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: FOUNDER.name,
  jobTitle: FOUNDER.role,
  worksFor: { '@id': 'https://ciphera.net/#organization' },
  sameAs: FOUNDER.links.map((l) => l.href),
}

export function AboutPage({ picks = {}, closing = false }: { picks?: Partial<Record<BlockKey, Variant>>; closing?: boolean | 'quiet' }) {
  return (
    <div data-mock-about>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(founderSchema) }} />
      {ORDER.map((key) => {
        const asked = picks[key] ?? 'a'
        // A block without the asked option (Questions has no D) falls back to A, and the hook says so: a harness
        // reading data-mock-variant must see what is rendered, not what was asked for (review 17-10).
        const shown = BLOCKS[key][asked] ? asked : 'a'
        const Block = BLOCKS[key][shown] ?? BLOCKS[key].a
        return (
          <div key={key} data-mock-block={key} data-mock-variant={shown}>
            <Block />
          </div>
        )
      })}
      {closing && (
        <div data-mock-block="closing" data-mock-variant={closing === 'quiet' ? 'quiet' : 'a'}>
          <AboutClosing arc={closing !== 'quiet'} />
        </div>
      )}
    </div>
  )
}
