import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // * Standalone output for Docker image builds (small runtime, no node_modules at runtime)
  output: 'standalone',
  // * Privacy-first: Disable analytics and telemetry
  productionBrowserSourceMaps: false,
  // * Image optimization
  images: {
    // Dev only: load CDN images directly instead of proxying through the
    // /_next/image optimizer — its upstream fetch times out during cold
    // Turbopack compiles, rendering every remote image broken on first load.
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'cdn.ciphera.net' },
    ],
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
