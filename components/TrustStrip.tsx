import {
  CheckCircleIcon,
  EyeOffIcon,
  GithubIcon,
  LockClosedIcon,
  SwissFlagIcon,
} from '@ciphera-net/facet'

const BADGES = [
  { icon: SwissFlagIcon, label: 'Swiss hosted' },
  { icon: CheckCircleIcon, label: 'GDPR & FADP' },
  { icon: EyeOffIcon, label: 'Zero-knowledge' },
  { icon: LockClosedIcon, label: 'End-to-end encrypted' },
  { icon: GithubIcon, label: 'Open source' },
] as const

export default function TrustStrip() {
  return (
    <section className="border-b border-border" aria-label="Compliance and trust">
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-5">
        {BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 bg-background px-5 py-4 sm:justify-center sm:px-3 sm:py-5"
          >
            <Icon aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
