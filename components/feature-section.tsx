import Link from 'next/link'
import {
  ArrowUpRightIcon,
  GithubIcon,
  LockIcon,
  LockClosedIcon,
} from '@ciphera-net/facet'
import { Leaf } from '@phosphor-icons/react/dist/ssr'
import { FullWidthDivider } from '@/components/full-width-divider'

// "01 · Why Ciphera" — four claims, each paired with verifiable proof
// (receipts, not claims). Presented in the Efferd features-3 grid: rail-celled
// cards framed top & bottom by full-width dividers with "+" corner marks.
const features = [
  {
    icon: LockIcon,
    title: 'Zero-Knowledge Encryption',
    description:
      'Your data is encrypted on your device before it ever reaches our servers. We can’t see it, even if we wanted to.',
    proofLabel: 'How it works',
    proofHref: '/learn',
    external: false,
  },
  {
    icon: LockClosedIcon,
    title: 'End-to-End Encrypted',
    description:
      'AES-256-GCM encryption ensures your files, messages, and data are protected in transit and at rest.',
    proofLabel: 'Security FAQ',
    proofHref: '#faq',
    external: false,
  },
  {
    icon: Leaf,
    title: 'Measured Sustainability',
    description:
      'Every server we run is carbon-accounted with life-cycle assessment — published as numbers, not marketing.',
    proofLabel: 'See the datacenter numbers',
    proofHref: '/sustainability',
    external: false,
  },
  {
    icon: GithubIcon,
    title: 'Open Source',
    description:
      'Our code is publicly auditable on GitHub. Transparency builds trust — verify our claims yourself.',
    proofLabel: 'Read the code',
    proofHref: 'https://github.com/ciphera-net',
    external: true,
  },
] as const

const proofLinkClass =
  'mt-5 inline-flex items-center gap-1 text-xs text-brand transition-colors duration-fast hover:text-brand-hover'

export default function FeatureSection() {
  return (
    <section className="border-b border-border">
      <div className="px-6 py-16 sm:py-20">
        {/* Section header */}
        <p className="text-xs text-muted-foreground">
          01 · Why Ciphera
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Built different
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Privacy isn&apos;t a feature we bolt on &mdash; it&apos;s the foundation everything runs on.
        </p>

        {/* Efferd features-3 grid: gap-px rail cells, side borders, and
            full-width top/bottom dividers carrying the "+" corner marks. */}
        <div className="relative mt-12 grid grid-cols-1 gap-px border-x border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          <FullWidthDivider position="top" />
          {features.map(({ icon: Icon, title, description, proofLabel, proofHref, external }) => (
            <div key={title} className="flex flex-col bg-card p-6">
              <Icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
              <p className="mt-4 text-sm font-semibold text-foreground">{title}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              {external ? (
                <a
                  href={proofHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={proofLinkClass}
                >
                  {proofLabel}
                  <ArrowUpRightIcon aria-hidden="true" className="h-3 w-3" />
                </a>
              ) : (
                <Link href={proofHref} className={proofLinkClass}>
                  {proofLabel}
                  <ArrowUpRightIcon aria-hidden="true" className="h-3 w-3" />
                </Link>
              )}
            </div>
          ))}
          <FullWidthDivider position="bottom" />
        </div>
      </div>
    </section>
  )
}
