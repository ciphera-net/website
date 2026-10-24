// lib/blog.ts's resolvers, run for real against a fixture seed and a fake content CDN, one scenario at a time; prints
// what each answered as JSON for __tests__/blog-resolver.render.mjs. The runtime kinds come from the environment, as in
// production: lib/cms/runtime-config.ts reads CMS_RUNTIME_KINDS when it loads.
import { wpPosts } from '../../lib/blog-wp.gen'
import { getBlogPost, getBlogPosts, getBlogRuntimeState } from '../../lib/blog'
import type { WpBlogPost } from '../../lib/blog-types'

function post(slug: string, title: string): WpBlogPost {
  return {
    slug,
    title,
    description: 'A fixture post.',
    category: 'Privacy',
    date: '2026-10-01',
    dateModified: '2026-10-01',
    readTime: '1 min read',
    html: `<p>${title}</p>`,
    faqs: [],
    wordCount: 2,
  }
}

// The build seed: a post WordPress still publishes, and one it has unpublished since the build.
wpPosts.splice(0, wpPosts.length, post('kept', 'Kept (seed)'), post('gone', 'Gone (seed)'))

type Answer = { status: number; body?: unknown } | 'throw'
let answer: (path: string) => Answer = () => ({ status: 500 })
let requested: string[] = []
let now = 1_000_000
Date.now = () => now
globalThis.fetch = (async (input: string | URL | Request) => {
  const path = String(input).replace(/^https?:\/\/[^/]+\//, '')
  requested.push(path)
  const a = answer(path)
  if (a === 'throw') throw new TypeError('fetch failed')
  return new Response(a.body === undefined ? '' : JSON.stringify(a.body), {
    status: a.status,
    headers: { 'content-type': 'application/json' },
  })
}) as typeof fetch

const INDEX = 'content/ciphera-net/index.json'
function index(items: Record<string, string>, schema = 1) {
  return {
    published_at: '2026-10-24T00:00:00Z',
    kinds: { blog: { schema, watermark: '2026-10-24T00:00:00', count: Object.keys(items).length, items } },
  }
}

async function scenario(name: string, a: (path: string) => Answer) {
  answer = a
  requested = []
  now += 20_000 // past the content client's 15 s index cache, so each scenario reads its own index
  const one = async (slug: string) => (await getBlogPost(slug))?.title ?? null
  return {
    name,
    kept: await one('kept'),
    gone: await one('gone'),
    constructorKey: await one('constructor'),
    protoKey: await one('__proto__'),
    list: (await getBlogPosts()).map((p) => p.slug).sort(),
    source: (await getBlogRuntimeState()).source,
    requested: [...new Set(requested)].sort(),
  }
}

const results = [
  await scenario('the index lists the kept post only', (p) =>
    p === INDEX
      ? { status: 200, body: index({ kept: 'content/ciphera-net/blog/kept.a1a1a1a1.json' }) }
      : p === 'content/ciphera-net/blog/kept.a1a1a1a1.json'
        ? { status: 200, body: post('kept', 'Kept (cdn)') }
        : { status: 404 },
  ),
  await scenario('a listed document fails', (p) =>
    p === INDEX ? { status: 200, body: index({ kept: 'content/ciphera-net/blog/kept.b2b2b2b2.json' }) } : { status: 503 },
  ),
  await scenario('the index is unreachable', () => 'throw'),
  await scenario('the index answers 500', () => ({ status: 500 })),
  await scenario('the index has a schema this build predates', (p) =>
    p === INDEX ? { status: 200, body: index({ kept: 'content/ciphera-net/blog/kept.c3c3c3c3.json' }, 2) } : { status: 404 },
  ),
  await scenario('the site has no index yet', () => ({ status: 404 })),
  await scenario('the index has no blog kind', (p) =>
    p === INDEX ? { status: 200, body: { published_at: '2026-10-24T00:00:00Z', kinds: {} } } : { status: 404 },
  ),
]
console.log(JSON.stringify(results))
