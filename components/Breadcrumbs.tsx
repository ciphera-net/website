'use client'

import { jsonLdHtml } from '@/lib/json-ld'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

// * Invisible breadcrumbs - SEO only (no visual clutter)
// * Google will display breadcrumbs in search results using this schema
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // * JSON-LD Breadcrumb Schema for SEO rich snippets. Written with jsonLdHtml (lib/json-ld.ts), like every CMS-fed
  // * JSON-LD block on the site: on a CMS page the labels come from the page's path, which is CMS data.
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ciphera.net',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.href && { item: `https://ciphera.net${item.href}` }),
      })),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumbSchema) }}
    />
  )
}
