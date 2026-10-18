'use client'

/**
 * Round 1c, idea 2: the visitor's own browser details, read locally and struck through one by one.
 * Nothing is sent: the values are computed in this component and only rendered.
 * Claims (DRAFT, wording round): "no fingerprints" reuses the published claim; "no cookies" was measured on
 * ciphera.net 16-10-2026 (no cookies, no Set-Cookie, empty local/sessionStorage across three pages).
 */
import * as React from 'react'
import { LockSimple } from '@phosphor-icons/react/dist/ssr'

type Trait = { label: string; value: string | null }

function browserOf(ua: string) {
  const m =
    ua.match(/Edg\/(\d+)/) ? ['Edge', ua.match(/Edg\/(\d+)/)![1]] :
    ua.match(/Firefox\/(\d+)/) ? ['Firefox', ua.match(/Firefox\/(\d+)/)![1]] :
    ua.match(/Chrome\/(\d+)/) ? ['Chrome', ua.match(/Chrome\/(\d+)/)![1]] :
    ua.match(/Version\/(\d+).*Safari/) ? ['Safari', ua.match(/Version\/(\d+)/)![1]] : null
  return m ? `${m[0]} ${m[1]}` : 'Your browser'
}
function systemOf(ua: string) {
  if (/iPhone|iPad/.test(ua)) return 'iOS'
  if (/Android/.test(ua)) return 'Android'
  if (/Mac OS X/.test(ua)) return 'macOS'
  if (/Windows/.test(ua)) return 'Windows'
  if (/Linux/.test(ua)) return 'Linux'
  return 'Your system'
}

const EMPTY: Trait[] = [
  { label: 'Browser', value: null },
  { label: 'System', value: null },
  { label: 'Screen', value: null },
  { label: 'Language', value: null },
  { label: 'Time zone', value: null },
]

export function Fingerprint() {
  const [traits, setTraits] = React.useState<Trait[]>(EMPTY)
  React.useEffect(() => {
    const ua = navigator.userAgent
    setTraits([
      { label: 'Browser', value: browserOf(ua) },
      { label: 'System', value: systemOf(ua) },
      { label: 'Screen', value: `${window.screen.width} × ${window.screen.height}` },
      { label: 'Language', value: navigator.language },
      { label: 'Time zone', value: Intl.DateTimeFormat().resolvedOptions().timeZone },
    ])
  }, [])

  return (
    <div data-mock="fingerprint" className="hz-in hz-in-5 mx-auto mt-20 max-w-4xl">
      <p className="text-sm text-muted-foreground">What your browser told this page a moment ago</p>
      <ul className="mt-5 flex flex-wrap justify-center gap-2">
        {traits.map((t, i) => (
          <li key={t.label} className="flex items-center gap-2.5 border border-white/[0.08] bg-[#0f0f0f]/55 px-3 py-2 backdrop-blur-md">
            <span className="text-xs text-muted-foreground">{t.label}</span>
            <span className="relative text-[13px] font-medium tabular-nums text-foreground/90">
              {t.value ?? '…'}
              {t.value && (
                <span
                  aria-hidden="true"
                  className="fp-strike absolute inset-x-[-3px] top-1/2 h-px bg-foreground/80"
                  style={{ animationDelay: `${1.5 + i * 0.22}s` }}
                />
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-6 max-w-[36rem] text-[15px] leading-relaxed text-foreground/80">
        Many sites combine details like these into a fingerprint that recognises you from site to site. We don&rsquo;t
        build fingerprints, and this site sets no cookies.
      </p>
      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <LockSimple className="h-3.5 w-3.5" aria-hidden="true" /> Read by your own browser. This box sends nothing.
      </p>
    </div>
  )
}
