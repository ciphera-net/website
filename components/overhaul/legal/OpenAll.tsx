'use client'

/**
 * The folded legal pages' one control (D51): opens every section, or closes them all once every one is open (it reads
 * the sections themselves, so opening them one by one turns it into "Close all" too).
 *
 * It also opens the section a link points at, on arrival and on every later hash change, and scrolls the target into
 * view (each section's and sub-heading's scroll-mt clears the fixed header): a closed <details> would otherwise hide what
 * the link names, such as /privacy#your-rights-under-gdpr-and-fadp from the homepage, or an id inside a section.
 *
 * Without JavaScript every section still opens and closes on its own, so the button appears only once it can work.
 */
import * as React from 'react'

const SECTION = 'details[data-legal-section]'

const sections = () => Array.from(document.querySelectorAll<HTMLDetailsElement>(SECTION))

/** Opens the section holding the element the hash names, and brings that element into view. */
function openFromHash() {
  const raw = window.location.hash.slice(1)
  if (!raw) return
  let id = raw
  try {
    id = decodeURIComponent(raw)
  } catch {
    // A malformed escape: look the id up as written.
  }
  const target = document.getElementById(id)
  const section = target?.closest<HTMLDetailsElement>(SECTION)
  if (!target || !section) return
  section.open = true
  target.scrollIntoView()
}

const noSubscribe = () => () => {}

export function OpenAll() {
  // True only in the browser after hydration; the server and a page without JavaScript render no button.
  const hydrated = React.useSyncExternalStore(noSubscribe, () => true, () => false)
  const [allOpen, setAllOpen] = React.useState(false)

  React.useEffect(() => {
    // `toggle` does not bubble, but a capturing listener on the document hears every section's.
    const onToggle = (e: Event) => {
      if (e.target instanceof HTMLDetailsElement && e.target.matches(SECTION)) {
        const all = sections()
        setAllOpen(all.length > 0 && all.every((d) => d.open))
      }
    }
    document.addEventListener('toggle', onToggle, true)
    window.addEventListener('hashchange', openFromHash)
    openFromHash()
    return () => {
      document.removeEventListener('toggle', onToggle, true)
      window.removeEventListener('hashchange', openFromHash)
    }
  }, [])

  if (!hydrated) return null

  const toggleAll = () => {
    const next = !allOpen
    for (const d of sections()) d.open = next
    setAllOpen(next)
  }

  return (
    <button
      type="button"
      onClick={toggleAll}
      className="text-sm text-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-foreground"
    >
      {allOpen ? 'Close all' : 'Open all'}
    </button>
  )
}
