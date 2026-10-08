/**
 * The tracker `<script>` tag code visual from `app/products/pulse/page.tsx`'s
 * "script" `feature-split` — extracted so the WEB-28 `code-pulse-script-tag` visual
 * key (build task §2, contract §3 "Code snippets") can inject the EXACT same markup
 * into a CMS-rendered page, byte for byte, rather than a second hand-copy that could
 * drift.
 *
 * 🔴 `src="https://js.ciphera.net/script.js"` IS THE CANONICAL LOADER, and this is a
 * COPY-ABLE value, not decoration (see the inline note this file inherits from the
 * coded page) — never silently diverge from pulse-website's own copy of this snippet.
 */
export function PulseScriptTagCode() {
  return (
    <div className="w-full max-w-md min-w-0">
      <div className="border border-border bg-background p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-muted-foreground/30" />
          <div className="w-2 h-2 bg-muted-foreground/30" />
          <div className="w-2 h-2 bg-muted-foreground/30" />
          <span className="text-[10px] text-muted-foreground ml-2 font-mono">index.html</span>
        </div>
        <pre className="font-mono text-[11px] leading-relaxed overflow-x-auto">
          <code>
            <span className="text-muted-foreground">{'<!-- Add before </head> -->'}</span>
            {'\n'}
            <span className="text-muted-foreground">{'<'}</span>
            <span className="text-foreground">{'script'}</span>
            {'\n'}
            <span className="text-foreground">{'  defer'}</span>
            {'\n'}
            <span className="text-foreground">{'  data-domain'}</span>
            <span className="text-muted-foreground">{'="'}</span>
            <span className="text-primary">{'yoursite.com'}</span>
            <span className="text-muted-foreground">{'"'}</span>
            {'\n'}
            <span className="text-foreground">{'  src'}</span>
            <span className="text-muted-foreground">{'="'}</span>
            <span className="text-primary">{'https://js.ciphera.net/script.js'}</span>
            <span className="text-muted-foreground">{'"'}</span>
            {'\n'}
            <span className="text-muted-foreground">{'>'}</span>
            <span className="text-muted-foreground">{'</'}</span>
            <span className="text-foreground">{'script'}</span>
            <span className="text-muted-foreground">{'>'}</span>
          </code>
        </pre>
        <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-3">
          <span>2.7 KB gzipped</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-primary" />
            Non-blocking, async
          </span>
        </div>
      </div>
    </div>
  )
}
