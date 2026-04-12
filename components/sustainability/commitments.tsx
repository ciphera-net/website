import { Quotes } from '@phosphor-icons/react/dist/ssr'

/**
 * Section 7 — Our commitments. Short single-column quote block.
 * No CTA, no link — a full-stop moment before the closing CTA.
 *
 * The block is wrapped in a static conic-gradient border (1px inset) to
 * give it a faint premium edge without being distracting. The rotation
 * animation was skipped on purpose — a static conic still reads as
 * "premium polish" and we didn't want to add a one-off keyframe to the
 * tailwind config for it.
 */
export function Commitments() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <div
          className="relative rounded-3xl p-[1px]"
          style={{
            background:
              'conic-gradient(from 180deg at 50% 50%, rgba(253,94,15,0.25), rgba(253,94,15,0) 25%, rgba(253,94,15,0) 60%, rgba(253,94,15,0.15) 85%, rgba(253,94,15,0.25))',
          }}
        >
          <div className="rounded-3xl bg-neutral-950 px-8 py-16 md:px-16 md:py-20 text-center">
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
    </section>
  )
}
