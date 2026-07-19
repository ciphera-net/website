'use client'

import { useState } from 'react'
import { PlusIcon } from '@ciphera-net/facet'

export interface FAQAccordionItem {
  q: string
  a: string
}

/**
 * The house FAQ accordion — extracted from the homepage FAQ so every FAQ
 * surface on the site renders identically (hard rule, 19-07-2026): numbered
 * mono index, bordered rows, plus-icon rotation, grid-rows reveal.
 *
 * `startIndex` lets a parent with multiple groups (the homepage) keep its
 * continuous numbering; standalone consumers (blog posts) start at 01.
 */
export default function FAQAccordion({ items, startIndex = 0, idPrefix = 'faq' }: {
  items: FAQAccordionItem[]
  startIndex?: number
  idPrefix?: string
}) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="border border-border">
      {items.map((item, i) => {
        const n = String(startIndex + i + 1).padStart(2, '0')
        const isOpen = openId === n
        const answerId = `${idPrefix}-answer-${n}`
        return (
          <div key={n} className="border-b border-border last:border-b-0">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => setOpenId(isOpen ? null : n)}
              className="flex w-full items-center gap-5 px-5 py-4 text-left transition-colors duration-150 motion-reduce:transition-none hover:bg-accent"
            >
              <span className="font-mono text-xs tabular-nums text-muted-foreground">{n}</span>
              <span className="flex-1 text-sm font-medium text-foreground">{item.q}</span>
              <PlusIcon
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
              />
            </button>

            <div
              id={answerId}
              className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pl-[60px] text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
