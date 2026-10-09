'use client'

import { FaqTabs, type FaqTabsCategory, type FaqTabsItem } from '@ciphera-net/facet-sections'

/**
 * `CmsPage` (a Server Component) must not import `FaqTabs` directly from the
 * `@ciphera-net/facet-sections` barrel (`dist/index.js`) — that file carries no
 * `"use client"` directive even though `FaqTabs` itself is a client component
 * (`dist/components/FaqTabs.js` has the directive; the package's own re-bundled
 * barrel loses it). Importing the barrel export straight into a Server Component
 * loses the boundary: a real Next build then treats `FaqTabs` as a Server
 * Component, and it crashes the instant it calls `useState`
 * (`TypeError: (0, o.useState) is not a function`), measured 09-10-2026 against a
 * real preview render — `renderToStaticMarkup`'s harness never catches this, since
 * it does not enforce the Server/Client split at all.
 *
 * This file's own `"use client"` directive IS reliable (it is ours, authored and
 * built by Next's own compiler, not re-bundled by a third party), so importing
 * `FaqTabs` here and re-exporting it establishes the boundary regardless of what the
 * package's own build did. `CmsPage` imports `FaqTabsClient`, never `FaqTabs`.
 *
 * Only serializable props cross this boundary — `title`/`subtitle` (strings) and
 * `categories`/`items` (plain data, `FaqTabsCategory[]`/`FaqTabsItem[]`), the exact
 * shape `CmsPage` already builds from a section's own fields. No function prop
 * exists on `FaqTabsProps` to forward.
 */
export function FaqTabsClient({
  title,
  subtitle,
  categories,
  items,
}: {
  title?: string
  subtitle?: string
  categories: FaqTabsCategory[]
  items: FaqTabsItem[]
}) {
  return <FaqTabs title={title} subtitle={subtitle} categories={categories} items={items} />
}
