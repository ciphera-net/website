import type { WpBlogPost, BlogPostFaq } from './blog-types'

/**
 * WordPress node → the shape the site renders.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.12, §24.9
 *
 * 🔴 ONE TRANSFORM, TWO CALLERS, AND THAT IS THE ENTIRE POINT OF THIS FILE.
 * `scripts/generate-blog-posts.ts` runs it at build time; `app/preview/[slug]` runs it
 * at request time. If each had its own copy, the preview would eventually disagree
 * with the published page — which is precisely the failure a preview exists to
 * prevent, and the one nobody would notice until a post shipped looking wrong.
 *
 * 🔑 IT RETURNS PROBLEMS, IT DOES NOT THROW THEM. The build turns a problem into a
 * red pipeline; the preview turns the same problem into a banner an editor can read
 * and act on. Neither behaviour belongs in here.
 */

export interface WpNode {
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

/** Everything the build refuses to ship and the preview shows as a warning. */
export interface TransformProblem {
  field: string
  message: string
}

export const WP_POST_FIELDS = `
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
`

/** Strip tags for anything that counts or measures PROSE rather than markup. */
export function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function decodeEntities(s: string): string {
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
 * 🔑 AUTHORED IN THE BODY, RENDERED SOMEWHERE ELSE. The site shows FAQs through the
 * shared house accordion at the end of a post AND feeds the FAQPage JSON-LD from the
 * same data, so they cannot stay inline. Writing them as blocks keeps them in document
 * order for the author while the site decides where they land.
 */
export function extractFaqs(html: string): { html: string; faqs: BlogPostFaq[] } {
  const faqs: BlogPostFaq[] = []
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
export function readTimeOf(words: number): string {
  return `${Math.max(1, Math.round(words / 200))} min read`
}

export function transformWpPost(
  n: WpNode,
  cdn: string
): { post: WpBlogPost | null; problems: TransformProblem[] } {
  const problems: TransformProblem[] = []
  const slug = (n.slug ?? '').trim()
  if (!slug) {
    problems.push({ field: 'slug', message: 'the post has no slug and can never have a URL' })
    return { post: null, problems }
  }

  const title = (n.cipheraTitle ?? '').trim() || (n.title ?? '').trim()
  if (!title) problems.push({ field: 'title', message: 'the post has no title' })

  // The excerpt is WordPress's own field and arrives wrapped in <p>. The SEO
  // description overrides it, because that is the string that reaches a SERP.
  const description = (n.cipheraDescription ?? '').trim() || textOf(n.excerpt ?? '')
  if (!description) {
    problems.push({
      field: 'description',
      message: 'no meta description and no excerpt — search results would show whatever Google picks',
    })
  }

  const cats = n.blogCategories?.nodes ?? []
  const cat = cats[0]
  if (!cat) {
    problems.push({ field: 'category', message: 'no category — the closing call-to-action resolves from it' })
  }

  // 🔴 A CATEGORY WITH NO CTA IS THE TRAP §24.6 EXISTS TO CLOSE. Before the CTA moved
  // onto the term, adding a category left every post in it silently falling back to a
  // generic button, with a green build and no signal anywhere.
  const catHref = (cat?.cipheraCtaHref ?? '').trim()
  const catLabel = (cat?.cipheraCtaLabel ?? '').trim()
  if (cat && (!catHref || !catLabel)) {
    problems.push({
      field: 'category',
      message: `category "${cat.name}" has no call-to-action — every post in it would show the generic button`,
    })
  }

  // 🔴 A wp-content/uploads URL CANNOT COME FROM AN UPLOAD — WordPress physically
  // cannot accept one (read-only docroot, §9.1). It can only come from somebody pasting
  // one by hand, which is exactly the case worth catching: the path would 404 for every
  // visitor. Rewriting it to the CDN and then HEAD-checking below turns that into a red
  // build naming the file, rather than a hole in a published page.
  // 🔑 Images are uploaded at cms.ciphera.net/upload, which writes to the CDN directly
  // and hands back a finished URL (design §29). Nothing in this build holds a CDN
  // credential, and that is the property that let the write live somewhere else.
  const { html: rawHtml, faqs } = extractFaqs(n.content ?? '')
  const html = rawHtml.replace(
    /(?:https?:\/\/[^"'\s]*)?\/?wp-content\/uploads\/([A-Za-z0-9._/-]+\.(?:png|jpe?g|gif|webp|svg|avif))/g,
    (_m, path: string) => `${cdn}/blog/media/${path}`
  )
  const words = textOf(html).split(/\s+/).filter(Boolean).length
  if (words === 0) problems.push({ field: 'body', message: 'the body is empty' })

  // ⚠️ A path, resolved through cdnUrl() at the point of use — exactly like the MDX
  // frontmatter's `image`. Deriving it from the slug is what makes the build's OG gate
  // meaningful: the URL is predictable, so its absence is detectable.
  const ogRaw = (n.cipheraOgImage ?? '').trim()
  let image = `/blog/og/${slug}.png`
  if (ogRaw) {
    if (!ogRaw.startsWith(`${cdn}/`)) {
      problems.push({ field: 'ogImage', message: `the OG image is not on the CDN — got "${ogRaw}"` })
    } else {
      image = ogRaw.slice(cdn.length)
    }
  }

  const date = (n.date ?? '').slice(0, 10)
  return {
    post: {
      slug,
      title,
      description,
      category: cat?.name ?? '',
      date,
      dateModified: (n.modifiedGmt ?? '').slice(0, 10) || date,
      readTime: (n.cipheraReadTime ?? '').trim() || readTimeOf(words),
      image,
      html,
      faqs,
      cta: {
        label: (n.cipheraCtaLabel ?? '').trim() || catLabel,
        href: (n.cipheraCtaHref ?? '').trim() || catHref,
      },
      wordCount: words,
    },
    problems,
  }
}
