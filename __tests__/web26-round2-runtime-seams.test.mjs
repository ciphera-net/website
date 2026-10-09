import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * WEB-26 round 2 — blog, route (Page SEO) and redirect as runtime kinds.
 *
 * 🔑 SOURCE-LEVEL, same reason as glossary-runtime-seam.test.mjs: CI runs `npm test`
 * with no `npm ci` and no network, and the .gen.ts seeds this feature falls back to
 * do not exist until `npm run generate:*` has run against a reachable WordPress.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

// ── DEFAULT_RUNTIME_KINDS stays glossary-only ───────────────────────────────────────

test('DEFAULT_RUNTIME_KINDS serves glossary, blog, route, redirect and menu at request time', () => {
  const src = code('lib/cms/runtime-config.ts')
  assert.match(src, /const DEFAULT_RUNTIME_KINDS: readonly string\[\] = \['glossary', 'blog', 'route', 'redirect', 'menu'\]/)
})

// ── lib/cms/blog-build.ts ───────────────────────────────────────────────────────────

test('buildBlogPosts shares transformWpPost and dedupes by lowest databaseId, never throws on content', () => {
  const src = code('lib/cms/blog-build.ts')
  assert.match(src, /transformWpPost\(n, cdn\)/, 'must reuse the ONE transform, not a copy')
  assert.match(src, /\(a\.n\.databaseId \?\? Infinity\) - \(b\.n\.databaseId \?\? Infinity\)/)
  assert.doesNotMatch(src, /\bfail\(|process\.exit/, 'a pure, shared transform must never fail a process — only the caller decides')
})

test('buildBlogPosts documents exactly which build-only checks it does NOT replicate, and why', () => {
  const src = read(join('lib', 'cms', 'blog-build.ts'))
  for (const needle of ['content/blog/*.mdx collision', 'HEAD check', 'shrink guard']) {
    assert.ok(src.includes(needle), `the module header must name "${needle}" as a documented gap`)
  }
})

// ── lib/blog.ts runtime seam ────────────────────────────────────────────────────────

test('getBlogPosts/getBlogPost are async, and the flag-off path reproduces the pre-WEB-26 seed exactly', () => {
  const src = code('lib/blog.ts')
  assert.match(src, /export async function getBlogPosts\(\)/)
  assert.match(src, /export async function getBlogPost\(slug: string\)/)
  assert.match(src, /export function getBlogPostsSeed\(\)/, 'a SYNC seed accessor must exist for build-time-only callers')
  assert.match(src, /if \(!isRuntimeKind\(KIND\)\) \{\s*\n\s*lastState = \{ enabled: false, source: 'seed' \}/)
})

test('MDX always wins over a CDN-published post with the same slug — the ONE hard build failure stays build-only', () => {
  const src = code('lib/blog.ts')
  // The build-time throw (module scope, against the SEED) must still exist.
  assert.match(src, /throw new Error\(\s*\n\s*`Blog slug collision/)
  // The runtime seam must NOT throw on the same situation — it silently prefers MDX.
  assert.match(src, /if \(mdxSlugSet\.has\(slug\)\) continue/, 'a CDN post colliding with an MDX slug must be silently skipped, never thrown')
})

test('generate-llms.ts reads the seed accessor, never the async seam', () => {
  const src = code('scripts/generate-llms.ts')
  assert.match(src, /import \{ getBlogPostsSeed \} from '\.\.\/lib\/blog'/)
  assert.doesNotMatch(src, /getBlogPosts\(\)/, 'a build CLI script has no request to await the seam for')
})

test('the blog index page is a server component handing resolved posts to a client component', () => {
  const page = code('app/blog/page.tsx')
  assert.doesNotMatch(page, /'use client'/, 'app/blog/page.tsx must be a server component so it can await getBlogPosts()')
  assert.match(page, /await getBlogPosts\(\)/)
  assert.match(page, /<BlogPageClient posts=\{posts\}/)
  const client = code('components/blog/blog-page-client.tsx')
  assert.match(client, /'use client'/)
  assert.doesNotMatch(client, /from '@\/lib\/blog-posts\.gen'|from '@\/lib\/blog'/, 'the client component must receive data as a prop, never import the seam itself')
})

test('a blog post renders per request: a literal force-dynamic and no generateStaticParams', () => {
  // Measured: with generateStaticParams returning [] an unlisted slug is ISR-cached for a year on
  // its first hit (x-nextjs-cache: HIT, s-maxage=31536000); only the literal stops that.
  const src = code('app/blog/[slug]/page.tsx')
  assert.match(src, /export const dynamic = 'force-dynamic'/)
  assert.doesNotMatch(src, /generateStaticParams/)
})

test('the sitemap reads route SEO from the runtime seam, not the build-time seed', () => {
  const src = code('app/sitemap.ts')
  assert.match(src, /routeSeoForAsync/)
  assert.doesNotMatch(src, /routeSeo\[/)
})

test('feed.xml and the sitemap read the async seam, not the build-time .gen file directly', () => {
  const feed = code('app/feed.xml/route.ts')
  assert.match(feed, /import \{ getBlogPosts \} from '\.\.\/\.\.\/lib\/blog'/)
  assert.doesNotMatch(feed, /from '\.\.\/\.\.\/lib\/blog-posts\.gen'/)
  assert.match(feed, /export async function GET\(\)/)

  const sitemap = code('app/sitemap.ts')
  assert.match(sitemap, /const blogPosts = await getBlogPosts\(\)/)
})

// ── lib/cms/route-build.ts ──────────────────────────────────────────────────────────

test('routeKey slugifies a path, "/" -> "home", per §4.1.3a', () => {
  const src = code('lib/cms/route-build.ts')
  assert.match(src, /export function routeKey/)
  assert.match(src, /trimmed === '' \? 'home'/)
})

test('buildRouteSeo dedupes by lowest databaseId and repairs (never fails) an empty title/description/OG image', () => {
  const src = code('lib/cms/route-build.ts')
  assert.match(src, /\(a\.databaseId \?\? Infinity\) - \(b\.databaseId \?\? Infinity\)/)
  assert.match(src, /'title', 'repaired'/)
  assert.match(src, /'description', 'repaired'/)
  assert.match(src, /'ogImage', 'repaired'/)
  assert.doesNotMatch(src, /\bfail\(|process\.exit/)
})

// ── lib/seo.ts runtime seam ──────────────────────────────────────────────────────────

test('seoForAsync exists and resolves synchronously-fast from the seed when "route" is off', () => {
  const src = code('lib/seo.ts')
  assert.match(src, /export async function seoForAsync\(path: string, fallback: Metadata\)/)
  assert.match(src, /if \(!isRuntimeKind\(KIND\)\) \{\s*\n\s*lastState = \{ enabled: false, source: 'seed' \}\s*\n\s*return seedStub\s*\n\s*\}/)
  // seoFor() (the pre-existing sync export) must be UNTOUCHED — byte-identical head
  // on a flag-off build depends on nothing about it having changed.
  assert.match(src, /export function seoFor\(path: string, fallback: Metadata\): Metadata \{/)
})

test('every one of the 14 seoFor() pages now uses generateMetadata + seoForAsync, not a module-scope const', () => {
  const pages = [
    'app/about/layout.tsx', 'app/blog/layout.tsx', 'app/contact/layout.tsx', 'app/learn/layout.tsx',
    'app/sustainability/layout.tsx', 'app/press/page.tsx', 'app/what-is-ciphera/page.tsx',
    'app/products/captcha/page.tsx', 'app/products/id/page.tsx', 'app/products/pulse/page.tsx',
    'app/products/relay/page.tsx', 'app/products/tessera/page.tsx', 'app/glossary/page.tsx', 'app/page.tsx',
  ]
  // WEB-28 build task §3/§5: all five product pages now AWAIT seoForAsync into a
  // `base`, then merge a published CMS page's own SEO over it (mergePageSeo) before
  // returning — `/products/id` joined the other four once facet-sections 0.3.0
  // landed (build task §5). Every non-product page is untouched, so those keep the
  // plain `return`.
  const migratable = new Set([
    'app/products/captcha/page.tsx',
    'app/products/id/page.tsx',
    'app/products/pulse/page.tsx',
    'app/products/relay/page.tsx',
    'app/products/tessera/page.tsx',
  ])
  for (const p of pages) {
    const src = code(p)
    assert.match(src, /export async function generateMetadata\(\): Promise<Metadata> \{/, `${p} must export generateMetadata`)
    assert.match(src, /seoForAsync\(/, `${p} must call seoForAsync`)
    assert.doesNotMatch(src, /export const metadata: Metadata = seoFor\(/, `${p} must not keep the old sync export`)
    if (migratable.has(p)) {
      assert.match(src, /const base = await seoForAsync\(/, `${p} must await seoForAsync into a base Metadata before merging`)
      assert.match(src, /return cms \? mergePageSeo\(CMS_PATH, base, cms\.seo\) : base/, `${p} must merge a published CMS page's SEO over the coded fallback`)
    } else {
      assert.match(src, /return seoForAsync\(/, `${p} must call seoForAsync`)
    }
  }
})

// ── lib/cms/redirect-build.ts ────────────────────────────────────────────────────────

test('buildRedirects throws on a Tier-1 collision — the one hard failure this feature keeps', () => {
  const src = code('lib/cms/redirect-build.ts')
  assert.match(src, /if \(isTier1\(from\)\) \{\s*\n\s*throw new Error/)
})

test('buildRedirects flattens a chain and drops a true cycle, mirroring the build exactly', () => {
  const src = code('lib/cms/redirect-build.ts')
  assert.match(src, /isCycle = true/)
  assert.match(src, /flattened\.set\(source, \{ \.\.\.entry, destination: dest \}\)/)
  assert.match(src, /flattened\.delete\(source\)/)
})

// ── middleware.ts ────────────────────────────────────────────────────────────────────

test('middleware is a no-op with zero CDN reads when "redirect" is off', () => {
  const src = code('middleware.ts')
  assert.match(src, /if \(!isRuntimeKind\(KIND\)\) return NextResponse\.next\(\)/)
  // That check must be the FIRST thing in the function body — before any fetch.
  // middleware.ts makes no fetch() call of its own; resolveRedirectDoc() (the CDN
  // read, lib/cms/redirect-runtime.ts) is the first thing that could reach the CDN.
  const fnStart = src.indexOf('export async function middleware')
  const guardAt = src.indexOf('if (!isRuntimeKind(KIND)) return NextResponse.next()')
  const firstFetchAt = src.indexOf('resolveRedirectDoc(', fnStart)
  assert.ok(guardAt > fnStart && firstFetchAt > fnStart && guardAt < firstFetchAt, 'the off-switch must run before any CDN read')
})

test('middleware never 500s on a CDN failure — it falls through to the normal route', () => {
  const src = code('middleware.ts')
  assert.match(src, /\} catch \{\s*\n[\s\S]{0,200}return NextResponse\.next\(\)\s*\n\s*\}/)
})

test('middleware excludes _next, static files and /sys from its matcher', () => {
  const src = code('middleware.ts')
  assert.match(src, /matcher: \[.*_next\/.*sys\/.*\]/)
})

// ── cms-publisher.ts: the three new kinds are wired, each sharing its generator's module ──

test('cms-publisher.ts registers blog, route and redirect, each via the shared lib/cms/*-build.ts module', () => {
  const src = code('scripts/cms-publisher.ts')
  assert.match(src, /blog: publishBlog,/)
  assert.match(src, /route: publishRoute,/)
  assert.match(src, /redirect: publishRedirect,/)
  assert.match(src, /buildBlogPosts\(nodes, ASSET_CDN\)/)
  assert.match(src, /buildRouteSeo\(nodes\)/)
  assert.match(src, /buildRedirects\(nodes\)/)
})

test('publishBlog has a collapse guard reusing the existing "keep previous index entry" failure path', () => {
  const src = code('scripts/cms-publisher.ts')
  assert.match(src, /assertNoCollapse\('blog', previousIndex\?\.kinds\?\.blog\?\.count, posts\.length\)/)
  // assertNoCollapse must THROW, not return a flag — runPass()'s existing per-kind
  // try/catch is what "keeps the previous index entry on failure" (§4.1.3a).
  assert.match(src, /function assertNoCollapse[\s\S]{0,400}throw new Error/)
})

test('purge patterns match §4.1.3a item 4 exactly: blog, route and redirect', () => {
  const src = code('scripts/cms-publisher.ts')
  assert.match(src, /pagePatterns: \['\/blog\*', '\/feed\.xml', '\/sitemap\.xml'\]/)
  assert.match(src, /changedPaths\.flatMap\(\(p\) => \[p, `\$\{p\}\*`\]\)/, 'route purges each changed path exact + a * for its _rsc variants')
  assert.match(src, /const pagePatterns = changed \? built\.redirects\.map\(\(r\) => r\.source\) : \[\]/, 'redirect purges each (current) source path')
})

// ── /sys/seo-state: the new watermark key and runtime block ────────────────────────

test('/sys/seo-state adds watermarks.blog and keeps every existing field (additive only)', () => {
  const src = code('app/sys/seo-state/route.ts')
  assert.match(src, /watermarks: \{/)
  assert.match(src, /blog: BLOG_WATERMARK/)
  for (const existing of ['seo: SEO_WATERMARK', 'redirect: REDIRECT_WATERMARK', 'glossary: GLOSSARY_WATERMARK']) {
    assert.ok(src.includes(existing), `/sys/seo-state lost the existing watermark: ${existing}`)
  }
})

test('/sys/seo-state reports a runtime block for every kind this round adds: blog, seo (route), redirect', () => {
  const src = code('app/sys/seo-state/route.ts')
  assert.match(src, /runtime: \{/)
  for (const key of ['glossary:', 'blog:', 'seo:', 'redirect:']) {
    assert.ok(src.includes(key), `/sys/seo-state's runtime block is missing the "${key}" entry`)
  }
})
