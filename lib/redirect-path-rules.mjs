/**
 * Whether a redirect `from`/`to` value is safe to spread into next.config.ts's
 * `redirects()` array.
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1 P1-a
 *
 * 🔴 FOUND BY VERIFICATION, 07-10-2026. scripts/generate-redirects.ts used to denylist a
 * handful of characters (whitespace, `<>"'\`, `?`, `#`) and let everything else through.
 * A redirect whose `from` or `to` contains a character with syntax meaning to
 * path-to-regexp — `*` `+` `(` `)` `{` `}` `:` `\` — sails past that denylist, is written
 * into the committed lib/redirects.gen.ts, and reaches Next's OWN build-time redirect
 * validator (`checkCustomRoutes`, node_modules/next/dist/lib/load-custom-routes.js, via
 * `tryToParsePath` → path-to-regexp) unguarded. That validator calls `process.exit(1)` —
 * a hard, CMS-content-driven build failure this feature exists to prevent, reached
 * through next.config.ts rather than this script. An ALLOWLIST closes it: everything
 * this function accepts is, by construction, inert to path-to-regexp.
 *
 * 🔴 EXTRACTED PURE, ZERO IMPORTS, DELIBERATELY. `.woodpecker/test.yml` runs `npm test`
 * with no `npm ci` and no registry credential, so a `.ts` file (which needs `tsx` to
 * execute) cannot be imported by the bare `node --test` these tests run under — only a
 * dependency-free `.mjs` module can be. scripts/generate-redirects.ts (a `.ts` script run
 * via `tsx` in `npm run prebuild`) and `__tests__/content-repair-redirect-path.test.mjs`
 * (plain `node --test`) both import this file so they can never silently disagree about
 * what counts as a safe path — the same pattern `lib/recovery-copy-rules.mjs` uses.
 */

/**
 * Letters and digits are matched by Unicode PROPERTY, not `[A-Za-z0-9]` — a redirect
 * typed with real non-ASCII characters (rather than percent-encoded ones) must not be
 * skipped as "unsafe" when it is merely non-English. `%` covers the percent-encoded
 * case. Everything path-to-regexp treats as syntax — `*` `+` `(` `)` `{` `}` `:` `\` —
 * plus whitespace, quotes, angle brackets, `?` and `#` (already excluded by this being
 * an allowlist, not denylist) — is absent from the set below.
 */
const SAFE_PATH = /^\/[\p{L}\p{N}\-._~%/]*$/u

export function validRedirectPath(p) {
  if (typeof p !== 'string' || p.length === 0) return false
  if (!p.startsWith('/')) return false
  if (p.startsWith('//')) return false
  if (p.length > 200) return false
  return SAFE_PATH.test(p)
}
