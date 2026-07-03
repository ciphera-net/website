import { cipheraIcon } from '@/lib/images'

export function CaptchaMockup() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <div className="border border-border bg-card px-6 py-5 space-y-4">
        {/* Captcha widget */}
        <div className="border border-border bg-muted px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-7 h-7 border-2 border-muted-foreground bg-transparent" />
            <span className="text-sm font-medium text-foreground">I am human</span>
          </div>
          <div className="flex items-center gap-2.5 border-l border-border pl-4">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-muted-foreground leading-tight">Secured by</span>
              <span className="text-sm font-bold text-foreground leading-tight">Ciphera</span>
            </div>
            <img src={cipheraIcon} alt="Ciphera" className="w-8 h-8 object-contain" />
          </div>
        </div>


        {/* Activity log */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Recent verifications</p>
          <div className="border border-border bg-card divide-y divide-border">
            {[
              { status: 'verified', ip: '192.168.1.***', time: '12ms', action: 'login' },
              { status: 'verified', ip: '10.0.0.***', time: '34ms', action: 'signup' },
              { status: 'blocked', ip: '45.33.32.***', time: '8ms', action: 'upload' },
              { status: 'verified', ip: '172.16.0.***', time: '21ms', action: 'login' },
            ].map((entry, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 ${entry.status === 'verified' ? 'bg-muted-foreground' : 'bg-primary'}`} />
                  <span className="text-[10px] text-muted-foreground font-mono">{entry.ip}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground">{entry.action}</span>
                  <span className="text-[10px] text-muted-foreground">{entry.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code snippet */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Integration</p>
          <div className="bg-background border border-border p-3 font-mono text-[10px] leading-relaxed">
            <div className="text-muted-foreground">{'// Add to any form'}</div>
            <div>
              <span className="text-primary">{'import'}</span>
              <span className="text-foreground">{' { '}</span>
              <span className="text-foreground">Captcha</span>
              <span className="text-foreground">{' } '}</span>
              <span className="text-primary">from</span>
              <span className="text-foreground">{" '@ciphera/captcha'"}</span>
            </div>
            <div className="mt-1.5">
              <span className="text-muted-foreground">{'<'}</span>
              <span className="text-foreground">Captcha</span>
              <span className="text-foreground">{' siteKey'}</span>
              <span className="text-muted-foreground">{'='}</span>
              <span className="text-foreground">{'"sk_..."'}</span>
              <span className="text-foreground">{' onVerify'}</span>
              <span className="text-muted-foreground">{'={'}</span>
              <span className="text-foreground">fn</span>
              <span className="text-muted-foreground">{'} />'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
          <span>No cookies. No cross-site tracking.</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-primary" />
            All systems operational
          </span>
        </div>
      </div>
    </div>
  )
}
