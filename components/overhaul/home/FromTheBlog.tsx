/**
 * Round 2: From the blog. The three newest posts, from the same resolver the blog index uses (CMS first, seed
 * fallback), so the homepage changes whenever the agency publishes. Copy is a DRAFT.
 */
import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { getBlogPosts } from '@/lib/blog'
import { cdnUrl } from '@/lib/cdn'
import { Section } from './Section'
import { Reveal } from './Reveal'

function fmt(date: string) {
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export async function FromTheBlog() {
  const posts = (await getBlogPosts()).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  if (posts.length === 0) return null
  return (
    <Section
      id="blog"
      eyebrow="From the blog"
      title="Notes on privacy and the web."
      aside={
        <a href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary">
          All posts <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      }
    >
      <div className="grid gap-8 md:grid-cols-3">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={i * 80}>
            <a href={`/blog/${p.slug}`} className="group block">
              <div className="overflow-hidden border border-border bg-card">
                <Image src={cdnUrl(p.image)} alt="" width={1200} height={630} unoptimized className="block aspect-[1200/630] h-auto w-full object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.02]" />
              </div>
              <p className="mt-5 text-[13px] text-muted-foreground">
                {p.category} · <time dateTime={p.date}>{fmt(p.date)}</time>
              </p>
              <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors duration-150 group-hover:text-primary">{p.title}</h3>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
