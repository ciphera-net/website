import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * R13 (D65) — the blog post's "On this page" rail: the section being read is lit in brand orange and an orange thumb
 * glides beside it. Source-level, same as the rest of this suite; the behaviour (a title at the bottom of the screen does
 * not light up, one entry at a time, clicks light their entry) is measured in Chromium by
 * Public/docs/data/19-10-2026-blog-toc-thumb/capture-toc.mjs.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('the post page renders the client rail, not a static list', () => {
  const page = code('components/overhaul/blog/BlogPost.tsx')
  assert.match(page, /import \{ TocRail \} from '\.\/TocRail'/)
  assert.doesNotMatch(page, /function TocRail\(/)
  assert.match(read('components/overhaul/blog/TocRail.tsx'), /^'use client'/)
})

test('ONE entry is lit: the last heading above the reading line, never every heading on screen', () => {
  const src = code('components/overhaul/blog/TocRail.tsx')
  assert.match(src, /useState<string \| null>\(null\)/)
  assert.match(src, /if \(el\.getBoundingClientRect\(\)\.top > line\) break/)
  assert.doesNotMatch(src, /IntersectionObserver/)
  assert.match(src, /data-active=\{active === h\.id\}/)
  assert.match(src, /aria-current=\{active === h\.id \? 'location' : undefined\}/)
})

test('the reading line never sits above where an anchor click lands a heading', () => {
  const src = code('components/overhaul/blog/TocRail.tsx')
  // The post's headings land 112 px down (prose-headings:scroll-mt-28 = 7rem); the line keeps a margin below that.
  assert.match(code('components/overhaul/blog/BlogPost.tsx'), /prose-headings:scroll-mt-28/)
  assert.match(src, /const LANDING_PX = 112 \+ 16/)
  assert.match(src, /Math\.max\(window\.innerHeight \* READING_LINE, LANDING_PX\)/)
})

test('D65: the lit title and the thumb are brand orange; the glide stops under reduced motion', () => {
  const src = code('components/overhaul/blog/TocRail.tsx')
  assert.match(src, /data-\[active=true\]:text-brand-orange/)
  assert.match(src, /bg-brand-orange transition-\[clip-path\] motion-reduce:transition-none/)
})
