/**
 * The post body's links that open a new tab (24-10-2026), through the real renderer
 * (`components/overhaul/blog/PostBody.tsx`'s `renderPostBody`, so the sanitizer, `newTabLinks` and rehype-react all
 * run as they do for a reader). `node <bundle>` — no arguments, prints one JSON object with every case's HTML.
 */
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { renderPostBody } from '@/components/overhaul/blog/PostBody'

const CASES: Record<string, string> = {
  internal: '<p>See <a href="/blog/privacy-tools" target="_blank" rel="noreferrer noopener">privacy tools</a>.</p>',
  externalNofollow:
    '<p>See <a href="https://example.org/a" target="_blank" rel="noreferrer noopener nofollow">a source</a>.</p>',
  noRel: '<p>See <a href="https://example.org/b" target="_blank">b</a>.</p>',
  otherTarget: '<p>See <a href="/x" target="_top">x</a>.</p>',
  relOnly: '<p>See <a href="https://example.org/c" rel="nofollow evil sponsored">c</a>.</p>',
  relEmptied: '<p>See <a href="https://example.org/d" rel="external evil">d</a>.</p>',
  plain: '<p>See <a href="/trust">trust</a>.</p>',
  unsafe: '<p>See <a href="javascript:alert(1)" target="_blank">u</a>.</p>',
  heading: '<h2>Read <a href="/blog/x" target="_blank" rel="noopener">the guide</a></h2><p>Body.</p>',
}

const out: Record<string, unknown> = {}
for (const [name, html] of Object.entries(CASES)) {
  const { body, headings } = renderPostBody(html)
  out[name] = renderToStaticMarkup(React.createElement(React.Fragment, null, body))
  if (name === 'heading') out.headings = headings
}
process.stdout.write(JSON.stringify(out))
