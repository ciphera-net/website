import { ArrowRightIcon } from '@ciphera-net/facet'

/**
 * The hand-built "device -> transit -> server -> database" OPAQUE flow diagram on
 * `/products/id`'s `#zero-knowledge-auth` section (WEB-28 build task §2). Extracted
 * out of the page file, alongside the other mockups/diagrams/code snippets, so the
 * coded page and the CMS-rendered path (`lib/cms/product-registries.tsx`'s
 * `VISUAL_REGISTRY`, key `diagram-id-zero-knowledge`) share one component instead of
 * the CMS path rendering an empty visual cell. Byte-for-byte identical to the markup
 * it replaced — no visual or prop changes.
 *
 * 🔑 Thematically related to Tessera's `#why-opaque` diagram (both illustrate
 * "password proven, never sent") but NOT byte-identical to it and deliberately kept
 * as its own component (contract §3) — see `tessera-opaque-handshake-diagram.tsx`.
 */
export function IdZeroKnowledgeDiagram() {
  return (
    <div className="border border-border bg-background p-6 space-y-4">
      {/* Step 1: Your device */}
      <div className="border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <span className="text-xs text-muted-foreground">Your device</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 border border-border bg-background px-3 py-2">
            <p className="text-[10px] text-muted-foreground mb-0.5">Your password</p>
            <p className="text-sm text-foreground tracking-widest">••••••••••</p>
          </div>
          <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex-1 border border-primary/30 bg-primary/5 px-3 py-2">
            <p className="text-[10px] text-primary/70 mb-0.5">Scrambled</p>
            <p className="font-mono text-[11px] text-primary truncate">a7f3c8e1b9d2...</p>
          </div>
        </div>
      </div>

      {/* Transit indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-1.5 border border-border bg-background px-3 py-1">
          <svg className="w-3 h-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <span className="text-[10px] text-muted-foreground">Encrypted in transit</span>
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Step 2: Our server */}
      <div className="border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" /></svg>
          <span className="text-xs text-muted-foreground">Our server</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 border border-primary/30 bg-primary/5 px-3 py-2">
            <p className="text-[10px] text-primary/70 mb-0.5">Received</p>
            <p className="font-mono text-[11px] text-primary truncate">a7f3c8e1b9d2...</p>
          </div>
          <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex-1 border border-border bg-background px-3 py-2">
            <p className="text-[10px] text-muted-foreground mb-0.5">Opaque record</p>
            <p className="font-mono text-[11px] text-muted-foreground truncate">9f2c4e8a…b1d7</p>
          </div>
        </div>
      </div>

      {/* Storage row */}
      <div className="flex items-center justify-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-1.5 border border-border bg-background px-3 py-1">
          <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <span className="text-[10px] text-muted-foreground">Stored in database</span>
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Database */}
      <div className="border border-border bg-background px-4 py-3 text-center">
        <p className="font-mono text-[11px] text-muted-foreground truncate">opaque credential · 9f2c4e8a…b1d7</p>
        <p className="text-[11px] text-muted-foreground mt-1">Unreadable — even to us</p>
      </div>
    </div>
  )
}
