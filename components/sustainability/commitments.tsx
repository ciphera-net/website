import { Quotes } from '@phosphor-icons/react/dist/ssr'

/**
 * Section 7 — Our commitments. Short single-column quote block.
 * No CTA, no link — a full-stop moment before the closing CTA.
 */
export function Commitments() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-3xl mx-auto px-6 text-center">
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
            We run small. We run on hydro. We show every server. And when the
            numbers get worse, we&apos;ll tell you that too.
          </p>
          <p className="text-brand-orange font-medium">That&apos;s the deal.</p>
        </div>
      </div>
    </section>
  )
}
