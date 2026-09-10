/**
 * generate-blog-posts.ts — the blog's summary list, and the bodies WordPress holds.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.12
 *
 * 🔴 CONTENT REACHES THIS SITE AT BUILD TIME, NOT AT REQUEST TIME (D1). Same
 * architecture as generate-seo.ts, same reason: ciphera.net runs as 42 independent
 * Magic Containers instances behind a 300s HTML TTL, so a request-time read would mean
 * 42 unsynchronised copies of the blog.
 *
 * 🔴 FAIL LOUDLY, NEVER EMIT A PARTIAL. Every check below exits non-zero. A blog that
 * silently ships fifteen of sixteen posts, or one post with no description, is worse
 * than a red pipeline — nothing anywhere would report it.
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const WP = process.env.WORDPRESS_GRAPHQL_URL ?? 'http://wordpress.apps.svc.cluster.local/graphql'
const SITE = 'ciphera-net'
const CDN = process.env.NEXT_PUBLIC_CDN_URL ?? 'https://cdn.ciphera.net/website'
/** The live site's own report of what it is serving — see the shrink guard below. */
const LIVE_STATE = process.env.LIVE_SEO_STATE_URL ?? 'https://ciphera.net/sys/seo-state'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')
const SUMMARY_OUT = path.join(process.cwd(), 'lib', 'blog-posts.gen.ts')
const BODIES_OUT = path.join(process.cwd(), 'lib', 'blog-wp.gen.ts')

const QUERY = `{
  blogPosts(first: 200, where: { status: PUBLISH }) {
    nodes {
      slug
      title
      excerpt
      content
      date
      modifiedGmt
      cipheraTitle
      cipheraDescription
      cipheraOgImage
      cipheraReadTime
      cipheraCtaLabel
      cipheraCtaHref
      blogCategories { nodes { name slug cipheraCtaLabel cipheraCtaHref } }
      routeSites { nodes { slug } }
    }
  }
}`

interface Node {
  slug: string | null
  title: string | null
  excerpt: string | null
  content: string | null
  date: string | null
  modifiedGmt: string | null
  cipheraTitle: string | null
  cipheraDescription: string | null
  cipheraOgImage: string | null
  cipheraReadTime: string | null
  cipheraCtaLabel: string | null
  cipheraCtaHref: string | null
  blogCategories: { nodes: { name: string; slug: string; cipheraCtaLabel: string | null; cipheraCtaHref: string | null }[] } | null
  routeSites: { nodes: { slug: string }[] } | null
}

interface Faq { question: string; answer: string }

function fail(msg: string): never {
  console.error(`\n🔴 generate-blog-posts: ${msg}\n`)
  process.exit(1)
}

/** Strip tags for anything that counts or measures PROSE rather than markup. */
function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&nbsp;/g, ' ')
}

/**
 * Lift `ciphera/faq` blocks out of the body.
 *
 * 🔑 THEY ARE AUTHORED IN THE BODY AND RENDERED SOMEWHERE ELSE. The website shows FAQs
 * through the shared house accordion at the end of a post AND feeds the FAQPage
 * JSON-LD from the same data, so they cannot stay inline. Writing them as blocks keeps
 * them in document order for the author while the site decides where they land.
 */
function extractFaqs(html: string): { html: string; faqs: Faq[] } {
  const faqs: Faq[] = []
  const stripped = html.replace(
    /<div\s+data-ciphera-block="faq"\s+data-q="([^"]*)"\s+data-a="([^"]*)"\s*><\/div>/g,
    (_m, q: string, a: string) => {
      faqs.push({ question: decodeEntities(q), answer: decodeEntities(a) })
      return ''
    }
  )
  return { html: stripped, faqs }
}

/** The house convention across the corpus, e.g. "8 min read". 200 wpm. */
function readTimeOf(words: number): string {
  return `${Math.max(1, Math.round(words / 200))} min read`
}

async function head(url: string): Promise<number> {
  try {
    const r = await fetch(url, { method: 'HEAD' })
    return r.status
  } catch {
    return 0
  }
}

async function main() {
  // ── The sixteen (or however many remain) still in git ──────────────────────
  const mdx: Record<string, unknown>[] = []
  if (fs.existsSync(CONTENT_DIR)) {
    for (const filename of fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))) {
      const slug = filename.replace(/\.mdx$/, '')
      const { data } = matter(fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8'))
      mdx.push({
        slug,
        title: data.title as string,
        description: data.description as string,
        category: data.category as string,
        date: data.date as string,
        dateModified: (data.dateModified || data.date) as string,
        readTime: data.readTime as string,
        image: (data.image || `/blog/og/${slug}.png`) as string,
      })
    }
  }

  // ── WordPress ─────────────────────────────────────────────────────────────
  const res = await fetch(WP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
  }).catch((e) => fail(`cannot reach WordPress at ${WP} — ${e.message}`))

  if (!res.ok) fail(`WordPress returned HTTP ${res.status} from ${WP}`)
  const body = await res.json()

  // 🔴 A PARTIAL RESPONSE IS WORSE THAN NO RESPONSE. WPGraphQL can return HTTP 200 with
  // a populated `errors` array and partial `data`; shipping half the blog is the one
  // outcome worse than not shipping.
  if (body.errors?.length) fail(`GraphQL errors: ${JSON.stringify(body.errors)}`)

  const nodes: Node[] = body?.data?.blogPosts?.nodes ?? []
  const wp: Record<string, unknown>[] = []
  const summaries: Record<string, unknown>[] = [...mdx]
  const mdxSlugs = new Set(mdx.map((p) => p.slug as string))
  const seen = new Set<string>()

  for (const n of nodes) {
    const sites = n.routeSites?.nodes?.map((t) => t.slug) ?? []
    if (!sites.includes(SITE)) continue // Pulse's posts (Phase 4) live in the same WordPress

    const slug = (n.slug ?? '').trim()
    if (!slug) fail(`a published post has an empty slug (title: ${n.title ?? 'untitled'})`)

    // 🔴 A SLUG IN BOTH SOURCES IS A BUILD FAILURE, NOT A PRECEDENCE RULE (design §8.0).
    // lib/blog.ts throws on this too; catching it here names the post and the fix.
    if (mdxSlugs.has(slug)) {
      fail(
        `slug "${slug}" exists in BOTH content/blog/${slug}.mdx and WordPress.\n` +
          `   Delete one. A precedence rule would silently retire the other, and the next\n` +
          `   person to edit it would see no effect at all.`
      )
    }
    if (seen.has(slug)) fail(`duplicate published post for slug "${slug}"`)
    seen.add(slug)

    const title = (n.cipheraTitle ?? '').trim() || (n.title ?? '').trim()
    if (!title) fail(`${slug}: post has no title`)

    // The excerpt is WordPress's own field and arrives wrapped in <p>. The SEO
    // description overrides it, because that is the string that reaches a SERP.
    const description = (n.cipheraDescription ?? '').trim() || textOf(n.excerpt ?? '')
    if (!description) fail(`${slug}: post has no description — set the SEO meta description, or an excerpt`)

    const cats = n.blogCategories?.nodes ?? []
    if (cats.length === 0) fail(`${slug}: post has no category — the closing call-to-action resolves from it`)
    const cat = cats[0]

    // 🔴 A CATEGORY WITH NO CTA IS THE TRAP THIS DESIGN EXISTS TO CLOSE (§24.6).
    // Before the CTA moved onto the term, adding a category left every post in it
    // silently falling back to a generic button, with a green build and no signal.
    const catHref = (cat.cipheraCtaHref ?? '').trim()
    const catLabel = (cat.cipheraCtaLabel ?? '').trim()
    if (!catHref || !catLabel) {
      fail(
        `${slug}: category "${cat.name}" has no call-to-action.\n` +
          `   Set both fields on the category at cms.ciphera.net → Blog → Categories.\n` +
          `   Without them every post in this category would quietly show the generic button.`
      )
    }

    const { html, faqs } = extractFaqs(n.content ?? '')
    const words = textOf(html).split(/\s+/).filter(Boolean).length
    if (words === 0) fail(`${slug}: post body is empty`)

    // ⚠️ A path, resolved through cdnUrl() at the point of use — exactly like the MDX
    // frontmatter's `image`. Deriving it from the slug is what makes the OG gate below
    // meaningful: the URL is predictable, so its absence is detectable.
    const ogRaw = (n.cipheraOgImage ?? '').trim()
    let image = `/blog/og/${slug}.png`
    if (ogRaw) {
      if (!ogRaw.startsWith(`${CDN}/`)) {
        fail(`${slug}: OG image is not on the CDN — got "${ogRaw}", expected a ${CDN}/… URL`)
      }
      image = ogRaw.slice(CDN.length)
    }

    // 🔴 THE OG GATE, AND IT IS NOT IN A TEST FILE ON PURPOSE.
    // __tests__/og-image-dimensions.test.mjs is deliberately network-free — its own
    // header says so — because a test that fails when the CDN is slow stops meaning
    // anything. Here the network is already a hard dependency and a failure is already
    // a legitimate red build. Without this, a new post unfurls broken in exactly the
    // place nobody checks: somebody else's Slack.
    const status = await head(`${CDN}${image}`)
    if (status !== 200) {
      fail(
        `${slug}: OG card ${CDN}${image} returned HTTP ${status}.\n` +
          `   Cards are produced by hand — Public/docs/og-image-generation.md — and this post\n` +
          `   would unfurl broken everywhere it was shared. Generate and upload it, then rebuild.`
      )
    }

    const readTime = (n.cipheraReadTime ?? '').trim() || readTimeOf(words)
    const ctaHref = (n.cipheraCtaHref ?? '').trim() || catHref
    const ctaLabel = (n.cipheraCtaLabel ?? '').trim() || catLabel

    const date = (n.date ?? '').slice(0, 10)
    const dateModified = (n.modifiedGmt ?? '').slice(0, 10) || date

    summaries.push({ slug, title, description, category: cat.name, date, dateModified, readTime, image })
    wp.push({
      slug, title, description, category: cat.name, date, dateModified, readTime, image,
      html,
      faqs,
      cta: { label: ctaLabel, href: ctaHref },
      wordCount: words,
    })
  }

  // 🔴 THE SHRINK GUARD. After the migration WordPress holds the ONLY live copy of the
  // corpus, so a build that publishes fewer posts than production is currently serving
  // must not be able to go green. Desired and actual are both queryable — the same
  // level-triggered shape as the publish watcher (D9) — so this stores nothing.
  // ⚠️ The escape hatch is explicit and appears in the pipeline log. A deliberate
  // unpublish sets it once; nothing sets it by accident.
  if (process.env.ALLOW_POST_COUNT_DECREASE === '1') {
    console.log('⚠️  ALLOW_POST_COUNT_DECREASE=1 — the shrink guard is disabled for this build')
  } else {
    try {
      const live = await fetch(LIVE_STATE, { signal: AbortSignal.timeout(15_000) })
      if (live.ok) {
        const state = (await live.json()) as { posts?: number }
        const servingNow = typeof state.posts === 'number' ? state.posts : null
        if (servingNow !== null && summaries.length < servingNow) {
          fail(
            `this build would publish ${summaries.length} posts; ${LIVE_STATE} reports ${servingNow} live.\n` +
              `   A post was unpublished, trashed, or lost its site term. Nothing else in the\n` +
              `   estate can see that — the build only knows what WordPress tells it.\n` +
              `   If the removal was intended, rebuild with ALLOW_POST_COUNT_DECREASE=1.`
          )
        }
      } else {
        // ⚠️ NOT FATAL, AND THAT IS A JUDGEMENT CALL. The live site being unreachable
        // must not be able to block every deploy — including the deploy that fixes it.
        console.log(`⚠️  shrink guard skipped: ${LIVE_STATE} returned HTTP ${live.status}`)
      }
    } catch (e) {
      console.log(`⚠️  shrink guard skipped: ${LIVE_STATE} unreachable (${(e as Error).name})`)
    }
  }

  summaries.sort((a, b) => new Date(b.date as string).getTime() - new Date(a.date as string).getTime())

  fs.writeFileSync(
    SUMMARY_OUT,
    `// Auto-generated from content/blog/*.mdx AND WordPress — do not edit manually
// Run: npm run generate:blog
//
// 🔴 BUILD OUTPUT, NOT SOURCE. Git-ignored, because a committed copy is a second
// source of truth for what the CMS says and the stale one wins an argument nobody
// knew was happening. To change a post, edit it at https://cms.ciphera.net.

export interface BlogPostSummary {
  slug: string
  title: string
  description: string
  category: string
  date: string
  dateModified: string
  readTime: string
  image: string
}

export const blogPosts: BlogPostSummary[] = ${JSON.stringify(summaries, null, 2)}
`,
    'utf-8'
  )

  fs.writeFileSync(
    BODIES_OUT,
    `// Auto-generated from WordPress at build time — do not edit manually.
// Run: npm run generate:blog
//
// ⚠️ THE SOURCE URL IS DELIBERATELY NOT WRITTEN HERE, unlike lib/seo.gen.ts.
// This file is COMMITTED as an empty stub so the module resolves on a fresh clone,
// and a developer generating against a port-forward would otherwise commit
// \`http://localhost:8088/graphql\` into the repository as the blog's stated source.
//
// 🔴 BUILD OUTPUT, NOT SOURCE. See lib/blog-posts.gen.ts.
// The HTML here is WordPress's rendered output with FAQ blocks lifted out. It is
// SANITISED AT RENDER TIME by components/blog/wp-body.tsx, not here — one allowlist,
// applied where the markup becomes elements.

import type { WpBlogPost } from './blog-types'

export const wpPosts: WpBlogPost[] = ${JSON.stringify(wp, null, 2)}
`,
    'utf-8'
  )

  console.log(`Generated ${summaries.length} blog posts → lib/blog-posts.gen.ts`)
  console.log(`  ${mdx.length} from content/blog/*.mdx, ${wp.length} from WordPress`)
  for (const p of wp) console.log(`  WP: ${p.slug} (${p.wordCount} words, ${(p.faqs as Faq[]).length} faqs)`)
}

main()
