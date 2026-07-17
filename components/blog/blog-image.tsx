import { cdnUrl } from '@/lib/cdn'

export function BlogImage({
  src,
  alt,
  caption,
  variant = 'full',
}: {
  src: string
  alt: string
  caption?: string
  /** 'full' = edge-to-edge editorial photo; 'logo' = small centered mark (logos, icons, diagrams that must not scale up) */
  variant?: 'full' | 'logo'
}) {
  return (
    <figure className="my-10">
      <img
        src={cdnUrl(src)}
        alt={alt}
        loading="lazy"
        className={
          variant === 'logo'
            ? 'mx-auto w-full max-w-[240px]'
            : 'w-full object-cover grayscale'
        }
      />
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
