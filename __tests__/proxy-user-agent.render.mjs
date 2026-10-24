import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * proxy.ts, run for real (bundled by esbuild as blog-resolver.render.mjs does): a request without a user agent goes on
 * to Next's router with one, so Next renders its metadata in the head (24-10-2026 review: Next never tests a missing or
 * empty user agent against htmlLimitedBots, and the edge keeps one copy of a page for every visitor). A request that has
 * one goes on untouched.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outFile = join(root, '__tests__', 'render', '.out', 'proxy-user-agent.mjs')
let byName

before(async () => {
  mkdirSync(dirname(outFile), { recursive: true })
  // The JS API, not the CLI the other render tests use: proxy.ts reaches lib/glossary/index.ts, whose seed
  // (lib/glossary.gen.ts) is a git-ignored build output a fresh checkout lacks, so it is stubbed empty here.
  const { build } = await import('esbuild')
  await build({
    entryPoints: [join(root, '__tests__', 'render', 'proxy-entry.ts')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node20',
    tsconfig: join(root, 'tsconfig.json'),
    packages: 'external',
    // Node's ESM resolver needs the file: next has no exports map for ./server (og-render.render.mjs does the same for next/og).
    alias: { 'next/server': 'next/server.js' },
    outfile: outFile,
    logLevel: 'error',
    plugins: [
      {
        name: 'glossary-seed-stub',
        setup(b) {
          b.onResolve({ filter: /glossary\.gen$/ }, () => ({ path: 'glossary-seed', namespace: 'stub' }))
          b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
            contents: "export const generatedGlossaryTerms = []; export const GLOSSARY_CATEGORY_NAMES = {}; export const GLOSSARY_WATERMARK = ''",
            loader: 'js',
          }))
        },
      },
    ],
  })
  const rows = JSON.parse(execFileSync('node', [outFile], { cwd: root, encoding: 'utf-8', env: { ...process.env, CMS_RUNTIME_KINDS: 'page,redirect' } }))
  byName = Object.fromEntries(rows.map((r) => [r.name, r]))
})

test('a request with no user agent, or an empty one, goes on with MISSING_USER_AGENT', () => {
  for (const name of ['no user agent', 'an empty user agent']) {
    const r = byName[name]
    assert.equal(r.next, '1', name)
    assert.ok((r.override ?? '').split(',').includes('user-agent'), `${name}: the user agent must be among the overridden headers`)
    assert.equal(r.userAgent, 'no-user-agent', name)
  }
})

test('a request that has a user agent goes on untouched', () => {
  for (const name of ['a browser', 'a bot']) {
    const r = byName[name]
    assert.equal(r.next, '1', name)
    assert.equal(r.override, null, name)
    assert.equal(r.userAgent, null, name)
  }
})
