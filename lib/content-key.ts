/**
 * The shape of a content key: the last path segment of every document the CMS publisher stores,
 * `content/<site>/<kind>/<key>.<sha8>.json`. The uploader refuses any other (Infra
 * Kubernetes/workloads/ciphera-uploader/uploader.py, CONTENT_DOC_RE), and one refused document fails the whole upload,
 * so a key outside it is left out by name instead (scripts/cms-publisher.ts), and the blog transform names a post whose
 * slug it cannot be published under (lib/blog-transform.ts).
 */
export const CONTENT_KEY_SHAPE = /^[a-z0-9]+(-[a-z0-9]+)*$/

export function isContentKey(key: string): boolean {
  return CONTENT_KEY_SHAPE.test(key)
}
