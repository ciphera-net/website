'use client'

export function SecurityDashboardMockup() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-neutral-900 px-6 py-5 space-y-4">
        {/* Recent Activity */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-medium text-white">Recent Activity</h3>
          <div className="space-y-1.5">
            {[
              { success: true, event: 'Signed in from Chrome on macOS', time: '2 hours ago' },
              { success: true, event: '2FA enabled', time: '3 days ago' },
              { success: false, event: 'Failed sign-in attempt', time: '5 days ago' },
              { success: true, event: 'Password changed', time: '2 weeks ago' },
            ].map((entry, i) => (
              <div
                key={i}
                className="flex items-center p-3 bg-neutral-900 border border-neutral-800 rounded-xl"
              >
                <span
                  className={`flex-shrink-0 w-2 h-2 rounded-full mr-3 ${
                    entry.success ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
                <span className="flex-1 min-w-0 text-xs font-medium text-white truncate mr-3">
                  {entry.event}
                </span>
                <span className="flex-shrink-0 text-[10px] text-neutral-400">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted Devices */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-medium text-white">Trusted Devices</h3>
          <div className="space-y-1.5">
            {/* Device 1 — Laptop */}
            <div className="flex items-center p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-orange/10 rounded-lg flex items-center justify-center mr-3 text-brand-orange">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-white truncate">Chrome on macOS</p>
                  <span className="flex-shrink-0 px-1.5 py-0.5 text-[9px] font-medium text-brand-orange bg-brand-orange/10 rounded-full">
                    This device
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400">Active now</p>
              </div>
            </div>

            {/* Device 2 — Phone */}
            <div className="flex items-center p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-orange/10 rounded-lg flex items-center justify-center mr-3 text-brand-orange">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-xs font-medium text-white truncate">Safari on iPhone</p>
                <p className="text-[10px] text-neutral-400">Last seen 3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
