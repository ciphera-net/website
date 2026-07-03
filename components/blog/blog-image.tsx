import { cdnUrl } from '@/lib/cdn'

export function BlogImage({
  src,
  alt,
  caption,
}: {
  src: string
  alt: string
  caption?: string
}) {
  return (
    <figure className="my-10">
      <img
        src={cdnUrl(src)}
        alt={alt}
        loading="lazy"
        className="w-full object-cover grayscale"
      />
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
