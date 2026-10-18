/**
 * Round 5 (mock, 17-10-2026): the composed Trust page. The approved header (R1, glass bar, inset: D25) and footer
 * (D17), the sunrise opening (D23), then outline A's blocks (D27) in order, each at the option `picks` names. The
 * closing carries words and buttons only: an arc never sits at both ends of a page (D23). JSON-LD: WebPage with
 * dateModified from the one revision date, and BreadcrumbList as data only (D24).
 */
import { PageOpeningC } from '@/components/overhaul/system/PageOpening'
import { BLOCKS, ORDER, type BlockKey, type Variant } from './blocks'
import { META, OPENING, UPDATED } from './content'
import { jsonLdHtml } from '@/lib/json-ld'

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: META.title,
  description: META.description,
  url: 'https://ciphera.net/trust',
  dateModified: UPDATED.iso,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: META.title },
    ],
  },
}

export function TrustPage({ picks = {} }: { picks?: Partial<Record<BlockKey, Variant>> }) {
  return (
    <div data-mock-trust>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(pageSchema) }} />
      <div data-mock-block="opening" data-mock-variant="sunrise">
        <PageOpeningC title={OPENING.title} lead={OPENING.lead} />
      </div>
      {ORDER.map((key) => {
        // A block without the asked option falls back to A, and the hook reports what is rendered (About's rule).
        const asked = picks[key] ?? 'a'
        const v = BLOCKS[key][asked] ? asked : 'a'
        const Block = BLOCKS[key][v] ?? BLOCKS[key].a
        return (
          <div key={key} data-mock-block={key} data-mock-variant={v}>
            <Block />
          </div>
        )
      })}
    </div>
  )
}
