// proxy.ts run for real on four requests; prints, for each, what it hands Next's router, for
// __tests__/proxy-user-agent.render.mjs. The content CDN answers 404 to everything (no CMS page, no redirect).
import { NextRequest } from 'next/server'
import { proxy } from '../../proxy'

globalThis.fetch = (async () => new Response('', { status: 404 })) as typeof fetch

const cases: Array<[string, string, Record<string, string>]> = [
  ['no user agent', '/about', {}],
  ['an empty user agent', '/about', { 'user-agent': '' }],
  ['a browser', '/about', { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' }],
  ['a bot', '/contact', { 'user-agent': 'Twitterbot/1.0' }],
]

const out = []
for (const [name, path, headers] of cases) {
  const res = await proxy(new NextRequest(new URL(path, 'https://ciphera.net'), { headers }))
  out.push({
    name,
    next: res.headers.get('x-middleware-next'),
    override: res.headers.get('x-middleware-override-headers'),
    userAgent: res.headers.get('x-middleware-request-user-agent'),
  })
}
console.log(JSON.stringify(out))
