/**
 * Round 6 (mock, 17-10-2026): the composed Contact page. The approved header (R1, glass bar, inset: D25) and footer
 * (D17), the sunrise opening (D23), then outline A's blocks (D34) in order, each at the option `picks` names.
 * JSON-LD: ContactPage whose Organization carries the four addresses (each labelled with the term the page shows, not
 * today's "technical support" and "Sales": plan §5h item 9), the phone as dialled, and the registered office; plus
 * BreadcrumbList as data only (D24).
 */
import { PageOpeningC } from '@/components/overhaul/system/PageOpening'
import { BLOCKS, ORDER, type BlockKey, type Variant } from './blocks'
import { META, OFFICE, OPENING, WRITE } from './content'
import { jsonLdHtml } from '@/lib/json-ld'

const phone = OFFICE.rows.find((r) => r.key === 'phone')?.href?.replace(/^tel:/, '')

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: META.title,
  description: META.description,
  url: 'https://ciphera.net/contact',
  mainEntity: {
    '@type': 'Organization',
    '@id': 'https://ciphera.net/#organization',
    name: 'Ciphera',
    legalName: 'Ciphera BV',
    url: 'https://ciphera.net',
    telephone: phone,
    contactPoint: WRITE.items.map((item) => ({ '@type': 'ContactPoint', email: item.address, contactType: item.term })),
    // The registered office, as OFFICE.rows[0] shows it (and About's record).
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'De Kleetlaan 2',
      postalCode: '1831',
      addressLocality: 'Diegem',
      addressCountry: 'BE',
    },
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: META.title },
    ],
  },
}

export function ContactPage({ picks = {} }: { picks?: Partial<Record<BlockKey, Variant>> }) {
  return (
    <div data-mock-contact>
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
