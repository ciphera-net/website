/**
 * WEB-28 real-render fix — the five migratable product pages' own structured data
 * (`page-build.ts`'s `MIGRATABLE_PAGE_PATHS`), ONE module keyed by path instead of
 * five near-identical `const xSchema = [...]` literals, one per `app/products/<slug>/page.tsx`.
 *
 * 🔴 WHY THIS MOVED. Every migratable page used to define its OWN schema const and
 * emit it itself, next to `<CmsPage page={cms} breadcrumbs={false} />` — `CmsPage`
 * never saw this data. That worked for the five `page.tsx` files (both of their
 * branches emit it by hand), but a published CMS page can be reached through ANY
 * caller of `CmsPage`, and the one that matters most has no schema of its own to
 * hand it: `app/preview/page/[id]/page.tsx` (the agency's draft preview) calls
 * `<CmsPage page={page} />` directly, with no sibling `<script>` and no
 * `breadcrumbs={false}` override. Rendered for real, a draft of one of these five
 * pages got only `CmsPage`'s generic, derived BreadcrumbList — the product's own
 * SoftwareApplication (or SoftwareSourceCode) markup was simply never there, and the
 * breadcrumb it DID get used the wrong label/URL shape (`page.path`'s raw segment,
 * `/products`, not `Ciphera Captcha`/`#products`). Measured 09-10-2026 against a real
 * preview render; see `Public/docs/plans/08-10-2026-web28-product-sections-contract.md`
 * §5 ("derived from the product's own identity, not from section content") — that
 * contract was already the rule, the five pages just weren't the only caller.
 *
 * Keyed by path and read by `CmsPage` itself (`components/cms/CmsPage.tsx`), so ANY
 * renderer of a `PageDocument` at one of these five paths gets the right JSON-LD,
 * not only the ones that happened to duplicate it by hand. Each page's coded
 * (non-CMS) fallback branch still emits this directly — `CmsPage` is not rendered on
 * that branch at all — so it imports the same const from here instead of keeping its
 * own copy.
 */

export type ProductSchema = ReadonlyArray<Record<string, unknown>>

const ORGANIZATION_REF = { '@id': 'https://ciphera.net/#organization' } as const

/** Every page's BreadcrumbList is the same two-ancestor shape; only the leaf `name`
 * (the product's own display name) differs. */
function breadcrumbList(leafName: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://ciphera.net/#products' },
      { '@type': 'ListItem', position: 3, name: leafName },
    ],
  }
}

export const PRODUCT_SCHEMA: Record<string, ProductSchema> = {
  '/products/captcha': [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Ciphera Captcha',
      description:
        'Privacy-first bot protection with adaptive proof-of-work, puzzle challenges, audio verification, and behavioral risk scoring. Stateless, self-hosted, no tracking.',
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Web',
      url: 'https://ciphera.net/products/captcha',
      provider: ORGANIZATION_REF,
    },
    breadcrumbList('Ciphera Captcha'),
  ],

  // Ciphera ID is internal infrastructure, not something on the shelf: there is no
  // self-serve client registration, no OIDC discovery document and no relying-party
  // SDK. This page therefore carries no SoftwareApplication / Product / Offer markup
  // — only the breadcrumb that describes where the URL sits.
  '/products/id': [breadcrumbList('Ciphera ID')],

  '/products/pulse': [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Pulse Analytics',
      description:
        'Privacy-respecting website analytics that gives you insights without compromising user privacy. GDPR compliant, no cookies, no tracking.',
      applicationCategory: 'AnalyticsApplication',
      operatingSystem: 'Web',
      url: 'https://pulse.ciphera.net',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      provider: ORGANIZATION_REF,
    },
    breadcrumbList('Pulse Analytics'),
  ],

  '/products/relay': [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Ciphera Relay',
      description:
        'Privacy-first transactional email delivery with TLS encryption, DKIM signing and a DMARC reject policy, for verification emails, notifications, and alerts.',
      applicationCategory: 'CommunicationApplication',
      operatingSystem: 'Web',
      url: 'https://ciphera.net/products/relay',
      provider: ORGANIZATION_REF,
    },
    breadcrumbList('Ciphera Relay'),
  ],

  '/products/tessera': [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: 'Tessera',
      description:
        'Open-source OPAQUE (RFC 9807) authentication library: a Rust core and sidecar, a Go server SDK, and a browser SDK. Asymmetric password-authenticated key exchange where the password never reaches the server.',
      url: 'https://ciphera.net/products/tessera',
      codeRepository: [
        'https://github.com/ciphera-net/tessera',
        'https://github.com/ciphera-net/tessera-go',
        'https://github.com/ciphera-net/tessera-ts',
      ],
      programmingLanguage: ['Rust', 'Go', 'TypeScript'],
      license: 'https://www.apache.org/licenses/LICENSE-2.0',
      provider: ORGANIZATION_REF,
    },
    breadcrumbList('Tessera'),
  ],
}

/** `undefined` for any path outside the five migratable pages — `CmsPage` falls
 * back to its own generic, derived BreadcrumbList in that case. */
export function productSchemaFor(path: string): ProductSchema | undefined {
  return PRODUCT_SCHEMA[path]
}
