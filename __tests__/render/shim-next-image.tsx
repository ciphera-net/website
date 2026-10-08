/** Render-harness-only shim (M2) — real `next/image` needs the Next build/runtime
 * (loader config, `ImageConfigContext`) that does not exist outside `next build`/`next
 * dev`. This renders a plain `<img>` from the props both the legacy fixture and the
 * refactored component pass — identical on both sides of every comparison, so it never
 * matters that it is not byte-for-byte what Next itself would emit in production. */
import * as React from 'react'

type Props = {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  className?: string
  priority?: boolean
  unoptimized?: boolean
}

export default function Image({ src, alt, width, height, className }: Props) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />
}
