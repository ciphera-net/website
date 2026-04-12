import { Quotes } from '@phosphor-icons/react/dist/ssr'
import { sustainabilityHeroBg } from '@/lib/images'

/**
 * Section 7 — Our commitments. Short single-column quote block.
 * No CTA, no link — a full-stop moment before the closing CTA.
 *
 * The block is wrapped in a static conic-gradient border (1px inset) to
 * give it a faint premium edge without being distracting. The rotation
 * animation was skipped on purpose — a static conic still reads as
 * "premium polish" and we didn't want to add a one-off keyframe to the
 * tailwind config for it.
 *
 * The Swiss mountain photograph sits behind the quote with a heavy dark
 * overlay so it reads as ambient texture rather than a distinct image —
 * it's the same photo used in the hero, but the opacity treatment and
 * context make them feel like different moments.
 */
export function Commitments() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <div
          className="relative rounded-3xl p-[1px] overflow-hidden"
          style={{
            background:
              'conic-gradient(from 180deg at 50% 50%, rgba(253,94,15,0.25), rgba(253,94,15,0) 25%, rgba(253,94,15,0) 60%, rgba(253,94,15,0.15) 85%, rgba(253,94,15,0.25))',
          }}
        >
          <div className="relative rounded-3xl overflow-hidden px-8 py-16 md:px-16 md:py-20 text-center">
            {/* * Ambient mountain photo — heavily dark-overlaid so it reads
              * as texture, not a distinct image */}
            <img
              src={sustainabilityHeroBg.src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-950/90" />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-transparent to-neutral-950/60" />

            <div className="relative z-10">
              <Quotes
                weight="fill"
                className="w-12 h-12 text-brand-orange/40 mx-auto mb-6"
              />
              <hr className="w-16 mx-auto mb-8 border-t border-white/[0.08]" />

              <div className="space-y-6 text-2xl sm:text-3xl text-white/90 leading-relaxed font-light">
                <p>
                  We don&apos;t buy carbon offsets. We don&apos;t plant trees for PR.
                  We don&apos;t claim &ldquo;carbon neutral&rdquo; — that word has
                  been drained of meaning by companies that bought it.
                </p>
                <p>
                  We run small. We run on hydro. We show every number. And when the
                  numbers get worse, we&apos;ll tell you that too.
                </p>
                <p className="text-brand-orange font-medium">That&apos;s the deal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
