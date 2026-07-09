/**
 * Section 06 — Our commitments. A solid-background manifesto block (no photo,
 * so it doesn't sit adjacent to another full-bleed image). Facet: sharp,
 * scarce orange. No CTA — a full-stop moment before the closing CTA.
 */
export function Commitments() {
  return (
    <section className="border-b border-border">
      <div className="px-6 py-20 sm:py-28">
        <p className="font-mono text-xs text-muted-foreground">05 · Commitments</p>
        <h2 className="sr-only">Our commitments</h2>
        <div className="mt-6 max-w-3xl space-y-6 text-2xl font-light leading-relaxed text-foreground sm:text-3xl">
          <p>
            We don’t buy carbon offsets. We don’t plant trees for PR. We don’t claim “carbon
            neutral” — that word has been drained of meaning by companies that bought it.
          </p>
          <p>
            We run small. We run on one of the world’s cleanest grids. We show every number. And
            when the numbers get worse, we’ll tell you that too.
          </p>
          <p className="font-medium text-foreground">That’s the deal.</p>
        </div>
      </div>
    </section>
  )
}
