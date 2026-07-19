import type { NextConfig } from 'next'

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
  // * Permanent redirects for removed blog posts (corpus purge 19-07-2026, see
  // * Public/docs/audits/19-07-2026-blog-corpus-audit.md). Deleted URLs keep
  // * receiving search/backlink traffic for months — every removal must land here,
  // * never on a 404 (the Drop post leaked 17 visits/90d into a 404 after its
  // * redirect-less removal).
  async redirects() {
    const gone: Array<[string, string]> = [
      ['ai-assistant-data-collection-chatgpt-gemini-meta', '/blog/what-we-see-about-you-what-we-dont'],
      ['basic-fit-data-breach-1-million-members', '/blog'],
      ['biggest-data-breaches-2025-2026', '/blog'],
      ['bot-account-farming-defense-zero-knowledge-auth', '/blog/zero-knowledge-encryption-guide'],
      ['cdn-performance-monitoring-bunnycdn-analytics', '/blog/why-we-chose-bunnycdn'],
      ['darksword-iphone-exploit-how-to-protect-yourself', '/blog'],
      ['data-brokers-10000-data-points-how-to-delete', '/blog/what-we-see-about-you-what-we-dont'],
      ['data-privacy-audit-guide-startups', '/blog/why-privacy-cant-be-an-afterthought'],
      ['drop-vs-wetransfer-google-drive-dropbox-encrypted-file-sharing', '/blog/zero-knowledge-encryption-guide'],
      ['google-search-console-privacy-first-analytics', '/blog/pulse-vs-google-analytics-plausible-fathom'],
      ['instagram-drops-end-to-end-encryption', '/blog/zero-knowledge-encryption-guide'],
      ['passkeys-vs-passwords-2026', '/blog/zero-knowledge-encryption-guide'],
      ['privacy-statistics-2026', '/blog'],
      ['recaptcha-privacy-liability-alternatives-2026', '/products/captcha'],
      ['uk-age-verification-apple-iphone', '/blog'],
      ['vercel-data-breach-2026', '/blog'],
      ['why-european-businesses-should-use-european-software', '/blog/why-swiss-infrastructure-matters-for-data-privacy'],
      ['why-most-analytics-tools-skip-user-journeys', '/blog/pulse-vs-google-analytics-plausible-fathom'],
    ]
    // * Removed site pages (GSC 404 report, 19-07-2026): the old /products
    // * landing (removed 31-03), the pre-rename Auth product page, the retired
    // * Drop product page, and two dead marketing pages from the March cleanup.
    const goneSite: Array<[string, string]> = [
      ['/companies', '/'],
      ['/comparison', '/blog/zero-knowledge-encryption-guide'],
      ['/products', '/#products'],
      ['/products/auth', '/products/id'],
      ['/products/drop', '/#products'],
    ]
    return [
      ...gone.map(([slug, destination]) => ({
        source: `/blog/${slug}`,
        destination,
        permanent: true,
      })),
      ...goneSite.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
    ]
  },
  // * Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
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
