/**
 * The breadcrumb's BreadcrumbList JSON-LD (25-10-2026) through the real component (`components/Breadcrumbs.tsx`).
 * `node <bundle>` — no arguments, prints one JSON object with every case's HTML.
 */
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Breadcrumbs from '@/components/Breadcrumbs'

const CASES: Record<string, { label: string; href?: string }[]> = {
  learn: [{ label: 'Learn' }],
  path: [{ label: 'Products', href: '/products' }, { label: 'Pulse' }],
  unsafe: [{ label: 'A </script><img src=x onerror=alert(1)> & B', href: '/a&b' }],
}

const out: Record<string, string> = {}
for (const [name, items] of Object.entries(CASES)) {
  out[name] = renderToStaticMarkup(React.createElement(Breadcrumbs, { items }))
}
process.stdout.write(JSON.stringify(out))
