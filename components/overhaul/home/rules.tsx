/**
 * Round 2c (mock, 16-10): the four rules and the footprint receipt, shared by the scroll-drawn timeline options
 * (How we build D–M). Rules 1 and 4 reworded to speak for the company, not Pulse (owner 16-10, W2a in the plan §5c):
 * every phrase comes from the privacy policy's company-wide text. No hooks and no server-only imports, so both the
 * server wrapper and the client timeline can render it.
 */
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

export const RULES = [
  { icon: 'eye', title: 'We collect almost nothing', desc: 'We keep only what a feature needs to work, and nothing we could sell.', proof: 'Read the privacy policy', href: '/privacy' },
  { icon: 'pin', title: 'Stored in Switzerland', desc: 'We store your data in Swiss data centres, backups included, under the Swiss data protection act.', proof: 'See where your data lives', href: '#where' }, // W5-3 ruled 17-10: "your data", since this website itself runs on bunny.net
  { icon: 'lock', title: 'Open where it counts', desc: 'The library behind our sign-in, the Pulse app and CLI, 14 platform integrations and this website are all public.', proof: 'Browse the code', href: '#open' },
  { icon: 'out', title: 'You can walk away', desc: 'Take your data with you in a format other tools can read, or have it deleted, whenever you want.', proof: 'Your rights', href: '/privacy#your-rights-under-gdpr-and-fadp' }, // owner 17-10: company-level, like the rule
] as const

export type RuleIcon = (typeof RULES)[number]['icon']

/** The live footprint, read on the server (`fetchImpactReport`); null when the report cannot be read. */
export type Receipt = { kg: string; period: string; measured: boolean; renewable: boolean } | null

export const HEADING = {
  eyebrow: 'How we build',
  title: 'Four rules behind everything we ship.',
  lead: 'Privacy-first is a set of decisions we have already made, so you do not have to trust us on each one.',
}

export function ProofLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary">
      {children} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  )
}

export function ReceiptFigure({ r, size = 'lg' }: { r: NonNullable<Receipt>; size?: 'md' | 'lg' }) {
  return (
    <p className={`${size === 'lg' ? 'text-5xl lg:text-6xl' : 'text-4xl sm:text-5xl'} font-semibold tabular-nums tracking-tight text-foreground`}>
      {r.kg}
      {' '}
      <span className="ml-1 text-lg font-medium text-muted-foreground sm:text-xl">kg CO₂e</span>
    </p>
  )
}

export function ReceiptCaption({ r }: { r: NonNullable<Receipt> }) {
  return (
    <p className="text-sm text-muted-foreground">
      Our footprint, {r.period}
      {' · '}
      {r.measured ? 'Measured' : 'Approximated with Boavizta life-cycle factors'}
      {r.renewable ? ' · 100% renewable energy' : ''}
    </p>
  )
}

/** Option B's ledger line, for the layouts that keep the receipt under the rules. */
export function ReceiptLedger({ r }: { r: NonNullable<Receipt> }) {
  return (
    <div className="flex flex-col gap-6 border-t border-border pt-10 sm:flex-row sm:items-baseline sm:justify-between">
      <ReceiptFigure r={r} size="md" />
      <div className="flex flex-col gap-1 sm:items-end">
        <ReceiptCaption r={r} />
        <ProofLink href="/sustainability">How we measure it</ProofLink>
      </div>
    </div>
  )
}
