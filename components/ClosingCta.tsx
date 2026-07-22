import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon, Button } from '@ciphera-net/facet'
import { cdnUrl } from '@/lib/cdn'


export default function ClosingCta() {
  return (
    /* no border-b: the Footer's border-t owns the divider on this shared edge */
    <section>
      {/* 1.3fr/1fr: text column leads, photo card sits a notch smaller but stays flush right */}
      <div className="grid items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.3fr_1fr]">
        <div>
        <p className="text-xs text-muted-foreground">
          05 · Get started
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Own your data.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          One Ciphera ID for every service. Your password never leaves your device &mdash;
          we authenticate you without ever seeing your credentials.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <a href="https://id.ciphera.net/signup">
              Create your Ciphera ID
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Talk to us</Link>
          </Button>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          Zero-knowledge &middot; No tracking &middot; Open source
        </p>
        </div>

        {/* The real id.ciphera.net sign-in over the concrete: brand texture
            behind (scrimmed back to texture), product in front. */}
        <div>
          <div className="relative aspect-square overflow-hidden border border-border">
            <Image
              src={cdnUrl('/cta-concrete-blocks.jpg')}
              alt="Brutalist concrete blocks"
              fill
              className="object-cover grayscale"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            {/* scrim only — sharp blocks stay sharp; the dim does the quieting */}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45" />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Captured from the live id.ciphera.net sign-in (retina 2x) —
                  re-capture when the ID UI changes so this never drifts. */}
              <Image
                src={cdnUrl('/cta-id-login.png')}
                alt="Ciphera ID sign-in form"
                width={496}
                height={536}
                className="w-[64%] border border-border"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
