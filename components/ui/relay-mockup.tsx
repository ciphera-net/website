'use client'

import { cipheraIcon } from '@/lib/images'

export function RelayMockup() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 px-6 py-5 shadow-2xl space-y-4">
        {/* Email header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500">From</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-white font-medium">Ciphera</span>
                <span className="text-[10px] text-brand-orange">{'<noreply@id.ciphera.net>'}</span>
              </div>
            </div>
            <span className="text-[10px] text-neutral-500">Mar 9</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-500">To</span>
            <span className="text-xs text-neutral-300">you@email.com</span>
          </div>
        </div>

        <div className="border-t border-neutral-800" />

        {/* Email body */}
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-5 space-y-4">
          {/* Logo + brand */}
          <div className="flex items-center gap-2.5 justify-center pb-2">
            <img src={cipheraIcon} alt="Ciphera" className="w-6 h-6 object-contain" />
            <span className="text-sm font-bold text-white">Ciphera</span>
          </div>

          {/* Subject */}
          <div>
            <h3 className="text-sm font-bold text-white">
              <span className="text-brand-orange">Suspicious</span> sign-in blocked
            </h3>
          </div>

          {/* Body text */}
          <div className="space-y-2.5">
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              We blocked a <span className="text-brand-orange font-medium">suspicious</span> sign-in attempt to your account.
            </p>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Multiple failed sign-in attempts were detected. Your account has been temporarily locked until Mar 09, 2026 at 04:45 +0000.
            </p>
          </div>

          {/* CTA button */}
          <button className="rounded-lg bg-brand-orange px-5 py-2 text-xs font-semibold text-white cursor-default">
            Reset password
          </button>

          {/* Disclaimer */}
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            If you didn&apos;t try to sign in, no action is needed. The attempt was blocked.
          </p>

          {/* Footer */}
          <div className="border-t border-neutral-800 pt-3">
            <p className="text-[9px] text-neutral-600 text-center">Built for privacy</p>
          </div>
        </div>

      </div>
    </div>
  )
}
