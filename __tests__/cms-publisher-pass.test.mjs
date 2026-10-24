import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * scripts/cms-publisher.ts's pass, source-level (CI runs `npm test` with no `npm ci`, and the publisher reads its
 * configuration from the environment at load, so nothing here runs it): what a pass does when it cannot read the
 * current index, and when a CMS slug is not a key the uploader would store. Review of 24-10-2026.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

test('scripts/cms-publisher.ts: a failed read of the current index publishes nothing; only a 404 is "empty" (24-10-2026)', () => {
  const src = readFileSync(join(root, 'scripts/cms-publisher.ts'), 'utf-8')
  const start = src.indexOf('previousIndex = await getContentIndex(SITE)')
  assert.ok(start > 0)
  const handler = src.slice(start, src.indexOf('const kinds: Record<string, ContentIndexKind>', start))
  assert.match(handler, /catch \(e\) \{[\s\S]*metrics\.failuresTotal \+= 1[\s\S]*await pushMetrics\(\)[\s\S]*return\s*\n\s*\}/, 'the catch must count a failure and return before any kind is published')
  assert.doesNotMatch(src, /proceeding as if empty/, 'a failed read must never be taken for an empty index again')
})

test('scripts/cms-publisher.ts leaves out, by name, any glossary or blog item whose key the uploader would refuse (24-10-2026)', () => {
  const src = readFileSync(join(root, 'scripts/cms-publisher.ts'), 'utf-8')
  assert.match(src, /function addressable\(kind: string, key: string\): boolean \{\n  if \(isContentKey\(key\)\) return true\n  log\(/)
  assert.match(src, /for \(const term of terms\) \{\n    if \(!addressable\('glossary', term\.slug\)\) continue\n    const doc = buildDocument\(SITE, 'glossary'/)
  assert.match(src, /for \(const post of posts\) \{\n    if \(!addressable\('blog', post\.slug\)\) continue\n    const doc = buildDocument\(SITE, 'blog'/)
})
