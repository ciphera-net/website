'use client'

import { cipheraIcon } from '@/lib/images'

export function CaptchaMockup() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-neutral-900/80 px-6 py-5 shadow-2xl space-y-4">
        {/* Captcha widget */}
        <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-7 h-7 rounded border-2 border-neutral-500 bg-transparent" />
            <span className="text-sm font-medium text-white">I am human</span>
          </div>
          <div className="flex items-center gap-2.5 border-l border-neutral-700 pl-4">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-neutral-500 leading-tight">Secured by</span>
              <span className="text-sm font-bold text-white leading-tight">Ciphera</span>
            </div>
            <img src={cipheraIcon.src} alt="Ciphera" className="w-8 h-8 object-contain" />
          </div>
        </div>


        {/* Activity log */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-neutral-300">Recent verifications</p>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 divide-y divide-neutral-800">
            {[
              { status: 'verified', ip: '192.168.1.***', time: '12ms', action: 'login' },
              { status: 'verified', ip: '10.0.0.***', time: '34ms', action: 'signup' },
              { status: 'blocked', ip: '45.33.32.***', time: '8ms', action: 'upload' },
              { status: 'verified', ip: '172.16.0.***', time: '21ms', action: 'login' },
            ].map((entry, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${entry.status === 'verified' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-[10px] text-neutral-400 font-mono">{entry.ip}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-neutral-500">{entry.action}</span>
                  <span className="text-[10px] text-neutral-400">{entry.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code snippet */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-neutral-300">Integration</p>
          <div className="rounded-lg bg-neutral-950 border border-neutral-800 p-3 font-mono text-[10px] leading-relaxed">
            <div className="text-neutral-500">{'// Add to any form'}</div>
            <div>
              <span className="text-brand-orange">{'import'}</span>
              <span className="text-white">{' { '}</span>
              <span className="text-green-400">Captcha</span>
              <span className="text-white">{' } '}</span>
              <span className="text-brand-orange">from</span>
              <span className="text-amber-300">{" '@ciphera/captcha'"}</span>
            </div>
            <div className="mt-1.5">
              <span className="text-neutral-500">{'<'}</span>
              <span className="text-blue-400">Captcha</span>
              <span className="text-purple-400">{' siteKey'}</span>
              <span className="text-neutral-500">{'='}</span>
              <span className="text-amber-300">{'"sk_..."'}</span>
              <span className="text-purple-400">{' onVerify'}</span>
              <span className="text-neutral-500">{'={'}</span>
              <span className="text-white">fn</span>
              <span className="text-neutral-500">{'} />'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
          <span>No tracking. No fingerprinting.</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            All systems operational
          </span>
        </div>
      </div>
    </div>
  )
}
