import type { AnchorHTMLAttributes } from 'react'

/**
 * A plain `<a>`, injected as `LinkComponentType` — for a section whose link field is
 * ALWAYS a genuinely external URL, with no internal case to branch on.
 *
 * 🔴 WHY THIS IS NOT `CmsLink`. `package-grid`'s `repoHref`/`registryHref` are
 * GitHub/crates.io/npmjs.com/pkg.go.dev addresses by the nature of the data — there
 * is no "internal package link" — and `PackageGrid` (facet-sections) hands them to
 * `LinkComponent` unconditionally, `target`/`rel` included, exactly as every coded
 * page's own raw `<a target="_blank" rel="noopener noreferrer">` for the identical
 * button (`components/ui/*`, `Footer.tsx` — "the site's canonical
 * external-brand-link treatment"). `next/link` destructures `href` out of its own
 * props and re-attaches it LAST (`{...restProps, ...childProps}`,
 * `node_modules/next/dist/client/app-dir/link.js`), so routing these through
 * `CmsLink`/`next/link` anyway rendered `target="…" rel="…" … href="…"` where the
 * coded page's plain anchor never reorders — measured 09-10-2026 against a real
 * preview render (Tessera's package cards).
 *
 * A generic "does this href look external" check inside `CmsLink` itself cannot fix
 * this without breaking the OPPOSITE case: `product-banner`'s own buttons carry an
 * explicit `external` flag the agency sets per button, and `ProductBanner` already
 * branches on it BEFORE ever calling `LinkComponent` — bypassing it entirely for
 * `external: true` (a raw `<a>`, built into facet-sections) and calling it only for
 * `external: false`, which on `/products/pulse` is `https://pulse.ciphera.net/signup`:
 * an absolute, cross-subdomain URL that the agency marked NOT external on purpose,
 * matching the coded page's own `<Link href="https://pulse.ciphera.net/signup">`.
 * A URL-shape heuristic inside `CmsLink` would have overridden that explicit
 * decision. Two different call sites, two different intents — `CmsPage.tsx` wires
 * each to the component that already matches it, rather than guessing from the
 * string in one shared place.
 */
export function CmsExternalLink({ href, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={href ?? '#'} {...rest} />
}
