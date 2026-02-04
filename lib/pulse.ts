/**
 * Pulse analytics tracking helper for the Ciphera website.
 * Calls window.pulse.track() when the Pulse script is loaded (client-side only).
 */

declare global {
  interface Window {
    pulse?: { track?: (eventName: string) => void }
  }
}

/**
 * Tracks a custom event in Pulse. No-op if Pulse script is not loaded or on server.
 *
 * @param eventName - Snake_case event name (letters, numbers, underscores only).
 */
export function track(eventName: string): void {
  if (typeof window === 'undefined') return
  window.pulse?.track?.(eventName)
}
