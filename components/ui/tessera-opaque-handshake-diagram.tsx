import Image from 'next/image'
import { ArrowRightIcon, CheckIcon } from '@ciphera-net/facet'
import { cdnUrl } from '@/lib/cdn'

/**
 * The hand-built browser/`tessera-ts` <-> server/`tessera-go` <-> Rust-core OPAQUE
 * handshake diagram on `/products/tessera`'s `#why-opaque` section (WEB-28 build
 * task §2).
 *
 * 🔑 THE ROOT ELEMENT DELIBERATELY EXCLUDES `mt-10 max-w-xl`. The coded page's
 * original single `<div>` carried BOTH the outer spacing classes and this box's own
 * `space-y-4 border border-border bg-background p-6` — but `ContentBlock`'s
 * `diagram` device (`@ciphera-net/facet-sections`) already wraps whatever it is
 * given in its OWN fixed `<div className="mt-10 max-w-xl">`. Folding those classes
 * into this component too would either double them (two nested wrappers, both
 * carrying `mt-10 max-w-xl`) or require a second variant — instead, the page itself
 * supplies the missing outer `<div className="mt-10 max-w-xl">` around this
 * component (see `app/products/tessera/page.tsx`'s `#why-opaque` section), which is
 * byte-identical to the pre-extraction markup, and the CMS path's `ContentBlock`
 * supplies the exact same wrapper on its own. Either call site ends up with the
 * original's two-div structure; neither one doubles it.
 *
 * 🔑 Thematically related to Ciphera ID's `#zero-knowledge-auth` diagram (both
 * illustrate "password proven, never sent") but NOT byte-identical to it and
 * deliberately kept as its own component (contract §3) — see
 * `id-zero-knowledge-diagram.tsx`.
 */
export function TesseraOpaqueHandshakeDiagram() {
  return (
    <div className="space-y-4 border border-border bg-background p-6">
      {/* Client half — tessera-ts */}
      <div className="border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs text-muted-foreground">Browser</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">tessera-ts</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1 border border-border bg-background px-3 py-2">
            <p className="mb-0.5 text-[10px] text-muted-foreground">password</p>
            <p className="tracking-widest text-foreground">••••••••</p>
          </div>
          <ArrowRightIcon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-muted-foreground"
          />
          <div className="min-w-0 flex-1 border border-primary/30 bg-primary/5 px-3 py-2">
            <p className="mb-0.5 text-[10px] text-primary/70">proof</p>
            <p className="truncate font-mono text-[11px] text-primary">a7f3c8e1b9d2…</p>
          </div>
        </div>
      </div>

      {/* Transit — only the proof crosses */}
      <div className="flex items-center justify-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-1.5 border border-border bg-background px-3 py-1">
          <svg
            className="h-3 w-3 text-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="text-[10px] text-muted-foreground">
            only the proof crosses — never the password
          </span>
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Server half — tessera-go */}
      <div className="border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
              />
            </svg>
            <span className="text-xs text-muted-foreground">Server</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">tessera-go</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1 border border-primary/30 bg-primary/5 px-3 py-2">
            <p className="mb-0.5 text-[10px] text-primary/70">proof</p>
            <p className="truncate font-mono text-[11px] text-primary">a7f3c8e1b9d2…</p>
          </div>
          <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-foreground" />
          <div className="min-w-0 flex-1 border border-border bg-background px-3 py-2">
            <p className="mb-0.5 text-[10px] text-muted-foreground">stored record</p>
            <p className="truncate font-mono text-[11px] text-muted-foreground">
              9f2c4e8a…b1d7
            </p>
          </div>
        </div>
      </div>

      {/* Core — the Rust package both halves call */}
      <div className="flex items-center gap-2.5 border border-border bg-background px-4 py-3">
        <Image
          src={cdnUrl('/icons/langs/rust.png')}
          alt=""
          width={16}
          height={16}
          unoptimized
          aria-hidden="true"
          className="h-4 w-4 shrink-0 object-contain grayscale"
        />
        <p className="text-[11px] text-muted-foreground">
          tessera (Rust core) runs the OPAQUE math on both sides
        </p>
      </div>
    </div>
  )
}
