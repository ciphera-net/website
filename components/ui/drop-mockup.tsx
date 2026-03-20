'use client'

import { useState } from 'react'

export function DropMockup() {
  const [expiration, setExpiration] = useState<string>('1 Day')
  const [downloadLimit, setDownloadLimit] = useState<string>('10')
  const [burnAfterDownload, setBurnAfterDownload] = useState(true)

  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 px-6 py-5 shadow-2xl space-y-3">
        {/* Selected files header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Selected files</h3>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-neutral-400">1 file</span>
            <button className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20 rounded-xl transition-colors cursor-default">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add more
            </button>
          </div>
        </div>

        {/* File item */}
        <div className="flex items-center p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="flex-shrink-0 w-8 h-8 bg-brand-orange/10 rounded-lg flex items-center justify-center mr-3 text-brand-orange">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 mr-3">
            <p className="text-xs font-medium text-white truncate">Password.csv</p>
            <p className="text-[10px] text-neutral-400">19 Bytes</p>
          </div>
          <button className="p-1.5 text-neutral-400 hover:text-red-500 rounded-full transition-all cursor-default">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Expiration */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-medium text-neutral-300">Expiration</label>
          <div className="grid grid-cols-3 gap-2">
            {['1 Hour', '1 Day', '7 Days'].map((option) => (
              <button
                key={option}
                onClick={() => setExpiration(option)}
                className={`px-2 py-1.5 text-[11px] font-medium rounded-xl border text-center transition-all duration-200 ${
                  expiration === option
                    ? 'bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-brand-orange/50 hover:bg-brand-orange/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Download limit */}
        <div className={`space-y-1.5 transition-opacity duration-200 ${burnAfterDownload ? 'opacity-50 pointer-events-none' : ''}`}>
          <label className="block text-xs font-medium text-neutral-300">Download limit</label>
          <div className="grid grid-cols-3 gap-2">
            {['10', '50', '∞'].map((option) => (
              <button
                key={option}
                onClick={() => setDownloadLimit(option)}
                className={`px-2 py-1.5 text-[11px] font-medium rounded-xl border text-center transition-all duration-200 ${
                  downloadLimit === option
                    ? 'bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-brand-orange/50 hover:bg-brand-orange/10'
                }`}
              >
                {option === '∞' ? <span className="text-lg leading-none -mt-0.5 block">∞</span> : option}
              </button>
            ))}
          </div>
        </div>

        {/* Burn after download */}
        <div
          className={`flex items-center justify-between p-3 border rounded-xl transition-all duration-200 cursor-pointer ${
            burnAfterDownload
              ? 'bg-brand-orange/10 border-brand-orange shadow-sm'
              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
          }`}
          onClick={() => setBurnAfterDownload(!burnAfterDownload)}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
              burnAfterDownload ? 'bg-brand-orange text-white' : 'bg-neutral-800 text-neutral-400'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <div className="space-y-0">
              <span className={`block text-[11px] font-medium transition-colors duration-200 ${
                burnAfterDownload ? 'text-brand-orange' : 'text-white'
              }`}>
                Burn after download
              </span>
              <span className={`block text-[9px] transition-colors duration-200 ${
                burnAfterDownload ? 'text-brand-orange/80' : 'text-neutral-400'
              }`}>
                File will be deleted after first download
              </span>
            </div>
          </div>
          {/* Toggle */}
          <div className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200 ${
            burnAfterDownload ? 'bg-brand-orange' : 'bg-neutral-700'
          }`}>
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
              burnAfterDownload ? 'translate-x-4' : 'translate-x-0'
            }`} />
          </div>
        </div>

        {/* Password protection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-neutral-300">Password protection</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="w-full pl-8 pr-9 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-xs text-neutral-500">
              Optional password
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Upload button */}
        <button className="w-full py-2.5 rounded-xl bg-brand-orange text-xs font-semibold text-white cursor-default shadow-md shadow-brand-orange/20">
          Upload &amp; Generate Link
        </button>
      </div>
    </div>
  )
}
