/**
 * Round 4 (mock, 17-10-2026): the About page's "press" block (R4), options A/B/C. id="press" (Section sets
 * scroll-mt-24) because /press redirects to /about#press. Copy is entirely PRESS from content.ts.
 *
 * 🔑 Measured 17-10-2026 by sampling the three PNGs (not assumed): the full "Ciphera logo" (wordmark) renders its
 * "Ciphera" text as a SOLID near-black fill, rgb(28,28,28) — against the dark page (~rgb(10,10,10)) or bg-card
 * (~rgb(15,15,15)) that is a ~1.9:1 contrast, unreadable. The two icon-only marks (no text) are an orange-to-
 * charcoal gradient whose darkest sampled pixels are rgb(40,40,40)–rgb(86,31,11) — they read on both a dark and a
 * light backing. So every preview here sits on a light (white) swatch by default, and only an icon-only mark is
 * ever put on a dark one. No mark is actually "white" (the brief's suspicion), but the wordmark's text is
 * effectively the same problem in reverse: dark-on-dark, not light-on-light.
 *
 * The three options differ in DEVICE, per the brief:
 *   A — boilerplate card (copy button on top) → three asset tiles in a row → contact line.
 *   B — brand board (Exoscale-style): the three marks shown large, download links under each, boilerplate below.
 *   C — compact two columns: boilerplate left, assets as a small-preview list right, contact under the list.
 *   D — Round 4b (17-10, owner: "missing colors"): a full brand board. PRESS.colours first, as three large solid
 *       swatches (the only legitimate "tinted panel" in this round — a colour swatch's whole job is to show the
 *       colour) with a copy-hex button each; then the three PRESS.assets large, both icon-only marks on dark tiles
 *       (their gradients read there — see the measurement above) and the wordmark on a light tile (its text does
 *       not); then the same boilerplate card, usage note and contact line as B.
 */
import Image from 'next/image'
import { DownloadSimple, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'
import { cdnUrl } from '@/lib/cdn'
import { Section } from '../home/Section'
import { CopyBoilerplate } from './PressClient'
import { PRESS } from './content'

type Asset = (typeof PRESS.assets)[number]

/** A single asset's preview, backed by a light or dark swatch (see the file header for which, and why). The image
 *  keeps its true aspect ratio (explicit width/height = the real pixel size, scaled by height only via className,
 *  per asset.file). */
// Sized by max-height and max-width only: with both auto, CSS keeps the file's ratio inside the box. A fixed h-* lets
// flexbox shrink the width alone when the box is narrower than the logo, which stretched it (harness r4, 17-10).
function AssetMark({
  asset,
  tone,
  boxClassName,
  imgClassName,
}: {
  asset: Asset
  tone: 'light' | 'dark'
  boxClassName: string
  imgClassName: string
}) {
  return (
    <div className={cn('flex items-center justify-center border border-border', tone === 'light' ? 'bg-white' : 'bg-card', boxClassName)}>
      <Image src={cdnUrl(asset.file)} alt={asset.label} width={asset.w} height={asset.h} unoptimized className={imgClassName} />
    </div>
  )
}

function downloadName(file: string) {
  return file.replace(/^\//, '')
}

/** D's colour board: true for a swatch close enough to the page's own background (~rgb(10,10,10)) that it needs a
 *  hairline border to read as a distinct block at all — measured by perceived brightness, not a name match, so it
 *  still does the right thing if PRESS.colours ever changes. */
function colourSwatchNeedsBorder(hex: string) {
  const v = hex.replace('#', '')
  const r = parseInt(v.slice(0, 2), 16)
  const g = parseInt(v.slice(2, 4), 16)
  const b = parseInt(v.slice(4, 6), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b < 40
}

function ContactLine({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground">{PRESS.contactLabel}</p>
      <a
        href={`mailto:${PRESS.email}`}
        className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-medium text-foreground transition-colors duration-150 hover:text-primary"
      >
        <EnvelopeSimple className="h-4 w-4 shrink-0" aria-hidden="true" /> {PRESS.email}
      </a>
    </div>
  )
}

function BoilerplateCard({ className }: { className?: string }) {
  return (
    <div className={cn('border border-border bg-card p-7 sm:p-8', className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{PRESS.boilerplateLabel}</p>
        <CopyBoilerplate text={PRESS.boilerplate} label={`Copy the ${PRESS.boilerplateLabel.toLowerCase()}`} />
      </div>
      <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-foreground/90">{PRESS.boilerplate}</p>
    </div>
  )
}

/**
 * Option A — boilerplate card (label + copy button on top, text below), then the three assets as a tiled row
 * (the OpenByDefault/RECORD grid idiom: hairline-divided cells on a shared border), then the usage note and the
 * contact line. The plainest, most conventional press-kit layout of the three.
 */
export function PressA() {
  return (
    <Section id="press" eyebrow={PRESS.eyebrow} title={PRESS.title} lead={PRESS.lead}>
      <BoilerplateCard />

      <div className="mt-10 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
        {PRESS.assets.map((a) => (
          <div key={a.file} className="flex flex-col bg-background p-6">
            <AssetMark asset={a} tone="light" boxClassName="h-24 w-full sm:h-28" imgClassName="h-auto w-auto max-h-12 max-w-[85%] sm:max-h-14" />
            <p className="mt-4 text-[15px] font-medium text-foreground">{a.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{a.note}</p>
            <p className="mt-1 text-xs tabular-nums text-muted-foreground">
              {a.w} × {a.h}px
            </p>
            <a
              href={cdnUrl(a.file)}
              download={downloadName(a.file)}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary"
            >
              <DownloadSimple className="h-4 w-4 shrink-0" aria-hidden="true" /> Download PNG
            </a>
          </div>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">{PRESS.usage}</p>

      <ContactLine className="mt-8 border-t border-border pt-8" />
    </Section>
  )
}

/**
 * Option B — brand board: the three marks shown large, first (the board reads left to right the same order as
 * PRESS.assets). Tones are NOT a naive light/dark/light checker — they follow the measured contrast: the wordmark
 * (index 0) is forced light because its text is dark-on-dark on any darker tile; the icon-only mark at index 1
 * goes dark, since its gradient genuinely reads there, which is also the realistic case (an icon placed on a dark
 * page); the product icon at index 2 stays light. Download links sit under each mark, the boilerplate card below.
 */
export function PressB() {
  return (
    <Section id="press" eyebrow={PRESS.eyebrow} title={PRESS.title} lead={PRESS.lead}>
      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
        {PRESS.assets.map((a, i) => {
          const tone: 'light' | 'dark' = i === 1 ? 'dark' : 'light'
          return (
            <div key={a.file} className="flex flex-col bg-background p-7 sm:p-8">
              <AssetMark asset={a} tone={tone} boxClassName="h-32 w-full sm:h-40 lg:h-48" imgClassName="h-auto w-auto max-h-16 max-w-[85%] sm:max-h-20 lg:max-h-24" />
              <p className="mt-5 text-[15px] font-medium text-foreground">{a.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{a.note}</p>
              <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                {a.w} × {a.h}px
              </p>
              <a
                href={cdnUrl(a.file)}
                download={downloadName(a.file)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary"
              >
                <DownloadSimple className="h-4 w-4 shrink-0" aria-hidden="true" /> Download PNG
              </a>
            </div>
          )
        })}
      </div>

      <BoilerplateCard className="mt-14" />

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">{PRESS.usage}</p>

      <ContactLine className="mt-8 border-t border-border pt-8" />
    </Section>
  )
}

/**
 * Option C — compact two columns: boilerplate (+ copy button, + the usage note) left; the three assets as a
 * divided list — small preview, label, note, pixel size, a download button — right, the contact line closing the
 * list directly beneath it. The densest of the three, built for someone who already knows what they want.
 */
export function PressC() {
  return (
    <Section id="press" eyebrow={PRESS.eyebrow} title={PRESS.title} lead={PRESS.lead}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{PRESS.boilerplateLabel}</p>
            <CopyBoilerplate text={PRESS.boilerplate} label={`Copy the ${PRESS.boilerplateLabel.toLowerCase()}`} />
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">{PRESS.boilerplate}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{PRESS.usage}</p>
        </div>

        <div>
          <div className="border-t border-border">
            {PRESS.assets.map((a) => (
              <div key={a.file} className="flex items-center gap-4 border-b border-border py-5">
                <AssetMark asset={a} tone="light" boxClassName="h-14 w-20 shrink-0" imgClassName="h-auto w-auto max-h-8 max-w-[85%]" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-foreground">{a.label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{a.note}</p>
                  <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                    {a.w} × {a.h}px
                  </p>
                </div>
                <a
                  href={cdnUrl(a.file)}
                  download={downloadName(a.file)}
                  aria-label={`Download ${a.label}`}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 border border-border px-3 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary"
                >
                  <DownloadSimple className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </div>
            ))}
          </div>

          <ContactLine className="mt-6" />
        </div>
      </div>
    </Section>
  )
}

/**
 * Option D — Round 4b, owner: "the whole page is missing colors" / "not really cool like the landing page". A full
 * brand board: PRESS.colours as three large swatches (the colour's own block + name + hex, a copy-hex button),
 * then the three PRESS.assets large (icon marks on dark, wordmark on light, per the measured contrast above), then
 * the same boilerplate card, usage note and contact line as B. The colour comes entirely from the swatches and the
 * marks' own brand colours — no tinted panel backgrounds are introduced beyond the swatches themselves.
 */
export function PressD() {
  return (
    <Section id="press" eyebrow={PRESS.eyebrow} title={PRESS.title} lead={PRESS.lead}>
      <p className="text-sm text-muted-foreground">{PRESS.coloursLabel}</p>
      <div className="mt-4 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
        {PRESS.colours.map((c) => (
          <div key={c.hex} className="flex flex-col bg-background p-6">
            <div
              className={cn('h-[120px] w-full', colourSwatchNeedsBorder(c.hex) && 'border border-border')}
              style={{ backgroundColor: c.hex }}
              aria-hidden="true"
            />
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-foreground">{c.name}</p>
                <p className="mt-1 font-mono text-sm text-muted-foreground">{c.hex}</p>
              </div>
              <CopyBoilerplate
                text={c.hex}
                label={`Copy ${c.name.toLowerCase()} ${c.hex}`}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 border border-border px-2.5 text-xs font-medium text-foreground transition-colors duration-150 hover:text-primary"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
        {PRESS.assets.map((a, i) => {
          const tone: 'light' | 'dark' = i === 0 ? 'light' : 'dark'
          return (
            <div key={a.file} className="flex flex-col bg-background p-7 sm:p-8">
              <AssetMark asset={a} tone={tone} boxClassName="h-32 w-full sm:h-40 lg:h-48" imgClassName="h-auto w-auto max-h-16 max-w-[85%] sm:max-h-20 lg:max-h-24" />
              <p className="mt-5 text-[15px] font-medium text-foreground">{a.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{a.note}</p>
              <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                {a.w} × {a.h}px
              </p>
              <a
                href={cdnUrl(a.file)}
                download={downloadName(a.file)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary"
              >
                <DownloadSimple className="h-4 w-4 shrink-0" aria-hidden="true" /> Download PNG
              </a>
            </div>
          )
        })}
      </div>

      <BoilerplateCard className="mt-14" />

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">{PRESS.usage}</p>

      <ContactLine className="mt-8 border-t border-border pt-8" />
    </Section>
  )
}
