import type { NextConfig } from 'next'
// 🔴 TIER-2 REDIRECTS COME FROM WORDPRESS (design §6.4, §34). Build output, written by
// `npm run generate:redirects` in prebuild and committed as an empty stub so this
// config resolves on a fresh clone — the same convention as lib/blog-wp.gen.ts.
import { REDIRECTS } from './lib/redirects.gen'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // * Standalone output for Docker image builds (small runtime, no node_modules at runtime)
  output: 'standalone',
  // * Privacy-first: Disable analytics and telemetry
  productionBrowserSourceMaps: false,
  // * Images are served directly from cdn.ciphera.net (path-keyed, immutable),
  // * never through the /_next/image optimizer. The optimizer's query-string
  // * URLs (?url=&w=&q=) sit behind the ciphera.net Bunny pull zone, whose
  // * cache collapses query strings and ignores Accept — one cached body was
  // * served for every image on the site. Assets are pre-sized at upload.
  images: {
    unoptimized: true,
  },
  // * Performance optimizations
  compress: true,
  poweredByHeader: false,
  // * Redirects come from TWO places since 10-09-2026 (design §6.4, §34):
  // *   Tier 1 — structural, in this file, permanent, not editable by the agency.
  // *   Tier 2 — retired content, from WordPress, via the REDIRECTS import above.
  // * 🔴 A removal must ALWAYS land somewhere. Deleted URLs keep receiving search and
  // * backlink traffic for months — the Drop post leaked 17 visits/90d into a 404
  // * after its redirect-less removal (corpus purge 19-07-2026, see
  // * Public/docs/audits/19-07-2026-blog-corpus-audit.md). A retired POST now goes in
  // * the CMS under Redirects; a retired structural path goes here, in a PR.
  async redirects() {
    // 🔁 THE 18 RETIRED BLOG SLUGS MOVED INTO WORDPRESS ON 10-09-2026 (design §34).
    // They were a `gone` array right here. They are Tier 2 — content redirects the
    // agency owns — and they now arrive through `REDIRECTS` below, regenerated from
    // the CMS on every build by `npm run generate:redirects`. They were seeded
    // verbatim, and the generator refuses to ship fewer than 18.
    //
    // 🔴 WHAT REMAINS IN THIS FILE IS TIER 1 AND MUST NEVER MOVE.
    // * Removed site pages (GSC 404 report, 19-07-2026): the old /products
    // * landing (removed 31-03), the pre-rename Auth product page, the retired
    // * Drop product page, and two dead marketing pages from the March cleanup.
    // * The overhaul (18-10-2026, plan D1/D2/D7) retired the five product pages,
    // * /what-is-ciphera and /press: Pulse has its own site, sign-in and open source
    // * became sections of /trust, and About absorbed the other two. The older entries
    // * point straight at the new homes, so no request takes two hops.
    const goneSite: Array<[string, string]> = [
      ['/companies', '/'],
      ['/comparison', '/blog/zero-knowledge-encryption-guide'],
      ['/products', '/'],
      ['/products/auth', '/trust#sign-in'],
      ['/products/drop', '/'],
      ['/products/pulse', 'https://pulse.ciphera.net'],
      ['/products/captcha', '/'],
      ['/products/relay', '/'],
      ['/products/id', '/trust#sign-in'],
      ['/products/tessera', '/trust#open-source'],
      ['/what-is-ciphera', '/about'],
      ['/press', '/about#press'],
      // * The warrant canary's glossary term goes with the canary (D6, plan §5j).
      ['/glossary/warrant-canary', '/glossary'],
      // * A retired POST belongs in the CMS (Tier 2), and three of the four the
      // * overhaul retires are there (D39). This one is here because it lands on a
      // * section: a CMS redirect cannot carry a #fragment (lib/redirect-path-rules.mjs
      // * allows none), and Next's own redirects keep one.
      ['/blog/ciphera-id-vs-auth0-vs-clerk', '/trust#sign-in'],
    ]
    // * /security and /transparency were consolidated into the /trust hub
    // * (19-07-2026, see Public/docs/plans/19-07-2026-trust-hub-consolidation.md).
    // * The warrant canary and the transparency report were discontinued on
    // * 16-10-2026: /trust/canary, /trust/report and every file they served
    // * (canary-*.txt, canary-*.txt.asc, canary-pubkey.asc, report-status.txt)
    // * are gone, so each of those addresses lands on the hub instead of a 404.
    // * The whole old /transparency tree goes straight to the hub too (no chain
    // * through /trust/canary). Nothing signed is served any more, so these are
    // * kept for the inbound links and search equity those URLs carry.
    const trustHub = [
      { source: '/security', destination: '/trust', permanent: true },
      { source: '/transparency/:path*', destination: '/trust', permanent: true },
      { source: '/trust/canary/:path*', destination: '/trust', permanent: true },
      { source: '/trust/report/:path*', destination: '/trust', permanent: true },
      { source: '/trust/canary-:file', destination: '/trust', permanent: true },
      { source: '/trust/report-status.txt', destination: '/trust', permanent: true },
    ]
    // 🔴 TIER 1 IS SPREAD FIRST SO IT ALWAYS WINS. Next applies redirects in order,
    // and a CMS row must never be able to shadow a structural redirect.
    // `generate-redirects.ts` refuses such a collision too; this ordering is the
    // half that holds even if the generator is bypassed.
    return [
      ...goneSite.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      ...trustHub,
      ...REDIRECTS,
    ]
  },
  // * Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // ⚠️ AUTHORITATIVE COPY IS AT THE EDGE, NOT HERE.
          // Traefik's `security-headers` middleware (applied to every router via
          // `default-chain`, see Infra/Kubernetes/addons/20-traefik/middlewares.yaml)
          // sets this header and OVERWRITES whatever the app sends. This value is kept
          // in sync with it so the file does not describe a policy we do not ship; it is
          // defence-in-depth for any path that ever bypasses that middleware.
          //
          // It previously read `max-age=63072000; includeSubDomains; preload`, which was
          // dead config: the wire has always carried max-age=31536000 and no `preload`.
          // 🔴 Do NOT re-add `preload` here. Preload is a one-way commitment recorded as
          // an explicit owner decision at middlewares.yaml (`stsPreload: false`); adding
          // it in this file changes nothing on the wire and only re-creates the illusion.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.ciphera.net https://pulse.ciphera.net https://pulse-staging.ciphera.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://cdn.ciphera.net; font-src 'self'; connect-src 'self' https://api.ciphera.net https://pulse.ciphera.net https://pulse-api.ciphera.net https://pulse-staging.ciphera.net https://pulse-api-staging.ciphera.net https://captcha.ciphera.net; worker-src 'self' blob:; frame-ancestors 'none'" },
        ],
      },
    ]
  },
}

export default nextConfig
