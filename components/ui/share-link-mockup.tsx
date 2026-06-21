'use client'

export function ShareLinkMockup() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-neutral-900 px-6 py-5 space-y-3">
        {/* Success header */}
        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/15 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-white">File encrypted &amp; uploaded</h3>
        </div>

        {/* Share link box */}
        <div className="flex items-center p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="flex-1 min-w-0 mr-3">
            <p className="text-xs text-neutral-300 truncate">
              https://ciphera.net/s/correct-horse-battery#k=...
            </p>
          </div>
          <button className="flex-shrink-0 p-1.5 bg-brand-orange text-white rounded-lg cursor-default">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Action buttons row */}
        <div className="grid grid-cols-3 gap-2">
          <button className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium rounded-xl border bg-brand-orange text-white border-brand-orange cursor-default">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Link
          </button>
          <button className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium rounded-xl border bg-neutral-900 text-neutral-400 border-neutral-800 cursor-default">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            QR Code
          </button>
          <button className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium rounded-xl border bg-neutral-900 text-neutral-400 border-neutral-800 cursor-default">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>

        {/* File info */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-medium text-neutral-300">File details</label>
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">File</span>
              <span className="text-[11px] text-neutral-300">Quarterly-Report.pdf (14.2 MB)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">Expires</span>
              <span className="text-[11px] text-neutral-300">In 24 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">Downloads</span>
              <span className="text-[11px] text-neutral-300">0 / 10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">Protection</span>
              <span className="text-[11px] text-neutral-300">Password + Burn after download</span>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-[10px] text-neutral-500 text-center pt-0.5">
          The encryption key is in the URL fragment — it never reaches our servers
        </p>
      </div>
    </div>
  )
}
