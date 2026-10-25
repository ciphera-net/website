import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The breadcrumb's BreadcrumbList JSON-LD is written with `jsonLdHtml` (lib/json-ld.ts), like every CMS-fed JSON-LD
 * block on the site (25-10-2026). On a CMS page its labels come from the page's path, which is CMS data.
 *
 * REAL RENDER: `components/Breadcrumbs.tsx` through `renderToStaticMarkup`, bundled by esbuild in one process, the
 * same device as `glossary-body.render.mjs`. Exact strings.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, '__tests__', 'render', '.out')
const outFile = join(outDir, 'breadcrumbs.mjs')

let result

before(() => {
  mkdirSync(outDir, { recursive: true })
  execFileSync(
    'npx',
    [
      '--yes', 'esbuild',
      join(root, '__tests__', 'render', 'breadcrumbs-entry.tsx'),
      '--bundle', '--platform=node', '--format=esm', '--target=node20',
      `--tsconfig=${join(root, 'tsconfig.json')}`,
      '--packages=external',
      `--outfile=${outFile}`,
    ],
    { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] }
  )
  result = JSON.parse(execFileSync('node', [outFile], { cwd: root, encoding: 'utf-8' }))
}, 60_000)

const HOME = '{"@type":"ListItem","position":1,"name":"Home","item":"https://ciphera.net"}'

test('plain labels render exactly as before (the /learn breadcrumb, a CMS path)', () => {
  assert.equal(
    result.learn,
    `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[${HOME},{"@type":"ListItem","position":2,"name":"Learn"}]}</script>`
  )
  assert.equal(
    result.path,
    `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[${HOME},` +
      '{"@type":"ListItem","position":2,"name":"Products","item":"https://ciphera.net/products"},' +
      '{"@type":"ListItem","position":3,"name":"Pulse"}]}</script>'
  )
})

test('<, > and & are written as JSON unicode escapes: the script ends only at its own closing tag', () => {
  assert.equal(
    result.unsafe,
    `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[${HOME},` +
      '{"@type":"ListItem","position":2,"name":"A \\u003c/script\\u003e\\u003cimg src=x onerror=alert(1)\\u003e \\u0026 B",' +
      '"item":"https://ciphera.net/a\\u0026b"}]}</script>'
  )
  assert.equal(result.unsafe.match(/<\/script/gi).length, 1)
  const json = result.unsafe.slice('<script type="application/ld+json">'.length, -'</script>'.length)
  assert.deepEqual(JSON.parse(json).itemListElement[1], {
    '@type': 'ListItem',
    position: 2,
    name: 'A </script><img src=x onerror=alert(1)> & B',
    item: 'https://ciphera.net/a&b',
  })
})
