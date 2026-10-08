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
 * 🔴 NOT YET WIRED: the three hand-built protocol diagrams (`diagram-captcha-
 * stateless`, `diagram-id-zero-knowledge`, `diagram-tessera-opaque-handshake`) are
 * each 40-80 lines of bespoke inline SVG/markup inside their own coded page and were
 * not extracted into standalone components in this round (time-boxed; see the build
 * task's own report). Their registry entries resolve to `null` on purpose — a
 * `feature-split`/`content-block` section that selects one of these three keys
 * renders with an EMPTY visual cell today, not a crash and not a wrong diagram. The
 * four mockups and both code snippets ARE fully wired (extracted to
 * `components/ui/*` so the coded page and the CMS render share one component).
 */
import type { ReactNode } from 'react'
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
import type { IconKey, VisualKey } from './page-build'

const ICON_CLASS = 'h-4 w-4'

/** §3 "Icons" — every `icon`/`langIcon`/`registryIcon`/`image`(chip) select's target. */
export const ICON_REGISTRY: Record<IconKey, ReactNode> = {
  'puzzle-piece': <PuzzlePiece className={ICON_CLASS} aria-hidden="true" />,
  'shield-check': <ShieldCheck className={ICON_CLASS} aria-hidden="true" />,
  lightning: <Lightning className={ICON_CLASS} aria-hidden="true" />,
  'eye-slash': <EyeSlash className={ICON_CLASS} aria-hidden="true" />,
  timer: <Timer className={ICON_CLASS} aria-hidden="true" />,
  robot: <Robot className={ICON_CLASS} aria-hidden="true" />,
  eye: <Eye className={ICON_CLASS} aria-hidden="true" />,
  key: <Key className={ICON_CLASS} aria-hidden="true" />,
  vault: <Vault className={ICON_CLASS} aria-hidden="true" />,
  cookie: <Cookie className={ICON_CLASS} aria-hidden="true" />,
  code: <Code className={ICON_CLASS} aria-hidden="true" />,
  globe: <Globe className={ICON_CLASS} aria-hidden="true" />,
  funnel: <Funnel className={ICON_CLASS} aria-hidden="true" />,
  'envelope-simple': <EnvelopeSimple className={ICON_CLASS} aria-hidden="true" />,
  lock: <Lock className={ICON_CLASS} aria-hidden="true" />,
  'globe-outline': <GlobeIcon className={ICON_CLASS} aria-hidden="true" />,
  'lock-outline': <LockIcon className={ICON_CLASS} aria-hidden="true" />,
  check: <CheckIcon className={ICON_CLASS} aria-hidden="true" />,
  x: <XIcon className={ICON_CLASS} aria-hidden="true" />,
  'arrow-right': <ArrowRightIcon className={ICON_CLASS} aria-hidden="true" />,
  github: <GithubIcon className={ICON_CLASS} aria-hidden="true" />,
}

export function resolveIcon(key: string): ReactNode {
  return (ICON_REGISTRY as Record<string, ReactNode>)[key] ?? null
}

/** §3 "Mockups"/"Diagrams"/"Code snippets" — `feature-split`'s `visualKey`, and
 * `content-block`'s `diagramKey` (via the `diagram-*` subset below). */
export const VISUAL_REGISTRY: Record<VisualKey, ReactNode> = {
  'mockup-captcha': <CaptchaMockup />,
  'mockup-auth': <AuthMockup />,
  'mockup-relay': <RelayMockup />,
  'mockup-pulse-tall': <PulseMockupTall />,
  // Not extracted this round — see this file's header. An empty visual cell, never a crash.
  'diagram-captcha-stateless': null,
  'diagram-id-zero-knowledge': null,
  'diagram-tessera-opaque-handshake': null,
  'code-relay-smtp-env': <RelaySmtpEnvCode />,
  'code-pulse-script-tag': <PulseScriptTagCode />,
}

export function resolveVisual(key: string): ReactNode {
  return (VISUAL_REGISTRY as Record<string, ReactNode>)[key] ?? null
}

/** §3 "Curated images" — a `backgroundImage`/`image` field is a CDN path (never a
 * select key, per the contract), so this just wraps it in the SAME `next/image fill`
 * + grayscale/darken treatment every coded hero/band/photo-split uses — the markup
 * `ProductBanner`/`FeatureSplit` expect to receive already assembled. */
export function productBackgroundImage(src: string, alt: string): ReactNode {
  if (!src) return null
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
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
 * §3's Tessera-only closed catalogs — language and registry badges. Package's own
 * per-language/registry logo pairs stay code (contract §5) and were not extracted
 * this round (Tessera is not yet a migratable page — see the build task's report);
 * this renders a plain mono label in their place rather than a crash or a blank.
 */
export const LANG_ICON_REGISTRY: Record<string, ReactNode> = {
  rust: <span className="font-mono text-xs">rust</span>,
  go: <span className="font-mono text-xs">go</span>,
  ts: <span className="font-mono text-xs">ts</span>,
}
export const REGISTRY_ICON_REGISTRY: Record<string, ReactNode> = {
  'crates-io': <span className="font-mono text-xs">crates.io</span>,
  'go-pkg': <span className="font-mono text-xs">go-pkg</span>,
  npm: <span className="font-mono text-xs">npm</span>,
}
export function resolveLangIcon(key: string): ReactNode {
  return LANG_ICON_REGISTRY[key] ?? null
}
export function resolveRegistryIcon(key: string): ReactNode {
  return REGISTRY_ICON_REGISTRY[key] ?? null
}
