/**
 * The hand-built "client -> server, HMAC-signed, no database" flow diagram on
 * `/products/captcha`'s `#stateless` section (WEB-28 build task §2). Extracted out of
 * the page file, alongside the four mockups and two code snippets, so the coded page
 * and the CMS-rendered path (`lib/cms/product-registries.tsx`'s `VISUAL_REGISTRY`,
 * key `diagram-captcha-stateless`) share one component instead of the CMS path
 * rendering an empty visual cell. Byte-for-byte identical to the markup it replaced —
 * no visual or prop changes.
 */
export function CaptchaStatelessDiagram() {
  return (
    <div className="border border-border bg-background p-6 space-y-4">
      {/* Step 1 */}
      <div className="border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <span className="text-xs font-medium text-foreground">Client requests challenge</span>
        </div>
        <p className="text-[10px] text-muted-foreground font-mono">POST /challenge?type=pow</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-1.5 border border-border bg-background px-3 py-1">
          <svg className="w-3 h-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          <span className="text-[10px] text-muted-foreground">HMAC-signed challenge</span>
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Step 2 */}
      <div className="border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="text-xs font-medium text-foreground">Browser solves + submits</span>
        </div>
        <p className="text-[10px] text-muted-foreground font-mono">POST /verify &#123; nonce, signature &#125;</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-1.5 border border-border bg-background px-3 py-1">
          <svg className="w-3 h-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="text-[10px] text-muted-foreground">JWT token issued</span>
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Step 3 */}
      <div className="border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" /></svg>
          <span className="text-xs font-medium text-foreground">Your backend validates</span>
        </div>
        <p className="text-[10px] text-muted-foreground font-mono">POST /validate &#123; token, action, ip &#125;</p>
      </div>

      <div className="border border-border bg-card px-4 py-2.5 text-center">
        <p className="text-[10px] text-muted-foreground">No database. No sessions. Just HMAC signatures.</p>
      </div>
    </div>
  )
}
