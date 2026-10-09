/**
 * Render-harness-only shim (M2) — a plain `<a>`, but with the SAME attribute order
 * real `next/link` produces, not just the same attribute SET.
 *
 * 🔴 CORRECTED 09-10-2026 (WEB-28 real-render fix). This used to render
 * `<a href={href} {...rest}>` — `href` FIRST, same order as a literal `<a
 * href=… className=…>`. Real `next/link` does not: it destructures `href` out of
 * its own props, builds the final element as
 * `jsx("a", { ...restProps, ...childProps })` where `restProps` is everything else
 * the caller passed (e.g. `className`) and `childProps.href` is assigned ONLY
 * AFTER that (`node_modules/next/dist/client/app-dir/link.js`) — so a real
 * `<Link href=… className=…>` renders `<a class="…" href="…">`, class before
 * href, REGARDLESS of the order written in JSX. The old shim could not tell a
 * component that genuinely routes through `next/link` apart from one that
 * fell back to a plain `<a href=… className=…>` — both rendered identically
 * under it, which is exactly how `CmsRichText`'s inline-link bug (href-before-class
 * on an internal link the coded page renders through `<Link>`, href-after-class in
 * reality) passed this harness while failing a real Next build. Reproducing the
 * real reordering here, not just the real attribute set, is what makes that
 * regression possible to catch again.
 */
import * as React from 'react'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export default function Link({ href, children, ...rest }: Props) {
  return (
    <a {...rest} href={href}>
      {children}
    </a>
  )
}
