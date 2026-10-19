'use client'

import { useEffect, useRef, useState } from 'react'
import { POST } from './content'
import type { Heading } from './PostBody'

/** How far down the screen the reader is taken to be reading: a heading above this line has begun its section. */
const READING_LINE = 1 / 3
/** Where an "On this page" click lands a heading (`scroll-mt-28`, 112 px), plus a margin: the line is never above it, so a
 * click always lights the entry it jumped to. */
const LANDING_PX = 112 + 16

/**
 * "On this page" beside a post: the section being read is lit in brand orange, and an orange thumb glides along the rail
 * to sit beside it (R13, D65: option B; plan §5p).
 *
 * 🔑 ONE SECTION, THE ONE BEING READ. docs.ciphera.net (fumadocs) lights every heading visible anywhere on screen, so a
 * title entering at the BOTTOM lights up while the reader is still in the section above it (the owner's catch on the first
 * build). Here the lit section is the last heading above the reading line, a third of the way down the screen; at the very
 * end of the page, where a short last section can never reach that line, the last heading on screen takes over.
 *
 * The glide is docs': the thumb is the whole rail, `clip-path`ped to the lit entry, and the clip transitions (150 ms,
 * Tailwind's default curve, as fumadocs). When the list is taller than the rail, the lit entry is scrolled to the rail's
 * middle without moving the page.
 *
 * The rail scrolls on its own, which clips anything drawn outside its box: its links' focus rings were cut to two lines.
 * The box is 6 px wider on each side (-mx-1.5) with 6 px of padding (px-1.5), so the links sit exactly where they did
 * and the ring fits. Not ml-auto: the column (164 px at 1440) is narrower than the max width, and with a width that
 * overflows its column CSS treats an auto margin as zero, which moved the rail 6 px (measured, 18-10-2026).
 */
export function TocRail({ headings }: { headings: Heading[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const [positions, setPositions] = useState<Record<string, [number, number]>>({})
  const firstScroll = useRef(true)

  // Which section is being read, on every scroll frame.
  useEffect(() => {
    const elements = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => el !== null)
    let frame = 0
    const compute = () => {
      frame = 0
      const line = Math.max(window.innerHeight * READING_LINE, LANDING_PX)
      let current: string | null = null
      for (const el of elements) {
        if (el.getBoundingClientRect().top > line) break
        current = el.id
      }
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atEnd) {
        for (let i = elements.length - 1; i >= 0; i--) {
          if (elements[i].getBoundingClientRect().top < window.innerHeight) {
            current = elements[i].id
            break
          }
        }
      }
      setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [headings])

  // Where each entry sits on the rail, measured again whenever the list reflows (fonts, width).
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const out: Record<string, [number, number]> = {}
      for (const a of list.querySelectorAll<HTMLAnchorElement>('a[data-toc-id]')) {
        out[a.dataset.tocId!] = [a.offsetTop, a.offsetTop + a.offsetHeight]
      }
      setPositions(out)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    measure()
    return () => observer.disconnect()
  }, [headings])

  // Keep the lit entry in view inside a rail taller than the screen, without scrolling the page.
  useEffect(() => {
    const box = scrollRef.current
    const a = active ? box?.querySelector<HTMLAnchorElement>(`a[data-toc-id="${CSS.escape(active)}"]`) : null
    if (!box || !a || box.scrollHeight <= box.clientHeight) return
    const still = firstScroll.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    firstScroll.current = false
    box.scrollTo({ top: a.offsetTop - box.clientHeight / 2 + a.offsetHeight / 2, behavior: still ? 'auto' : 'smooth' })
  }, [active])

  const [top, bottom] = (active && positions[active]) || [0, 0]

  return (
    <nav aria-label={POST.contents} data-blog-toc="rail" className="hidden lg:col-start-1 lg:row-start-1 lg:block">
      <div ref={scrollRef} className="sticky top-28 -mx-1.5 max-h-[calc(100svh-9rem)] max-w-[13.75rem] overflow-y-auto overscroll-contain px-1.5 pb-4">
        <p className="text-sm text-muted-foreground">{POST.contents}</p>
        <div className="relative mt-4">
          <div
            aria-hidden="true"
            data-toc-thumb
            className="pointer-events-none absolute inset-y-0 left-0 w-px bg-brand-orange transition-[clip-path] motion-reduce:transition-none"
            style={{ clipPath: `polygon(0 ${top}px, 100% ${top}px, 100% ${bottom}px, 0 ${bottom}px)` }}
          />
          <ul ref={listRef} className="space-y-3 border-l border-border">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  data-cms
                  data-toc-id={h.id}
                  data-active={active === h.id}
                  aria-current={active === h.id ? 'location' : undefined}
                  href={`#${h.id}`}
                  className="block pl-4 text-sm leading-snug text-muted-foreground transition-colors duration-150 hover:text-foreground data-[active=true]:text-brand-orange motion-reduce:transition-none"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
