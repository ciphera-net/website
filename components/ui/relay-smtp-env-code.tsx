/**
 * The SMTP `.env` code visual from `app/products/relay/page.tsx`'s "integration"
 * `feature-split` — extracted so the WEB-28 `code-relay-smtp-env` visual key (build
 * task §2, contract §3 "Code snippets") can inject the EXACT same markup into a
 * CMS-rendered page, byte for byte, rather than a second hand-copy that could drift.
 */
export function RelaySmtpEnvCode() {
  return (
    <div className="w-full max-w-md min-w-0">
      <div className="border border-border bg-background p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-muted-foreground/30" />
          <div className="w-2 h-2 bg-muted-foreground/30" />
          <div className="w-2 h-2 bg-muted-foreground/30" />
          <span className="font-mono text-[10px] text-muted-foreground ml-2">.env</span>
        </div>
        <pre className="font-mono text-[11px] leading-relaxed">
          <code>
            <span className="text-muted-foreground"># SMTP configuration</span>{'\n'}
            <span className="text-foreground">SMTP_HOST</span>
            <span className="text-muted-foreground">=</span>
            <span className="text-primary">relay.ciphera.net</span>{'\n'}
            <span className="text-foreground">SMTP_PORT</span>
            <span className="text-muted-foreground">=</span>
            <span className="text-primary">587</span>{'\n'}
            <span className="text-foreground">SMTP_USER</span>
            <span className="text-muted-foreground">=</span>
            <span className="text-primary">idnoreply</span>{'\n'}
            <span className="text-foreground">SMTP_FROM</span>
            <span className="text-muted-foreground">=</span>
            <span className="text-primary">noreply@id.ciphera.net</span>{'\n'}
            {'\n'}
            <span className="text-muted-foreground"># Per-service sender domains</span>{'\n'}
            <span className="text-muted-foreground/60"># ID    → noreply@id.ciphera.net</span>{'\n'}
            <span className="text-muted-foreground/60"># Pulse → noreply@pulse.ciphera.net</span>
          </code>
        </pre>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-3">
          <span>Standard SMTP AUTH — works with any language</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-primary" />
            STARTTLS
          </span>
        </div>
      </div>
    </div>
  )
}
