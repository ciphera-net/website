import type { Metadata } from 'next'
import { NotFoundView } from '@/components/overhaul/notfound/NotFoundView'
import { NOT_FOUND } from '@/components/overhaul/notfound/content'

// The root layout's template adds " | Ciphera". Next adds the noindex itself for a 404.
export const metadata: Metadata = {
  title: NOT_FOUND.title,
  description: NOT_FOUND.lead,
}

export default function NotFound() {
  return <NotFoundView />
}
