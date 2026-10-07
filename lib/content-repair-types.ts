/**
 * The shape of one content-repair record (P1-a, "repair, don't refuse").
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1 P1-a
 *
 * 🔴 NO CMS CONTENT STATE MAY FAIL THIS SITE'S BUILD. Every fail()/process.exit the
 * four generate-*.ts scripts (and the transforms they call) used to raise on a bad
 * WordPress row now does one of three things instead, and records which:
 *
 *   - repaired — the field shipped with a safe substitute value (a truncated
 *     description, a dropped broken image, a fallback date, …).
 *   - skipped  — the item itself could not ship at all (no safe repair existed —
 *     no slug, no title, a duplicate key), so it was left out and the rest of the
 *     build proceeded.
 *   - flagged  — the item shipped UNCHANGED, but something about it needs a human's
 *     attention (an honesty-rule violation, a repo-hardcoded link to a term that is
 *     no longer published). The CMS-side review queue (P1-c) and Prometheus own
 *     acting on these; this ledger only records that they happened.
 *
 * `ref` identifies the ITEM, never a person: a slug, a path, a redirect's `from`, or
 * (when nothing else survived) a WordPress `databaseId`.
 */
export type ContentRepairAction = 'repaired' | 'skipped' | 'flagged'

export interface ContentRepairEntry {
  /** The content type the item came from, e.g. 'blog-post', 'glossary-term', 'route-seo', 'redirect'. */
  type: string
  /** The item's own key — slug, path, or a WordPress databaseId. Never a person. */
  ref: string
  /** The field the repair/skip/flag applies to. */
  field: string
  action: ContentRepairAction
  detail: string
}
