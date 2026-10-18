/**
 * Round 3 (mock, 16-10): the footer's content, shared by every footer option so only the layout differs.
 *
 * - Tagline and blurb are the approved W1 wording (plan §5a): the hero's H1 and subhead. The old footer's
 *   "Built for privacy" signature and its zero-knowledge blurb are retired with the repositioning.
 * - Columns follow the new information architecture (plan §3, the mock header's menus): Pulse is the one product;
 *   Captcha, Relay and ID are not linked (D1); Learn leaves the menus; Documentation appears once.
 * - The company line is unchanged registration text (KBO/BCE number and the registered address).
 * - Mock shortcut, as in the header: the columns are hard-coded here; the real footer renders the CMS footer menu
 *   document (`resolveMenu('footer')`), whose groups are reworded to match when the footer ships.
 */
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { SocialIcon } from '@/components/cms/SocialIcon'
import type { SocialIcon as SocialIconKey } from '@/lib/cms/menu-build'
import { cn } from '@/lib/utils'

export const TAGLINE = 'Privacy-first software, made in Europe.'
export const TAGLINE_LINES = ['Privacy-first software,', 'made in Europe.'] as const
export const BLURB = 'Ciphera is a Belgian software company. We build privacy-first tools for the web and run them on Swiss infrastructure.'

export type FooterLink = { label: string; href: string }
export const GROUPS: { label: string; items: FooterLink[] }[] = [
  {
    label: 'Products',
    items: [
      { label: 'Pulse Analytics', href: 'https://pulse.ciphera.net' },
      { label: 'Open source', href: '/trust#open-source' },
      { label: 'How sign-in works', href: '/trust#sign-in' },
      { label: 'Documentation', href: 'https://docs.ciphera.net' },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'About', href: '/about' },
      { label: 'Trust & security', href: '/trust' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Press', href: '/about#press' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Blog', href: '/blog' },
      { label: 'Glossary', href: '/glossary' },
      { label: 'Help center', href: 'https://help.ciphera.net' },
      { label: 'Status', href: 'https://status.ciphera.net' },
    ],
  },
  {
    label: 'Legal',
    items: [
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of service', href: '/terms' },
    ],
  },
]

export const SOCIAL: { icon: SocialIconKey; label: string; href: string }[] = [
  { icon: 'github', label: 'GitHub', href: 'https://github.com/ciphera-net' },
  { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/ciphera/' },
  { icon: 'x', label: 'X', href: 'https://x.com/CipheraNET' },
  { icon: 'discord', label: 'Discord', href: 'https://discord.gg/XRSkHCDD4x' },
]

export const COMPANY_LINE = `© 2024–${new Date().getFullYear()} Ciphera BV · KBO/BCE 1013.721.660 · De Kleetlaan 2, 1831 Diegem, Belgium`

/** An external link opens in a new tab; an internal one stays. One rule for every option. */
export function FooterAnchor({ link, className }: { link: FooterLink; className?: string }) {
  const external = link.href.startsWith('https://')
  return (
    <a
      href={link.href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn('transition-colors duration-150 hover:text-foreground', className)}
    >
      {link.label}
    </a>
  )
}

/** Square social buttons (Facet's geometry), as the current footer draws them. */
export function SocialRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {SOCIAL.map((s) => (
        <a
          key={s.icon}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ciphera on ${s.label}`}
          className="inline-flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors duration-150 hover:border-line-hover hover:text-foreground"
        >
          <SocialIcon icon={s.icon} className="h-4 w-4" />
        </a>
      ))}
    </div>
  )
}

/**
 * One quiet line from the public status feed (status.ciphera.net renders the same file). Renders NOTHING when the feed
 * cannot be read or is stale: a footer on every page must never claim "operational" from old data (status.ciphera.net
 * refuses a stale feed for the same reason). Colour lives in the dot only (Facet: pos / neg tokens).
 */
const STALE_AFTER_MS = 15 * 60 * 1000
export async function FooterStatus({ className }: { className?: string }) {
  let overall: string | null = null
  try {
    const r = await fetch('https://ciphera-status.b-cdn.net/feed.json', { next: { revalidate: 60 } })
    if (r.ok) {
      const f = (await r.json()) as { overall?: string; generatedAt?: string }
      const age = f.generatedAt ? Date.now() - Date.parse(f.generatedAt) : Infinity
      if (age < STALE_AFTER_MS) overall = f.overall ?? null
    }
  } catch {
    overall = null
  }
  if (!overall) return null
  const ok = overall === 'operational'
  return (
    <a
      href="https://status.ciphera.net"
      target="_blank"
      rel="noopener noreferrer"
      data-footer-status=""
      className={cn('inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground', className)}
    >
      <span className={cn('h-2 w-2 rounded-full', ok ? 'bg-pos' : 'bg-neg')} aria-hidden="true" />
      {ok ? 'All systems operational' : 'Some services are degraded'}
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  )
}
