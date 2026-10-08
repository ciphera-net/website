import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * cms-publisher ships inside the SAME image the site runs, assembled the same way the
 * Next.js build itself is (WEB-26, §4.1.3a "runs from the same image the site runs").
 *
 * 🔑 SOURCE-LEVEL: this suite cannot invoke esbuild or Docker — it asserts the wiring
 * between package.json, the Dockerfile and the two Woodpecker pipelines agrees, since a
 * mismatch between any two of them is exactly the kind of thing that builds green and
 * ships an image with no cms-publisher in it.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf-8')

test('package.json bundles scripts/cms-publisher.ts with esbuild, with no npm dependency to resolve', () => {
  const pkg = JSON.parse(read('package.json'))
  assert.match(pkg.scripts['build:cms-publisher'], /esbuild scripts\/cms-publisher\.ts/)
  assert.match(pkg.scripts['build:cms-publisher'], /--bundle/)
  assert.match(pkg.scripts['build:cms-publisher'], /--platform=node/)
  assert.match(pkg.scripts['build:cms-publisher'], /--outfile=dist\/cms-publisher\/publisher\.mjs/)
  assert.match(pkg.scripts['selftest:cms-publisher'], /node dist\/cms-publisher\/publisher\.mjs --self-test/)
})

test('the Dockerfile COPYs dist/cms-publisher to /app/cms-publisher, alongside the standalone output', () => {
  const dockerfile = read('Dockerfile')
  assert.match(dockerfile, /COPY --chown=nextjs:nodejs dist\/cms-publisher \.\/cms-publisher/)
  // It must land AFTER the standalone/static copies in file order, matching how the
  // comment describes it ("SAME shape AS THE SITE ABOVE") — not a correctness
  // requirement for Docker itself, but a regression in read order is how this kind of
  // comment goes stale.
  const standaloneIdx = dockerfile.indexOf('.next/standalone')
  const publisherIdx = dockerfile.indexOf('dist/cms-publisher')
  assert.ok(standaloneIdx > -1 && publisherIdx > standaloneIdx, 'the cms-publisher COPY must come after the standalone output COPY')
})

test('both build.yml (PR gate) and push.yml (main) bundle and self-test cms-publisher right after `npm run build`', () => {
  for (const file of ['.woodpecker/build.yml', '.woodpecker/push.yml']) {
    const src = read(file)
    assert.match(src, /- npm run build\n(\s*#.*\n)*\s*- npm run build:cms-publisher/, `${file} must bundle cms-publisher right after the Next.js build`)
    assert.match(src, /- npm run selftest:cms-publisher/, `${file} must self-test the bundle before the Dockerfile ever touches it`)
  }
})

test('dist/ is gitignored, same as .next — the bundle is CI output, never committed', () => {
  const gitignore = read('.gitignore')
  assert.match(gitignore, /^\/dist$/m)
})
