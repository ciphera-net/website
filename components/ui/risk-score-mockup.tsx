'use client'

export function RiskScoreMockup() {
  const signals = [
    { name: 'Solve Time', score: 90, color: 'bg-green-500' },
    { name: 'Method Difficulty', score: 80, color: 'bg-brand-orange' },
    { name: 'Behavioral Analysis', score: 85, color: 'bg-green-500' },
    { name: 'IP Activity', score: 80, color: 'bg-brand-orange' },
    { name: 'Request Pattern', score: 95, color: 'bg-green-500' },
  ]

  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 px-6 py-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className="text-sm font-medium text-white">Risk Assessment</h3>
        </div>

        {/* Score gauge */}
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-white">87</span>
            <span className="text-lg text-neutral-500">/100</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-500">
            Low Risk
          </span>
          {/* Score bar */}
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-brand-orange"
              style={{ width: '87%' }}
            />
          </div>
        </div>

        {/* Signal breakdown */}
        <div className="space-y-2.5">
          {signals.map((signal) => (
            <div key={signal.name} className="flex items-center gap-3">
              <span className="text-[11px] text-neutral-400 w-[120px] flex-shrink-0">{signal.name}</span>
              <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${signal.color}`}
                  style={{ width: `${signal.score}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-white w-6 text-right">{signal.score}</span>
            </div>
          ))}
        </div>

        {/* Session info */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
          <span className="text-[10px] text-neutral-500">Method: Proof-of-Work</span>
          <span className="text-[10px] text-neutral-500">Duration: 2.3s</span>
        </div>
      </div>
    </div>
  )
}
