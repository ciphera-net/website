import Image from 'next/image'
import { cdnUrl } from '@/lib/cdn'
import { MacWindow } from '@/components/ui/mac-window'

// A retina screenshot of the real Ciphera Captcha challenge ("I am human")
// as it appears in a live signup form, inside a macOS window. Replaces the
// former hand-built CSS mockup.
export function CaptchaMockup() {
  return (
    <MacWindow>
      <Image
        src={cdnUrl('/mockups/captcha-challenge-2x.png')}
        alt="The Ciphera Captcha challenge — a privacy-first 'I am human' verification in a real signup form"
        width={1120}
        height={830}
        className="block w-full"
        unoptimized
      />
    </MacWindow>
  )
}
