import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CMS_PAGE_HEADER, CMS_PAGE_ROUTE, NOT_FOUND_ROUTE, classifyPath } from '../lib/routing/not-found-routes.mjs'

/**
 * R11 — a missing page arrives fully rendered. Next 16 answers a notFound() thrown while a page renders on demand with
 * an EMPTY `<html id="__next_error__">` shell, so a miss is decided in proxy.ts before rendering and the router answers
 * it with Next's own not-found page (lib/routing/not-found-routes.mjs has the reason). classifyPath runs for real (the
 * module has zero imports); the wiring is checked at source level, same as the rest of this suite. The behaviour
 * itself is proven over HTTP by Public/docs/data/19-10-2026-r11-404-ssr/probe-404.mjs against a production build.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

// ── classifyPath (real execution) ───────────────────────────────────────────────────

test('blog and glossary: exactly one segment, decoded the way Next decodes the route param', () => {
  assert.deepEqual(classifyPath('/blog/cookieless-analytics'), { family: 'blog', slug: 'cookieless-analytics' })
  assert.deepEqual(classifyPath('/glossary/blind-index'), { family: 'glossary', slug: 'blind-index' })
  assert.deepEqual(classifyPath('/glossary/%E2%9C%93'), { family: 'glossary', slug: '✓' })
  // The indexes and anything deeper are not the post routes: the router answers those on its own.
  assert.deepEqual(classifyPath('/blog'), { family: 'other' })
  assert.deepEqual(classifyPath('/blog/a/b'), { family: 'other' })
})

test('learn: exactly /learn/<product>/<slug>', () => {
  assert.deepEqual(classifyPath('/learn/pulse/accesskeys'), { family: 'learn', product: 'pulse', slug: 'accesskeys' })
  assert.deepEqual(classifyPath('/learn/pulse'), { family: 'other' })
  assert.deepEqual(classifyPath('/learn/a/b/c'), { family: 'other' })
})

test('the internal CMS route is matched on the whole segment, never as a prefix of another word', () => {
  assert.deepEqual(classifyPath(CMS_PAGE_ROUTE), { family: 'internal' })
  assert.deepEqual(classifyPath(`${CMS_PAGE_ROUTE}/new-page`), { family: 'internal' })
  assert.deepEqual(classifyPath(`${CMS_PAGE_ROUTE}s`), { family: 'other' })
})

test('an encoding that does not decode is left to Next, never thrown out of the proxy', () => {
  assert.deepEqual(classifyPath('/blog/%E0%A4%A'), { family: 'undecodable' })
  assert.deepEqual(classifyPath('/learn/pulse/%E0%A4%A'), { family: 'undecodable' })
})

test('the constants the proxy, the rewrite and the CMS route share', () => {
  assert.equal(NOT_FOUND_ROUTE, '/_not-found')
  assert.match(CMS_PAGE_ROUTE, /^\/[a-z-]+$/)
  // Header names are case-insensitive on the wire and lowercase in Next's `has` matcher.
  assert.equal(CMS_PAGE_HEADER, CMS_PAGE_HEADER.toLowerCase())
})

// ── The structure that keeps a miss out of the render ───────────────────────────────

test('no catch-all route sits at the root of app/ (one would put every miss back into a render)', () => {
  const top = readdirSync(join(root, 'app'))
  assert.deepEqual(top.filter((d) => /^\[\[?\.\.\./.test(d)), [])
  assert.ok(existsSync(join(root, 'app/cms-page/[...slug]/page.tsx')))
})

test('middleware.ts is gone: Next 16 calls it proxy.ts, and the two may not both exist', () => {
  assert.equal(existsSync(join(root, 'middleware.ts')), false)
  assert.match(code('proxy.ts'), /export async function proxy\(req: NextRequest\)/)
})

test('next.config.ts reaches the CMS route through a FALLBACK rewrite only, gated on the proxy header', () => {
  const src = code('next.config.ts')
  assert.match(src, /beforeFiles: \[\],\s*afterFiles: \[\],\s*fallback: \[/)
  assert.match(src, /has: \[\{ type: 'header', key: CMS_PAGE_HEADER, value: '1' \}\]/)
  assert.match(src, /destination: `\$\{CMS_PAGE_ROUTE\}\/:path\*`/)
})

test('the CMS route refuses a request that did not come through the rewrite, before it resolves anything', () => {
  const src = code('app/cms-page/[...slug]/page.tsx')
  const lock = src.indexOf("if ((await headers()).get(CMS_PAGE_HEADER) !== '1') notFound()")
  const resolve = src.indexOf('resolvePage(pathFromSlug(slug))', src.indexOf('export default'))
  assert.ok(lock > 0 && resolve > lock)
})

test('the proxy and the pages ask the SAME question, so they can never disagree about a page', () => {
  const proxy = code('proxy.ts')
  assert.match(proxy, /await postExists\(route\.slug\)/)
  assert.match(proxy, /await termExists\(route\.slug\)/)
  assert.match(proxy, /learnArticleExists\(route\.product, route\.slug\)/)
  assert.match(proxy, /await resolvePage\(req\.nextUrl\.pathname\)/)
  assert.match(code('app/blog/[slug]/page.tsx'), /if \(!\(await postExists\(slug\)\)\) notFound\(\)/)
  assert.match(code('app/glossary/[slug]/page.tsx'), /if \(!\(await termExists\(slug\)\)\) notFound\(\)/)
  assert.match(code('lib/learn.ts'), /if \(!learnArticleExists\(product, slug\)\) return null/)
})

test('a miss is rewritten (the address stays), and a header a client sends is removed before the router sees it', () => {
  const src = code('proxy.ts')
  assert.match(src, /NextResponse\.rewrite\(new URL\(NOT_FOUND_ROUTE, req\.url\)\)/)
  assert.match(src, /headers\.delete\(CMS_PAGE_HEADER\)/)
})

test('a failure inside the gate falls through to the routes, never a 500 or a false 404', () => {
  const src = code('proxy.ts')
  assert.match(src, /\} catch \{\s*\n\s*return continueTo\(req, route\.family === 'other'\)\s*\n\s*\}/)
})
