/** Render-harness-only shim (M2) — same reasoning as shim-next-image.tsx: a plain
 * `<a>`, identical on both sides of every comparison this harness makes. */
import * as React from 'react'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export default function Link({ href, children, ...rest }: Props) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}
