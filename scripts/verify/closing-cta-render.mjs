/**
 * WEB-28, build task §1 — REAL render proof for the closing-cta fix.
 *
 * `__tests__/*.test.mjs` must stay dependency-free (`.woodpecker/test.yml`: "No npm
 * token and no `npm ci`"), so this script is NOT part of `npm test` — it is a manual
 * verification tool, run with `npx tsx scripts/verify/closing-cta-render.mjs` after
 * `npm ci`, that actually calls the real `@ciphera-net/facet-sections` `SeoPageCta`
 * component the way `components/cms/CmsPage.tsx`'s `closing-cta` case calls it, and
 * checks the real rendered HTML — not a string match against the source.
 *
 * Exits 1 on any failed assertion (and prints which one), 0 when every check,
 * including the negative control, passes.
 */
import { register } from 'tsx/esm/api'

register()

const { SeoPageCta } = await import('@ciphera-net/facet-sections')
const React = await import('react')
const { renderToStaticMarkup } = await import('react-dom/server')
const { CmsLink } = await import('../../components/cms/CmsLink.tsx')

const CIPHERA_CLOSING_CTA_TITLE = 'Own your data.'
const CIPHERA_CLOSING_CTA_BODY =
  'One Ciphera ID account signs you in to every product we build. Your password never leaves your device, and we authenticate you without ever seeing your credentials.'
const PULSE_DEFAULT_TITLE = 'Try privacy-first analytics free'
const PULSE_DEFAULT_SECONDARY_LABEL = 'View live demo'

let failures = 0
function check(label, cond) {
  if (cond) {
    console.log(`  ok: ${label}`)
  } else {
    console.error(`  FAIL: ${label}`)
    failures++
  }
}

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

console.log('An EMPTY closing-cta section:')
{
  const html = renderClosingCta({ title: '', text: '' })
  check("renders ciphera.net's own title", /Own your data\./.test(html))
  check("never renders Pulse's default title", !html.includes(PULSE_DEFAULT_TITLE))
  check('never links to /demo', !/href="\/demo"/.test(html))
  check("never renders Pulse's secondary label", !html.includes(PULSE_DEFAULT_SECONDARY_LABEL))
}

console.log('An agency-filled closing-cta section:')
{
  const html = renderClosingCta({ title: 'Custom heading', text: 'Custom body copy.' })
  check("renders the agency's own title", html.includes('Custom heading'))
  check("renders the agency's own body", html.includes('Custom body copy.'))
  check('still never links to /demo (no field for it exists)', !/href="\/demo"/.test(html))
}

console.log('NEGATIVE CONTROL — SeoPageCta with NO overrides (the pre-fix call shape):')
{
  const html = renderToStaticMarkup(React.createElement(SeoPageCta, { title: undefined, body: undefined, LinkComponent: CmsLink }))
  check('DOES render Pulse\'s default title (proves the checks above are not vacuous)', html.includes(PULSE_DEFAULT_TITLE))
  check('DOES link to /demo', /href="\/demo"/.test(html))
  check('DOES render Pulse\'s secondary label', html.includes(PULSE_DEFAULT_SECONDARY_LABEL))
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`)
  process.exit(1)
}
console.log('\nAll checks passed.')
