import {
  Globe,
  Timer,
  ShieldCheck,
  Check,
} from '@phosphor-icons/react/dist/ssr'
import { swissAlpsFlagPhoto } from '@/lib/images'

export default function SwissPrivacy() {
  return (
    <section className="py-20 lg:py-32 bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative flex items-center justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
              <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08]">
                <img
                  src={swissAlpsFlagPhoto.src}
                  alt="Swiss Alps with Swiss flag"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                {/* Info cards floating at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2.5">
                  {[
                    { icon: Globe, title: 'Data residency', desc: 'Hosted in Switzerland' },
                    { icon: ShieldCheck, title: 'FADP protected', desc: 'Swiss Federal Data Protection Act' },
                    { icon: Timer, title: 'Zero-knowledge', desc: 'We can\u2019t read your data' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center gap-3 rounded-xl bg-neutral-900/80 border border-white/[0.08] px-4 py-3 backdrop-blur-sm">
                      <item.icon className="w-5 h-5 text-brand-orange shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-white">{item.title}</p>
                        <p className="text-[11px] text-neutral-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Swiss infrastructure. Swiss privacy laws.
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed mb-6">
              Every Ciphera service runs on Swiss infrastructure, protected
              by the Swiss Federal Act on Data Protection (FADP). Your files,
              your analytics, your credentials — everything stays in
              Switzerland. No exceptions.
            </p>
            <ul className="space-y-3">
              {[
                'All data processed and stored in Switzerland',
                'End-to-end encryption across all services',
                'Zero-knowledge architecture — we can\u2019t read your data',
                'GDPR and FADP compliant by design',
                'Open source clients for full transparency',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-neutral-400"
                >
                  <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
