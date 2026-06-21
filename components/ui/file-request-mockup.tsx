'use client'

import { useState } from 'react'

export function FileRequestMockup() {
  const [expiration, setExpiration] = useState<string>('7 Days')
  const [maxUploads, setMaxUploads] = useState<string>('10')

  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-neutral-900 px-6 py-5 space-y-3">
        {/* Title field */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            Request title
          </label>
          <div className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-xs text-white">
            Q3 Financial Documents
          </div>
        </div>

        {/* Description field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-neutral-300">Description</label>
          <div className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-[11px] text-neutral-400 leading-relaxed min-h-[52px]">
            Please upload the quarterly financial reports and tax documents.
          </div>
        </div>

        {/* Expiration */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-medium text-neutral-300">Expiration</label>
          <div className="grid grid-cols-3 gap-2">
            {['1 Day', '7 Days', '30 Days'].map((option) => (
              <button
                key={option}
                onClick={() => setExpiration(option)}
                className={`px-2 py-1.5 text-[11px] font-medium rounded-xl border text-center transition-all duration-200 ${
                  expiration === option
                    ? 'bg-brand-orange text-white border-brand-orange'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-brand-orange/50 hover:bg-brand-orange/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Max uploads */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-neutral-300">Max uploads</label>
          <div className="grid grid-cols-3 gap-2">
            {['5', '10', '∞'].map((option) => (
              <button
                key={option}
                onClick={() => setMaxUploads(option)}
                className={`px-2 py-1.5 text-[11px] font-medium rounded-xl border text-center transition-all duration-200 ${
                  maxUploads === option
                    ? 'bg-brand-orange text-white border-brand-orange'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-brand-orange/50 hover:bg-brand-orange/10'
                }`}
              >
                {option === '∞' ? <span className="text-lg leading-none -mt-0.5 block">∞</span> : option}
              </button>
            ))}
          </div>
        </div>

        {/* Create Request Link button */}
        <button className="w-full py-2.5 rounded-xl bg-brand-orange text-xs font-semibold text-white cursor-default">
          Create Request Link
        </button>
      </div>
    </div>
  )
}
