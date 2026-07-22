import Image from 'next/image'
import Link from 'next/link'
import { CheckIcon, GlobeIcon, CheckCircleIcon, LockIcon } from '@ciphera-net/facet'
import { cdnUrl } from '@/lib/cdn'

const INFO_TILES = [
  {
    icon: GlobeIcon,
    title: 'Data residency',
    desc: 'Hosted in Switzerland',
  },
  {
    icon: CheckCircleIcon,
    title: 'FADP protected',
    desc: 'Federal Act on Data Protection',
  },
  {
    icon: LockIcon,
    title: 'Zero-knowledge',
    desc: "We can’t read your data",
  },
] as const

const CHECKLIST = [
  'No tracking, no profiling, no data resale',
  'End-to-end encryption across all services',
  "Zero-knowledge architecture — we can’t read your data",
  'GDPR and FADP compliant by design',
  'Open source clients for full transparency',
] as const

export default function SwissPrivacy() {
  return (
    <section className="border-b border-border">
      <div className="px-6 py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* LEFT — photo + info tiles */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden border border-border">
              <Image
                src={cdnUrl('/swiss-alps-flag.jpg')}
                alt="Swiss Alps with Swiss flag"
                fill
                className="object-cover grayscale"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>

            {/* Grid-rail info tiles — attached flush to the photo bottom edge */}
            <div className="grid grid-cols-3 gap-px border border-t-0 border-border bg-border">
              {INFO_TILES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card p-4">
                  <Icon aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                  <p className="mt-3 text-xs font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — copy */}
          <div>
            <p className="text-xs text-muted-foreground">
              03 · Swiss privacy
            </p>

            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Swiss data residency. FADP + GDPR.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Every Ciphera service runs on infrastructure in Switzerland, protected by the <Link href="/glossary/fadp" className="text-primary hover:underline">Federal Act on Data Protection (FADP)</Link> and the GDPR. Your files, your analytics, your
              credentials — stored and processed there, nowhere else.
            </p>

            <ul className="mt-8 space-y-3.5">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  {/* text-pos, not text-brand: five co-visible orange icons would blow the
                      one-accent-per-section budget; green carries the "confirmed" semantics */}
                  <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-pos" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
