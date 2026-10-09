/**
 * WEB-28 build task §2 — the explicit registries that resolve a product-page
 * section's SELECT fields (icon / mockup / diagram / code / langIcon / registryIcon)
 * to the real component or CDN asset the coded product pages already use.
 *
 * Every key here is one of `lib/cms/page-build.ts`'s closed catalogs (`ICON_KEYS`,
 * `VISUAL_KEYS`, `LANG_ICON_KEYS`, `REGISTRY_ICON_KEYS`) — page-build.ts has ALREADY
 * dropped any section carrying a key outside those catalogs, with a repair, before a
 * document ever reaches this module. A lookup here can therefore assume its key is
 * valid; `?? null` guards exist only for the theoretical gap between the two lists
 * (kept in sync by the shared type `IconKey`/`VisualKey`), never for agency input.
 *
 * Contract: Public/docs/plans/08-10-2026-web28-product-sections-contract.md §3.
 *
 * 🔑 ICON SIZE/COLOR IS CONTEXT-SPECIFIC, NOT ONE SHARED CLASS. Measuring every
 * instance on all five pages (not one representative) found FOUR distinct
 * icon treatments sharing the same closed `ICON_KEYS` catalog: a hero/band trust
 * badge (`h-3.5 w-3.5`, no color class — it inherits the badge span's own
 * `text-muted-foreground`), a `feature-grid` item (`h-5 w-5 text-muted-foreground`),
 * a `feature-split` photo overlay badge (`h-4 w-4 shrink-0 text-muted-foreground`),
 * and a `comparison-cards` generic tile icon (`h-5 w-5 text-muted-foreground`, same
 * as `feature-grid`). None of the `@ciphera-net/facet-sections` components wrap an
 * injected icon in a sizing class of their own — `ProductBanner` renders
 * `{badge.icon}` directly, `FeatureGrid` renders `{item.icon}` directly, and so on —
 * so the size/color must be baked into the ReactNode this module hands back, per
 * call site. `resolveIcon()` (generic, `h-4 w-4`, no color) is kept only as a
 * reasonable default for a context no real page exercises today (e.g. a generic
 * icon in a `content-block` chip); every PROVEN call site below has its own
 * context-specific resolver instead.
 *
 * All three hand-built protocol diagrams (`diagram-captcha-stateless`,
 * `diagram-id-zero-knowledge`, `diagram-tessera-opaque-handshake`) are now
 * extracted into their own components under `components/ui/` — the coded pages
 * import them too, so there is one definition, not a duplicate. The four mockups
 * and both code snippets were already wired this way.
 */
import type { ReactNode, ComponentType } from 'react'
import Image from 'next/image'
import {
  GlobeIcon,
  LockIcon,
  CheckIcon,
  XIcon,
  ArrowRightIcon,
  GithubIcon,
} from '@ciphera-net/facet'
import {
  PuzzlePiece,
  ShieldCheck,
  Lightning,
  EyeSlash,
  Timer,
  Robot,
  Eye,
  Key,
  Vault,
  Cookie,
  Code,
  Globe,
  Funnel,
  EnvelopeSimple,
  Lock,
} from '@phosphor-icons/react/dist/ssr'
import { CaptchaMockup } from '@/components/ui/captcha-mockup'
import { AuthMockup } from '@/components/ui/auth-mockup'
import { RelayMockup } from '@/components/ui/relay-mockup'
import { PulseMockupTall } from '@/components/ui/pulse-mockup'
import { RelaySmtpEnvCode } from '@/components/ui/relay-smtp-env-code'
import { PulseScriptTagCode } from '@/components/ui/pulse-script-tag-code'
import { CaptchaStatelessDiagram } from '@/components/ui/captcha-stateless-diagram'
import { IdZeroKnowledgeDiagram } from '@/components/ui/id-zero-knowledge-diagram'
import { TesseraOpaqueHandshakeDiagram } from '@/components/ui/tessera-opaque-handshake-diagram'
import { authIcon, pulseIcon } from '@/lib/images'
import { cdnUrl } from '@/lib/cdn'
import type { IconKey, VisualKey } from './page-build'

type IconProps = { className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }

/**
 * The underlying icon COMPONENTS (never a pre-sized element) — every
 * `icon`/`langIcon`(n/a here)/chip-`image` select's target, minus the two
 * product-logo keys (`logo-id`, `logo-pulse`), which are images, not Phosphor/Facet
 * components (see `PRODUCT_LOGO_REGISTRY` below).
 */
const ICON_COMPONENTS: Record<Exclude<IconKey, 'logo-id' | 'logo-pulse'>, ComponentType<IconProps>> = {
  'puzzle-piece': PuzzlePiece,
  'shield-check': ShieldCheck,
  lightning: Lightning,
  'eye-slash': EyeSlash,
  timer: Timer,
  robot: Robot,
  eye: Eye,
  key: Key,
  vault: Vault,
  cookie: Cookie,
  code: Code,
  globe: Globe,
  funnel: Funnel,
  'envelope-simple': EnvelopeSimple,
  lock: Lock,
  'globe-outline': GlobeIcon,
  'lock-outline': LockIcon,
  check: CheckIcon,
  x: XIcon,
  'arrow-right': ArrowRightIcon,
  github: GithubIcon,
}

function iconComponentFor(key: string): ComponentType<IconProps> | null {
  return (ICON_COMPONENTS as Record<string, ComponentType<IconProps>>)[key] ?? null
}

/** Generic fallback (`h-4 w-4`, no color) — kept for a context no real page
 * exercises today. Every proven call site has its own sized resolver below. */
export function resolveIcon(key: string): ReactNode {
  const Icon = iconComponentFor(key)
  return Icon ? <Icon aria-hidden="true" className="h-4 w-4" /> : null
}

/** `product-banner.trustBadges[].icon` — hero/band trust-badge row. Measured on all
 * four pages that carry an icon there (Captcha, Pulse, Relay, Ciphera ID):
 * `h-3.5 w-3.5`, no color class (inherits the badge span's own muted text color). */
export function resolveTrustBadgeIcon(key: string): ReactNode {
  const Icon = iconComponentFor(key)
  return Icon ? <Icon aria-hidden="true" className="h-3.5 w-3.5" /> : null
}

/** `feature-grid.items[].icon` — the divided icon-card grid. Measured on Captcha,
 * Relay, Pulse and Ciphera ID: `h-5 w-5 text-muted-foreground`. */
export function resolveFeatureGridIcon(key: string): ReactNode {
  const Icon = iconComponentFor(key)
  return Icon ? <Icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" /> : null
}

/** `feature-split.overlayBadges[].icon` — the `photo` visual type's bottom-overlaid
 * info chips. Measured on all four photo splits: `h-4 w-4 shrink-0 text-muted-foreground`. */
export function resolveOverlayBadgeIcon(key: string): ReactNode {
  const Icon = iconComponentFor(key)
  return Icon ? <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" /> : null
}

/**
 * `content-block` `chips[].image` — Tessera's "#who-uses-it" row. Measured there:
 * BOTH chips are the Ciphera ID / Pulse product marks, `h-5 w-5 object-contain`, no
 * grayscale (unlike a comparison card's "theirs" logo — a chip is always OUR OWN
 * ecosystem, never a competitor). No real page puts a generic Phosphor icon in a
 * chip today; `resolveIcon()` is the fallback for that untested case.
 */
const PRODUCT_LOGO_CHIP_REGISTRY: Record<string, ReactNode> = {
  'logo-id': <Image src={authIcon} alt="" width={20} height={20} unoptimized aria-hidden="true" className="h-5 w-5 object-contain" />,
  'logo-pulse': <Image src={pulseIcon} alt="" width={20} height={20} unoptimized aria-hidden="true" className="h-5 w-5 object-contain" />,
}
export function resolveChipImage(key: string): ReactNode {
  return PRODUCT_LOGO_CHIP_REGISTRY[key] ?? resolveIcon(key)
}

/**
 * `comparison-cards` `ours.icon` / `theirs.icon`. 🔑 THIS FIELD IS NOT A CLOSED
 * SELECT on either side — WordPress's own editor presents it as a free "Icon (CDN
 * path)" `TextControl` (mu-plugins/ciphera-page-blocks.js), and
 * `ciphera_page_parse_sections()` runs no `ciphera_page_check_select()` on it
 * either (contrast every true select field, which does). Measured across all three
 * pages that have a comparison section: `ours` is always the product's OWN mark
 * (Captcha/Pulse: `next/image`, `h-6 w-6 object-contain`, no grayscale — brand color
 * stays); `theirs` is either a generic Phosphor icon (Captcha's `eye`, a value that
 * happens to also be a known `ICON_KEYS` entry — the editor's free-text field can
 * hold either) or a literal competitor-logo CDN path, muted (Pulse's Google
 * Analytics favicon: a RAW `<img>`, `h-6 w-6 object-contain grayscale` — graying out
 * a competitor's own mark is deliberate, so the fallback for an unrecognised
 * `theirs` value renders the same way). Resolution order: a known `ICON_KEYS` value
 * first, else the string is a curated image path.
 *
 * 🔴 Relay's own card icon is coded as a raw `<img>` (not `next/image`), an
 * inconsistency in the ORIGINAL hand-authored page — not a deliberate design
 * difference the section type needs to reproduce. This resolver follows the
 * dominant (`next/image`) pattern for `ours` uniformly; see the WEB-28 build
 * report for the one resulting byte-level difference on Relay's own comparison
 * card icon.
 */
export function resolveComparisonIcon(key: string, name: string, role: 'ours' | 'theirs'): ReactNode {
  if (!key) return null
  const Icon = iconComponentFor(key)
  if (Icon) {
    return <Icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
  }
  if (role === 'ours') {
    return <Image src={key} alt={name} width={24} height={24} unoptimized className="h-6 w-6 object-contain" />
  }
  // eslint-disable-next-line @next/next/no-img-element -- byte-identical to the one
  // precedent for this field (Pulse's Google Analytics favicon): a raw <img>, never next/image.
  return <img src={key} alt={name} width={24} height={24} className="h-6 w-6 object-contain grayscale" />
}

/** §3 "Mockups"/"Diagrams"/"Code snippets" — `feature-split`'s `visualKey`, and
 * `content-block`'s `diagramKey` (via the `diagram-*` subset below). All three
 * protocol diagrams are extracted components, shared with the coded pages that
 * import them directly. */
export const VISUAL_REGISTRY: Record<VisualKey, ReactNode> = {
  'mockup-captcha': <CaptchaMockup />,
  'mockup-auth': <AuthMockup />,
  'mockup-relay': <RelayMockup />,
  'mockup-pulse-tall': <PulseMockupTall />,
  'diagram-captcha-stateless': <CaptchaStatelessDiagram />,
  'diagram-id-zero-knowledge': <IdZeroKnowledgeDiagram />,
  'diagram-tessera-opaque-handshake': <TesseraOpaqueHandshakeDiagram />,
  'code-relay-smtp-env': <RelaySmtpEnvCode />,
  'code-pulse-script-tag': <PulseScriptTagCode />,
}

export function resolveVisual(key: string): ReactNode {
  return (VISUAL_REGISTRY as Record<string, ReactNode>)[key] ?? null
}

/**
 * §3 "Curated images" — a `backgroundImage`/`image` field is a CDN path (never a
 * select key, per the contract), so this wraps it in the SAME `next/image fill` +
 * grayscale/darken treatment every coded hero/band/photo-split uses.
 *
 * `priority`: the hero variant of `product-banner` always sets `priority` on its
 * background `Image` (above-the-fold, LCP-critical — Captcha/Pulse/Ciphera
 * ID/Tessera all do); the closing band never does. Defaults to `false` (the band
 * case) so a caller must opt in explicitly for the hero.
 *
 * 🔴 Relay's hero/band both use a raw `<img>` in the original source (no `fill`,
 * no `sizes`, a Tailwind `absolute inset-0 h-full w-full` in place of `next/image`'s
 * own fill behaviour) — another pre-existing inconsistency, not a second code path
 * this helper reproduces. See the WEB-28 build report.
 */
export function productBackgroundImage(src: string, alt: string, priority = false): ReactNode {
  if (!src) return null
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      priority={priority}
      sizes="100vw"
      className="object-cover grayscale brightness-[0.4]"
    />
  )
}
export function featurePhotoImage(src: string, alt: string): ReactNode {
  if (!src) return null
  return <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover grayscale" />
}

/**
 * §3's Tessera-only closed catalogs — language and registry badges, now fully
 * wired (build task §3): each resolves to the exact `next/image` tag the coded
 * `/products/tessera` page renders for that language/registry, not a plain mono
 * label. Sizing/className measured from the coded page's `#packages` section.
 */
export const LANG_ICON_REGISTRY: Record<string, ReactNode> = {
  rust: (
    <Image src={cdnUrl('/icons/langs/rust.png')} alt="" width={24} height={16} unoptimized aria-hidden="true" className="h-4 w-auto max-w-[28px] object-contain grayscale" />
  ),
  go: (
    <Image src={cdnUrl('/icons/langs/go-wordmark.png')} alt="" width={24} height={16} unoptimized aria-hidden="true" className="h-4 w-auto max-w-[28px] object-contain grayscale" />
  ),
  ts: (
    <Image src={cdnUrl('/icons/langs/typescript.png')} alt="" width={24} height={16} unoptimized aria-hidden="true" className="h-4 w-auto max-w-[28px] object-contain grayscale" />
  ),
}
export const REGISTRY_ICON_REGISTRY: Record<string, ReactNode> = {
  'crates-io': (
    <Image src={cdnUrl('/icons/registries/rust.png')} alt="" width={24} height={16} unoptimized aria-hidden="true" className="h-4 w-6 object-contain grayscale transition-[filter] duration-fast group-hover:grayscale-0" />
  ),
  'go-pkg': (
    <Image src={cdnUrl('/icons/registries/go.png')} alt="" width={24} height={16} unoptimized aria-hidden="true" className="h-4 w-6 object-contain grayscale transition-[filter] duration-fast group-hover:grayscale-0" />
  ),
  npm: (
    <Image src={cdnUrl('/icons/registries/npm.png')} alt="" width={24} height={16} unoptimized aria-hidden="true" className="h-4 w-6 object-contain grayscale transition-[filter] duration-fast group-hover:grayscale-0" />
  ),
}
export function resolveLangIcon(key: string): ReactNode {
  return LANG_ICON_REGISTRY[key] ?? null
}
export function resolveRegistryIcon(key: string): ReactNode {
  return REGISTRY_ICON_REGISTRY[key] ?? null
}
