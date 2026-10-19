import Link from 'next/link'
import { PageOpeningC } from '@/components/overhaul/system/PageOpening'
import { PRIMARY, SECONDARY } from './actions'
import { NOT_FOUND } from './content'

/**
 * The 404 (R11, D66: option A). It opens with the sunrise like every page but the homepage (D23), says what happened in
 * one line, and offers two ways on; the header's menus already reach every page, so it does not repeat them.
 *
 * Rendered in full on the first load: a missing address reaches Next's prerendered not-found route through the router or
 * proxy.ts, never a render that ends in notFound() (lib/routing/not-found-routes.mjs). That page is prerendered, so it
 * cannot name the address the reader asked for.
 */
export function NotFoundView() {
  return (
    <PageOpeningC title={NOT_FOUND.title} lead={NOT_FOUND.lead}>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={PRIMARY}>
          {NOT_FOUND.home}
        </Link>
        <Link href="/contact" className={SECONDARY}>
          {NOT_FOUND.contact}
        </Link>
      </div>
    </PageOpeningC>
  )
}
