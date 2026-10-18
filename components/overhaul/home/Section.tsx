/**
 * Round 2 (mock): the frame every homepage section shares. No numbered kickers: the sections are not a sequence.
 */
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

export function Section({
  id,
  eyebrow,
  title,
  lead,
  aside,
  children,
  className,
}: {
  id?: string
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  aside?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <section id={id} data-mock-section={id} className={cn('scroll-mt-24 border-t border-border px-6 py-24 sm:px-10 lg:py-32', className)}>
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="text-sm text-muted-foreground">{eyebrow}</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl">
              {title}
            </h2>
            {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lead}</p>}
          </div>
          {aside && <div className="lg:justify-self-end">{aside}</div>}
        </div>
      </Reveal>
      {children && <div className="mt-14 lg:mt-16">{children}</div>}
    </section>
  )
}
