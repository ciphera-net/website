const CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL || ''

/**
 * Prefix a relative asset path with the CDN base (NEXT_PUBLIC_CDN_URL).
 *
 * Idempotent: already-absolute URLs (http/https/protocol-relative) and data: URIs
 * pass through unchanged, so a resolved URL can never be double-prefixed — callers
 * (and the blog loader) can hand it any value safely.
 *
 * When NEXT_PUBLIC_CDN_URL is unset (local dev with no CDN configured) it returns
 * the raw path for the local public/ fallback.
 */
export function cdnUrl(path: string): string {
  if (!path) return path
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return `${CDN_BASE}${path}`
}
