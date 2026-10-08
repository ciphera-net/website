import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * WEB-28, build task §1 — a CMS `closing-cta` section with an empty title/text must
 * render ciphera.net's OWN standard ending, never `@ciphera-net/facet-sections`'
 * `SeoPageCta` built-in defaults, which are pulse-website's copy ("Try privacy-first
 * analytics free…", "View live demo" → `/demo`) — that package was promoted FROM
 * pulse-website (design §4.2).
 *
 * 🔑 SOURCE-LEVEL, same reason as every sibling test in this directory
 * (`.woodpecker/test.yml`: "No npm token and no `npm ci`" — this step must stay
 * dependency-free). The REAL render proof (`renderToStaticMarkup` against the actual
 * `SeoPageCta` component, with a negative control showing the pre-fix call shape DOES
 * render Pulse's copy) was run once while writing the fix, under `npx tsx`, outside
 * this directory — see `scripts/verify/closing-cta-render.mjs`.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

test('a closing-cta section falls back to ciphera.net\'s OWN title/body/secondary link, never SeoPageCta\'s built-in (Pulse) defaults', () => {
  const src = code('components/cms/CmsPage.tsx')
  assert.match(src, /CIPHERA_CLOSING_CTA_TITLE = 'Own your data\.'/)
  assert.match(src, /CIPHERA_CLOSING_CTA_BODY =/)
  assert.match(src, /CIPHERA_CLOSING_CTA_SECONDARY_HREF = '\/products'/)
  assert.match(src, /CIPHERA_CLOSING_CTA_SECONDARY_LABEL = 'Explore products'/)

  // The closing-cta case must supply ALL FOUR props explicitly — title, body,
  // secondaryHref AND secondaryLabel — never leaving one to fall through to
  // SeoPageCta's own default (which is where Pulse's copy/link lived).
  const caseMatch = src.match(/case 'closing-cta':[\s\S]*?\n\n/)
  assert.ok(caseMatch, "could not find the 'closing-cta' case in CmsPage's Section switch")
  const body = caseMatch[0]
  assert.match(body, /title=\{section\.title \|\| CIPHERA_CLOSING_CTA_TITLE\}/)
  assert.match(body, /body=\{section\.text \|\| CIPHERA_CLOSING_CTA_BODY\}/)
  assert.match(body, /secondaryHref=\{CIPHERA_CLOSING_CTA_SECONDARY_HREF\}/)
  assert.match(body, /secondaryLabel=\{CIPHERA_CLOSING_CTA_SECONDARY_LABEL\}/)
})

test('NEGATIVE CONTROL: the pre-fix call shape (no secondary override, title/body falling through to undefined) is gone from the source', () => {
  const src = code('components/cms/CmsPage.tsx')
  assert.doesNotMatch(
    src,
    /<SeoPageCta title=\{section\.title \|\| undefined\} body=\{section\.text \|\| undefined\} LinkComponent=\{CmsLink\} \/>/,
    'the exact pre-fix line must be gone, not merely supplemented'
  )
})
