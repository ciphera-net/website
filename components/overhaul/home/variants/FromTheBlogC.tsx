/**
 * Option C for "From the blog": an all-text editorial list, no imagery at all. Title,
 * description, category, date and read time, divided by hairline rules — the opposite
 * device from option A's image grid and variant B's asymmetric image split. The row
 * dims its "Read" affordance by default (never invisible) and lights it on hover.
 */
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { getBlogPosts } from '@/lib/blog'
import { Section } from '../Section'
import { Reveal } from '../Reveal'

function fmt(date: string) {
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export async function FromTheBlogC() {
  const posts = (await getBlogPosts()).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  if (posts.length === 0) return null

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
      <div className="border-t border-border">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={i * 60}>
            <a
              href={`/blog/${p.slug}`}
              className="group flex flex-col gap-3 border-b border-border py-7 sm:flex-row sm:items-start sm:justify-between sm:gap-10"
            >
              <div className="min-w-0 sm:max-w-xl">
                <p className="text-[13px] text-muted-foreground">
                  {p.category} · <time dateTime={p.date}>{fmt(p.date)}</time> · <span className="tabular-nums">{p.readTime}</span>
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors duration-150 group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted-foreground">{p.description}</p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground/70 opacity-70 transition-all duration-200 ease-apple sm:group-hover:translate-x-1 sm:group-hover:text-primary sm:group-hover:opacity-100">
                Read <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
