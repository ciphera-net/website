import type { WpBlogPost, BlogPostFaq } from './blog-types'

/**
 * The shape of a slug AS GRAPHQL HANDS IT TO THIS BUILD — measured, not assumed
 * (04-10-2026, all 16 live ciphera.net slugs). Ported from pulse-website@1c08fa7 /
 * ef2bf0e (PULSE-243).
 *
 * WordPress stores `post_name` as lowercase ASCII letters, digits, `-`, `_` and
 * lowercase percent-octets: `sanitize_title_with_dashes` percent-encodes multibyte
 * characters and then lowercases everything (wp-includes/formatting.php, `utf8_uri_encode`
 * then `strtolower`). But WPGraphQL 2.23.1 returns `urldecode( post_name )` for `slug`
 * (src/Model/Post.php:709), so a post titled "Café" arrives here as `café`, never as
 * `caf%c3%a9`. Hence: ASCII only from `[a-z0-9_-]`, and any non-ASCII character that is
 * not whitespace or a control/format character (bidi marks, zero-width, U+2028/9 all
 * fail).
 * 🔴 The case this exists for: `sanitize_title_with_dashes` PRESERVES a literal `%xx`
 * typed into a title, so a title containing "%2f" or "%3c" decodes to a slug containing
 * `/` or `<`. Such a slug is refused here, loudly, instead of reaching a URL path or XML.
 */
export const WP_SLUG = /^(?:[a-z0-9_-]|[^\x00-\x7F\s\p{C}])+$/u

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
  /**
   * 🔑 THE TIE-BREAK FOR A DUPLICATE (P1-a). Two published posts sharing a slug can
   * no longer fail the build — one is skipped instead, and `databaseId` (WordPress's
   * own MySQL row id, lower = created first) is what decides which, deterministically,
   * rather than whichever one happened to sort first in a GraphQL page.
   */
  databaseId: number | null
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
  databaseId
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

/**
 * ciphera.net's tenant slug in the `ciphera_site` taxonomy. Pulse's blog posts
 * (Phase 4, Pulse/docs/plans/30-09-2026-pulse-headless-cms-phase-4-design.md §7)
 * live in the same WordPress, tagged `pulse`.
 */
export const BLOG_SITE = 'ciphera-net'

/**
 * The `routeSites` slugs a node carries, or none. ONE DEFINITION for the generator
 * and the preview — see the file header. Both must agree on which site a post
 * belongs to, or the preview can show a post the build would never publish here.
 */
export function nodeSites(node: Pick<WpNode, 'routeSites'>): string[] {
  return node.routeSites?.nodes?.map((t) => t.slug) ?? []
}

/** Strip tags for anything that counts or measures PROSE rather than markup. */
export function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Cut `text` to at most `max` characters, backing up to the last word boundary so the
 * cut never lands mid-word, and append an ellipsis when it actually shortened anything.
 *
 * P1-a's repair for "meta description over 160 chars" and "missing description, falling
 * back to the body" both resolve to this same shape — cut at the last word boundary
 * ≤ (max - 3) chars, then append '…' — so there is one definition, not two that drift.
 */
export function truncateAtWordBoundary(text: string, max: number): string {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  const ceiling = Math.max(1, max - 3) // room for the appended '…'
  const slice = trimmed.slice(0, ceiling)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice
  return `${cut.trimEnd()}…`
}

/** `YYYY-MM-DD`, the one shape every date field on this site is stored and compared as. */
export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

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

/** A repair applied inline — the field shipped with a safe substitute, not a refusal. */
export interface TransformRepair {
  field: string
  detail: string
}

/**
 * WordPress node → the shape the site renders, repairing what P1-a allows and leaving
 * only genuinely unrepairable issues in `problems` (no slug, no title, an empty body —
 * see scripts/generate-blog-posts.ts, which skips an item on any of those instead of
 * shipping it). Everything else that used to be a `problems` entry the BUILD then
 * failed on is now fixed here and reported in `repairs` instead.
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1 P1-a
 */
export function transformWpPost(
  n: WpNode,
  cdn: string
): { post: WpBlogPost | null; problems: TransformProblem[]; repairs: TransformRepair[] } {
  const problems: TransformProblem[] = []
  const repairs: TransformRepair[] = []
  const slug = (n.slug ?? '').trim()
  if (!slug) {
    problems.push({ field: 'slug', message: 'the post has no slug and can never have a URL' })
    return { post: null, problems, repairs }
  }

  // 🔴 A SLUG WORDPRESS COULD NOT HAVE PRODUCED IS A PROBLEM, NOT A STRING TO TRUST.
  // The slug reaches a URL path (/blog/<slug>), the sitemap, the feed's <link>/<guid>,
  // JSON-LD and the preview route, unescaped in most of those places — protecting it
  // HERE protects every consumer at once. See WP_SLUG for the exact shape and why.
  // Ported from pulse-website@1c08fa7 / ef2bf0e (PULSE-243).
  if (!WP_SLUG.test(slug)) {
    problems.push({
      field: 'slug',
      message: `the slug "${slug}" is not a shape WordPress could have produced`,
    })
    return { post: null, problems, repairs }
  }

  const title = (n.cipheraTitle ?? '').trim() || (n.title ?? '').trim()
  if (!title) problems.push({ field: 'title', message: 'the post has no title' })

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

  // The excerpt is WordPress's own field and arrives wrapped in <p>. The SEO
  // description overrides it, because that is the string that reaches a SERP.
  // 🔑 P1-a REPAIR: no meta description and no excerpt used to fail the whole build.
  // The code fallback (the excerpt) already ran; past that, the first ~155 chars of the
  // post's own body text is the next safe substitute — never an empty <meta> tag.
  let description = (n.cipheraDescription ?? '').trim() || textOf(n.excerpt ?? '')
  if (!description) {
    description = truncateAtWordBoundary(textOf(html), 155)
    repairs.push({
      field: 'description',
      detail: description
        ? 'no meta description and no excerpt — search results would show whatever Google picks; ' +
          'repaired from the first ~155 chars of the post body'
        : 'no meta description, no excerpt and an empty body — shipped with an empty description',
    })
  }

  const cats = n.blogCategories?.nodes ?? []
  const cat = cats[0]
  if (!cat) {
    repairs.push({
      field: 'category',
      detail: 'no category — the closing call-to-action resolves from it; falls back to the site default CTA',
    })
  }

  // 🔴 A CATEGORY WITH NO CTA IS THE TRAP §24.6 EXISTS TO CLOSE. Before the CTA moved
  // onto the term, adding a category left every post in it silently falling back to a
  // generic button, with a green build and no signal anywhere.
  // 🔑 P1-a REPAIR: this no longer fails the build. `cta` below is left `undefined`
  // rather than a half-filled { label: '', href: '' } — components/blog/post-view.tsx
  // already falls `post.cta ?? CATEGORY_CTA[post.category] ?? DEFAULT_CTA`, so an
  // `undefined` cta is what makes that existing fallback chain actually run instead of
  // being masked by a present-but-empty object. "No closing CTA block" never happens:
  // DEFAULT_CTA is the site's own floor.
  const catHref = (cat?.cipheraCtaHref ?? '').trim()
  const catLabel = (cat?.cipheraCtaLabel ?? '').trim()
  if (cat && (!catHref || !catLabel)) {
    repairs.push({
      field: 'category',
      detail: `category "${cat.name}" has no call-to-action — every post in it would show the generic button; ` +
        'falls back to the site default CTA at render time',
    })
  }

  const postCtaLabel = (n.cipheraCtaLabel ?? '').trim()
  const postCtaHref = (n.cipheraCtaHref ?? '').trim()
  const ctaLabel = postCtaLabel || catLabel
  const ctaHref = postCtaHref || catHref

  // ⚠️ A path, resolved through cdnUrl() at the point of use — exactly like the MDX
  // frontmatter's `image`. Deriving it from the slug is what makes the build's OG gate
  // meaningful: the URL is predictable, so its absence is detectable.
  // 🔑 P1-a REPAIR: an OG image set but not on the CDN no longer fails the build — it
  // is dropped (ignored) in favour of the same slug-derived default path every post
  // without a custom card already uses.
  const ogRaw = (n.cipheraOgImage ?? '').trim()
  let image = `/blog/og/${slug}.png`
  if (ogRaw) {
    if (!ogRaw.startsWith(`${cdn}/`)) {
      repairs.push({
        field: 'ogImage',
        detail: `the OG image is not on the CDN — got "${ogRaw}"; repaired to the default-shaped card path for this slug`,
      })
    } else {
      image = ogRaw.slice(cdn.length)
    }
  }

  // 🔑 P1-a REPAIR: a missing or malformed publish date falls back to the modified
  // date rather than shipping an invalid or empty value into the feed, the sitemap and
  // the BlogPosting JSON-LD.
  const modified = (n.modifiedGmt ?? '').slice(0, 10)
  let date = (n.date ?? '').slice(0, 10)
  if (!ISO_DATE.test(date)) {
    const fallback = ISO_DATE.test(modified) ? modified : ''
    repairs.push({
      field: 'date',
      detail: date
        ? `publish date "${date}" is not YYYY-MM-DD — repaired to the modified date`
        : 'no publish date — repaired to the modified date',
    })
    date = fallback
  }

  return {
    post: {
      slug,
      title,
      description,
      category: cat?.name ?? '',
      date,
      dateModified: modified || date,
      readTime: (n.cipheraReadTime ?? '').trim() || readTimeOf(words),
      image,
      html,
      faqs,
      cta: ctaLabel && ctaHref ? { label: ctaLabel, href: ctaHref } : undefined,
      wordCount: words,
    },
    problems,
    repairs,
  }
}
