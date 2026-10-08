/** Render-harness-only shim (M2) — a settable `usePathname()`, so the harness can drive
 * both the legacy fixture and the refactored component through the SAME minimal stand-in
 * for `next/navigation`, never the real Next runtime (not available outside `next build`/
 * `next dev`). Both sides of every comparison go through this one shim, so whatever it
 * does or doesn't replicate of real Next behaviour is identical on both sides. */
let current = '/'

export function usePathname(): string {
  return current
}

export function __setPathname(p: string): void {
  current = p
}
