/**
 * Round 7 (mock, 18-10-2026, plan §5i): the blog index over the 18 live posts.
 *   A: a plain list. The sunrise opening (D23) with the title, one line and a visible RSS link; the newest post as a
 *      lead row; every other post as one row (date, title, description). No images, chips, search or filters.
 *   B: cards with images. The lead post as a wide card with its cover, the rest in a two-column grid. 🟡 The covers are
 *      today's social cards, titles baked in Space Grotesk (plan §5i).
 *   C: start here, then the list. A with three hand-picked topic lists above the rows.
 * Round 7b (D37: categories to sort by, the covers visible), over the PROPOSED categories in content.ts:
 *   D: a filter over one grid of cards. The categories as a row of links (?category=, so a choice is a URL that works
 *      without script and can be shared), the lead card on "All", a two-column grid of cards with covers.
 *   E: one section per category. A row of jump links, then each category with its line, its newest three posts as
 *      cards with covers and "All N posts" when it has more.
 *   F: the latest, then the categories. The three newest as cards with covers, then each category as a list of rows
 *      with a small cover.
 *   With ?category=<key>, D, E and F show that category's posts as a full grid under the same row of links.
 * Every row links to the post in option A's post layout (ruled, D37), so the dev server can be browsed end to end.
 */
import { PageOpeningC } from '@/components/overhaul/system/PageOpening'
import { cn } from '@/lib/utils'
import { postCardUrl } from '@/lib/og/cards'
import type { BlogPostMeta } from '@/lib/blog'
import { CATEGORIES, CATEGORY_UI, INDEX, type CategoryKey } from './content'
import { formatDate, loadPosts } from './data'
import { jsonLdHtml } from '@/lib/json-ld'

export type IndexVariant = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
export const INDEX_VARIANTS: IndexVariant[] = ['a', 'b', 'c', 'd', 'e', 'f']
const CATEGORY_VARIANTS: IndexVariant[] = ['d', 'e', 'f']

type Category = (typeof CATEGORIES)[number]
const inCategory = (c: Category, slug: string) => (c.slugs as readonly string[]).includes(slug)
const categoryOf = (slug: string) => CATEGORIES.find((c) => inCategory(c, slug)) ?? null
const postsIn = (posts: BlogPostMeta[], c: Category) => posts.filter((p) => inCategory(c, p.slug))
export const isCategoryKey = (k: string | undefined): k is CategoryKey => !!k && CATEGORIES.some((c) => c.key === k)

const postHref = (slug: string) => `/blog/${slug}`

function DateLine({ post }: { post: BlogPostMeta }) {
  return (
    <p className="text-sm text-muted-foreground tabular-nums">
      <time dateTime={post.date.slice(0, 10)}>{formatDate(post.date)}</time>
    </p>
  )
}

/** The newest post, larger. A and C. */
function LeadRow({ post }: { post: BlogPostMeta }) {
  return (
    <article data-blog-row="lead" className="relative pb-14">
      <DateLine post={post} />
      <h2 data-cms className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-4xl">
        <a href={postHref(post.slug)} className="after:absolute after:inset-0 hover:underline hover:decoration-1 hover:underline-offset-[6px]">
          {post.title}
        </a>
      </h2>
      <p data-cms className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{post.description}</p>
    </article>
  )
}

/** Every other post: the date on the left, the title and its description on the right. A and C. */
function Rows({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <ul className="border-b border-border">
      {posts.map((post) => (
        <li key={post.slug} data-blog-row="row" className="relative grid gap-x-10 gap-y-2 border-t border-border py-8 sm:grid-cols-[11rem_minmax(0,1fr)]">
          <DateLine post={post} />
          <div>
            <h2 data-cms className="max-w-3xl text-xl font-medium leading-snug text-foreground">
              <a href={postHref(post.slug)} className="after:absolute after:inset-0 hover:underline hover:decoration-1 hover:underline-offset-4">
                {post.title}
              </a>
            </h2>
            <p data-cms className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">{post.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

function ListA({ posts }: { posts: BlogPostMeta[] }) {
  const [lead, ...rest] = posts
  return (
    <section data-mock-block="list" data-mock-variant="a" className="border-t border-border px-6 pb-24 pt-16 sm:px-10 lg:pb-32 lg:pt-20">
      {lead && <LeadRow post={lead} />}
      <Rows posts={rest} />
    </section>
  )
}

/**
 * A post's image on the index is its own card (D52): the dotted card its page declares as og:image, drawn from its title
 * by lib/og, so every post has one and nothing is uploaded. One image per post on both blogs (23-10-2026, option A of the
 * index round), the list rows included. The card repeats the entry's title, so it is decorative (`alt=""`).
 */
function Cover({ post, eager, className }: { post: BlogPostMeta; eager: boolean; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- the card route serves the card as is; the title is in the text
    <img
      src={postCardUrl(post.slug, post.title)}
      alt=""
      width={1200}
      height={630}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={cn('aspect-[1200/630] w-full border border-border object-cover', className)}
    />
  )
}

function CardsB({ posts }: { posts: BlogPostMeta[] }) {
  const [lead, ...rest] = posts
  return (
    <section data-mock-block="list" data-mock-variant="b" className="border-t border-border px-6 pb-24 pt-16 sm:px-10 lg:pb-32 lg:pt-20">
      {lead && (
        <article data-blog-row="lead" className="relative grid gap-8 pb-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
          <Cover post={lead} eager />
          <div>
            <DateLine post={lead} />
            <h2 data-cms className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-4xl">
              <a href={postHref(lead.slug)} className="after:absolute after:inset-0 hover:underline hover:decoration-1 hover:underline-offset-[6px]">
                {lead.title}
              </a>
            </h2>
            <p data-cms className="mt-5 text-lg leading-relaxed text-muted-foreground">{lead.description}</p>
          </div>
        </article>
      )}
      <ul className="grid gap-x-10 gap-y-14 border-t border-border pt-14 sm:grid-cols-2">
        {rest.map((post, i) => (
          <li key={post.slug} data-blog-row="card" className="relative">
            <Cover post={post} eager={i < 2} />
            <div className="mt-5">
              <DateLine post={post} />
              <h2 data-cms className="mt-3 text-xl font-medium leading-snug text-foreground">
                <a href={postHref(post.slug)} className="after:absolute after:inset-0 hover:underline hover:decoration-1 hover:underline-offset-4">
                  {post.title}
                </a>
              </h2>
              <p data-cms className="mt-2 line-clamp-3 text-base leading-relaxed text-muted-foreground">{post.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function StartHere({ posts }: { posts: BlogPostMeta[] }) {
  const bySlug = new Map(posts.map((p) => [p.slug, p]))
  return (
    <section data-mock-block="start" className="border-t border-border px-6 py-16 sm:px-10 lg:py-20">
      <h2 className="text-sm text-muted-foreground">{INDEX.startHere}</h2>
      <div className="mt-8 grid gap-12 md:grid-cols-3 md:gap-10">
        {INDEX.topics.map((topic) => {
          const items = topic.slugs.map((s) => bySlug.get(s)).filter((p): p is BlogPostMeta => !!p)
          return (
            <div key={topic.title}>
              <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground">{topic.title}</h3>
              <ul className="mt-5 space-y-4 border-t border-border pt-5">
                {items.map((p) => (
                  <li key={p.slug}>
                    <a data-cms href={postHref(p.slug)} className="text-base leading-snug text-muted-foreground transition-colors duration-150 hover:text-foreground">
                      {p.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/** A card with its cover: date (and, where posts of every category mix, the category), title, description. */
function CoverCard({ post, eager, showCategory = false, as: H = 'h2' }: { post: BlogPostMeta; eager: boolean; showCategory?: boolean; as?: 'h2' | 'h3' }) {
  const cat = categoryOf(post.slug)
  return (
    <article data-blog-row="card" className="relative">
      <Cover post={post} eager={eager} />
      <div className="mt-5">
        <p className="text-sm text-muted-foreground tabular-nums">
          <time dateTime={post.date.slice(0, 10)}>{formatDate(post.date)}</time>
          {showCategory && cat && (
            <>
              <span aria-hidden="true"> · </span>
              <span data-blog-category>{cat.title}</span>
            </>
          )}
        </p>
        <H data-cms className="mt-3 text-xl font-medium leading-snug text-foreground">
          <a href={postHref(post.slug)} className="after:absolute after:inset-0 hover:underline hover:decoration-1 hover:underline-offset-4">
            {post.title}
          </a>
        </H>
        <p data-cms className="mt-2 line-clamp-3 text-base leading-relaxed text-muted-foreground">{post.description}</p>
      </div>
    </article>
  )
}

/**
 * The categories as one row of links. `filter`: "All" first, each link a ?category= URL, the current one marked with the
 * orange dot and aria-current. `jump`: links to the sections further down the page.
 */
function CategoryNav({ variant, posts, active, mode }: { variant: IndexVariant; posts: BlogPostMeta[]; active: CategoryKey | null; mode: 'filter' | 'jump' }) {
  const base = '/blog'
  const items = [
    ...(mode === 'filter' ? [{ key: null as CategoryKey | null, title: CATEGORY_UI.all, n: posts.length, href: base }] : []),
    ...CATEGORIES.map((c) => ({ key: c.key as CategoryKey | null, title: c.title as string, n: postsIn(posts, c).length, href: mode === 'filter' ? `${base}?category=${c.key}` : `#${c.key}` })),
  ]
  return (
    <nav aria-label={CATEGORY_UI.nav} data-blog-cats={mode} className="border-t border-border px-6 py-6 sm:px-10">
      <ul className="flex flex-wrap gap-x-8 gap-y-3">
        {items.map((i) => {
          const on = mode === 'filter' && i.key === active
          return (
            <li key={i.key ?? 'all'}>
              <a
                href={i.href}
                aria-current={on ? 'page' : undefined}
                className={cn('inline-flex items-baseline gap-2 text-sm transition-colors duration-150', on ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                {on && <span aria-hidden="true" className="h-1.5 w-1.5 self-center rounded-full bg-primary" />}
                {i.title}
                <span className="tabular-nums text-muted-foreground">{i.n}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** D, and the ?category= view of D, E and F. */
function FilterView({ variant, posts, active }: { variant: IndexVariant; posts: BlogPostMeta[]; active: CategoryKey | null }) {
  const cat = active ? CATEGORIES.find((c) => c.key === active) ?? null : null
  const list = cat ? postsIn(posts, cat) : posts
  const lead = cat ? null : list[0]
  const rest = cat ? list : list.slice(1)
  return (
    <>
      <CategoryNav variant={variant} posts={posts} active={active} mode="filter" />
      <section data-mock-block="list" data-mock-variant={variant} data-category={active ?? 'all'} className="border-t border-border px-6 pb-24 pt-14 sm:px-10 lg:pb-32">
        {cat && (
          <header className="pb-12">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground">{cat.title}</h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">{cat.lead}</p>
          </header>
        )}
        {lead && (
          <article data-blog-row="lead" className="relative grid gap-8 pb-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
            <Cover post={lead} eager />
            <div>
              <p className="text-sm text-muted-foreground tabular-nums">
                <time dateTime={lead.date.slice(0, 10)}>{formatDate(lead.date)}</time>
                {categoryOf(lead.slug) && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span data-blog-category>{categoryOf(lead.slug)?.title}</span>
                  </>
                )}
              </p>
              <h2 data-cms className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-4xl">
                <a href={postHref(lead.slug)} className="after:absolute after:inset-0 hover:underline hover:decoration-1 hover:underline-offset-[6px]">
                  {lead.title}
                </a>
              </h2>
              <p data-cms className="mt-5 text-lg leading-relaxed text-muted-foreground">{lead.description}</p>
            </div>
          </article>
        )}
        <ul className={cn('grid gap-x-10 gap-y-14 sm:grid-cols-2', lead && 'border-t border-border pt-14')}>
          {rest.map((post, i) => (
            <li key={post.slug}>
              <CoverCard post={post} eager={i < 2} showCategory={!cat} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

/** E: one section per category, its newest three as cards, "All N posts" when there are more. */
function SectionsE({ variant, posts }: { variant: IndexVariant; posts: BlogPostMeta[] }) {
  return (
    <>
      <CategoryNav variant={variant} posts={posts} active={null} mode="jump" />
      {CATEGORIES.map((c, ci) => {
        const list = postsIn(posts, c)
        if (!list.length) return null
        return (
          <section key={c.key} id={c.key} data-mock-block="category" data-category={c.key} data-count={list.length} className="scroll-mt-24 border-t border-border px-6 py-16 sm:px-10 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground">{c.title}</h2>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{c.lead}</p>
              </div>
              {list.length > 3 && (
                <a href={`/blog?category=${c.key}`} data-blog-seeall className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-foreground">
                  {CATEGORY_UI.seeAll(list.length)}
                </a>
              )}
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-3">
              {list.slice(0, 3).map((p, i) => (
                <li key={p.slug}>
                  <CoverCard post={p} eager={ci === 0 && i < 3} as="h3" />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </>
  )
}

/** F: the three newest as cards, then each category as rows with a small cover. */
function LatestF({ variant, posts }: { variant: IndexVariant; posts: BlogPostMeta[] }) {
  return (
    <>
      <CategoryNav variant={variant} posts={posts} active={null} mode="jump" />
      <section data-mock-block="latest" className="border-t border-border px-6 py-16 sm:px-10 lg:py-20">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground">{CATEGORY_UI.latest}</h2>
        <ul className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <li key={p.slug}>
              <CoverCard post={p} eager showCategory as="h3" />
            </li>
          ))}
        </ul>
      </section>
      {CATEGORIES.map((c) => {
        const list = postsIn(posts, c)
        if (!list.length) return null
        return (
          <section key={c.key} id={c.key} data-mock-block="category" data-category={c.key} data-count={list.length} className="scroll-mt-24 border-t border-border px-6 py-16 sm:px-10 lg:py-20">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground">{c.title}</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{c.lead}</p>
            <ul className="mt-8 border-b border-border">
              {list.map((p) => (
                <li key={p.slug} data-blog-row="compact" className="relative grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-5 border-t border-border py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
                  <Cover post={p} eager={false} />
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground tabular-nums">
                      <time dateTime={p.date.slice(0, 10)}>{formatDate(p.date)}</time>
                    </p>
                    <h3 data-cms className="mt-1.5 text-lg font-medium leading-snug text-foreground">
                      <a href={postHref(p.slug)} className="after:absolute after:inset-0 hover:underline hover:decoration-1 hover:underline-offset-4">
                        {p.title}
                      </a>
                    </h3>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </>
  )
}

export async function BlogIndexPage({ variant, category = null }: { variant: IndexVariant; category?: CategoryKey | null }) {
  const posts = await loadPosts()
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: INDEX.title,
    description: INDEX.lead,
    url: 'https://ciphera.net/blog',
    publisher: { '@id': 'https://ciphera.net/#organization' },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://ciphera.net/blog/${p.slug}`, name: p.title })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
        { '@type': 'ListItem', position: 2, name: INDEX.title, item: 'https://ciphera.net/blog' },
      ],
    },
  }
  return (
    <div data-mock-blog="index" data-mock-variant={variant} data-category={category ?? undefined} data-posts={posts.length}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(schema) }} />
      <div data-mock-block="opening" data-mock-variant="sunrise">
        <PageOpeningC title={INDEX.title} lead={INDEX.lead}>
          <p className="mt-8">
            <a href={INDEX.rss.href} className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-foreground">
              {INDEX.rss.label}
            </a>
          </p>
        </PageOpeningC>
      </div>
      {variant === 'c' && <StartHere posts={posts} />}
      {variant === 'b' && <CardsB posts={posts} />}
      {(variant === 'a' || variant === 'c') && <ListA posts={posts} />}
      {(variant === 'd' || (category && CATEGORY_VARIANTS.includes(variant))) && <FilterView variant={variant} posts={posts} active={category} />}
      {variant === 'e' && !category && <SectionsE variant={variant} posts={posts} />}
      {variant === 'f' && !category && <LatestF variant={variant} posts={posts} />}
    </div>
  )
}

