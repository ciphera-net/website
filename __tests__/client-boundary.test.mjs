import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The blog's and the glossary's data stay on the server.
 *
 * lib/blog.ts and lib/glossary/ carry their build seeds (lib/blog-wp.gen.ts holds every post's rendered body), and the
 * data modules the pages read (components/overhaul/{blog,glossary}/data.ts) import them. A 'use client' module that
 * reaches any of these compiles without a word and ships the whole corpus to every visitor of its page. Until
 * 23-10-2026 lib/blog.ts imported `fs`, which made such an import fail the build by accident; this is the deliberate
 * guard. `import 'server-only'` cannot be it: scripts/generate-llms.ts loads lib/blog under tsx, where that module does
 * not resolve.
 *
 * 🔑 DEPENDENCY-FREE, like the rest of this lane (CI runs it without `npm ci`): a static walk of the import statements of
 * every module whose first statement is 'use client', through the repository's own files ('@/' and relative
 * specifiers; packages are not followed). Type-only imports are skipped, because TypeScript erases them.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs']

const SERVER_ONLY = [
  'lib/blog.ts',
  'lib/blog-wp.gen.ts',
  'components/overhaul/blog/data.ts',
  'lib/glossary/index.ts',
  'lib/glossary.gen.ts',
  'components/overhaul/glossary/data.ts',
]

/** Source text without comments. (?!\.): a glob such as `dir/*.ext` in a comment is not a comment opener. */
function code(rel) {
  return readFileSync(join(root, rel), 'utf-8')
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

function sources(dir) {
  const out = []
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    const rel = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...sources(rel))
    else if (EXTS.some((x) => entry.name.endsWith(x)) && !entry.name.endsWith('.d.ts')) out.push(rel)
  }
  return out
}

/** Every specifier a module imports for its value: static, re-exported, dynamic or required. */
function valueImports(src) {
  const specs = []
  for (const m of src.matchAll(/\b(import|export)\s+(type\s+)?([^'";]*?)\s*\bfrom\s*['"]([^'"]+)['"]/g)) {
    const [, , typeOnly, clause, spec] = m
    if (typeOnly) continue
    // `import { type A, type B } from …` is erased too; one value specifier in the braces keeps it.
    const braces = clause.match(/^\{([\s\S]*)\}$/)
    if (braces && braces[1].split(',').map((s) => s.trim()).filter(Boolean).every((s) => s.startsWith('type '))) continue
    specs.push(spec)
  }
  for (const m of src.matchAll(/\bimport\s*['"]([^'"]+)['"]/g)) specs.push(m[1])
  for (const m of src.matchAll(/\b(?:import|require)\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) specs.push(m[1])
  return specs
}

function resolveSpec(from, spec) {
  let base
  if (spec.startsWith('@/')) base = spec.slice(2)
  else if (spec.startsWith('.')) base = join(dirname(from), spec)
  else return null
  for (const c of [base, ...EXTS.map((x) => base + x), ...EXTS.map((x) => join(base, `index${x}`))]) {
    if (existsSync(join(root, c)) && statSync(join(root, c)).isFile()) return c
  }
  // A git-ignored build output (lib/glossary.gen.ts) is absent from a fresh clone: it is named by its .ts path, so a
  // forbidden one is still recognised, and not walked.
  return EXTS.some((x) => base.endsWith(x)) ? base : `${base}.ts`
}

/** Every module `start` reaches, each mapped to the module that imported it. */
function walk(start) {
  const from = new Map([[start, null]])
  const queue = [start]
  while (queue.length > 0) {
    const file = queue.shift()
    if (!existsSync(join(root, file))) continue
    for (const spec of valueImports(code(file))) {
      const dep = resolveSpec(file, spec)
      if (dep && !from.has(dep)) {
        from.set(dep, file)
        queue.push(dep)
      }
    }
  }
  return from
}

function chain(from, target) {
  const path = []
  for (let m = target; m; m = from.get(m)) path.unshift(m)
  return path.join(' -> ')
}

const clients = ['app', 'components', 'lib'].flatMap(sources).filter((f) => /^\s*['"]use client['"]/.test(code(f)))

test('the walk finds the client modules and follows imports into the repository', () => {
  // Controls: a walk that resolved nothing would pass the guard below forever.
  assert.ok(clients.length >= 20, `only ${clients.length} 'use client' modules found`)
  const reached = new Set(clients.flatMap((c) => [...walk(c).keys()]))
  assert.ok(
    [...reached].some((m) => m.startsWith('lib/') && !clients.includes(m)),
    'no client module was followed into lib/: the resolver no longer resolves'
  )
  // Each guarded module is reachable from its real server importer, a git-ignored seed included.
  const blog = walk('components/overhaul/blog/data.ts')
  for (const m of ['lib/blog.ts', 'lib/blog-wp.gen.ts']) assert.ok(blog.has(m), `components/overhaul/blog/data.ts no longer reaches ${m}`)
  const glossary = walk('components/overhaul/glossary/data.ts')
  for (const m of ['lib/glossary/index.ts', 'lib/glossary.gen.ts']) {
    assert.ok(glossary.has(m), `components/overhaul/glossary/data.ts no longer reaches ${m}`)
  }
})

test('no client module reaches the blog or glossary data, which carry the whole corpus', () => {
  const reaches = []
  for (const c of clients) {
    const from = walk(c)
    for (const m of SERVER_ONLY) if (from.has(m)) reaches.push(chain(from, m))
  }
  assert.deepEqual(reaches, [], 'a client module imports server data: read it in a server component and pass the fields down as props')
})
