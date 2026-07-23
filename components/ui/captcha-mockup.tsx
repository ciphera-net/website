'use client'

import { useState } from 'react'
import { Captcha } from '@ciphera-net/facet'
import { env } from '@/lib/env'
import { MacWindow } from '@/components/ui/mac-window'

// NOT a mockup: the real Ciphera Captcha proof-of-work widget (same one the
// contact form and signup use), embedded so visitors can actually solve it —
// with the real challenge/response it produces shown underneath.
export function CaptchaMockup() {
  const [id, setId] = useState('')
  const [solution, setSolution] = useState('')
  const [token, setToken] = useState('')
  const verified = Boolean(token)

  return (
    <MacWindow>
      <div className="space-y-5 bg-[#0a0a0a] p-6 sm:p-7">
        <p className="font-mono text-xs text-muted-foreground">
          Try it — this is the real widget, not a screenshot.
        </p>

        <Captcha
          onVerify={(challengeId: string, sol: string, tok?: string) => {
            setId(challengeId)
            setSolution(sol)
            setToken(tok || '')
          }}
          apiUrl={env.NEXT_PUBLIC_CAPTCHA_API_URL}
          action="marketing-demo"
        />

        {/* The real challenge / response it just produced */}
        <dl className="space-y-2 border-t border-white/10 pt-4 font-mono text-[11px] leading-relaxed">
          <DataRow label="challenge_id" value={id} />
          <DataRow label="pow_solution" value={solution} />
          <DataRow label="verify_token" value={token ? `${token.slice(0, 22)}…` : ''} />
          <div className="flex items-center justify-between gap-4 pt-1">
            <dt className="text-muted-foreground">status</dt>
            <dd className={verified ? 'text-[#28c840]' : 'text-muted-foreground'}>
              {verified ? '● verified — no cookies, no tracking' : '○ awaiting proof-of-work'}
            </dd>
          </div>
        </dl>
      </div>
    </MacWindow>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate text-foreground/80">{value || '—'}</dd>
    </div>
  )
}
