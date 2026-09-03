import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Every `openGraph.images` entry on this site must declare 1200×630 — the size
 * the cards actually are.
 *
 * `app/blog/[slug]/page.tsx` declared **1376×768** until 03-09-2026. It was the
 * only route on the site that did; every other page already said 1200×630, and
 * `Public/docs/og-image-generation.md` names 1200×630 as the spec the
 * compositor screenshots at. Six blog cards sampled straight from the CDN were
 * all 1200×630, so the declaration was wrong for every post on the site.
 *
 * 🔴 THE DIMENSIONS ARE NOT DECORATION. A scraper lays the card out from the
 * DECLARED size before the image arrives, so a wrong pair reserves the wrong
 * box and the unfurl letterboxes or crops. Nothing about it is visible in
 * review — the HTML is well-formed, the image loads, the page is fine — and it
 * only ever shows up in somebody else's Slack, which is precisely why it sat
 * there unnoticed.
 *
 * This guard is source-level on purpose: it must not depend on the network, or
 * it becomes a test that fails when the CDN is slow rather than when the code
 * is wrong.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OG_WIDTH = 1200
const OG_HEIGHT = 630

/** Every .ts/.tsx under app/, which is where Next's metadata exports live. */
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

test('no route declares an OG size outside the two the site actually ships', () => {
  const files = sourceFiles(join(root, 'app'))
  // Positive control: if this ever finds nothing, the walk is broken and the
  // assertions below would pass vacuously.
  assert.ok(files.length > 20, `expected to scan the app/ tree, found ${files.length} files`)

  const declarations = []
  for (const file of files) {
    const src = readFileSync(file, 'utf8')
    for (const m of src.matchAll(/width:\s*(\d+),?\s*\n?\s*height:\s*(\d+)/g)) {
      declarations.push({
        file: relative(root, file),
        size: `${m[1]}x${m[2]}`,
      })
    }
  }

  // Second control: the site definitely declares OG images somewhere.
  assert.ok(
    declarations.length >= 8,
    `expected to find OG image declarations, found ${declarations.length}`,
  )

  // 🔑 TWO legitimate sizes, and the distinction is the point:
  //   1200x630 — a composited OG CARD, the spec in og-image-generation.md.
  //    512x512 — a product ICON used as the share image on three /products
  //              pages. Declared HONESTLY (the file really is square), unlike
  //              the blog bug, which declared a size the file was not.
  //              ⚠️ A square image renders poorly under `summary_large_image`;
  //              whether those pages should get real cards is a CONTENT
  //              decision, not a correctness one, and is deliberately not
  //              enforced here. A guard that fails on a judgement call gets
  //              blanket-allowlisted, which is worse than no guard.
  const ALLOWED = new Set(['1200x630', '512x512'])
  const novel = declarations.filter((d) => !ALLOWED.has(d.size))
  assert.deepEqual(
    novel,
    [],
    `these routes declare an OG size the site does not ship:\n` +
      novel.map((d) => `  ${d.file}: ${d.size}`).join('\n'),
  )
})

test('the blog post route declares the card size, not something else', () => {
  // The specific regression: app/blog/[slug]/page.tsx said 1376x768 until
  // 03-09-2026 while every blog card sampled from the CDN was 1200x630, so the
  // declaration was wrong for EVERY post on the site. This route is singled out
  // because it is the only one whose image is a generated card per post.
  const src = readFileSync(join(root, 'app', 'blog', '[slug]', 'page.tsx'), 'utf8')
  assert.match(
    src,
    /images:\s*\[\{[^}]*width:\s*1200,\s*height:\s*630/,
    'the blog post route must declare 1200x630 — the size its cards actually are',
  )
  // Scoped to a DECLARATION, not the bare numbers — the docblock above the
  // fixed line names 1376×768 to explain the history, and a guard that fires on
  // its own documentation trains people to delete the documentation.
  assert.doesNotMatch(
    src,
    /width:\s*1376|height:\s*768/,
    'the old 1376x768 declaration is back',
  )
})

test('the OG generation recipe still specifies the size this guard enforces', () => {
  // Ties the guard to the document that owns the decision, so changing one
  // without the other is caught rather than silently diverging.
  const recipe = readFileSync(join(root, '..', 'docs', 'og-image-generation.md'), 'utf8')
  assert.match(
    recipe,
    new RegExp(`${OG_WIDTH}\\s*[×x]\\s*${OG_HEIGHT}`),
    'og-image-generation.md no longer states 1200×630 — decide which is right before changing either',
  )
})
