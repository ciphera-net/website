import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Page metadata blocks for every visitor (owner ruling 24-10-2026): next.config.ts sets `htmlLimitedBots` to a pattern
 * that matches any user agent. Next streams `generateMetadata` after `</head>` for the user agents it does not match
 * (next/dist/server/lib/streaming-metadata.js), and the edge keeps one copy of a page for everyone, so a link-preview
 * bot was served a browser's copy with the title and the card past `</head>` (measured 23-10-2026). Source-level, like
 * the rest of this lane (CI runs it without `npm ci`).
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

test('next.config.ts makes metadata blocking for every user agent', () => {
  // ⚠️ NOT COMMENT-STRIPPED like the source checks elsewhere in this lane (the glob in this file opens a false block
  // comment for that regex; see the next test). A line that STARTS with the key cannot sit in a `//` comment or inside a
  // block comment's starred lines, so it is matched as written.
  const config = readFileSync(join(root, 'next.config.ts'), 'utf-8')
  const lines = [...config.matchAll(/^\s*htmlLimitedBots:\s*\/(.+)\/([a-z]*),?\s*$/gm)]
  assert.equal(lines.length, 1, 'next.config.ts must set exactly one htmlLimitedBots pattern, or browsers get streamed metadata')
  const m = lines[0]
  const pattern = new RegExp(m[1], m[2])
  for (const ua of [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
    'Twitterbot/1.0',
    'curl/8.7.1',
    'x',
  ]) {
    assert.ok(pattern.test(ua), `htmlLimitedBots does not match "${ua}": that visitor gets streamed metadata`)
  }
})

test('next.config.ts holds no star-slash pair, so the source checks of it see every line', () => {
  // The glob in outputFileTracingIncludes holds a slash and a star, which the comment-stripping regex the source checks
  // use (blog-seam.test.mjs, not-found-gate.test.mjs and others) takes for a block comment opener. Until a star-slash
  // pair follows, nothing is hidden; once one does (a `/* ... */` comment, a `.*` pattern written with a slash after
  // it), every line in between disappears from those checks without a word. Comments in this file are `//` only.
  const config = readFileSync(join(root, 'next.config.ts'), 'utf-8')
  assert.equal(config.split('*/').length - 1, 0, 'next.config.ts contains a star-slash pair: use a // comment')
})
