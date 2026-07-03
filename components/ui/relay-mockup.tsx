import { cipheraIcon } from '@/lib/images'

export function RelayMockup() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="border border-border bg-card px-6 py-5 space-y-4">
        {/* Email header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">From</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-foreground font-medium">Ciphera</span>
                <span className="text-[10px] text-muted-foreground">{'<noreply@id.ciphera.net>'}</span>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">Mar 9</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">To</span>
            <span className="text-xs text-foreground">you@email.com</span>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Email body */}
        <div className="border border-border bg-background p-5 space-y-4">
          {/* Logo + brand */}
          <div className="flex items-center gap-2.5 justify-center pb-2">
            <img src={cipheraIcon} alt="Ciphera" className="w-6 h-6 object-contain" />
            <span className="text-sm font-bold text-foreground">Ciphera</span>
          </div>

          {/* Subject */}
          <div>
            <h3 className="text-sm font-bold text-foreground">Suspicious sign-in blocked</h3>
          </div>

          {/* Body text */}
          <div className="space-y-2.5">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              We blocked a <span className="font-medium text-foreground">suspicious</span> sign-in attempt to your account.
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Multiple failed sign-in attempts were detected. Your account has been temporarily locked until Mar 09, 2026 at 04:45 +0000.
            </p>
          </div>

          {/* CTA button */}
          <button className="bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground cursor-default">
            Reset password
          </button>

          {/* Disclaimer */}
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            If you didn&apos;t try to sign in, no action is needed. The attempt was blocked.
          </p>

          {/* Footer */}
          <div className="border-t border-border pt-3">
            <p className="text-[9px] text-muted-foreground text-center">Built for privacy</p>
          </div>
        </div>

      </div>
    </div>
  )
}
