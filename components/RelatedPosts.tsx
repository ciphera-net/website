import Link from 'next/link'
import { ArrowRightIcon } from '@ciphera-net/facet'
import { cdnUrl } from '@/lib/cdn'

interface BlogPostMeta {
  slug: string
  title: string
  description: string
  category: string
  date: string
  readTime: string
  image: string
}

export default function RelatedPosts({
  currentSlug,
  currentCategory,
  allPosts,
}: {
  currentSlug: string
  currentCategory: string
  allPosts: BlogPostMeta[]
}) {
  // Pick posts from the same category first, then fill with recent posts
  const sameCat = allPosts.filter(
    (p) => p.category === currentCategory && p.slug !== currentSlug
  )
  const others = allPosts.filter(
    (p) => p.category !== currentCategory && p.slug !== currentSlug
  )
  const related = [...sameCat, ...others].slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="text-2xl font-semibold font-display text-foreground mb-8">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-200"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={cdnUrl(post.image)}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col flex-1 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="badge-neutral text-xs">{post.category}</span>
                <span className="text-xs text-muted-foreground">
                  {post.readTime}
                </span>
              </div>
              <h3 className="text-base font-semibold font-display text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Read more
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
