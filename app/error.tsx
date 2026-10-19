'use client'

import { useEffect } from 'react'
import { ErrorView } from '@/components/overhaul/notfound/ErrorView'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // * Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error)
    }
  }, [error])

  return <ErrorView digest={error.digest} onRetry={reset} />
}
