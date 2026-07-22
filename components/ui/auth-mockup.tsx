import Image from 'next/image'
import { cdnUrl } from '@/lib/cdn'
import { MacWindow } from '@/components/ui/mac-window'

// A retina screenshot of the real Ciphera ID sign-in screen (OPAQUE auth)
// inside a macOS window. Replaces the former hand-built CSS mockup.
export function AuthMockup() {
  return (
    <MacWindow>
      <Image
        src={cdnUrl('/mockups/id-signin-2x.png')}
        alt="The Ciphera ID sign-in screen — zero-knowledge OPAQUE authentication with passkey support"
        width={2560}
        height={1720}
        className="block w-full"
        unoptimized
      />
    </MacWindow>
  )
}
