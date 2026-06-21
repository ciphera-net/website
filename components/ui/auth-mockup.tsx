'use client'

import { Lock, Eye } from '@phosphor-icons/react'
import { cipheraIcon } from '@/lib/images'

export function AuthMockup() {
  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      {/* Card */}
      <div className="rounded-xl border border-white/[0.08] bg-neutral-900 px-8 py-6">
        {/* Header */}
        <div className="text-center mb-5">
          <h3 className="text-lg font-bold text-white">Create Ciphera ID</h3>
          <p className="text-xs text-neutral-400 mt-0.5">One account for all Ciphera services</p>
        </div>

        {/* Form fields */}
        <div className="space-y-3">
          {/* Email */}
          <div>
            <label className="text-xs font-medium text-white mb-1 block">Email address</label>
            <div className="rounded-md border border-white/[0.08] bg-neutral-800/50 px-3 py-2">
              <span className="text-neutral-500 text-xs">you@example.com</span>
            </div>
          </div>

          {/* Display name */}
          <div>
            <label className="text-xs font-medium text-white mb-1 block">Display name</label>
            <div className="rounded-md border border-white/[0.08] bg-neutral-800/50 px-3 py-2">
              <span className="text-neutral-500 text-xs">How you&apos;d like to be called</span>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-white mb-1 block">
              Password <span className="text-brand-orange">(Required)</span>
            </label>
            <div className="rounded-md border border-white/[0.08] bg-neutral-800/50 px-3 py-2 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span className="text-neutral-500 text-xs flex-1">Minimum 12 characters</span>
              <Eye className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            </div>
          </div>

          {/* Captcha */}
          <div className="rounded-md border border-white/[0.08] bg-neutral-800/50 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-white/20 bg-transparent" />
              <span className="text-xs text-white">I am human</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-white/[0.08] pl-3 ml-1">
              <span className="text-[9px] text-neutral-500 leading-tight">Secured by</span>
              <img src={cipheraIcon} alt="Ciphera" className="w-5 h-5 object-contain" />
              <span className="text-[11px] font-semibold text-white">Ciphera</span>
            </div>
          </div>

          {/* Submit button */}
          <button className="w-full rounded-lg bg-brand-orange py-2.5 text-xs font-semibold text-white cursor-default">
            Create account
          </button>

          {/* Sign in link */}
          <p className="text-center text-xs text-neutral-400">
            Already have an account? <span className="text-white font-semibold">Sign in</span>
          </p>
        </div>
      </div>
    </div>
  )
}
