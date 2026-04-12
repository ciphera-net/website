import { Leaf, Atom, Sparkle, Check } from '@phosphor-icons/react/dist/ssr'
import { swissGridBuildingsPhoto } from '@/lib/images'

/**
 * Section 3 — Swiss grid advantage. Clones the SwissPrivacy homepage
 * component layout exactly: framed photo on the left with floating info
 * cards, narrative copy on the right.
 */
export function SwissGridBlock() {
  return (
    <section className="py-20 lg:py-32 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — framed photo with floating info cards */}
          <div className="relative flex items-center justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
              <div className="relative w-[560px] max-w-full h-[600px] rounded-3xl overflow-hidden">
                <img
                  src={swissGridBuildingsPhoto.src}
                  alt="Swiss government buildings flying Swiss flags"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2.5">
                  {[
                    { icon: Leaf, title: '60% Hydroelectric', desc: 'Alpine reservoirs' },
                    { icon: Atom, title: '30% Nuclear', desc: 'Low-carbon baseload' },
                    { icon: Sparkle, title: '~12 gCO₂e/kWh', desc: 'Swiss grid intensity' },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-xl bg-neutral-900/80 border border-white/[0.08] px-4 py-3 backdrop-blur-sm"
                    >
                      <item.icon
                        weight="duotone"
                        className="w-5 h-5 text-brand-orange shrink-0"
                      />
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

          {/* Right — copy */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              The cleanest grid in Europe, by accident of geography.
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed mb-6">
              Switzerland was burning coal until 1961. Then the Alps gave them 60% of
              their electricity for free — gravity doing the work — and uranium covered
              the rest. The result is a grid that runs at roughly 12 grams of CO₂ per
              kilowatt-hour, compared to ~400 across the EU average and ~650 in the
              United States.
            </p>
            <ul className="space-y-3">
              {[
                '60% hydro, 30% nuclear, 10% other renewables',
                '~12 gCO₂e/kWh (vs EU ~400, US ~650)',
                'Zurich & Geneva datacenters: 100% renewable contracts',
                'Zero natural gas peaker plants on the Swiss grid',
                'Source: Swiss Federal Office of Energy (BFE), annualized 2025',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-neutral-400">
                  <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" weight="bold" />
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
