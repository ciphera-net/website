'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon } from '@ciphera-net/ui'

interface TocItem {
  id: string
  text: string
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Parse h2 tags from HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const h2s = doc.querySelectorAll('h2')
    const items: TocItem[] = []

    h2s.forEach((h2, i) => {
      const text = h2.textContent?.trim() || ''
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      items.push({ id, text })
    })

    setHeadings(items)

    // Add IDs to actual h2 elements in the DOM
    const articleH2s = document.querySelectorAll('.prose h2')
    articleH2s.forEach((h2, i) => {
      if (items[i]) {
        h2.id = items[i].id
      }
    })
  }, [content])

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -70% 0px' }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 3) return null

  return (
    <nav className="mb-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-6 py-4 text-left rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
      >
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
          Table of Contents
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ol className="px-6 pt-2 pb-5 space-y-1.5">
          {headings.map((heading, i) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={() => setActiveId(heading.id)}
                className={`block text-sm py-1 transition-colors duration-200 ${
                  activeId === heading.id
                    ? 'text-brand-orange font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-orange'
                }`}
              >
                {i + 1}. {heading.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  )
}
