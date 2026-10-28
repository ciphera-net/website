/**
 * The frame and header of /sustainability's core section: home/Section.tsx's border, gutters and rhythm, and its
 * eyebrow, title and lead, class for class. The lead arrives with the view (receipt.ts) and is the same in every state.
 */
import type { ReactNode } from 'react'
import { CORE } from './content'

export function CoreFrame({ children }: { children: ReactNode }) {
  return (
    <section
      id={CORE.id}
      data-r12-core
      aria-labelledby="sustainability-estimate-title"
      className="scroll-mt-24 border-t border-border px-6 py-24 sm:px-10 lg:py-32"
    >
      {children}
    </section>
  )
}

export function CoreHeader({ lead }: { lead: string }) {
  return (
    <>
      <p className="text-sm text-muted-foreground">{CORE.eyebrow}</p>
      <h2
        id="sustainability-estimate-title"
        className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl"
      >
        {CORE.title}
      </h2>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lead}</p>
    </>
  )
}
