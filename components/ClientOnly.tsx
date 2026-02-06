'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Wrapper component that only renders children on the client side
 * Prevents hydration mismatches for components with browser-only behavior
 */
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}
