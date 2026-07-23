import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, Button } from '@ciphera-net/facet'
import { homeHeroBg } from '@/lib/images'

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Glyph-ember backdrop: near-black up top so the headline sits on solid
          ground; the radial mask is a wide, shallow ellipse anchored at the
          bottom, so the ember fills the column edge-to-edge and only its top
          fades into black — drawing the curved horizon. */}
      <Image
        src={homeHeroBg}
        alt=""
        aria-hidden="true"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-bottom [mask-image:radial-gradient(300%_135%_at_50%_100%,#000_60%,transparent_100%)]"
      />
      {/* Text-side scrim so the copy keeps its contrast where the glow rises. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-background/70 from-5% via-background/30 via-40% to-transparent to-65%"
      />

      <div className="relative px-6 pb-24 pt-24 sm:pt-32 lg:pb-32 lg:pt-40">
        <p className="text-xs text-muted-foreground">
          Zero-knowledge infrastructure
        </p>

        <h1 className="mt-8 max-w-4xl font-display text-6xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-[96px]">
          Your data is yours.
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Ciphera provides privacy-first infrastructure and applications built on zero-knowledge
          principles. Your data is encrypted before it leaves your device — we can&apos;t see it,
          even if we wanted to.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="#products">
              Explore Products
              <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Our Mission</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
