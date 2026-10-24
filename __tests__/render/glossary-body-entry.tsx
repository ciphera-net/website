/**
 * A glossary term's body (24-10-2026) through the real renderer (`components/overhaul/glossary/body.tsx`'s
 * `renderGlossaryBody`, so the post body's sanitizer, `newTabLinks`, `cdnImagesOnly` and rehype-react all run as
 * they do for a reader). `node <bundle>` — no arguments, prints one JSON object with every case's HTML.
 */
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { renderGlossaryBody } from '@/components/overhaul/glossary/body'

const CASES: Record<string, string> = {
  blockClasses: '<p class="wp-block-paragraph">A term.</p><p class="has-text-align-center wp-block-paragraph"><strong>Bold</strong></p>',
  quote:
    '<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow"><p class="wp-block-paragraph">Quoted.</p></blockquote>',
  script: '<p>Before</p><script>alert(1)</script><img src="x" onerror="alert(2)"><p onclick="alert(3)">After</p>',
  newTab: '<p>See <a href="https://ciphera.net/blog/x" target="_blank" rel="noreferrer noopener">the guide</a>.</p>',
  unsafeHref: '<p><a href="javascript:alert(1)">x</a></p>',
  offCdnImage: '<p><img src="https://evil.example/a.png" alt="a"></p>',
  // The live cookieless-analytics term's quote holds a new-tab link wrapped around another link. HTML cannot nest
  // links, so the parser splits them, here as in a browser.
  nested:
    '<p><strong>Read: <a href="https://ciphera.net/blog" target="_blank" rel="noreferrer noopener"><a href="https://ciphera.net/blog/cookieless-analytics">Guide</a></a></strong></p>',
}

const out: Record<string, string> = {}
for (const [name, html] of Object.entries(CASES)) {
  out[name] = renderToStaticMarkup(React.createElement(React.Fragment, null, renderGlossaryBody(html)))
}
process.stdout.write(JSON.stringify(out))
