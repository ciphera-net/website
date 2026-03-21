'use client'

export function EmailAuthMockup() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 px-6 py-5 shadow-2xl space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-white">Email Authentication</h3>
        </div>

        {/* Sender info */}
        <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] text-neutral-400 flex-shrink-0">From:</span>
            <span className="text-xs font-medium text-white truncate">noreply@auth.ciphera.net</span>
          </div>
          <span className="flex-shrink-0 ml-3 px-2.5 py-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 rounded-xl">
            Authenticated
          </span>
        </div>

        {/* Authentication results */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-medium text-neutral-300">Authentication results</label>
          <div className="space-y-2">
            {[
              { protocol: 'TLS 1.3', description: 'Encrypted in transit' },
              { protocol: 'DKIM', description: 'Signed by auth.ciphera.net' },
              { protocol: 'SPF', description: 'Authorized sender IP' },
              { protocol: 'DMARC', description: 'Policy: reject (strict)' },
            ].map((item) => (
              <div
                key={item.protocol}
                className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className="text-xs font-semibold text-white flex-shrink-0">{item.protocol}</span>
                  <span className="text-[11px] text-neutral-400 truncate">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery info */}
        <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
          <span className="text-[11px] text-neutral-400">Delivered in 1.2s</span>
          <span className="text-[11px] text-neutral-500 font-mono">relay.ciphera.net</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-medium text-neutral-300">All checks passed</span>
        </div>
      </div>
    </div>
  )
}
