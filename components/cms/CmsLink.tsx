import NextLink from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

/**
 * Adapts `next/link` to `@ciphera-net/facet-sections`' injectable `LinkComponentType`
 * (`ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>`). Next's own `Link` takes
 * `href: UrlObject | string`, which is a wider type than the plain `string` every
 * section ever hands it — not assignable the other way round, so TypeScript refuses
 * `LinkComponent={NextLink}` directly. This narrows `href` to the one shape a CMS
 * page's own data ever produces.
 */
export function CmsLink({ href, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <NextLink href={href ?? '#'} {...rest} />
}
