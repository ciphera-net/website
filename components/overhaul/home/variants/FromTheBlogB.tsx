/**
 * Option B for "From the blog": one large featured post beside a short, compact list
 * of the next two. Asymmetric split instead of option A's uniform three-up grid — a
 * different rhythm (one hero + a list) built from the same data and the same card
 * device (hairline border, 1200×630 image), not a recolour of A.
 *
 * Each post's image is its own card (D52), the dotted card its page declares as og:image, as on the blog index: one
 * image per post (23-10-2026). The card repeats the title beside it, so it is decorative (`alt=""`).
 */
import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { getBlogPosts } from '@/lib/blog'
import { postCardUrl } from '@/lib/og/cards'
import { Section } from '../Section'
import { Reveal } from '../Reveal'

function fmt(date: string) {
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export async function FromTheBlogB() {
  const posts = (await getBlogPosts()).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  if (posts.length === 0) return null
  const [featured, ...rest] = posts

  return (
    <Section
      id="blog"
      eyebrow="From the blog"
      title="Notes on privacy and the web."
      aside={
        <a
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary"
        >
          All posts <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      }
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <a href={`/blog/${featured.slug}`} className="group block">
            <div className="overflow-hidden border border-border bg-card">
              <Image
                src={postCardUrl(featured.slug, featured.title)}
                alt=""
                width={1200}
                height={630}
                unoptimized
                className="block aspect-[1200/630] h-auto w-full object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.02]"
              />
            </div>
            <p className="mt-6 text-[13px] text-muted-foreground">
              {featured.category} · <time dateTime={featured.date}>{fmt(featured.date)}</time> ·{' '}
              <span className="tabular-nums">{featured.readTime}</span>
            </p>
            <h3 className="mt-2 max-w-xl text-2xl font-semibold leading-snug tracking-tight text-foreground transition-colors duration-150 group-hover:text-primary sm:text-[28px]">
              {featured.title}
            </h3>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{featured.description}</p>
          </a>
        </Reveal>

        {rest.length > 0 && (
          <div className="flex flex-col gap-7 border-t border-border pt-7 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={(i + 1) * 90}>
                <a href={`/blog/${p.slug}`} className="group flex items-start gap-5">
                  <div className="w-28 shrink-0 overflow-hidden border border-border bg-card sm:w-36">
                    <Image
                      src={postCardUrl(p.slug, p.title)}
                      alt=""
                      width={1200}
                      height={630}
                      unoptimized
                      className="block aspect-[1200/630] h-auto w-full object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[13px] text-muted-foreground">
                      {p.category} · <time dateTime={p.date}>{fmt(p.date)}</time>
                    </p>
                    <h3 className="mt-1.5 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors duration-150 group-hover:text-primary">
                      {p.title}
                    </h3>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
