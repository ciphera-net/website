'use client'

export function PuzzleMockup() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 px-6 py-5 shadow-2xl space-y-3">
        {/* Header */}
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium text-white">Verify you&apos;re human</h3>
          <p className="text-[10px] text-neutral-400">Drag the piece to complete the puzzle</p>
        </div>

        {/* Puzzle area */}
        <div className="relative w-full h-[180px] rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
          {/* Abstract SVG background */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 440 180"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1a2e" />
                <stop offset="100%" stopColor="#16213e" />
              </linearGradient>
              <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.2" />
              </linearGradient>
              {/* Puzzle piece clip path with tab on right side */}
              <clipPath id="puzzle-piece-clip">
                <path d="M0,0 H38 V16 C38,16 44,18 44,24 C44,30 38,32 38,32 V48 H0 Z" />
              </clipPath>
              {/* Cutout mask — reveals everything except the puzzle hole */}
              <mask id="cutout-mask">
                <rect width="440" height="180" fill="white" />
                <path d="M0,0 H38 V16 C38,16 44,18 44,24 C44,30 38,32 38,32 V48 H0 Z" fill="black" transform="translate(240, 52)" />
              </mask>
            </defs>

            {/* Base */}
            <rect width="440" height="180" fill="url(#bg-grad)" />

            {/* Abstract shapes */}
            <rect x="20" y="20" width="120" height="80" rx="16" fill="url(#grad-orange)" />
            <rect x="300" y="90" width="130" height="70" rx="14" fill="url(#grad-purple)" />
            <circle cx="200" cy="40" r="50" fill="url(#grad-blue)" />
            <circle cx="380" cy="40" r="35" fill="url(#grad-orange)" opacity="0.5" />
            <rect x="80" y="110" width="160" height="60" rx="12" fill="url(#grad-purple)" opacity="0.4" />
            <circle cx="100" cy="140" r="30" fill="url(#grad-blue)" opacity="0.3" />
            <rect x="260" y="20" width="80" height="50" rx="10" fill="url(#grad-orange)" opacity="0.35" />

            {/* Apply the cutout mask to darken the hole area */}
            <g mask="url(#cutout-mask)">
              <rect width="440" height="180" fill="transparent" />
            </g>

            {/* Puzzle piece cutout (empty hole) */}
            <path
              d="M0,0 H38 V16 C38,16 44,18 44,24 C44,30 38,32 38,32 V48 H0 Z"
              transform="translate(240, 52)"
              fill="rgba(0,0,0,0.5)"
              stroke="white"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              strokeOpacity="0.5"
            />

            {/* Draggable puzzle piece (filled, offset to the left) */}
            <g transform="translate(140, 58)">
              <g clipPath="url(#puzzle-piece-clip)">
                {/* Replicate a portion of the background pattern inside the piece */}
                <rect width="48" height="48" fill="#1a1a2e" />
                <rect x="-100" y="-38" width="120" height="80" rx="16" fill="url(#grad-orange)" />
                <circle cx="60" cy="-18" r="50" fill="url(#grad-blue)" />
                <rect x="-60" y="10" width="160" height="60" rx="12" fill="url(#grad-purple)" opacity="0.4" />
                <rect x="20" y="-32" width="80" height="50" rx="10" fill="url(#grad-orange)" opacity="0.35" />
              </g>
              {/* Piece border */}
              <path
                d="M0,0 H38 V16 C38,16 44,18 44,24 C44,30 38,32 38,32 V48 H0 Z"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeOpacity="0.7"
              />
              {/* Subtle shadow on the piece */}
              <path
                d="M0,0 H38 V16 C38,16 44,18 44,24 C44,30 38,32 38,32 V48 H0 Z"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeOpacity="0.05"
              />
            </g>
          </svg>
        </div>

        {/* Slide-to-complete bar */}
        <div className="relative w-full h-9 rounded-xl border border-neutral-800 bg-neutral-900 flex items-center">
          {/* Track fill */}
          <div className="absolute left-0 top-0 bottom-0 w-[15%] rounded-xl bg-brand-orange/10" />
          {/* Drag handle */}
          <div className="relative z-10 ml-1 w-7 h-7 rounded-lg bg-brand-orange flex items-center justify-center shadow-md shadow-brand-orange/20">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          {/* Label */}
          <span className="absolute inset-0 flex items-center justify-center text-[10px] text-neutral-500 pointer-events-none select-none">
            Slide to complete
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          <svg className="w-3 h-3 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-[10px] text-neutral-500">Secured by <span className="font-medium text-neutral-400">Ciphera</span></span>
        </div>
      </div>
    </div>
  )
}
