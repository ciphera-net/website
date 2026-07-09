import Link from 'next/link'
import { ArrowRightIcon, Button } from '@ciphera-net/facet'
import { FloatingPaths } from '@/components/ui/background-paths'

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent_92%)]"
      >
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative px-6 pb-24 pt-24 sm:pt-32 lg:pb-32 lg:pt-40">
        <p className="font-mono text-xs text-muted-foreground">
          Zero-knowledge infrastructure
        </p>

        <h1 className="mt-8 max-w-4xl font-display text-6xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-[96px]">
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
