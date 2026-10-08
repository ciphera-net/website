/**
 * cms-publisher — the publish-time counterpart to the build-time generate-*.ts
 * scripts. Runs in-cluster as its own Deployment, `cms-publisher-ciphera-net`
 * (§4.1.3a "Publisher").
 *
 * Design: Public/docs/plans/07-10-2026-cms-made-easy-design.md §4.1.3, §4.1.3a
 *
 * 🔑 THE SAME TRANSFORM AS THE BUILD, REUSED, NOT RE-WRITTEN. `lib/cms/glossary-build.ts`
 * is the ONE place the P1-a repair/skip/flag rules live; `scripts/generate-glossary.ts`
 * calls it to produce the build-time seed, this script calls it to produce the
 * publish-time CDN documents. They cannot disagree about what a valid term is, because
 * there is only one function deciding that.
 *
 * 🔴 WHO SIGNALS THIS, AND HOW (the media mirror's own device —
 * `Kubernetes/workloads/wordpress/media-mirror.py`, copied exactly): WordPress's
 * `ciphera-content-signal.php` fires a fire-and-forget `POST /run` on
 * `transition_post_status`/`before_delete_post`, carrying `X-Ciphera-Status-Secret` and
 * no body — "there is nothing a caller is allowed to say beyond 'now'." This process
 * never reads WordPress's write side and holds no WordPress credential of its own; it
 * only ever reads the PUBLISHED GraphQL surface, anonymously, same as the build.
 *
 * 🔴 THIS PROCESS HOLDS NO CDN OR BUNNY CREDENTIAL EITHER (§4.1.3 "Security"). Every
 * write goes through `ciphera-uploader`'s `kind=content`/`kind=purge` surfaces, which
 * hold the one Bunny credential in the whole estate that can write this zone.
 */
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { timingSafeEqual } from 'node:crypto'
import { buildGlossary, type WpGlossaryTerm } from '../lib/cms/glossary-build'
import { buildBlogPosts } from '../lib/cms/blog-build'
import { buildRouteSeo, routeKey, type RouteSeoNode } from '../lib/cms/route-build'
import { buildRedirects, type RedirectNode } from '../lib/cms/redirect-build'
import { WP_POST_FIELDS, type WpNode } from '../lib/blog-transform'
import { getContentIndex, type ContentIndex, type ContentIndexKind } from '../lib/cms/content-client'
import { CONTENT_BASE } from '../lib/cms/runtime-config'
import {
  buildDocument,
  buildIndex,
  buildIndexKind,
  batch,
  documentsToUpload,
  kindChanged,
  mergeLastGood,
  pagePurgeUrls,
} from '../lib/cms/publisher-core.mjs'

// ── Config (§4.1.3a "Publisher… Env:") ──────────────────────────────────────────────
const SITE = process.env.SITE ?? 'ciphera-net'
const WP = process.env.WORDPRESS_GRAPHQL_URL ?? 'http://wordpress.apps.svc.cluster.local/graphql'
const UPLOADER_URL = process.env.UPLOADER_URL ?? 'http://ciphera-uploader.apps.svc.cluster.local:8080'
const SITE_ORIGIN = process.env.SITE_ORIGIN ?? 'https://ciphera.net'
const STATUS_SECRET = process.env.STATUS_SECRET ?? ''
const PUSHGATEWAY = process.env.PUSHGATEWAY ?? 'http://pushgateway.monitoring.svc.cluster.local:9091'
const PUBLISH_KINDS = new Set((process.env.PUBLISH_KINDS ?? 'glossary').split(',').map((k) => k.trim()).filter(Boolean))
const SWEEP_SECONDS = Number(process.env.SWEEP_SECONDS ?? 120)
const PORT = Number(process.env.PORT ?? 8080)
const DRY_RUN = process.env.DRY_RUN === '1'
const BUILD = (process.env.CIPHERA_BUILD_SHA ?? 'unknown').slice(0, 7)
const PURGE_SECOND_WAIT_MS = 20_000
const UPLOAD_BATCH_SIZE = 100
const WP_FETCH_TIMEOUT_MS = 15_000
/** The ASSET cdn (cdn.ciphera.net) — only used by 'blog', to rewrite
 * wp-content/uploads/... references, same default scripts/generate-blog-posts.ts uses. */
const ASSET_CDN = process.env.NEXT_PUBLIC_CDN_URL ?? 'https://cdn.ciphera.net/website'

function log(msg: string): void {
  console.log(`[cms-publisher:${SITE}] ${msg}`)
}

// ── Metrics (§4.1.3a "Publisher… Metrics") — best-effort, never fails a pass ────────
const metrics = {
  lastSuccessTimestamp: 0,
  lastPublishTimestamp: 0,
  items: new Map<string, number>(),
  failuresTotal: 0,
}

async function pushMetrics(): Promise<void> {
  const lines: string[] = []
  lines.push(`# TYPE cms_publisher_last_success_timestamp gauge`)
  lines.push(`cms_publisher_last_success_timestamp{site="${SITE}"} ${metrics.lastSuccessTimestamp}`)
  lines.push(`# TYPE cms_publisher_last_publish_timestamp gauge`)
  lines.push(`cms_publisher_last_publish_timestamp{site="${SITE}"} ${metrics.lastPublishTimestamp}`)
  lines.push(`# TYPE cms_publisher_items gauge`)
  for (const [kind, count] of metrics.items) {
    lines.push(`cms_publisher_items{site="${SITE}",kind="${kind}"} ${count}`)
  }
  lines.push(`# TYPE cms_publisher_failures_total counter`)
  lines.push(`cms_publisher_failures_total{site="${SITE}"} ${metrics.failuresTotal}`)
  const body = lines.join('\n') + '\n'
  try {
    await fetch(`${PUSHGATEWAY}/metrics/job/cms_publisher/site/${SITE}`, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5_000),
    })
  } catch (e) {
    // 🔑 "metrics must never break a pass" (same judgement as ciphera-uploader's push()).
    log(`metrics push failed (ignored): ${(e as Error).message}`)
  }
}

// ── The uploader client (§4.1.3a "Uploader") — the only two capabilities it needs ──
async function uploaderContent(writes: { path: string; body: string }[]): Promise<void> {
  if (writes.length === 0) return
  if (DRY_RUN) {
    log(`DRY_RUN: would upload ${writes.length} document(s): ${writes.map((w) => w.path).join(', ')}`)
    return
  }
  for (const chunk of batch(writes, UPLOAD_BATCH_SIZE)) {
    const res = await fetch(`${UPLOADER_URL}/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ writes: chunk }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) throw new Error(`uploader /content returned HTTP ${res.status} for a batch of ${chunk.length}`)
  }
}

async function uploaderPurge(urls: string[]): Promise<void> {
  if (urls.length === 0) return
  if (DRY_RUN) {
    log(`DRY_RUN: would purge: ${urls.join(', ')}`)
    return
  }
  const res = await fetch(`${UPLOADER_URL}/purge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
    signal: AbortSignal.timeout(30_000),
  })
  if (!res.ok) throw new Error(`uploader /purge returned HTTP ${res.status} for ${urls.length} url(s)`)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── WordPress read (anonymous, published-only — same query as generate-glossary.ts) ─
const GLOSSARY_QUERY = `{
  glossaryTerms(first: 200, where: { status: PUBLISH }) {
    nodes {
      databaseId
      slug title content modifiedGmt
      cipheraDefinition cipheraRelated cipheraSee
      cipheraTitle cipheraDescription cipheraCanonical
      cipheraNoindex cipheraNofollow
      glossaryCategories { nodes { name slug cipheraOrder } }
      routeSites { nodes { slug } }
    }
  }
}`

async function fetchGlossaryNodes(): Promise<WpGlossaryTerm[]> {
  const res = await fetch(WP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: GLOSSARY_QUERY }),
    signal: AbortSignal.timeout(WP_FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`cannot reach WordPress: HTTP ${res.status}`)
  const body = await res.json()
  if (body.errors?.length) throw new Error(`GraphQL errors: ${JSON.stringify(body.errors)}`)
  const allNodes: WpGlossaryTerm[] = body?.data?.glossaryTerms?.nodes ?? []
  return allNodes.filter((n) => (n.routeSites?.nodes ?? []).some((t) => t.slug === SITE))
}

async function wpQuery<T>(query: string): Promise<T> {
  const res = await fetch(WP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(WP_FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`cannot reach WordPress: HTTP ${res.status}`)
  const body = await res.json()
  if (body.errors?.length) throw new Error(`GraphQL errors: ${JSON.stringify(body.errors)}`)
  return body.data as T
}

// 🔑 Reuses WP_POST_FIELDS from lib/blog-transform.ts — the SAME query shape
// scripts/generate-blog-posts.ts sends, so there is one field list, not two that drift.
const BLOG_QUERY = `{
  blogPosts(first: 200, where: { status: PUBLISH }) {
    nodes { ${WP_POST_FIELDS} }
  }
}`

const ROUTE_QUERY = `{
  routeStubs(first: 100, where: { status: PUBLISH }) {
    nodes {
      databaseId cipheraPath cipheraTitle cipheraDescription cipheraCanonical
      cipheraOgTitle cipheraOgDescription cipheraOgImage
      cipheraTwitterTitle cipheraTwitterDescription
      cipheraNoindex cipheraNofollow modifiedGmt
      routeSites { nodes { slug } }
    }
  }
}`

const REDIRECT_QUERY = `{
  redirects(first: 200, where: { status: PUBLISH }) {
    nodes { databaseId cipheraFrom cipheraTo modifiedGmt routeSites { nodes { slug } } }
  }
}`

function mine<T extends { routeSites?: { nodes?: { slug: string }[] } }>(nodes: T[]): T[] {
  return nodes.filter((n) => (n.routeSites?.nodes ?? []).some((t) => t.slug === SITE))
}

// ── One kind's publish logic ─────────────────────────────────────────────────────────
interface KindPublishResult {
  indexKind: ContentIndexKind
  toUpload: { path: string; body: string }[]
  changed: boolean
  pagePatterns: string[]
}

async function publishGlossary(previousIndex: ContentIndex | null): Promise<KindPublishResult> {
  const nodes = await fetchGlossaryNodes()
  const publishedKeys = nodes.map((n) => n.slug).filter(Boolean)
  const { terms, watermark } = buildGlossary(nodes)

  const docsByKey: Record<string, { path: string; bytes: string }> = {}
  for (const term of terms) {
    const doc = buildDocument(SITE, 'glossary', term.slug, term)
    docsByKey[term.slug] = { path: doc.path, bytes: doc.bytes }
  }
  const newItems = Object.fromEntries(Object.entries(docsByKey).map(([k, v]) => [k, v.path]))

  const previousItems = previousIndex?.kinds?.glossary?.items ?? null
  const mergedItems = mergeLastGood(publishedKeys, newItems, previousItems)

  const toUploadRefs = documentsToUpload(previousItems, mergedItems)
  const toUpload = toUploadRefs
    .map(({ key, path }) => {
      // A last-good item's bytes are not held by this pass (it came from the previous
      // index, already on the CDN) — only items THIS pass actually produced need a body.
      const doc = docsByKey[key]
      return doc && doc.path === path ? { path, body: doc.bytes } : null
    })
    .filter((w): w is { path: string; body: string } => w !== null)

  const changed = kindChanged(previousItems, mergedItems)
  const indexKind = buildIndexKind(1, watermark, mergedItems)

  return { indexKind, toUpload, changed, pagePatterns: ['/glossary*', '/sitemap.xml'] }
}

/**
 * 🔑 THE SHRINK-GUARD ANALOGUE (WEB-26 round 2). generate-blog-posts.ts's build-time
 * shrink guard fetches a separate /sys/seo-state; this publisher already HOLDS the
 * previous pass's own count (`previousIndex`), which is the more honest comparison —
 * it is exactly what this pass is about to overwrite, not a second, possibly-stale
 * source. Throwing here is caught by runPass()'s existing "a failed kind keeps its
 * previous index entry" path (§4.1.3a) — the SAME mechanism, reused, not a new one.
 */
function assertNoCollapse(kind: string, previousCount: number | undefined, newCount: number): void {
  if (previousCount === undefined) return
  const shortfall = previousCount - newCount
  const collapse = shortfall > Math.max(2, Math.floor(previousCount * 0.25))
  if (collapse) {
    throw new Error(
      `${kind}: this pass would publish ${newCount} item(s); the previous index held ${previousCount} — ` +
        `${shortfall} gone at once, too many to be ordinary editing. Keeping the previous index entry.`
    )
  }
}

async function publishBlog(previousIndex: ContentIndex | null): Promise<KindPublishResult> {
  const data = await wpQuery<{ blogPosts: { nodes: WpNode[] } }>(BLOG_QUERY)
  const nodes = data.blogPosts?.nodes ?? []
  const publishedKeys = nodes.map((n) => (n.slug ?? '').trim()).filter(Boolean)
  const { posts, watermark } = buildBlogPosts(nodes, ASSET_CDN)

  const previousItems = previousIndex?.kinds?.blog?.items ?? null
  assertNoCollapse('blog', previousIndex?.kinds?.blog?.count, posts.length)

  const docsByKey: Record<string, { path: string; bytes: string }> = {}
  for (const post of posts) {
    const doc = buildDocument(SITE, 'blog', post.slug, post)
    docsByKey[post.slug] = { path: doc.path, bytes: doc.bytes }
  }
  const newItems = Object.fromEntries(Object.entries(docsByKey).map(([k, v]) => [k, v.path]))
  const mergedItems = mergeLastGood(publishedKeys, newItems, previousItems)

  const toUpload = documentsToUpload(previousItems, mergedItems)
    .map(({ key, path }) => {
      const doc = docsByKey[key]
      return doc && doc.path === path ? { path, body: doc.bytes } : null
    })
    .filter((w): w is { path: string; body: string } => w !== null)

  const changed = kindChanged(previousItems, mergedItems)
  const indexKind = buildIndexKind(1, watermark, mergedItems)

  // §4.1.3a item 4: blog -> /blog*, /feed.xml, /sitemap.xml.
  return { indexKind, toUpload, changed, pagePatterns: ['/blog*', '/feed.xml', '/sitemap.xml'] }
}

type RouteStubWireNode = RouteSeoNode & { routeSites?: { nodes?: { slug: string }[] } }

async function publishRoute(previousIndex: ContentIndex | null): Promise<KindPublishResult> {
  const data = await wpQuery<{ routeStubs: { nodes: RouteStubWireNode[] } }>(ROUTE_QUERY)
  const nodes = mine(data.routeStubs?.nodes ?? [])
  const built = buildRouteSeo(nodes)

  const previousItems = previousIndex?.kinds?.route?.items ?? null

  // Each path's content-addressed key is its slugified form (§4.1.3a "Paths"). Two
  // distinct live paths colliding on one key would silently let one route's document
  // overwrite the other's — pathologically unlikely across today's 14 routes (verified
  // unique), but refused loudly rather than risked: the whole kind fails this pass
  // (previous index entry kept), same as any other publish failure.
  const keyToPath = new Map<string, string>()
  for (const p of Object.keys(built.routes)) {
    const key = routeKey(p)
    const existing = keyToPath.get(key)
    if (existing) throw new Error(`route: paths "${existing}" and "${p}" both slugify to key "${key}" — refusing to publish`)
    keyToPath.set(key, p)
  }

  const docsByKey: Record<string, { path: string; bytes: string }> = {}
  for (const [key, path] of keyToPath) {
    const doc = buildDocument(SITE, 'route', key, built.routes[path])
    docsByKey[key] = { path: doc.path, bytes: doc.bytes }
  }
  const newItems = Object.fromEntries(Object.entries(docsByKey).map(([k, v]) => [k, v.path]))
  // No last-good merge here: an item WordPress stops publishing a stub for is simply a
  // route with no stub — seoForAsync()'s own fallback (the page's in-code metadata) is
  // the correct outcome, not resurrecting a stale CDN document (unlike blog/glossary,
  // where the ITEM itself would otherwise vanish from the site).
  const mergedItems = newItems

  const toUpload = documentsToUpload(previousItems, mergedItems)
    .map(({ key, path }) => {
      const doc = docsByKey[key]
      return doc && doc.path === path ? { path, body: doc.bytes } : null
    })
    .filter((w): w is { path: string; body: string } => w !== null)

  const changed = kindChanged(previousItems, mergedItems)
  const indexKind = buildIndexKind(1, built.watermark, mergedItems)

  // §4.1.3a item 4: route -> each CHANGED path, exact + a `*` prefix for its _rsc
  // variants (Next's React Server Component payload fetches vary the query string).
  // ⚠️ KNOWN LIMITATION: the index stores key → document path, not key → original page
  // path, so a stub that WordPress stops publishing entirely cannot be named here (its
  // key has no path to recover once it is gone from `built.routes`). That path's edge
  // cache self-heals within the existing 300s HTML TTL — the same bound every other
  // un-purged edit already relied on before this kind existed — so this purges every
  // CURRENTLY STUBBED path whose document actually changed, which is the common case
  // (an edit, not an unpublish).
  const changedPaths = Object.keys(built.routes).filter((p) => (previousItems ?? {})[routeKey(p)] !== mergedItems[routeKey(p)])
  const pagePatterns = changedPaths.flatMap((p) => [p, `${p}*`])

  return { indexKind, toUpload, changed, pagePatterns }
}

type RedirectWireNode = RedirectNode & { routeSites?: { nodes?: { slug: string }[] } }

async function publishRedirect(previousIndex: ContentIndex | null): Promise<KindPublishResult> {
  const data = await wpQuery<{ redirects: { nodes: RedirectWireNode[] } }>(REDIRECT_QUERY)
  const nodes = mine(data.redirects?.nodes ?? [])
  // Throws on a Tier-1 collision (lib/cms/redirect-build.ts) — caught by runPass(),
  // which keeps the previous document in place, same as the build refuses to ship.
  const built = buildRedirects(nodes)

  const doc = buildDocument(SITE, 'redirect', 'all', { redirects: built.redirects })
  const newItems = { all: doc.path }
  const previousItems = previousIndex?.kinds?.redirect?.items ?? null
  const changed = kindChanged(previousItems, newItems)
  const toUpload = changed ? [{ path: doc.path, body: doc.bytes }] : []
  const indexKind = buildIndexKind(1, built.watermark, newItems)

  // §4.1.3a item 4: redirect -> each CHANGED source path. The document is one JSON
  // blob (key "all"), so "changed" is whole-document; the previous document's own
  // sources are not held across passes (no last-good merge needed — see publishGlossary
  // for why that pattern exists at all: to protect an item WordPress still publishes but
  // this pass could not read, which has no analogue for a single, always-fully-rebuilt
  // document), so every CURRENT source is purged on any change — a superset of "only the
  // ones that actually moved", safe because purging a redirect source that did not
  // change is a no-op at the edge, never a correctness problem.
  const pagePatterns = changed ? built.redirects.map((r) => r.source) : []

  return { indexKind, toUpload, changed, pagePatterns }
}

const KIND_PUBLISHERS: Record<string, (previousIndex: ContentIndex | null) => Promise<KindPublishResult>> = {
  glossary: publishGlossary,
  blog: publishBlog,
  route: publishRoute,
  redirect: publishRedirect,
}

// ── One full pass ────────────────────────────────────────────────────────────────────
async function runPass(): Promise<void> {
  const startedAt = Date.now()
  log(`pass starting (kinds: ${[...PUBLISH_KINDS].join(', ') || '(none)'}${DRY_RUN ? ', DRY_RUN' : ''})`)

  // §4.1.3a Publisher: "read the current index from the CDN (404 = empty)".
  let previousIndex: ContentIndex | null = null
  try {
    previousIndex = await getContentIndex(SITE)
  } catch (e) {
    log(`could not read the current index — proceeding as if empty: ${(e as Error).message}`)
  }

  const kinds: Record<string, ContentIndexKind> = { ...(previousIndex?.kinds ?? {}) }
  const allUploads: { path: string; body: string }[] = []
  const allPurgeUrls: string[] = []
  let anyChanged = false

  for (const kind of PUBLISH_KINDS) {
    const publisher = KIND_PUBLISHERS[kind]
    if (!publisher) {
      log(`kind "${kind}" is listed in PUBLISH_KINDS but has no publisher yet — skipping`)
      continue
    }
    try {
      const result = await publisher(previousIndex)
      kinds[kind] = result.indexKind
      metrics.items.set(kind, result.indexKind.count)
      allUploads.push(...result.toUpload)
      if (result.changed) {
        anyChanged = true
        allPurgeUrls.push(...pagePurgeUrls(SITE_ORIGIN, result.pagePatterns))
        log(`kind "${kind}" changed: ${result.indexKind.count} item(s), ${result.toUpload.length} new document(s)`)
      } else {
        log(`kind "${kind}" unchanged: ${result.indexKind.count} item(s)`)
      }
    } catch (e) {
      // 🔴 A failed read or kind leaves the previous index entry in place (§4.1.3a).
      metrics.failuresTotal += 1
      log(`kind "${kind}" FAILED this pass, keeping its previous index entry: ${(e as Error).message}`)
    }
  }

  const index = buildIndex({ site: SITE, publishedAt: new Date().toISOString(), kinds, build: BUILD })
  const indexChanged = JSON.stringify(previousIndex?.kinds ?? {}) !== JSON.stringify(index.kinds)

  try {
    await uploaderContent(allUploads)
    if (indexChanged) {
      await uploaderContent([{ path: `content/${SITE}/index.json`, body: JSON.stringify(index) }])
    }

    if (anyChanged || indexChanged) {
      const indexUrl = `${CONTENT_BASE}/content/${SITE}/index.json`
      await uploaderPurge([indexUrl])
      if (allPurgeUrls.length > 0) {
        await uploaderPurge(allPurgeUrls)
        // §4.1.3/§4.1.3a "purge… then the same page URLs again 20s later" — beyond the
        // index's own 15s in-memory cache on every reading instance.
        await sleep(PURGE_SECOND_WAIT_MS)
        await uploaderPurge(allPurgeUrls)
      }
    }
    metrics.lastSuccessTimestamp = Math.floor(Date.now() / 1000)
  } catch (e) {
    metrics.failuresTotal += 1
    log(`upload/purge FAILED this pass: ${(e as Error).message}`)
  }

  metrics.lastPublishTimestamp = Math.floor(Date.now() / 1000)
  await pushMetrics()
  log(`pass finished in ${Date.now() - startedAt}ms`)
}

// ── Single-flight scheduling (§4.1.3a: "One pass at a time") ───────────────────────
let running = false
let rerunRequested = false

async function triggerPass(): Promise<void> {
  if (running) {
    rerunRequested = true
    return
  }
  running = true
  try {
    do {
      rerunRequested = false
      await runPass()
    } while (rerunRequested)
  } finally {
    running = false
  }
}

// ── HTTP surface (§4.1.3a: "POST /run (header X-Ciphera-Status-Secret, no body, 202)
// wakes it; it also sweeps every 120s") — the media mirror's exact contract ──────────
function timingSafeSecretMatch(provided: string): boolean {
  const expected = Buffer.from(STATUS_SECRET, 'utf-8')
  const given = Buffer.from(provided, 'utf-8')
  if (expected.length !== given.length) {
    // 🔴 timingSafeEqual THROWS on a length mismatch rather than returning false — a
    // naive `timingSafeEqual(expected, given)` would crash the request on almost every
    // wrong guess. A length check first is correct here precisely because the secret's
    // length is not a usable signal (STATUS_SECRET is fixed-length in practice; what
    // must not leak is which BYTE differs).
    return false
  }
  return timingSafeEqual(expected, given)
}

function handleRun(req: IncomingMessage, res: ServerResponse): void {
  const provided = req.headers['x-ciphera-status-secret']
  if (typeof provided !== 'string' || !STATUS_SECRET || !timingSafeSecretMatch(provided)) {
    res.writeHead(401).end()
    return
  }
  // 🔴 THE BODY IS NEVER READ — "there is nothing a caller is allowed to say beyond
  // 'now'" (media-mirror.py's own comment, copied deliberately). Respond 202
  // immediately; the work has not happened yet.
  res.writeHead(202).end()
  void triggerPass()
}

export function createPublisherServer() {
  return createServer((req, res) => {
    if (req.method === 'POST' && req.url?.startsWith('/run')) {
      handleRun(req, res)
      return
    }
    if (req.method === 'GET' && req.url === '/healthz') {
      res.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok')
      return
    }
    res.writeHead(404).end()
  })
}

function main(): void {
  if (!STATUS_SECRET) {
    console.error('🔴 cms-publisher: STATUS_SECRET is unset — every /run call would 401 forever. Refusing to start.')
    process.exit(1)
  }

  const server = createPublisherServer()
  server.listen(PORT, () => log(`listening on :${PORT} (sweep every ${SWEEP_SECONDS}s)`))

  // Level-triggered: a lost /run signal costs latency, never content (same judgement
  // as media-mirror.py's SWEEP_SECONDS loop).
  setInterval(() => void triggerPass(), SWEEP_SECONDS * 1000)
  void triggerPass()
}

// 🔑 `--self-test` loads this module, builds the HTTP server object, and exits 0
// without binding a port or making any network call — this is what proves the
// esbuild-bundled runtime artifact actually loads with no node_modules present
// (see the Dockerfile comment for why that is the thing worth proving).
if (process.argv.includes('--self-test')) {
  const server = createPublisherServer()
  if (typeof server.listen !== 'function') throw new Error('self-test: server object is malformed')
  console.log('cms-publisher --self-test: module loaded and server object constructed OK')
  process.exit(0)
} else if (process.env.CMS_PUBLISHER_MAIN !== '0') {
  main()
}
