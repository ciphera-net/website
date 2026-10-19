import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Every `openGraph.images` entry on this site must declare 1200×630, the size the cards actually are.
 *
 * `app/blog/[slug]/page.tsx` declared **1376×768** until 03-09-2026 while every blog card on the CDN was 1200×630, so
 * the declaration was wrong for every post on the site.
 *
 * 🔴 THE DIMENSIONS ARE NOT DECORATION. A scraper lays the card out from the DECLARED size before the image arrives, so
 * a wrong pair reserves the wrong box and the unfurl letterboxes or crops. Nothing about it is visible in review (the
 * HTML is well-formed, the image loads, the page is fine) and it only ever shows up in somebody else's Slack.
 *
 * Since the OG card system (D52, 19-10-2026; lib/og) every coded page's image is its own card, declared through one
 * helper (`ogCardImages`) at the size the renderer draws (`OG_WIDTH` × `OG_HEIGHT`). What still declares a size by hand
 * is an image a CMS editor sets: a route stub or a CMS-only page.
 *
 * This guard is source-level on purpose: it must not depend on the network, or it becomes a test that fails when the CDN
 * is slow rather than when the code is wrong.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (...p) => readFileSync(join(root, ...p), 'utf8')

/** Every .ts/.tsx under a directory. */
function sourceFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next') continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full))
    else if (/\.tsx?$/.test(full)) out.push(full)
  }
  return out
}

test('no declaration names an OG size other than the 1200x630 the cards are', () => {
  const files = [...sourceFiles(join(root, 'app')), ...sourceFiles(join(root, 'lib'))]
  // Positive control: if this ever finds nothing, the walk is broken and the assertions below would pass vacuously.
  assert.ok(files.length > 40, `expected to scan the app/ and lib/ trees, found ${files.length} files`)

  const declarations = []
  for (const file of files) {
    // An image declaration: an object with a url and the size it declares (not a drawing's own boxes).
    for (const m of readFileSync(file, 'utf8').matchAll(/url:[^}\n]*width:\s*(\d+),?\s*height:\s*(\d+)/g)) {
      declarations.push({ file: relative(root, file), size: `${m[1]}x${m[2]}` })
    }
  }
  // Second control: the CMS merges (two in lib/seo.ts, one in lib/cms/page-runtime.ts) and the CMS page route declare
  // the size of an editor's image by hand.
  assert.ok(declarations.length >= 4, `expected the CMS image declarations, found ${declarations.length}`)
  const novel = declarations.filter((d) => d.size !== '1200x630')
  assert.deepEqual(novel, [], `these declare an OG size the site does not ship:\n${novel.map((d) => `  ${d.file}: ${d.size}`).join('\n')}`)
})

test('the OG system declares the size it draws its cards at', () => {
  const spec = read('lib', 'og', 'spec.ts')
  assert.match(spec, /export const OG_WIDTH = 1200\b/)
  assert.match(spec, /export const OG_HEIGHT = 630\b/)
  // The declaration and the drawing read the same two constants, so they cannot disagree.
  assert.match(read('lib', 'og', 'url.ts'), /width: OG_WIDTH, height: OG_HEIGHT/)
  assert.match(read('lib', 'og', 'render.tsx'), /\{ width: OG_WIDTH, height: OG_HEIGHT, fonts \}/)
})

test('every coded page takes its share image from its own system card', () => {
  const routes = [
    ['app/layout.tsx', "pageCardImages('home')"],
    ['app/page.tsx', "pageCardImages('home')"],
    ['app/about/layout.tsx', "pageCardImages('about')"],
    ['app/trust/page.tsx', "pageCardImages('trust')"],
    ['app/contact/layout.tsx', "pageCardImages('contact')"],
    ['app/sustainability/layout.tsx', "pageCardImages('sustainability')"],
    ['app/blog/layout.tsx', "pageCardImages('blog')"],
    ['app/glossary/page.tsx', "pageCardImages('glossary')"],
    ['app/learn/layout.tsx', "pageCardImages('learn')"],
    ['app/privacy/page.tsx', "pageCardImages('privacy')"],
    ['app/terms/page.tsx', "pageCardImages('terms')"],
    ['app/blog/[slug]/page.tsx', 'postCardImages(slug, post.title)'],
    ['app/glossary/[slug]/page.tsx', 'termCardImages(term.slug, term.term)'],
    ['app/learn/[product]/[slug]/page.tsx', 'learnCardImages(product, article.slug, article.title)'],
  ]
  for (const [file, call] of routes) {
    const src = read(file)
    assert.ok(src.includes(call), `${file} does not take its card from ${call}`)
    // Every images line names the card; none names an image of its own (the old site-wide cards, the drawn trust seal,
    // a post's cover art).
    for (const line of src.split('\n').filter((l) => /\bimages:/.test(l))) {
      assert.match(line, /images: (CARD|HOME_CARD|card)\.(openGraph|twitter)\b/, `${file}: ${line.trim()}`)
    }
    // Both Open Graph and X: a page without its own twitter block inherits the homepage's card.
    assert.match(src, /\.openGraph\b/, `${file} sets no openGraph card`)
    assert.match(src, /\.twitter\b/, `${file} sets no twitter card`)
  }
  assert.doesNotMatch(read('app', 'blog', '[slug]', 'page.tsx'), /width:\s*1376|height:\s*768/, 'the old 1376x768 declaration is back')
})

/**
 * ⚠️ THERE IS NO TEST HERE TYING THIS TO `og-image-generation.md`, AND THAT IS NOT AN OVERSIGHT. That recipe lives in
 * `Public/docs/`, a SIBLING DIRECTORY of this repo in the monorepo workspace: CI checks out only the repo, so a test
 * reading it would pass because of workspace layout rather than because the code is right.
 */
