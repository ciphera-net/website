'use client'

export function NoTrackingMockup() {
  const trackingItems = [
    'Tracking pixels embedded',
    'Open & click tracking',
    'IP address logged',
    'Recipient profiling',
    'Third-party analytics',
  ]

  const privacyItems = [
    'No tracking pixels',
    'No open tracking',
    'No IP logging',
    'No recipient profiling',
    'No third-party sharing',
  ]

  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 px-6 py-5 shadow-2xl">
        <div className="grid grid-cols-2 gap-3">
          {/* Left card — Others */}
          <div className="rounded-xl border border-red-500/10 bg-neutral-900 p-3 space-y-3">
            <p className="text-[10px] font-medium text-neutral-500">Typical email service</p>

            <div className="space-y-2">
              {trackingItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-[11px] text-neutral-400">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-[9px] text-red-400/50 pt-1">10+ trackers per email</p>
          </div>

          {/* Right card — Ciphera Relay */}
          <div className="rounded-xl border border-brand-orange/20 bg-neutral-900 p-3 space-y-3">
            <p className="text-[10px] font-medium text-brand-orange">Ciphera Relay</p>

            <div className="space-y-2">
              {privacyItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[11px] text-neutral-400">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="text-[9px] text-green-400">Zero trackers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
