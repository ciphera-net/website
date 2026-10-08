import { HeaderClient } from '@/components/ui/header-3'
import { resolveMenu } from '@/lib/cms/menu-runtime'

/**
 * Server wrapper (M2, §4.2.2): `HeaderClient` is `'use client'` (it needs `usePathname`
 * and the mobile-menu's open/close state), so the request-time CDN/seed resolution — a
 * plain server-side `fetch` — happens here and is handed down as a prop, the same split
 * every other client component in this app that needs CMS data would need.
 */
export default async function Header() {
  const menuDocument = await resolveMenu('header')
  return <HeaderClient menuDocument={menuDocument} />
}
