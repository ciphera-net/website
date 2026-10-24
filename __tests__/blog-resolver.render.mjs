import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * lib/blog.ts's resolvers, run for real: `render/blog-resolver-entry.ts` is bundled by esbuild (as og-render.render.mjs
 * does) and executed against a fixture seed and a fake content CDN, scenario by scenario.
 *
 * 🔴 A POST UNPUBLISHED IN THE CMS GOES AWAY AT ONCE (owner ruling 24-10-2026). A readable index that does not list a post
 * means WordPress no longer publishes it (a post the publisher skipped keeps its last good document,
 * lib/cms/publisher-core.mjs `mergeLastGood`), so its page answers nothing, as the list, the feed and the sitemap
 * already do. Until 24-10-2026 the build seed kept such a page up until the next website build. The seed still answers
 * while the CMS cannot be trusted for the blog (no index, no blog kind, a schema this build predates, an unreachable
 * or failing CDN), and for one listed document that fails.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, '__tests__', 'render', '.out')
const outFile = join(outDir, 'blog-resolver.mjs')

let on
let off

before(() => {
  mkdirSync(outDir, { recursive: true })
  execFileSync(
    'npx',
    [
      '--yes', 'esbuild',
      join(root, '__tests__', 'render', 'blog-resolver-entry.ts'),
      '--bundle', '--platform=node', '--format=esm', '--target=node20',
      `--tsconfig=${join(root, 'tsconfig.json')}`,
      '--packages=external',
      `--outfile=${outFile}`,
    ],
    { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] },
  )
  const run = (kinds) =>
    Object.fromEntries(
      JSON.parse(execFileSync('node', [outFile], { cwd: root, encoding: 'utf-8', env: { ...process.env, CMS_RUNTIME_KINDS: kinds } })).map(
        (r) => [r.name, r],
      ),
    )
  on = run('blog')
  off = run('glossary')
})

test('a readable index that does not list a post: the post is gone at once, as it is from the list', () => {
  const r = on['the index lists the kept post only']
  assert.equal(r.source, 'cdn')
  assert.equal(r.kept, 'Kept (cdn)', 'a listed post comes from its published document')
  assert.equal(r.gone, null, 'an unpublished post must not be served from the build seed')
  assert.deepEqual(r.list, ['kept'])
  // A key the object inherits is not a listed post.
  assert.equal(r.constructorKey, null)
  assert.equal(r.protoKey, null)
  // Nothing is fetched for a post the index does not list: only the index and the listed document.
  assert.deepEqual(r.requested, ['content/ciphera-net/blog/kept.a1a1a1a1.json', 'content/ciphera-net/index.json'])
})

test('one listed document failing: that post falls back to the seed, an unlisted one stays gone', () => {
  const r = on['a listed document fails']
  assert.equal(r.kept, 'Kept (seed)')
  assert.equal(r.gone, null)
  assert.deepEqual(r.list, ['kept'])
})

test('while the CMS cannot be trusted for the blog, the seed answers every post', () => {
  for (const name of [
    'the index is unreachable',
    'the index answers 500',
    'the index has a schema this build predates',
    'the site has no index yet',
    'the index has no blog kind',
  ]) {
    const r = on[name]
    assert.ok(r, `scenario "${name}" did not run`)
    assert.equal(r.source, 'seed', name)
    assert.equal(r.kept, 'Kept (seed)', name)
    assert.equal(r.gone, 'Gone (seed)', name)
    assert.deepEqual(r.list, ['gone', 'kept'], name)
    assert.equal(r.constructorKey, null, name)
  }
})

test('with the blog not a runtime kind, the seed answers whatever the CMS says', () => {
  assert.equal(Object.keys(off).length, Object.keys(on).length)
  for (const r of Object.values(off)) {
    assert.equal(r.source, 'seed', r.name)
    assert.equal(r.kept, 'Kept (seed)', r.name)
    assert.equal(r.gone, 'Gone (seed)', r.name)
  }
})
