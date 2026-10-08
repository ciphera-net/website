/**
 * The pure parts of scripts/cms-publisher.ts — document paths, content hashing, index
 * assembly, the upload/purge diff, and the last-good merge. No fetch, no fs, no HTTP.
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1.3, §4.1.3a
 *
 * 🔑 EXTRACTED AS A ZERO-DEPENDENCY .mjs, SAME REASON AS lib/glossary-category-rules.mjs
 * AND lib/redirect-path-rules.mjs: `npm test` runs with no `npm ci` and no network
 * (test.yml), so the one piece of this feature that CAN be covered by a real,
 * execution-based `node:test` run — the content-addressing and diff arithmetic, which
 * decides what actually gets written to the CDN — is kept free of TypeScript syntax and
 * of every other module in this feature, so it is importable by both
 * `scripts/cms-publisher.ts` (via tsx) and `__tests__/cms-publisher-core.test.mjs`
 * (via plain node) without either one needing `node_modules`.
 */
import { createHash } from 'node:crypto'

/** First 8 hex chars of sha256 — §4.1.3a "Paths": "sha8 = the first 8 hex of sha256 of
 * the exact document bytes". */
export function sha8(bytes) {
  return createHash('sha256').update(bytes, 'utf-8').digest('hex').slice(0, 8)
}

/**
 * One item → its exact document bytes, its content-addressed path, and its hash.
 * `bytes` is `JSON.stringify(item)` — "exactly as the site's own GlossaryTerm" (the
 * computed task's own words): no pretty-printing, so the same item always serializes to
 * the same bytes and therefore the same path, and a byte-identical re-publish uploads
 * nothing new.
 */
export function buildDocument(site, kind, key, item) {
  const bytes = JSON.stringify(item)
  const hash = sha8(bytes)
  return { key, path: `content/${site}/${kind}/${key}.${hash}.json`, bytes, sha8: hash }
}

/**
 * An item WordPress still publishes but the transform SKIPPED this pass (no safe
 * repair existed — a transient bad row, not a deletion) keeps the previous index's
 * document for that key, rather than vanishing from the live site over one bad read.
 * `publishedKeys` is every key the transform was GIVEN (the full published set, before
 * skips) — not every key it produced — so a genuine WordPress deletion (a key that is
 * no longer published at all) is correctly left out of both `newItems` and this merge.
 */
export function mergeLastGood(publishedKeys, newItems, previousItems) {
  const merged = { ...newItems }
  if (previousItems) {
    for (const key of publishedKeys) {
      if (!(key in merged) && key in previousItems) merged[key] = previousItems[key]
    }
  }
  return merged
}

/**
 * Assemble one kind's index entry (§4.1.3a "Index (schema 1)").
 * `items` maps key -> document path; `watermark` is the max `modified` across the
 * items this pass actually resolved (the caller computes it — this function only
 * assembles the shape, since a last-good item's watermark is its OWN modified date,
 * not necessarily the newest one in this pass).
 */
export function buildIndexKind(schema, watermark, items) {
  return { schema, watermark, count: Object.keys(items).length, items }
}

/**
 * The whole per-site index (§4.1.3a). `kinds` is `{ [kind]: { schema, watermark,
 * count, items } }` as built by `buildIndexKind`. The top-level `watermark` is the
 * max across every kind's own watermark, never computed from the raw items again —
 * one definition, so a kind added later cannot disagree with this about what "newest"
 * means.
 */
export function buildIndex({ site, publishedAt, kinds, repairs = [], build }) {
  const watermark = Object.values(kinds).map((k) => k.watermark).filter(Boolean).sort().at(-1) ?? ''
  return {
    version: 1,
    site,
    published_at: publishedAt,
    watermark,
    kinds,
    repairs,
    publisher: { build },
  }
}

/**
 * Which of this kind's new item paths are not already named anywhere in the previous
 * index — i.e. which documents actually need uploading (§4.1.3a Publisher: "upload the
 * documents the index does not already name"). Content addressing means an unchanged
 * item's path is byte-identical to its previous path, so this is a plain set
 * difference, never a per-field comparison.
 */
export function documentsToUpload(previousItems, newItems) {
  const previousPaths = new Set(Object.values(previousItems ?? {}))
  return Object.entries(newItems)
    .filter(([, path]) => !previousPaths.has(path))
    .map(([key, path]) => ({ key, path }))
}

/** Did this kind's published set change at all — same keys, same paths, any order? */
export function kindChanged(previousItems, newItems) {
  const prev = previousItems ?? {}
  if (Object.keys(prev).length !== Object.keys(newItems).length) return true
  for (const [key, path] of Object.entries(newItems)) {
    if (prev[key] !== path) return true
  }
  return false
}

/**
 * The page URLs to purge for one kind that changed (§4.1.3a Publisher: "the changed
 * pages (prefix purges, plus the list pages, sitemap.xml, feed.xml)"). Each entry in
 * `pagePatterns` is a path relative to `siteOrigin`, e.g. `/glossary*`; a trailing `*`
 * is a prefix purge, which is what the uploader's `/purge` allows.
 */
export function pagePurgeUrls(siteOrigin, pagePatterns) {
  return pagePatterns.map((p) => `${siteOrigin}${p}`)
}

/**
 * Batches an array into chunks of at most `size` — the uploader's `/content` accepts
 * 1–200 writes per call (§4.1.3a "Uploader").
 */
export function batch(items, size) {
  const out = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}
