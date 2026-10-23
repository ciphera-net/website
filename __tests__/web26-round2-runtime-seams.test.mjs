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

test('DEFAULT_RUNTIME_KINDS serves glossary, blog, route, redirect, menu and page at request time', () => {
  const src = code('lib/cms/runtime-config.ts')
  assert.match(src, /const DEFAULT_RUNTIME_KINDS: readonly string\[\] = \['glossary', 'blog', 'route', 'redirect', 'menu', 'page'\]/)
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
  for (const needle of ['HEAD check', 'shrink guard']) {
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

test('generate-llms.ts reads the seed accessor, never the async seam', () => {
  const src = code('scripts/generate-llms.ts')
  assert.match(src, /import \{ getBlogPostsSeed \} from '\.\.\/lib\/blog'/)
  assert.doesNotMatch(src, /getBlogPosts\(\)/, 'a build CLI script has no request to await the seam for')
})

test('the blog index renders on the server, per request, from the async seam', () => {
  // 🔁 The overhaul (18-10-2026, D38): the index is option F, a server component with no
  // client search or filter (a category is a ?category= URL), so there is no client
  // component to hand posts to. It still reads the runtime seam, never the .gen file.
  const page = code('app/blog/page.tsx')
  assert.doesNotMatch(page, /'use client'/, 'app/blog/page.tsx must be a server component')
  assert.match(page, /export const dynamic = 'force-dynamic'/)
  assert.match(page, /<BlogIndexPage variant="f" category=\{isCategoryKey\(key\) \? key : null\} \/>/)
  const index = code('components/overhaul/blog/BlogIndex.tsx')
  assert.doesNotMatch(index, /'use client'/)
  assert.match(index, /const posts = await loadPosts\(\)/)
  const data = code('components/overhaul/blog/data.ts')
  assert.match(data, /import \{ getBlogPost, getBlogPosts, type BlogPost, type BlogPostMeta \} from '@\/lib\/blog'/)
  assert.match(data, /await getBlogPosts\(\)/)
  assert.doesNotMatch(data, /blog-posts\.gen/, 'the index must read the seam, not the build-time file')
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

test('every seoFor() page uses generateMetadata + seoForAsync, not a module-scope const', () => {
  // 🔁 The overhaul (18-10-2026) retired seven of the original fourteen: the five product
  // pages, /press and /what-is-ciphera (Tier 1 redirects since). Their route stubs may stay
  // published in the CMS; nothing renders them.
  const pages = [
    'app/about/layout.tsx', 'app/blog/layout.tsx', 'app/contact/layout.tsx', 'app/learn/layout.tsx',
    'app/sustainability/layout.tsx', 'app/glossary/page.tsx', 'app/page.tsx',
  ]
  const migratable = new Set()
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

// ── proxy.ts (middleware.ts until R11) ──────────────────────────────────────────────

test('the redirect half reads nothing from the CDN when "redirect" is off', () => {
  const src = code('proxy.ts')
  const fnStart = src.indexOf('async function cmsRedirect')
  assert.ok(fnStart > 0, 'cmsRedirect must exist')
  // That check must be the FIRST thing in the function body — before any fetch.
  // proxy.ts makes no fetch() call of its own; resolveRedirectDoc() (the CDN read,
  // lib/cms/redirect-runtime.ts) is the first thing in this half that could reach the CDN.
  const guardAt = src.indexOf('if (!isRuntimeKind(KIND)) return null', fnStart)
  const firstFetchAt = src.indexOf('resolveRedirectDoc(', fnStart)
  assert.ok(guardAt > fnStart && firstFetchAt > fnStart && guardAt < firstFetchAt, 'the off-switch must run before any CDN read')
})

test('the redirect half never 500s on a CDN failure — it falls through to the gate and the normal route', () => {
  const src = code('proxy.ts')
  assert.match(src, /\} catch \{\s*\n\s*return null\s*\n\s*\}/)
})

test('proxy excludes _next, static files and /sys from its matcher', () => {
  const src = code('proxy.ts')
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
