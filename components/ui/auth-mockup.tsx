import Image from 'next/image'
import { cdnUrl } from '@/lib/cdn'
import { MacWindow } from '@/components/ui/mac-window'

// A retina screenshot of the real Ciphera ID sign-in screen (OPAQUE auth)
// inside a macOS window. Replaces the former hand-built CSS mockup.
export function AuthMockup() {
  return (
    <MacWindow>
      <Image
        src={cdnUrl('/cta-id-login.png')}
        alt="The Ciphera ID sign-in screen — zero-knowledge OPAQUE authentication with passkey support"
        width={992}
        height={1072}
        className="block w-full"
        unoptimized
      />
    </MacWindow>
  )
}
