import { AboutPage } from '@/components/overhaul/about/AboutPage'
import { OPENING } from '@/components/overhaul/about/content'
import { jsonLdHtml } from '@/lib/json-ld'

/**
 * About (the overhaul, 18-10-2026): outline A (D18), composed as ruled (D19, `/mock-about/cool`) with the sunrise
 * opening every inner page shares (D23): Story D, Founder D, Record D, Questions B, Press D, and the closing band without
 * its arc. It absorbs /what-is-ciphera (definition, disambiguation, the FAQ schema) and /press (#press), both redirected
 * in next.config.ts. Breadcrumbs are data only (D24).
 */
const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
    { '@type': 'ListItem', position: 2, name: OPENING.title },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumb) }} />
      <AboutPage picks={{ opening: 'e', story: 'd', founder: 'd', record: 'd', questions: 'b', press: 'd' }} closing="quiet" />
    </>
  )
}
