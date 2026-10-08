import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  sha8,
  buildDocument,
  mergeLastGood,
  buildIndexKind,
  buildIndex,
  documentsToUpload,
  kindChanged,
  pagePurgeUrls,
  batch,
} from '../lib/cms/publisher-core.mjs'

/**
 * Real-execution tests (WEB-26) — this module is zero-dependency, so unlike almost
 * everything else in this feature it CAN run under CI's no-`npm ci` `node:test` step.
 * See lib/cms/publisher-core.mjs's own header for why.
 */

test('sha8 is the first 8 hex chars of sha256, deterministic for the same bytes', () => {
  const a = sha8('{"term":"blind index"}')
  const b = sha8('{"term":"blind index"}')
  assert.equal(a, b)
  assert.equal(a.length, 8)
  assert.match(a, /^[0-9a-f]{8}$/)
  assert.notEqual(a, sha8('{"term":"opaque"}'))
})

test('buildDocument serializes with JSON.stringify exactly — no pretty-printing — so an unchanged item reproduces the same path', () => {
  const item = { slug: 'opaque', term: 'OPAQUE', short: 'An asymmetric PAKE.' }
  const doc1 = buildDocument('ciphera-net', 'glossary', 'opaque', item)
  const doc2 = buildDocument('ciphera-net', 'glossary', 'opaque', { ...item })
  assert.equal(doc1.bytes, JSON.stringify(item))
  assert.equal(doc1.path, doc2.path, 're-publishing the identical item must produce the identical path')
  assert.equal(doc1.path, `content/ciphera-net/glossary/opaque.${doc1.sha8}.json`)

  // Negative control: a real content change MUST change the path.
  const doc3 = buildDocument('ciphera-net', 'glossary', 'opaque', { ...item, short: 'edited' })
  assert.notEqual(doc1.path, doc3.path, 'an edited item must get a new path — that is the whole point of content addressing')
})

test('mergeLastGood keeps a skipped-but-still-published item from the previous index, and drops a real deletion', () => {
  const previousItems = { a: 'content/x/glossary/a.11111111.json', b: 'content/x/glossary/b.22222222.json' }
  const newItems = { a: 'content/x/glossary/a.11111111.json' } // 'b' was skipped this pass
  const publishedKeys = ['a', 'b'] // WordPress still publishes both

  const merged = mergeLastGood(publishedKeys, newItems, previousItems)
  assert.deepEqual(merged, previousItems, 'a still-published-but-skipped item must keep its last-good document')

  // Negative control: if WordPress no longer publishes 'b' at all (a real deletion,
  // not a skip), it must NOT be resurrected from the previous index.
  const mergedAfterDeletion = mergeLastGood(['a'], newItems, previousItems)
  assert.deepEqual(mergedAfterDeletion, { a: previousItems.a }, 'a genuine deletion must never be kept as "last-good"')
})

test('mergeLastGood with no previous index just returns the new items', () => {
  const merged = mergeLastGood(['a'], { a: 'content/x/glossary/a.aaaaaaaa.json' }, null)
  assert.deepEqual(merged, { a: 'content/x/glossary/a.aaaaaaaa.json' })
})

test('buildIndexKind and buildIndex assemble the exact schema-1 shape', () => {
  const kind = buildIndexKind(1, '2026-10-08T14:59:12', { opaque: 'content/ciphera-net/glossary/opaque.aaaaaaaa.json' })
  assert.deepEqual(kind, {
    schema: 1,
    watermark: '2026-10-08T14:59:12',
    count: 1,
    items: { opaque: 'content/ciphera-net/glossary/opaque.aaaaaaaa.json' },
  })

  const index = buildIndex({
    site: 'ciphera-net',
    publishedAt: '2026-10-08T15:00:00Z',
    kinds: { glossary: kind },
    repairs: [],
    build: 'abc1234',
  })
  assert.equal(index.version, 1)
  assert.equal(index.site, 'ciphera-net')
  assert.equal(index.watermark, '2026-10-08T14:59:12', 'the top-level watermark must be the max across every kind')
  assert.deepEqual(index.publisher, { build: 'abc1234' })
})

test('buildIndex watermark is the MAX across kinds, not the first or the last', () => {
  const index = buildIndex({
    site: 'ciphera-net',
    publishedAt: 'x',
    kinds: {
      a: buildIndexKind(1, '2026-01-01T00:00:00', {}),
      b: buildIndexKind(1, '2026-09-01T00:00:00', {}),
      c: buildIndexKind(1, '2026-05-01T00:00:00', {}),
    },
    build: 'x',
  })
  assert.equal(index.watermark, '2026-09-01T00:00:00')
})

test('documentsToUpload is a pure set difference on PATHS, never a per-field diff', () => {
  const previousItems = { a: 'content/x/glossary/a.11111111.json' }
  const newItems = {
    a: 'content/x/glossary/a.11111111.json', // unchanged — same path
    b: 'content/x/glossary/b.22222222.json', // new key
  }
  const toUpload = documentsToUpload(previousItems, newItems)
  assert.deepEqual(toUpload, [{ key: 'b', path: 'content/x/glossary/b.22222222.json' }])
})

test('documentsToUpload with no previous index uploads everything', () => {
  const newItems = { a: 'content/x/glossary/a.11111111.json' }
  assert.deepEqual(documentsToUpload(null, newItems), [{ key: 'a', path: newItems.a }])
  assert.deepEqual(documentsToUpload(undefined, newItems), [{ key: 'a', path: newItems.a }])
})

test('kindChanged is false for the identical set, true for an added, removed, or edited (re-hashed) item', () => {
  const previousItems = { a: 'content/x/glossary/a.11111111.json', b: 'content/x/glossary/b.22222222.json' }
  assert.equal(kindChanged(previousItems, { ...previousItems }), false)
  assert.equal(kindChanged(previousItems, { a: previousItems.a }), true, 'a removed key must register as changed')
  assert.equal(kindChanged(previousItems, { ...previousItems, c: 'content/x/glossary/c.33333333.json' }), true, 'an added key must register as changed')
  assert.equal(
    kindChanged(previousItems, { ...previousItems, a: 'content/x/glossary/a.99999999.json' }),
    true,
    'an edited (re-hashed) item at the SAME key must register as changed'
  )
})

test('pagePurgeUrls joins the origin with each pattern, preserving prefix-purge asterisks', () => {
  const urls = pagePurgeUrls('https://ciphera.net', ['/glossary*', '/sitemap.xml'])
  assert.deepEqual(urls, ['https://ciphera.net/glossary*', 'https://ciphera.net/sitemap.xml'])
})

test('batch splits into chunks of at most `size`, preserving order, and never drops an item', () => {
  const items = Array.from({ length: 5 }, (_, i) => i)
  assert.deepEqual(batch(items, 2), [[0, 1], [2, 3], [4]])
  assert.deepEqual(batch(items, 200), [items], 'fewer items than the batch size must stay in one batch')
  assert.deepEqual(batch([], 50), [], 'an empty input must produce zero batches, not one empty batch')
})
