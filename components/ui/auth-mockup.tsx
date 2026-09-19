import Image from 'next/image'
import { cdnUrl } from '@/lib/cdn'
import { MacWindow } from '@/components/ui/mac-window'

// A retina capture of the real Ciphera ID sign-in screen (OPAQUE auth) inside a
// macOS window. The filename carries the capture date for the same reason the
// Pulse one does — see components/ui/pulse-mockup.tsx.
//
// The capture it replaces still read "Sign In" and "Sign in with Passkey";
// the live screen says "Sign in" and "Sign in with passkey".
export const AUTH_CAPTURED = '19-09-2026'

export function AuthMockup() {
  return (
    <MacWindow>
      <Image
        src={cdnUrl(`/mockups/id-signin-${AUTH_CAPTURED}-2x.png`)}
        alt="The Ciphera ID sign-in screen — email and password fields, a Sign in button, and Sign in with passkey beneath it"
        width={992}
        height={1074}
        className="block w-full"
        unoptimized
      />
    </MacWindow>
  )
}
