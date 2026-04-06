'use client'

import { relayIcon, pulseIcon } from '@/lib/images'

export function OAuthAppsMockup() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 px-6 py-6 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-white mb-0.5">Your Apps</h3>
          <p className="text-xs text-neutral-400">Access your secure services</p>
        </div>

        {/* App cards grid */}
        <div className="flex flex-wrap justify-center gap-3">
          {/* Relay */}
          <div className="flex flex-col items-center p-5 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:border-neutral-600 w-[130px] transition-all">
            <div className="w-12 h-12 mb-3 flex items-center justify-center bg-neutral-800 rounded-xl">
              <img src={relayIcon.src} alt="Relay" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-sm font-bold text-white mb-0.5">Relay</span>
            <span className="text-[10px] text-neutral-400 text-center">Email infrastructure</span>
          </div>

          {/* Pulse */}
          <div className="flex flex-col items-center p-5 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:border-neutral-600 w-[130px] transition-all">
            <div className="w-12 h-12 mb-3 flex items-center justify-center bg-neutral-800 rounded-xl">
              <img src={pulseIcon.src} alt="Pulse" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-sm font-bold text-white mb-0.5">Pulse</span>
            <span className="text-[10px] text-neutral-400 text-center">Traffic analytics</span>
          </div>

          {/* Organizations */}
          <div className="flex flex-col items-center p-5 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:border-neutral-600 w-[130px] transition-all">
            <div className="w-12 h-12 mb-3 flex items-center justify-center bg-neutral-800 rounded-xl">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white mb-0.5">Organizations</span>
            <span className="text-[10px] text-neutral-400 text-center">Create and manage teams</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-neutral-500 mt-5">
          One account for all Ciphera services
        </p>
      </div>
    </div>
  )
}
