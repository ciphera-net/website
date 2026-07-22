import { cipheraIcon } from '@/lib/images'
import { MacWindow } from '@/components/ui/mac-window'

// Relay is backend transactional-email infra with no product UI, so this is a
// representative email it would send. Wrapped in the macOS window for visual
// consistency with the other product mockups.
export function RelayMockup() {
  return (
    <MacWindow>
      <div className="space-y-4 bg-[#0a0a0a] px-6 py-5" aria-hidden="true">
        {/* Email header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">From</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs font-medium text-foreground">Ciphera</span>
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
        <div className="space-y-4 border border-border bg-background p-5">
          <div className="flex items-center justify-center gap-2.5 pb-2">
            <img src={cipheraIcon} alt="Ciphera" className="h-6 w-6 object-contain" />
            <span className="text-sm font-bold text-foreground">Ciphera</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Suspicious sign-in blocked</h3>
          </div>
          <div className="space-y-2.5">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              We blocked a <span className="font-medium text-foreground">suspicious</span> sign-in attempt to your account.
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Multiple failed sign-in attempts were detected. Your account has been temporarily locked until Mar 09, 2026 at 04:45 +0000.
            </p>
          </div>
          <button tabIndex={-1} className="cursor-default bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground">
            Reset password
          </button>
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            If you didn&apos;t try to sign in, no action is needed. The attempt was blocked.
          </p>
          <div className="border-t border-border pt-3">
            <p className="text-center text-[9px] text-muted-foreground">Built for privacy</p>
          </div>
        </div>
      </div>
    </MacWindow>
  )
}
