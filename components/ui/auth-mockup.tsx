import { Lock, Eye } from '@phosphor-icons/react/dist/ssr'
import { cipheraIcon } from '@/lib/images'

export function AuthMockup() {
  return (
    <div className="relative w-full max-w-[500px] mx-auto" aria-hidden="true">
      {/* Card */}
      <div className="border border-border bg-card px-8 py-6">
        {/* Header */}
        <div className="text-center mb-5">
          <h3 className="text-lg font-bold text-foreground">Create Ciphera ID</h3>
          <p className="text-xs text-muted-foreground mt-0.5">One account for all Ciphera services</p>
        </div>

        {/* Form fields */}
        <div className="space-y-3">
          {/* Email */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Email address</label>
            <div className="border border-border bg-muted px-3 py-2">
              <span className="text-muted-foreground text-xs">you@example.com</span>
            </div>
          </div>

          {/* Display name */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Display name</label>
            <div className="border border-border bg-muted px-3 py-2">
              <span className="text-muted-foreground text-xs">How you&apos;d like to be called</span>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">
              Password <span className="text-muted-foreground">(Required)</span>
            </label>
            <div className="border border-border bg-muted px-3 py-2 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground text-xs flex-1">Minimum 12 characters</span>
              <Eye className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            </div>
          </div>

          {/* Captcha */}
          <div className="border border-border bg-muted px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-muted-foreground bg-transparent" />
              <span className="text-xs text-foreground">I am human</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-border pl-3 ml-1">
              <span className="text-[9px] text-muted-foreground leading-tight">Secured by</span>
              <img src={cipheraIcon} alt="Ciphera" className="w-5 h-5 object-contain" />
              <span className="text-[11px] font-semibold text-foreground">Ciphera</span>
            </div>
          </div>

          {/* Submit button */}
          <button tabIndex={-1} className="w-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground cursor-default">
            Create account
          </button>

          {/* Sign in link */}
          <p className="text-center text-xs text-muted-foreground">
            Already have an account? <span className="text-foreground font-semibold">Sign in</span>
          </p>
        </div>
      </div>
    </div>
  )
}
