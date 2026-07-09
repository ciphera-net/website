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
