'use client'

/**
 * Round 1 mock header: floats over the hero, keeps the three dropdowns. Three chromes:
 *   bar   — Facet as written: opaque surface, hairline border, sharp corners.
 *   pill  — Facet tokens with `radius.full` for the bar and buttons; panels need one
 *           new radius (16px) that Facet does not have today.
 *   glass — the reference: translucent + backdrop-blur, white CTA (breaks Facet's
 *           "no backdrop-blur" and "orange is the CTA" rules).
 * Menu content assumes the Pulse-focus IA (one product menu); in the build it is
 * still the CMS menu document.
 */

import * as React from 'react'
import Image from 'next/image'
import * as Nav from '@radix-ui/react-navigation-menu'
import { ChevronDownIcon } from '@ciphera-net/facet'
import {
  Buildings,
  ShieldCheck,
  Leaf,
  Newspaper,
  EnvelopeSimple,
  Notebook,
  BookOpen,
  Lifebuoy,
  Pulse as PulseIcon,
  Code,
  ArrowUpRight,
  List,
  X,
} from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'
import { authIcon, cipheraIcon, pulseIcon } from '@/lib/images'

export type Chrome = 'bar' | 'pill' | 'glass' | 'barGlass' | 'pillGlass'

/** Shapes that use Facet's round token (`radius.full`) and the one panel radius. */
export const isRound = (c: Chrome) => c === 'pill' || c === 'glass' || c === 'pillGlass'
/** Tinted glass: Facet's surface (#0f0f0f) at 55%, blurred, with Facet's hairline. Floating chrome only. */
export const isGlass = (c: Chrome) => c === 'glass' || c === 'barGlass' || c === 'pillGlass'

type Item = { title: string; desc: string; href: string; icon: React.ComponentType<{ className?: string }> }

/** The Ciphera ID logo for the menu row that explains sign-in (owner 17-10). File 2375 × 2308: sized by height. */
function CipheraIdMark() {
  return <Image src={authIcon} alt="" width={20} height={19} unoptimized className="h-4 w-auto" />
}

const PRODUCTS: Item[] = [
  { title: 'Open source', desc: 'Tessera, the Pulse CLI and our integrations', href: '/trust#open-source', icon: Code },
  { title: 'How sign-in works', desc: 'Ciphera ID, the account behind our apps', href: '/trust#sign-in', icon: CipheraIdMark },
  { title: 'Documentation', desc: 'Install and use our software', href: 'https://docs.ciphera.net', icon: BookOpen },
]
const COMPANY: Item[] = [
  { title: 'About', desc: 'Who we are and how we work', href: '/about', icon: Buildings },
  { title: 'Trust & security', desc: 'How we protect data, and who we work with', href: '/trust', icon: ShieldCheck },
  { title: 'Sustainability', desc: 'Our carbon footprint', href: '/sustainability', icon: Leaf },
  { title: 'Press', desc: 'Brand assets and facts', href: '/about#press', icon: Newspaper },
  { title: 'Contact', desc: 'hello@ciphera.net', href: '/contact', icon: EnvelopeSimple },
]
const RESOURCES: Item[] = [
  { title: 'Blog', desc: 'Privacy, analytics and engineering', href: '/blog', icon: Notebook },
  { title: 'Glossary', desc: 'Privacy terms in plain language', href: '/glossary', icon: BookOpen },
  { title: 'Documentation', desc: 'Install and use Pulse', href: 'https://docs.ciphera.net', icon: Code },
  { title: 'Help center', desc: 'Answers and support', href: 'https://help.ciphera.net', icon: Lifebuoy },
  { title: 'Status', desc: 'Live service status', href: 'https://status.ciphera.net', icon: PulseIcon },
]

// The cluster on the right (menus + actions); the logo stands alone on the left, as in the reference.
// 🔴 The cluster's SURFACE is a separate background layer, never a class on the element that contains the
// dropdown panel. An element with `backdrop-filter` is a "backdrop root": a blurred child inside it can only blur
// the parent's own contents, so the panel would show the page behind it unblurred.
const surface: Record<Chrome, string> = {
  bar: 'border border-border bg-card',
  pill: 'rounded-full border border-border bg-card',
  glass: 'rounded-full bg-white/[0.06] ring-1 ring-white/10 backdrop-blur-md',
  barGlass: 'border border-white/[0.08] bg-[#0f0f0f]/55 backdrop-blur-xl backdrop-saturate-150',
  pillGlass: 'rounded-full border border-white/[0.08] bg-[#0f0f0f]/55 backdrop-blur-xl backdrop-saturate-150',
}
// Behind the whole header once the page scrolls: over content, a free-standing logo would sit on the text.
const band: Record<Chrome, string> = {
  bar: 'border-b border-border bg-background',
  pill: 'border-b border-border bg-background',
  glass: 'border-b border-white/[0.06] bg-[#0a0a0a]/60 backdrop-blur-xl backdrop-saturate-150',
  barGlass: 'border-b border-white/[0.06] bg-[#0a0a0a]/60 backdrop-blur-xl backdrop-saturate-150',
  pillGlass: 'border-b border-white/[0.06] bg-[#0a0a0a]/60 backdrop-blur-xl backdrop-saturate-150',
}
const trigger: Record<Chrome, string> = {
  bar: 'h-9 px-3 hover:bg-accent data-[state=open]:bg-accent',
  pill: 'h-9 rounded-full px-3.5 hover:bg-white/[0.06] data-[state=open]:bg-white/[0.06]',
  glass: 'h-9 rounded-full px-3.5 hover:bg-white/10 data-[state=open]:bg-white/10',
  barGlass: 'h-9 px-3 hover:bg-white/[0.06] data-[state=open]:bg-white/[0.06]',
  pillGlass: 'h-9 rounded-full px-3.5 hover:bg-white/[0.06] data-[state=open]:bg-white/[0.06]',
}
const panel: Record<Chrome, string> = {
  bar: 'border border-border bg-card',
  pill: 'rounded-[16px] border border-border bg-card',
  glass: 'rounded-[18px] bg-[#121212]/80 ring-1 ring-white/10 backdrop-blur-xl',
  barGlass: 'border border-white/[0.08] bg-[#0f0f0f]/75 backdrop-blur-2xl backdrop-saturate-150',
  pillGlass: 'rounded-[16px] border border-white/[0.08] bg-[#0f0f0f]/75 backdrop-blur-2xl backdrop-saturate-150',
}
const tile: Record<Chrome, string> = {
  bar: 'hover:bg-accent',
  pill: 'rounded-[10px] hover:bg-white/[0.05]',
  glass: 'rounded-[12px] hover:bg-white/[0.07]',
  barGlass: 'hover:bg-white/[0.05]',
  pillGlass: 'rounded-[10px] hover:bg-white/[0.05]',
}
const feature: Record<Chrome, string> = {
  bar: 'border border-border bg-background',
  pill: 'rounded-[12px] border border-border bg-background',
  glass: 'rounded-[14px] bg-white/[0.04] ring-1 ring-white/10',
  barGlass: 'border border-white/[0.06] bg-black/30',
  pillGlass: 'rounded-[12px] border border-white/[0.06] bg-black/30',
}

function Row({ item, chrome }: { item: Item; chrome: Chrome }) {
  const Icon = item.icon
  return (
    <Nav.Link asChild>
      <a href={item.href} className={cn('flex items-start gap-3 p-2.5 transition-colors duration-150', tile[chrome])}>
        <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border', isGlass(chrome) ? 'border-white/[0.08] bg-black/30' : 'border-border bg-background', isRound(chrome) && 'rounded-[8px]')}>
          <Icon className="h-4 w-4 text-foreground" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground">{item.title}</span>
          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{item.desc}</span>
        </span>
      </a>
    </Nav.Link>
  )
}

function Menu({ label, chrome, children }: { label: string; chrome: Chrome; children: React.ReactNode }) {
  return (
    <Nav.Item>
      <Nav.Trigger
        data-mock-trigger={label}
        className={cn(
          'group relative inline-flex items-center text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:text-foreground',
          // The panel opens 18 px below the trigger and Radix closes it 150 ms after the pointer leaves the trigger, so
          // a slow pointer lost it on the way down (accessibility review, 18-10-2026). This invisible strip keeps the
          // pointer on the trigger until it reaches the panel.
          "after:absolute after:inset-x-0 after:top-full after:h-5 after:content-['']",
          trigger[chrome],
        )}
      >
        {label}
        <ChevronDownIcon aria-hidden="true" className="ml-1 h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
      </Nav.Trigger>
      <Nav.Content className="absolute left-0 top-0 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out">
        {children}
      </Nav.Content>
    </Nav.Item>
  )
}

function Cta({ chrome, kind, href, className, children }: { chrome: Chrome; kind: 'primary' | 'secondary'; href: string; className?: string; children: React.ReactNode }) {
  const base = 'inline-flex h-10 items-center gap-1.5 px-4 text-sm font-medium transition-colors duration-150'
  const styles: Record<Chrome, Record<'primary' | 'secondary', string>> = {
    bar: {
      primary: 'bg-primary text-primary-foreground hover:bg-[#E54E00]',
      secondary: 'border border-border text-foreground hover:bg-accent',
    },
    pill: {
      primary: 'rounded-full bg-primary text-primary-foreground hover:bg-[#E54E00]',
      secondary: 'rounded-full text-foreground hover:bg-white/[0.06]',
    },
    glass: {
      primary: 'rounded-full bg-white text-neutral-900 hover:bg-white/90',
      secondary: 'rounded-full text-white/85 hover:text-white',
    },
    barGlass: {
      primary: 'bg-primary text-primary-foreground hover:bg-[#E54E00]',
      secondary: 'text-foreground hover:bg-white/[0.06]',
    },
    pillGlass: {
      primary: 'rounded-full bg-primary text-primary-foreground hover:bg-[#E54E00]',
      secondary: 'rounded-full text-foreground hover:bg-white/[0.06]',
    },
  }
  return (
    <a href={href} className={cn(base, styles[chrome][kind], className)}>
      {children}
    </a>
  )
}

/**
 * Row's icon and title without Radix's Nav.Link, for the phone menu (which is not inside a NavigationMenu root). The
 * descriptions stay on the desktop dropdowns: on a phone they doubled the list's height and pushed the actions off the
 * screen.
 */
function PlainRow({ item, chrome, onNavigate }: { item: Item; chrome: Chrome; onNavigate: () => void }) {
  const Icon = item.icon
  return (
    <a href={item.href} onClick={onNavigate} className={cn('flex items-center gap-3 px-2.5 py-2 transition-colors duration-150', tile[chrome])}>
      <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center border', isGlass(chrome) ? 'border-white/[0.08] bg-black/30' : 'border-border bg-background', isRound(chrome) && 'rounded-[8px]')}>
        <Icon className="h-4 w-4 text-foreground" />
      </span>
      <span className="text-sm font-medium text-foreground">{item.title}</span>
    </a>
  )
}

const MOBILE_MENU_ID = 'site-menu-mobile'

/**
 * The phone menu (below md, where the cluster is hidden): the button opens one panel with the desktop menus' own rows
 * under their three labels, the Pulse tile, and the two actions. A disclosure, not a dialog: the page stays where it is,
 * Escape closes it and returns focus to the button, following a link closes it, and it closes when the desktop
 * cluster takes over at md. Same panel surface as the desktop dropdowns.
 */
function MobileMenu({ chrome }: { chrome: Chrome }) {
  const [open, setOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const panelRef = React.useRef<HTMLElement>(null)
  const close = React.useCallback(() => setOpen(false), [])

  // A disclosure, not a dialog, so nothing traps focus; instead the panel closes as soon as focus or a tap lands
  // outside the button and the panel. Without this, Tab walked on into the page behind the open panel and the links
  // it covered took focus unseen (accessibility review, 18-10-2026).
  React.useEffect(() => {
    if (!open) return
    const inside = (t: EventTarget | null) =>
      t instanceof Node && (buttonRef.current?.contains(t) || panelRef.current?.contains(t))
    const onFocusIn = (e: FocusEvent) => !inside(e.target) && setOpen(false)
    const onPointerDown = (e: PointerEvent) => !inside(e.target) && setOpen(false)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const wide = window.matchMedia('(min-width: 768px)')
    const onWide = () => wide.matches && setOpen(false)
    document.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  const groups: [string, Item[]][] = [
    ['Products', PRODUCTS],
    ['Company', COMPANY],
    ['Resources', RESOURCES],
  ]
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={MOBILE_MENU_ID}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden',
          chrome === 'bar' ? 'border border-border' : chrome === 'barGlass' ? 'border border-white/[0.08] bg-[#0f0f0f]/55 backdrop-blur-xl backdrop-saturate-150' : chrome === 'pillGlass' ? 'rounded-full border border-white/[0.08] bg-[#0f0f0f]/55 backdrop-blur-xl backdrop-saturate-150' : 'rounded-full bg-white/[0.06] ring-1 ring-white/10',
        )}
      >
        {open ? <X className="h-5 w-5 text-foreground" aria-hidden="true" /> : <List className="h-5 w-5 text-foreground" aria-hidden="true" />}
      </button>
      {open && (
        <nav
          ref={panelRef}
          id={MOBILE_MENU_ID}
          aria-label="Site"
          data-mock="menu-panel-mobile"
          className={cn(
            'absolute inset-x-6 top-full mt-3 flex max-h-[calc(100svh-6.5rem)] flex-col animate-in fade-in zoom-in-95 motion-reduce:animate-none sm:inset-x-10 md:hidden',
            panel[chrome],
          )}
        >
          <div className="min-h-0 overflow-y-auto overscroll-contain p-2">
            <a href="https://pulse.ciphera.net" onClick={close} className={cn('flex items-center gap-3 p-3', feature[chrome])}>
              <Image src={pulseIcon} alt="" width={22} height={32} unoptimized className="h-7 w-auto" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">Pulse Analytics</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">Web analytics with no cookies, hosted in Switzerland.</span>
              </span>
            </a>
            {groups.map(([label, items]) => (
              <div key={label} className="mt-2">
                <p id={`${MOBILE_MENU_ID}-${label.toLowerCase()}`} className="px-2.5 pb-1 pt-2 text-xs text-muted-foreground">
                  {label}
                </p>
                <ul aria-labelledby={`${MOBILE_MENU_ID}-${label.toLowerCase()}`} className="grid gap-0.5">
                  {items.map((it) => (
                    <li key={it.title}>
                      <PlainRow item={it} chrome={chrome} onNavigate={close} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* The two actions stay in view while the list scrolls. */}
          <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-white/[0.06] p-3">
            <Cta chrome={chrome} kind="secondary" href="https://id.ciphera.net/login" className="justify-center border border-white/[0.08]">Sign in</Cta>
            <Cta chrome={chrome} kind="primary" href="/contact" className="justify-center">Contact</Cta>
          </div>
        </nav>
      )}
    </>
  )
}

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = React.useState(false)
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [threshold])
  return scrolled
}

/**
 * `fit` (R3b, 17-10, owner: "on all the inner pages, the header looks crammed... the logo is very stuck to the left"):
 *   column — today: the header box is the content column (max-w-6xl), so on inner pages the logo and the menu sit ON
 *            the column's side rails (on the homepage the hero hides them).
 *   inset  — the same box, padded like the content (px-6, sm:px-10): the logo lines up with the page's text edge.
 *   wide   — a wider box (max-w-7xl): the logo and the menu sit outside the rails.
 */
export type HeaderFit = 'column' | 'inset' | 'wide'

// D25 (owner 17-10, "inset it is"): inset is the default on every page; 'column' and 'wide' stay for comparison.
export function OverhaulHeader({ chrome, fit = 'inset' }: { chrome: Chrome; fit?: HeaderFit }) {
  const scrolled = useScrolled()
  return (
    <header data-scrolled={scrolled} data-header-fit={fit} className={cn('fixed inset-x-0 top-0 z-50 pt-4', fit !== 'inset' && 'px-4')}>
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-[88px] transition-opacity duration-300 ease-apple motion-reduce:transition-none',
          band[chrome],
          scrolled ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div className={cn('relative mx-auto flex h-14 w-full items-center justify-between', fit === 'wide' ? 'max-w-7xl' : 'max-w-6xl', fit === 'inset' && 'px-6 sm:px-10')}>
        <a href="/" className="flex items-center gap-2.5">
          <Image src={cipheraIcon} alt="" width={27} height={28} unoptimized priority className="h-7 w-auto" />
          <span className="text-[17px] font-semibold tracking-tight text-foreground">Ciphera</span>
        </a>

        <Nav.Root delayDuration={80} className={cn('relative isolate hidden h-12 items-center gap-1 pl-1.5 pr-1.5 md:flex', isRound(chrome) && 'rounded-full')}>
          <span aria-hidden="true" className={cn('pointer-events-none absolute inset-0 -z-10', surface[chrome])} />
          <Nav.List className="flex items-center gap-0.5">
            <Menu label="Products" chrome={chrome}>
              <div className="grid w-[560px] grid-cols-[240px_1fr] gap-2 p-2">
                <a href="https://pulse.ciphera.net" className={cn('flex flex-col justify-between p-4', feature[chrome])}>
                  <span>
                    <Image src={pulseIcon} alt="" width={22} height={32} unoptimized className="h-8 w-auto" />
                    <span className="mt-4 block text-base font-semibold text-foreground">Pulse Analytics</span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                      Web analytics with no cookies, hosted in Switzerland.
                    </span>
                  </span>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    pulse.ciphera.net <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </a>
                <div className="grid content-start gap-0.5">
                  {PRODUCTS.map((it) => (
                    <Row key={it.title} item={it} chrome={chrome} />
                  ))}
                </div>
              </div>
            </Menu>
            <Menu label="Company" chrome={chrome}>
              <div className="grid w-[300px] gap-0.5 p-2">
                {COMPANY.map((it) => (
                  <Row key={it.title} item={it} chrome={chrome} />
                ))}
              </div>
            </Menu>
            <Menu label="Resources" chrome={chrome}>
              <div className="grid w-[300px] gap-0.5 p-2">
                {RESOURCES.map((it) => (
                  <Row key={it.title} item={it} chrome={chrome} />
                ))}
              </div>
            </Menu>
          </Nav.List>
          <div className="h-5 w-px bg-border" aria-hidden="true" />
          <Cta chrome={chrome} kind="secondary" href="https://id.ciphera.net/login">Sign in</Cta>
          <Cta chrome={chrome} kind="primary" href="/contact">
            Contact {chrome === 'glass' && <ArrowUpRight className="h-3.5 w-3.5" />}
          </Cta>
          {/* The wrapper lets the pointer through (only the panel takes it): its top margin is the gap the triggers'
              strips bridge, and painted over them it made the pointer leave the trigger on the way down. */}
          <div className="pointer-events-none absolute right-0 top-full flex justify-end">
            <Nav.Viewport
              data-mock="menu-panel"
              className={cn(
                'pointer-events-auto relative mt-3 h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] overflow-hidden transition-[width,height] duration-200 motion-reduce:transition-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out',
                panel[chrome],
              )}
            />
          </div>
        </Nav.Root>

        <MobileMenu chrome={chrome} />
      </div>
    </header>
  )
}
