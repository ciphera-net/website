import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { register } from 'tsx/esm/api'

/**
 * WEB-28, build task §1 — a CMS `closing-cta` section with an empty title/text must
 * render ciphera.net's OWN standard ending, never `@ciphera-net/facet-sections`'
 * `SeoPageCta` built-in defaults, which are pulse-website's copy ("Try privacy-first
 * analytics free…", "View live demo" → `/demo`) — that package was promoted FROM
 * pulse-website (design §4.2).
 *
 * This is a REAL render (`renderToStaticMarkup`), not a source-level string match:
 * it calls the actual shared component with the actual props `components/cms/CmsPage.tsx`
 * passes for a 'closing-cta' section, for both the empty-section case and an
 * agency-filled case, and asserts on the produced HTML. `SeoPageCta` itself has no
 * transitive dependency on `@phosphor-icons/react`'s icon barrel (unlike `FaqBlock`/
 * `TrustStrip`), so it is safe to import directly under a bare Node + tsx loader —
 * `CmsPage.tsx` itself cannot be imported this way (its sibling imports pull in that
 * barrel, which ships a `"type": "module"` package pointing `main` at CJS content —
 * an upstream packaging defect Next's bundler tolerates and raw Node does not); the
 * `root = ...` / `code()` source read below is what proves the exact props this file
 * actually passes, closing that gap.
 */
register()
const { SeoPageCta } = await import('@ciphera-net/facet-sections')
const React = await import('react')
const { renderToStaticMarkup } = await import('react-dom/server')
const { CmsLink } = await import(join(process.cwd(), 'components/cms/CmsLink.tsx'))

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

const CIPHERA_CLOSING_CTA_TITLE = 'Own your data.'
const CIPHERA_CLOSING_CTA_BODY =
  'One Ciphera ID account signs you in to every product we build. Your password never leaves your device, and we authenticate you without ever seeing your credentials.'
const PULSE_DEFAULT_TITLE = 'Try privacy-first analytics free'
const PULSE_DEFAULT_SECONDARY_HREF = '/demo'
const PULSE_DEFAULT_SECONDARY_LABEL = 'View live demo'

function renderClosingCta(section) {
  return renderToStaticMarkup(
    React.createElement(SeoPageCta, {
      title: section.title || CIPHERA_CLOSING_CTA_TITLE,
      body: section.text || CIPHERA_CLOSING_CTA_BODY,
      secondaryHref: '/products',
      secondaryLabel: 'Explore products',
      LinkComponent: CmsLink,
    })
  )
}

test('an EMPTY closing-cta section renders ciphera.net\'s own standard ending, not SeoPageCta\'s built-in (Pulse) defaults', () => {
  const html = renderClosingCta({ title: '', text: '' })
  assert.match(html, /Own your data\./)
  assert.doesNotMatch(html, new RegExp(PULSE_DEFAULT_TITLE))
  assert.doesNotMatch(html, /href="\/demo"/)
  assert.doesNotMatch(html, new RegExp(PULSE_DEFAULT_SECONDARY_LABEL))
})

test('NEGATIVE CONTROL: calling SeoPageCta with NO overrides (the pre-fix call shape) DOES render Pulse\'s defaults — proves the assertions above are not vacuous', () => {
  const html = renderToStaticMarkup(React.createElement(SeoPageCta, { title: undefined, body: undefined, LinkComponent: CmsLink }))
  assert.match(html, new RegExp(PULSE_DEFAULT_TITLE))
  assert.match(html, /href="\/demo"/)
  assert.match(html, new RegExp(PULSE_DEFAULT_SECONDARY_LABEL))
})

test('an agency-filled closing-cta section renders the agency\'s own title/text, but STILL never the Pulse secondary link (no field for it exists)', () => {
  const html = renderClosingCta({ title: 'Custom heading', text: 'Custom body copy.' })
  assert.match(html, /Custom heading/)
  assert.match(html, /Custom body copy\./)
  assert.doesNotMatch(html, /href="\/demo"/)
  assert.doesNotMatch(html, new RegExp(PULSE_DEFAULT_SECONDARY_LABEL))
})

test('CmsPage.tsx\'s closing-cta case actually passes these ciphera.net constants — the source matches what was just proven to render', () => {
  const src = code('components/cms/CmsPage.tsx')
  assert.match(src, /CIPHERA_CLOSING_CTA_TITLE = 'Own your data\.'/)
  assert.match(src, /CIPHERA_CLOSING_CTA_SECONDARY_HREF = '\/products'/)
  assert.doesNotMatch(src, /secondaryHref=\{undefined\}/)
  // The exact pre-fix line this replaces — must be gone, not just supplemented.
  assert.doesNotMatch(src, /<SeoPageCta title=\{section\.title \|\| undefined\} body=\{section\.text \|\| undefined\} LinkComponent=\{CmsLink\} \/>/)
})
