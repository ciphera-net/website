/**
 * Which content kinds this instance serves at REQUEST time, from the CDN, instead of
 * from the build-time seed baked into the image.
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1.3a
 *
 * 🔴 A CONSTANT IN CODE, DEFAULT EMPTY THIS ROUND (WEB-26). Rolling glossary out is
 * changing this one line and shipping it — no env var needs to exist anywhere for that.
 * The env override exists for Phase 5's per-kind rollout WITHOUT a redeploy (flip a kind
 * on a live Magic Containers app, watch it, flip it back by removing the var) — see
 * `Public/docs/data/08-10-2026-web26-discovery/ciphera-website.md` §8 for why that is
 * the ONLY way to introduce a new MC runtime toggle: `deploy.yml`'s bunny-push step only
 * round-trips the MC app's EXISTING `environmentVariables`, so the var has to already
 * exist there (set by hand, once) before any pipeline run will preserve it.
 *
 * ⚠️ NOT a NEXT_PUBLIC_* var — this is a server-only read, same shape as
 * `WORDPRESS_GRAPHQL_URL` in `app/preview/[slug]/page.tsx`, deliberately outside
 * `lib/env.ts`'s Zod/DefinePlugin pipeline (that pipeline is for values Next.js must
 * inline into the client bundle at build time; this one is read fresh on every request
 * and must NOT be baked into the bundle, or a kind could never be rolled out without a
 * new image).
 */

/**
 * Kinds served at request time from the CDN (design §4.1.3a). 🔑 A CODE CONSTANT, NOT ONLY AN
 * ENV VAR: Next decides static vs dynamic at BUILD time, and the seam's no-store fetch is what
 * makes a kind's routes dynamic, so a kind must be on in the build that serves it (measured:
 * with 'glossary' on, /glossary, /glossary/[slug], /sitemap.xml build as ƒ). And Magic
 * Containers' env cannot gain a variable through the pipeline. Rolling a kind back is removing
 * it here; the seed in the image covers any CDN failure meanwhile.
 */
const DEFAULT_RUNTIME_KINDS: readonly string[] = ['glossary', 'blog', 'route', 'redirect', 'menu', 'page']

function parseKinds(raw: string | undefined): Set<string> {
  if (!raw) return new Set(DEFAULT_RUNTIME_KINDS)
  const kinds = raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
  return new Set(kinds.length > 0 ? kinds : DEFAULT_RUNTIME_KINDS)
}

/** `CMS_RUNTIME_KINDS=glossary,blog` overrides the default; unset/empty keeps it off. */
export const CMS_RUNTIME_KINDS: Set<string> = parseKinds(process.env.CMS_RUNTIME_KINDS)

export function isRuntimeKind(kind: string): boolean {
  return CMS_RUNTIME_KINDS.has(kind)
}

/**
 * The content zone's pull zone — `content/<site>/...` documents and each site's
 * `index.json` live here (§4.1.3a "Zone"). Overridable for local/staging reads against
 * a different zone; the production default is the live `ciphera-cms-content` pull zone.
 */
export const CONTENT_BASE = process.env.CONTENT_BASE ?? 'https://ciphera-cms-content.b-cdn.net'

/** This site's own key in every `content/<site>/...` path (§4.1.3a "Paths"). */
export const SITE_KEY = 'ciphera-net'

/** §4.1.3's "Each instance caches the index for 15s in memory" — matches the index
 * object's own `max-age=15` so a cache refresh and the edge's own expiry agree. */
export const INDEX_CACHE_MS = 15_000

/** §4.1.3a "Publisher… `POST /run`… 3 s timeout each" — applies to every CDN read here too. */
export const FETCH_TIMEOUT_MS = 3_000
