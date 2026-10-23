import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The OG card system (D52, 19-10-2026; plan §5l), source level: what must hold for every page's share card to be its
 * own, current and served. The drawing itself is exercised in og-render.render.mjs (it needs next/og, so it runs after
 * npm ci in build.yml).
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (...p) => readFileSync(join(root, ...p), 'utf8')
// Comments stripped, as in the blog seam tests: a file that explains in prose what it no longer does would otherwise
// satisfy (or fail) a guard by its comment alone.
const code = (...p) =>
  read(...p)
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

test('the metrics tables were made from the fonts the renderer draws with', () => {
  // lib/og/layout.ts places every glyph from these tables and the renderer draws it with the font file: a font swapped
  // without re-running scripts/og-font-metrics.py would set every title with the old font's widths.
  for (const [font, table] of [
    ['Geist-SemiBold.ttf', 'geist-semibold-metrics.json'],
    ['Geist-Regular.ttf', 'geist-regular-metrics.json'],
  ]) {
    const metrics = JSON.parse(read('lib', 'og', table))
    const sha = createHash('sha256').update(readFileSync(join(root, 'lib', 'og', 'fonts', font))).digest('hex')
    assert.equal(metrics.font, font)
    assert.equal(metrics.sha256, sha, `${table} is stale: run python3 scripts/og-font-metrics.py`)
    assert.equal(metrics.unitsPerEm, 1000)
    // Every printable ASCII character a title can contain has a width.
    for (let c = 0x20; c < 0x7f; c++) assert.ok(String.fromCharCode(c) in metrics.advance, `${table}: no width for ${JSON.stringify(String.fromCharCode(c))}`)
    // Positive control on the kerning: the pair the whole design was checked against (Chrome measured -11.2 px at 100 px).
    if (font === 'Geist-SemiBold.ttf') assert.equal(metrics.kern.A.V, -112)
  }
})

test('the card route answers 404 for what the site does not say, 308 for an old hash, and caches a card for a year', () => {
  const src = read('app', 'og', '[file]', 'route.ts')
  assert.match(src, /if \(!parsed\) return new Response\('Not found', NOT_FOUND\)/)
  assert.match(src, /if \(!card\) return new Response\('Not found', NOT_FOUND\)/)
  assert.match(src, /status: 404, headers: \{ 'Cache-Control': 'no-store'/)
  // A stale card goes to the current card, a stale cover to the current cover, each checked against its own hash.
  assert.match(src, /\(cover \? coverHash\(card\) : cardHash\(card\)\) !== parsed\.hash/)
  assert.match(src, /const current = cover \? coverPath\(parsed\.kind, parsed\.key, card\) : cardPath\(parsed\.kind, parsed\.key, card\)/)
  assert.match(src, /status: 308,\s*headers: \{ Location: current,/)
  assert.match(src, /await \(cover \? renderCover\(card\) : renderCard\(card\)\)/)
  assert.match(src, /'Cache-Control': 'public, max-age=31536000, immutable'/)
  // A failed drawing is never cached, so the next request draws it again.
  assert.match(src, /status: 500, headers: \{ 'Cache-Control': 'no-store'/)
  // The Location is relative: behind the CDN the server sees the Magic Containers host, so an absolute URL built from
  // the request would send a scraper off ciphera.net.
  assert.doesNotMatch(src, /NextResponse\.redirect|new URL\(/)
  // Words that cannot be read (a Pulse post's come from the content CDN) are a 503 that is never cached, not a 404.
  assert.match(src, /try \{\s*card = await resolveCard\(parsed\.kind, parsed\.key\)\s*\} catch \(err\) \{[\s\S]{0,200}return new Response\('Card unavailable', UNAVAILABLE\)/)
  assert.match(src, /const UNAVAILABLE = \{ status: 503, headers: \{ 'Cache-Control': 'no-store', 'Retry-After': '60'/)
})

test('a Pulse post’s card is Ciphera’s post card with Pulse’s lockup, its words read from Pulse’s published index', () => {
  const cards = read('lib', 'og', 'cards.ts')
  assert.match(cards, /export const pulsePostCard = \(title: string\): OgCard => \(\{ label: 'Blog', title, brand: 'pulse' \}\)/)
  assert.match(cards, /case 'pulse-post': \{[\s\S]{0,200}const title = await getPulsePostTitle\(key\)\s*return title === null \? null : pulsePostCard\(title\)/)
  const loader = read('lib', 'cms', 'pulse-posts.ts')
  assert.match(loader, /export const PULSE_SITE = 'pulse'/)
  assert.match(loader, /getContentIndex\(PULSE_SITE\)/)
  assert.doesNotMatch(loader, /SITE_KEY/, 'the Pulse loader must never read ciphera.net’s own index')
  assert.match(read('lib', 'og', 'url.ts'), /const FILE = \/\^\(page\|post\|term\|learn\|pulse-post\)--/)
  assert.match(read('lib', 'og', 'spec.ts'), /export type OgKind = 'page' \| 'post' \| 'term' \| 'learn' \| 'pulse-post'/)
})

test('a WordPress stub or CMS page image never replaces a page’s own card', () => {
  const seo = read('lib', 'seo.ts')
  // Both merges: the sync seoFor() and the runtime mergeRouteSeo().
  assert.equal(seo.match(/const stubImage = wp\.ogImage && !hasSystemCard\(fbOg\.images\) \? wp\.ogImage : ''/g)?.length, 2)
  assert.doesNotMatch(seo, /\.\.\.\(wp\.ogImage \?/, 'a merge still applies the stub image unguarded')
  const page = read('lib', 'cms', 'page-runtime.ts')
  assert.match(page, /const cmsImage = seo\.ogImage && !hasSystemCard\(fbOg\.images\) \? seo\.ogImage : ''/)
  assert.doesNotMatch(page, /\.\.\.\(seo\.ogImage \?/, 'mergePageSeo still applies the CMS image unguarded')
})

test('the fonts and marks the route reads from disk are traced into the standalone build', () => {
  // Without this the image ships the route and not its fonts, and every card answers 500.
  const include = read('next.config.ts').match(/'\/og\/\[file\]': \[([^\]]*)\]/)?.[1] ?? ''
  assert.match(include, /'\.\/lib\/og\/fonts\/\*\*'/)
  const render = read('lib', 'og', 'render.tsx')
  assert.match(render, /readFile\(path\.join\(root, 'lib\/og\/fonts\/Geist-SemiBold\.ttf'\)\)/)
  // Every lockup's mark: under public/ (the image copies it whole) or under a traced lib/og/ folder.
  const marks = [...render.matchAll(/file: '([^']+)'/g)].map((m) => m[1])
  assert.ok(marks.length >= 2, `no lockup files found in render.tsx (${marks})`)
  for (const file of marks) {
    readFileSync(join(root, file))
    const traced = file.startsWith('public/') || [...include.matchAll(/'\.\/(lib\/og\/[a-z-]+)\/\*\*'/g)].some((m) => file.startsWith(`${m[1]}/`))
    assert.ok(traced, `${file} is read by the card route but not traced into the build`)
  }
})

test('a post’s image is its card on the blog index, on the homepage and in its BlogPosting, never an uploaded image', () => {
  // One image per post on both blogs (23-10-2026, option A of the index round, then the homepage block): every slot on
  // the index, the small list rows included, and both slots of the homepage's "From the blog" show the card the page
  // declares as og:image.
  const cards = code('lib', 'og', 'cards.ts')
  assert.match(cards, /^export const postCard = \(title: string\): OgCard => \(\{ label: 'Blog', title \}\)$/m)
  assert.match(cards, /^export const postCardUrl = \(slug: string, title: string\) => cardPath\('post', slug, postCard\(title\)\)$/m)
  // The og:image is the same address: ogCardImages builds its url with cardPath, from the same kind, key and card.
  assert.match(cards, /^export const postCardImages = \(slug: string, title: string\) => ogCardImages\('post', slug, postCard\(title\)\)$/m)
  assert.match(code('lib', 'og', 'url.ts'), /^  const url = cardPath\(kind, key, card\)$/m)
  const index = code('components', 'overhaul', 'blog', 'BlogIndex.tsx')
  // The index draws one image, in Cover, which every slot renders (directly or through CoverCard).
  assert.equal(index.match(/<img\b/g)?.length, 1, 'the blog index draws an image outside Cover')
  assert.match(index, /<img\s+src=\{postCardUrl\(post\.slug, post\.title\)\}\s+alt=""/)
  assert.doesNotMatch(index, /post\.image|cdnUrl\(/, 'the blog index still shows an uploaded image')
  assert.match(code('components', 'overhaul', 'blog', 'BlogPost.tsx'), /^      image: `https:\/\/ciphera\.net\$\{postCardUrl\(slug, post\.title\)\}`,$/m)
  const home = code('components', 'overhaul', 'home', 'variants', 'FromTheBlogB.tsx')
  // Two images, the featured post's and the list's, and every source is a card: an image added in any spelling
  // changes a count here.
  assert.equal(home.match(/<Image\b/g)?.length, 2, 'the homepage block draws an image that is not a card')
  assert.equal(home.match(/<img\b/g), null, 'the homepage block draws a plain <img>')
  assert.deepEqual([...home.matchAll(/src=\{([^}]*\))\}/g)].map((m) => m[1]), ['postCardUrl(featured.slug, featured.title)', 'postCardUrl(p.slug, p.title)'])
  assert.equal(home.match(/\bsrc=/g)?.length, 2, 'every image source in the homepage block must be a card')
  assert.doesNotMatch(home, /\.image\b|cdnUrl\(/, 'the homepage block still shows an uploaded image')
  // Nothing on the site reads a post's own image any more: the shared types carry exactly these fields, so an image
  // field comes back only by changing this list.
  const types = code('lib', 'blog-types.ts')
  const fields = (name) => {
    const m = types.match(new RegExp(`export interface ${name} \\{([\\s\\S]*?)\\n\\}`))
    assert.ok(m, `lib/blog-types.ts has no interface ${name}`)
    return [...m[1].matchAll(/^\s*(\w+)\??:/gm)].map((f) => f[1])
  }
  const meta = ['slug', 'title', 'description', 'category', 'date', 'dateModified', 'readTime']
  assert.deepEqual(fields('BlogPostMeta'), meta)
  assert.deepEqual(fields('WpBlogPost'), [...meta, 'html', 'faqs', 'cta', 'wordCount'])
  // The generated summary the index and the feed read, and the merged post the template reads.
  const summary = code('scripts', 'generate-blog-posts.ts').match(/export interface BlogPostSummary \{([\s\S]*?)\n\}/)
  assert.deepEqual([...summary[1].matchAll(/^\s*(\w+)\??:/gm)].map((f) => f[1]), meta)
  const post = code('lib', 'blog.ts').match(/export interface BlogPost extends BlogPostMeta \{([\s\S]*?)\n\}/)
  assert.deepEqual([...post[1].matchAll(/^\s*(\w+)\??:/gm)].map((f) => f[1]), ['html', 'faqs', 'cta', 'wordCount'])
})
