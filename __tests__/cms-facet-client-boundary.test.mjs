import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * WEB-28 real-render fix (09-10-2026) — `/products/pulse`'s CMS render crashed in a
 * real Next server (`TypeError: (0, o.useState) is not a function`): `CmsPage` (a
 * Server Component) imported `FaqTabs` directly from the `@ciphera-net/facet-sections`
 * BARREL (`dist/index.js`), which carries no `"use client"` directive even though
 * `FaqTabs` itself is a client component (hooks: `useState`/`useRef`,
 * `dist/components/FaqTabs.js` — the component's OWN per-file export — does carry the
 * directive; the package's re-bundled barrel simply lost it). The fix is
 * `components/cms/FaqTabsClient.tsx`, a local `"use client"` module that re-exports
 * `FaqTabs`; `CmsPage` imports `FaqTabsClient`, never `FaqTabs`.
 *
 * `renderToStaticMarkup` — what the `.render.mjs` parity harness uses — does not
 * enforce the Server/Client split at all, so it cannot see this class of bug (model:
 * the SAME blind spot `Pulse/pulse-website`'s `components/__tests__/platform.test.ts`
 * guard (d) names for a function-prop-across-the-boundary crash: "the route is
 * force-dynamic, so `next build` never rendered it and only a real request found
 * it"). This file is the static guard: it reads the INSTALLED `@ciphera-net/facet-sections`
 * package directly (not a hard-coded list) and asserts that whichever of its exports
 * `CmsPage` imports from the bare barrel either (a) is not a client component at all,
 * per the package's OWN per-component dist file, or (b) really does use a hook,
 * tracing into the chunk files that component's own file imports — in which case it
 * must not be reachable from the barrel import at all.
 *
 * SOURCE-LEVEL (reads node_modules directly, no build step), same reason as every
 * sibling test here (`.woodpecker/test.yml`: "No npm token and no `npm ci`").
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')
function code(p) {
  return read(p)
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

const FACET_SECTIONS_DIST = join(root, 'node_modules/@ciphera-net/facet-sections/dist')
const FACET_SECTIONS_COMPONENTS = join(FACET_SECTIONS_DIST, 'components')

function isClientDirective(src) {
  return /^\s*["']use client["']/.test(src)
}

/** Which named imports a source file takes directly from the bare
 * `'@ciphera-net/facet-sections'` barrel specifier (never a deep subpath — the
 * package's `exports` map only exposes `.`, so a deep import would not resolve). */
function facetSectionsBarrelImports(src) {
  const m = src.match(/import\s*\{([^}]*)\}\s*from\s*['"]@ciphera-net\/facet-sections['"]/)
  if (!m) return []
  return m[1]
    .split(',')
    .map((s) => s.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop())
    .filter(Boolean)
}

const HOOK_PATTERN = /\buse(State|Effect|Ref|Reducer|Context|LayoutEffect|Id|SyncExternalStore|Transition|DeferredValue|ImperativeHandle)\b/

/** Follows a dist file's own same-directory `from "./chunk-….js"` imports
 * (recursively) and reports whether ANY of them — including the file itself —
 * calls a hook. This is the package's REAL implementation graph, not just its
 * per-file `"use client"` marker (which is what went missing on the barrel). */
function usesHooks(absFile, seen = new Set()) {
  if (seen.has(absFile) || !existsSync(absFile)) return false
  seen.add(absFile)
  const src = readFileSync(absFile, 'utf8')
  if (HOOK_PATTERN.test(src)) return true
  const dir = dirname(absFile)
  // The per-component files live one directory down (dist/components/), so their
  // own imports are '../chunk-….js', not './…' — match both relative forms.
  for (const m of src.matchAll(/from\s*["'](\.\.?\/[^"']+\.js)["']/g)) {
    if (usesHooks(join(dir, m[1]), seen)) return true
  }
  return false
}

/** The installed package's own per-component file for a barrel export name, or
 * `null` if it has none (some barrel exports are types only, or share a file under
 * a different name — this test only cares about names CmsPage actually imports). */
function componentFile(name) {
  const abs = join(FACET_SECTIONS_COMPONENTS, `${name}.js`)
  return existsSync(abs) ? abs : null
}

test('every @ciphera-net/facet-sections component CmsPage imports from the bare barrel is confirmed server-safe (no hook anywhere in its implementation graph) — a hook-using one must go through a local client wrapper instead', () => {
  const src = code('components/cms/CmsPage.tsx')
  const barrelImports = facetSectionsBarrelImports(src)
  assert.ok(barrelImports.length > 0, 'CmsPage imports nothing from @ciphera-net/facet-sections any more — update this test')

  const offenders = barrelImports.filter((name) => {
    const file = componentFile(name)
    return file && usesHooks(file)
  })
  assert.deepEqual(
    offenders,
    [],
    `CmsPage imports a client-only facet-sections component directly from the barrel — this loses the "use client" boundary in a real Next build: ${offenders.join(', ')}`
  )
})

test('CONTROL: the installed FaqTabs really does use hooks (the detector has something real to catch)', () => {
  const file = componentFile('FaqTabs')
  assert.ok(file, 'FaqTabs has no per-component dist file any more — update this test')
  assert.equal(usesHooks(file), true)
})

test("CONTROL: a genuinely server-safe component (e.g. MarketingSection) is NOT flagged — the detector doesn't cry wolf on everything", () => {
  const file = componentFile('MarketingSection')
  assert.ok(file, 'MarketingSection has no per-component dist file any more — update this test')
  assert.equal(usesHooks(file), false)
})

test('CmsPage renders faq-tabs sections through components/cms/FaqTabsClient.tsx, never the bare FaqTabs export', () => {
  const src = code('components/cms/CmsPage.tsx')
  assert.ok(
    !facetSectionsBarrelImports(src).includes('FaqTabs'),
    'FaqTabs must not be imported from the @ciphera-net/facet-sections barrel at all'
  )
  assert.match(src, /import \{ FaqTabsClient \} from '\.\/FaqTabsClient'/)
  assert.match(src, /<FaqTabsClient\b/)
})

test("FaqTabsClient.tsx is a real client boundary: starts with 'use client', imports FaqTabs from the package, and forwards only serializable props (no function prop)", () => {
  const raw = read('components/cms/FaqTabsClient.tsx')
  assert.match(raw, /^'use client'/, "FaqTabsClient.tsx's \"use client\" must be the file's first line")
  const src = code('components/cms/FaqTabsClient.tsx')
  assert.match(src, /import \{ FaqTabs,[^}]*\} from '@ciphera-net\/facet-sections'/)
  assert.match(src, /return <FaqTabs /)
  // The only props this file declares are title/subtitle (strings) and
  // categories/items (data arrays) — assert the declared prop set directly rather
  // than merely "no arrow function", so a future added prop is forced through here.
  const propsMatch = src.match(/\{\s*title,\s*subtitle,\s*categories,\s*items,?\s*\}:\s*\{([\s\S]*?)\}\s*\)/)
  assert.ok(propsMatch, 'could not find FaqTabsClient\'s destructured prop list')
  assert.doesNotMatch(propsMatch[1], /=>/, 'a function-typed prop would not survive a real client boundary (props must be serializable)')
})

test('CONTROL: the guard would have caught the pre-fix shape (FaqTabs imported straight into CmsPage from the barrel)', () => {
  const preFix = `import { FaqTabs } from '@ciphera-net/facet-sections'\nexport function Section() { return <FaqTabs /> }`
  const barrelImports = facetSectionsBarrelImports(preFix)
  assert.deepEqual(barrelImports, ['FaqTabs'])
  const file = componentFile('FaqTabs')
  assert.equal(usesHooks(file), true, 'the pre-fix import would have been flagged by the main guard above')
})
