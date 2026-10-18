/**
 * Round 7 (mock, 18-10-2026, plan §5i): a blog post, four options over any live post.
 *   A: one column that ends at the text. The sunrise opening (D23) with a link back to the blog, the title, the post's
 *      description as a one-sentence standfirst and one line (date · updated · read time); the body in one ~680 px
 *      column; a contents list built on the server from four H2s up (a rail beside the text on wide screens, a list on
 *      top on phones); the summary as a quiet block; the questions as a plain list; one closing line about Pulse;
 *      the previous and next posts.
 *   B: A with three posts picked by hand to read next (in place of previous and next) and the homepage's closing band
 *      without its arc (in place of the closing line: an arc never sits at both ends of a page, D23).
 *   C: the lean one. Title, date, body, questions and the closing line; no standfirst, no contents, no previous/next.
 *   plain: A with a plain opening instead of the sunrise (the open question: does a post open with the sunrise?).
 * Gone from every option: the progress bar, the second back link, the category chip, "By Ciphera Team", the related
 * cards, the "Put this into practice." band, the category CTAs ("Explore Tessera" with them) and numbered questions.
 */
import { notFound } from 'next/navigation'
import { ArrowRight, CaretDown } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '@/components/overhaul/home/Reveal'
import { SunriseArc } from '@/components/overhaul/system/PageOpening'
import type { BlogPost, BlogPostMeta } from '@/lib/blog'
import { POST } from './content'
import { formatDate, loadPost, loadPosts, neighbours, readMinutes, updatedDate } from './data'
import { renderPostBody, type Heading } from './PostBody'
import { jsonLdHtml } from '@/lib/json-ld'
import { cdnUrl } from '@/lib/cdn'

export type PostVariant = 'a' | 'b' | 'c' | 'plain'
export const POST_VARIANTS: PostVariant[] = ['a', 'b', 'c', 'plain']

const READ = 'max-w-[42.5rem]' // the reading measure: 680 px, about 75 characters at 18 px

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': 'https://ciphera.net/#organization',
  name: 'Ciphera',
  url: 'https://ciphera.net',
  logo: { '@type': 'ImageObject', url: cdnUrl('/ciphera_logo_no_margins.png') },
}
const postHref = (_variant: PostVariant, slug: string) => `/blog/${slug}`

function MetaLine({ post, minutes, lean = false }: { post: BlogPost; minutes: number; lean?: boolean }) {
  const updated = updatedDate(post)
  return (
    <p data-blog-meta className="text-sm text-muted-foreground tabular-nums">
      <time dateTime={post.date.slice(0, 10)}>{formatDate(post.date)}</time>
      {!lean && updated && (
        <>
          <span aria-hidden="true"> · </span>
          {POST.updated} <time dateTime={updated}>{formatDate(updated)}</time>
        </>
      )}
      {!lean && (
        <>
          <span aria-hidden="true"> · </span>
          {POST.readTime(minutes)}
        </>
      )}
    </p>
  )
}

const BACK_LINK = 'text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground'
// Below 360 px a long one-word title steps down to 32 px; `break-words` is the safety net for a word that still overflows.
const TITLE = 'break-words font-display text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground text-balance max-[359px]:text-[2rem] sm:text-5xl lg:text-6xl'

function SunriseOpening({ post, minutes, lean }: { post: BlogPost; minutes: number; lean: boolean }) {
  return (
    <div data-mock-block="opening" data-mock-variant="sunrise">
      <section data-mock-opening="c" className="relative isolate overflow-hidden px-6 pb-28 pt-32 text-center sm:px-10 sm:pb-40 sm:pt-36 lg:pb-48 lg:pt-44">
        <SunriseArc />
        <Reveal>
          <p>
            <a href={POST.back.href} className={BACK_LINK}>
              {POST.back.label}
            </a>
          </p>
          <h1 data-cms className={`mx-auto mt-6 max-w-4xl ${TITLE}`}>{post.title}</h1>
          {!lean && <p data-cms className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">{post.description}</p>}
          <div className="mt-8">
            <MetaLine post={post} minutes={minutes} lean={lean} />
          </div>
        </Reveal>
      </section>
    </div>
  )
}

function PlainOpening({ post, minutes }: { post: BlogPost; minutes: number }) {
  return (
    <div data-mock-block="opening" data-mock-variant="plain">
      <section data-mock-opening="plain" className="px-6 pb-14 pt-36 sm:px-10 lg:pb-16 lg:pt-44">
        <div className={`mx-auto ${READ}`}>
          <p>
            <a href={POST.back.href} className={BACK_LINK}>
              {POST.back.label}
            </a>
          </p>
          <h1 data-cms className={`mt-6 ${TITLE.replace(' lg:text-6xl', '')}`}>{post.title}</h1>
          <p data-cms className="mt-7 text-lg leading-relaxed text-muted-foreground">{post.description}</p>
          <div className="mt-8">
            <MetaLine post={post} minutes={minutes} />
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * The rail scrolls on its own, which clips anything drawn outside its box: its links' focus rings were cut to two lines.
 * The box is 6 px wider on each side (-mx-1.5) with 6 px of padding (px-1.5), so the links sit exactly where they did
 * and the ring fits. Not ml-auto: the column (164 px at 1440) is narrower than the max width, and with a width that
 * overflows its column CSS treats an auto margin as zero, which moved the rail 6 px (measured, 18-10-2026).
 */
function TocRail({ headings }: { headings: Heading[] }) {
  return (
    <nav aria-label={POST.contents} data-blog-toc="rail" className="hidden lg:col-start-1 lg:row-start-1 lg:block">
      <div className="sticky top-28 -mx-1.5 max-h-[calc(100svh-9rem)] max-w-[13.75rem] overflow-y-auto overscroll-contain px-1.5 pb-4">
        <p className="text-sm text-muted-foreground">{POST.contents}</p>
        <ul className="mt-4 space-y-3 border-l border-border">
          {headings.map((h) => (
            <li key={h.id}>
              <a data-cms href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-sm leading-snug text-muted-foreground transition-colors duration-150 hover:border-foreground hover:text-foreground">
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

function TocInline({ headings }: { headings: Heading[] }) {
  return (
    <details data-blog-toc="inline" className="group mb-12 border-y border-border lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm text-muted-foreground [&::-webkit-details-marker]:hidden">
        <span>
          {POST.contents} <span className="tabular-nums">({headings.length})</span>
        </span>
        <CaretDown aria-hidden="true" className="h-4 w-4 transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      <ul className="space-y-3 pb-5">
        {headings.map((h) => (
          <li key={h.id}>
            <a data-cms href={`#${h.id}`} className="text-sm leading-snug text-muted-foreground hover:text-foreground">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}

function Questions({ post }: { post: BlogPost }) {
  if (!post.faqs.length) return null
  return (
    <section data-mock-block="questions" aria-labelledby="questions" className="mt-20 border-t border-border pt-12">
      <h2 id="questions" className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground">
        {POST.questions}
      </h2>
      <dl data-cms className="mt-6 divide-y divide-border">
        {post.faqs.map((f) => (
          <div key={f.question} className="py-7">
            <dt className="text-lg font-medium leading-snug text-foreground">{f.question}</dt>
            <dd className="mt-3 text-base leading-relaxed text-muted-foreground">{f.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function ClosingLine() {
  return (
    <p data-mock-block="closing" data-mock-variant="line" className="mt-16 border-t border-border pt-8 text-base leading-relaxed text-muted-foreground">
      {POST.closing.line}{' '}
      <a href={POST.closing.link.href} className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline hover:underline-offset-4">
        {POST.closing.link.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </p>
  )
}

function PrevNext({ variant, previous, next }: { variant: PostVariant; previous: BlogPostMeta | null; next: BlogPostMeta | null }) {
  if (!previous && !next) return null
  return (
    <nav aria-label="More posts" data-mock-block="prevnext" className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-2">
      {previous && (
        <a href={postHref(variant, previous.slug)} className="group block">
          <span className="block text-sm text-muted-foreground">{POST.previous}</span>
          <span data-cms className="mt-2 block text-base font-medium leading-snug text-foreground group-hover:underline group-hover:underline-offset-4">{previous.title}</span>
        </a>
      )}
      {next && (
        <a href={postHref(variant, next.slug)} className="group block sm:col-start-2 sm:text-right">
          <span className="block text-sm text-muted-foreground">{POST.next}</span>
          <span data-cms className="mt-2 block text-base font-medium leading-snug text-foreground group-hover:underline group-hover:underline-offset-4">{next.title}</span>
        </a>
      )}
    </nav>
  )
}

function ReadNext({ variant, posts }: { variant: PostVariant; posts: BlogPostMeta[] }) {
  if (!posts.length) return null
  return (
    <section data-mock-block="read-next" className="border-t border-border px-6 py-16 sm:px-10 lg:py-20">
      <div className={`mx-auto ${READ}`}>
        <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground">{POST.readNext}</h2>
        <ul className="mt-8 border-b border-border">
          {posts.map((p) => (
            <li key={p.slug} className="relative border-t border-border py-7">
              <p className="text-sm text-muted-foreground tabular-nums">
                <time dateTime={p.date.slice(0, 10)}>{formatDate(p.date)}</time>
              </p>
              <h3 data-cms className="mt-2 text-xl font-medium leading-snug text-foreground">
                <a href={postHref(variant, p.slug)} className="after:absolute after:inset-0 hover:underline hover:underline-offset-4">
                  {p.title}
                </a>
              </h3>
              <p data-cms className="mt-2 line-clamp-2 text-base leading-relaxed text-muted-foreground">{p.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ClosingBand() {
  return (
    <section data-mock-block="closing" data-mock-variant="band" className="border-t border-border px-6 py-24 text-center sm:px-10 lg:py-32">
      <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-6xl">
        {POST.band.title}
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{POST.band.lead}</p>
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href={POST.band.primary.href} className="inline-flex h-12 items-center gap-2 bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-[#E54E00]">
          {POST.band.primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <a href={POST.band.secondary.href} className="inline-flex h-12 items-center gap-2 border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-foreground backdrop-blur-md transition-colors duration-150 hover:bg-white/[0.08]">
          {POST.band.secondary.label}
        </a>
      </div>
    </section>
  )
}

export async function BlogPostPage({ variant, slug }: { variant: PostVariant; slug: string }) {
  const [post, posts] = await Promise.all([loadPost(slug), loadPosts()])
  if (!post) notFound()
  return <BlogPostView variant={variant} post={post} posts={posts} />
}

/**
 * A post that is already loaded: the route above, and the CMS draft preview (app/preview/[slug]), which reads its draft
 * from WordPress and must show it in the same template the site will.
 */
export function BlogPostView({ variant, post, posts }: { variant: PostVariant; post: BlogPost; posts: BlogPostMeta[] }) {
  const slug = post.slug
  const { body, headings } = renderPostBody(post.body.kind === 'html' ? post.body.content : '')
  const minutes = readMinutes(post.wordCount)
  const lean = variant === 'c'
  const toc = !lean && headings.length >= 4
  const { previous, next } = neighbours(posts, slug)
  const related = (POST.related[slug] ?? []).map((s) => posts.find((p) => p.slug === s)).filter((p): p is BlogPostMeta => !!p)
  const updated = updatedDate(post)
  const url = `https://ciphera.net/blog/${slug}`
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url,
      inLanguage: 'en',
      // The cover the index shows and the social card, as the template before the overhaul declared it.
      ...(post.image ? { image: cdnUrl(post.image) } : {}),
      datePublished: post.date.slice(0, 10),
      dateModified: (updated ?? post.date).slice(0, 10),
      wordCount: post.wordCount,
      // The Organization is defined in full on the homepage only, so a post names it here too: an @id alone resolves
      // to nothing for a reader of this page.
      author: ORGANIZATION,
      publisher: ORGANIZATION,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://ciphera.net/blog' },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
    ...(post.faqs.length
      ? [{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
        }]
      : []),
  ]
  return (
    <div data-mock-blog="post" data-mock-variant={variant} data-headings={headings.length}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(schema) }} />
      {variant === 'plain' ? <PlainOpening post={post} minutes={minutes} /> : <SunriseOpening post={post} minutes={minutes} lean={lean} />}
      <div className="border-t border-border px-6 pb-20 pt-14 sm:px-10 lg:pb-24 lg:pt-20">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,42.5rem)_minmax(0,1fr)] lg:gap-x-8">
          {toc && <TocRail headings={headings} />}
          <div className={`mx-auto w-full ${READ} lg:col-start-2 lg:row-start-1 lg:mx-0`}>
            {toc && <TocInline headings={headings} />}
            <article data-mock-block="body" data-cms className="prose prose-invert max-w-none sm:prose-lg prose-headings:scroll-mt-28 prose-h2:mt-16 prose-h2:font-display prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:font-semibold prose-h2:tracking-[-0.03em] prose-h3:mt-10 prose-h3:text-xl prose-h3:font-semibold prose-p:leading-[1.75]">
              {body}
            </article>
            <Questions post={post} />
            {variant !== 'b' && <ClosingLine />}
            {(variant === 'a' || variant === 'plain') && <PrevNext variant={variant} previous={previous} next={next} />}
          </div>
        </div>
      </div>
      {variant === 'b' && <ReadNext variant={variant} posts={related} />}
      {variant === 'b' && <ClosingBand />}
    </div>
  )
}
